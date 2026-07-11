import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ArogyaLogo } from "@/components/ui/arogya-logo";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Arogya AI - Preventive AI Health Assistant",
  description: "Identify health risks early using AI-powered symptom analysis, tongue scans, and eye analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${poppins.variable} ${inter.variable} antialiased font-sans bg-brand-bg-light dark:bg-brand-bg-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          {children}
        </main>
        
        {/* Premium Footer */}
        <footer className="border-t border-slate-200/50 dark:border-slate-800/40 bg-white/50 dark:bg-slate-950/40 backdrop-blur-sm py-8 mt-12 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center">
                <ArogyaLogo width={28} height={28} withText={true} withTagline={false} />
                <span className="text-xs text-slate-400 ml-4">
                  © 2026. Early Detection. Better Protection. All rights reserved.
                </span>
              </div>
              <div className="flex space-x-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <a href="/" className="hover:text-brand-primary transition-colors">Home</a>
                <a href="/dashboard" className="hover:text-brand-primary transition-colors">Dashboard</a>
                <a href="/assessment" className="hover:text-brand-primary transition-colors">Symptom Assessment</a>
                <a href="/image-analysis" className="hover:text-brand-primary transition-colors">Image Scans</a>
                <a href="/reports" className="hover:text-brand-primary transition-colors">Reports History</a>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/50 text-center">
              <p className="text-[10px] leading-relaxed text-slate-400 max-w-4xl mx-auto font-medium">
                Disclaimer: Arogya AI is an experimental AI screening workspace. It runs diagnostic models to detect structural markers and correlate symptoms. This platform is not a replacement for professional clinical care, physician consultations, physical checkups, or official medical diagnostics. Always seek the advice of your doctor for any health questions.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
