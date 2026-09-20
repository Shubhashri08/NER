import React from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

const HERO_BG = '/assets/hero/ner-hero-milkyway-globe.png';

export default function Hero({ onExplorePlatform }) {
  return (
    <section className="relative bg-[#070c0e] text-[#f5f1e8] overflow-hidden min-h-[calc(100vh-64px)] flex flex-col justify-between" id="home">
      {/* Background Globe visual with clean widescreen aspect ratio */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-no-repeat bg-cover bg-[position:center_center] lg:bg-[position:right_center]"
          style={{
            backgroundImage: `url(${HERO_BG})`
          }}
        />
        {/* Soft gradient on the left side to guarantee high contrast and effortless legibility for text */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070c0e]/95 via-[#070c0e]/70 lg:via-[#070c0e]/30 to-transparent w-full lg:w-[60%]" />
      </div>

      {/* Hero Content */}
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-14 relative z-10 pt-12 lg:pt-16 pb-8 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Hero Headline & Styled Copy */}
          <div className="lg:col-span-8 max-w-2xl">
            {/* Top pill badge: RESILIENT NORTHEAST */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#d6cfc3] font-semibold">
                RESILIENT NORTHEAST
              </span>
            </motion.div>

            {/* Styled Editorial Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl lg:text-[70px] font-extrabold tracking-tight leading-[1.03] mb-6 text-white"
            >
              <span className="block text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)]">
                Connected
              </span>
              <span className="block bg-gradient-to-r from-white via-[#f4eee4] to-[#cfc3ad] bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
                Communities.
              </span>
              <span className="font-serif italic font-normal text-[#d8b56a] tracking-normal drop-shadow-[0_2px_24px_rgba(216,181,106,0.25)] block mt-1">
                Safer Tomorrows.
              </span>
            </motion.h1>

            {/* Subheading & Strategic Narrative */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 max-w-xl py-1"
            >
              <p className="text-sm sm:text-base text-[#cfd7d4] leading-relaxed font-normal">
                AI-powered disaster logistics intelligence for the North Eastern Region of India.
              </p>

              <p className="text-xs sm:text-sm text-[#8f9b97] leading-normal font-mono tracking-wide">
                Assess. Allocate. Route. Replan. Relocate.
              </p>

              {/* Call to Actions matching reference: 'Enter Command Center →' and 'Watch Overview' */}
              <div className="pt-4 flex flex-wrap items-center gap-6">
                <button
                  onClick={onExplorePlatform ? onExplorePlatform : () => { window.location.href = '/command'; }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#f0e7d8] hover:bg-white text-[#0e1416] text-xs font-bold tracking-wide transition-all shadow-lg hover:shadow-xl group cursor-pointer"
                >
                  <span>Enter Command Center</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                </button>

                <a
                  href="#about"
                  className="inline-flex items-center gap-3 text-white/90 hover:text-white transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-sm flex items-center justify-center group-hover:border-white/40 transition-all">
                    <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-white leading-tight">Watch Overview</span>
                    <span className="text-[10px] text-[#8e9995] font-mono leading-tight">2 min</span>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Bottom Bar: Stats counter matching reference verbatim */}
        <div className="mt-14 lg:mt-18 flex items-center justify-between pb-8 pt-6 border-t border-white/[0.08]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-14 w-full max-w-2xl">
            {[
              { num: '8', label: 'States' },
              { num: '200+', label: 'Districts' },
              { num: '6,500+', label: 'Habitations' },
              { num: 'One', label: 'Resilient Northeast' }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <strong className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">{stat.num}</strong>
                <span className="text-[11px] text-[#9ca7a4] font-medium mt-1.5 leading-snug">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Atmospheric transition gradient into the Capabilities bar layer */}
      <div 
        className="relative z-10 w-full h-32 -mb-px pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(7, 12, 14, 0.5) 40%, rgba(14, 18, 19, 0.9) 80%, #ece5d6 100%)'
        }}
      />
    </section>
  );
}
