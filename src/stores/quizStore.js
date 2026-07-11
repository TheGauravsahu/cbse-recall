import { create } from 'zustand';

export const useQuizStore = create((set, get) => ({
  // State
  subjectId: null,
  chapterId: null,
  questions: [],
  currentQuestionIndex: 0,
  selectedOption: null,
  isCorrect: null, // null | true | false
  answers: {}, // questionId -> selectedOption
  timeTaken: 0,
  isPaused: false,
  quizActive: false,
  lives: 5,
  incorrectQuestions: [], // List of question IDs answered wrong
  phase: "rules", // "rules" | "active" | "explained" | "finished"
  
  // Actions
  startQuiz: (subjectId, chapterId, questionsList, initialLives = 5) => {
    // Randomize options for each question
    const preparedQuestions = questionsList.map(q => {
      const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
      return {
        ...q,
        options: shuffledOptions
      };
    });
    
    set({
      subjectId,
      chapterId,
      questions: preparedQuestions,
      currentQuestionIndex: 0,
      selectedOption: null,
      isCorrect: null,
      answers: {},
      timeTaken: 0,
      isPaused: false,
      quizActive: true,
      lives: initialLives,
      incorrectQuestions: [],
      phase: "active"
    });
  },
  
  selectOption: (option) => {
    // Only select if not already checked
    if (get().phase !== "active") return;
    set({ selectedOption: option });
  },
  
  checkAnswer: () => {
    const { questions, currentQuestionIndex, selectedOption, answers, incorrectQuestions, lives } = get();
    if (selectedOption === null || get().phase !== "active") return null;
    
    const currentQuestion = questions[currentQuestionIndex];
    const correct = currentQuestion.correctAnswer === selectedOption;
    
    const nextAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    const nextIncorrect = correct 
      ? incorrectQuestions 
      : [...incorrectQuestions, currentQuestion.id];
      
    const nextLives = correct ? lives : Math.max(0, lives - 1);
    
    set({
      isCorrect: correct,
      answers: nextAnswers,
      incorrectQuestions: nextIncorrect,
      lives: nextLives,
      phase: "explained"
    });
    
    return correct;
  },
  
  nextQuestion: () => {
    const { currentQuestionIndex, questions, lives } = get();
    
    // Check if lives run out
    if (lives <= 0) {
      set({ phase: "finished" });
      return;
    }
    
    if (currentQuestionIndex + 1 >= questions.length) {
      set({ phase: "finished" });
    } else {
      set({
        currentQuestionIndex: currentQuestionIndex + 1,
        selectedOption: null,
        isCorrect: null,
        phase: "active"
      });
    }
  },
  
  skipQuestion: () => {
    const { currentQuestionIndex, questions, answers } = get();
    const currentQuestion = questions[currentQuestionIndex];
    
    const nextAnswers = { ...answers, [currentQuestion.id]: "__skipped__" };
    
    set({
      answers: nextAnswers,
      selectedOption: null,
      isCorrect: null,
    });
    
    if (currentQuestionIndex + 1 >= questions.length) {
      set({ phase: "finished" });
    } else {
      set({
        currentQuestionIndex: currentQuestionIndex + 1,
        phase: "active"
      });
    }
  },
  
  pauseQuiz: () => set({ isPaused: true }),
  resumeQuiz: () => set({ isPaused: false }),
  incrementTime: () => set((state) => ({ 
    timeTaken: state.isPaused || state.phase === "finished" ? state.timeTaken : state.timeTaken + 1 
  })),
  
  endQuiz: () => set({
    quizActive: false,
    phase: "rules"
  }),
  
  resetQuiz: () => {
    const { subjectId, chapterId, questions } = get();
    if (subjectId && chapterId && questions.length > 0) {
      get().startQuiz(subjectId, chapterId, questions);
    }
  }
}));
