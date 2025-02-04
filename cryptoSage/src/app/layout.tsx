import { Inter } from "next/font/google"; // Font loader should be in the module scope
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import Disclaimer from "@/components/Disclaimer"; // Import Disclaimer

// Font loader should be outside the RootLayout component
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
        <Header />
        <main>{children}</main>
        <Disclaimer /> {/* Add Disclaimer Button */}
      </body>
    </html>
  );
}
