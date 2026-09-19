"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import BackgroundPosters from "@/components/BackgroundPosters";
import RishiflixIntro from "@/components/RishiflixIntro";

export default function Home() {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);

  return (
    <>
      {showIntro && (
        <RishiflixIntro
          onComplete={() => {
            setShowIntro(false);
            // Save nickname for the browse page to read
            if (nickname) sessionStorage.setItem("rishiflix_nickname", nickname);
            else sessionStorage.removeItem("rishiflix_nickname");
            router.push("/browse");
          }}
        />
      )}

      <main className="relative min-h-screen w-full flex flex-col">
        <BackgroundPosters />

        {/* Navbar */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12 py-6 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
          <span className="text-[#E50914] text-3xl sm:text-4xl font-extrabold tracking-tight select-none">
            RISHIFLIX
          </span>
          {!signedIn && !showIntro && (
            <button
              onClick={() => router.push("/signup")}
              className="bg-[#E50914] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#f6121d] transition-colors"
            >
              Sign Up
            </button>
          )}
        </header>

        {/* Sign In Card */}
        <section className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-md bg-black/75 rounded-lg px-8 sm:px-10 py-12 backdrop-blur-sm">
            {signedIn ? (
              /* Welcome card shown after intro completes */
              <div className="flex flex-col items-center gap-5 py-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white font-bold text-2xl">
                  {nickname ? `Welcome back, ${nickname}! 🎉` : "Welcome back! 🎉"}
                </p>
                <p className="text-[#b3b3b3] text-sm">You&apos;re signed in. Enjoy RishiFlix!</p>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-white mb-8">Sign In</h1>
                <LoginForm
                  onSignedIn={(nick) => {
                    setNickname(nick ?? null);
                    setShowIntro(true);
                  }}
                />
                <p className="mt-6 text-[#b3b3b3] text-sm">
                  New to RishiFlix?{" "}
                  <button
                    onClick={() => router.push("/signup")}
                    className="text-white font-semibold hover:underline"
                  >
                    Sign up now.
                  </button>
                </p>
                <p className="mt-4 text-xs text-[#737373]">
                  This page is protected by Google reCAPTCHA to ensure you&apos;re
                  not a bot.{" "}
                  <a href="#" className="text-[#0071eb] hover:underline">
                    Learn more.
                  </a>
                </p>
              </>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 bg-black/75 text-[#737373] text-xs px-6 sm:px-12 py-10 mt-auto border-t border-[#222]">
          <p className="mb-4">Questions? Call 1-800-RISHIFLIX</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              "FAQ", "Help Centre", "Account", "Media Centre",
              "Investor Relations", "Jobs", "Cookie Preferences",
              "Privacy", "Terms of Use", "Contact Us",
            ].map((link) => (
              <a key={link} href="#" className="hover:underline">{link}</a>
            ))}
          </div>
          <p>© {new Date().getFullYear()} RishiFlix. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
