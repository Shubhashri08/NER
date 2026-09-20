import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

/* =========================================================
   ANIMATIONS
========================================================= */

const leftReveal = {
  hidden: {
    opacity: 0,
    x: -16,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const itemReveal = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* =========================================================
   01 — FASTER RESPONSE

   Standalone line illustration.
   NO background circle.
========================================================= */

/* =========================================================
   01 — FASTER RESPONSE
   Lightning / fast turnaround icon
========================================================= */

function ResponseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 sm:h-9 sm:w-9 text-[#1c2325]"
      aria-hidden="true"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

/* =========================================================
   02 — CONNECTED COMMUNITIES
   Clean multi-node network cluster icon
========================================================= */

function ConnectedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 sm:h-9 sm:w-9 text-[#1c2325]"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

/* =========================================================
   03 — EFFICIENT RESOURCE USE
   Supply / inventory telemetry metric icon
========================================================= */

function ResourceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 sm:h-9 sm:w-9 text-[#1c2325]"
      aria-hidden="true"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

/* =========================================================
   04 — DISASTER READY
   Protective resilience shield with checkmark
========================================================= */

function DisasterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 sm:h-9 sm:w-9 text-[#1c2325]"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/* =========================================================
   DATA
========================================================= */

const OUTCOMES = [
  {
    Icon: ResponseIcon,
    title: (
      <>
        Faster
        <br />
        Response
      </>
    ),
  },
  {
    Icon: ConnectedIcon,
    title: (
      <>
        Connected
        <br />
        Communities
      </>
    ),
  },
  {
    Icon: ResourceIcon,
    title: (
      <>
        Efficient
        <br />
        Resource Use
      </>
    ),
  },
  {
    Icon: DisasterIcon,
    title: (
      <>
        Disaster-Ready
        <br />
        Northeast
      </>
    ),
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function Impact() {
  return (
    <section
      id="impact"
      className="
        relative
        w-full
        overflow-hidden
        border-[#a09178]/20
        bg-[#ece5d6]
      "
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.2,
        }}
        className="
          relative
          z-10
          mx-auto
          flex
          flex-col
          lg:flex-row
          min-h-[240px]
          w-full
          max-w-[1380px]
          items-start
          lg:items-center
          justify-between
          px-6
          py-8
          sm:px-10
          sm:py-10
          lg:px-12
          lg:py-12
          gap-8
          lg:gap-12
        "
      >
        {/* =====================================================
            LEFT CONTENT
        ====================================================== */}

        <div
          className="
            w-full
            max-w-md
            shrink-0
            lg:w-[320px]
            xl:w-[360px]
          "
        >
          <motion.div
            variants={leftReveal}
            className="
              mb-[13px]
              font-mono
              text-[9px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-[#716b61]
            "
          >
            REAL IMPACT
          </motion.div>

          <motion.h2
            variants={leftReveal}
            className="
              text-[28px]
              sm:text-[32px]
              lg:text-[34px]
              font-medium
              leading-[1.05]
              tracking-[-0.045em]
              text-[#111719]
            "
          >
            Stronger Systems.
            <br />
            Safer Communities.
          </motion.h2>

          <motion.a
            variants={leftReveal}
            href="#about"
            className="
              group
              mt-[18px]
              sm:mt-[20px]
              inline-flex
              h-[38px]
              items-center
              gap-[11px]
              rounded-[6px]
              bg-[#11191b]
              px-[20px]
              text-[10px]
              font-medium
              text-white
              shadow-[0_4px_12px_rgba(0,0,0,0.11)]
              transition-all
              duration-300
              hover:-translate-y-[2px]
              hover:bg-[#1b2527]
              hover:shadow-[0_8px_20px_rgba(0,0,0,0.16)]
            "
          >
            <span>Our Approach</span>

            <ArrowRight
              className="
                h-[13px]
                w-[13px]
                transition-transform
                duration-300
                group-hover:translate-x-[3px]
              "
              strokeWidth={1.35}
            />
          </motion.a>
        </div>

        {/* =====================================================
            ONLY DIVIDER IN THE SECTION (Desktop)
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            scaleY: 0,
          }}
          whileInView={{
            opacity: 1,
            scaleY: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            hidden
            h-[130px]
            w-px
            origin-center
            border-l
            border-dashed
            border-[#8d8372]/55
            lg:block
          "
        />

        {/* =====================================================
            OUTCOMES
            Clean minimalist presentation: balanced spacing on wide monitors
        ====================================================== */}

        <div
          className="
            w-full
            grid
            grid-cols-2
            sm:grid-cols-4
            flex-1
            max-w-3xl
            gap-6
            sm:gap-6
            lg:gap-8
            lg:ml-2
          "
        >
          {OUTCOMES.map(({ Icon, title }, index) => (
            <motion.div
              key={index}
              variants={itemReveal}
              className="
                flex
                min-h-[120px]
                sm:min-h-[155px]
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              {/* Standalone SVG */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                  scale: 0.92,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                transition={{
                  duration: 0.45,
                  delay: 0.1 + index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="
                  mb-[12px]
                  sm:mb-[17px]
                  flex
                  items-center
                  justify-center
                  text-[#202728]
                  transition-transform
                  duration-200
                  hover:-translate-y-[2px]
                "
              >
                <Icon />
              </motion.div>

              {/* Label */}
              <motion.div
                variants={itemReveal}
                className="
                  text-[11px]
                  font-medium
                  leading-[1.4]
                  tracking-[-0.015em]
                  text-[#111719]
                  sm:text-[12px]
                "
              >
                {title}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}