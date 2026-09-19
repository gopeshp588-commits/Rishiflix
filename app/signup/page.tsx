"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import BackgroundPosters from "@/components/BackgroundPosters";
import { useSound } from "@/hooks/useSound";

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What is the name of the city where you were born?",
  "What was your childhood nickname?",
  "What is your oldest sibling's middle name?",
  "What was the make of your first car?",
  "What is your favourite movie of all time?",
];

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  securityQuestion: string;
  securityAnswer: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  general?: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const { play } = useSound();

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    securityQuestion: "",
    securityAnswer: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [savedNickname, setSavedNickname] = useState<string | null>(null);

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

    if (!form.securityQuestion) {
      errs.securityQuestion = "Please select a security question.";
    }

    if (!form.securityAnswer.trim()) {
      errs.securityAnswer = "Please enter an answer to your security question.";
    }

    return errs;
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
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
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          nickname: form.nickname.trim() || null,
          securityQuestion: form.securityQuestion,
          securityAnswer: form.securityAnswer.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error });
        return;
      }

      play("/khatam.mp3", 1);
      setSavedNickname(form.nickname.trim() || null);
      setSuccess(true);

      setTimeout(() => router.push("/"), 3000);
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <main className="relative min-h-screen w-full flex flex-col">
        <BackgroundPosters />
        <header className="sticky top-0 z-50 flex items-center px-6 sm:px-12 py-6 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
          <span className="text-[#E50914] text-3xl sm:text-4xl font-extrabold tracking-tight select-none">
            RISHIFLIX
          </span>
        </header>
        <section className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-md bg-black/75 rounded-lg px-8 sm:px-10 py-14 backdrop-blur-sm flex flex-col items-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-2xl mb-2">
                {savedNickname ? `Account created, ${savedNickname}! 🎉` : "Account created! 🎉"}
              </p>
              <p className="text-[#b3b3b3] text-sm">
                Welcome to RishiFlix. Redirecting you to Sign In…
              </p>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#E50914] rounded-full animate-[shrink_3s_linear_forwards]" />
            </div>
            <button
              onClick={() => router.push("/")}
              className="text-[#b3b3b3] text-sm hover:text-white underline transition-colors"
            >
              Go to Sign In now
            </button>
          </div>
        </section>
      </main>
    );
  }

  // ── Sign Up form ───────────────────────────────────────────────────────────
  return (
    <main className="relative min-h-screen w-full flex flex-col">
      <BackgroundPosters />

      <header className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12 py-6 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <span className="text-[#E50914] text-3xl sm:text-4xl font-extrabold tracking-tight select-none">
          RISHIFLIX
        </span>
        <button
          onClick={() => router.push("/")}
          className="bg-[#E50914] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#f6121d] transition-colors"
        >
          Sign In
        </button>
      </header>

      <section className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-black/75 rounded-lg px-8 sm:px-10 py-12 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-[#b3b3b3] text-sm mb-8">Join RishiFlix and start watching.</p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {errors.general && (
              <div className="bg-[#e87c03] text-white text-sm px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <input
                id="email" name="email" type="email" autoComplete="email"
                value={form.email} onChange={handleChange} placeholder=" "
                className={`peer w-full rounded bg-[#333] text-white px-4 pt-6 pb-2 text-sm border focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-[#e87c03] focus:ring-[#e87c03]" : "border-transparent focus:ring-[#aaa]"}`}
              />
              <label htmlFor="email" className="absolute left-4 top-4 text-[#8c8c8c] text-sm pointer-events-none transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]">
                Email address
              </label>
              {errors.email && <p className="mt-1 text-[#e87c03] text-xs">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                id="password" name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password} onChange={handleChange} placeholder=" "
                className={`peer w-full rounded bg-[#333] text-white px-4 pt-6 pb-2 pr-16 text-sm border focus:outline-none focus:ring-2 transition-all ${errors.password ? "border-[#e87c03] focus:ring-[#e87c03]" : "border-transparent focus:ring-[#aaa]"}`}
              />
              <label htmlFor="password" className="absolute left-4 top-4 text-[#8c8c8c] text-sm pointer-events-none transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]">
                Password
              </label>
              {form.password.length > 0 && (
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c8c8c] text-xs font-semibold uppercase tracking-wide hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              )}
              {errors.password && <p className="mt-1 text-[#e87c03] text-xs">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div className="relative">
              <input
                id="confirmPassword" name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.confirmPassword} onChange={handleChange} placeholder=" "
                className={`peer w-full rounded bg-[#333] text-white px-4 pt-6 pb-2 text-sm border focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword ? "border-[#e87c03] focus:ring-[#e87c03]" : "border-transparent focus:ring-[#aaa]"}`}
              />
              <label htmlFor="confirmPassword" className="absolute left-4 top-4 text-[#8c8c8c] text-sm pointer-events-none transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]">
                Confirm password
              </label>
              {errors.confirmPassword && <p className="mt-1 text-[#e87c03] text-xs">{errors.confirmPassword}</p>}
            </div>

            {/* Nickname — optional */}
            <div className="relative">
              <input
                id="nickname" name="nickname" type="text" autoComplete="nickname"
                value={form.nickname} onChange={handleChange} placeholder=" " maxLength={30}
                className="peer w-full rounded bg-[#333] text-white px-4 pt-6 pb-2 text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-[#aaa] transition-all"
              />
              <label htmlFor="nickname" className="absolute left-4 top-4 text-[#8c8c8c] text-sm pointer-events-none transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]">
                Nickname <span className="text-[#555]">(optional)</span>
              </label>
              <p className="mt-1 text-[#555] text-xs">
                If you add one, we&apos;ll greet you by name every time you sign in.
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-[#444]" />
              <span className="text-[#8c8c8c] text-xs uppercase tracking-widest">Security</span>
              <div className="flex-1 h-px bg-[#444]" />
            </div>

            <p className="text-[#8c8c8c] text-xs -mt-1">
              This is used to verify your identity if you ever forget your password.
            </p>

            {/* Security question dropdown */}
            <div>
              <select
                id="securityQuestion" name="securityQuestion"
                value={form.securityQuestion} onChange={handleChange}
                className={`w-full rounded bg-[#333] text-sm px-4 py-3 border focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                  errors.securityQuestion ? "border-[#e87c03] focus:ring-[#e87c03] text-white" : "border-transparent focus:ring-[#aaa] text-white"
                } ${form.securityQuestion === "" ? "text-[#8c8c8c]" : "text-white"}`}
              >
                <option value="" disabled className="text-[#8c8c8c] bg-[#222]">
                  Select a security question…
                </option>
                {SECURITY_QUESTIONS.map((q) => (
                  <option key={q} value={q} className="bg-[#222] text-white">{q}</option>
                ))}
              </select>
              {errors.securityQuestion && <p className="mt-1 text-[#e87c03] text-xs">{errors.securityQuestion}</p>}
            </div>

            {/* Security answer */}
            <div className="relative">
              <input
                id="securityAnswer" name="securityAnswer" type="text"
                autoComplete="off"
                value={form.securityAnswer} onChange={handleChange} placeholder=" "
                className={`peer w-full rounded bg-[#333] text-white px-4 pt-6 pb-2 text-sm border focus:outline-none focus:ring-2 transition-all ${errors.securityAnswer ? "border-[#e87c03] focus:ring-[#e87c03]" : "border-transparent focus:ring-[#aaa]"}`}
              />
              <label htmlFor="securityAnswer" className="absolute left-4 top-4 text-[#8c8c8c] text-sm pointer-events-none transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]">
                Your answer
              </label>
              {errors.securityAnswer && <p className="mt-1 text-[#e87c03] text-xs">{errors.securityAnswer}</p>}
              <p className="mt-1 text-[#555] text-xs">Answer is case-insensitive.</p>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="mt-2 w-full bg-[#E50914] text-white font-semibold py-3 rounded text-sm hover:bg-[#f6121d] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </>
              ) : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-[#b3b3b3] text-sm">
            Already have an account?{" "}
            <button onClick={() => router.push("/")} className="text-white font-semibold hover:underline">
              Sign in.
            </button>
          </p>
        </div>
      </section>

      <footer className="relative z-10 bg-black/75 text-[#737373] text-xs px-6 sm:px-12 py-10 mt-auto border-t border-[#222]">
        <p className="mb-4">Questions? Call 1-800-RISHIFLIX</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {["FAQ", "Help Centre", "Account", "Media Centre", "Investor Relations", "Jobs", "Cookie Preferences", "Privacy", "Terms of Use", "Contact Us"].map((link) => (
            <a key={link} href="#" className="hover:underline">{link}</a>
          ))}
        </div>
        <p>© {new Date().getFullYear()} RishiFlix. All rights reserved.</p>
      </footer>
    </main>
  );
}
