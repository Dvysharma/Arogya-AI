"use client";

import React from "react";

interface ArogyaLogoProps {
  className?: string;
  width?: number;
  height?: number;
  iconOnly?: boolean;
  animated?: boolean;
}

export const ArogyaLogo: React.FC<ArogyaLogoProps> = ({
  className = "",
  width,
  height,
  iconOnly = false,
  animated = false,
}) => {
  // Default sizes
  const defaultHeight = iconOnly ? 40 : 50;
  const displayHeight = height || defaultHeight;
  const displayWidth = width || (iconOnly ? displayHeight : displayHeight * 2.2);

  if (iconOnly) {
    return (
      <div 
        className={`relative overflow-hidden rounded-xl flex items-center justify-center bg-white p-1 border border-slate-100 shadow-sm ${
          animated ? "animate-float" : ""
        } ${className}`}
        style={{ width: displayHeight, height: displayHeight }}
      >
        {/* Render only the top heart icon part of the logo image */}
        <img
          src="/logo.png"
          alt="Arogya AI Logo Icon"
          className="w-full h-full object-cover object-top scale-[1.3] translate-y-[10%]"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center bg-white/90 dark:bg-white px-3 py-1.5 rounded-2xl shadow-sm border border-slate-100 ${
      animated ? "animate-float" : ""
    } ${className}`}>
      {/* Render the full logo image containing both the heart icon and AROGYA AI text */}
      <img
        src="/logo.png"
        alt="Arogya AI Logo"
        className="object-contain"
        style={{ height: displayHeight - 12, width: displayWidth }}
      />
    </div>
  );
};
