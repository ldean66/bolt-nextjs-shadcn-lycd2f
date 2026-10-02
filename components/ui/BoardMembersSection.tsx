import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, UsersRound } from 'lucide-react';
import { boardMembers } from '@/lib/board-members';

export default function BoardMembersSection() {
  return (
    <section id="board-members" className="bg-gradient-to-b from-white via-blue-50/30 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-pink-200 bg-white px-5 py-2.5 text-base font-semibold tracking-wide text-pink-700 shadow-sm sm:text-lg">
              <UsersRound className="h-5 w-5" aria-hidden="true" />
              Board Members
            </div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Meet the women behind the mission</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
              Get to know the women who bring their experience, compassion, and commitment to More Than Conquerors.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {boardMembers.map((member) => (
              <Link
                key={member.slug}
                href={`/board/${member.slug}`}
                aria-label={`Read ${member.name}'s biography`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-4"
              >
                <div className="relative mx-5 mt-5 aspect-square overflow-hidden rounded-2xl bg-gradient-to-b from-pink-50 to-white">
                  <Image src={member.image} alt={member.alt} fill className="object-contain object-bottom" sizes="(max-width: 639px) 85vw, (max-width: 1023px) 40vw, 240px" />
                </div>
                <div className="flex flex-1 flex-col p-6 text-center">
                  <h3 className="text-xl font-semibold tracking-tight text-gray-900">{member.name}</h3>
                  <p className="mt-2 text-sm font-medium text-pink-700">{member.role}</p>
                  <span className="mt-auto inline-flex items-center justify-center gap-1.5 pt-6 text-sm font-semibold text-gray-700 group-hover:text-pink-700">
                    Read Biography <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
