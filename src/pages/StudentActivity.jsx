import { Activity } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageState } from "@/components/PageState";
import { TopBar } from "@/components/TopBar";
import { useStudent } from "@/context/StudentContext";
import "@/styles/pages/student-features.css";

function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString();
}

export default function StudentActivity() {
  const { activity, isHydrated } = useStudent();

  return (
    <DashboardLayout role="student">
      <TopBar title="Activity" subtitle="Your recent learning and wishlist actions." />
      <div className="dashboard-content">
        {!isHydrated ? (
          <PageState
            type="loading"
            title="Loading activity"
            description="Preparing your latest learning events."
          />
        ) : activity.length === 0 ? (
          <PageState
            type="empty"
            title="No activity yet"
            description="Start a lesson or enroll in a course to see activity here."
            icon={Activity}
          />
        ) : (
          <section className="student-activity-list">
            {activity.map((item) => (
              <article key={item.id} className="student-activity-item">
                <div>
                  <h3>{item.message}</h3>
                  <p>{formatTime(item.createdAt)}</p>
                </div>
                <span className="student-activity-type">{item.type}</span>
              </article>
            ))}
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
