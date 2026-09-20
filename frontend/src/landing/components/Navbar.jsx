import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { NAV_LINKS } from '../data/constants.js';

export default function Navbar({ onNavigateLogin }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section spy based on scroll position
      const sectionIds = ['home', 'about', 'platform', 'impact', 'ner', 'contact'];
      const scrollPos = window.scrollY + 140; // offset for sticky header

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initialize on load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 w-full h-16 flex items-center justify-between px-6 lg:px-14 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#070c0e]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.6)] text-[#f5f1e8]'
          : 'bg-[#070c0e] border-b border-white/10 text-[#f5f1e8]'
      }`}
    >
      {/* Brand logo & tagline */}
      <a href="#home" className="flex items-center gap-2.5 text-white group">
        <span className="font-serif text-[24px] font-normal tracking-wide text-white leading-none">
          NER
        </span>
        <div className="flex flex-col text-left border-l border-white/20 pl-2.5">
          <span className="font-mono text-[7.5px] tracking-[0.14em] text-[#e8ded0] uppercase leading-[1.1] font-medium">
            DISASTER LOGISTICS
          </span>
          <span className="font-mono text-[6.5px] tracking-[0.1em] text-[#9ca29e] uppercase leading-[1.1]">
            INTELLIGENCE PLATFORM
          </span>
        </div>
      </a>

      {/* Center Nav Links with dynamic active state based on scroll */}
      <nav className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => {
          const targetId = link.href.replace('#', '');
          const isActive = activeSection === targetId;

          return (
            <a
              key={link.label}
              href={link.href}
              className={`relative text-[11.5px] font-medium tracking-wide transition-colors py-1 ${
                isActive
                  ? 'text-white' 
                  : 'text-[#9ca39f] hover:text-white'
              }`}
            >
              {link.label}
              {isActive && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d8b56a] rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Secure Access CTA button */}
        <motion.button
          onClick={onNavigateLogin ? onNavigateLogin : () => { window.location.href = '/login'; }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#f5f1e8] hover:bg-white text-[#080d0f] text-xs font-bold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Secure Access</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </motion.button>
      </div>
    </header>
  );
}
