import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { courses } from "@/data/mockData";
import "@/styles/components/quiz-card.css";

function getCourseTitle(courseId) {
  const course = courses.find((item) => item.id === courseId);
  return course?.title || "Course";
}

export function QuizCard({ quiz, submission }) {
  return (
    <article className="quiz-card">
      <div className="quiz-card__header">
        <Badge variant="secondary">{getCourseTitle(quiz.courseId)}</Badge>
        {submission ? (
          <span className="quiz-card__status quiz-card__status--completed">
            <CheckCircle2 /> Attempted
          </span>
        ) : (
          <span className="quiz-card__status">
            <HelpCircle /> New
          </span>
        )}
      </div>

      <h3 className="quiz-card__title">{quiz.title}</h3>
      <p className="quiz-card__meta">By {quiz.instructorName}</p>
      <p className="quiz-card__meta">{quiz.questions.length} questions</p>

      {submission && (
        <p className="quiz-card__score">
          Score: {submission.score}/{submission.totalQuestions}
        </p>
      )}

      <div className="quiz-card__actions">
        <Button asChild size="sm">
          <Link to={`/quiz/${quiz.id}`}>
            {submission ? "View result" : "Attempt quiz"} <ArrowRight />
          </Link>
        </Button>
      </div>
    </article>
  );
}
