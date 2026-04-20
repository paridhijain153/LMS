import { Link, useParams } from "react-router-dom";
import { Play, Star, Clock, Users, Award, Download, CheckCircle2, Circle, ArrowLeft, Heart } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { courses } from "@/data/mockData";
import { buildLessonKey, getCourseCurriculum } from "@/data/courseCurriculum";
import { useCourse } from "@/context/CourseContext";
import { useStudent } from "@/context/StudentContext";
import "@/styles/pages/course-page.css";

const CoursePage = () => {
    const { id } = useParams();
    const course = courses.find((c) => c.id === id) ?? courses[0];
    const curriculum = getCourseCurriculum(course.id);
    const { enrolledCourses } = useCourse();
    const { wishlistCourseIds, toggleWishlist, getCourseProgress, completedLessonKeysByCourse } = useStudent();

    const isEnrolled = enrolledCourses.some((enrolledCourse) => enrolledCourse.id === course.id);
    const isWishlisted = wishlistCourseIds.includes(course.id);
    const progress = getCourseProgress(course.id);
    const completedSet = new Set(completedLessonKeysByCourse[course.id] ?? []);

    return (<div className="course-page">
      <header className="course-page-nav">
        <div className="course-page-nav__inner container">
          <div className="course-page-nav__left">
            <Button variant="ghost" size="icon" asChild><Link to="/student-dashboard"><ArrowLeft /></Link></Button>
            <Logo />
          </div>
          {isEnrolled ? (<Button variant="hero" asChild><Link to={`/learn/${course.id}`}>Go to learning</Link></Button>) : (<Button variant="hero" asChild><Link to={`/payment?courseId=${course.id}`}>Pay & Enroll</Link></Button>)}
        </div>
      </header>

      <div className="course-page-body container">
        {/* Main */}
        <div className="course-main">
          {/* Video player */}
          <div className="video-player">
            <img src={course.thumbnail} alt="" className="video-player__thumb"/>
            <button className="video-player__play-btn-wrap">
              <span className="video-player__play-btn">
                <Play />
              </span>
            </button>
          </div>

          <div className="course-meta">
            <Badge>{course.category}</Badge>
            <h1 className="course-meta__title">{course.title}</h1>
            <p className="course-meta__desc">Master the modern web stack with hands-on projects, real-world patterns, and lifetime access to all updates.</p>

            <div className="course-meta__stats">
              <span className="course-meta__stat course-meta__stat--rating">
                <Star /><strong style={{ color: "var(--foreground)" }}>{course.rating}</strong> rating
              </span>
              <span className="course-meta__stat">
                <Users /> {course.students?.toLocaleString()} students
              </span>
              <span className="course-meta__stat">
                <Clock /> {course.duration} of content
              </span>
            </div>

            <div className="instructor-box">
              <Avatar style={{ width: "3rem", height: "3rem" }}>
                <AvatarFallback className="avatar__fallback--gradient">SM</AvatarFallback>
              </Avatar>
              <div>
                <div className="instructor-box__title">Instructor</div>
                <div className="instructor-box__name">{course.instructor}</div>
              </div>
            </div>
          </div>

          {/* Curriculum */}
          <div className="curriculum-card">
            <h2 className="curriculum-card__title">Course curriculum</h2>
            <Accordion type="single" collapsible defaultValue="0" style={{ width: "100%" }}>
              {curriculum.map((m, i) => (<AccordionItem key={i} value={String(i)}>
                  <AccordionTrigger>
                    <div className="lesson-module-header">
                      <span className="lesson-module-num">{i + 1}</span>
                      <span>{m.title}</span>
                      <span className="lesson-module-count">· {m.lessons.length} lessons</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul style={{ listStyle: "none" }}>
                      {m.lessons.map((l, j) => (<li key={j} className="lesson-item">
                          <div className="lesson-item__left">
                            {completedSet.has(buildLessonKey(m.id, l.id))
                    ? <CheckCircle2 className="icon--done"/>
                    : <Circle className="icon--play"/>}
                            <span>{l.title}</span>
                          </div>
                          <span className="lesson-item__duration">{l.duration}</span>
                        </li>))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>))}
            </Accordion>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="course-sidebar">
          <div className="course-sidebar__card">
            <div className="course-price-row">
              <span className="course-price-main text-gradient">${course.price}</span>
              <span className="course-price-original">$99</span>
            </div>
            {isEnrolled ? (<Button variant="hero" style={{ width: "100%", marginTop: "1rem" }} size="lg" asChild>
                <Link to={`/learn/${course.id}`}>Start learning</Link>
              </Button>) : (<Button variant="hero" style={{ width: "100%", marginTop: "1rem" }} size="lg" asChild>
                <Link to={`/payment?courseId=${course.id}`}>Pay & Enroll</Link>
              </Button>)}
            <Button variant={isWishlisted ? "secondary" : "outline"} style={{ width: "100%", marginTop: "0.5rem" }} onClick={() => toggleWishlist(course.id)}><Heart /> {isWishlisted ? "Wishlisted" : "Add to wishlist"}</Button>

            <div className="course-includes">
              {[[Award, "Lifetime access"], [CheckCircle2, "Certificate of completion"], [Download, "Downloadable resources"], [Users, "Community support"]].map(([Icon, t]) => (<div key={t} className="course-includes__item">
                  <Icon /> {t}
                </div>))}
            </div>
          </div>

          <div className="course-sidebar__card course-progress-card">
            <h3 className="course-progress-card__title">Your progress</h3>
            <div className="course-progress-row">
              <span className="course-progress-row__label">Track your completion</span>
              <span className="course-progress-row__value">{progress}%</span>
            </div>
            <Progress value={progress} className="progress-root--md"/>
          </div>
        </aside>
      </div>
    </div>);
};
export default CoursePage;
