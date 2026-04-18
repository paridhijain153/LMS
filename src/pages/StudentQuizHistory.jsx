import { useMemo } from "react";
import { Link } from "react-router-dom";
import { History } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { QuizCard } from "@/components/QuizCard";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/context/QuizContext";
import "@/styles/pages/dashboard.css";
import "@/styles/pages/quiz.css";

export default function StudentQuizHistory() {
  const { quizzes, currentUserSubmissions } = useQuiz();

  const attemptedQuizzes = useMemo(() => {
    return quizzes
      .filter((quiz) => Boolean(currentUserSubmissions[quiz.id]))
      .sort((a, b) => {
        const first = new Date(currentUserSubmissions[a.id].submittedAt).getTime();
        const second = new Date(currentUserSubmissions[b.id].submittedAt).getTime();
        return second - first;
      });
  }, [quizzes, currentUserSubmissions]);

  return (
    <DashboardLayout role="student">
      <TopBar
        title="Quiz History"
        subtitle="Track all your attempted quizzes and scores."
        showSearch={false}
      />

      <div className="dashboard-content">
        <section className="quiz-history-summary">
          <div>
            <h2 className="dash-section-title" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <History /> Attempts overview
            </h2>
            <p className="dash-section-sub">Total attempted quizzes: {attemptedQuizzes.length}</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/student-dashboard">Back to dashboard</Link>
          </Button>
        </section>

        {attemptedQuizzes.length > 0 ? (
          <section className="quiz-history-grid">
            {attemptedQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                submission={currentUserSubmissions[quiz.id]}
              />
            ))}
          </section>
        ) : (
          <section className="student-empty-state">
            <h3>No attempted quizzes yet</h3>
            <p>Complete a quiz from your dashboard to see score history here.</p>
            <Button asChild>
              <Link to="/student-dashboard">Back to dashboard</Link>
            </Button>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
