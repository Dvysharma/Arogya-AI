"use client";

import React from "react";
import { ArogyaLogo } from "@/components/ui/arogya-logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-[#F8FBFF] dark:bg-[#070C18] flex flex-col items-center justify-center space-y-6 transition-colors duration-300">
      <div className="relative flex flex-col items-center">
        {/* Animated pulsating logo */}
        <ArogyaLogo width={85} height={85} withText={true} columnLayout={true} withTagline={true} animated={true} />
        
        {/* Subtle glow ring behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 bg-brand-primary/5 rounded-full blur-2xl animate-pulse-slow -z-10"></div>
      </div>

      {/* Shimmer loading bar */}
      <div className="w-48 h-1 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden relative">
        <div className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary w-2/3 rounded-full absolute top-0 left-0 animate-shimmer" style={{ backgroundSize: "200% 100%" }}></div>
      </div>
    </div>
  );
}
