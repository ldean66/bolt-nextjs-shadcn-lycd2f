'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Play } from 'lucide-react';

export default function FeaturedInterview() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const player = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isPlayerOpen) player.current?.focus();
  }, [isPlayerOpen]);

  return (
    <article id="lydia-interview" className="mb-10 overflow-hidden rounded-3xl border border-pink-200 bg-white shadow-lg">
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        <div className="flex items-center bg-pink-50 p-4 sm:p-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-950">
            {isPlayerOpen ? (
              <iframe
                ref={player}
                src="https://www.youtube-nocookie.com/embed/xALHifmqVyc?playsinline=1"
                title="DMV Doers: DMV woman supports cancer survivors — DC News Now interview with Lydia Dean-Reese"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsPlayerOpen(true)}
                aria-label="Watch the interview with Lydia Dean-Reese"
                className="group absolute inset-0 h-full w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-pink-500"
              >
                <Image src="/img/lydia-interview.jpg" alt="Lydia Dean-Reese's interview on DC News Now" fill sizes="(max-width: 1023px) 90vw, 600px" className="object-cover opacity-90 transition-opacity group-hover:opacity-100" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-pink-700 shadow-lg transition-transform motion-safe:group-hover:scale-110">
                    <Play className="ml-1 h-7 w-7 fill-current" aria-hidden="true" />
                  </span>
                </span>
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/75 px-4 py-2 text-sm font-semibold text-white">Watch the interview</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-pink-700">Featured Interview · DC News Now</p>
          <h3 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">The Heart Behind Our Mission</h3>
          <p className="mt-4 text-base leading-7 text-gray-600">Hear founder Lydia Dean-Reese share the purpose behind More Than Conquerors and its work supporting people affected by breast cancer.</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 text-sm font-semibold">
            <Link href="/board/lydia-dean-reese" className="inline-flex items-center gap-1.5 rounded-full bg-pink-600 px-5 py-3 text-white hover:bg-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-4">
              Meet Lydia <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href="https://www.youtube.com/watch?v=xALHifmqVyc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-pink-700 underline-offset-4 hover:underline">
              Watch on YouTube <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
