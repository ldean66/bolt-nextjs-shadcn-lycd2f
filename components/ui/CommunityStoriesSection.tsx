'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, HeartHandshake, Newspaper } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type CommunityStory = {
  id: string;
  title: string;
  description: string;
  mediaType: 'instagram-embed' | 'image';
  mediaSrc?: string;
  embedUrl?: string;
  postUrl: string;
  alt: string;
  badge: string;
};

type NewsHighlight = {
  id: string;
  title: string;
  source: string;
  description: string;
  badge: string;
  publishedAt: string;
  publishedLabel: string;
  links: Array<{
    label: string;
    href: string;
  }>;
  logos?: Array<{
    src: string;
    alt: string;
    href: string;
  }>;
};

const newsHighlights: NewsHighlight[] = [
  {
    id: 'press-mention',
    title: 'Featured in the News',
    source: 'Montgomery County Volunteer News',
    description:
      'More Than Conquerors was mentioned in the February/March 2026 newsletter, recognizing the organization\'s community impact and volunteer spirit for MLK Day.',
    publishedAt: '2026-03-01',
    publishedLabel: 'Uploaded March 1, 2026',
    links: [
      {
        label: 'Read the Newsletter',
        href: 'https://myemail.constantcontact.com/Montgomery-County-Volunteer-News---February-March-2026.html?soid=1102184431012&aid=39eYz2nqExY',
      },
    ],
    badge: 'Press Mention',
  },
  {
    id: 'volunteer-communities',
    title: 'Lydia joins two volunteer communities',
    source: 'Community Partnership Update',
    description:
      'Lydia has joined the Sidney Kimmel Comprehensive Cancer Center and National Breast Cancer Foundation volunteer communities, extending the organization\'s connection to mission-aligned support networks and survivor advocacy spaces.',
    publishedAt: '2026-04-17',
    publishedLabel: 'Uploaded April 17, 2026',
    links: [
      {
        label: 'Sidney Kimmel Community',
        href: 'https://www.hopkinsmedicine.org/kimmel-cancer-center',
      },
      {
        label: 'National Breast Cancer Foundation',
        href: 'https://www.nationalbreastcancer.org/',
      },
    ],
    logos: [
      {
        src: '/img/johnHopkins.png',
        alt: 'Johns Hopkins Medicine Sidney Kimmel Comprehensive Cancer Center logo',
        href: 'https://www.hopkinsmedicine.org/kimmel-cancer-center',
      },
      {
        src: '/img/nbcfInc.png',
        alt: 'National Breast Cancer Foundation logo',
        href: 'https://www.nationalbreastcancer.org/',
      },
    ],
    badge: 'Volunteer Community',
  },
];

const sortedNewsHighlights = [...newsHighlights].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

const communityStories: CommunityStory[] = [
  {
    id: 'instagram-video',
    title: 'Community Moment',
    description:
      'A short video highlighting the heart of the organization and the people who make the mission possible.',
    mediaType: 'instagram-embed',
    embedUrl: 'https://www.instagram.com/reel/DVuGDKKEYlH/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==',
    postUrl: 'https://www.instagram.com/reel/DVuGDKKEYlH/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==',
    alt: 'Community video preview for More Than Conquerors',
    badge: 'Featured Moment',
  },
  {
    id: 'thank-you-post',
    title: 'Thank You Note',
    description:
      'A gratitude story screenshot thanking one of the board members and showing gifts shared by the organization.',
    mediaType: 'image',
    mediaSrc: '/img/community-post.JPG',
    postUrl: 'https://www.instagram.com/more_than_conquerors25/',
    alt: 'Community story screenshot thanking a board member and showing gifts from More Than Conquerors',
    badge: 'Community Note',
  },
];

function useInstagramEmbedScript() {
  useEffect(() => {
    const scriptId = 'instagram-embed-script';

    if (document.getElementById(scriptId)) {
      // Re-run parsing in case the page was navigated client-side.
      // @ts-expect-error Instagram injects this global.
      window.instgrm?.Embeds?.process?.();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.defer = true;
    script.src = 'https://www.instagram.com/embed.js';
    script.onload = () => {
      // @ts-expect-error Instagram injects this global.
      window.instgrm?.Embeds?.process?.();
    };
    document.body.appendChild(script);

    return () => {
      // Keep the script in place for subsequent client-side navigations.
    };
  }, []);
}

function StoryMedia({ story }: { story: CommunityStory }) {
  return (
    <div className="relative overflow-visible rounded-2xl border border-pink-100 bg-white shadow-inner">
      <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        <HeartHandshake className="h-3.5 w-3.5" />
        {story.badge}
      </div>

      {story.mediaType === 'instagram-embed' ? (
        <div className="bg-white p-4">
          <div className="mx-auto w-full max-w-[540px]">
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={story.embedUrl}
              data-instgrm-version="14"
              style={{
                background: '#FFF',
                border: 0,
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                margin: 0,
                minWidth: '0',
                maxWidth: '540px',
                padding: 0,
                width: '100%',
              }}
            >
              <a href={story.postUrl} target="_blank" rel="noopener noreferrer">
                View this post on Instagram
              </a>
            </blockquote>
          </div>
        </div>
      ) : (
        <div className="bg-pink-100 p-4">
          <Image
            src={story.mediaSrc ?? '/img/photo.jpeg'}
            alt={story.alt}
            width={1290}
            height={2251}
            className="mx-auto h-auto w-full max-w-[540px] rounded-xl object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default function CommunityStoriesSection() {
  useInstagramEmbedScript();

  return (
    <section id="community-stories" className="bg-gradient-to-b from-white via-pink-50/40 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-pink-200 bg-white px-5 py-2.5 text-base font-semibold tracking-wide text-pink-700 shadow-sm sm:text-lg">
              <HeartHandshake className="h-5 w-5" />
              Community Stories
            </div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Moments of gratitude and support
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
              A curated look at recognition, shared moments, and the impact of the mission beyond the event gallery.
            </p>
          </div>

          <div className="mb-10 grid gap-6 lg:grid-cols-2">
            {sortedNewsHighlights.map((highlight) => (
              <Card key={highlight.id} className="overflow-hidden rounded-3xl border border-pink-100 bg-white/95 shadow-xl">
                <CardContent className="flex h-full flex-col p-6 sm:p-8">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700">
                      <Newspaper className="h-4 w-4" />
                      {highlight.badge}
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                      {highlight.publishedLabel}
                    </p>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">{highlight.title}</h3>
                  <p className="mt-3 text-base leading-7 text-gray-600">{highlight.description}</p>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-gray-500">{highlight.source}</p>

                  {highlight.logos ? (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {highlight.logos.map((logo) => (
                        <a
                          key={logo.alt}
                          href={logo.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center rounded-2xl border border-pink-100 bg-pink-50/60 p-4 transition-colors hover:bg-pink-50"
                        >
                          <Image
                            src={logo.src}
                            alt={logo.alt}
                            width={300}
                            height={200}
                            className="h-auto max-h-28 w-auto object-contain"
                          />
                        </a>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-wrap gap-3">
                    {highlight.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'inline-flex items-center gap-2 rounded-full border border-pink-700 bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-colors',
                          'hover:bg-pink-700 hover:shadow-lg'
                        )}
                      >
                        {link.label}
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Carousel
            opts={{ align: 'start', loop: false }}
            className="relative mx-auto max-w-5xl"
          >
            <CarouselContent className="-ml-4">
              {communityStories.map((story) => (
                <CarouselItem key={story.id} className="pl-4 basis-full">
                  <Card className="mx-auto h-full max-w-3xl overflow-visible rounded-3xl border border-pink-100 bg-white/95 shadow-xl">
                    <CardContent className="flex h-full flex-col p-4 sm:p-5">
                      <StoryMedia story={story} />

                      <div className="flex h-full flex-col p-2 pt-5">
                        <div className="mb-3 inline-flex w-fit items-center rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pink-700">
                          {story.title}
                        </div>
                        <p className="text-sm leading-6 text-gray-600">{story.description}</p>

                        <div className="mt-5 flex items-center justify-between gap-4">
                          <a
                            href={story.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'inline-flex items-center gap-2 rounded-full border border-pink-700 bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors',
                              'hover:bg-pink-700 hover:shadow-lg'
                            )}
                          >
                            Open Story
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              variant="default"
              className="-left-5 hidden md:flex h-11 w-11 border-2 border-pink-700 bg-pink-600 text-white shadow-2xl transition-all hover:bg-pink-700 hover:scale-105"
            />
            <CarouselNext
              variant="default"
              className="-right-5 hidden md:flex h-11 w-11 border-2 border-pink-700 bg-pink-600 text-white shadow-2xl transition-all hover:bg-pink-700 hover:scale-105"
            />
          </Carousel>
          
        </div>
      </div>
    </section>
  );
}
