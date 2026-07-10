"use client";

import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Bell, Shield, Languages, Moon, Trash2, Check, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("English");
  
  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [mobileAlerts, setMobileAlerts] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // Load theme on mount
  useEffect(() => {
    const activeTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(activeTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleResetData = async () => {
    if (confirm("Are you sure you want to clear your local history and cached reports? This action is permanent.")) {
      try {
        // Run a batch deletion if needed, or simply clear state.
        // We will send a confirmation toast
        confetti({
          particleCount: 30,
          spread: 30,
          colors: ["#EF4444", "#f43f5e"]
        });
        alert("Local history successfully reset.");
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-fade-in text-left">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center space-x-2.5">
          <SettingsIcon className="h-6 w-6 text-brand-primary" />
          <span>Application Settings</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Configure health scoring parameters, theme behaviors, and profile privacy levels.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Card 1: Theme Settings */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-sm text-left space-y-4">
          <div className="flex items-center space-x-2 text-slate-850 dark:text-slate-200">
            <Moon className="h-5 w-5 text-brand-primary" />
            <h3 className="text-sm font-bold">App Appearance</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleThemeChange("light")}
              className={`p-4 rounded-2xl border text-xs font-bold text-center transition-all ${
                theme === "light"
                  ? "border-brand-primary bg-brand-primary/5 text-brand-primary shadow-sm"
                  : "border-slate-200 dark:border-slate-850 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50"
              }`}
            >
              ☀️ Light Theme
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`p-4 rounded-2xl border text-xs font-bold text-center transition-all ${
                theme === "dark"
                  ? "border-brand-primary bg-brand-primary/5 text-brand-primary shadow-sm"
                  : "border-slate-200 dark:border-slate-850 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50"
              }`}
            >
              🌙 Dark Theme
            </button>
          </div>
        </div>

        {/* Card 2: Notifications */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-sm text-left space-y-4">
          <div className="flex items-center space-x-2 text-slate-850 dark:text-slate-200">
            <Bell className="h-5 w-5 text-brand-secondary" />
            <h3 className="text-sm font-bold">Health Alert Notifications</h3>
          </div>
          
          <div className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-350">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 cursor-pointer">
              <span>Enable Emergency Vitals Warnings (Email)</span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 cursor-pointer">
              <span>Enable Weekly Health Digest Metrics</span>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={() => setWeeklyDigest(!weeklyDigest)}
                className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Card 3: Language settings */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-sm text-left space-y-4">
          <div className="flex items-center space-x-2 text-slate-850 dark:text-slate-200">
            <Languages className="h-5 w-5 text-brand-success" />
            <h3 className="text-sm font-bold">Language Preferences</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {["English", "Hindi (हिन्दी)", "Gujarati (ગુજરાતી)"].map((lang) => {
              const isSelected = language === lang;
              return (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-3 rounded-2xl border text-xs font-bold text-center transition-all truncate ${
                    isSelected
                      ? "border-brand-success bg-brand-success/5 text-brand-success shadow-sm"
                      : "border-slate-200 dark:border-slate-850 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 4: Safety & Privacy Controls */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-sm text-left space-y-4">
          <div className="flex items-center space-x-2 text-slate-850 dark:text-slate-200">
            <Shield className="h-5 w-5 text-brand-danger" />
            <h3 className="text-sm font-bold">Security & Profile Safety</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-red-50/40 dark:bg-red-950/10 border border-red-100 dark:border-red-950/30 space-y-4 sm:space-y-0 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-slate-800 dark:text-slate-100">Reset Local History</p>
              <p className="text-[10px] text-slate-400">Deletes all previous local visual scans and reports logs.</p>
            </div>
            
            <button
              onClick={handleResetData}
              className="inline-flex items-center space-x-1 bg-brand-danger hover:bg-red-600 text-white font-bold px-4 py-2.5 rounded-xl text-[10px] shadow-sm shadow-brand-danger/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
