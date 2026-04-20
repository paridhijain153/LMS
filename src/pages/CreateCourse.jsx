import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Plus, Trash2, GripVertical, FileVideo, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useInstructor } from "@/context/InstructorContext";
import "@/styles/pages/create-course.css";
import "@/styles/pages/instructor-management.css";

function createEmptyLesson() {
  return {
    id: `lesson_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    title: "",
    duration: "10 min",
  };
}

function createEmptyModule() {
  return {
    id: `module_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    title: "",
    lessons: [createEmptyLesson()],
  };
}

export default function CreateCourse() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addCourse } = useInstructor();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Development",
    price: "49",
    duration: "20h",
  });

  const [modules, setModules] = useState([createEmptyModule()]);
  const [resources, setResources] = useState([]);

  const totalLessons = useMemo(
    () => modules.reduce((sum, module) => sum + module.lessons.length, 0),
    [modules],
  );

  const updateField = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const addModule = () => {
    setModules((prev) => [...prev, createEmptyModule()]);
  };

  const removeModule = (moduleId) => {
    setModules((prev) => {
      const next = prev.filter((module) => module.id !== moduleId);
      return next.length > 0 ? next : [createEmptyModule()];
    });
  };

  const updateModuleTitle = (moduleId, nextTitle) => {
    setModules((prev) =>
      prev.map((module) => (module.id === moduleId ? { ...module, title: nextTitle } : module)),
    );
  };

  const addLesson = (moduleId) => {
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId
          ? { ...module, lessons: [...module.lessons, createEmptyLesson()] }
          : module,
      ),
    );
  };

  const removeLesson = (moduleId, lessonId) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id !== moduleId) {
          return module;
        }

        const nextLessons = module.lessons.filter((lesson) => lesson.id !== lessonId);
        return {
          ...module,
          lessons: nextLessons.length > 0 ? nextLessons : [createEmptyLesson()],
        };
      }),
    );
  };

  const updateLesson = (moduleId, lessonId, field, value) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id !== moduleId) {
          return module;
        }

        return {
          ...module,
          lessons: module.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, [field]: value } : lesson,
          ),
        };
      }),
    );
  };

  const handleAddResourceFiles = (type) => (event) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const mapped = files.map((file) => ({
      id: `res_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
      type,
      name: file.name,
    }));

    setResources((prev) => [...prev, ...mapped]);
    event.target.value = "";
  };

  const removeResource = (resourceId) => {
    setResources((prev) => prev.filter((resource) => resource.id !== resourceId));
  };

  const validate = () => {
    if (!formData.title.trim()) {
      toast({ title: "Missing title", description: "Course title is required.", variant: "destructive" });
      return false;
    }

    if (!formData.description.trim()) {
      toast({ title: "Missing description", description: "Course description is required.", variant: "destructive" });
      return false;
    }

    for (const module of modules) {
      if (!module.title.trim()) {
        toast({ title: "Missing module title", description: "Each module needs a title.", variant: "destructive" });
        return false;
      }

      for (const lesson of module.lessons) {
        if (!lesson.title.trim()) {
          toast({ title: "Missing lesson title", description: "Each lesson needs a title.", variant: "destructive" });
          return false;
        }
      }
    }

    return true;
  };

  const submitCourse = (status) => (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    addCourse({
      title: formData.title,
      instructor: user?.name ?? "Instructor",
      category: formData.category,
      duration: formData.duration,
      price: formData.price,
      status,
      modules,
      resources,
    });

    toast({
      title: status === "published" ? "Course published" : "Draft saved",
      description:
        status === "published"
          ? "Your course is now visible to students."
          : "Your draft has been saved in your course list.",
    });

    setTimeout(() => navigate("/instructor/courses"), 600);
  };

  return (
    <DashboardLayout role="instructor">
      <TopBar title="Create new course" subtitle="Build modules, lessons, and upload learning resources." showSearch={false} />

      <form className="create-course-form" onSubmit={submitCourse("published")}>
        <div className="create-course-grid">
          <div className="create-course-main">
            <div className="form-card">
              <h3 className="form-card__title">Course details</h3>
              <div className="form-stack">
                <div className="form-field">
                  <Label htmlFor="title">Course title</Label>
                  <Input id="title" value={formData.title} onChange={updateField("title")} placeholder="e.g. Complete React Mastery" />
                </div>
                <div className="form-field">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea id="desc" rows={5} value={formData.description} onChange={updateField("description")} placeholder="What will students learn in this course?" />
                </div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <Label htmlFor="cat">Category</Label>
                    <select id="cat" value={formData.category} onChange={updateField("category")} className="instructor-select">
                      {[
                        "Development",
                        "Design",
                        "Business",
                        "Marketing",
                        "Data Science",
                      ].map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input id="price" type="number" value={formData.price} onChange={updateField("price")} />
                  </div>
                </div>
                <div className="form-field">
                  <Label htmlFor="duration">Estimated duration</Label>
                  <Input id="duration" value={formData.duration} onChange={updateField("duration")} placeholder="e.g. 18h" />
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="curriculum-header">
                <h3 className="curriculum-header__title">Curriculum ({totalLessons} lessons)</h3>
                <Button type="button" variant="soft" size="sm" onClick={addModule}><Plus /> Add module</Button>
              </div>

              <div className="module-list">
                {modules.map((module, moduleIndex) => (
                  <div key={module.id} className="module-item">
                    <div className="module-item__header">
                      <GripVertical />
                      <span className="module-item__label">Module {moduleIndex + 1}</span>
                      <Input
                        value={module.title}
                        onChange={(event) => updateModuleTitle(module.id, event.target.value)}
                        placeholder="Module title"
                        style={{ flex: 1 }}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeModule(module.id)}><Trash2 /></Button>
                    </div>

                    <div className="module-item__topics">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="topic-item">
                          <span className="topic-item__dot" />
                          <Input
                            value={lesson.title}
                            onChange={(event) => updateLesson(module.id, lesson.id, "title", event.target.value)}
                            placeholder={`Lesson ${lessonIndex + 1}`}
                            style={{ flex: 1 }}
                          />
                          <Input
                            value={lesson.duration}
                            onChange={(event) => updateLesson(module.id, lesson.id, "duration", event.target.value)}
                            placeholder="Duration"
                            style={{ width: "8rem" }}
                          />
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeLesson(module.id, lesson.id)}><Trash2 /></Button>
                        </div>
                      ))}
                      <Button type="button" variant="ghost" size="sm" onClick={() => addLesson(module.id)}><Plus /> Add lesson</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="form-card">
              <h3 className="form-card__title">Resources Upload</h3>

              <label className="thumbnail-upload" style={{ marginBottom: "0.75rem" }}>
                <FileVideo />
                <span>Upload video files</span>
                <small>MP4, MOV</small>
                <input type="file" accept="video/*" multiple style={{ display: "none" }} onChange={handleAddResourceFiles("video")} />
              </label>

              <label className="thumbnail-upload">
                <FileText />
                <span>Upload PDF files</span>
                <small>PDF handouts and worksheets</small>
                <input type="file" accept=".pdf,application/pdf" multiple style={{ display: "none" }} onChange={handleAddResourceFiles("pdf")} />
              </label>

              <ul className="instructor-resource-list">
                {resources.map((resource) => (
                  <li key={resource.id} className="instructor-resource-item">
                    <div>
                      <div>{resource.name}</div>
                      <div className="instructor-resource-meta">{resource.type}</div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeResource(resource.id)}><Trash2 /></Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="form-card publish-card">
              <h3 className="publish-card__title">Publish</h3>
              <p className="publish-card__desc">Publish instantly or save draft to finish later.</p>
              <Button type="submit" variant="hero" style={{ width: "100%" }} size="lg">Publish course</Button>
              <Button type="button" variant="outline" style={{ width: "100%", marginTop: "0.5rem" }} onClick={submitCourse("draft")}>Save as draft</Button>
            </div>
          </aside>
        </div>
      </form>
    </DashboardLayout>
  );
}
