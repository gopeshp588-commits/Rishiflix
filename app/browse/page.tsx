"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import BrowseNavbar from "@/components/BrowseNavbar";
import Sidebar from "@/components/Sidebar";

// ── Top 20 globally trending movies (real posters via TMDB CDN) ──────────────
const TRENDING_MOVIES = [
  { id: 1,  title: "Dune: Part Two",              poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg" },
  { id: 2,  title: "Deadpool & Wolverine",         poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg" },
  { id: 3,  title: "Inside Out 2",                 poster: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg" },
  { id: 4,  title: "Kingdom of the Planet of the Apes", poster: "https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg" },
  { id: 5,  title: "Alien: Romulus",               poster: "https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg" },
  { id: 6,  title: "The Substance",               poster: "https://image.tmdb.org/t/p/w500/lqoMzCcZYEFK729d6qzt349fB4o.jpg" },
  { id: 7,  title: "Civil War",                   poster: "https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg" },
  { id: 8,  title: "Immaculate",                  poster: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg" },
  { id: 9,  title: "Gladiator II",                 poster: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg" },
  { id: 10, title: "Wicked",                       poster: "https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg" },
  { id: 11, title: "Oppenheimer",                  poster: "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg" },
  { id: 12, title: "Avengers: Endgame",            poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" },
  { id: 13, title: "The Dark Knight",              poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
  { id: 14, title: "Interstellar",                 poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
  { id: 15, title: "John Wick",                    poster: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg" },
  { id: 16, title: "RRR",                          poster: "https://image.tmdb.org/t/p/w500/mQBz0kkJw9gWW1accn1UIPVnvtL.jpg" },
  { id: 17, title: "Spider-Man: Into the Spider-Verse", poster: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg" },
  { id: 18, title: "Joker",                        poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg" },
  { id: 19, title: "Mad Max: Fury Road",           poster: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg" },
  { id: 20, title: "Pathaan",                      poster: "https://image.tmdb.org/t/p/w500/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg" },
];

const POPULAR_INDIA = [
  { id: 101, title: "Baahubali 2",          poster: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg" },
  { id: 102, title: "RRR",                  poster: "https://image.tmdb.org/t/p/w500/mQBz0kkJw9gWW1accn1UIPVnvtL.jpg" },
  { id: 103, title: "Pathaan",              poster: "https://image.tmdb.org/t/p/w500/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg" },
  { id: 104, title: "Baahubali 2",           poster: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg" },
  { id: 105, title: "3 Idiots",             poster: "https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg" },
  { id: 106, title: "Spider-Verse 2",       poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg" },
  { id: 107, title: "KGF: Chapter 2",       poster: "https://image.tmdb.org/t/p/w500/bQXAqRx2Fgc46uCVWgoPz5L5Dtr.jpg" },
  { id: 108, title: "Super Mario Bros",     poster: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg" },
];

const TOP_PICKS = [
  { id: 201, title: "Blade Runner 2049",         poster: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg" },
  { id: 202, title: "Guardians of the Galaxy",   poster: "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg" },
  { id: 203, title: "Pulp Fiction",              poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg" },
  { id: 204, title: "Fight Club",                poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg" },
  { id: 205, title: "Forrest Gump",              poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg" },
  { id: 206, title: "The Matrix",                poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg" },
  { id: 207, title: "Spider-Verse 2",            poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg" },
  { id: 208, title: "Super Mario Bros Movie",    poster: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg" },
];

// ── Types ────────────────────────────────────────────────────────────────────
interface Movie {
  id: number;
  title: string;
  poster: string;
}

// ── Poster card ──────────────────────────────────────────────────────────────
function PosterCard({ movie }: { movie: Movie }) {
  const [failed, setFailed] = useState(false);
  const src = `/api/poster?url=${encodeURIComponent(movie.poster)}`;

  return (
    <div className="group relative flex-shrink-0 w-32 sm:w-40 md:w-44 aspect-[2/3] rounded-lg overflow-hidden cursor-pointer bg-[#2a2a2a]">
      {failed ? (
        <div className="w-full h-full flex items-center justify-center text-white/40 text-xs text-center p-2">
          {movie.title}
        </div>
      ) : (
        <img
          src={src}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end p-2 opacity-0 group-hover:opacity-100">
        <p className="text-white text-xs font-semibold line-clamp-2 drop-shadow">{movie.title}</p>
      </div>
    </div>
  );
}

// ── Scrollable movie row ─────────────────────────────────────────────────────
function MovieRow({ movies, loading }: { movies: Movie[]; loading?: boolean }) {
  const rowRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-32 sm:w-40 md:w-44 aspect-[2/3] rounded-lg bg-[#2a2a2a] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div ref={rowRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {movies.map((m) => <PosterCard key={m.id} movie={m} />)}
    </div>
  );
}

// ── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-white font-bold text-lg sm:text-xl mb-4 flex items-center gap-2">
      {children}
    </h2>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function BrowsePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  // Read nickname
  useEffect(() => {
    const saved = sessionStorage.getItem("rishiflix_nickname");
    if (saved) setNickname(saved);
  }, []);

  // Load trending — fetch fresh on sign-in, use cache on reload
  useEffect(() => {
    const CACHE_KEY = "rishiflix_trending";
    const CACHE_TS_KEY = "rishiflix_trending_ts";
    const SESSION_FLAG = "rishiflix_trending_loaded";

    const alreadyLoadedThisSession = sessionStorage.getItem(SESSION_FLAG);
    const cached = sessionStorage.getItem(CACHE_KEY);

    if (alreadyLoadedThisSession && cached) {
      // Reload — use cached data, no refetch
      setTrendingMovies(JSON.parse(cached));
      setTrendingLoading(false);
      return;
    }

    // First load after sign-in — "fetch" fresh trending list
    // (Using our curated list as the source of truth since no API key is needed)
    const fetchTrending = async () => {
      // Simulate a brief loading moment so it feels like a real fetch
      await new Promise((r) => setTimeout(r, 800));
      setTrendingMovies(TRENDING_MOVIES);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(TRENDING_MOVIES));
      sessionStorage.setItem(CACHE_TS_KEY, Date.now().toString());
      sessionStorage.setItem(SESSION_FLAG, "true");
      setTrendingLoading(false);
    };

    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <BrowseNavbar
        nickname={nickname}
        onAccountClick={() => setSidebarOpen(true)}
      />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        nickname={nickname}
      />

      <main className="pt-20 px-4 sm:px-8 md:px-12 pb-16">

        {/* ── Hero banner ── */}
        <section className="relative w-full h-[52vw] max-h-[580px] min-h-[260px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-end mb-12">
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/30 to-transparent" />
          <div className="relative z-10 p-6 sm:p-10 md:p-14">
            <p className="text-[#E50914] text-xs font-bold uppercase tracking-widest mb-2">Featured Today</p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
              Welcome to RishiFlix
            </h1>
            <p className="text-[#b3b3b3] text-sm sm:text-base max-w-lg mb-6">
              Your personal streaming universe. Browse movies, build your favourites, and enjoy.
            </p>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-white/90 active:scale-95 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Play
              </button>
              <button className="flex items-center gap-2 bg-white/20 text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-white/30 active:scale-95 transition-all backdrop-blur-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                More Info
              </button>
            </div>
          </div>
        </section>

        {/* ── Trending Now ── */}
        <section className="mb-10">
          <SectionHeading>
            <span className="text-[#E50914]">🔥</span> Trending Now
            {trendingLoading && (
              <span className="ml-2 text-xs text-[#8c8c8c] font-normal animate-pulse">Loading…</span>
            )}
          </SectionHeading>
          <MovieRow movies={trendingMovies} loading={trendingLoading} />
        </section>

        {/* ── Continue Watching ── */}
        <section className="mb-10">
          <SectionHeading>▶ Continue Watching</SectionHeading>
          <div className="flex items-center justify-center h-28 rounded-xl border border-dashed border-white/15 bg-white/5">
            <p className="text-[#8c8c8c] text-sm">
              Movies you start watching will appear here.
            </p>
          </div>
        </section>

        {/* ── Popular in India ── */}
        <section className="mb-10">
          <SectionHeading>
            <span>🇮🇳</span> Popular in India
          </SectionHeading>
          <MovieRow movies={POPULAR_INDIA} />
        </section>

        {/* ── Top Picks for You ── */}
        <section className="mb-10">
          <SectionHeading>⭐ Top Picks for You</SectionHeading>
          <MovieRow movies={TOP_PICKS} />
        </section>

        {/* ── Explore All Genres button ── */}
        <section className="flex justify-center mt-4 mb-6">
          <button
            onClick={() => router.push("/browse/genres")}
            className="group relative flex items-center gap-3 bg-transparent border-2 border-[#E50914] text-white font-bold px-10 py-4 rounded-full text-base overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(229,9,20,0.5)] active:scale-95"
          >
            {/* Animated red fill on hover */}
            <span className="absolute inset-0 bg-[#E50914] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
            {/* Icon */}
            <svg
              className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="relative z-10">Explore All Genres</span>
            <svg
              className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </section>

      </main>
    </div>
  );
}
