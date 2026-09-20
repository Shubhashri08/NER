import React from 'react';
import { motion } from 'motion/react';
import {
  ClipboardList,
  Share2,
  Truck,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

const ASSET_BASE = '/assets/';

const STEPS = [
  {
    num: '01',
    title: 'IDENTIFY NEEDS',
    detail: 'Understand what each location needs.',
    icon: ClipboardList,
  },
  {
    num: '02',
    title: 'PLAN & ALLOCATE',
    detail: 'Determine feasible routes and allocate resources.',
    icon: Share2,
  },
  {
    num: '03',
    title: 'MOVE & ADAPT',
    detail: 'Execute and replenish when conditions change.',
    icon: Truck,
  },
  {
    num: '04',
    title: 'PROTECT LIVES',
    detail: 'Relocate when a location cannot be safely sustained.',
    icon: ShieldCheck,
  },
];

const revealUp = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const containerReveal = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#ece5d6]
        text-[#111719]
      "
    >
      {/* Mountain background */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          bg-cover
          bg-center
          bg-no-repeat
          opacity-[0.23]
        "
        style={{
          backgroundImage: `url(${ASSET_BASE}workflow/mountain-background.png)`,
        }}
      />

      {/* Soft fade so the mountains remain extremely subtle */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          bg-gradient-to-r
          from-[#ece5d6]
          via-[#ece5d6]/75
          to-[#ece5d6]/20
        "
      />

      {/* Very soft lower fade */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          z-[1]
          h-[32%]
          bg-gradient-to-t
          from-[#ece5d6]
          to-transparent
        "
      />

      <motion.div
        className="
          relative
          z-[2]
          mx-auto
          w-full
          max-w-[1775px]
          px-5
          sm:px-8
          md:px-12
          lg:px-[66px]
          pb-14
          sm:pb-20
          lg:pb-[92px]
          pt-10
          sm:pt-12
          lg:pt-[58px]
        "
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.15,
        }}
      >
        {/* ================= HEADER ================= */}

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 sm:gap-10">
          <div>
            <motion.div
              variants={revealUp}
              className="
                mb-3
                sm:mb-[20px]
                font-mono
                text-[10px]
                font-medium
                uppercase
                tracking-[0.28em]
                sm:tracking-[0.34em]
                text-[#6e685d]
              "
            >
              HOW IT WORKS
            </motion.div>

            <div>
              <motion.h2
                variants={revealUp}
                className="
                  text-2xl
                  sm:text-4xl
                  md:text-[42px]
                  lg:text-[46px]
                  xl:text-[50px]
                  font-medium
                  leading-[1.15]
                  sm:leading-[1.02]
                  tracking-[-0.035em]
                  sm:tracking-[-0.045em]
                  text-[#111719]
                  flex
                  flex-wrap
                  items-center
                  gap-x-2
                  gap-y-1
                "
              >
                <span>Need</span>
                <span className="text-sm sm:text-lg font-normal text-[#5c5b55]">
                  →
                </span>
                <span>Plan</span>
                <span className="text-sm sm:text-lg font-normal text-[#5c5b55]">
                  →
                </span>
                <span>Move</span>
                <span className="text-sm sm:text-lg font-normal text-[#5c5b55]">
                  →
                </span>
                <span>Protect</span>
              </motion.h2>
            </div>

            <motion.p
              variants={revealUp}
              className="
                mt-3
                sm:mt-[16px]
                text-xs
                sm:text-[14px]
                font-normal
                leading-[1.5]
                tracking-[-0.01em]
                text-[#53606a]
              "
            >
              A complete disaster logistics intelligence cycle.
            </motion.p>
          </div>

          {/* Right-side statement */}
          <motion.div
            variants={revealUp}
            className="
              pt-[2px]
              self-start
              sm:self-auto
              text-left
              sm:text-right
              font-sans
              text-[9px]
              sm:text-[10px]
              font-medium
              uppercase
              leading-[1.25]
              sm:leading-[1.18]
              tracking-[0.05em]
              sm:tracking-[0.035em]
              text-[#35424a]
              border-l-2
              sm:border-l-0
              border-[#81786a]/30
              pl-3
              sm:pl-0
            "
          >
            <div>RESILIENT</div>
            <div>COMMUNITIES</div>
            <div>STRONGER</div>
            <div>TOMORROW</div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          variants={revealUp}
          className="
            mt-6
            sm:mt-[29px]
            h-px
            w-full
            bg-[#bdb5a5]/55
          "
        />

        {/* ================= PROCESS ================= */}

        {/* Desktop Layout (Large Screens) */}
        <motion.div
          variants={containerReveal}
          className="
            mt-[35px]
            hidden
            lg:grid
            lg:grid-cols-[1fr_42px_1fr_42px_1fr_42px_1fr]
            items-center
            gap-0
          "
        >
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <React.Fragment key={step.num}>
                <motion.div
                  variants={revealUp}
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-[18px]
                  "
                >
                  {/* Icon */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.82,
                    }}
                    whileInView={{
                      opacity: 1,
                      scale: 1,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.35,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.09,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="
                      flex
                      h-[70px]
                      w-[70px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f1e4c9]
                    "
                  >
                    <Icon
                      size={28}
                      strokeWidth={1.65}
                      className="text-[#171c1d]"
                    />
                  </motion.div>

                  {/* Text */}
                  <div className="min-w-0">
                    <motion.div
                      variants={revealUp}
                      className="
                        mb-[7px]
                        font-mono
                        text-[10px]
                        leading-none
                        tracking-[0.02em]
                        text-[#81786a]
                      "
                    >
                      {step.num}
                    </motion.div>

                    <motion.h3
                      variants={revealUp}
                      className="
                        whitespace-nowrap
                        text-[14px]
                        font-semibold
                        leading-[1.1]
                        tracking-[-0.025em]
                        text-[#111719]
                      "
                    >
                      {step.title}
                    </motion.h3>

                    <motion.p
                      variants={revealUp}
                      className="
                        mt-[9px]
                        max-w-[290px]
                        text-[11px]
                        font-normal
                        leading-[1.45]
                        tracking-[-0.005em]
                        text-[#53606a]
                      "
                    >
                      {step.detail}
                    </motion.p>
                  </div>
                </motion.div>

                {/* Arrow */}
                {index < STEPS.length - 1 && (
                  <motion.div
                    variants={revealUp}
                    className="
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <ArrowRight
                      size={22}
                      strokeWidth={1.15}
                      className="text-[#888277]"
                    />
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </motion.div>

        {/* Mobile & Tablet Layout (Clean Editorial Flow — NO Box Cards) */}
        <motion.div
          variants={containerReveal}
          className="
            mt-6
            sm:mt-8
            flex
            flex-col
            gap-6
            sm:gap-8
            lg:hidden
          "
        >
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.num}
                variants={revealUp}
                className="
                  flex
                  items-start
                  gap-4
                  sm:gap-5
                  group
                "
              >
                {/* Clean standalone Icon without card wrap */}
                <div
                  className="
                    flex
                    h-11
                    w-11
                    sm:h-12
                    sm:w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#f1e4c9]
                  "
                >
                  <Icon
                    size={22}
                    strokeWidth={1.65}
                    className="text-[#171c1d]"
                  />
                </div>

                {/* Text Block */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-medium text-[#81786a] leading-none">
                      {step.num}
                    </span>
                    <span className="h-px w-3 bg-[#81786a]/40" />
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#81786a]">
                      Step {index + 1}
                    </span>
                  </div>

                  <h3 className="text-[15px] sm:text-base font-semibold text-[#111719] tracking-tight leading-snug">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-xs text-[#53606a] leading-relaxed max-w-md">
                    {step.detail}
                  </p>

                  {index < STEPS.length - 1 && (
                    <div className="mt-5 h-px w-full bg-[#bdb5a5]/30" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}