import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAnalyticsStore = create(
  persist(
    (set, get) => ({
      // Heatmap of questions answered: { "YYYY-MM-DD": count }
      practiceHeatmap: {},
      
      // Response times by subject: { "maths": [5, 12, 8], "science": [10, 4] }
      responseTimes: {},
      
      // Log of quiz accuracy values to draw weekly line charts: [ { timestamp, accuracy, subjectId } ]
      accuracyHistory: [],
      
      // Counts of questions solved by difficulty
      difficultySolves: {
        Easy: 0,
        Medium: 0,
        Hard: 0
      },
      
      logQuestionSolve: (difficulty) => set((state) => {
        const nextDifficultySolves = { ...state.difficultySolves };
        if (nextDifficultySolves[difficulty] !== undefined) {
          nextDifficultySolves[difficulty] += 1;
        } else {
          nextDifficultySolves[difficulty] = 1;
        }

        // Increment practice heatmap for today
        const todayStr = new Date().toISOString().split('T')[0];
        const nextHeatmap = { ...state.practiceHeatmap };
        nextHeatmap[todayStr] = (nextHeatmap[todayStr] || 0) + 1;

        return {
          difficultySolves: nextDifficultySolves,
          practiceHeatmap: nextHeatmap
        };
      }),
      
      logResponseTime: (subjectId, timeSpentSeconds) => set((state) => {
        const nextResponseTimes = { ...state.responseTimes };
        if (!nextResponseTimes[subjectId]) {
          nextResponseTimes[subjectId] = [];
        }
        // Limit store size to last 50 entries per subject to avoid storage creep
        nextResponseTimes[subjectId] = [...nextResponseTimes[subjectId], timeSpentSeconds].slice(-50);
        return { responseTimes: nextResponseTimes };
      }),
      
      logQuizAccuracy: (subjectId, accuracyPercent) => set((state) => ({
        // Keep last 30 quiz accuracies for graphs
        accuracyHistory: [
          ...state.accuracyHistory,
          { timestamp: Date.now(), accuracy: accuracyPercent, subjectId }
        ].slice(-30)
      })),
      
      resetAnalytics: () => set({
        practiceHeatmap: {},
        responseTimes: {},
        accuracyHistory: [],
        difficultySolves: { Easy: 0, Medium: 0, Hard: 0 }
      })
    }),
    {
      name: 'analytics-storage',
    }
  )
);
