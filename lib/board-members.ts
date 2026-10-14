export type BoardMember = {
  slug: string;
  role: string;
  name: string;
  bio: string;
  image: string;
  alt: string;
  introVideo?: string;
};

export const boardMembers: BoardMember[] = [
  {
    slug: 'lydia-dean-reese',
    name: 'Lydia Dean-Reese',
    role: 'Founder & Executive Director',
    bio:
      'Lydia is the founder and executive director of More Than Conquerors. She is a veteran legal professional who has worked at some of DC\'s premier law firms. Lydia has served in the fashion industry for decades, and as a result she is also a master stylist. In her spare time she loves to read, scrapbook and travel. She has the gift of hospitality and service, loves the Lord, and is a breast cancer conqueror (survivor) herself.',
    image: '/img/board/Lydia Reese.png',
    alt: 'Portrait of Lydia Dean-Reese',
  },
  {
    slug: 'chevelle-jackson',
    name: 'Chevelle Jackson',
    role: 'Board Member',
    bio:
      'Chevelle has worked in the hospitality industry for more than 20 years with a business degree from Morgan State University. She brings a wealth of professional corporate experience as a certified event planner and leading a wedding ministry in her church for over 20 years. In her spare time, she enjoys traveling, fine dining, concerts, volunteering and spending time with family and friends.',
    image: '/img/board/Chevelle Jackson.png',
    alt: 'Portrait of Chevelle Jackson',
    introVideo: '/vid/chevelle-jackson-intro.mp4',
  },
  {
    slug: 'deirdre-adams',
    name: 'Deirdre Adams',
    role: 'Board Member',
    bio:
      'Deirdre is a native of Harrisburg, PA and lived in the DMV area for the majority of her adult life. With a career in finance for over 30 years, she knows how to support organizations in their financial efforts to help support others. In her spare time she loves to read and volunteer at the hospital supporting sick children and their families.',
    image: '/img/board/Deirdre Adams.png',
    alt: 'Portrait of Deirdre Adams',
    introVideo: '/vid/deirdre-adams-intro.mp4',
  },
  {
    slug: 'janet-mosby',
    name: 'Janet Mosby',
    role: 'Board Member',
    bio:
      'With a strong passion for helping individuals diagnosed with cancer face their battle with faith over fear, Janet is overjoyed to join MTC. Having been a caregiver for a family member with cancer, she understands the challenges and is committed to supporting others through their journey. Janet has also done extensive volunteer work in the cancer community, firmly believing that with God, all things are possible and that we are more than conquerors.',
    image: '/img/board/Janet Mosby.png',
    alt: 'Portrait of Janet Mosby',
  },
  {
    slug: 'jackie-bromfield',
    name: 'Jackie Bromfield',
    role: 'Board Member',
    bio:
      'Jackie is a dedicated realtor with Coldwell Banker, serving clients across all life stages, from first-time buyers to seasoned investors with market expertise and a client-first approach. She also advocates passionately for families navigating the school system, reflecting her commitment to both community and client success.',
    image: '/img/board/Jackie Bromfield.png',
    alt: 'Portrait of Jackie Bromfield',
  },
  {
    slug: 'linda-goodman',
    name: 'Linda Goodman',
    role: 'Board Member',
    bio:
      'Linda is a believer in the Lord Jesus Christ and a conqueror. She loves to read and has a heart of giving and pouring into others.',
    image: '/img/board/Linda Goodman.png',
    alt: 'Portrait of Linda Goodman',
    introVideo: '/vid/linda-goodman-intro.mp4',
  },
  {
    slug: 'kathy-dejesus',
    name: 'Kathy DeJesus',
    role: 'Board Member',
    bio:
      'Kathy is a healthcare professional who also teaches in her field. She loves to read, knit and crochet. She is a breast cancer conqueror.',
    image: '/img/board/Kathy DeJesus.png',
    alt: 'Portrait of Kathy DeJesus',
    introVideo: '/vid/kathy-dejesus-intro.mp4',
  },
  {
    slug: 'doreen-doye',
    name: 'Doreen Doye',
    role: 'Board Member',
    bio:
      'Doreen is a retired MCPS financial specialist. In her spare time, she enjoys cooking and crafting and always looking for opportunities to volunteer and help others. She is a breast cancer conqueror.',
    image: '/img/board/Doreen Doye.png',
    alt: 'Portrait of Doreen Doye',
    introVideo: '/vid/doreen-doye-intro.mp4',
  },
];
