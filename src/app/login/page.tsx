"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArogyaLogo } from "@/components/ui/arogya-logo";
import { Mail, Lock, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 circuit-bg">
      <div className="max-w-md w-full space-y-8 flex flex-col items-center">
        {/* Brand Logo header */}
        <ArogyaLogo width={70} height={70} withText={true} columnLayout={true} withTagline={true} animated={true} />

        {/* Card Form container */}
        <div className="w-full glass-panel rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/40 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-brand-primary/5 rounded-full blur-2xl"></div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-extrabold text-slate-855 dark:text-white">Secure Portal Authentication</h2>
            <p className="text-[11px] text-slate-455">Enter details to access your preventive health dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@healthcare.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-955/40 text-xs font-semibold outline-none focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-955/40 text-xs font-semibold outline-none focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center space-x-2 text-slate-500 font-semibold cursor-pointer">
                <input type="checkbox" className="rounded text-brand-primary focus:ring-brand-primary" />
                <span>Remember me</span>
              </label>
              <a href="#" className="font-bold text-brand-primary hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 mt-4"
            >
              {loading ? (
                <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <>
                  <span>Sign In to Arogya AI</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-850">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>End-to-End Encrypted Health Records</span>
          </div>
        </div>
      </div>
    </div>
  );
}
