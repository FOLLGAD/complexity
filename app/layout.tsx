import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { PHProvider } from "@/components/providers";
import { SessionProvider } from "@/components/sessions";
import { Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ComplexityProvider } from "@/components/complexity";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

import dynamic from "next/dynamic";

const ibm = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Complexity",
    template: "%s – Complexity",
  },
  description: "The world's knowledge at your fingertips",
  icons: "/icon.png",
  keywords: ["Complexity", "AI Search", "Complexity AI"],
  metadataBase: new URL("https://cplx.ai"),
  openGraph: {
    title: "Complexity",
    description: "The world's knowledge at your fingertips",
    url: "https://cplx.ai",
    siteName: "Complexity AI",
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

const PostHogPageview = dynamic(() => import("@/components/PostHogPageview"), {
  ssr: false,
});

// Smarter redirection logic to handle URL redirection more efficiently
const handleRedirection = () => {
  const fromHostname = "complexity.emil.zip";
  const targetHostname = "cplx.ai";

  if (window.location.hostname === fromHostname) {
    window.location.hostname = targetHostname;
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Call the redirection function
  if (typeof window !== "undefined") {
    handleRedirection();
  }

  return (
    <html lang="en" className="dark">
      <PHProvider>
        <SessionProvider>
          <TooltipProvider>
            <ComplexityProvider>
              <body className={ibm.className}>
                <PostHogPageview />
                <Suspense fallback={<div></div>}>
                  <div className="flex h-svh">
                    <Sidebar />

                    {children}
                  </div>
                  <Toaster />
                </Suspense>
              </body>
            </ComplexityProvider>
          </TooltipProvider>
        </SessionProvider>
      </PHProvider>
    </html>
  );
}
