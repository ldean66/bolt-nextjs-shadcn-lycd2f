'use client';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'vision', label: 'Our Vision' },
  { id: 'values', label: 'Our Values' },
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

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
        <span className="text-xl font-bold text-blue-600">
  <img src="img/MTCLogo_FullColor.png" alt="Logo" className="h-8 w-auto" />
</span>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
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
    </nav>
  );
}