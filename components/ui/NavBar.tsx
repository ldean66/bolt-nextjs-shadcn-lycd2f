'use client';
import { useState, useEffect } from 'react';
import { Facebook, Instagram, Menu, Twitter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Modal from './Modal';
import PayPalButton from './PayPalButton';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education & Facts' },
  { id: 'vision', label: 'Our Vision' },
  { id: 'values', label: 'Our Values' },
  { id: "gallery", label: "Gallery" },
  { id: 'resources', label: 'Resources', sublinks: [
    { id: 'other-support-groups', label: 'Other Support Groups' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'medical-help', label: 'Medical Help' },
    { id: 'educational-links', label: 'Educational Links' },
    { id: 'prayer-groups', label: 'Prayer Groups' },
    { id: 'financial-assistance', label: 'Financial Assistance' },
    { id: 'prescription-assistance', label: 'Prescription Assistance' },
  ]},
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'support', label: 'Support' },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  useEffect(() => {
    const sections = navItems.flatMap(item => 
      item.sublinks ? 
        item.sublinks.map(sub => document.getElementById(sub.id)) : 
        document.getElementById(item.id)
    ).filter(Boolean);

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === '#donate') {
        setIsDonateModalOpen(true);
      }
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);

    return () => {
      window.removeEventListener('hashchange', openFromHash);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
      setActiveDropdown(null);
    }
  };

  const handleMouseEnter = (itemId: string) => {
    setActiveDropdown(itemId);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleOpenDonateModal = () => {
    setIsDonateModalOpen(true);
  };

  const handleCloseDonateModal = () => {
    setIsDonateModalOpen(false);
    if (window.location.hash === '#donate') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <>
      <div className="w-full bg-pink-50/90 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-end gap-3 text-gray-600">
          <span className="mr-2 text-xs sm:text-sm font-semibold text-pink-700">
            Get in Contact!
          </span>
          <a
            href="https://www.facebook.com/profile.php?id=61575855102903&name=xhp_nt__fb__action__open_user"
            className="hover:text-[#e84393] transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
          <a
            href="https://www.instagram.com/more_than_conquerors25?igsh=MXM3MmZmZHk5Y25zbg%3D%3D"
            className="hover:text-[#e84393] transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
          <a
            href="https://x.com/"
            className="hover:text-[#e84393] transition-colors"
            aria-label="X"
          >
            <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
          <a
            href="/img/MTC%20Sponsorship%20Opportunities_All%20Year%20Long.pdf"
            className="text-xs sm:text-sm px-3 sm:px-4 h-7 sm:h-8 rounded-full border border-pink-200 text-[#e84393] hover:bg-pink-50 transition-colors flex items-center"
            aria-label="Download mail-in sponsorship form"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mail-In Form
          </a>
          <Button
            variant="secondary"
            className="bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm px-3 sm:px-4 h-7 sm:h-8 rounded-full"
            onClick={handleOpenDonateModal}
          >
            Donate Now
          </Button>
        </div>
      </div>
      <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md shadow-md z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
          <span className="text-xl font-bold text-blue-600">
            <img src="img/MTCLogo_FullColor.png" alt="Logo" className="h-8 w-auto" />
          </span>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-blue-600 py-2",
                    activeSection === item.id ? "text-blue-600" : "text-gray-600"
                  )}
                >
                  {item.label}
                </button>
                {item.sublinks && activeDropdown === item.id && (
                  <div
                    className="absolute left-0 mt-0 w-64 bg-white shadow-lg rounded-md py-2"
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.sublinks.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => scrollToSection(sub.id)}
                        className={cn(
                          "block w-full px-4 py-2 text-sm font-medium text-left transition-colors hover:text-blue-600 hover:bg-gray-100",
                          activeSection === sub.id ? "text-blue-600 bg-gray-50" : "text-gray-600"
                        )}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Navigation Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => {
                      if (item.sublinks) {
                        setActiveDropdown(activeDropdown === item.id ? null : item.id);
                      } else {
                        scrollToSection(item.id);
                      }
                    }}
                    className={cn(
                      "w-full text-sm font-medium transition-colors hover:text-blue-600 text-left px-4 py-2 rounded-md hover:bg-gray-100",
                      activeSection === item.id ? "text-blue-600 bg-gray-50" : "text-gray-600"
                    )}
                  >
                    {item.label}
                  </button>
                  {item.sublinks && activeDropdown === item.id && (
                    <div className="pl-4 mt-2 space-y-1">
                      {item.sublinks.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => scrollToSection(sub.id)}
                          className={cn(
                            "block w-full px-4 py-2 text-sm font-medium text-left transition-colors hover:text-blue-600 hover:bg-gray-100 rounded-md",
                            activeSection === sub.id ? "text-blue-600 bg-gray-50" : "text-gray-600"
                          )}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        </div>

        <Modal isOpen={isDonateModalOpen} onClose={handleCloseDonateModal}>
          <div className="App">
            <Card className="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Make a Donation</h2>
              <PayPalButton />
              <div className="mt-6 rounded-xl border border-pink-200 bg-pink-50 p-4">
                <h3 className="text-lg font-semibold text-pink-700 text-center">Zelle Alternative</h3>
                <p className="text-sm text-gray-600 text-center mt-1">Scan to donate via Zelle</p>
                <img
                  src="/img/mtcQR.png"
                  alt="Zelle QR code"
                  className="mt-3 w-full max-w-xs mx-auto rounded-lg border border-pink-200 shadow-sm"
                />
              </div>
              <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                All donations are secure and encrypted. You can choose to make this a monthly donation
                during the PayPal checkout process.
              </p>
            </Card>
          </div>
        </Modal>
      </nav>
    </>
  );
}
