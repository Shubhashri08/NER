import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Platform', href: '#platform' },
  { label: 'Impact', href: '#impact' },
  { label: 'NER', href: '#ner' },
  { label: 'Contact', href: '#contact' },
];

const reveal = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Footer({ onExplorePlatform }) {
  return (
    <footer
      id="contact"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#05090a]
        text-[#89938f]
      "
    >
      {/* =====================================================
          BEIGE → BLACK BACKGROUND TRANSITION
      ====================================================== */}
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[92px]
          bg-[#ece5d6]
        "
      />

      {/* =====================================================
          FOOTER CONTENT CONTAINER
      ====================================================== */}
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1740px]
          px-[22px]
          pt-[28px]
          sm:px-[32px]
          lg:px-[40px]
          lg:pt-[32px]
        "
      >

        {/* ===================================================
            CTA BANNER
        ==================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.18,
          }}
          variants={reveal}
          className="
            relative
            z-10
            min-h-[150px]
            overflow-hidden
            rounded-[17px]
            border
            border-white/[0.18]
            bg-[#071012]
            shadow-[0_20px_55px_rgba(0,0,0,0.4)]
            ring-1
            ring-white/[0.08]
          "
        >

          {/* Mountain background image */}
          <div
            className="
              absolute
              inset-0
              bg-cover
              bg-center
              bg-no-repeat
            "
            style={{
              backgroundImage: "url('/assets/cta/northeast-sunset.png')",
            }}
          />

          {/* Dark overlay */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#05090a]/[0.86]
              via-[#071012]/[0.58]
              to-[#05090a]/[0.72]
            "
          />

          {/* Bottom fade */}
          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-[70px]
              bg-gradient-to-t
              from-[#05090a]/[0.72]
              to-transparent
            "
          />

          {/* Warm atmospheric subtle glow */}
          <div
            className="
              pointer-events-none
              absolute
              right-[15%]
              top-[-100px]
              h-[220px]
              w-[420px]
              rounded-full
              bg-[#d0aa68]/[0.045]
              blur-[100px]
            "
          />

          {/* Top highlight */}
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              h-px
              bg-white/[0.14]
            "
          />

          {/* Banner Content Grid */}
          <div
            className="
              relative
              z-10
              flex
              flex-col
              lg:grid
              min-h-[150px]
              items-start
              lg:items-center
              gap-5
              sm:gap-6
              lg:gap-[24px]
              px-5
              py-6
              sm:px-[38px]
              sm:py-[28px]
              lg:grid-cols-[280px_1fr_auto]
              lg:px-[48px]
            "
          >

            {/* Brand */}
            <div className="flex items-center gap-[14px]">
              <div
                className="
                  font-serif
                  text-[30px]
                  sm:text-[36px]
                  leading-none
                  tracking-[-0.03em]
                  text-[#f3eee5]
                "
              >
                NER
              </div>

              <div className="h-[32px] sm:h-[36px] w-px bg-white/[0.25]" />

              <div>
                <div
                  className="
                    font-mono
                    text-[9.5px]
                    sm:text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-[#ddd7cd]
                  "
                >
                  Disaster Logistics
                </div>

                <div
                  className="
                    mt-[3px]
                    font-mono
                    text-[8.5px]
                    sm:text-[9px]
                    uppercase
                    tracking-[0.12em]
                    text-[#87928e]
                  "
                >
                  Intelligence Platform
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="min-w-0 w-full lg:pl-[8px]">
              <div
                className="
                  mb-[5px]
                  font-mono
                  text-[9px]
                  sm:text-[10px]
                  uppercase
                  tracking-[0.16em]
                  text-[#d2ae67]
                "
              >
                NER{' '}
                <span
                  className="
                    font-serif
                    normal-case
                    italic
                    tracking-normal
                    text-[#d7c39c]
                  "
                >
                  Resilience Initiative
                </span>
              </div>

              <h2
                className="
                  text-[22px]
                  sm:text-[28px]
                  lg:text-[30px]
                  font-semibold
                  leading-[1.12]
                  sm:leading-[1.08]
                  tracking-[-0.04em]
                  text-[#f2eee5]
                "
              >
                A Safer Northeast Is{' '}
                <span
                  className="
                    font-serif
                    font-normal
                    italic
                    text-[#e2c99b]
                  "
                >
                  Possible.
                </span>
              </h2>

              <p
                className="
                  mt-[6px]
                  max-w-[700px]
                  text-[11.5px]
                  sm:text-[12px]
                  leading-[1.5]
                  text-[#a6afac]
                "
              >
                Join the mission for a resilient future.
              </p>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={onExplorePlatform ? onExplorePlatform : () => { window.location.href = '/command'; }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="
                group
                inline-flex
                h-[44px]
                sm:h-[46px]
                w-full
                sm:w-auto
                items-center
                justify-center
                gap-[10px]
                rounded-[8px]
                bg-[#f0e8d9]
                px-[22px]
                text-[12px]
                font-bold
                tracking-tight
                text-[#101718]
                shadow-[0_8px_20px_rgba(0,0,0,0.22)]
                transition-all
                duration-300
                hover:bg-[#fffaf0]
                cursor-pointer
              "
            >
              <span>Get Started</span>
              <ArrowRight
                className="
                  h-[14px]
                  w-[14px]
                  transition-transform
                  duration-300
                  group-hover:translate-x-[4px]
                "
                strokeWidth={1.5}
              />
            </motion.button>

          </div>
        </motion.div>

        {/* Separator line */}
        <div
          className="
            relative
            z-10
            mt-4
            sm:mt-[20px]
            h-px
            w-full
            bg-gradient-to-r
            from-transparent
            via-white/[0.12]
            to-transparent
          "
        />

        {/* =====================================================
            NAVIGATION ROW
        ====================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={reveal}
          className="
            relative
            z-10
            flex
            flex-col
            sm:flex-row
            min-h-[60px]
            sm:min-h-[72px]
            items-start
            sm:items-center
            justify-between
            gap-4
            sm:gap-[30px]
            py-4
            sm:py-0
          "
        >
          {/* Nav Links */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-[28px]">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className="
                  relative
                  text-[11.5px]
                  sm:text-[12px]
                  font-medium
                  text-[#8e9995]
                  transition-colors
                  duration-200
                  hover:text-[#f2eee5]
                "
              >
                {item.label}
                {index === 0 && (
                  <span
                    className="
                      absolute
                      -bottom-[4px]
                      sm:-bottom-[10px]
                      left-0
                      h-px
                      w-full
                      bg-[#d4bb87]
                    "
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Right statement */}
          <div
            className="
              flex
              items-center
              gap-[8px]
              sm:gap-[10px]
              text-[10px]
              sm:text-[11px]
              text-[#7a8682]
            "
          >
            <span>Government</span>
            <span className="text-white/[0.2]">•</span>
            <span>People</span>
            <span className="text-white/[0.2]">•</span>
            <span>A Safer Northeast</span>
            <span className="hidden sm:inline-block ml-[6px] h-px w-[36px] bg-[#bca573]" />
          </div>
        </motion.div>

        {/* =====================================================
            BOTTOM ROW: CLEAN COPYRIGHT ONLY (NO SOCIAL MEDIA ICONS)
        ====================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={reveal}
          className="
            relative
            z-10
            flex
            flex-col
            sm:flex-row
            min-h-[50px]
            sm:min-h-[60px]
            items-center
            justify-between
            gap-2
            border-t
            border-white/[0.08]
            pb-6
            sm:pb-[24px]
            pt-4
            sm:pt-[18px]
          "
        >
          <div className="text-[10.5px] sm:text-[11px] text-[#717c79] text-center sm:text-left">
            &copy; {new Date().getFullYear()} NER Disaster Logistics Intelligence Platform. All rights reserved.
          </div>
        </motion.div>

      </div>
    </footer>
  );
}