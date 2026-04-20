import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ConfirmActionButton } from "@/components/ConfirmActionButton";
import { PageState } from "@/components/PageState";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "@/hooks/use-toast";
import "@/styles/pages/dashboard.css";
import "@/styles/pages/admin-management.css";

const initialCourseForm = {
  title: "",
  category: "Development",
  instructor: "",
  duration: "12h",
  price: "29",
  students: "0",
  rating: "4.5",
  status: "draft",
};

function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function AdminCourses() {
  const { courses, addCourse, updateCourse, deleteCourse, toggleCourseStatus, isHydrated } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [newCourse, setNewCourse] = useState(initialCourseForm);
  const [editingCourseId, setEditingCourseId] = useState("");
  const [editDraft, setEditDraft] = useState(initialCourseForm);

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return courses;
    }

    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query),
    );
  }, [courses, searchQuery]);

  const onNewCourseChange = (field) => (event) => {
    setNewCourse((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onEditChange = (field) => (event) => {
    setEditDraft((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleAddCourse = (event) => {
    event.preventDefault();

    if (!newCourse.title.trim() || !newCourse.instructor.trim()) {
      toast({
        title: "Missing fields",
        description: "Title and instructor are required.",
        variant: "destructive",
      });
      return;
    }

    addCourse(newCourse);
    setNewCourse(initialCourseForm);
    toast({ title: "Course added", description: "New course has been created." });
  };

  const startEditing = (course) => {
    setEditingCourseId(course.id);
    setEditDraft({
      title: course.title,
      category: course.category,
      instructor: course.instructor,
      duration: course.duration,
      price: String(course.price),
      students: String(course.students),
      rating: String(course.rating),
      status: course.status,
    });
  };

  const saveEdit = (courseId) => {
    if (!editDraft.title.trim() || !editDraft.instructor.trim()) {
      toast({
        title: "Missing fields",
        description: "Title and instructor are required.",
        variant: "destructive",
      });
      return;
    }

    updateCourse(courseId, {
      title: editDraft.title.trim(),
      category: editDraft.category,
      instructor: editDraft.instructor.trim(),
      duration: editDraft.duration.trim(),
      price: Number(editDraft.price),
      students: Number(editDraft.students),
      rating: Number(editDraft.rating),
      status: editDraft.status,
    });

    setEditingCourseId("");
    toast({ title: "Course updated", description: "Changes have been saved." });
  };

  const removeCourse = (courseId) => {
    deleteCourse(courseId);
    toast({ title: "Course deleted", description: "Course removed from list." });
  };

  return (
    <DashboardLayout role="admin">
      <TopBar
        title="Manage Courses"
        subtitle="Edit catalog details, toggle publish status, and remove courses."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by title, instructor, or category"
      />

      <div className="dashboard-content">
        {!isHydrated ? (
          <PageState
            type="loading"
            title="Loading courses"
            description="Preparing admin course catalog."
          />
        ) : (
          <>
        <section className="admin-card">
          <h2 className="admin-card__title">Add New Course</h2>
          <form className="admin-form-grid" onSubmit={handleAddCourse}>
            <div>
              <label className="admin-field-label" htmlFor="new-course-title">Title</label>
              <Input id="new-course-title" value={newCourse.title} onChange={onNewCourseChange("title")} />
            </div>
            <div>
              <label className="admin-field-label" htmlFor="new-course-instructor">Instructor</label>
              <Input id="new-course-instructor" value={newCourse.instructor} onChange={onNewCourseChange("instructor")} />
            </div>
            <div>
              <label className="admin-field-label" htmlFor="new-course-category">Category</label>
              <Input id="new-course-category" value={newCourse.category} onChange={onNewCourseChange("category")} />
            </div>
            <div>
              <label className="admin-field-label" htmlFor="new-course-duration">Duration</label>
              <Input id="new-course-duration" value={newCourse.duration} onChange={onNewCourseChange("duration")} />
            </div>
            <div>
              <label className="admin-field-label" htmlFor="new-course-price">Price</label>
              <Input id="new-course-price" type="number" value={newCourse.price} onChange={onNewCourseChange("price")} />
            </div>
            <div>
              <label className="admin-field-label" htmlFor="new-course-status">Status</label>
              <select id="new-course-status" className="admin-select" value={newCourse.status} onChange={onNewCourseChange("status")}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="form-field--full">
              <Button type="submit">Create Course</Button>
            </div>
          </form>
        </section>

        <section className="table-card">
          <div className="table-card__header">
            <h3 className="table-card__title">Courses ({filteredCourses.length})</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Category</th>
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
                          <Input value={editDraft.instructor} onChange={onEditChange("instructor")} />
                        ) : (
                          course.instructor
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
                          <Input type="number" value={editDraft.price} onChange={onEditChange("price")} />
                        ) : (
                          `$${course.price}`
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <select className="admin-select" value={editDraft.status} onChange={onEditChange("status")}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                          </select>
                        ) : (
                          <span
                            className={`admin-table-badge ${
                              course.status === "published"
                                ? "admin-table-badge--published"
                                : "admin-table-badge--draft"
                            }`}
                          >
                            {formatStatus(course.status)}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="admin-inline-actions">
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
                                description={`This will remove ${course.title} from the admin catalog.`}
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
                description="Adjust search filters or create a new course above."
              />
            )}
          </div>
        </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
