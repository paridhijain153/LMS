import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ReceiptText } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageState } from "@/components/PageState";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { usePayment } from "@/context/PaymentContext";
import "@/styles/pages/payment-completion.css";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId") || "";
  const { payments, getPaymentById, isHydrated } = usePayment();

  const payment = useMemo(() => {
    if (!paymentId) {
      return payments[0] || null;
    }

    return getPaymentById(paymentId) || null;
  }, [paymentId, payments, getPaymentById]);

  if (!isHydrated) {
    return (
      <DashboardLayout role="student">
        <TopBar title="Payment" subtitle="Confirming transaction details." showSearch={false} />
        <div className="dashboard-content">
          <PageState
            type="loading"
            title="Loading payment receipt"
            description="Preparing your transaction summary."
          />
        </div>
      </DashboardLayout>
    );
  }

  if (!payment) {
    return (
      <DashboardLayout role="student">
        <TopBar title="Payment" subtitle="No receipt found." showSearch={false} />
        <div className="dashboard-content">
          <PageState
            type="error"
            title="Payment receipt not found"
            description="The transaction may already be completed or the receipt link is invalid."
            action={<Button asChild><Link to="/student/payments">Go to payment history</Link></Button>}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <TopBar title="Payment Successful" subtitle="Your enrollment is now active." showSearch={false} />

      <div className="dashboard-content">
        <section className="payment-success-card">
          <div className="payment-success-card__header">
            <span className="payment-success-card__icon"><CheckCircle2 /></span>
            <div>
              <h2>You're all set!</h2>
              <p>Your payment was processed successfully.</p>
            </div>
          </div>

          <div className="payment-receipt-grid">
            <div>
              <span>Course</span>
              <strong>{payment.courseTitle}</strong>
            </div>
            <div>
              <span>Instructor</span>
              <strong>{payment.instructor}</strong>
            </div>
            <div>
              <span>Payment Method</span>
              <strong>{payment.method}</strong>
            </div>
            <div>
              <span>Total Paid</span>
              <strong>${payment.total}</strong>
            </div>
            <div>
              <span>Transaction ID</span>
              <strong>{payment.transactionId || payment.id}</strong>
            </div>
            <div>
              <span>Paid At</span>
              <strong>{new Date(payment.paidAt).toLocaleString()}</strong>
            </div>
          </div>

          <div className="payment-success-card__actions">
            <Button asChild>
              <Link to={`/learn/${payment.courseId}`}>Start learning</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/student/payments"><ReceiptText /> View payment history</Link>
            </Button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
