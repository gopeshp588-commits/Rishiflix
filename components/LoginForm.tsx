"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useSound } from "@/hooks/useSound";

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

type ErrorCode = "USER_NOT_FOUND" | "WRONG_PASSWORD" | null;

export default function LoginForm({ onSignedIn }: { onSignedIn?: (nickname?: string | null) => void }) {
  const router = useRouter();
  const { play } = useSound();

  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorCode, setErrorCode] = useState<ErrorCode>(null);

  // success state — stores nickname (or null) returned from API
  const [successNickname, setSuccessNickname] = useState<string | null | undefined>(undefined);

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
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setErrorCode(null);
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
    setErrorCode(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const code: ErrorCode = data.code ?? null;
        setErrorCode(code);

        if (code === "WRONG_PASSWORD") {
          // Play Faahhh! at full volume
          play("/faah.mp3", 1);
          setErrors({ general: "Incorrect password. Please try again." });
        } else if (code === "USER_NOT_FOUND") {
          setErrors({ general: data.error });
        } else {
          setErrors({ general: data.error ?? "Something went wrong." });
        }
        return;
      }

      // ✅ Success — trigger the RishiFlix intro animation + dun-dun-dun
      setSuccessNickname(data.nickname ?? null);
      onSignedIn?.(data.nickname ?? null);

    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (successNickname !== undefined) {
    const greeting = successNickname
      ? `Welcome back, ${successNickname}! 🎉`
      : "Welcome back! 🎉";

    return (
      <div className="flex flex-col items-center gap-5 py-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white font-bold text-2xl">{greeting}</p>
        <p className="text-[#b3b3b3] text-sm">You&apos;re signed in. Enjoy RishiFlix!</p>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

      {/* General error banner */}
      {errors.general && (
        <div className={`text-white text-sm px-4 py-3 rounded flex flex-col gap-1 ${
          errorCode === "WRONG_PASSWORD" ? "bg-[#b20710]" : "bg-[#e87c03]"
        }`}>
          <span>{errors.general}</span>

          {/* Wrong password hint */}
          {errorCode === "WRONG_PASSWORD" && (
            <span className="text-white/80 text-xs">
              Forgot it?{" "}
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="underline text-white font-semibold"
              >
                Reset your password
              </button>
            </span>
          )}

          {/* User not found — nudge to sign up */}
          {errorCode === "USER_NOT_FOUND" && (
            <span className="text-white/80 text-xs mt-1">
              New here?{" "}
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="underline text-white font-semibold"
              >
                Create a free account
              </button>
            </span>
          )}
        </div>
      )}

      {/* Email / phone */}
      <div className="relative">
        <input
          id="email"
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
          htmlFor="email"
          className="absolute left-4 top-4 text-[#8c8c8c] text-sm pointer-events-none transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]"
        >
          Email or phone number
        </label>
        {errors.email && <p className="mt-1 text-[#e87c03] text-xs">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="relative">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          placeholder=" "
          className={`peer w-full rounded bg-[#333] text-white px-4 pt-6 pb-2 pr-16 text-sm border focus:outline-none focus:ring-2 transition-all ${
            errors.password ? "border-[#e87c03] focus:ring-[#e87c03]" : "border-transparent focus:ring-[#aaa]"
          }`}
        />
        <label
          htmlFor="password"
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

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full bg-[#E50914] text-white font-semibold py-3 rounded text-sm hover:bg-[#f6121d] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          <input type="checkbox" className="accent-[#b3b3b3] w-3.5 h-3.5" />
          Remember me
        </label>
        <button
          type="button"
          onClick={() => router.push("/forgot-password")}
          className="hover:underline"
        >
          Forgot password?
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-[#555]" />
        <span className="text-[#8c8c8c] text-xs">OR</span>
        <div className="flex-1 h-px bg-[#555]" />
      </div>

      {/* Google sign in placeholder */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 border border-[#555] text-[#b3b3b3] text-sm font-medium py-3 rounded hover:bg-white/10 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.4 7.1 28.9 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.5-.2-2.9-.4-4.5z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.4 7.1 28.9 5 24 5 16.3 5 9.7 9 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 45c4.8 0 9.2-1.8 12.5-4.8l-5.8-4.9C29 37 26.6 38 24 38c-5.2 0-9.6-3.5-11.2-8.3l-6.5 5C9.5 41.2 16.2 45 24 45z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.4l5.8 4.9C43 35.1 44 30.4 44 25c0-1.5-.2-2.9-.4-4.5z"/>
        </svg>
        Sign in with Google
      </button>
    </form>
  );
}
