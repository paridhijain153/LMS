import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const PaymentContext = createContext(undefined);

function createStorageKey(user) {
  if (!user?.name || user?.role !== "student") {
    return "lms_payments_guest";
  }

  const safeName = user.name.trim().toLowerCase().replace(/\s+/g, "_");
  return `lms_payments_${safeName}`;
}

function loadPayments(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load payments", error);
    localStorage.removeItem(storageKey);
    return [];
  }
}

export function PaymentProvider({ children }) {
  const { user } = useAuth();
  const storageKey = useMemo(() => createStorageKey(user), [user]);
  const [payments, setPayments] = useState([]);
  const [hydratedKey, setHydratedKey] = useState("");

  useEffect(() => {
    const nextPayments = loadPayments(storageKey);
    setPayments(nextPayments);
    setHydratedKey(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (hydratedKey !== storageKey) {
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify(payments));
  }, [payments, hydratedKey, storageKey]);

  const addPayment = ({ course, subtotal, discount, total, method, transactionId = "" }) => {
    if (!course?.id) {
      return null;
    }

    const existing = payments.find((payment) => payment.courseId === course.id);
    if (existing) {
      return existing;
    }

    const newPayment = {
      id: `pay_${Date.now()}`,
      courseId: course.id,
      courseTitle: course.title,
      instructor: course.instructor,
      method,
      subtotal,
      discount,
      total,
      transactionId,
      status: "completed",
      paidAt: new Date().toISOString(),
    };

    setPayments((prev) => [newPayment, ...prev]);
    return newPayment;
  };

  const getPaymentById = (paymentId) => {
    return payments.find((payment) => payment.id === paymentId) || null;
  };

  const value = useMemo(
    () => ({
      payments,
      addPayment,
      getPaymentById,
      isHydrated: hydratedKey === storageKey,
    }),
    [payments, hydratedKey, storageKey],
  );

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used inside PaymentProvider");
  }

  return context;
}
