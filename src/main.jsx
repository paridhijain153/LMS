import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/context/AdminContext";
import { InstructorProvider } from "@/context/InstructorContext";
import { CourseProvider } from "@/context/CourseContext";
import { PaymentProvider } from "@/context/PaymentContext";
import { QuizProvider } from "@/context/QuizContext";
import { StudentProvider } from "@/context/StudentContext";
import "./styles/globals.css";
createRoot(document.getElementById("root")).render(
	<AuthProvider>
		<AdminProvider>
			<InstructorProvider>
				<CourseProvider>
					<PaymentProvider>
						<QuizProvider>
							<StudentProvider>
								<App />
							</StudentProvider>
						</QuizProvider>
					</PaymentProvider>
				</CourseProvider>
			</InstructorProvider>
		</AdminProvider>
	</AuthProvider>,
);
