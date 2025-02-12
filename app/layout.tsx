"use client";

import "../styles/globals.css";
import { Inter, Caveat } from "next/font/google";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Memory Lane</title>
        <meta name="description" content="Capture and relive your precious moments" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="/preview.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>
      <body className={`${inter.variable} ${caveat.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
