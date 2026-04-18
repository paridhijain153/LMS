import { useMemo, useState } from "react";
import { ConfirmActionButton } from "@/components/ConfirmActionButton";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageState } from "@/components/PageState";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInstructor } from "@/context/InstructorContext";
import { toast } from "@/hooks/use-toast";
import "@/styles/pages/dashboard.css";
import "@/styles/pages/instructor-management.css";

function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function InstructorCourses() {
  const { courses, updateCourse, deleteCourse, toggleCourseStatus, isHydrated } = useInstructor();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCourseId, setEditingCourseId] = useState("");
  const [editDraft, setEditDraft] = useState({
    title: "",
    category: "",
    duration: "",
    price: "",
    status: "draft",
  });

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return courses;
    }

    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query),
    );
  }, [courses, searchQuery]);

  const onEditChange = (field) => (event) => {
    setEditDraft((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const startEditing = (course) => {
    setEditingCourseId(course.id);
    setEditDraft({
      title: course.title,
      category: course.category,
      duration: course.duration,
      price: String(course.price),
      status: course.status,
    });
  };

  const saveEdit = (courseId) => {
    if (!editDraft.title.trim()) {
      toast({
        title: "Missing title",
        description: "Course title is required.",
        variant: "destructive",
      });
      return;
    }

    updateCourse(courseId, {
      title: editDraft.title.trim(),
      category: editDraft.category.trim(),
      duration: editDraft.duration.trim(),
      price: Number(editDraft.price),
      status: editDraft.status,
    });
    setEditingCourseId("");
    toast({ title: "Course updated", description: "Course details saved." });
  };

  const removeCourse = (courseId) => {
    deleteCourse(courseId);
    toast({ title: "Course deleted", description: "Course removed from your list." });
  };

  return (
    <DashboardLayout role="instructor">
      <TopBar
        title="Your Courses"
        subtitle="Manage your created courses and publishing status."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by title or category"
      />

      <div className="dashboard-content">
        {!isHydrated ? (
          <PageState
            type="loading"
            title="Loading instructor courses"
            description="Fetching your created courses."
          />
        ) : (
        <section className="table-card">
          <div className="table-card__header">
            <h3 className="table-card__title">Courses ({filteredCourses.length})</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => {
                  const isEditing = editingCourseId === course.id;

                  return (
                    <tr key={course.id}>
                      <td>
                        {isEditing ? (
                          <Input value={editDraft.title} onChange={onEditChange("title")} />
                        ) : (
                          <span className="table-user-name">{course.title}</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <Input value={editDraft.category} onChange={onEditChange("category")} />
                        ) : (
                          course.category
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <Input value={editDraft.duration} onChange={onEditChange("duration")} />
                        ) : (
                          course.duration
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <Input type="number" value={editDraft.price} onChange={onEditChange("price")} />
                        ) : (
                          `$${course.price}`
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <select className="instructor-select" value={editDraft.status} onChange={onEditChange("status")}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                          </select>
                        ) : (
                          <span
                            className={`instructor-pill ${
                              course.status === "published"
                                ? "instructor-pill--published"
                                : "instructor-pill--draft"
                            }`}
                          >
                            {formatStatus(course.status)}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="instructor-inline-actions">
                          {isEditing ? (
                            <>
                              <Button size="sm" onClick={() => saveEdit(course.id)}>Save</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingCourseId("")}>Cancel</Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => startEditing(course)}>Edit</Button>
                              <Button size="sm" variant="outline" onClick={() => toggleCourseStatus(course.id)}>
                                {course.status === "published" ? "Move to draft" : "Publish"}
                              </Button>
                              <ConfirmActionButton
                                triggerLabel="Delete"
                                title="Delete course"
                                description={`This will permanently remove ${course.title}.`}
                                confirmLabel="Delete course"
                                onConfirm={() => removeCourse(course.id)}
                              />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredCourses.length === 0 && (
              <PageState
                type="empty"
                title="No courses found"
                description="Create a new course or adjust your search term."
              />
            )}
          </div>
        </section>
        )}
      </div>
    </DashboardLayout>
  );
}
