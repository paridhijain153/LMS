import { Link, useNavigate } from "react-router-dom";
import { Star, Clock, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCourse } from "@/context/CourseContext";
import "@/styles/components/course-card.css";
export const CourseCard = ({ course, showEnrollButton = false }) => {
    const navigate = useNavigate();
    const { isEnrolled } = useCourse();
    const enrolled = isEnrolled(course.id);

    const handleEnroll = () => {
      if (enrolled) {
        return;
      }

      navigate(`/payment?courseId=${course.id}`);
    };

    return (<article className="course-card">
      <Link to={`/course/${course.id}`} className="course-card__link">
      <div className="course-card__thumbnail">
        <img src={course.thumbnail} alt={course.title} loading="lazy"/>
        {course.category && (<Badge className="course-card__badge">{course.category}</Badge>)}
      </div>
      <div className="course-card__body">
        <h3 className="course-card__title">{course.title}</h3>
        <p className="course-card__instructor">by {course.instructor}</p>

        {course.progress !== undefined ? (<div className="course-card__progress">
            <div className="course-card__progress-header">
              <span>Progress</span>
              <span className="course-card__progress-value">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="progress-root--sm"/>
          </div>) : (<div className="course-card__meta">
            {course.rating && (<span className="course-card__meta-item course-card__meta-item--rating">
                <Star />
                {course.rating}
              </span>)}
            {course.students && (<span className="course-card__meta-item">
                <Users /> {course.students.toLocaleString()}
              </span>)}
            {course.duration && (<span className="course-card__meta-item">
                <Clock /> {course.duration}
              </span>)}
          </div>)}

        {course.price !== undefined && (<div className="course-card__price">
            <span className="course-card__price-value text-gradient">${course.price}</span>
          </div>)}
      </div>
      </Link>

      {showEnrollButton && (<div className="course-card__actions">
          <Button type="button" variant={enrolled ? "secondary" : "hero"} disabled={enrolled} onClick={handleEnroll} className="course-card__enroll-btn">
            {enrolled ? "Enrolled" : "Pay & Enroll"}
          </Button>
        </div>)}
    </article>);
};
