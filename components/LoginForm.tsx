"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginForm() {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};

    if (!form.email.trim()) {
      errs.email = "Please enter a valid email or phone number.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      !/^\+?[\d\s\-()]{7,15}$/.test(form.email)
    ) {
      errs.email = "Please enter a valid email or phone number.";
    }

    if (!form.password) {
      errs.password = "Your password must contain between 4 and 60 characters.";
    } else if (form.password.length < 4 || form.password.length > 60) {
      errs.password = "Your password must contain between 4 and 60 characters.";
    }

    return errs;
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field on change
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
      // Simulate API call — replace with real auth logic
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Demo: treat any login as failed to show error state
      // Remove this block and redirect on success when backend is ready
      setErrors({
        general:
          "Incorrect password. Please try again or reset your password.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* General error */}
      {errors.general && (
        <div className="bg-[#e87c03] text-white text-sm px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      {/* Email field */}
      <div className="relative">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          placeholder=" "
          className={`
            peer w-full rounded bg-[#333] text-white px-4 pt-6 pb-2 text-sm
            border focus:outline-none focus:ring-2 transition-all
            ${
              errors.email
                ? "border-[#e87c03] focus:ring-[#e87c03]"
                : "border-transparent focus:ring-[#aaa]"
            }
          `}
        />
        <label
          htmlFor="email"
          className="
            absolute left-4 top-4 text-[#8c8c8c] text-sm pointer-events-none
            transition-all duration-150
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
            peer-focus:top-1.5 peer-focus:text-[10px]
            peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]
          "
        >
          Email or phone number
        </label>
        {errors.email && (
          <p className="mt-1 text-[#e87c03] text-xs">{errors.email}</p>
        )}
      </div>

      {/* Password field */}
      <div className="relative">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          placeholder=" "
          className={`
            peer w-full rounded bg-[#333] text-white px-4 pt-6 pb-2 pr-16 text-sm
            border focus:outline-none focus:ring-2 transition-all
            ${
              errors.password
                ? "border-[#e87c03] focus:ring-[#e87c03]"
                : "border-transparent focus:ring-[#aaa]"
            }
          `}
        />
        <label
          htmlFor="password"
          className="
            absolute left-4 top-4 text-[#8c8c8c] text-sm pointer-events-none
            transition-all duration-150
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
            peer-focus:top-1.5 peer-focus:text-[10px]
            peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]
          "
        >
          Password
        </label>
        {/* Show/hide password toggle */}
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
        {errors.password && (
          <p className="mt-1 text-[#e87c03] text-xs">{errors.password}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="
          mt-2 w-full bg-[#E50914] text-white font-semibold py-3 rounded text-sm
          hover:bg-[#f6121d] active:scale-[0.98] transition-all
          disabled:opacity-70 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign In"
        )}
      </button>

      {/* Remember me + help */}
      <div className="flex items-center justify-between text-xs text-[#b3b3b3] mt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="accent-[#b3b3b3] w-3.5 h-3.5"
          />
          Remember me
        </label>
        <a href="#" className="hover:underline">
          Need help?
        </a>
      </div>

      {/* Social login divider */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-[#555]" />
        <span className="text-[#8c8c8c] text-xs">OR</span>
        <div className="flex-1 h-px bg-[#555]" />
      </div>

      {/* Sign in with Google (placeholder) */}
      <button
        type="button"
        className="
          w-full flex items-center justify-center gap-3 border border-[#555]
          text-[#b3b3b3] text-sm font-medium py-3 rounded
          hover:bg-white/10 transition-colors
        "
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.4 7.1 28.9 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.5-.2-2.9-.4-4.5z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.4 7.1 28.9 5 24 5 16.3 5 9.7 9 6.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 45c4.8 0 9.2-1.8 12.5-4.8l-5.8-4.9C29 37 26.6 38 24 38c-5.2 0-9.6-3.5-11.2-8.3l-6.5 5C9.5 41.2 16.2 45 24 45z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.4l5.8 4.9C43 35.1 44 30.4 44 25c0-1.5-.2-2.9-.4-4.5z"
          />
        </svg>
        Sign in with Google
      </button>
    </form>
  );
}
