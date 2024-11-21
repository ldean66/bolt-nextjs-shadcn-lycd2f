'use client';

import { Quote } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

const testimonials = [
  {
    id: 1,
    text: "More Than Conquerors was founded because when I was having a particularly difficult weekend after my chemo treatment, my spiritual mentor told me to ask God for something that I MUST be here to complete. So I believe God spared me through chemo, surgery and radiation to support others who are going through their own journey and to extend the support to their caregivers. ",
    author: "Lydia"
   
  },
  {
    id: 2,
    text: "After having my annual mammogram, I was diagnosed with IDCS breast cancer. I considered this find a gift; the cancer was caught early.  With the support of my faith, family, great healthcare providers, friends, and work, I was able to conqueror cancer. I wanted to be of service to others that are having to go through this journey.",
    author: "Kathryn Hinds DeJesus"
   
  },
  {
    id: 3,
    text: "When you are going through the battle of any cancer, for me it was breast cancer, having prayer warriors around you and people who would speak scriptures that give life were invaluable to me. You need to speak life giving scriptures to yourself also. It will make a BIG difference and keep you uplifted. This really helped me get through each day! ",
    author: "L. Goodman"
    
  }
  
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
          Testimonials from Our Community
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            At More Than Conquerors, the stories of those we’ve helped inspire our mission every day. Below are a few testimonials from women, caregivers, and supporters who have experienced the impact of our organization firsthand.
          </p>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="relative">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
            <Quote className="text-blue-600 w-12 h-12 mb-6 mx-auto" />
            
            <div className="space-y-8">
              <blockquote className="text-xl md:text-2xl text-gray-700 text-center italic leading-relaxed">
                {testimonials[activeIndex].text}
              </blockquote>
              
              <div className="text-center">
                <p className="font-semibold text-gray-900 text-lg">
                  {testimonials[activeIndex].author}
                </p>
              
              </div>
            </div>
          </Card>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-300 hover:bg-blue-400'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}