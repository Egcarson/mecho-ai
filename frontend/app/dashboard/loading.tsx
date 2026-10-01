// import { Loader2 } from "lucide-react";

// import { MechoLogo } from "@/components/brand/mecho-logo";

// export default function Loading() {
//   return (
//     <main
//       className="
//         flex
//         min-h-[70vh]
//         items-center
//         justify-center
//         bg-background
//         px-4
//       "
//     >
//       <div
//         className="
//           flex
//           flex-col
//           items-center
//           text-center
//         "
//       >
//         <div
//           className="
//             relative
//             flex
//             size-16
//             items-center
//             justify-center
//             rounded-2xl
//             border
//             border-border/60
//             bg-background
//             shadow-[0_20px_60px_rgba(47,1,117,0.08)]
//           "
//         >
//           <div
//             aria-hidden="true"
//             className="
//               absolute
//               inset-0
//               rounded-2xl
//               bg-mecho-gradient
//               opacity-10
//               blur-xl
//             "
//           />

//           <MechoLogo
//             className="
//               relative
//               h-8
//               w-auto
//             "
//           />
//         </div>

//         <div
//           className="
//             mt-5
//             flex
//             items-center
//             gap-2
//           "
//         >
//           <Loader2
//             className="
//               size-4
//               animate-spin
//               text-mecho-purple
//             "
//           />

//           <p
//             className="
//               text-sm
//               font-medium
//               text-foreground
//             "
//           >
//             Loading your workspace
//           </p>
//         </div>

//         <p
//           className="
//             mt-2
//             text-xs
//             text-muted-foreground
//           "
//         >
//           Mecho is getting things ready.
//         </p>
//       </div>
//     </main>
//   );
// }

/**
 * Dashboard navigation already has contextual loading states inside its
 * individual pages.
 *
 * The full branded dashboard-entry experience is controlled by
 * DashboardLayout so it only runs on the initial dashboard mount / hard
 * refresh rather than every nested route transition.
 */
export default function Loading() {
  return null;
}
