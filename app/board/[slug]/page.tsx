import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Play } from 'lucide-react';
import { boardMembers } from '@/lib/board-members';

type BoardProfileProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return boardMembers.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: BoardProfileProps): Promise<Metadata> {
  const { slug } = await params;
  const member = boardMembers.find((person) => person.slug === slug);
  if (!member) notFound();

  const description = `Meet ${member.name}, ${member.role.toLowerCase()} at More Than Conquerors. Read her biography and get to know the women behind the mission.`;
  return {
    title: member.name,
    description,
    alternates: { canonical: `/board/${member.slug}` },
    openGraph: {
      type: 'profile',
      title: `${member.name} | More Than Conquerors`,
      description,
      url: `/board/${member.slug}`,
      images: [{ url: member.image, alt: member.alt }],
    },
    twitter: {
      card: 'summary',
      title: `${member.name} | More Than Conquerors`,
      description,
      images: [member.image],
    },
  };
}

export default async function BoardProfilePage({ params }: BoardProfileProps) {
  const { slug } = await params;
  const member = boardMembers.find((person) => person.slug === slug);
  if (!member) notFound();

  return (
    <main className="min-h-[65vh] bg-gradient-to-b from-pink-50/70 via-white to-white px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link href="/#board-members" className="inline-flex items-center gap-2 rounded text-sm font-semibold text-pink-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-4">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Board Members
        </Link>
        <article className="mt-8 grid gap-8 overflow-hidden rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14 lg:p-12">
          <div className="relative mx-auto aspect-square w-full max-w-[340px] self-start overflow-hidden rounded-3xl bg-gradient-to-b from-pink-50 to-white">
            <Image src={member.image} alt={member.alt} fill priority sizes="(max-width: 639px) 85vw, 340px" className="object-contain object-bottom" />
          </div>
          <div className="self-center">
            <p className="text-sm font-semibold tracking-wide text-pink-700">{member.role}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">{member.name}</h1>
            <div className="my-6 h-1 w-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-400" />
            <p className="text-base leading-8 text-gray-600 sm:text-lg">{member.bio}</p>
            {member.slug === 'lydia-dean-reese' ? (
              <Link href="/#lydia-interview" className="mt-8 flex items-center gap-4 rounded-2xl border border-pink-100 bg-pink-50 p-5 text-pink-800 transition-colors hover:bg-pink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-4">
                <Play className="h-6 w-6 shrink-0" aria-hidden="true" />
                <span>
                  <span className="block font-semibold">The Heart Behind Our Mission</span>
                  <span className="mt-1 block text-sm">Watch Lydia&apos;s interview with DC News Now</span>
                </span>
                <ArrowUpRight className="ml-auto h-5 w-5 shrink-0" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </article>
      </div>
    </main>
  );
}
