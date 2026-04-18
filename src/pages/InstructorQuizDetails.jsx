import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BarChart3, Download, Trophy } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageState } from "@/components/PageState";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInstructor } from "@/context/InstructorContext";
import { useQuiz } from "@/context/QuizContext";
import "@/styles/pages/dashboard.css";
import "@/styles/pages/quiz.css";

function formatStudentName(userKey) {
  if (!userKey.startsWith("student_")) {
    return null;
  }

  const rawName = userKey.slice("student_".length);
  if (!rawName) {
    return "Student";
  }

  return rawName
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function escapeCsvValue(value) {
  const stringValue = String(value ?? "");
  if (!/[",\n]/.test(stringValue)) {
    return stringValue;
  }

  return `"${stringValue.replace(/"/g, '""')}"`;
}

export default function InstructorQuizDetails() {
  const { id } = useParams();
  const { quizzes, userSubmissions, isHydrated: isQuizHydrated } = useQuiz();
  const { courses, isHydrated: isInstructorHydrated } = useInstructor();

  const quiz = useMemo(() => quizzes.find((item) => item.id === id), [quizzes, id]);

  const submissions = useMemo(() => {
    if (!quiz) {
      return [];
    }

    return Object.entries(userSubmissions)
      .map(([userKey, submissionMap]) => {
        const submission = submissionMap[quiz.id];
        if (!submission) {
          return null;
        }

        const studentName = formatStudentName(userKey);
        if (!studentName) {
          return null;
        }

        const percentage = submission.totalQuestions
          ? Math.round((submission.score / submission.totalQuestions) * 100)
          : 0;

        return {
          userKey,
          studentName,
          score: submission.score,
          totalQuestions: submission.totalQuestions,
          percentage,
          submittedAt: submission.submittedAt,
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [userSubmissions, quiz]);

  const courseTitle = useMemo(() => {
    if (!quiz) {
      return "";
    }

    return courses.find((course) => course.id === quiz.courseId)?.title || "Unknown course";
  }, [courses, quiz]);

  const averageScore = useMemo(() => {
    if (submissions.length === 0) {
      return 0;
    }

    const total = submissions.reduce((sum, item) => sum + item.percentage, 0);
    return Math.round(total / submissions.length);
  }, [submissions]);

  const topScorer = useMemo(() => {
    if (submissions.length === 0) {
      return null;
    }

    return submissions.reduce((best, current) => {
      if (!best) {
        return current;
      }

      if (current.percentage > best.percentage) {
        return current;
      }

      if (current.percentage === best.percentage && current.score > best.score) {
        return current;
      }

      return best;
    }, null);
  }, [submissions]);

  if (!isQuizHydrated || !isInstructorHydrated) {
    return (
      <DashboardLayout role="instructor">
        <TopBar
          title="Quiz Details"
          subtitle="View student marks and submission performance."
          showSearch={false}
        />
        <div className="dashboard-content">
          <PageState
            type="loading"
            title="Loading quiz details"
            description="Preparing marks and submissions."
          />
        </div>
      </DashboardLayout>
    );
  }

  const downloadCsv = () => {
    if (submissions.length === 0) {
      return;
    }

    const header = ["Student", "Marks", "Total Questions", "Percentage", "Submitted At"];
    const rows = submissions.map((submission) => [
      submission.studentName,
      submission.score,
      submission.totalQuestions,
      `${submission.percentage}%`,
      new Date(submission.submittedAt).toLocaleString(),
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${quiz.title.replace(/\s+/g, "_").toLowerCase()}_marks.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!quiz) {
    return (
      <DashboardLayout role="instructor">
        <TopBar title="Quiz Details" subtitle="Quiz not found." showSearch={false} />
        <div className="dashboard-content">
          <PageState
            type="error"
            title="Quiz not found"
            description="This quiz may have been deleted."
            action={<Button asChild><Link to="/instructor/quizzes">Back to quizzes</Link></Button>}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="instructor">
      <TopBar
        title="Quiz Details"
        subtitle="View student marks and submission performance."
        showSearch={false}
      />

      <div className="dashboard-content">
        <section className="quiz-history-summary">
          <div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/instructor/quizzes"><ArrowLeft /> Back to quizzes</Link>
            </Button>
            <h2 className="dash-section-title" style={{ marginTop: "0.75rem" }}>{quiz.title}</h2>
            <p className="dash-section-sub">{courseTitle}</p>
            <p className="dash-section-sub">{quiz.questions.length} questions</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Badge variant="secondary">{submissions.length} submissions</Badge>
            <Badge><BarChart3 /> Avg {averageScore}%</Badge>
            {topScorer && (
              <Badge variant="secondary"><Trophy /> Top scorer: {topScorer.studentName} ({topScorer.score}/{topScorer.totalQuestions})</Badge>
            )}
          </div>
        </section>

        <section className="table-card">
          <div className="table-card__header">
            <h3 className="table-card__title">Student Marks</h3>
            <Button type="button" variant="outline" size="sm" onClick={downloadCsv} disabled={submissions.length === 0}>
              <Download /> Download CSV
            </Button>
          </div>

          {submissions.length === 0 ? (
            <PageState
              type="empty"
              title="No submissions yet"
              description="Student marks will appear here after the first submission."
            />
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Marks</th>
                    <th>Percentage</th>
                    <th>Submitted At</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={`${submission.userKey}_${submission.submittedAt}`}>
                      <td><span className="table-user-name">{submission.studentName}</span></td>
                      <td>{submission.score}/{submission.totalQuestions}</td>
                      <td>{submission.percentage}%</td>
                      <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                      <td>
                        {topScorer && topScorer.userKey === submission.userKey && topScorer.submittedAt === submission.submittedAt ? (
                          <Badge variant="secondary"><Trophy /> Top Scorer</Badge>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
