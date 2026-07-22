// export default function Background() {
//   return (
//     <>
//       <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
//       <div className="absolute right-10 bottom-20 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl" />
//       <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
//     </>
//   );
// }
"use client";

import { motion } from "motion/react";

export default function Background() {
  return (
    <>
      {/* Purple Glow */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-32 -top-32 h-125 w-125 rounded-full bg-violet-500/20 blur-[150px] overflow-hidden"
      />
      {/* <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-[120px]" /> */}

      {/* Orange Glow */}
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-32 -right-20 h-112.5 w-112.5 rounded-full bg-orange-500/20 blur-[150px] overflow-hidden"
      />
      {/* <div className="absolute -bottom-52 -right-32 h-[450px] w-[450px] rounded-full bg-orange-500/15 blur-[120px]" /> */}

      {/* Center Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-87.5 w-87.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400 blur-[120px] overflow-hidden"
      />
      {/* <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[100px]" /> */}
    </>
  );
}
