'use client'
export const dynamic = 'force-dynamic'

import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

import { SessionProvider } from "next-auth/react";

import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif'
})

// export const metadata: Metadata = {
//   title: "Horizon",
//   description: "Horizon is a modern banking platform for everyone.",
//   icons: {
//     icon: '/icons/logo.svg'
//   }
// };

export default function RootLayout({
  children, session
}: Readonly<{
  children: React.ReactNode;
  session: any
}>) {
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
          {children}
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
