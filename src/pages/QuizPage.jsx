import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageState } from "@/components/PageState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuiz } from "@/context/QuizContext";
import { toast } from "@/hooks/use-toast";
import "@/styles/pages/quiz.css";

export default function QuizPage() {
  const { id } = useParams();
  const { quizzes, submitQuiz, getUserSubmission, hasSubmittedQuiz, isHydrated } = useQuiz();
  const quiz = useMemo(() => quizzes.find((item) => item.id === id), [id, quizzes]);
  const savedSubmission = getUserSubmission(id);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(savedSubmission);

  if (!isHydrated) {
    return (
      <DashboardLayout role="student">
        <div className="dashboard-content">
          <PageState
            type="loading"
            title="Loading quiz"
            description="Preparing quiz questions and your previous submissions."
          />
        </div>
      </DashboardLayout>
    );
  }

  if (!quiz) {
    return (
      <DashboardLayout role="student">
        <div className="dashboard-content">
          <PageState
            type="error"
            title="Quiz not found"
            description="This quiz does not exist anymore or has been removed."
            action={<Button asChild><Link to="/student-dashboard">Back to dashboard</Link></Button>}
          />
        </div>
      </DashboardLayout>
    );
  }

  const isLocked = hasSubmittedQuiz(quiz.id);

  const selectAnswer = (questionIndex, answer) => {
    if (isLocked) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (isLocked) {
      toast({ title: "Quiz already submitted", description: "You cannot attempt this quiz again." });
      return;
    }

    if (Object.keys(answers).length !== quiz.questions.length) {
      toast({
        title: "Incomplete quiz",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    const submission = submitQuiz(quiz.id, answers);
    if (!submission) {
      toast({
        title: "Submission failed",
        description: "Could not submit this quiz. Try again.",
        variant: "destructive",
      });
      return;
    }

    setResult(submission);
    toast({ title: "Quiz submitted", description: `You scored ${submission.score}/${submission.totalQuestions}.` });
  };

  return (
    <DashboardLayout role="student">
      <div className="dashboard-content">
        <section className="quiz-attempt-header">
          <div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/student-dashboard"><ArrowLeft /> Back to dashboard</Link>
            </Button>
            <h1 className="learning-title" style={{ marginTop: "1rem" }}>{quiz.title}</h1>
            <p className="learning-subtitle">Instructor: {quiz.instructorName}</p>
            <p className="learning-subtitle">Course ID: {quiz.courseId}</p>
          </div>
          <Badge>{quiz.questions.length} questions</Badge>
        </section>

        {result && (
          <section className="quiz-result-card">
            <h2 className="quiz-result-card__title"><CheckCircle2 /> Result</h2>
            <p className="quiz-result-card__score">
              You scored {result.score} out of {result.totalQuestions}
            </p>
            <p className="quiz-result-card__meta">
              Submitted on {new Date(result.submittedAt).toLocaleString()}
            </p>
            <p className="quiz-result-card__meta">Re-attempt is disabled for this quiz.</p>
          </section>
        )}

        <form className="quiz-attempt-form" onSubmit={onSubmit}>
          <div className="quiz-attempt-list">
            {quiz.questions.map((question, questionIndex) => (
              <article key={`${quiz.id}_question_${questionIndex}`} className="quiz-attempt-item">
                <h3>
                  Q{questionIndex + 1}. {question.question}
                </h3>

                <div className="quiz-attempt-options">
                  {question.options.map((option, optionIndex) => {
                    const inputId = `${quiz.id}_${questionIndex}_${optionIndex}`;
                    const isChecked = (isLocked ? result?.answers?.[questionIndex] : answers[questionIndex]) === option;

                    return (
                      <label key={inputId} htmlFor={inputId} className="quiz-radio-option">
                        <input
                          id={inputId}
                          type="radio"
                          name={`question_${questionIndex}`}
                          value={option}
                          checked={Boolean(isChecked)}
                          disabled={isLocked}
                          onChange={() => selectAnswer(questionIndex, option)}
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          <div className="quiz-actions-card">
            <Button type="submit" variant="hero" size="lg" disabled={isLocked}>
              {isLocked ? "Already submitted" : "Submit quiz"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
