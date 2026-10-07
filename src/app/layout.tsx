import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "For You — A Birthday Story",
  description: "A little collection of memories, places, and all the things I love about you.",
  robots: { index: false, follow: false, noarchive: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f1f0ec" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="story-booting">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
