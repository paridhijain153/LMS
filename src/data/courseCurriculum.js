export const courseCurriculumById = {
  "1": [
    {
      id: "m1",
      title: "Getting Started",
      lessons: [
        { id: "l1", title: "Welcome and course overview", duration: "5 min" },
        { id: "l2", title: "Setting up your environment", duration: "12 min" },
        { id: "l3", title: "Tools and resources", duration: "8 min" },
      ],
    },
    {
      id: "m2",
      title: "HTML and CSS Foundations",
      lessons: [
        { id: "l1", title: "Semantic HTML", duration: "18 min" },
        { id: "l2", title: "CSS layouts", duration: "24 min" },
        { id: "l3", title: "Responsive design", duration: "20 min" },
      ],
    },
    {
      id: "m3",
      title: "JavaScript Essentials",
      lessons: [
        { id: "l1", title: "Variables and data types", duration: "15 min" },
        { id: "l2", title: "Functions and scope", duration: "22 min" },
        { id: "l3", title: "DOM manipulation", duration: "30 min" },
      ],
    },
  ],
  "2": [
    {
      id: "m1",
      title: "Design Basics",
      lessons: [
        { id: "l1", title: "Visual hierarchy", duration: "14 min" },
        { id: "l2", title: "Color and typography", duration: "20 min" },
      ],
    },
    {
      id: "m2",
      title: "Figma Workflow",
      lessons: [
        { id: "l1", title: "Components and variants", duration: "25 min" },
        { id: "l2", title: "Auto layout", duration: "16 min" },
        { id: "l3", title: "Design handoff", duration: "19 min" },
      ],
    },
  ],
  "3": [
    {
      id: "m1",
      title: "Data Foundations",
      lessons: [
        { id: "l1", title: "Data types", duration: "11 min" },
        { id: "l2", title: "Statistics refresher", duration: "23 min" },
      ],
    },
    {
      id: "m2",
      title: "Machine Learning Intro",
      lessons: [
        { id: "l1", title: "Supervised learning", duration: "20 min" },
        { id: "l2", title: "Model evaluation", duration: "18 min" },
      ],
    },
  ],
  "4": [
    {
      id: "m1",
      title: "Marketing Fundamentals",
      lessons: [
        { id: "l1", title: "Audience research", duration: "10 min" },
        { id: "l2", title: "Positioning", duration: "17 min" },
      ],
    },
    {
      id: "m2",
      title: "Growth Strategy",
      lessons: [
        { id: "l1", title: "Funnels and retention", duration: "21 min" },
        { id: "l2", title: "Campaign analytics", duration: "16 min" },
      ],
    },
  ],
};

export function getCourseCurriculum(courseId) {
  return courseCurriculumById[courseId] ?? courseCurriculumById["1"];
}

export function buildLessonKey(moduleId, lessonId) {
  return `${moduleId}:${lessonId}`;
}
