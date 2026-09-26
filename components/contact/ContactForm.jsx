"use client";

import { useActionState } from "react";
import { submitInquiry } from "@/actions/inquiries";
import styles from "@/app/contact/Contact.module.css";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitInquiry, null);

  if (state?.success) {
    return (
      <div className={styles.formGroup} role="status">
        <h4>Thank you — your message is on its way.</h4>
        <p>Our team will get back to you within one working day.</p>
      </div>
    );
  }

  return (
    <form action={formAction}>
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }}
      />
      <div className={styles.formGroup}>
        <label htmlFor="c-name">Full Name</label>
        <input id="c-name" name="name" type="text" placeholder="John Doe" required maxLength={100} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="c-email">Email Address</label>
        <input id="c-email" name="email" type="email" placeholder="john@example.com" required maxLength={150} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="c-phone">Phone (optional)</label>
        <input id="c-phone" name="phone" type="tel" inputMode="numeric" pattern="[0-9]{7,15}" title="Enter digits only (7-15 numbers)" placeholder="9876543210" maxLength={15} onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, ""); }} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" rows="5" placeholder="Tell us about your project..." required maxLength={3000}></textarea>
      </div>
      {state?.error && (
        <p role="alert" style={{ color: "#b91c1c", marginBottom: "12px", fontSize: "0.95rem" }}>
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`btn-primary ${styles.submitBtn}`}>
        {pending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
