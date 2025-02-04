import { Inter } from "next/font/google"; // Use Inter instead of Mona Sans
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import MetaMaskWrapper from "@/components/MetaMaskWrapper"; // Import the new wrapper
import React from "react";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-gray-900 font-sans antialiased",
          fontSans.variable
        )}
      >
        {/* Wrap everything inside MetaMaskWrapper */}
        <MetaMaskWrapper>
          <Header />
          <main className="">{children}</main>
        </MetaMaskWrapper>
      </body>
    </html>
  );
}
