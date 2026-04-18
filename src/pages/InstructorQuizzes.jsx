import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ConfirmActionButton } from "@/components/ConfirmActionButton";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageState } from "@/components/PageState";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useInstructor } from "@/context/InstructorContext";
import { useQuiz } from "@/context/QuizContext";
import { toast } from "@/hooks/use-toast";
import "@/styles/pages/dashboard.css";
import "@/styles/pages/instructor-management.css";
import "@/styles/pages/quiz.css";

function normalizeName(value) {
  return (value || "").trim().toLowerCase();
}

function getAttemptCount(userSubmissions, quizId) {
  return Object.values(userSubmissions).reduce((total, submissionByUser) => {
    return submissionByUser[quizId] ? total + 1 : total;
  }, 0);
}

export default function InstructorQuizzes() {
  const { user } = useAuth();
  const { courses, isHydrated: isInstructorHydrated } = useInstructor();
  const { quizzes, userSubmissions, updateQuiz, deleteQuiz, isHydrated: isQuizHydrated } = useQuiz();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingQuizId, setEditingQuizId] = useState("");
  const [editDraft, setEditDraft] = useState({
    title: "",
    courseId: "",
  });

  const myQuizzes = useMemo(() => {
    const currentName = normalizeName(user?.name);
    if (!currentName) {
      return [];
    }

    const matched = quizzes.filter(
      (quiz) => normalizeName(quiz.instructorName) === currentName,
    );

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return matched;
    }

    return matched.filter((quiz) => {
      const courseTitle = courses.find((course) => course.id === quiz.courseId)?.title || "";
      return (
        quiz.title.toLowerCase().includes(query) ||
        courseTitle.toLowerCase().includes(query)
      );
    });
  }, [quizzes, user?.name, searchQuery, courses]);

  const getCourseTitle = (courseId) => {
    return courses.find((course) => course.id === courseId)?.title || "Unknown course";
  };

  const startEditing = (quiz) => {
    setEditingQuizId(quiz.id);
    setEditDraft({
      title: quiz.title,
      courseId: quiz.courseId,
    });
  };

  const onEditChange = (field) => (event) => {
    setEditDraft((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const saveQuiz = (quizId) => {
    if (!editDraft.title.trim()) {
      toast({
        title: "Missing title",
        description: "Quiz title is required.",
        variant: "destructive",
      });
      return;
    }

    if (!editDraft.courseId) {
      toast({
        title: "Select course",
        description: "Quiz must be assigned to a course.",
        variant: "destructive",
      });
      return;
    }

    updateQuiz(quizId, {
      title: editDraft.title,
      courseId: editDraft.courseId,
    });

    setEditingQuizId("");
    toast({ title: "Quiz updated", description: "Quiz details saved successfully." });
  };

  const removeQuiz = (quizId) => {
    deleteQuiz(quizId);
    toast({ title: "Quiz deleted", description: "Quiz removed from your list." });
  };

  return (
    <DashboardLayout role="instructor">
      <TopBar
        title="Manage Quizzes"
        subtitle="Edit or delete your existing quizzes."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search quizzes by title or course"
      />

      <div className="dashboard-content">
        {!isInstructorHydrated || !isQuizHydrated ? (
          <PageState
            type="loading"
            title="Loading quizzes"
            description="Preparing your quiz management workspace."
          />
        ) : (
        <section className="table-card">
          <div className="table-card__header">
            <h3 className="table-card__title">My Quizzes ({myQuizzes.length})</h3>
            <Button asChild>
              <Link to="/instructor/quizzes/create">Create new quiz</Link>
            </Button>
          </div>

          {myQuizzes.length === 0 ? (
            <PageState
              type="empty"
              title="No quizzes found"
              description="Create your first quiz to get started."
            />
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Course</th>
                    <th>Questions</th>
                    <th>Attempts</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myQuizzes.map((quiz) => {
                    const isEditing = editingQuizId === quiz.id;
                    return (
                      <tr key={quiz.id}>
                        <td>
                          {isEditing ? (
                            <Input value={editDraft.title} onChange={onEditChange("title")} />
                          ) : (
                            <span className="table-user-name">{quiz.title}</span>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <select className="instructor-select" value={editDraft.courseId} onChange={onEditChange("courseId")}>
                              <option value="">Select course</option>
                              {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                  {course.title}
                                </option>
                              ))}
                            </select>
                          ) : (
                            getCourseTitle(quiz.courseId)
                          )}
                        </td>
                        <td>{quiz.questions.length}</td>
                        <td>{getAttemptCount(userSubmissions, quiz.id)}</td>
                        <td>{new Date(quiz.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="instructor-inline-actions">
                            {isEditing ? (
                              <>
                                <Button size="sm" onClick={() => saveQuiz(quiz.id)}>Save</Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingQuizId("")}>Cancel</Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="soft" asChild>
                                  <Link to={`/instructor/quizzes/${quiz.id}`}>Details</Link>
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => startEditing(quiz)}>Edit</Button>
                                <ConfirmActionButton
                                  triggerLabel="Delete"
                                  title="Delete quiz"
                                  description={`This will permanently remove ${quiz.title}.`}
                                  confirmLabel="Delete quiz"
                                  onConfirm={() => removeQuiz(quiz.id)}
                                />
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
        )}
      </div>
    </DashboardLayout>
  );
}
