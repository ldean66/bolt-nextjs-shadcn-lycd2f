'use client';

import { Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2f3640] text-white">
      {/* Donation Banner */}
      <div className="bg-[#e84393] py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Heart className="w-8 h-8 animate-pulse" />
            <h3 className="text-xl font-semibold">Make a difference today!</h3>
            <Button 
              variant="secondary" 
              className="bg-white text-[#e84393] hover:bg-gray-100"
            >
              Donate Now
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About Us</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#e84393] transition-colors">Our Mission</a></li>
              <li><a href="#" className="hover:text-[#e84393] transition-colors">Leadership</a></li>
              <li><a href="#" className="hover:text-[#e84393] transition-colors">Financials</a></li>
              <li><a href="#" className="hover:text-[#e84393] transition-colors">Annual Report</a></li>
              <li><a href="#" className="hover:text-[#e84393] transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Get Involved Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get Involved</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#e84393] transition-colors">Volunteer</a></li>
              <li><a href="#" className="hover:text-[#e84393] transition-colors">Fundraise</a></li>
              <li><a href="#" className="hover:text-[#e84393] transition-colors">Partner With Us</a></li>
              <li><a href="#" className="hover:text-[#e84393] transition-colors">Corporate Giving</a></li>
              <li><a href="#" className="hover:text-[#e84393] transition-colors">Planned Giving</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#e84393] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#e84393] transition-colors">News & Updates</a></li>
              <li><a href="#" className="hover:text-[#e84393] transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-[#e84393] transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-[#e84393] transition-colors">Resource Library</a></li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="hover:text-[#e84393] transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-[#e84393] transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-[#e84393] transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-[#e84393] transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
            <div className="space-y-2">
              <p className="text-sm">Sign up for our newsletter:</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-3 py-2 rounded-md text-gray-900 text-sm w-full"
                />
                <Button 
                  variant="secondary"
                  className="bg-[#e84393] hover:bg-[#d63384] text-white whitespace-nowrap"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span>© {currentYear} Community Family. All rights reserved.</span>
              <a href="#" className="hover:text-[#e84393] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#e84393] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#e84393] transition-colors">Accessibility</a>
            </div>
            <div className="flex items-center gap-2">
              <span>EIN: 12-3456789</span>
              <span>|</span>
              <span>501(c)(3) Organization</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}