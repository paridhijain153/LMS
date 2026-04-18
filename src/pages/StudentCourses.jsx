import { useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageState } from "@/components/PageState";
import { TopBar } from "@/components/TopBar";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourse } from "@/context/CourseContext";
import { courses } from "@/data/mockData";
import "@/styles/pages/student-features.css";

function getCategories() {
  return ["all", ...new Set(courses.map((course) => course.category.toLowerCase()))];
}

export default function StudentCourses() {
  const { isHydrated } = useCourse();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(60);
  const categories = useMemo(getCategories, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === "all" || course.category.toLowerCase() === category;
      const matchesPrice = course.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchQuery, category, maxPrice]);

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("all");
    setMaxPrice(60);
  };

  return (
    <DashboardLayout role="student">
      <TopBar
        title="All Courses"
        subtitle="Browse every course and enroll in one click."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="dashboard-content">
        {!isHydrated ? (
          <PageState
            type="loading"
            title="Loading courses"
            description="Preparing your catalog and enrollment state."
          />
        ) : (
          <>
        <section className="student-filters-card">
          <div className="student-filters-header">
            <h2 className="dash-section-title"><SlidersHorizontal /> Filters</h2>
            <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
              Reset
            </Button>
          </div>

          <div className="student-filters-grid">
            <div className="form-field">
              <label className="student-filter-label" htmlFor="course-search">Search</label>
              <div className="student-search-wrap">
                <Search className="student-search-icon" />
                <Input
                  id="course-search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by course title"
                  className="student-search-input"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="student-filter-label" htmlFor="course-category">Category</label>
              <select
                id="course-category"
                className="student-select"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "all" ? "All categories" : item[0].toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="student-filter-label" htmlFor="course-price">
                Max Price: ${maxPrice}
              </label>
              <input
                id="course-price"
                type="range"
                min="10"
                max="60"
                step="1"
                value={maxPrice}
                className="student-price-range"
                onChange={(event) => setMaxPrice(Number(event.target.value))}
              />
            </div>
          </div>
        </section>

        {filteredCourses.length === 0 ? (
          <PageState
            type="empty"
            title="No courses match your filters"
            description="Try a different search, category, or price range."
            action={<Button type="button" variant="outline" onClick={clearFilters}>Clear filters</Button>}
            icon={Filter}
          />
        ) : (
          <section className="student-courses-grid">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} showEnrollButton />
            ))}
          </section>
        )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
