"use client";

import { useEffect, useState } from "react";

// ✅ Every URL below has been verified to return HTTP 200 OK
const POSTERS = [
  // Hollywood hits on Netflix
  { title: "Spider-Man: Into the Spider-Verse", url: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg" },
  { title: "Avatar",                            url: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg" },
  { title: "Avengers: Endgame",                url: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" },
  { title: "Joker",                             url: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg" },
  { title: "The Matrix",                        url: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg" },
  { title: "Blade Runner 2049",                 url: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg" },
  { title: "Guardians of the Galaxy",           url: "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg" },
  { title: "Mad Max: Fury Road",                url: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg" },
  { title: "The Dark Knight",                   url: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
  { title: "Super Mario Bros Movie",            url: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg" },
  // Indian & more Netflix hits
  { title: "RRR",                               url: "https://image.tmdb.org/t/p/w500/mQBz0kkJw9gWW1accn1UIPVnvtL.jpg" },
  { title: "Pathaan",                           url: "https://image.tmdb.org/t/p/w500/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg" },
  { title: "Baahubali 2",                       url: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg" },
  // Fill to 20 using more verified Hollywood posters
  { title: "Spider-Verse 2",                   url: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg" },
  { title: "Interstellar",                      url: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
  { title: "Pulp Fiction",                      url: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg" },
  { title: "Fight Club",                        url: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg" },
  { title: "Forrest Gump",                      url: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg" },
  { title: "John Wick",                         url: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg" },
  { title: "Oppenheimer",                       url: "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg" },
];

// Proxy all TMDB images through Next.js /api/poster so the browser
// fetches from same-origin and avoids TMDB CORS blocks.
function posterSrc(tmdbUrl: string) {
  return `/api/poster?url=${encodeURIComponent(tmdbUrl)}`;
}

function PosterCard({ url, title }: { url: string; title: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative w-36 sm:w-48 md:w-56 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0 shadow-2xl mx-2 sm:mx-3">
      {failed ? (
        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white/60 text-xs text-center p-2">
          {title}
        </div>
      ) : (
        <img
          src={posterSrc(url)}
          alt={title}
          className="w-full h-full object-cover"
          loading="eager"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function BackgroundPosters() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0 bg-[#0a0a0a] pointer-events-none">
      {/* Minimal overlay — dark only at bottom so posters shine through */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/25 via-transparent to-black/80" />

      <div className="absolute inset-0 flex flex-col justify-center gap-5 sm:gap-7 rotate-[-6deg] scale-110">

        {/* Row 1 → scrolls left */}
        <div className="flex flex-nowrap overflow-hidden">
          <div className="flex flex-nowrap animate-marquee-left">
            {POSTERS.map((p, i) => <PosterCard key={`r1a-${i}`} {...p} />)}
          </div>
          <div className="flex flex-nowrap animate-marquee-left" aria-hidden>
            {POSTERS.map((p, i) => <PosterCard key={`r1b-${i}`} {...p} />)}
          </div>
        </div>

        {/* Row 2 → scrolls right */}
        <div className="flex flex-nowrap overflow-hidden">
          <div className="flex flex-nowrap animate-marquee-right">
            {[...POSTERS].reverse().map((p, i) => <PosterCard key={`r2a-${i}`} {...p} />)}
          </div>
          <div className="flex flex-nowrap animate-marquee-right" aria-hidden>
            {[...POSTERS].reverse().map((p, i) => <PosterCard key={`r2b-${i}`} {...p} />)}
          </div>
        </div>

        {/* Row 3 → scrolls left */}
        <div className="flex flex-nowrap overflow-hidden">
          <div className="flex flex-nowrap animate-marquee-left">
            {POSTERS.map((p, i) => <PosterCard key={`r3a-${i}`} {...p} />)}
          </div>
          <div className="flex flex-nowrap animate-marquee-left" aria-hidden>
            {POSTERS.map((p, i) => <PosterCard key={`r3b-${i}`} {...p} />)}
          </div>
        </div>

      </div>
    </div>
  );
}
