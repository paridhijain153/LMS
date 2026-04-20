import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const QUIZ_STORAGE_KEY = "lms_quiz_state";
const QuizContext = createContext(undefined);

function getDefaultQuizState() {
  return {
    quizzes: [],
    userSubmissions: {},
  };
}

function normalizeQuestion(question) {
  return {
    question: question.question.trim(),
    options: question.options.map((option) => option.trim()),
    correctAnswer: question.correctAnswer,
  };
}

function buildUserKey(user) {
  if (!user?.name) {
    return "guest";
  }

  const safeName = user.name.trim().toLowerCase().replace(/\s+/g, "_");
  const role = user.role || "unknown";
  return `${role}_${safeName}`;
}

function loadQuizState() {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) {
      return getDefaultQuizState();
    }

    const parsed = JSON.parse(raw);
    return {
      ...getDefaultQuizState(),
      ...parsed,
    };
  } catch (error) {
    console.error("Failed to load quiz state", error);
    localStorage.removeItem(QUIZ_STORAGE_KEY);
    return getDefaultQuizState();
  }
}

export function QuizProvider({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState(loadQuizState);
  const userKey = useMemo(() => buildUserKey(user), [user]);

  useEffect(() => {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addQuiz = (quiz) => {
    const normalizedQuiz = {
      id: quiz.id || `quiz_${Date.now()}`,
      title: quiz.title.trim(),
      courseId: quiz.courseId,
      instructorName: quiz.instructorName?.trim() || "Instructor",
      questions: quiz.questions.map(normalizeQuestion),
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      quizzes: [normalizedQuiz, ...prev.quizzes],
    }));

    return normalizedQuiz;
  };

  const updateQuiz = (quizId, updates) => {
    setState((prev) => ({
      ...prev,
      quizzes: prev.quizzes.map((quiz) => {
        if (quiz.id !== quizId) {
          return quiz;
        }

        const nextQuiz = {
          ...quiz,
          ...updates,
        };

        if (updates.title !== undefined) {
          nextQuiz.title = updates.title.trim();
        }

        if (updates.instructorName !== undefined) {
          nextQuiz.instructorName = updates.instructorName.trim();
        }

        if (updates.questions !== undefined) {
          nextQuiz.questions = updates.questions.map(normalizeQuestion);
        }

        return nextQuiz;
      }),
    }));
  };

  const deleteQuiz = (quizId) => {
    setState((prev) => {
      const nextUserSubmissions = Object.fromEntries(
        Object.entries(prev.userSubmissions).map(([submissionUserKey, submissionMap]) => {
          const { [quizId]: _removedQuiz, ...remaining } = submissionMap;
          return [submissionUserKey, remaining];
        }),
      );

      return {
        ...prev,
        quizzes: prev.quizzes.filter((quiz) => quiz.id !== quizId),
        userSubmissions: nextUserSubmissions,
      };
    });
  };

  const submitQuiz = (quizId, answers) => {
    const quiz = state.quizzes.find((item) => item.id === quizId);
    if (!quiz) {
      return null;
    }

    const existingSubmission = state.userSubmissions[userKey]?.[quizId];
    if (existingSubmission) {
      return existingSubmission;
    }

    const score = quiz.questions.reduce((total, question, index) => {
      const selectedAnswer = answers[index];
      return selectedAnswer === question.correctAnswer ? total + 1 : total;
    }, 0);

    const submission = {
      quizId,
      score,
      totalQuestions: quiz.questions.length,
      answers,
      submittedAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      userSubmissions: {
        ...prev.userSubmissions,
        [userKey]: {
          ...(prev.userSubmissions[userKey] || {}),
          [quizId]: submission,
        },
      },
    }));

    return submission;
  };

  const currentUserSubmissions = useMemo(
    () => state.userSubmissions[userKey] || {},
    [state.userSubmissions, userKey],
  );

  const getUserSubmission = (quizId) => currentUserSubmissions[quizId] || null;
  const hasSubmittedQuiz = (quizId) => Boolean(currentUserSubmissions[quizId]);

  const value = useMemo(
    () => ({
      quizzes: state.quizzes,
      userSubmissions: state.userSubmissions,
      currentUserSubmissions,
      addQuiz,
      updateQuiz,
      deleteQuiz,
      submitQuiz,
      getUserSubmission,
      hasSubmittedQuiz,
      isHydrated: true,
    }),
    [state.quizzes, state.userSubmissions, currentUserSubmissions],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used inside QuizProvider");
  }

  return context;
}
