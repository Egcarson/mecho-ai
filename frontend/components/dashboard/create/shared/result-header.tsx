// "use client";

// import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";

// type ResultHeaderProps = {
// backLabel: string;
// onBack: () => void;
// onDelete?: () => void | Promise<void>;
// };

// export function ResultHeader({
// backLabel,
// onBack,
// onDelete,
// }: ResultHeaderProps) {
// const [deleting, setDeleting] = useState(false);

// async function handleDelete() {
//   if (!onDelete || deleting) return;

//   const confirmed = window.confirm(
//     "Delete this generation? This action cannot be undone.",
//   );

//   if (!confirmed) return;

//   setDeleting(true);

//   try {
//     await onDelete();
//   } catch (error) {
//     toast.error(
//       error instanceof Error
//         ? error.message
//         : "Couldn't delete this generation.",
//     );
//   } finally {
//     setDeleting(false);
//   }
// }

// return (
//   <div className="flex items-center justify-between gap-4">
//     <button
//       type="button"
//       onClick={onBack}
//       className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
//     >
//       <ArrowLeft className="size-4" />
//       {backLabel}
//     </button>

//     {onDelete && (
//       <button
//         type="button"
//         disabled={deleting}
//         onClick={() => void handleDelete()}
//         className="inline-flex h-9 items-center gap-2 rounded-full border border-destructive/20 px-3.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/5 disabled:pointer-events-none disabled:opacity-50"
//       >
//         {deleting ? (
//           <>
//             <Loader2 className="size-3.5 animate-spin" />
//             Deleting...
//           </>
//         ) : (
//           <>
//             <Trash2 className="size-3.5" />
//             Delete generation
//           </>
//         )}
//       </button>
//     )}
//   </div>
// );
// }
