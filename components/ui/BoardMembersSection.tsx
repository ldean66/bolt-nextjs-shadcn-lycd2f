'use client';

import Image from 'next/image';
import { UsersRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type BoardMember = {
  name: string;
  bio: string;
  image: string;
  alt: string;
};

const boardMembers: BoardMember[] = [
  {
    name: 'Lydia Dean-Reese',
    bio:
      'Lydia is the founder and executive director of More Than Conquerors. She is a veteran legal professional who has worked at some of DC\'s premier law firms. Lydia has served in the fashion industry for decades, and as a result she is also a master stylist. In her spare time she loves to read, scrapbook and travel. She has the gift of hospitality and service, loves the Lord, and is a breast cancer conqueror (survivor) herself.',
    image: '/img/board/Lydia Reese.png',
    alt: 'Portrait of Lydia Dean-Reese',
  },
  {
    name: 'Chevelle Jackson',
    bio:
      'Chevelle has worked in the hospitality industry for more than 20 years with a business degree from Morgan State University. She brings a wealth of professional corporate experience as a certified event planner and leading a wedding ministry in her church for over 20 years. In her spare time, she enjoys traveling, fine dining, concerts, volunteering and spending time with family and friends.',
    image: '/img/board/Chevelle Jackson.png',
    alt: 'Portrait of Chevelle Jackson',
  },
  {
    name: 'Deirdre Adams',
    bio:
      'Deirdre is a native of Harrisburg, PA and lived in the DMV area for the majority of her adult life. With a career in finance for over 30 years, she knows how to support organizations in their financial efforts to help support others. In her spare time she loves to read and volunteer at the hospital supporting sick children and their families.',
    image: '/img/board/Deirdre Adams.png',
    alt: 'Portrait of Deirdre Adams',
  },
  {
    name: 'Janet Mosby',
    bio:
      'With a strong passion for helping individuals diagnosed with cancer face their battle with faith over fear, Janet is overjoyed to join MTC. Having been a caregiver for a family member with cancer, she understands the challenges and is committed to supporting others through their journey. Janet has also done extensive volunteer work in the cancer community, firmly believing that with God, all things are possible and that we are more than conquerors.',
    image: '/img/board/Janet Mosby.png',
    alt: 'Portrait of Janet Mosby',
  },
  {
    name: 'Jackie Bromfield',
    bio:
      'Jackie is a dedicated realtor with Coldwell Banker, serving clients across all life stages, from first-time buyers to seasoned investors with market expertise and a client-first approach. She also advocates passionately for families navigating the school system, reflecting her commitment to both community and client success.',
    image: '/img/board/Jackie Bromfield.png',
    alt: 'Portrait of Jackie Bromfield',
  },
  {
    name: 'Linda Goodman',
    bio:
      'Linda is a believer in the Lord Jesus Christ and a conqueror. She loves to read and has a heart of giving and pouring into others.',
    image: '/img/board/Linda Goodman.png',
    alt: 'Portrait of Linda Goodman',
  },
  {
    name: 'Kathy DeJesus',
    bio:
      'Kathy is a healthcare professional who also teaches in her field. She loves to read, knit and crochet. She is a breast cancer conqueror.',
    image: '/img/board/Kathy DeJesus.png',
    alt: 'Portrait of Kathy DeJesus',
  },
  {
    name: 'Doreen Doye',
    bio:
      'Doreen is a retired MCPS financial specialist. In her spare time, she enjoys cooking and crafting and always looking for opportunities to volunteer and help others. She is a breast cancer conqueror.',
    image: '/img/board/Doreen Doye.png',
    alt: 'Portrait of Doreen Doye',
  },
];

function BoardCard({ member }: { member: BoardMember }) {
  return (
    <Card className="group overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="h-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500" />
      <CardContent className="p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="relative aspect-square w-full max-w-[240px]">
              <Image
                src={member.image}
                alt={member.alt}
                fill
                className="object-contain object-center"
                sizes="(max-width: 640px) 70vw, 240px"
              />
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-[1.9rem]">
              {member.name}
            </h3>
            <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 lg:mx-0" />
            <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-[0.98rem]">
              {member.bio}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BoardMembersSection() {
  return (
    <section id="board-members" className="bg-gradient-to-b from-white via-blue-50/30 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-pink-200 bg-white px-5 py-2.5 text-base font-semibold tracking-wide text-pink-700 shadow-sm sm:text-lg">
              <UsersRound className="h-5 w-5" />
              Board Members
            </div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Meet the women behind the mission
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {boardMembers.map((member) => (
              <BoardCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
