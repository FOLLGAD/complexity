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
import { ComplexityProvider } from "@/components/complexity";
import { TooltipProvider } from "@/components/ui/tooltip";

const ibm = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Complexity",
  description: "The world's knowledge at your fingertips",
  icons: "/icon.png",
  keywords: ["Complexity", "AI Search", "Complexity AI"],
  metadataBase: new URL("https://cplx.ai"),
  openGraph: {
    title: "Complexity",
    description: "The world's knowledge at your fingertips",
    url: "https://cplx.ai",
    images: [
      {
        url: "/og-image.jpg",
        width: 1116,
        height: 608,
        alt: "Complexity",
      },
    ],
  },
  alternates: {
    canonical: "https://cplx.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <PHProvider>
        <SessionProvider>
          <TooltipProvider>
            <ComplexityProvider>
              <body className={ibm.className}>
                <Suspense fallback={<div></div>}>
                  <div className="flex h-svh">
                    <Sidebar />

                    {children}
                  </div>
                </Suspense>
              </body>
            </ComplexityProvider>
          </TooltipProvider>
        </SessionProvider>
      </PHProvider>
    </html>
  );
}
