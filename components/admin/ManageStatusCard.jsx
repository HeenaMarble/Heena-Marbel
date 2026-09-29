"use client";

import { useState, useTransition } from "react";
import { CreditCard, ChevronDown, Check, Loader2 } from "lucide-react";
import { updateOrderStatus, updatePaymentStatus } from "@/actions/orders";
import styles from "./ManageStatusCard.module.css";

const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Paid", label: "Paid" },
  { value: "Refunded", label: "Refunded" },
  { value: "Failed", label: "Failed" },
];

export default function ManageStatusCard({ orderId, orderNumber, currentStatus, paymentMethod, currentPaymentStatus }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus || "pending");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Derive default payment status only if DB has no value yet
  const isCod = (paymentMethod || "").toLowerCase() === "cod";
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus || (isCod ? "Pending" : "Paid"));

  const paymentMethodLabel = isCod ? "Cash on Delivery" : "Online Payment";

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setSavedSuccess(false);
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch (err) {
        console.error("Failed to update order status:", err);
      }
    });
  };

  const handlePaymentStatusChange = (newStatus) => {
    setPaymentStatus(newStatus);
    setSavedSuccess(false);
    startTransition(async () => {
      try {
        await updatePaymentStatus(orderId, newStatus);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch (err) {
        console.error("Failed to update payment status:", err);
      }
    });
  };

  return (
    <div className={styles.card}>
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.iconWrap}>
          <CreditCard size={18} />
        </div>
        <h2 className={styles.cardTitle}>Manage Status</h2>
        {isPending && (
          <span className={styles.savingBadge}>
            <Loader2 size={13} className="animate-spin" />
            <span>Saving...</span>
          </span>
        )}
        {savedSuccess && !isPending && (
          <span className={styles.savedBadge}>
            <Check size={13} />
            <span>Updated</span>
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        {/* ORDER STATUS */}
        <div className={styles.fieldSection}>
          <label className={styles.fieldLabel}>ORDER STATUS</label>
          <div className={styles.selectWrapper}>
            <select
              value={status}
              disabled={isPending}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={styles.styledSelect}
            >
              {ORDER_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className={styles.selectChevron} />
          </div>
        </div>

        {/* PAYMENT STATUS */}
        <div className={styles.fieldSection}>
          <label className={styles.fieldLabel}>PAYMENT STATUS</label>
          <div className={styles.selectWrapper}>
            <select
              value={paymentStatus}
              disabled={isPending}
              onChange={(e) => handlePaymentStatusChange(e.target.value)}
              className={styles.styledSelect}
            >
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className={styles.selectChevron} />
          </div>
        </div>

        {/* Payment Method Notice */}
        <div className={styles.paymentMethodNotice}>
          <span>Payment method: </span>
          <strong>{paymentMethodLabel}</strong>
        </div>
      </div>
    </div>
  );
}

