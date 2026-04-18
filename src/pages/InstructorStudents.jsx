import { useMemo, useState } from "react";
import { ConfirmActionButton } from "@/components/ConfirmActionButton";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageState } from "@/components/PageState";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { useInstructor } from "@/context/InstructorContext";
import { toast } from "@/hooks/use-toast";
import "@/styles/pages/dashboard.css";
import "@/styles/pages/instructor-management.css";

function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function InstructorStudents() {
  const { students, updateStudent, removeStudent, isHydrated } = useInstructor();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return students;
    }

    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.courseTitle.toLowerCase().includes(query),
    );
  }, [students, searchQuery]);

  const toggleStudentStatus = (student) => {
    const nextStatus = student.status === "active" ? "paused" : "active";
    updateStudent(student.id, { status: nextStatus });
    toast({ title: "Student updated", description: `${student.name} is now ${nextStatus}.` });
  };

  const markCompleted = (student) => {
    updateStudent(student.id, { status: "completed", progress: 100 });
    toast({ title: "Marked complete", description: `${student.name} completed the course.` });
  };

  const removeEnrollment = (student) => {
    removeStudent(student.id);
    toast({ title: "Enrollment removed", description: `${student.name} removed successfully.` });
  };

  return (
    <DashboardLayout role="instructor">
      <TopBar
        title="Enrolled Students"
        subtitle="Track learner progress and manage enrollments."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by student or course"
      />

      <div className="dashboard-content">
        {!isHydrated ? (
          <PageState
            type="loading"
            title="Loading enrollments"
            description="Fetching student progress and enrollment data."
          />
        ) : (
        <section className="table-card">
          <div className="table-card__header">
            <h3 className="table-card__title">Students ({filteredStudents.length})</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Enrolled</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="table-user-name">{student.name}</div>
                      <div className="table-user-email">{student.email}</div>
                    </td>
                    <td>{student.courseTitle}</td>
                    <td>{student.progress}%</td>
                    <td>
                      <span
                        className={`instructor-pill ${
                          student.status === "active"
                            ? "instructor-pill--active"
                            : student.status === "completed"
                              ? "instructor-pill--completed"
                              : "instructor-pill--paused"
                        }`}
                      >
                        {formatStatus(student.status)}
                      </span>
                    </td>
                    <td>{new Date(student.enrolledAt).toLocaleDateString()}</td>
                    <td>
                      <div className="instructor-inline-actions">
                        <Button size="sm" variant="outline" onClick={() => toggleStudentStatus(student)}>
                          {student.status === "active" ? "Pause" : "Activate"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => markCompleted(student)}>Complete</Button>
                        <ConfirmActionButton
                          triggerLabel="Remove"
                          title="Remove enrollment"
                          description={`Remove ${student.name} from this course enrollment list?`}
                          confirmLabel="Remove"
                          onConfirm={() => removeEnrollment(student)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <PageState
                type="empty"
                title="No students found"
                description="Try another search or publish courses to get enrollments."
              />
            )}
          </div>
        </section>
        )}
      </div>
    </DashboardLayout>
  );
}
