"use client";

import { useRouter } from "next/navigation";

interface BrowseNavbarProps {
  nickname: string | null;
  onAccountClick: () => void;
}

export default function BrowseNavbar({ nickname, onAccountClick }: BrowseNavbarProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-12 py-4 bg-gradient-to-b from-black via-black/80 to-transparent">
      {/* Logo */}
      <button
        onClick={() => router.push("/browse")}
        className="text-[#E50914] text-2xl sm:text-3xl font-extrabold tracking-tight select-none hover:opacity-90 transition-opacity"
      >
        RISHIFLIX
      </button>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Greeting — hidden on small screens */}
        {nickname && (
          <span className="hidden sm:block text-[#b3b3b3] text-sm">
            Hi, <span className="text-white font-semibold">{nickname}</span>
          </span>
        )}

        {/* Account button */}
        <button
          onClick={onAccountClick}
          aria-label="Open account menu"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 group"
        >
          {/* Avatar letter */}
          <span className="w-6 h-6 rounded-full bg-[#E50914] flex items-center justify-center text-white text-xs font-bold select-none">
            {nickname ? nickname[0].toUpperCase() : "R"}
          </span>
          <span className="hidden sm:inline">Account</span>
          {/* Chevron — rotates when sidebar opens */}
          <svg
            className="w-3.5 h-3.5 text-[#8c8c8c] group-hover:text-white transition-colors"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </header>
  );
}
