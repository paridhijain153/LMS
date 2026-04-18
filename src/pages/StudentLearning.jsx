import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, CirclePlay, Circle, Play } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { courses } from "@/data/mockData";
import { buildLessonKey, getCourseCurriculum } from "@/data/courseCurriculum";
import { useCourse } from "@/context/CourseContext";
import { useStudent } from "@/context/StudentContext";
import "@/styles/pages/student-features.css";

export default function StudentLearning() {
  const { id } = useParams();
  const course = useMemo(() => courses.find((item) => item.id === id) ?? courses[0], [id]);
  const curriculum = useMemo(() => getCourseCurriculum(course.id), [course.id]);
  const { enrolledCourses } = useCourse();
  const {
    completedLessonKeysByCourse,
    markLessonComplete,
    setLastLesson,
    getCourseProgress,
    getResumeLesson,
  } = useStudent();

  const isEnrolled = enrolledCourses.some((enrolledCourse) => enrolledCourse.id === course.id);
  const completedSet = useMemo(
    () => new Set(completedLessonKeysByCourse[course.id] ?? []),
    [completedLessonKeysByCourse, course.id],
  );
  const resumeLesson = getResumeLesson(course.id);
  const [activeLessonKey, setActiveLessonKey] = useState(() => {
    if (!resumeLesson) {
      return "";
    }

    return buildLessonKey(resumeLesson.module.id, resumeLesson.lesson.id);
  });

  const progress = getCourseProgress(course.id);

  const activeLesson = useMemo(() => {
    for (const module of curriculum) {
      for (const lesson of module.lessons) {
        const key = buildLessonKey(module.id, lesson.id);
        if (key === activeLessonKey) {
          return { module, lesson, key };
        }
      }
    }

    return null;
  }, [activeLessonKey, curriculum]);

  const startResumeLesson = () => {
    if (!resumeLesson) {
      return;
    }

    const lessonKey = buildLessonKey(resumeLesson.module.id, resumeLesson.lesson.id);
    setActiveLessonKey(lessonKey);
    setLastLesson(course.id, resumeLesson.module.id, resumeLesson.lesson.id);
  };

  const openLesson = (moduleId, lessonId) => {
    const lessonKey = buildLessonKey(moduleId, lessonId);
    setActiveLessonKey(lessonKey);
    setLastLesson(course.id, moduleId, lessonId);
  };

  const toggleLessonStatus = (moduleId, lessonId) => {
    const key = buildLessonKey(moduleId, lessonId);
    const completed = completedSet.has(key);
    markLessonComplete(course.id, moduleId, lessonId, !completed);
  };

  if (!isEnrolled) {
    return (
      <DashboardLayout role="student">
        <div className="dashboard-content">
          <section className="student-empty-state">
            <CirclePlay />
            <h3>You are not enrolled in this course yet</h3>
            <p>Enroll first, then come back to start learning.</p>
            <Button asChild>
              <Link to={`/course/${course.id}`}>Go to course details</Link>
            </Button>
          </section>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="dashboard-content">
        <section className="learning-header-card">
          <div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/student-dashboard"><ArrowLeft /> Back to dashboard</Link>
            </Button>
            <h1 className="learning-title">{course.title}</h1>
            <p className="learning-subtitle">Continue your lessons and track progress in real-time.</p>
          </div>

          <div className="learning-progress-wrap">
            <Badge>{progress}% complete</Badge>
            <Progress value={progress} className="progress-root--md" />
            <Button type="button" onClick={startResumeLesson}>Resume last lesson</Button>
          </div>
        </section>

        <section className="learning-grid">
          <div className="learning-video-card">
            <div className="learning-video-player">
              <Play />
              <p>Lesson video placeholder</p>
            </div>
            <div>
              <h2 className="learning-video-title">{activeLesson?.lesson.title ?? "Choose a lesson to start"}</h2>
              <p className="learning-video-meta">
                {activeLesson
                  ? `${activeLesson.module.title} • ${activeLesson.lesson.duration}`
                  : "Select a lesson from the curriculum."}
              </p>
            </div>
          </div>

          <div className="learning-curriculum-card">
            <h2 className="dash-section-title">Course curriculum</h2>
            <div className="learning-module-list">
              {curriculum.map((module, moduleIndex) => (
                <div key={module.id} className="learning-module-item">
                  <h3 className="learning-module-title">
                    Module {moduleIndex + 1}: {module.title}
                  </h3>
                  <ul className="learning-lesson-list">
                    {module.lessons.map((lesson) => {
                      const key = buildLessonKey(module.id, lesson.id);
                      const completed = completedSet.has(key);
                      const active = key === activeLessonKey;

                      return (
                        <li key={lesson.id} className={`learning-lesson-item ${active ? "learning-lesson-item--active" : ""}`}>
                          <button type="button" className="learning-lesson-main" onClick={() => openLesson(module.id, lesson.id)}>
                            {completed ? <CheckCircle2 /> : <Circle />}
                            <span>{lesson.title}</span>
                          </button>
                          <div className="learning-lesson-actions">
                            <span>{lesson.duration}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant={completed ? "secondary" : "outline"}
                              onClick={() => toggleLessonStatus(module.id, lesson.id)}
                            >
                              {completed ? "Completed" : "Mark complete"}
                            </Button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
