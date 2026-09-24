"use client";

import { useState, useTransition } from "react";
import { CreditCard, Truck, ChevronDown, Check, Loader2 } from "lucide-react";
import { updateOrderStatus } from "@/actions/orders";
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

export default function ManageStatusCard({ orderId, orderNumber, currentStatus, paymentMethod }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus || "pending");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Derive initial payment status based on payment method
  const isCod = (paymentMethod || "").toLowerCase() === "cod";
  const [paymentStatus, setPaymentStatus] = useState(isCod ? "Pending" : "Paid");
  const [shippingModalOpen, setShippingModalOpen] = useState(false);

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

  const handleShiprocketClick = () => {
    setShippingModalOpen(true);
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
              onChange={(e) => setPaymentStatus(e.target.value)}
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

        {/* SHIPMENT */}
        <div className={styles.shipmentSection}>
          <div className={styles.shipmentLabelRow}>
            <Truck size={14} className={styles.truckIcon} />
            <span className={styles.fieldLabel}>SHIPMENT</span>
          </div>

          <button
            type="button"
            onClick={handleShiprocketClick}
            className={styles.shiprocketBtn}
          >
            SHIP VIA SHIPROCKET
          </button>
        </div>
      </div>

      {/* Shiprocket Modal Dialog */}
      {shippingModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setShippingModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleWrap}>
                <Truck size={20} color="#b38b4d" />
                <h3 className={styles.modalTitle}>Ship via Shiprocket</h3>
              </div>
              <button
                type="button"
                onClick={() => setShippingModalOpen(false)}
                className={styles.modalCloseBtn}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>
                Order <strong>{orderNumber}</strong> is ready for courier assignment.
              </p>
              <div className={styles.modalDetailsBox}>
                <div className={styles.modalDetailRow}>
                  <span>Current Status:</span>
                  <strong className="capitalize">{status}</strong>
                </div>
                <div className={styles.modalDetailRow}>
                  <span>Payment Method:</span>
                  <strong>{paymentMethodLabel}</strong>
                </div>
                <div className={styles.modalDetailRow}>
                  <span>Shipment Partner:</span>
                  <span className={styles.badgePartner}>Shiprocket Standard / Surface</span>
                </div>
              </div>
              <p className={styles.modalSubtext}>
                Shiprocket API sync creates airway bill (AWB) and schedules studio pickup from Makrana workshop.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={() => {
                  alert(`Shipment manifest queued for order ${orderNumber}!`);
                  setShippingModalOpen(false);
                }}
                className={styles.modalPrimaryBtn}
              >
                Confirm & Generate AWB
              </button>
              <button
                type="button"
                onClick={() => setShippingModalOpen(false)}
                className={styles.modalSecondaryBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
