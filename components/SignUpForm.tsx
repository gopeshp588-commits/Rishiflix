"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function SignUpForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [form, setForm] = useState<FormState>({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};

    if (!form.email.trim()) {
      errs.email = "Please enter a valid email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      errs.password = "Your password must contain between 4 and 60 characters.";
    } else if (form.password.length < 4 || form.password.length > 60) {
      errs.password = "Your password must contain between 4 and 60 characters.";
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    return errs;
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error });
        return;
      }

      setSuccess(true);
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 py-4">
        <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white font-semibold text-lg">Account created!</p>
        <p className="text-[#b3b3b3] text-sm text-center">You can now sign in with your email and password.</p>
        <button
          onClick={onSwitchToLogin}
          className="mt-2 w-full bg-[#E50914] text-white font-semibold py-3 rounded text-sm hover:bg-[#f6121d] transition-colors"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {errors.general && (
        <div className="bg-[#e87c03] text-white text-sm px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      {/* Email */}
      <div className="relative">
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          placeholder=" "
          className={`peer w-full rounded bg-[#333] text-white px-4 pt-6 pb-2 text-sm border focus:outline-none focus:ring-2 transition-all ${
            errors.email ? "border-[#e87c03] focus:ring-[#e87c03]" : "border-transparent focus:ring-[#aaa]"
          }`}
        />
        <label
          htmlFor="signup-email"
          className="absolute left-4 top-4 text-[#8c8c8c] text-sm pointer-events-none transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]"
        >
          Email address
        </label>
        {errors.email && <p className="mt-1 text-[#e87c03] text-xs">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="relative">
        <input
          id="signup-password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          placeholder=" "
          className={`peer w-full rounded bg-[#333] text-white px-4 pt-6 pb-2 pr-16 text-sm border focus:outline-none focus:ring-2 transition-all ${
            errors.password ? "border-[#e87c03] focus:ring-[#e87c03]" : "border-transparent focus:ring-[#aaa]"
          }`}
        />
        <label
          htmlFor="signup-password"
          className="absolute left-4 top-4 text-[#8c8c8c] text-sm pointer-events-none transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]"
        >
          Password
        </label>
        {form.password.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c8c8c] text-xs font-semibold uppercase tracking-wide hover:text-white transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
        {errors.password && <p className="mt-1 text-[#e87c03] text-xs">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <input
          id="signup-confirm"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder=" "
          className={`peer w-full rounded bg-[#333] text-white px-4 pt-6 pb-2 text-sm border focus:outline-none focus:ring-2 transition-all ${
            errors.confirmPassword ? "border-[#e87c03] focus:ring-[#e87c03]" : "border-transparent focus:ring-[#aaa]"
          }`}
        />
        <label
          htmlFor="signup-confirm"
          className="absolute left-4 top-4 text-[#8c8c8c] text-sm pointer-events-none transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]"
        >
          Confirm password
        </label>
        {errors.confirmPassword && <p className="mt-1 text-[#e87c03] text-xs">{errors.confirmPassword}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full bg-[#E50914] text-white font-semibold py-3 rounded text-sm hover:bg-[#f6121d] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating account…
          </>
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
}
