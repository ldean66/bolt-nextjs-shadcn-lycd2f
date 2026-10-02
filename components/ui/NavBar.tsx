'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Facebook, Instagram, Menu, Twitter, X } from 'lucide-react';
import { boardMembers } from '@/lib/board-members';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { isMonthlyGivingEnabled } from '@/lib/paypal-config';
import Modal from './Modal';
import PayPalButton from './PayPalButton';

type NavLink = { id: string; label: string; href: string };
type NavItem = NavLink & { sublinks?: NavLink[] };

const resourceLinks = [
  { id: 'other-support-groups', label: 'Other Support Groups' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'medical-help', label: 'Medical Help' },
  { id: 'educational-links', label: 'Educational Links' },
  { id: 'prayer-groups', label: 'Prayer Groups' },
  { id: 'financial-assistance', label: 'Financial Assistance' },
  { id: 'prescription-assistance', label: 'Prescription Assistance' },
];

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/#home' },
  { id: 'about', label: 'About', href: '/#about' },
  { id: 'education', label: 'Education & Facts', href: '/#education' },
  { id: 'vision', label: 'Our Vision', href: '/#vision' },
  { id: 'values', label: 'Our Values', href: '/#values' },
  { id: 'gallery', label: 'Gallery', href: '/#gallery' },
  { id: 'community-stories', label: 'Community Stories', href: '/#community-stories' },
  {
    id: 'board-members', label: 'Board Members', href: '/#board-members',
    sublinks: [
      { id: 'board-members', label: 'Meet the Board', href: '/#board-members' },
      ...boardMembers.map((member) => ({ id: member.slug, label: member.name, href: `/board/${member.slug}` })),
    ],
  },
  {
    id: 'resources', label: 'Resources', href: '/#resources',
    sublinks: [
      { id: 'resources', label: 'All Resources', href: '/#resources' },
      ...resourceLinks.map((link) => ({ ...link, href: `/#${link.id}` })),
    ],
  },
  { id: 'testimonials', label: 'Testimonials', href: '/#testimonials' },
  { id: 'support', label: 'Support', href: '/#support' },
];

export default function NavBar() {
  const pathname = usePathname();
  const mobileMenuButton = useRef<HTMLButtonElement>(null);
  const monthlyGivingEnabled = isMonthlyGivingEnabled();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  useEffect(() => {
    if (pathname !== '/') return;
    const sectionIds = Array.from(new Set(navItems.flatMap((item) => [
      item.id,
      ...(item.sublinks ?? []).filter((link) => link.href.startsWith('/#')).map((link) => link.id),
    ])));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: '-80px 0px -50% 0px', threshold: 0 });

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [pathname]);

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

  const closeMenus = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const isItemActive = (item: NavItem) => {
    if (pathname.startsWith('/board/')) return item.id === 'board-members';
    return activeSection === item.id || item.sublinks?.some((link) => link.id === activeSection);
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
          <span className="mr-2 hidden text-sm font-semibold text-pink-700 sm:inline">
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
      <nav
        aria-label="Main navigation"
        className="sticky top-0 z-40 w-full bg-white/95 shadow-sm backdrop-blur-md"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && isOpen) {
            closeMenus();
            mobileMenuButton.current?.focus();
          }
        }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-20 items-center justify-between gap-4">
            <Link href="/#home" aria-label="More Than Conquerors home" onClick={closeMenus} className="shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-4">
              <img src="/img/MTCLogo_FullColor.png" alt="More Than Conquerors logo" className="h-10 w-auto" />
            </Link>
            <div className="hidden items-center gap-1 xl:flex">
              {navItems.map((item) => item.sublinks ? (
                <DropdownMenu key={item.id}>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={cn('inline-flex items-center gap-1 rounded-lg px-2 py-3 text-sm font-medium hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600', isItemActive(item) ? 'text-pink-700' : 'text-gray-600')}>
                      {item.label}<ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={8} className="max-h-[70vh] w-64 overflow-y-auto rounded-xl border-pink-100 p-2">
                    {item.sublinks.map((link) => (
                      <DropdownMenuItem key={link.id} asChild className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-pink-50 focus:text-pink-700">
                        <Link href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>{link.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={item.id} href={item.href} className={cn('rounded-lg px-2 py-3 text-sm font-medium hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600', isItemActive(item) ? 'text-pink-700' : 'text-gray-600')}>
                  {item.label}
                </Link>
              ))}
            </div>
            <button ref={mobileMenuButton} type="button" aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={() => { setIsOpen(!isOpen); setActiveDropdown(null); }} className="rounded-lg p-3 hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 xl:hidden">
              {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
          {isOpen ? (
            <div id="mobile-navigation" className="max-h-[calc(100dvh-8rem)] overflow-y-auto border-t border-pink-100 py-3 xl:hidden">
              {navItems.map((item) => (
                <div key={item.id}>
                  {item.sublinks ? (
                    <>
                      <button type="button" aria-expanded={activeDropdown === item.id} aria-controls={`mobile-${item.id}`} onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)} className={cn('flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-semibold hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pink-600', isItemActive(item) ? 'text-pink-700' : 'text-gray-700')}>
                        {item.label}<ChevronDown className={cn('h-4 w-4', activeDropdown === item.id && 'rotate-180')} aria-hidden="true" />
                      </button>
                      {activeDropdown === item.id ? (
                        <div id={`mobile-${item.id}`} className="ml-4 border-l border-pink-200 pl-2">
                          {item.sublinks.map((link) => (
                            <Link key={link.id} href={link.href} onClick={closeMenus} aria-current={pathname === link.href ? 'page' : undefined} className="block rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pink-600">{link.label}</Link>
                          ))}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <Link href={item.href} onClick={closeMenus} className={cn('block rounded-lg px-4 py-3 text-sm font-semibold hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pink-600', isItemActive(item) ? 'text-pink-700' : 'text-gray-700')}>{item.label}</Link>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <Modal isOpen={isDonateModalOpen} onClose={handleCloseDonateModal}>
          <div className="App">
            <Card className="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Make a Donation</h2>
              <PayPalButton onSuccess={handleCloseDonateModal} />
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
                {monthlyGivingEnabled
                  ? 'All donations are secure and encrypted. Choose a one-time gift or start monthly giving directly in the PayPal flow.'
                  : 'All donations are secure and encrypted. Complete a secure one-time donation directly in the PayPal flow.'}
              </p>
            </Card>
          </div>
        </Modal>
      </nav>
    </>
  );
}
