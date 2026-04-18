import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useInstructor } from "@/context/InstructorContext";
import { useQuiz } from "@/context/QuizContext";
import { toast } from "@/hooks/use-toast";
import "@/styles/pages/quiz.css";
import "@/styles/pages/instructor-management.css";

function createEmptyQuestion() {
  return {
    id: `q_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  };
}

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses } = useInstructor();
  const { addQuiz } = useQuiz();

  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [questions, setQuestions] = useState([createEmptyQuestion()]);

  const publishedCourses = useMemo(
    () => courses.filter((course) => course.status === "published"),
    [courses],
  );

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
  };

  const removeQuestion = (questionId) => {
    setQuestions((prev) => {
      const next = prev.filter((item) => item.id !== questionId);
      return next.length > 0 ? next : [createEmptyQuestion()];
    });
  };

  const updateQuestionText = (questionId, value) => {
    setQuestions((prev) =>
      prev.map((item) =>
        item.id === questionId
          ? {
              ...item,
              question: value,
            }
          : item,
      ),
    );
  };

  const updateQuestionOption = (questionId, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((item) => {
        if (item.id !== questionId) {
          return item;
        }

        const options = item.options.map((option, index) =>
          index === optionIndex ? value : option,
        );

        return {
          ...item,
          options,
        };
      }),
    );
  };

  const updateCorrectAnswer = (questionId, value) => {
    setQuestions((prev) =>
      prev.map((item) =>
        item.id === questionId
          ? {
              ...item,
              correctAnswer: value,
            }
          : item,
      ),
    );
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Quiz title is required.",
        variant: "destructive",
      });
      return false;
    }

    if (!courseId) {
      toast({
        title: "Select course",
        description: "Choose a course for this quiz.",
        variant: "destructive",
      });
      return false;
    }

    for (const question of questions) {
      if (!question.question.trim()) {
        toast({
          title: "Incomplete question",
          description: "Each question must have a question statement.",
          variant: "destructive",
        });
        return false;
      }

      if (question.options.some((option) => !option.trim())) {
        toast({
          title: "Incomplete options",
          description: "Every option field is required.",
          variant: "destructive",
        });
        return false;
      }

      if (!question.correctAnswer) {
        toast({
          title: "Select correct answer",
          description: "Choose the correct answer for each question.",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    addQuiz({
      title,
      courseId,
      instructorName: user?.name || "Instructor",
      questions: questions.map((question) => ({
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
      })),
    });

    toast({
      title: "Quiz created",
      description: "Your quiz is now available for enrolled students.",
    });

    navigate("/instructor/quizzes");
  };

  return (
    <DashboardLayout role="instructor">
      <TopBar
        title="Create Quiz"
        subtitle="Add quiz questions and publish to your enrolled students."
        showSearch={false}
      />

      <div className="dashboard-content">
        {publishedCourses.length === 0 ? (
          <section className="instructor-empty">
            Publish at least one course before creating quizzes.
          </section>
        ) : (
          <form className="quiz-form" onSubmit={handleSubmit}>
            <section className="instructor-card">
              <h2 className="instructor-card__title">Quiz details</h2>
              <div className="instructor-form-grid">
                <div className="form-field form-field--full">
                  <Label htmlFor="quiz-title" className="instructor-field-label">Quiz title</Label>
                  <Input
                    id="quiz-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. React Hooks Fundamentals Quiz"
                  />
                </div>
                <div className="form-field form-field--full">
                  <Label htmlFor="quiz-course" className="instructor-field-label">Assign to course</Label>
                  <select
                    id="quiz-course"
                    value={courseId}
                    className="instructor-select"
                    onChange={(event) => setCourseId(event.target.value)}
                  >
                    <option value="">Select a course</option>
                    {publishedCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section className="instructor-card">
              <div className="quiz-question-header">
                <h2 className="instructor-card__title" style={{ marginBottom: 0 }}>
                  Questions ({questions.length})
                </h2>
                <Button type="button" size="sm" variant="soft" onClick={addQuestion}>
                  <Plus /> Add question
                </Button>
              </div>

              <div className="quiz-question-list">
                {questions.map((question, index) => (
                  <article key={question.id} className="quiz-question-card">
                    <div className="quiz-question-card__header">
                      <h3>Question {index + 1}</h3>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeQuestion(question.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>

                    <div className="form-field">
                      <Label className="instructor-field-label">Question text</Label>
                      <Textarea
                        rows={3}
                        value={question.question}
                        placeholder="Type the question..."
                        onChange={(event) => updateQuestionText(question.id, event.target.value)}
                      />
                    </div>

                    <div className="quiz-options-grid">
                      {question.options.map((option, optionIndex) => (
                        <div key={`${question.id}_option_${optionIndex}`} className="form-field">
                          <Label className="instructor-field-label">Option {optionIndex + 1}</Label>
                          <Input
                            value={option}
                            placeholder={`Option ${optionIndex + 1}`}
                            onChange={(event) =>
                              updateQuestionOption(question.id, optionIndex, event.target.value)
                            }
                          />
                        </div>
                      ))}
                    </div>

                    <div className="form-field">
                      <Label className="instructor-field-label">Correct answer</Label>
                      <select
                        className="instructor-select"
                        value={question.correctAnswer}
                        onChange={(event) => updateCorrectAnswer(question.id, event.target.value)}
                      >
                        <option value="">Select correct answer</option>
                        {question.options.map((option, optionIndex) => (
                          <option key={`${question.id}_answer_${optionIndex}`} value={option}>
                            {option || `Option ${optionIndex + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="quiz-actions-card">
              <Button type="submit" variant="hero" size="lg">
                Publish quiz
              </Button>
            </section>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
