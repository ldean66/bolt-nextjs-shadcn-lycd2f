import { Heart, Quote } from 'lucide-react';

// Excerpts from the community messages supplied for the website.
const messages = [
  {
    name: 'Sandra',
    quote: 'I am so happy I was able to come! I had several heart-felt moments during various parts of the event. You are doing such wonderful work. Thank you for inviting me.',
  },
  {
    name: 'Pamela',
    quote: 'I thoroughly enjoyed myself, such a beautiful event! You did an amazing job.',
  },
  {
    name: 'Nicole R',
    quote: "Thank you guys so much for having me it was a delightful time as usual I'm so happy to be a part of such a great cause",
  },
  {
    name: 'Monica P',
    quote: 'This is so awesome, and I’m so glad I was a part of it ❤️',
  },
  {
    name: 'Paula M.',
    quote: 'Today was so awesome!! The family love was truly hovering in the room!!',
  },
  {
    name: 'Viola',
    quote: 'I look forward in participating again next year.',
  },
  {
    name: 'Sharon W.',
    quote: 'The show was a blast as well. Thanks for including me as well.',
  },
  {
    name: 'Paula J.',
    quote: 'I thank you for having me to be part of your event. I am always honored for the invitation.',
  },
  {
    name: 'Stephanie',
    quote: "Hey Sis! So proud of you!!! You're amazing and more than a conqueror!! 💙",
  },
];

export default function GratitudeSection() {
  return (
    <section
      id="what-people-are-saying"
      aria-labelledby="gratitude-heading"
      className="scroll-mt-24 bg-pink-50/60 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-pink-700">
            <Heart className="h-4 w-4" aria-hidden="true" />
            From our community
          </span>
          <h2 id="gratitude-heading" className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What people are saying
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Moments of joy, connection, and gratitude — in the words of the people who shared them with us.
          </p>
        </div>

        <figure className="relative mb-6 overflow-hidden rounded-3xl bg-pink-900 px-6 py-10 text-white sm:px-12 sm:py-12">
          <Quote className="mb-5 h-9 w-9 text-pink-300" aria-hidden="true" />
          <blockquote className="max-w-4xl text-xl font-medium leading-relaxed sm:text-2xl sm:leading-relaxed">
            <p>
              “I felt the Joy in their victories. I felt Free in being me and to lay down my burdens for awhile.
              The hugs, the tears, and the laughter wrapped themselves around me. The Love and Healing vibes.”
            </p>
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 text-base font-semibold text-pink-100">
            <span className="h-px w-8 bg-pink-300" aria-hidden="true" />
            Loretta
          </figcaption>
        </figure>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {messages.map((message) => (
            <figure key={message.name} className="flex flex-col rounded-2xl border border-pink-100 bg-white p-6 shadow-sm sm:p-7">
              <Quote className="mb-4 h-6 w-6 text-pink-600" aria-hidden="true" />
              <blockquote className="flex-1 text-base leading-7 text-gray-700">
                <p>“{message.quote}”</p>
              </blockquote>
              <figcaption className="mt-6 border-t border-pink-100 pt-4 text-sm font-semibold text-pink-800">
                {message.name}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-center text-sm leading-6 text-gray-500">
          Excerpts from messages shared with More Than Conquerors.
        </p>
      </div>
    </section>
  );
}
