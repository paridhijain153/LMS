import { Link } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageState } from "@/components/PageState";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { usePayment } from "@/context/PaymentContext";
import "@/styles/pages/dashboard.css";

export default function StudentPayments() {
  const { payments, isHydrated } = usePayment();

  return (
    <DashboardLayout role="student">
      <TopBar
        title="Payment History"
        subtitle="Review completed transactions and continue your courses."
        showSearch={false}
      />

      <div className="dashboard-content">
        {!isHydrated ? (
          <PageState
            type="loading"
            title="Loading payment history"
            description="Preparing your transaction timeline."
          />
        ) : payments.length === 0 ? (
          <PageState
            type="empty"
            title="No payments yet"
            description="Complete your first course checkout to see receipts here."
            icon={CreditCard}
            action={<Button asChild><Link to="/student/courses">Browse all courses</Link></Button>}
          />
        ) : (
          <section className="table-card">
            <div className="table-card__header">
              <h3 className="table-card__title">Transactions ({payments.length})</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <div className="table-user-name">{payment.courseTitle}</div>
                        <div className="table-user-email">{payment.transactionId || payment.id}</div>
                      </td>
                      <td>{payment.method}</td>
                      <td>${payment.total}</td>
                      <td>
                        <span className="admin-table-badge admin-table-badge--published">Completed</span>
                      </td>
                      <td>{new Date(payment.paidAt).toLocaleString()}</td>
                      <td>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/learn/${payment.courseId}`}>Open course</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
