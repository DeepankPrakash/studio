import type {Metadata} from 'next';
import { Inter } from "next/font/google";
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: 'FITMATE',
  description: 'Your personal AI fitness assistant.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${inter.variable}`} suppressHydrationWarning>
          {children}
          <Toaster />
      </body>
    </html>
  );
}
