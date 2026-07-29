import LoginForm from "@/components/LoginForm";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col">
      {/* Cinematic gradient background — replace with a real Image once you have an asset */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #0d0d0d 0%, #1a0a0a 30%, #0d0a1a 60%, #0a0d0d 100%)",
        }}
        aria-hidden="true"
      >
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12 py-6 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <span className="text-[#E50914] text-3xl sm:text-4xl font-extrabold tracking-tight select-none">
          RISHIFLIX
        </span>
        <a
          href="#"
          className="bg-[#E50914] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#f6121d] transition-colors"
        >
          Sign In
        </a>
      </header>

      {/* Login Card */}
      <section className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-black/75 rounded-lg px-8 sm:px-10 py-12 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white mb-8">Sign In</h1>

          <LoginForm />

          <p className="mt-6 text-[#b3b3b3] text-sm">
            New to RishiFlix?{" "}
            <a href="#" className="text-white font-semibold hover:underline">
              Sign up now.
            </a>
          </p>

          <p className="mt-4 text-xs text-[#737373]">
            This page is protected by Google reCAPTCHA to ensure you&apos;re
            not a bot.{" "}
            <a href="#" className="text-[#0071eb] hover:underline">
              Learn more.
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/75 text-[#737373] text-xs px-6 sm:px-12 py-10 mt-auto border-t border-[#222]">
        <p className="mb-4">Questions? Call 1-800-RISHIFLIX</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            "FAQ",
            "Help Centre",
            "Account",
            "Media Centre",
            "Investor Relations",
            "Jobs",
            "Cookie Preferences",
            "Privacy",
            "Terms of Use",
            "Contact Us",
          ].map((link) => (
            <a key={link} href="#" className="hover:underline">
              {link}
            </a>
          ))}
        </div>
        <p>© {new Date().getFullYear()} RishiFlix. All rights reserved.</p>
      </footer>
    </main>
  );
}
