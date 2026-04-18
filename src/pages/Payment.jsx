import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CreditCard, Lock, ShieldCheck, Check } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { courses } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { useCourse } from "@/context/CourseContext";
import { usePayment } from "@/context/PaymentContext";
import "@/styles/pages/payment.css";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const requestedCourseId = searchParams.get("courseId");
  const course = courses.find((item) => item.id === requestedCourseId) ?? courses[0];
  const navigate = useNavigate();
  const { enrollCourse, isEnrolled } = useCourse();
  const { addPayment } = usePayment();
  const [method, setMethod] = useState("Card");
  const [upiTransactionId, setUpiTransactionId] = useState("");
  const alreadyEnrolled = isEnrolled(course.id);
  const subtotal = course.price ?? 49;
  const discount = 10;
  const total = subtotal - discount;

  const isUpiPayment = method === "UPI";

  const onPay = (e) => {
    e.preventDefault();

    if (alreadyEnrolled) {
      toast({ title: "Already enrolled", description: "You already own this course." });
      navigate(`/learn/${course.id}`);
      return;
    }

    enrollCourse(course);
    const payment = addPayment({
      course,
      subtotal,
      discount,
      total,
      method,
      transactionId: isUpiPayment ? upiTransactionId.trim() : "",
    });

    toast({ title: "Payment successful 🎉", description: "Enrollment complete. Opening your courses..." });
    setTimeout(() => navigate("/student/my-courses"), 700);
  };

  return (<div className="payment-page">
      <header className="payment-nav">
        <div className="payment-nav__inner container">
          <div className="payment-nav__left">
            <Button variant="ghost" size="icon" asChild><Link to={`/course/${course.id}`}><ArrowLeft /></Link></Button>
            <Logo />
          </div>
          <span className="payment-secure">
            <Lock /> Secure checkout
          </span>
        </div>
      </header>

      <div className="payment-body container">
        {/* Form */}
        <form onSubmit={onPay} className="payment-form">
          <div className="billing-card">
            <h2 className="billing-card__title">Billing details</h2>
            <div className="billing-grid">
              <div className="form-field"><Label>First name</Label><Input placeholder="Alex"/></div>
              <div className="form-field"><Label>Last name</Label><Input placeholder="Doe"/></div>
              <div className="form-field billing-grid__full"><Label>Email</Label><Input type="email" placeholder="alex@email.com"/></div>
              <div className="form-field billing-grid__full"><Label>Country</Label><Input placeholder="United States"/></div>
            </div>
          </div>

          <div className="payment-method-card">
            <h2 className="payment-method-card__title">Payment method</h2>
            <div className="payment-methods">
              {["Card", "PayPal", "Apple Pay", "UPI"].map((m) => (<button type="button" key={m} onClick={() => setMethod(m)} className={`payment-method-btn${method === m ? " payment-method-btn--active" : ""}`}>
                  {m === "Card" && <CreditCard style={{ width: "1rem", height: "1rem" }}/>}
                  {m}
                </button>))}
            </div>

            {isUpiPayment ? (
              <div className="payment-form-fields">
                <div className="form-field">
                  <Label htmlFor="upi-id">UPI ID</Label>
                  <Input id="upi-id" placeholder="name@bank" />
                </div>
                <div className="form-field">
                  <Label htmlFor="upi-transaction-id">UPI Transaction ID</Label>
                  <Input
                    id="upi-transaction-id"
                    value={upiTransactionId}
                    onChange={(event) => setUpiTransactionId(event.target.value)}
                    placeholder="Enter transaction ID (optional)"
                  />
                </div>
                <p className="payment-upi-note">Use your UPI app to pay, then you can optionally paste the transaction ID.</p>
              </div>
            ) : (
              <div className="payment-form-fields">
                <div className="form-field"><Label>Card number</Label><Input placeholder="1234 5678 9012 3456"/></div>
                <div className="payment-grid-2">
                  <div className="form-field"><Label>Expiry</Label><Input placeholder="MM / YY"/></div>
                  <div className="form-field"><Label>CVC</Label><Input placeholder="123"/></div>
                </div>
                <div className="form-field"><Label>Name on card</Label><Input placeholder="Alex Doe"/></div>
              </div>
            )}
          </div>

          <div className="payment-submit-wrap">
            <Button type="submit" variant="hero" size="xl" style={{ width: "100%" }}>
              <Lock /> Pay ${total}
            </Button>
            <p className="payment-guarantee">
              <ShieldCheck /> 30-day money-back guarantee
            </p>
          </div>
        </form>

        {/* Summary */}
        <aside>
          <div className="order-summary">
            <h2 className="order-summary__title">Order summary</h2>
            <div className="order-course">
              <img src={course.thumbnail} alt="" className="order-course__img"/>
              <div style={{ minWidth: 0 }}>
                <h3 className="order-course__title">{course.title}</h3>
                <p className="order-course__by">by {course.instructor}</p>
              </div>
            </div>

            <div className="order-divider"/>

            <div className="order-line-items">
              <div className="order-line"><span className="order-line__label">Subtotal</span><span>${subtotal}</span></div>
              <div className="order-line"><span className="order-line__label">Discount</span><span className="order-line__value--discount">−${discount}</span></div>
              <div className="order-line"><span className="order-line__label">Tax</span><span>$0</span></div>
            </div>

            <div className="order-divider"/>

            <div className="order-total">
              <span className="order-total__label">Total</span>
              <span className="order-total__value text-gradient">${total}</span>
            </div>

            <ul className="order-perks">
              {["Lifetime access", "Certificate included", "Downloadable resources"].map((t) => (<li key={t} className="order-perk"><Check /> {t}</li>))}
            </ul>
          </div>
        </aside>
      </div>
    </div>);
};

export default Payment;
