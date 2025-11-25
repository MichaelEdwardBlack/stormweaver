import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stormweaver",
  description: "Cosmere RPG Character Creator and Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-linear-to-b from-blue-950 to-black p-2 lg:p-8 w-full min-h-screen text-white ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {/* <Navbar /> */}
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
