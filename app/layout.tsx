import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { PHProvider } from "@/components/providers";

const ibm = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Complexity",
  description: "Complexity App",
  icons: "/icon.png",
  openGraph: {
    title: "Complexity",
    description: "Complexity App",
    url: "https://complexity.emil.zip",
    images: [
      {
        url: "https://complexity.emil.zip/og-image.png",
        width: 1116,
        height: 640,
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
        <body className={ibm.className}>{children}</body>
      </PHProvider>
    </html>
  );
}
