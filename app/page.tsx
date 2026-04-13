import { Button } from "@/components/ui/button";
import NavBar from '@/components/ui/NavBar';
import Footer from '@/components/ui/Footer';
import { Card, CardContent } from "@/components/ui/card";
import TestimonialsSection from '@/components/ui/TestimonialsSection';
import CommunityStoriesSection from '@/components/ui/CommunityStoriesSection';
import BoardMembersSection from '@/components/ui/BoardMembersSection';
import SupportSection from '@/components/ui/SupportSection';
import { BookOpen, HeartPulse, Lightbulb, HandHeart, Rocket, Puzzle } from "lucide-react";
import Image from 'next/image';
import Script from "next/script";

export default function Home() {
  return (
    <><main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">

{/* SEO Script */}
<Script
  id="ld-nonprofit-org"
  type="application/ld+json"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NonprofitOrganization",
      name: "More Than Conquerors",
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://morethan-conquerors.com",
      logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://morethan-conquerors.com"}/img/MTCLogo_FullColor.png`,
      sameAs: [
        "https://www.facebook.com/profile.php?id=61575855102903&name=xhp_nt__fb__action__open_user",
        "https://www.instagram.com/more_than_conquerors25?igsh=MXM3MmZmZHk5Y25zbg%3D%3D",
      ],
    }),
  }}
/>

      <NavBar />
      {/* Hero Section */}
      <section id="home">
      </section>
      <div className="relative h-[600px]">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="vid/Comp 5_2.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="flex flex-col md:flex-row w-full">
              <div className="w-full md:w-1/2 flex justify-center items-center mb-0 md:mb-0 mt-24 md:mt-0">
                <Image
                  src="/img/MTCLogo_FullColor.png"
                  alt="More Than Conquerors logo"
                  width={500}
                  height={500}
                  priority
                  className="w-[300px] h-[300px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] mb-0"
                />
              </div>
              <div className="w-full md:w-1/2 text-white text-center md:text-left mt-0 md:mt-24">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">More Than Conquerors</h1>
                <p className="text-lg md:text-xl mb-8">More than Conquerors exists to educate and support, patients survivors, caregivers, and their families affected by breast cancer.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="about">
        <div className="bg-[#e84393] py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-white">About Us</h2>
              <p className="text-xl text-white leading-relaxed text-left">
                Welcome to More Than Conquerors.
                Every 14 seconds, somewhere in the world, a woman is diagnosed with breast cancer (Breast Cancer Research Foundation). By 2024, it is estimated that 1 in 8 women in the United States will face this life-changing diagnosis. More Than Conquerors was born out of the understanding that these women need more than just treatment; they need a support system that uplifts, inspires, and empowers them to take control of how they look, feel, and ultimately, live.
                Founded by Lydia Dean-Reese, a breast cancer conqueror herself, More Than Conquerors is a grassroots organization fueled by passionate women who are committed to giving back and paying it forward. While undergoing her own cancer treatments, Lydia saw firsthand the power of positivity. A fashion designer and stylist by trade, she realized how something as simple as wearing a stylish scarf or receiving a thoughtful gift could transform someone’s outlook. Her personal journey inspired the creation of More Than Conquerors—a space where women are encouraged not just to survive cancer but to conquer it. They are not just survivors, but conquerors, More Than Conquerors. Romans 8:37
              </p>
              <h3 className="text-2xl  mb-4 mt-10 text-gray">What is Breast Cancer?</h3>
              <p className="text-lg text-white leading-relaxed">
                Breast cancer is a disease where cells within the breast tissues grow out of control and form tumors, potentially spreading to other parts of the body. These abnormal cells can originate in the milk ducts or lobules of the breast.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section aria-label="Monthly giving promo" className="bg-white">
        <div className="container mx-auto px-4 py-8 sm:py-10 flex justify-center">
          <a href="#donate" className="block w-full max-w-xl sm:max-w-2xl">
            <Image
              src="/img/monthly-giving.PNG"
              alt="Support Breast Cancer Fighters for $5/month. Join Us Today."
              width={1600}
              height={1600}
              className="w-full h-auto rounded-2xl shadow-lg ring-1 ring-black/5"
            />
          </a>
        </div>
      </section>
      <section id="education" className="bg-white py-20">
  <div className="container mx-auto px-4">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 text-center">Education & Facts</h2>

      <div className="mt-6 rounded-2xl border border-pink-100 bg-pink-50/60 p-4 text-sm text-gray-700 shadow-sm">
        <p>
          <span className="font-semibold">Sources:</span> The facts and statistics below are based on information from the{' '}
          <a
            className="underline decoration-pink-400/60 underline-offset-2 hover:text-gray-900"
            href="https://www.cancer.org/cancer/types/breast-cancer/about/types-of-breast-cancer.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            American Cancer Society
          </a>
          ,{' '}
          <a
            className="underline decoration-pink-400/60 underline-offset-2 hover:text-gray-900"
            href="https://seer.cancer.gov/statfacts/html/breast.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            NCI SEER
          </a>
          , and the{' '}
          <a
            className="underline decoration-pink-400/60 underline-offset-2 hover:text-gray-900"
            href="https://www.nationalbreastcancer.org/breast-cancer-facts/"
            target="_blank"
            rel="noopener noreferrer"
          >
            National Breast Cancer Foundation
          </a>
          .
        </p>
      </div>

      <p className="mt-6 text-lg text-gray-600 text-center">
        Breast cancer awareness starts with reliable information. Here are key U.S. statistics and a quick overview of
        common breast cancer types.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="group relative overflow-hidden rounded-2xl border border-pink-100/70 bg-white/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl before:absolute before:-right-16 before:-top-16 before:h-48 before:w-48 before:rounded-full before:bg-pink-200/40 before:blur-2xl before:content-[''] before:opacity-50 before:transition-opacity before:duration-300 group-hover:before:opacity-80 after:absolute after:-left-16 after:-bottom-16 after:h-48 after:w-48 after:rounded-full after:bg-purple-200/30 after:blur-2xl after:content-[''] after:opacity-40 after:transition-opacity after:duration-300 group-hover:after:opacity-70">
          <CardContent className="relative p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500" />
            <div className="flex items-center gap-3">
              <HeartPulse className="h-6 w-6 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900">Second-leading cause</h3>
            </div>
            <p className="mt-3 text-gray-600">
              Breast cancer is the second leading cause of cancer death in women in the U.S.
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden rounded-2xl border border-pink-100/70 bg-white/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl before:absolute before:-right-16 before:-top-16 before:h-48 before:w-48 before:rounded-full before:bg-pink-200/40 before:blur-2xl before:content-[''] before:opacity-50 before:transition-opacity before:duration-300 group-hover:before:opacity-80 after:absolute after:-left-16 after:-bottom-16 after:h-48 after:w-48 after:rounded-full after:bg-purple-200/30 after:blur-2xl after:content-[''] after:opacity-40 after:transition-opacity after:duration-300 group-hover:after:opacity-70">
          <CardContent className="relative p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500" />
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900">Early detection matters</h3>
            </div>
            <p className="mt-3 text-gray-600">
              When diagnosed at an early, localized stage, the 5-year relative survival rate is about 99%.
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden rounded-2xl border border-pink-100/70 bg-white/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl before:absolute before:-right-16 before:-top-16 before:h-48 before:w-48 before:rounded-full before:bg-pink-200/40 before:blur-2xl before:content-[''] before:opacity-50 before:transition-opacity before:duration-300 group-hover:before:opacity-80 after:absolute after:-left-16 after:-bottom-16 after:h-48 after:w-48 after:rounded-full after:bg-purple-200/30 after:blur-2xl after:content-[''] after:opacity-40 after:transition-opacity after:duration-300 group-hover:after:opacity-70">
          <CardContent className="relative p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500" />
            <div className="flex items-center gap-3">
              <HeartPulse className="h-6 w-6 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900">Many cases are localized</h3>
            </div>
            <p className="mt-3 text-gray-600">
              About 66% of breast cancer cases are diagnosed at a localized stage.
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden rounded-2xl border border-pink-100/70 bg-white/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl before:absolute before:-right-16 before:-top-16 before:h-48 before:w-48 before:rounded-full before:bg-pink-200/40 before:blur-2xl before:content-[''] before:opacity-50 before:transition-opacity before:duration-300 group-hover:before:opacity-80 after:absolute after:-left-16 after:-bottom-16 after:h-48 after:w-48 after:rounded-full after:bg-purple-200/30 after:blur-2xl after:content-[''] after:opacity-40 after:transition-opacity after:duration-300 group-hover:after:opacity-70">
          <CardContent className="relative p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500" />
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900">2025 U.S. estimates</h3>
            </div>
            <p className="mt-3 text-gray-600">
              In 2025, an estimated 316,950 new cases of invasive breast cancer will be diagnosed in women in the U.S.,
              and about 42,170 women are expected to die from breast cancer.
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden rounded-2xl border border-pink-100/70 bg-white/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl before:absolute before:-right-16 before:-top-16 before:h-48 before:w-48 before:rounded-full before:bg-pink-200/40 before:blur-2xl before:content-[''] before:opacity-50 before:transition-opacity before:duration-300 group-hover:before:opacity-80 after:absolute after:-left-16 after:-bottom-16 after:h-48 after:w-48 after:rounded-full after:bg-purple-200/30 after:blur-2xl after:content-[''] after:opacity-40 after:transition-opacity after:duration-300 group-hover:after:opacity-70">
          <CardContent className="relative p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500" />
            <div className="flex items-center gap-3">
              <HeartPulse className="h-6 w-6 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900">Survivorship</h3>
            </div>
            <p className="mt-3 text-gray-600">
              There are over 4 million breast cancer survivors in the United States.
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden rounded-2xl border border-pink-100/70 bg-white/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl before:absolute before:-right-16 before:-top-16 before:h-48 before:w-48 before:rounded-full before:bg-pink-200/40 before:blur-2xl before:content-[''] before:opacity-50 before:transition-opacity before:duration-300 group-hover:before:opacity-80 after:absolute after:-left-16 after:-bottom-16 after:h-48 after:w-48 after:rounded-full after:bg-purple-200/30 after:blur-2xl after:content-[''] after:opacity-40 after:transition-opacity after:duration-300 group-hover:after:opacity-70">
          <CardContent className="relative p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500" />
            <div className="flex items-center gap-3">
              <HeartPulse className="h-6 w-6 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900">Men can get breast cancer</h3>
            </div>
            <p className="mt-3 text-gray-600">
              In 2025, about 2,800 men will be diagnosed and about 510 will die from breast cancer in the U.S.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-14">
        <h3 className="text-2xl font-bold text-gray-900 text-center">Common Types of Breast Cancer</h3>
        <p className="mt-4 text-gray-600 text-center">
          Breast cancers are often categorized by where they start (ducts or lobules) and whether they are invasive.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="group relative overflow-hidden rounded-2xl border border-pink-100/70 bg-white/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl before:absolute before:-right-16 before:-top-16 before:h-48 before:w-48 before:rounded-full before:bg-pink-200/40 before:blur-2xl before:content-[''] before:opacity-50 before:transition-opacity before:duration-300 group-hover:before:opacity-80 after:absolute after:-left-16 after:-bottom-16 after:h-48 after:w-48 after:rounded-full after:bg-purple-200/30 after:blur-2xl after:content-[''] after:opacity-40 after:transition-opacity after:duration-300 group-hover:after:opacity-70">
            <CardContent className="relative p-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500" />
              <h4 className="text-lg font-semibold text-gray-900">Ductal Carcinoma In Situ (DCIS)</h4>
              <p className="mt-2 text-gray-600">
                Non-invasive cancer found in the milk ducts (often described as Stage 0).
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden rounded-2xl border border-pink-100/70 bg-white/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl before:absolute before:-right-16 before:-top-16 before:h-48 before:w-48 before:rounded-full before:bg-pink-200/40 before:blur-2xl before:content-[''] before:opacity-50 before:transition-opacity before:duration-300 group-hover:before:opacity-80 after:absolute after:-left-16 after:-bottom-16 after:h-48 after:w-48 after:rounded-full after:bg-purple-200/30 after:blur-2xl after:content-[''] after:opacity-40 after:transition-opacity after:duration-300 group-hover:after:opacity-70">
            <CardContent className="relative p-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500" />
              <h4 className="text-lg font-semibold text-gray-900">Invasive Ductal Carcinoma (IDC)</h4>
              <p className="mt-2 text-gray-600">
                The most common type of invasive breast cancer, starting in the ducts and spreading to nearby tissue.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden rounded-2xl border border-pink-100/70 bg-white/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl before:absolute before:-right-16 before:-top-16 before:h-48 before:w-48 before:rounded-full before:bg-pink-200/40 before:blur-2xl before:content-[''] before:opacity-50 before:transition-opacity before:duration-300 group-hover:before:opacity-80 after:absolute after:-left-16 after:-bottom-16 after:h-48 after:w-48 after:rounded-full after:bg-purple-200/30 after:blur-2xl after:content-[''] after:opacity-40 after:transition-opacity after:duration-300 group-hover:after:opacity-70">
            <CardContent className="relative p-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500" />
              <h4 className="text-lg font-semibold text-gray-900">Invasive Lobular Carcinoma (ILC)</h4>
              <p className="mt-2 text-gray-600">
                Starts in the milk-producing glands (lobules) and can spread to surrounding breast tissue.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden rounded-2xl border border-pink-100/70 bg-white/90 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl before:absolute before:-right-16 before:-top-16 before:h-48 before:w-48 before:rounded-full before:bg-pink-200/40 before:blur-2xl before:content-[''] before:opacity-50 before:transition-opacity before:duration-300 group-hover:before:opacity-80 after:absolute after:-left-16 after:-bottom-16 after:h-48 after:w-48 after:rounded-full after:bg-purple-200/30 after:blur-2xl after:content-[''] after:opacity-40 after:transition-opacity after:duration-300 group-hover:after:opacity-70">
            <CardContent className="relative p-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500" />
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-pink-600" />
                <h4 className="text-lg font-semibold text-gray-900">Key Subtypes & Classifications</h4>
              </div>
              <ul className="mt-2 text-gray-600 list-disc ml-5 space-y-1">
                <li><span className="font-semibold">HER2-positive</span>: cancer cells have too much HER2 protein, which affects treatment options.</li>
                <li><span className="font-semibold">Triple-negative (TNBC)</span>: lacks estrogen, progesterone, and HER2 receptors; can be more aggressive.</li>
                <li><span className="font-semibold">Inflammatory</span>: rare and aggressive, often causing redness and swelling of the breast.</li>
                <li><span className="font-semibold">Metastatic</span>: breast cancer that has spread beyond the breast (Stage 4).</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Sources:
          <a className="underline hover:text-gray-700" href="https://www.nationalbreastcancer.org/breast-cancer-facts/" target="_blank" rel="noopener noreferrer"> National Breast Cancer Foundation</a>,
          <a className="underline hover:text-gray-700" href="https://seer.cancer.gov/statfacts/html/breast.html" target="_blank" rel="noopener noreferrer"> NCI SEER</a>,
          <a className="underline hover:text-gray-700" href="https://www.cancer.org/cancer/types/breast-cancer/about/types-of-breast-cancer.html" target="_blank" rel="noopener noreferrer"> American Cancer Society</a>.
        </p>
      </div>
    </div>
  </div>
</section>
      {/* Mission Section */}
      
      {/* Vision Section */}
      <section id="vision" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Vision</h2>
            <p className="text-xl text-gray-600 leading-relaxed text-left">
              Our vision is to become the premier organization in our community that creates a nurturing environment and safe space for individuals affected by cancer and their loved ones. We extend hope for a brighter future by:
            </p>
            <ul className="text-xl text-gray-600 leading-relaxed text-left list-disc ml-5">
              <li>Supporting with creativity and compassion.</li>
              <li>Providing resources and tools for emotional and physical empowerment.</li>
              <li>Partnering with others who share our commitment to giving back.</li>
            </ul>
          </div>
        </div>
      </section>
      {/* Values Section */}
      <section id="values" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="bg-white shadow-xl">
            <CardContent className="p-6 text-center">
              <HandHeart className="w-12 h-12 text-pink-500 mb-4 mx-auto" />
              <h3 className="text-xl font-bold mb-2">Compassion</h3>
              <p className="text-gray-600">We approach every interaction with care, dignity, and respect.</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-xl">
            <CardContent className="p-6 text-center">
              <Lightbulb className="w-12 h-12 text-pink-500 mb-4 mx-auto" />
              <h3 className="text-xl font-bold mb-2">Creativity</h3>
              <p className="text-gray-600">We bring innovative solutions to uplift and inspire our community.</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl">
            <CardContent className="p-6 text-center">
              <Rocket className="w-12 h-12 text-pink-500 mb-4 mx-auto" />
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-gray-600">We execute and deliver services with unwavering dedication.</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-xl">
            <CardContent className="p-6 text-center">
              <Puzzle className="w-12 h-12 text-pink-500 mb-4 mx-auto" />
              <h3 className="text-xl font-bold mb-2">Collaboration</h3>
              <p className="text-gray-600">We build partnerships with individuals and organizations who share our mission of support and empowerment.</p>
            </CardContent>
          </Card>
        </div>
      </section>
      <section id="support">
        <div>
          {/* Other sections/components */}
          <SupportSection />
          {/* Other sections/components */}
        </div>
      </section>
      {/* Event Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Event Gallery</h2>
          <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
            {['octoberEventPoster.jpeg',
              'previewEventPhoto.jpeg',
              'eventPhoto55.jpg',
              'eventPhoto56.jpeg',
              'eventPhoto57.jpg',
              'eventPhoto58.jpeg',
              'eventPhoto59.jpeg',
              'eventPhoto60.jpeg',
              'eventPhoto61.jpeg',
              'eventPhoto62.jpeg',
              'eventPhoto63.jpeg',
              'eventPhoto64.jpeg',
              'eventPhoto65.jpeg',
              'eventPhoto66.jpeg',
              'eventPhoto67.jpeg',
              'eventPhoto54.jpeg',
              'eventPhoto2.jpg',
              'eventPhoto47.jpg',
              'eventPhoto48.jpg',
              'eventPhoto51.jpg',
              'eventPhoto9.jpg',
              'eventPhoto52.jpg',
              'eventPhoto53.jpg',
              'eventPhoto6.jpg',
              'eventPhoto5.jpg',
              'eventPhoto7.jpg',
              'eventPhoto3.jpg',
              'eventPhoto4.jpg',
              'eventPhoto31.jpg',
              'eventPhoto50.jpg',
              'eventPhoto32.jpg',
              'eventPhoto13.jpg',
              'eventPhoto30.jpg',
              'eventPhoto14.jpg',
              'eventPhoto15.jpg',
              'eventPhoto34.jpg',
              'eventPhoto44.jpg',
              'eventPhoto45.jpg',
              'eventPhoto46.jpg',
              'eventPhoto27.jpg',
              'eventPhoto26.jpg',
              'eventPhoto28.jpg',
              'eventPhoto23.jpg',
              'eventPhoto38.jpg',
              'eventPhoto37.jpg',
              'eventPhoto43.jpg',
              'eventPhoto42.jpg',
              'eventPhoto41.jpg',
              'eventPhoto40.jpg',
              'eventPhoto17.jpg'].map((file, idx) => (
                <a
                  key={file}
                  href={`/img/${file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-64 h-48 relative"
                >
                  {/* Performance plan: convert thumbs to WebP/AVIF later; keep originals for downloads. */}
                  <Image
                    src={`/img/thumbs/${file}`}
                    alt={`Event ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 70vw, 256px"
                    className="object-contain rounded-lg"
                  />
                </a>
              ))}
          </div>
        </div>
      </section>
      <CommunityStoriesSection />
      <BoardMembersSection />
      <section id="resources" className="bg-[#e84393] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Breast Cancer Resources</h2>
            <p className="text-xl text-white leading-relaxed text-center">
              At More Than Conquerors, we understand that having access to the right resources can make a significant difference. We are a support group, however, below are additional resources, for nutritional guidance, medical assistance, and educational materials to aid you on your journey.
            </p>
          </div>
        </div>
      </section>
      <section id="other-support-groups" className="bg-[#01A9FF] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Other Support Group</h2>
          </div>
        </div>
      </section>
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 sm:px-0 md:justify-center md:overflow-visible md:-mx-0 md:px-0">
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.cancercare.org/" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/80cancerCare.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">80 Cancer Care</span>
            </div>
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.cancer.org" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/americanCancerSociety.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">Breast Cancer Support Group Finder (American Cancer Society)</span>
            </div>
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.cdc.gov/breast-cancer/what-cdc-is-doing/" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/cdc.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">CDC Breast Cancer</span>
            </div>
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://search.nih.gov/search?utf8=✓&affiliate=nih&query=breast+cancer" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/nih.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">National Institute of Health</span>
            </div>
          </div>
        </div>
      </div>
      <section id="nutrition" className="bg-[#01A9FF] py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Nutrition</h2>
        </div>
      </section>

      <div className="bg-white py-16">
        <div className="container mx-auto px-4">

          <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 sm:px-0 md:justify-center md:overflow-visible md:-mx-0 md:px-0">
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.oncologynutrition.org/home" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/oncologyNutrition.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">The Oncology Nutrition Dietetic Practice Group</span>
            </div>
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.aicr.org/" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/americanInstituteForCancer.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">American Institute for Cancer Research</span>
            </div>
          </div>
        </div>
      </div>
      <section id="medical-help" className="bg-[#01A9FF] py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Medical Help</h2>
        </div>
      </section>
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">

          <div className="flex flex-nowrap sm:flex-wrap space-x-6 overflow-x-auto pb-4 -mx-4 px-4 sm:px-0 md:justify-center md:overflow-visible md:-mx-0 md:px-0">
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.hopkinsmedicine.org/kimmel-cancer-center" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/johnHopkins.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">Johns Hopkins Medicine (#1 in Maryland #3 in the Country.)</span>
            </div>
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.nccn.org/" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/cancerSupportCommunity.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">National Comprehensive Cancer Network (NCCN)</span>
            </div>
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.cdc.gov/breast-cervical-cancer-screening/" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/cdc.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">Breast and Cervical Cancer Program (CDC)</span>
            </div>
          </div>
        </div>
      </div>
      <section id="educational-links" className="bg-[#01A9FF] py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Educational Links</h2>
        </div>
      </section>
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">

          <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 sm:px-0 md:justify-center md:overflow-visible md:-mx-0 md:px-0">
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.breastcancer.org" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/breastCancerOrg.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">BreastCancer.org</span>
            </div>
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.komen.org" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/susanGkomen.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">Susan G. Komen</span>
            </div>
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.cancer.gov" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/nih.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">National Cancer Institute (NCI)</span>
            </div>
          </div>
        </div>
      </div>
      <section id="prayer-groups" className="bg-[#01A9FF] py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Prayer Groups </h2>
          <p className="text-xl text-white leading-relaxed text-center">
            For those seeking spiritual support, connecting with a prayer group can provide comfort and hope during challenging times. We can offer a call, a text, and email or a prayer. Additional resources are:
          </p>
        </div>
      </section>
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">

          <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 sm:px-0 md:justify-center md:overflow-visible md:-mx-0 md:px-0">
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.nationalbreastcancer.org" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/nbcfInc.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">National Breast Cancer Foundation Prayer Wall</span>
            </div>
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.fummd.com/ministries" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/faithUnitedMinistries_.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">Faith United Ministries has a ministry called Life After Cancer</span>
            </div>
          </div>
        </div>
      </div>
      <section id="financial-assistance" className="bg-[#01A9FF] py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Financial Assistance</h2>
          <p className="text-xl text-white leading-relaxed text-center">
            Cancer treatment can be costly. Some of these organizations may provide financial aid to patients and their families:
          </p>
        </div>
      </section>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">


        </div>
      </div>
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">

          <div className="flex flex-nowrap sm:flex-wrap space-x-6 overflow-x-auto pb-4 -mx-4 px-4 sm:px-0 md:justify-center md:overflow-visible md:-mx-0 md:px-0">
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://pinkfund.org/" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/pinkFund.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">The Pink Fund</span>
            </div>
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://copays.org/" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/coPayRelief.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">Patient Advocate Foundation Co-Pay Relief</span>
            </div>
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.healthwellfoundation.org/" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/healthWellFoundation.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">HealthWell Foundation</span>
            </div>
          </div>
        </div>
      </div>
      <section id="prescription-assistance" className="bg-[#01A9FF] py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Prescription Assistance</h2>
          <p className="text-xl text-white leading-relaxed text-center">
            For help covering medication costs, consider these resources:
          </p>
        </div>
      </section>

      <div className="bg-white py-16">
        <div className="container mx-auto px-4">

          <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 sm:px-0 md:justify-center md:overflow-visible md:-mx-0 md:px-0">
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.goodrx.com/" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/goodRx.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">GoodRx</span>
            </div>
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.needymeds.org/" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/needyMeds.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">NeedyMeds</span>
            </div>
            <div className="flex flex-col items-center space-y-4 flex-shrink-0">
              <a href="https://www.pparx.org/" className="block w-[300px] h-[200px] bg-cover bg-center" style={{ backgroundImage: "url('img/professionalPrescriptionAdvice.png')" }}></a>
              <span className="text-black text-sm font-bold text-center">Partnership for Prescription Assistance (PPA)</span>
            </div>
          </div>
        </div>
      </div>
      <section id="testimonials">
        <TestimonialsSection />
      </section>
      {/* Support Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>

            <div className="space-y-4 text-gray-600">
              <p>We pray to have a impact on as many men and women, as possible, who have been impacted by breast cancer.  We invite you to stand with us in spreading love, hope, and resilience. Together, we are truly More Than Conquerors.

                If you need support or have a testimony of your own journey, please contact More Than Conquerors. Sharing your story can inspire others on their journey and show them they are not alone.</p>

              <Button className="mt-6 bg-pink-500 hover:bg-pink-600 text-white">
                Submit Your Testimonial or ask for support
              </Button>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src="/img/MTC.png"
              alt="Medical professionals discussing"
              className="w-full h-[400px] object-cover" />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#e84393] py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Get Involved</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Join us in making a difference! There are many ways to support More Than Conquerors and become part of our mission to uplift and empower those affected by breast cancer. Volunteers make the dream work.
          </p>
        </div>
      </div>

      {/* In-Kind Gifts Section */}
      <div className="bg-[#e84393] py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">In-Kind Gifts</h2>
            <p className="text-xl text-white leading-relaxed text-left">
              In addition to monetary donations, other meaningful ways to support include in-kind contributions such as:
            </p>
            <ul className="text-xl text-white leading-relaxed text-left list-disc mt-4 ml-6">
              <li>Inspirational novelty items</li>
              <li>Scarfs</li>
              <li>Journals</li>
              <li>Gift cards (e.g., Uber or Uber Eats)</li>
            </ul>
            <p className="text-xl text-white leading-relaxed text-left mt-6">
              We are a registered 501(c)(3) nonprofit organization, and your gifts help us bring hope and comfort to those in need.
            </p>
          </div>
        </div>
      </div>

      {/* Services Include Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-pink-600">Services Include</h2>
            <ol className="text-xl text-gray-700 leading-relaxed text-left list-decimal ml-6 space-y-2">
              <li>Providing a cancer Conqueror bag</li>
              <li>Transportation service to appointments</li>
              <li>A Conqueror telephone buddy</li>
              <li>Meal deliveries</li>
              <li>Makeup sessions</li>
              <li>Style sessions</li>
              <li>Clerical assistance</li>
              <li>&quot;Thinking of you&quot; cards</li>
            </ol>

          </div>
        </div>
      </div>
      <div>
        {/* Other sections/components */}
        <Footer />
        {/* Other sections/components */}
      </div>
    </main>

    </>
  );
}
