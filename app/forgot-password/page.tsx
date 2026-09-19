"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import BackgroundPosters from "@/components/BackgroundPosters";

// ── Step types ──────────────────────────────────────────────────────────────
type Step = "email" | "answer" | "newPassword" | "done";

// ── Shared input field ───────────────────────────────────────────────────────
function FloatingInput({
  id, name, type = "text", label, value, onChange, error, autoComplete,
}: {
  id: string; name: string; type?: string; label: string;
  value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string; autoComplete?: string;
}) {
  return (
    <div className="relative">
      <input
        id={id} name={name} type={type} autoComplete={autoComplete}
        value={value} onChange={onChange} placeholder=" "
        className={`peer w-full rounded bg-[#333] text-white px-4 pt-6 pb-2 text-sm border focus:outline-none focus:ring-2 transition-all ${
          error ? "border-[#e87c03] focus:ring-[#e87c03]" : "border-transparent focus:ring-[#aaa]"
        }`}
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-4 text-[#8c8c8c] text-sm pointer-events-none transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]"
      >
        {label}
      </label>
      {error && <p className="mt-1 text-[#e87c03] text-xs">{error}</p>}
    </div>
  );
}

// ── Step indicator ───────────────────────────────────────────────────────────
function StepDots({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((n) => (
        <div key={n} className={`h-1.5 rounded-full transition-all duration-300 ${
          n === current ? "w-8 bg-[#E50914]" : n < current ? "w-4 bg-[#E50914]/50" : "w-4 bg-[#444]"
        }`} />
      ))}
      <span className="ml-2 text-[#8c8c8c] text-xs">Step {current} of 3</span>
    </div>
  );
}

// ── Shared card wrapper ───────────────────────────────────────────────────
function Card({
  children,
  onSignIn,
}: {
  children: React.ReactNode;
  onSignIn: () => void;
}) {
  return (
    <main className="relative min-h-screen w-full flex flex-col">
      <BackgroundPosters />
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12 py-6 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <span className="text-[#E50914] text-3xl sm:text-4xl font-extrabold tracking-tight select-none">
          RISHIFLIX
        </span>
        <button
          onClick={onSignIn}
          className="bg-[#E50914] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#f6121d] transition-colors"
        >
          Sign In
        </button>
      </header>
      <section className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-black/75 rounded-lg px-8 sm:px-10 py-12 backdrop-blur-sm">
          {children}
        </div>
      </section>
    </main>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Step 1: enter email → fetch security question ──────────────────────────
  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/auth/forgot-password?email=${encodeURIComponent(email.trim().toLowerCase())}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(
          data.code === "USER_NOT_FOUND"
            ? "No account found with this email. Please sign up first."
            : data.error
        );
        return;
      }

      setSecurityQuestion(data.securityQuestion);
      setStep("answer");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: answer security question ─────────────────────────────────────
  async function handleAnswerSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!answer.trim()) {
      setError("Please enter your answer.");
      return;
    }

    setLoading(true);
    try {
      // We verify the answer by attempting a dry-run POST with a placeholder
      // password — actually we just move to step 3 and verify during final submit.
      // But to give early feedback, we'll call the API here with a sentinel value
      // and check only the answer part via a dedicated verify endpoint.
      // Since our API verifies answer + resets in one shot, we move to step 3
      // and do it all together there — answer pre-validation happens on submit.
      setStep("newPassword");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 3: set new password → verify answer + reset ─────────────────────
  async function handleResetSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!newPassword || newPassword.length < 4 || newPassword.length > 60) {
      setError("Password must be between 4 and 60 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          securityAnswer: answer.trim(),
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "WRONG_ANSWER") {
          // Send them back to answer step with error
          setStep("answer");
          setAnswer("");
          setError("That answer is incorrect. Please try again.");
        } else {
          setError(data.error ?? "Something went wrong.");
        }
        return;
      }

      setStep("done");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Done screen ───────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <Card onSignIn={() => router.push("/")}>
        <div className="flex flex-col items-center gap-5 text-center py-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-white font-bold text-2xl">Password updated!</p>
          <p className="text-[#b3b3b3] text-sm">
            Your password has been changed successfully. You can now sign in with your new password.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-2 w-full bg-[#E50914] text-white font-semibold py-3 rounded text-sm hover:bg-[#f6121d] transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </Card>
    );
  }

  // ── Step 1: Email ─────────────────────────────────────────────────────────
  if (step === "email") {
    return (
      <Card onSignIn={() => router.push("/")}>
        <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
        <p className="text-[#b3b3b3] text-sm mb-8">
          Enter the email address linked to your account and we&apos;ll verify your identity.
        </p>
        <StepDots current={1} />

        <form onSubmit={handleEmailSubmit} noValidate className="flex flex-col gap-4">
          {error && (
            <div className="bg-[#e87c03] text-white text-sm px-4 py-3 rounded flex flex-col gap-1">
              <span>{error}</span>
              {error.includes("sign up") && (
                <button type="button" onClick={() => router.push("/signup")}
                  className="text-white underline font-semibold text-xs text-left">
                  Create an account →
                </button>
              )}
            </div>
          )}

          <FloatingInput
            id="email" name="email" type="email" label="Email address"
            value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
            autoComplete="email"
          />

          <button
            type="submit" disabled={loading}
            className="mt-2 w-full bg-[#E50914] text-white font-semibold py-3 rounded text-sm hover:bg-[#f6121d] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Checking…</>
            ) : "Continue"}
          </button>
        </form>

        <p className="mt-6 text-[#b3b3b3] text-sm">
          Remember it?{" "}
          <button onClick={() => router.push("/")} className="text-white font-semibold hover:underline">
            Sign in.
          </button>
        </p>
      </Card>
    );
  }

  // ── Step 2: Answer security question ─────────────────────────────────────
  if (step === "answer") {
    return (
      <Card onSignIn={() => router.push("/")}>
        <h1 className="text-3xl font-bold text-white mb-2">Verify Identity</h1>
        <p className="text-[#b3b3b3] text-sm mb-8">
          Answer the security question you set when you created your account.
        </p>
        <StepDots current={2} />

        <form onSubmit={handleAnswerSubmit} noValidate className="flex flex-col gap-4">
          {error && (
            <div className="bg-[#b20710] text-white text-sm px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Show the question as a read-only card */}
          <div className="bg-[#1a1a1a] border border-[#333] rounded px-4 py-3">
            <p className="text-[#8c8c8c] text-xs mb-1 uppercase tracking-widest">Your security question</p>
            <p className="text-white text-sm font-medium">{securityQuestion}</p>
          </div>

          <FloatingInput
            id="answer" name="answer" type="text" label="Your answer"
            value={answer} onChange={(e) => { setAnswer(e.target.value); setError(""); }}
            autoComplete="off"
          />
          <p className="text-[#555] text-xs -mt-2">Answer is case-insensitive.</p>

          <button
            type="submit" disabled={loading || !answer.trim()}
            className="mt-2 w-full bg-[#E50914] text-white font-semibold py-3 rounded text-sm hover:bg-[#f6121d] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Verifying…</>
            ) : "Verify Answer"}
          </button>
        </form>

        <button
          onClick={() => { setStep("email"); setError(""); }}
          className="mt-4 text-[#8c8c8c] text-xs hover:text-white underline transition-colors"
        >
          ← Back
        </button>
      </Card>
    );
  }

  // ── Step 3: Set new password ──────────────────────────────────────────────
  return (
    <Card onSignIn={() => router.push("/")}>
      <h1 className="text-3xl font-bold text-white mb-2">Set New Password</h1>
      <p className="text-[#b3b3b3] text-sm mb-8">
        Choose a strong new password for your account.
      </p>
      <StepDots current={3} />

      <form onSubmit={handleResetSubmit} noValidate className="flex flex-col gap-4">
        {error && (
          <div className="bg-[#b20710] text-white text-sm px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* New password */}
        <div className="relative">
          <input
            id="newPassword" name="newPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
            placeholder=" "
            className="peer w-full rounded bg-[#333] text-white px-4 pt-6 pb-2 pr-16 text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-[#aaa] transition-all"
          />
          <label htmlFor="newPassword" className="absolute left-4 top-4 text-[#8c8c8c] text-sm pointer-events-none transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]">
            New password
          </label>
          {newPassword.length > 0 && (
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c8c8c] text-xs font-semibold uppercase tracking-wide hover:text-white transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? "Hide" : "Show"}
            </button>
          )}
        </div>

        {/* Confirm new password */}
        <div className="relative">
          <input
            id="confirmPassword" name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
            placeholder=" "
            className="peer w-full rounded bg-[#333] text-white px-4 pt-6 pb-2 text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-[#aaa] transition-all"
          />
          <label htmlFor="confirmPassword" className="absolute left-4 top-4 text-[#8c8c8c] text-sm pointer-events-none transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-[10px]">
            Confirm new password
          </label>
        </div>

        <button
          type="submit" disabled={loading}
          className="mt-2 w-full bg-[#E50914] text-white font-semibold py-3 rounded text-sm hover:bg-[#f6121d] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Updating…</>
          ) : "Update Password"}
        </button>
      </form>

      <button
        onClick={() => { setStep("answer"); setError(""); }}
        className="mt-4 text-[#8c8c8c] text-xs hover:text-white underline transition-colors"
      >
        ← Back
      </button>
    </Card>
  );
}
