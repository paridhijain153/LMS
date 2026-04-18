import course1 from "@/assets/course-1.jpg";
import course2 from "@/assets/course-2.jpg";
import course3 from "@/assets/course-3.jpg";
import course4 from "@/assets/course-4.jpg";
export const courses = [
    { id: "1", title: "Complete Web Development Bootcamp 2025", instructor: "Sarah Mitchell", thumbnail: course1, rating: 4.9, students: 12480, duration: "42h", price: 49, category: "Development" },
    { id: "2", title: "UI/UX Design Masterclass: Figma to Production", instructor: "James Carter", thumbnail: course2, rating: 4.8, students: 8312, duration: "28h", price: 39, category: "Design" },
    { id: "3", title: "Data Science & Machine Learning Foundations", instructor: "Dr. Aisha Khan", thumbnail: course3, rating: 4.9, students: 15203, duration: "56h", price: 59, category: "Data" },
    { id: "4", title: "Modern Marketing & Growth Strategies", instructor: "Marco Diaz", thumbnail: course4, rating: 4.7, students: 6042, duration: "18h", price: 29, category: "Marketing" },
];
export const categories = [
    { name: "Development", count: 1240, icon: "Code2" },
    { name: "Design", count: 820, icon: "Palette" },
    { name: "Business", count: 540, icon: "Briefcase" },
    { name: "Marketing", count: 410, icon: "TrendingUp" },
    { name: "Data Science", count: 360, icon: "BarChart3" },
    { name: "Photography", count: 280, icon: "Camera" },
    { name: "Music", count: 195, icon: "Music" },
    { name: "Languages", count: 320, icon: "Languages" },
];
export const testimonials = [
    { name: "Emily Rhodes", role: "Frontend Developer", text: "EduVibe completely changed how I learn. The instructors are world-class and the platform is a joy to use.", avatar: "ER" },
    { name: "David Park", role: "Product Designer", text: "Clean, focused, distraction-free. I finished three courses in a month and landed my dream job.", avatar: "DP" },
    { name: "Priya Sharma", role: "Data Analyst", text: "The progress tracking and bite-sized lessons keep me motivated every single day.", avatar: "PS" },
];
