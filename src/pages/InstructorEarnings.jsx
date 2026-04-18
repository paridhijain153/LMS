import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { useInstructor } from "@/context/InstructorContext";
import "@/styles/pages/dashboard.css";

export default function InstructorEarnings() {
  const { metrics, monthlyEarnings, students } = useInstructor();

  const pendingPayout = Math.round(metrics.estimatedRevenue * 0.22);
  const thisMonth = monthlyEarnings[monthlyEarnings.length - 1]?.v ?? 0;

  return (
    <DashboardLayout role="instructor">
      <TopBar title="Earnings" subtitle="Track your revenue, payouts, and monthly performance." showSearch={false} />

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card__label">Total revenue</div>
            <div className="stat-card__value--lg">${metrics.estimatedRevenue.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">This month</div>
            <div className="stat-card__value--lg">${thisMonth.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Pending payout</div>
            <div className="stat-card__value--lg">${pendingPayout.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Paid enrollments</div>
            <div className="stat-card__value--lg">{students.length}</div>
          </div>
        </div>

        <section className="chart-card">
          <h3 className="chart-card__title">Monthly earnings trend</h3>
          <div className="chart-card__chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="v" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
