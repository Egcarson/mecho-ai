// "use client";

// import { useEffect, useState } from "react";
// import { AnimatePresence, motion } from "motion/react";

// import { MechoLogo } from "@/components/brand/mecho-logo";

// export function MechoLoader() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     document.body.style.overflow = "hidden";

//     const timer = window.setTimeout(() => {
//       setLoading(false);
//       document.body.style.overflow = "";
//     }, 2900);

//     return () => {
//       window.clearTimeout(timer);
//       document.body.style.overflow = "";
//     };
//   }, []);

//   return (
//     <AnimatePresence>
//       {loading && (
//         <motion.div
//           initial={{ opacity: 1 }}
//           exit={{
//             opacity: 0,
//           }}
//           transition={{
//             duration: 0.45,
//             ease: [0.22, 1, 0.36, 1],
//           }}
//           className="
//             fixed inset-0 z-[9999]
//             flex items-center justify-center
//             overflow-hidden
//             bg-background
//           "
//         >
//           {/* very subtle background atmosphere */}
//           <div
//             aria-hidden="true"
//             className="
//               pointer-events-none
//               absolute left-1/2 top-1/2
//               h-64 w-64
//               -translate-x-1/2 -translate-y-1/2
//               rounded-full
//               bg-mecho-purple/5
//               blur-[100px]
//             "
//           />

//           <div className="relative flex flex-col items-center">
//             {/* Main animation stage */}
//             <div className="relative flex size-[190px] items-center justify-center sm:size-[220px]">
//               {/* Outer rotating ring */}
//               <motion.div
//                 initial={{
//                   opacity: 0,
//                   scale: 0.72,
//                   rotate: -40,
//                 }}
//                 animate={{
//                   opacity: [0, 0, 0.45, 0.45, 0],
//                   scale: [0.72, 0.72, 1, 1, 1.04],
//                   rotate: [-40, -40, 0, 130, 170],
//                 }}
//                 transition={{
//                   duration: 2.15,
//                   times: [0, 0.36, 0.52, 0.82, 1],
//                   ease: [0.22, 1, 0.36, 1],
//                 }}
//                 className="
//                   absolute inset-3
//                   rounded-full
//                   border border-mecho-purple/30
//                 "
//               >
//                 {/* ring accent */}
//                 <span
//                   className="
//                     absolute left-1/2 top-[-3px]
//                     size-1.5
//                     -translate-x-1/2
//                     rounded-full
//                     bg-mecho-purple
//                     shadow-[0_0_10px_rgba(111,44,255,0.65)]
//                   "
//                 />
//               </motion.div>

//               {/* Inner rotating ring */}
//               <motion.div
//                 initial={{
//                   opacity: 0,
//                   scale: 0.7,
//                   rotate: 45,
//                 }}
//                 animate={{
//                   opacity: [0, 0, 0.34, 0.34, 0],
//                   scale: [0.7, 0.7, 0.83, 0.83, 0.87],
//                   rotate: [45, 45, 0, -150, -190],
//                 }}
//                 transition={{
//                   duration: 2.15,
//                   times: [0, 0.38, 0.54, 0.82, 1],
//                   ease: [0.22, 1, 0.36, 1],
//                 }}
//                 className="
//                   absolute inset-[34px]
//                   rounded-full
//                   border border-mecho-orange/25
//                 "
//               >
//                 <span
//                   className="
//                     absolute bottom-[-3px] left-1/2
//                     size-1.5
//                     -translate-x-1/2
//                     rounded-full
//                     bg-mecho-orange
//                     shadow-[0_0_10px_rgba(255,111,31,0.55)]
//                   "
//                 />
//               </motion.div>

//               {/* Logo forms from inside */}
//               <motion.div
//                 initial={{
//                   opacity: 0,
//                   scale: 0.48,
//                   filter: "blur(8px)",
//                   clipPath: "circle(0% at 50% 50%)",
//                 }}
//                 animate={{
//                   opacity: [0, 0.65, 1],
//                   scale: [0.48, 0.78, 1],
//                   filter: ["blur(8px)", "blur(3px)", "blur(0px)"],
//                   clipPath: [
//                     "circle(0% at 50% 50%)",
//                     "circle(32% at 50% 50%)",
//                     "circle(75% at 50% 50%)",
//                   ],
//                 }}
//                 transition={{
//                   duration: 1.25,
//                   times: [0, 0.46, 1],
//                   ease: [0.16, 1, 0.3, 1],
//                 }}
//                 className="
//                   relative z-10
//                   flex items-center justify-center
//                 "
//               >
//                 <MechoLogo className="h-20 w-auto sm:h-24" />
//               </motion.div>

//               {/* small completion pulse */}
//               <motion.div
//                 initial={{
//                   opacity: 0,
//                   scale: 0.6,
//                 }}
//                 animate={{
//                   opacity: [0, 0, 0.45, 0],
//                   scale: [0.6, 0.6, 1, 1.45],
//                 }}
//                 transition={{
//                   duration: 1.15,
//                   delay: 0.82,
//                   times: [0, 0.15, 0.55, 1],
//                   ease: "easeOut",
//                 }}
//                 className="
//                   pointer-events-none
//                   absolute
//                   size-28
//                   rounded-full
//                   border border-mecho-purple/25
//                 "
//               />

//               {/* final subtle logo glow */}
//               <motion.div
//                 initial={{
//                   opacity: 0,
//                 }}
//                 animate={{
//                   opacity: [0, 0, 1],
//                 }}
//                 transition={{
//                   duration: 1.55,
//                   times: [0, 0.7, 1],
//                 }}
//                 className="
//                   pointer-events-none
//                   absolute
//                   z-0
//                   size-24
//                   rounded-full
//                   bg-mecho-purple/10
//                   blur-2xl
//                 "
//               />
//             </div>

//             {/* Brand text */}
//             <motion.div
//               initial={{
//                 opacity: 0,
//                 y: 8,
//               }}
//               animate={{
//                 opacity: [0, 0, 1],
//                 y: [8, 8, 0],
//               }}
//               transition={{
//                 duration: 2.15,
//                 times: [0, 0.72, 1],
//                 ease: [0.22, 1, 0.36, 1],
//               }}
//               className="-mt-3 text-center"
//             >
//               <motion.p
//                 initial={{
//                   letterSpacing: "0.3em",
//                 }}
//                 animate={{
//                   letterSpacing: "0.17em",
//                 }}
//                 transition={{
//                   delay: 1.55,
//                   duration: 0.6,
//                   ease: [0.22, 1, 0.36, 1],
//                 }}
//                 className="
//                   text-sm
//                   font-semibold
//                   uppercase
//                   text-foreground
//                 "
//               >
//                 MECHO AI
//               </motion.p>

//               <motion.div
//                 initial={{
//                   opacity: 0,
//                   scaleX: 0,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   scaleX: 1,
//                 }}
//                 transition={{
//                   delay: 1.92,
//                   duration: 0.45,
//                   ease: [0.22, 1, 0.36, 1],
//                 }}
//                 className="
//                   mx-auto
//                   mt-3
//                   h-px
//                   w-11
//                   origin-center
//                   bg-mecho-gradient
//                 "
//               />
//             </motion.div>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

type MechoLoaderProps = {
  visible: boolean;
};

export function MechoLoader({ visible }: MechoLoaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{
            opacity: 1,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            fixed
            inset-0
            z-[200]
            flex
            items-center
            justify-center
            overflow-hidden
            bg-background
          "
        >
          {/* Ambient glow */}

          <motion.div
            aria-hidden="true"
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.18, 0.32, 0.18],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              h-[300px]
              w-[300px]
              rounded-full
              bg-mecho-gradient
              blur-[120px]

              sm:h-[420px]
              sm:w-[420px]
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              items-center
            "
          >
            {/* Logo */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.82,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                flex
                size-20
                items-center
                justify-center
              "
            >
              <motion.div
                animate={{
                  scale: [1, 1.04, 1],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  relative
                  size-14

                  sm:size-16
                "
              >
                <Image
                  src="/logo.svg"
                  alt="Mecho AI"
                  fill
                  priority
                  className="object-contain"
                  sizes="64px"
                />
              </motion.div>
            </motion.div>

            {/* Brand reveal */}

            <motion.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.5,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                mt-5
                text-center
              "
            >
              <p
                className="
                  text-sm
                  font-semibold
                  tracking-[0.22em]
                "
              >
                MECHO AI
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  text-muted-foreground
                "
              >
                Message. Echo. Create.
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
