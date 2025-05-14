import { Button } from "@/components/ui/button";
import NavBar from '@/components/ui/NavBar';
import Footer from '@/components/ui/Footer';
import { Card, CardContent } from "@/components/ui/card";
import TestimonialsSection from '@/components/ui/TestimonialsSection';
import SupportSection from '@/components/ui/SupportSection';
import { Heart, Calendar, Users, ArrowRight, Lightbulb, HandHeart, Rocket, Puzzle } from "lucide-react";
import Image from 'next/image';
const placeholderSections = [
  { id: 'home', title: 'Welcome Home', bgColor: 'bg-blue-50' },
  { id: 'about', title: 'About Us', bgColor: 'bg-green-50' },
  { id: 'values', title: 'Our Values', bgColor: 'bg-yellow-50' },
  { id: 'resources', title: 'Resources', bgColor: 'bg-purple-50' },
  { id: 'other-support-groups', title: 'Other Support Groups', bgColor: 'bg-purple-100' },
  { id: 'nutrition', title: 'Nutrition', bgColor: 'bg-purple-200' },
  { id: 'medical-help', title: 'Medical Help', bgColor: 'bg-purple-300' },
  { id: 'educational-links', title: 'Educational Links', bgColor: 'bg-purple-400' },
  { id: 'prayer-groups', title: 'Prayer Groups', bgColor: 'bg-purple-500' },
  { id: 'financial-assistance', title: 'Financial Assistance', bgColor: 'bg-purple-600' },
  { id: 'prescription-assistance', title: 'Prescription Assistance', bgColor: 'bg-purple-700' },
  { id: 'testimonials', title: 'Testimonials', bgColor: 'bg-pink-50' },
  { id: 'support', title: 'Support', bgColor: 'bg-pink-50' },
];
export default function Home() {
  return (
    <><main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
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
          <img src="/img/MTCLogo_FullColor.png" alt="More Than Conquerors" className="w-[300px] h-[300px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] mb-0" />
        </div>
        <div className="w-full md:w-1/2 text-white text-center md:text-left mt-0 md:mt-24">
  <h1 className="text-4xl md:text-5xl font-bold mb-4">More Than Conquerors</h1>
  <p className="text-lg md:text-xl mb-8">You’re not alone. You can face it, move through it, look good while going through it, and conquer it.</p>
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
          Welcome to More Than Conquerors
          Every 14 seconds, somewhere in the world, a woman is diagnosed with breast cancer (Breast Cancer Research Foundation). By 2024, it is estimated that 1 in 8 women in the United States will face this life-changing diagnosis. More Than Conquerors was born out of the understanding that these women need more than just treatment; they need a support system that uplifts, inspires, and empowers them to take control of how they look, feel, and ultimately, live.
          Founded by Lydia Dean-Reese, a breast cancer conqueror herself, More Than Conquerors is a grassroots organization fueled by passionate women who are committed to giving back and paying it forward. While undergoing her own cancer treatments, Lydia saw firsthand the power of positivity. A fashion designer and stylist by trade, she realized how something as simple as wearing a stylish scarf or receiving a thoughtful gift could transform someone’s outlook. Her personal journey inspired the creation of More Than Conquerors—a space where women are encouraged not just to survive cancer but to conquer it. We are not just survivors, but conquerors, More Than Conquerors. Romans 8:37
        </p>
      </div>
    </div>
  </div>
</section>
      <section id="vision">
      </section>
      {/* Vision Section */}
      <div className="bg-white py-20">
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
      </div>
      <section id="values">
      </section>
      {/* Values Section */}
      <div className="container mx-auto px-4 py-20">
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
      </div>
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
            {['eventPhoto.jpeg',
             'eventPhoto2.jpg',
             'eventPhoto47.jpg',
             'eventPhoto54.jpeg',
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
                <Image
                  src={`/img/${file}`}
                  alt={`Event ${idx + 1}`}
                  fill
                  className="object-contain rounded-lg"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
      <section id="resources">
      </section>
      <div className="bg-[#e84393] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Breast Cancer Resources</h2>
            <p className="text-xl text-white leading-relaxed text-center">
              At More Than Conquerors, we understand that having access to the right resources can make a significant difference. We are a support group, however, below are additional resources, for nutritional guidance, medical assistance, and educational materials to aid you on your journey.
            </p>
          </div>
        </div>
      </div>
      <section id="other-support-groups">
      </section>
      <div className="bg-[#01A9FF] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Other Support Group</h2>
           </div>
        </div>
      </div>
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
          </div>
        </div>
      </div>
      <section id="nutrition">
      </section>
      <div className="bg-[#01A9FF] py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Nutrition</h2>
           </div>
        </div>
     
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
      <section id="medical-help">
      </section>
      <div className="bg-[#01A9FF] py-20">
    
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6 text-white">Medical Help</h2>
     </div>
  </div>
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
      <section id="educational-links">
      </section>
      <div className="bg-[#01A9FF] py-20">
    
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6 text-white">Educational Links</h2>
     </div>
  </div>
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
      <section id="prayer-groups">
      </section>
      <div className="bg-[#01A9FF] py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Prayer Groups </h2>
          <p className="text-xl text-white leading-relaxed text-center">
            For those seeking spiritual support, connecting with a prayer group can provide comfort and hope during challenging times. We can offer a call, a text, and email or a prayer. Additional resources are:
          </p>
        </div>
      </div>
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
      <section id="financial-assistance">
      </section>
      <div className="bg-[#01A9FF] py-20">
    
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6 text-white">Financial Assistance</h2>
      <p className="text-xl text-white leading-relaxed text-center">
            Cancer treatment can be costly. Some of these organizations may provide financial aid to patients and their families:
          </p>
     </div>
  </div>
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
      <section id="prescription-assistance">
      </section>
      <div className="bg-[#01A9FF] py-20">
    
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6 text-white">Prescription Assistance</h2>
      <p className="text-xl text-white leading-relaxed text-center">
      For help covering medication costs, consider these resources:
          </p>
     </div>
  </div>
      
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
      </section>
      <div>
        {/* Other sections/components */}
        <TestimonialsSection />
        {/* Other sections/components */}
      </div>
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
      <div className="bg-[#e84393] py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Get Involved</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Join us in making a difference! There are many ways to support More Than Conquerors and become part of our mission to uplift and empower those affected by breast cancer. Volunteers make the dream work.
          </p>

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