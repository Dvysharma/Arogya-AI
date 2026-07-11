"use client";

import React from "react";

interface ArogyaLogoProps {
  className?: string;
  width?: number;
  height?: number;
  withText?: boolean;
  columnLayout?: boolean;
  withTagline?: boolean;
  animated?: boolean;
}

export const ArogyaLogo: React.FC<ArogyaLogoProps> = ({
  className = "",
  width = 44,
  height = 44,
  withText = false,
  columnLayout = false,
  withTagline = false,
  animated = false,
}) => {
  return (
    <div className={`flex ${columnLayout ? "flex-col items-center text-center" : "items-center space-x-3"} ${className}`}>
      {/* Brand Icon SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${animated ? "animate-float" : ""}`}
      >
        {/* Left half: Dark Navy Heart with Stethoscope tubing */}
        <path
          d="M50 82C40 74 15 54 15 36C15 24 23 16 33 16C40 16 46.5 21.5 50 27"
          stroke="#1F3F94"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Right half: Teal Heart with white cross inside */}
        <path
          d="M50 82C60 74 85 54 85 36C85 24 77 16 67 16C60 16 53.5 21.5 50 27"
          fill="#16C3C7"
        />
        
        {/* White Cross on the Right Side */}
        <path
          d="M62 36H72M67 31V41"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Stethoscope Earbuds & Headpiece (bottom left wrap) */}
        <path
          d="M15 36C15 48 23 58 31 63"
          stroke="#1F3F94"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />

        {/* Stethoscope Chestpiece (circle) */}
        <circle cx="31" cy="63" r="7.5" fill="#1F3F94" />
        <circle cx="31" cy="63" r="4.5" fill="#E8FBFD" />
        <path d="M26 63H36" stroke="#1F3F94" strokeWidth="1.5" />

        {/* Circuit traces down the middle divider */}
        <path
          d="M50 27V75"
          stroke="#1F3F94"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Node branches */}
        <path
          d="M50 38L42 42M50 50L58 54M50 62L42 66"
          stroke="#1F3F94"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Node circles */}
        <circle cx="42" cy="42" r="3.5" fill="#16C3C7" />
        <circle cx="58" cy="54" r="3.5" fill="#FFFFFF" stroke="#1F3F94" strokeWidth="1.5" />
        <circle cx="42" cy="66" r="3.5" fill="#1F3F94" />
      </svg>

      {/* Brand Text labels */}
      {withText && (
        <div className={`flex flex-col ${columnLayout ? "mt-4" : ""}`}>
          <div className="flex items-center space-x-1">
            <span className="font-extrabold text-slate-900 dark:text-white tracking-tight" style={{ fontSize: width * 0.45 }}>
              AROGYA
            </span>
            <span className="font-extrabold text-brand-secondary tracking-tight" style={{ fontSize: width * 0.45 }}>
              AI
            </span>
          </div>
          {withTagline && (
            <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mt-0.5">
              Early Detection. Better Protection.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
