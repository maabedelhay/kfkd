import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Katas",
  description: "Track and practice your coding katas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html
  lang="en"
  suppressHydrationWarning
  className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
>
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-800">
          ⚠ Demo version — no backend. View the source on{" "}
          <a href="https://github.com/maabedelhay/kfkd" className="underline font-medium hover:text-amber-600">
            GitHub
          </a>
        </div>
        <header className="border-b border-zinc-200 px-6 py-4 shrink-0">
          <nav className="max-w-6xl mx-auto flex items-center gap-2">
            <Link
              href="/katas"
              className="text-sm font-semibold tracking-tight text-zinc-900 hover:text-zinc-500 transition-colors"
            >
              <img src="../../kfkd_logo.png" alt="kfkd" width="60" height="60"/>
            </Link>
          </nav>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-zinc-200 px-6 py-3 text-center text-xs text-zinc-400">
          <a href="https://github.com/maabedelhay/kfkd" className="hover:text-zinc-600 transition-colors">
            github.com/maabedelhay/kfkd
          </a>
        </footer>
      </body>
    </html>
  );
}
