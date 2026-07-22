import { Toaster } from "sonner";
import "./globals.css";
import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={sora.className}>
        {children}
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
