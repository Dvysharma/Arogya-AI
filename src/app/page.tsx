"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Activity, ShieldAlert, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, ChevronDown, Award, Users } from "lucide-react";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: Activity,
      title: "AI Symptom & Lifestyle Screener",
      desc: "Analyze clinical symptoms combined with daily lifestyle patterns (exercise, sleep, smoking, alcohol) for multi-dimensional health scoring.",
      color: "text-brand-primary bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: Sparkles,
      title: "AI Tongue Visual Scan",
      desc: "Identify early indicators of digestive fatigue, iron deficiencies, or body temperature imbalances by analyzing tongue coating and body color.",
      color: "text-brand-success bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      icon: ShieldAlert,
      title: "AI Eye Sclera Scanning",
      desc: "Detect visual signs of vascular congestion (redness) or pigment anomalies (yellowing) that serve as early alerts for eye strain or liver fatigue.",
      color: "text-brand-danger bg-red-50 dark:bg-red-950/20",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Enter Symptoms & Details",
      desc: "Provide age, gender, lifestyle habits, and log any current symptoms you're experiencing.",
    },
    {
      step: "02",
      title: "Upload Scans",
      desc: "Take or upload clear photos of your tongue or eye using our guided visual capture workspace.",
    },
    {
      step: "03",
      title: "Get Preventive Insights",
      desc: "Receive an instant report with estimated risk levels, confidence scores, visual observations, and guidance.",
    },
  ];

  const expertReviews = [
    {
      name: "Dr. Alok Varma",
      role: "MBBS, MD (Internal Medicine)",
      review: "Arogya AI is an exceptional tool for preventive health awareness. By prompting users to monitor visual markers like tongue coating and eye color, it encourages early clinical consults.",
      image: "👨‍⚕️",
    },
    {
      name: "Meera Sen",
      role: "Digital Health Product Lead",
      review: "The interface is exceptionally clean, mimicking premium applications like Apple Health. The zero-diagnosis disclaimer policy makes it a highly responsible health screening system.",
      image: "👩‍⚕️",
    },
  ];

  const faqs = [
    {
      q: "Is Arogya AI a replacement for a real doctor?",
      a: "No, absolutely not. Arogya AI is a preventive health screening tool. It does not prescribe medications, diagnose specific illnesses, or replace clinical consultations. It advises you when you should consider scheduling a checkup with a licensed medical practitioner.",
    },
    {
      q: "How does the Tongue and Eye visual analysis work?",
      a: "Our AI scans the colors, textures, and patterns in your uploaded images. In tongues, it checks for coatings and discoloration. In eyes, it screens the sclera for redness or yellow pigmentation. It uses either local rule-based models or advanced vision-language APIs.",
    },
    {
      q: "Are my health details and photos secure?",
      a: "Yes. All data parsed during your session is processed securely. Images are analyzed in real-time. If database logging is configured, reports are stored on encrypted endpoints. We prioritize user privacy.",
    },
  ];

  return (
    <div className="space-y-20 md:space-y-32">
      {/* 1. Hero Section */}
      <section className="relative pt-6 md:pt-16 pb-10 flex flex-col items-center text-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase animate-fade-in">
          <Heart className="h-3.5 w-3.5 fill-brand-primary/10" />
          <span>Empowering Preventive Healthcare with AI</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white animate-slide-up">
          Screen Health Risks Early.
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-primary via-blue-500 to-brand-secondary bg-clip-text text-transparent">
            Take Control of Wellness.
          </span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Arogya AI is a premium health assistant that screens symptoms, tongue scans, and eye patterns to highlight potential body imbalances before they become problems.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm pt-4">
          <Link
            href="/assessment"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-primary hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 active:scale-95 transition-all duration-300"
          >
            <span>Start Free Assessment</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-semibold px-8 py-4 rounded-2xl transition-all duration-300"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Apple Health style mock card display */}
        <div className="w-full max-w-3xl pt-10 animate-float">
          <div className="glass-panel rounded-3xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-3xl"></div>
            <div className="flex items-center justify-between pb-6 border-b border-slate-200/60 dark:border-slate-800/50">
              <div className="flex items-center space-x-3 text-left">
                <div className="h-10 w-10 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-xl flex items-center justify-center text-brand-primary">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Live Health Screening Simulation</h3>
                  <p className="text-[10px] text-slate-400">Sample patient tracking visual indicators</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-success/10 text-brand-success">
                System Active
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/40">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Health Score</p>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className="text-3xl font-extrabold text-slate-800 dark:text-white">78</span>
                  <span className="text-xs font-semibold text-brand-success">/100</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-brand-primary h-full rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/40">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Visual Scans</p>
                <p className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100">Tongue & Eye</p>
                <div className="flex items-center space-x-1 text-xs text-brand-success font-medium mt-3">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>2 reports updated</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/40">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Risk Level</p>
                <p className="text-xl font-bold mt-1 text-brand-success">Optimal-Low</p>
                <p className="text-[10px] text-slate-400 mt-3 leading-tight">Last assessed: 2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Core AI Modules
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Our application targets three main pillars of preventive screening to highlight physiological flags.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/40 hover:-translate-y-1 transition-transform duration-300 flex flex-col text-left space-y-4"
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${f.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="space-y-12 bg-slate-50 dark:bg-slate-900/35 rounded-[2.5rem] p-8 md:p-16 border border-slate-100 dark:border-slate-800/20">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            How Arogya AI Works
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Complete a screening in less than 5 minutes with our simplified diagnostic workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {workflowSteps.map((w, i) => (
            <div key={i} className="flex flex-col space-y-3 text-left relative z-10">
              <span className="text-5xl font-black text-brand-primary/10 dark:text-brand-primary/20 leading-none">
                {w.step}
              </span>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {w.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {w.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Domain Experts Review */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center space-x-2">
            <Users className="h-6 w-6 text-brand-primary" />
            <span>Reviewed by Specialists</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Designed under recommendations from medical professionals to ensure safety and accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {expertReviews.map((r, i) => (
            <div
              key={i}
              className="glass-panel rounded-2xl p-6 text-left border border-slate-200/50 dark:border-slate-800/40 relative"
            >
              <div className="absolute top-6 right-6 text-3xl opacity-20">
                <Award className="h-8 w-8 text-brand-primary" />
              </div>
              <div className="flex items-center space-x-4 pb-4 border-b border-slate-100 dark:border-slate-800/40">
                <div className="h-12 w-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-2xl">
                  {r.image}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{r.name}</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{r.role}</p>
                </div>
              </div>
              <p className="text-xs italic text-slate-500 dark:text-slate-400 leading-relaxed mt-4">
                "{r.review}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="max-w-3xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold tracking-tight text-center text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div
                key={i}
                className="border border-slate-200/60 dark:border-slate-800/40 rounded-2xl overflow-hidden transition-all duration-300 bg-white dark:bg-slate-950/40"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-800 dark:text-slate-100 text-xs md:text-sm hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. final CTA Banner */}
      <section className="glass-panel rounded-3xl p-8 md:p-12 text-center border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden shadow-lg">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] bg-brand-primary/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white leading-tight">
            Ready to Check Your Preventive Health Score?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Assess symptoms, upload scan pictures, and review your metrics inside the health history dashboard. Always secure, clean, and instant.
          </p>
          <div className="pt-2">
            <Link
              href="/assessment"
              className="inline-flex items-center space-x-2 bg-brand-primary hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all duration-300"
            >
              <span>Get Screened Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
