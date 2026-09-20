import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const TERRAIN_IMG = '/assets/logistics/terrain-model.png';

export default function Solution({ onExplorePlatform }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      id="platform"
      className="relative w-full overflow-hidden bg-black text-white select-none"
    >
      {/* =========================================================
          MAIN HERO
      ========================================================= */}
      <div
        className="
          relative
          mx-auto
          h-[680px]
          w-full
          max-w-[1860px]
          overflow-hidden
          bg-black
        "
      >

        {/* =======================================================
            VERY SUBTLE ATMOSPHERIC LIGHT
            Behind terrain only — no glassmorphism.
        ======================================================= */}
        <div
          className="
            pointer-events-none
            absolute
            right-[4%]
            top-[12%]
            z-0
            h-[560px]
            w-[700px]
            rounded-full
            bg-[radial-gradient(ellipse_at_center,rgba(45,85,65,0.10)_0%,rgba(20,45,35,0.035)_38%,transparent_72%)]
            blur-[55px]
          "
        />

        {/* =======================================================
            LEFT CONTENT
        ======================================================= */}
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            absolute
            left-[10.8%]
            top-[196px]
            z-30
            w-[440px]
          "
        >

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="
              mb-[22px]
              font-mono
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-[#8d9794]
            "
          >
            THE SOLUTION
          </motion.div>

          {/* =====================================================
              HEADLINE
          ===================================================== */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.65,
              delay: 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              m-0
              mb-[27px]
              w-[440px]
              font-sans
              text-[58px]
              font-black
              leading-[0.94]
              tracking-[-0.045em]
              text-white
            "
          >
            From Data to
            <br />
            Decisions to
            <br />
            Delivery.
          </motion.h2>

          {/* =====================================================
              DESCRIPTION
          ===================================================== */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.55,
              delay: 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              m-0
              mb-[31px]
              w-[365px]
              font-sans
              text-[14px]
              font-normal
              leading-[1.5]
              tracking-[-0.01em]
              text-[#9da6a3]
            "
          >
            An integrated platform for disaster logistics, routing,
            replanning and safe relocation.
          </motion.p>

          {/* =====================================================
              CTA
          ===================================================== */}
          <motion.button
            onClick={onExplorePlatform ? onExplorePlatform : () => { window.location.href = '/command'; }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.18,
            }}
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.98,
            }}
            className="
              group
              inline-flex
              h-[50px]
              items-center
              gap-[18px]
              rounded-[13px]
              bg-[#eee5d6]
              px-[27px]
              font-sans
              text-[12px]
              font-bold
              tracking-[-0.01em]
              text-[#121516]
              shadow-[0_8px_25px_rgba(0,0,0,0.28)]
              transition-all
              duration-200
              hover:bg-white
              cursor-pointer
            "
          >
            <span>
              Explore the Platform
            </span>

            <ArrowRight
              className="
                h-[15px]
                w-[15px]
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
            />
          </motion.button>
        </motion.div>

        {/* =======================================================
            TERRAIN
        ======================================================= */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.97,
            x: 25,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
            x: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{
            y: isHovered ? -5 : 0,
          }}
          className="
            absolute
            left-[42%]
            top-[52px]
            z-10
            w-[55%]
            cursor-default
          "
        >
          <motion.img
            src={TERRAIN_IMG}
            alt="NER 3D Disaster Logistics Route Replanning Terrain Mesh"
            draggable={false}
            animate={{
              scale: isHovered ? 1.012 : 1,
            }}
            transition={{
              duration: 0.45,
              ease: 'easeOut',
            }}
            className="
              block
              h-auto
              w-full
              object-contain
            "
            style={{
              filter: `
                brightness(1.02)
                contrast(1.06)
                saturate(0.96)
              `,
            }}
          />
        </motion.div>

        {/* =======================================================
            VERY SUBTLE TERRAIN SHADOW
            Helps separate the 3D map from the black background.
        ======================================================= */}
        <div
          className="
            pointer-events-none
            absolute
            left-[48%]
            top-[510px]
            z-[5]
            h-[120px]
            w-[47%]
            rounded-[50%]
            bg-black
            opacity-80
            blur-[45px]
          "
        />

      </div>

      {/* =========================================================
          RESPONSIVE
      ========================================================= */}
      <style>{`
        @media (max-width: 1200px) {
          #platform > div:first-child {
            height: 650px;
          }

          #platform .absolute.left-\\[10\\.8\\%\\] {
            left: 7%;
          }

          #platform .absolute.left-\\[42\\%\\] {
            left: 40%;
            width: 60%;
          }
        }

        @media (max-width: 900px) {
          #platform > div:first-child {
            height: 760px;
          }

          #platform .absolute.left-\\[10\\.8\\%\\] {
            left: 7%;
            top: 125px;
            width: 430px;
          }

          #platform .absolute.left-\\[10\\.8\\%\\] h2 {
            font-size: 52px;
          }

          #platform .absolute.left-\\[42\\%\\] {
            left: 32%;
            top: 330px;
            width: 75%;
          }
        }

        @media (max-width: 640px) {
          #platform > div:first-child {
            height: 850px;
          }

          #platform .absolute.left-\\[10\\.8\\%\\] {
            left: 28px;
            top: 90px;
            width: calc(100% - 56px);
          }

          #platform .absolute.left-\\[10\\.8\\%\\] h2 {
            width: 100%;
            font-size: 45px;
            line-height: 0.96;
          }

          #platform .absolute.left-\\[10\\.8\\%\\] p {
            width: 100%;
            max-width: 360px;
          }

          #platform .absolute.left-\\[42\\%\\] {
            left: -5%;
            top: 440px;
            width: 120%;
          }

          #platform .absolute.left-\\[48\\%\\] {
            left: 10%;
            top: 650px;
            width: 90%;
          }
        }
      `}</style>
    </section>
  );
}