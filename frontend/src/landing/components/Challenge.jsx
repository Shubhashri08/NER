import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Button from './Button.jsx';
import { HAZARDS_DATA } from '../data/constants.js';

const ASSET_BASE = '/assets/';
const AUTO_ROTATE_MS = 3800;

// Film grain SVG data texture
const FILM_GRAIN_URL = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

export default function Challenge() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate timer with clean pause/resume handling
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HAZARDS_DATA.length);
    }, AUTO_ROTATE_MS);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Compute 3D layout parameters cleanly per position
  const getCardStyle = useCallback((index) => {
    const total = HAZARDS_DATA.length;
    const offset = (index - currentIndex + total) % total;
    const position = offset === 0 ? 0 : offset === 1 ? 1 : -1;

    if (position === 0) {
      return {
        x: '0%',
        scale: 1,
        opacity: 1,
        rotateY: 0,
        filter: 'blur(0px)',
        zIndex: 20,
        isActive: true
      };
    }

    return {
      x: position === 1 ? '52%' : '-52%',
      scale: 0.88,
      opacity: 0.5,
      rotateY: position === 1 ? -10 : 10,
      filter: 'blur(5px)',
      zIndex: 10,
      isActive: false
    };
  }, [currentIndex]);

  return (
    <section className="pt-32 pb-36 lg:pt-40 lg:pb-44 bg-[#ece5d6]" id="about">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-center">
          
          {/* Section Copy & Narrative */}
          <div className="lg:col-span-5 max-w-lg">
            <span className="font-mono text-[10px] tracking-[0.18em] text-[#5e6363] uppercase font-bold mb-3.5 block">
              The Challenge
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#12181a] tracking-tight leading-[1.12] mb-5">
              When Disaster Strikes,<br />
              Connections Break.
            </h2>
            <p className="text-xs sm:text-sm text-[#575e5b] leading-relaxed mb-4">
              Landslides, seasonal flash floods, and severe weather isolate remote North-Eastern communities within hours. 
              Conventional logistics collapse when the terrain shifts underfoot.
            </p>
            <p className="text-xs sm:text-sm text-[#575e5b] leading-relaxed mb-10">
              We build the mission-critical intelligence layer that maintains persistent connectivity for lifelines, ambulances, and emergency supplies — even as conditions change minute-by-minute.
            </p>
            <Button dark href="#platform">See How It Works</Button>
          </div>

          {/* Grain Carousel: Clean 3D stacked layout with generous width and spacing */}
          <div 
            className="lg:col-span-7 flex items-center justify-center min-h-[420px] sm:min-h-[460px] relative select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative w-full max-w-[420px] sm:max-w-[440px] h-[360px] sm:h-[390px] flex items-center justify-center">
              {HAZARDS_DATA.map((card, i) => {
                const style = getCardStyle(i);

                return (
                  <motion.div
                    key={card.idx}
                    onClick={() => setCurrentIndex(i)}
                    animate={{
                      x: style.x,
                      scale: style.scale,
                      opacity: style.opacity,
                      rotateY: style.rotateY,
                      filter: style.filter,
                      zIndex: style.zIndex
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 240,
                      damping: 24
                    }}
                    className={`absolute inset-0 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between p-6 sm:p-7 text-white border transition-shadow duration-300 ${
                      style.isActive 
                        ? 'border-white/30 shadow-[0_25px_60px_rgba(0,0,0,0.35)]' 
                        : 'border-white/10 hover:opacity-75'
                    }`}
                    style={{
                      transformStyle: 'preserve-3d',
                      backgroundImage: `linear-gradient(180deg, rgba(8, 13, 15, 0.15) 0%, rgba(8, 13, 15, 0.9) 100%), url(${ASSET_BASE}${card.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Micro Film Grain Overlay */}
                    <div 
                      className="absolute inset-0 opacity-[0.14] pointer-events-none mix-blend-overlay"
                      style={{ backgroundImage: `url("${FILM_GRAIN_URL}")` }}
                    />

                    {/* Card Header: Index & Category Badge */}
                    <div className="flex justify-between items-center z-10">
                      <span className="font-mono text-xs font-semibold text-[#e5ded2] tracking-wider">
                        {card.idx}
                      </span>
                      <span className="text-[8.5px] font-medium px-3 py-1 rounded-full bg-black/45 backdrop-blur-md tracking-wider uppercase text-white/90 border border-white/15">
                        {card.tag}
                      </span>
                    </div>

                    {/* Card Content & Interactive Status */}
                    <div className="z-10 mt-auto">
                      <h3 className="text-base sm:text-xl font-extrabold tracking-wide mb-1 text-white">
                        {card.title}
                      </h3>
                      <p className="text-xs text-[#d1c8ba] leading-relaxed mb-4">
                        {card.desc1} {card.desc2}
                      </p>
                      
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#d8b56a]">
                          {style.isActive ? 'Active Hazard Analysis' : 'Click to Focus'}
                        </span>
                        <div className={`w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-white transition-all duration-300 ${
                          style.isActive ? 'bg-white/15 scale-105 shadow-md' : 'opacity-70'
                        }`}>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
