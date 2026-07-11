import { useHistoryStore } from '../../stores/historyStore';
import { useAuthStore } from '../../stores/authStore';
import { subjects } from '../../data/subjects';

/**
 * Returns a recommended chapter to study based on performance and user preferences.
 * Rules:
 * 1. Recommend a chapter with accuracy < 75% in history (Weak Chapter revision).
 * 2. Recommend an un-attempted chapter in the student's favorite subject.
 * 3. Recommend any un-attempted chapter in the syllabus.
 * 4. Fallback to a default chapter (Trigonometry).
 */
export const getRecommendedChapter = () => {
  const { attempts } = useHistoryStore.getState();
  const { user } = useAuthStore.getState();
  
  // Aggregate chapter stats from history
  const chapterAccuracies = {};
  attempts.forEach(a => {
    const key = `${a.subjectId}/${a.chapterId}`;
    if (!chapterAccuracies[key]) {
      chapterAccuracies[key] = { correct: 0, total: 0 };
    }
    chapterAccuracies[key].correct += a.score;
    chapterAccuracies[key].total += a.totalQuestions;
  });

  // 1. Check for Weak Chapters (accuracy < 75%)
  let weakestChapterKey = null;
  let lowestAccuracy = 101;

  Object.entries(chapterAccuracies).forEach(([key, stats]) => {
    const acc = (stats.correct / stats.total) * 100;
    if (acc < 75 && acc < lowestAccuracy) {
      lowestAccuracy = acc;
      weakestChapterKey = key;
    }
  });

  if (weakestChapterKey) {
    const [subId, chapId] = weakestChapterKey.split('/');
    const subDef = subjects.find(s => s.id === subId);
    const chapDef = subDef?.chapters.find(c => c.id === chapId);
    if (subDef && chapDef) {
      return {
        subjectId: subId,
        chapterId: chapId,
        chapterName: chapDef.name,
        subjectName: subDef.name,
        emoji: subDef.emoji,
        color: subDef.color,
        reason: `Your average accuracy is only ${Math.round(lowestAccuracy)}%. Re-verify identities to boost your scores!`
      };
    }
  }

  // 2. Check for un-attempted chapters in user's favorite subject
  const favSubjectId = user.favoriteSubject || 'maths';
  const favSubject = subjects.find(s => s.id === favSubjectId) || subjects[0];
  
  const unattemptedInFav = favSubject.chapters.find(ch => {
    const attempted = attempts.some(a => a.subjectId === favSubjectId && a.chapterId === ch.id);
    return !attempted;
  });

  if (unattemptedInFav) {
    return {
      subjectId: favSubject.id,
      chapterId: unattemptedInFav.id,
      chapterName: unattemptedInFav.name,
      subjectName: favSubject.name,
      emoji: favSubject.emoji,
      color: favSubject.color,
      reason: `New chapter in your favorite subject ${favSubject.name}. Start practicing today!`
    };
  }

  // 3. Check for any un-attempted chapter in the entire CBSE syllabus
  for (const sub of subjects) {
    const unattempted = sub.chapters.find(ch => {
      const attempted = attempts.some(a => a.subjectId === sub.id && a.chapterId === ch.id);
      return !attempted;
    });

    if (unattempted) {
      return {
        subjectId: sub.id,
        chapterId: unattempted.id,
        chapterName: unattempted.name,
        subjectName: sub.name,
        emoji: sub.emoji,
        color: sub.color,
        reason: `You haven't attempted this chapter yet. Learn through active recall now!`
      };
    }
  }

  // 4. Default Fallback if everything is completed/attempted
  const fallbackSub = subjects[0]; // Maths
  const fallbackChap = fallbackSub.chapters[7]; // Trigonometry (index 7 in expanded list)
  return {
    subjectId: fallbackSub.id,
    chapterId: fallbackChap.id,
    chapterName: fallbackChap.name,
    subjectName: fallbackSub.name,
    emoji: fallbackSub.emoji,
    color: fallbackSub.color,
    reason: `Time for a refresher! Practice Trigonometry to maintain your skills.`
  };
};
