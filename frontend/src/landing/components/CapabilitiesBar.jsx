import React from 'react';

const capabilitiesList = [
  {
    // Telecom tower / radio signal waves transmission: ((•))
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
    line1: 'Real Geographic',
    line2: 'Intelligence'
  },
  {
    // Isometric 3D package / logistics cube box with perspective
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21 16-9 5.2-9-5.2V8l9-5.2 9 5.2z" />
        <path d="M12 2.8v18.4" />
        <path d="m3 8 9 5.2 9-5.2" />
      </svg>
    ),
    line1: 'Need-Based',
    line2: 'Logistics'
  },
  {
    // Route replanning multi-node branch
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <path d="M13 6h3a2 2 0 0 1 2 2v7" />
        <line x1="6" y1="9" x2="6" y2="21" />
      </svg>
    ),
    line1: 'Dynamic',
    line2: 'Replanning'
  },
  {
    // Feasible relocation shield
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    line1: 'Feasible',
    line2: 'Relocation'
  },
  {
    // AI & Voice microphone / sound wave
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    line1: 'AI & Voice',
    line2: 'Assistant'
  },
  {
    // Built for government use security lock / clearance badge
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    line1: 'Built for',
    line2: 'Government Use'
  }
];

export default function CapabilitiesBar() {
  return (
    <div className="relative z-30 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12">
      {/* Boxy from all sides with rounded corners, matching font styles, proper height and padding */}
      <div 
        className="rounded-2xl border border-black/35 px-6 sm:px-8 py-5 sm:py-6 backdrop-blur-md"
        style={{
          background: 'linear-gradient(180deg, #f7f3ea 0%, #ece5d6 100%)'
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4 items-center">
          {capabilitiesList.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-3.5 px-3 py-1 group ${
                idx !== capabilitiesList.length - 1 ? 'lg:border-r lg:border-black/15' : ''
              }`}
            >
              <div className="text-[#1a211f] transition-transform duration-200 group-hover:scale-105 flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[12px] font-normal text-[#141b1d] tracking-normal leading-tight whitespace-nowrap">
                  {item.line1}
                </span>
                <span className="text-[12px] font-normal text-[#141b1d] tracking-normal leading-tight whitespace-nowrap mt-0.5">
                  {item.line2}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
