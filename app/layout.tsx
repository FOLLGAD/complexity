import type { Metadata } from "next";
import {
  // IBM_Plex_Sans,
  // IBM_Plex_Mono,
  Schibsted_Grotesk,
} from "next/font/google";
import "./globals.css";
import { PHProvider } from "@/components/providers";
import { SessionProvider } from "@/components/sessions";
import { Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";

const ibm = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Complexity",
  description: "The world's knowledge at your fingertips",
  icons: "/icon.png",
  keywords: ["Complexity", "Knowledge", "World", "Search with ai"],
  openGraph: {
    title: "Complexity",
    description: "The world's knowledge at your fingertips",
    url: "https://cplx.ai",
    images: [
      {
        url: "https://cplx.ai/og-image.jpg",
        width: 1116,
        height: 608,
        alt: "Complexity",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <link rel="favicon" href="/icon.png" sizes="any" />
      <PHProvider>
        <SessionProvider>
          <body className={ibm.className}>
            <Suspense fallback={<div></div>}>
              <div className="flex h-svh">
                <Sidebar />

                {children}
              </div>
            </Suspense>
          </body>
        </SessionProvider>
      </PHProvider>
    </html>
  );
}
