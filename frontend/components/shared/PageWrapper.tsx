// interface PageWrapperProps {
//   children: React.ReactNode;
// }

// export default function PageWrapper({ children }: PageWrapperProps) {
//   return (
//     <main className="relative min-h-screen overflow-hidden bg-white">
//       {children}
//     </main>
//   );
// }

// interface PageWrapperProps {
//   children: React.ReactNode;
//   className?: string;
// }

// export default function PageWrapper({
//   children,
//   className = "",
// }: PageWrapperProps) {
//   return (
//     <main
//       className={`relative min-h-screen overflow-hidden bg-white ${className}`}
//     >
//       {children}
//     </main>
//   );
// }

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({
  children,
  className = "",
}: PageWrapperProps) {
  return (
    <main
      className={`
        relative
        min-h-screen
        bg-[#090414]
        text-white
        overflow-hidden
        ${className}
      `}
    >
      {children}
    </main>
  );
}
