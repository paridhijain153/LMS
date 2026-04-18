import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";
import { Login, Signup } from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCourses from "./pages/StudentCourses";
import MyCourses from "./pages/MyCourses";
import StudentWishlist from "./pages/StudentWishlist";
import StudentActivity from "./pages/StudentActivity";
import StudentPayments from "./pages/StudentPayments";
import StudentLearning from "./pages/StudentLearning";
import StudentQuizHistory from "./pages/StudentQuizHistory";
import Settings from "./pages/Settings";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorCourses from "./pages/InstructorCourses";
import InstructorStudents from "./pages/InstructorStudents";
import InstructorEarnings from "./pages/InstructorEarnings";
import CreateQuiz from "./pages/CreateQuiz";
import InstructorQuizzes from "./pages/InstructorQuizzes";
import InstructorQuizDetails from "./pages/InstructorQuizDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminCourses from "./pages/AdminCourses";
import AdminAnalytics from "./pages/AdminAnalytics";
import CoursePage from "./pages/CoursePage";
import CreateCourse from "./pages/CreateCourse";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import QuizPage from "./pages/QuizPage";
const queryClient = new QueryClient();
const App = () => (<QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}/>
          <Route path="/auth" element={<Login />}/>
          <Route path="/login" element={<Navigate to="/auth" replace />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>}/>
          <Route path="/student-dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>}/>
          <Route path="/student/courses" element={<ProtectedRoute role="student"><StudentCourses /></ProtectedRoute>}/>
          <Route path="/student/my-courses" element={<ProtectedRoute role="student"><MyCourses /></ProtectedRoute>}/>
          <Route path="/student/wishlist" element={<ProtectedRoute role="student"><StudentWishlist /></ProtectedRoute>}/>
          <Route path="/student/activity" element={<ProtectedRoute role="student"><StudentActivity /></ProtectedRoute>}/>
          <Route path="/student/payments" element={<ProtectedRoute role="student"><StudentPayments /></ProtectedRoute>}/>
          <Route path="/student/quizzes/history" element={<ProtectedRoute role="student"><StudentQuizHistory /></ProtectedRoute>}/>
          <Route path="/learn/:id" element={<ProtectedRoute role="student"><StudentLearning /></ProtectedRoute>}/>
          <Route path="/quiz/:id" element={<ProtectedRoute role="student"><QuizPage /></ProtectedRoute>}/>
          <Route path="/instructor-dashboard" element={<ProtectedRoute role="instructor"><InstructorDashboard /></ProtectedRoute>}/>
          <Route path="/instructor/quizzes" element={<ProtectedRoute role="instructor"><InstructorQuizzes /></ProtectedRoute>}/>
          <Route path="/instructor/quizzes/:id" element={<ProtectedRoute role="instructor"><InstructorQuizDetails /></ProtectedRoute>}/>
          <Route path="/instructor/courses" element={<ProtectedRoute role="instructor"><InstructorCourses /></ProtectedRoute>}/>
          <Route path="/instructor/students" element={<ProtectedRoute role="instructor"><InstructorStudents /></ProtectedRoute>}/>
          <Route path="/instructor/earnings" element={<ProtectedRoute role="instructor"><InstructorEarnings /></ProtectedRoute>}/>
          <Route path="/instructor/quizzes/create" element={<ProtectedRoute role="instructor"><CreateQuiz /></ProtectedRoute>}/>
          <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}/>
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>}/>
          <Route path="/admin/courses" element={<ProtectedRoute role="admin"><AdminCourses /></ProtectedRoute>}/>
          <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AdminAnalytics /></ProtectedRoute>}/>
          <Route path="/instructor/create" element={<ProtectedRoute role="instructor"><CreateCourse /></ProtectedRoute>}/>
          <Route path="/student" element={<Navigate to="/student-dashboard" replace />}/>
          <Route path="/instructor" element={<Navigate to="/instructor-dashboard" replace />}/>
          <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />}/>
          <Route path="/course/:id" element={<CoursePage />}/>
          <Route path="/payment" element={<ProtectedRoute role="student"><Payment /></ProtectedRoute>}/>
          <Route path="/payment/success" element={<ProtectedRoute role="student"><PaymentSuccess /></ProtectedRoute>}/>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>);
export default App;
