import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, MapPin } from 'lucide-react';
import { STATES_DATA } from '../data/constants.js';

const ASSET_BASE = '/assets/';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18,
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

export default function States() {
  const [selectedState, setSelectedState] = useState(null);

  return (
    <section
      id="ner"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#ece5d6]
        text-[#111719]
        py-[62px]
        sm:py-[70px]
        lg:py-[76px]
      "
    >
      {/* Very subtle atmospheric texture */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.16]
        "
        style={{
          background:
            'radial-gradient(circle at 85% 15%, rgba(255,255,255,0.7), transparent 34%)',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.18,
        }}
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1775px]
          px-[40px]
          sm:px-[52px]
          lg:px-[66px]
        "
      >
        {/* ================= HEADER ================= */}

        <div
          className="
            flex
            items-end
            justify-between
            gap-8
            mb-[28px]
            sm:mb-[32px]
          "
        >
          <div>
            <motion.span
              variants={fadeUp}
              className="
                mb-[10px]
                block
                font-mono
                text-[9px]
                font-medium
                uppercase
                tracking-[0.25em]
                text-[#6d675d]
              "
            >
              The Northeastern Region
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="
                text-[34px]
                font-medium
                leading-[1]
                tracking-[-0.045em]
                text-[#111719]
                sm:text-[38px]
                lg:text-[42px]
              "
            >
              Eight States. One Commitment.
            </motion.h2>
          </div>

          <motion.a
            variants={fadeUp}
            href="#contact"
            className="
              group
              mb-[3px]
              inline-flex
              shrink-0
              items-center
              gap-[8px]
              text-[10px]
              font-medium
              tracking-[-0.01em]
              text-[#1c2426]
              transition-colors
              duration-300
              hover:text-[#8b7344]
            "
          >
            <span>Explore NER</span>

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

        {/* ================= STATE CARDS ================= */}

        <motion.div
          variants={containerVariants}
          className="
            grid
            grid-cols-2
            gap-[8px]
            sm:grid-cols-4
            lg:grid-cols-8
            lg:gap-[9px]
          "
        >
          {STATES_DATA.map((st, index) => (
            <motion.button
              key={st.name}
              variants={fadeUp}
              type="button"
              onClick={() => setSelectedState(st)}
              whileHover={{
                y: -5,
                transition: {
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              whileTap={{
                scale: 0.985,
              }}
              className="
                group
                relative
                h-[205px]
                overflow-hidden
                rounded-[10px]
                bg-[#d8d0c0]
                text-left
                shadow-[0_5px_18px_rgba(38,35,29,0.10)]
                ring-1
                ring-black/[0.06]
                transition-shadow
                duration-500
                hover:shadow-[0_14px_30px_rgba(38,35,29,0.18)]
                sm:h-[225px]
                lg:h-[248px]
                xl:h-[258px]
              "
            >
              {/* Image */}
              <img
                src={`${ASSET_BASE}states/${st.img}`}
                alt={st.name}
                loading="lazy"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-[900ms]
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover:scale-[1.055]
                "
              />

              {/* Clean image treatment */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-b
                  from-black/[0.04]
                  via-transparent
                  to-black/[0.78]
                "
              />

              {/* Slight warm overlay */}
              <div
                className="
                  absolute
                  inset-0
                  bg-[#30291f]/[0.05]
                  transition-colors
                  duration-500
                  group-hover:bg-[#30291f]/[0.01]
                "
              />

              {/* State code */}
              <div
                className="
                  absolute
                  right-[9px]
                  top-[9px]
                  rounded-[4px]
                  bg-white/75
                  px-[6px]
                  py-[3px]
                  font-mono
                  text-[7px]
                  font-medium
                  leading-none
                  tracking-[0.04em]
                  text-[#202527]
                  backdrop-blur-[3px]
                  transition-all
                  duration-300
                  group-hover:bg-white/90
                "
              >
                {st.code}
              </div>

              {/* Bottom state name */}
              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  p-[11px]
                  sm:p-[12px]
                "
              >
                <h3
                  className="
                    text-[12px]
                    font-medium
                    leading-[1.15]
                    tracking-[-0.02em]
                    text-white
                    drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]
                    sm:text-[13px]
                  "
                >
                  {st.name}
                </h3>
              </div>

              {/* Premium hover line */}
              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  w-0
                  bg-white/80
                  transition-all
                  duration-500
                  group-hover:w-full
                "
              />
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* ================= DETAIL MODAL ================= */}

      <AnimatePresence>
        {selectedState && (
          <motion.div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/45
              p-5
              backdrop-blur-[5px]
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedState(null)}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 12,
                scale: 0.98,
              }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={(e) => e.stopPropagation()}
              className="
                relative
                w-full
                max-w-[390px]
                overflow-hidden
                rounded-[14px]
                bg-[#11191b]
                text-white
                shadow-[0_30px_80px_rgba(0,0,0,0.35)]
                ring-1
                ring-white/[0.08]
              "
            >
              {/* Modal image */}
              <div className="relative h-[155px] overflow-hidden">
                <img
                  src={`${ASSET_BASE}states/${selectedState.img}`}
                  alt={selectedState.name}
                  className="h-full w-full object-cover"
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#11191b]
                    via-[#11191b]/20
                    to-transparent
                  "
                />

                <button
                  type="button"
                  onClick={() => setSelectedState(null)}
                  className="
                    absolute
                    right-[12px]
                    top-[12px]
                    flex
                    h-[30px]
                    w-[30px]
                    items-center
                    justify-center
                    rounded-full
                    bg-black/30
                    text-white/80
                    backdrop-blur-md
                    transition-all
                    hover:bg-black/50
                    hover:text-white
                  "
                >
                  <X className="h-[15px] w-[15px]" strokeWidth={1.5} />
                </button>

                <div className="absolute bottom-[14px] left-[18px]">
                  <div className="mb-[4px] font-mono text-[8px] tracking-[0.12em] text-white/60">
                    {selectedState.code}
                  </div>

                  <h3 className="text-[22px] font-medium tracking-[-0.03em]">
                    {selectedState.name}
                  </h3>
                </div>
              </div>

              <div className="px-[18px] pb-[20px] pt-[17px]">
                <div
                  className="
                    flex
                    items-center
                    gap-[7px]
                    text-[10px]
                    text-white/55
                  "
                >
                  <MapPin
                    className="h-[13px] w-[13px] text-[#72b56d]"
                    strokeWidth={1.5}
                  />

                  <span>
                    {selectedState.districts} Administrative Districts
                  </span>
                </div>

                <div className="my-[17px] h-px bg-white/[0.09]" />

                <div className="space-y-[11px] text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-white/45">
                      Logistics Status
                    </span>

                    <span className="font-medium text-white/85">
                      {selectedState.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/45">
                      Alert Level
                    </span>

                    <span className="font-medium text-[#d8b56a]">
                      {selectedState.alert}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedState(null)}
                  className="
                    mt-[20px]
                    w-full
                    rounded-[7px]
                    border
                    border-white/[0.10]
                    bg-white/[0.05]
                    px-4
                    py-[9px]
                    text-[10px]
                    font-medium
                    text-white/80
                    transition-all
                    duration-300
                    hover:bg-white/[0.09]
                    hover:text-white
                  "
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}