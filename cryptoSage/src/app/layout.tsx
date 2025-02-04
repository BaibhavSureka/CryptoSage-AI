import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import MetaMaskWrapper from "@/components/MetaMaskWrapper"; // Import the new wrapper

const fontSans = FontSans({
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
          "min-h-screen bg-background font-sans antialiased",
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
