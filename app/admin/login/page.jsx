"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { adminLogin } from "@/actions/auth";
import styles from "./AdminLogin.module.css";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.topAccentBar} />
      <div className={styles.ambientGlow} />

      <div className={styles.cardContainer}>
        <div className={styles.loginCard}>
          {/* Logo & Portal Header */}
          <div className={styles.headerSection}>
            <Link href="/" className={styles.logoLink} title="Heena Marble Home">
              <img
                src="/logo.png"
                alt="Heena Marble"
                className={styles.logoImage}
              />
            </Link>

            <div>
              <span className={styles.portalBadge}>
                <ShieldCheck size={13} />
                <span>Admin Console</span>
              </span>
            </div>

            <p className={styles.subtitle}>
              Secure sign-in for studio & catalog operations
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className={styles.loginForm}>
            {/* Email */}
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Admin Email</label>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}>
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="admin@heenamarble.com"
                  className={styles.formInput}
                />
              </div>
            </div>

            {/* Password */}
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>Password</label>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}>
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className={styles.formInput}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePasswordBtn}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {state?.error && (
              <div className={styles.errorMessage}>
                <span className={styles.errorDot} />
                <span>{state.error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className={styles.submitButton}
            >
              {pending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Log In to Dashboard</span>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className={styles.cardFooter}>
            <Link href="/" className={styles.storeLink}>
              <ArrowLeft size={14} />
              <span>Return to Heena Marble Storefront</span>
            </Link>
          </div>
        </div>

        <p className={styles.securityNote}>
          Encrypted Admin Session • Heena Marble Studio, Makrana
        </p>
      </div>
    </div>
  );
}


