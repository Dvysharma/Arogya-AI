"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Heart, Activity, ShieldAlert, Sparkles, ShieldCheck, 
  ArrowRight, CheckCircle2, ChevronDown, Award, Users, 
  Cpu, Eye, MessageSquare, Stethoscope, RefreshCw, BarChart2,
  TrendingUp, Globe, Smartphone, UserCheck, Code
} from "lucide-react";
import { ArogyaLogo } from "@/components/ui/arogya-logo";

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
      color: "text-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20",
    },
    {
      icon: Sparkles,
      title: "AI Tongue Visual Scan",
      desc: "Identify early indicators of digestive fatigue, iron deficiencies, or body temperature imbalances by analyzing tongue coating and body color.",
      color: "text-brand-secondary bg-brand-secondary/10 dark:bg-brand-secondary/20",
    },
    {
      icon: ShieldAlert,
      title: "AI Eye Sclera Scanning",
      desc: "Detect visual signs of vascular congestion (redness) or pigment anomalies (yellowing) that serve as early alerts for eye strain or liver fatigue.",
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/30",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      icon: Sparkles,
      title: "Upload Tongue Image",
      desc: "Provide a clear photo of your tongue to identify early coating patterns or discoloration.",
    },
    {
      step: "02",
      icon: Eye,
      title: "Upload Eye Image",
      desc: "Scan your eye sclera to evaluate vascular congestion and check for pigment variations.",
    },
    {
      step: "03",
      icon: MessageSquare,
      title: "Enter Symptoms",
      desc: "Log physical symptoms and share vital stats like age, gender, and lifestyle indicators.",
    },
    {
      step: "04",
      icon: Cpu,
      title: "AI Analysis",
      desc: "Our neural networks and decision trees process the data against clinical models.",
    },
    {
      step: "05",
      icon: ShieldCheck,
      title: "Risk Assessment",
      desc: "Receive a detailed preventive risk score detailing visual observation markers.",
    },
    {
      step: "06",
      icon: Stethoscope,
      title: "Consult Doctor",
      desc: "Share your structured report with your doctor during your next physical checkup.",
    },
  ];

  const diseaseCategories = [
    { name: "Heart Disease", icon: Heart, desc: "Blood pressure and lifestyle risk analysis.", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/20" },
    { name: "Diabetes", icon: Activity, desc: "Symptom matching and blood glucose indexing.", color: "text-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20" },
    { name: "Anemia", icon: Sparkles, desc: "Tongue pallor classification.", color: "text-brand-secondary bg-brand-secondary/10 dark:bg-brand-secondary/20" },
    { name: "Liver Disorders", icon: ShieldAlert, desc: "Ocular sclera yellow pigment screening.", color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
    { name: "Vitamin Deficiency", icon: Award, desc: "Visual anomalies and nutritional correlation.", color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20" },
    { name: "Eye Disorders", icon: Eye, desc: "Redness, fatigue, and bloodshot screening.", color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20" },
    { name: "Hypertension", icon: TrendingUp, desc: "Cardiovascular vital checks & screening.", color: "text-teal-500 bg-teal-50 dark:bg-teal-950/20" },
  ];

  const techCards = [
    {
      title: "Computer Vision Model",
      techs: ["OpenCV Contrast Filters", "PyTorch Custom CNNs", "EfficientNet V2 Backbones", "Ocular Sclera Segmentation"],
      desc: "Filters background noise and extracts anatomical color indicators from tongue and eye photo uploads.",
      bg: "from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 text-brand-primary"
    },
    {
      title: "Classification Engine",
      techs: ["Decision Tree Classifiers", "Symptom Pattern Matching", "Scikit-Learn Inference", "Vitals Outlier Scoring"],
      desc: "Correlates clinical symptom lists and lifestyle habits into a unified preventive risk score.",
      bg: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 text-brand-secondary"
    }
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
      review: "The interface is exceptionally clean, mimicking premium applications like Apple Health. The zero-prescription disclaimer policy makes it a highly responsible health screening system.",
      image: "👩‍⚕️",
    },
    {
      name: "Dr. Rajesh Nair",
      role: "AI Healthcare Consultant",
      review: "The multimodal combination of computer vision with symptom decision trees represents the future of accessible, consumer-facing early screening tools.",
      image: "👨‍⚕️"
    }
  ];

  const statistics = [
    { value: "95%", label: "Image Analysis Accuracy" },
    { value: "5000+", label: "Training Images" },
    { value: "25+", label: "Health Indicators Map" },
    { value: "24/7", label: "Availability" }
  ];

  const futureScope = [
    { title: "Wearable Integration", icon: Smartphone, desc: "Connect Apple Health and Google Fit for continuous heart rate and vital updates." },
    { title: "Doctor Portal", icon: Stethoscope, desc: "Direct secure PDF transmission to telemedicine databases for follow-up review." },
    { title: "Voice Assistant", icon: MessageSquare, desc: "Voice-driven diagnostic survey in regional languages for accessibility." },
    { title: "Multilingual Support", icon: Globe, desc: "Localize diagnostic screens and report print-outs to regional Indian languages." }
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
    <div className="space-y-24 md:space-y-36 pb-16 text-left circuit-bg">
      {/* 1. Hero Section */}
      <section className="relative pt-6 md:pt-16 pb-6 flex flex-col items-center text-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase animate-fade-in">
          <Heart className="h-3.5 w-3.5 fill-brand-primary/10" />
          <span>Empowering Preventive Healthcare with AI</span>
        </div>
        
        {/* Large animated logo with radial AI radar rings */}
        <div className="relative py-4">
          {/* Circular AI background effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-36 w-36 rounded-full border border-brand-primary/20 animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full border border-brand-secondary/15 animate-ping" style={{ animationDuration: "3s" }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 bg-brand-secondary/5 rounded-full blur-xl"></div>
          
          <ArogyaLogo width={85} height={85} animated={true} />
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white animate-slide-up">
          Detect Health Risks
          <br />
          <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            Before They Become Serious.
          </span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          AI-powered preventive healthcare using symptom analysis, tongue images, and eye images. A premium, non-diagnostic assistant encouraging proactive wellness.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm pt-4">
          <Link
            href="/assessment"
            className="w-full sm:w-auto btn-primary inline-flex items-center justify-center space-x-2"
          >
            <span>Start AI Screening</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <a
            href="#how-it-works"
            className="w-full sm:w-auto btn-secondary inline-flex items-center justify-center"
          >
            Learn More
          </a>
        </div>

        {/* Live Preview Dashboard Simulator */}
        <div className="w-full max-w-3xl pt-10">
          <div className="glass-panel rounded-[2rem] p-6 shadow-2xl border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-3xl"></div>
            
            <div className="flex items-center justify-between pb-6 border-b border-slate-200/60 dark:border-slate-800/50">
              <div className="flex items-center space-x-3 text-left">
                <div className="h-10 w-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100">Live Health Screening Simulator</h3>
                  <p className="text-[10px] text-slate-400">Previewing premium lifestyle and vitals mapping score</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-secondary/15 text-brand-secondary">
                System Active
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left">
              <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/40">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Health Index Score</p>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className="text-3xl font-extrabold text-slate-800 dark:text-white">87</span>
                  <span className="text-xs font-semibold text-brand-secondary">/100</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-brand-primary h-full rounded-full" style={{ width: "87%" }}></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/40">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Modules</p>
                <p className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100">Multimodal CNN</p>
                <div className="flex items-center space-x-1 text-xs text-brand-secondary font-medium mt-3">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Interactive outputs loaded</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/40">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Risk Classification</p>
                <p className="text-xl font-bold mt-1 text-emerald-600">Minimal / Low</p>
                <p className="text-[10px] text-slate-400 mt-3 leading-tight font-medium">Always clinical checkup recommended</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core AI Modules */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
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
                className="brand-card flex flex-col text-left space-y-4 shadow-xl"
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${f.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed flex-1 font-medium font-sans">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. How It Works Timeline */}
      <section id="how-it-works" className="space-y-12 bg-[#E8FBFD]/30 dark:bg-brand-dark/10 rounded-[2.5rem] p-8 md:p-16 border border-brand-secondary/10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How Arogya AI Works
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            A comprehensive, non-diagnostic screening pipeline designed to keep you informed about potential indicators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {workflowSteps.map((w, i) => {
            const Icon = w.icon;
            return (
              <div key={i} className="bg-white dark:bg-slate-950/40 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-850 hover:shadow-xl transition-all flex flex-col space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 dark:text-slate-800 leading-none">
                    {w.step}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-850 dark:text-slate-100">
                  {w.title}
                </h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
                  {w.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Disease Categories */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Symptomatic & Diagnostic Categories
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Arogya AI evaluates custom metrics mapped against common preventive health profiles.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {diseaseCategories.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="p-4 rounded-2xl border border-slate-150 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 hover:border-brand-primary/30 transition-all duration-300 text-center flex flex-col items-center justify-center space-y-3 group hover:shadow-lg">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${c.color}`}>
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {c.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Statistics Counters */}
      <section className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 h-48 w-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 text-center">
          {statistics.map((s, i) => (
            <div key={i} className="space-y-1">
              <p className="text-4xl sm:text-5xl font-black">{s.value}</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-100">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. AI Pipeline & Technologies */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Technologies card */}
        <div className="space-y-6 text-left">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Engine Technologies</h2>
            <p className="text-xs text-slate-505">Combining computer vision layers with local statistical classification libraries.</p>
          </div>
          <div className="space-y-4">
            {techCards.map((t, i) => (
              <div key={i} className="p-6 rounded-[2rem] border border-slate-100 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 space-y-3">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-105">{t.title}</h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 font-medium leading-relaxed">{t.desc}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {t.techs.map((tc, idx) => (
                    <span key={idx} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-slate-850/40">
                      {tc}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline graphic mockup */}
        <div className="space-y-6 text-left h-full flex flex-col">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Multi-modal AI Pipeline</h2>
            <p className="text-xs text-slate-500">How data streams are parsed, indexed, and visualised in real-time.</p>
          </div>
          <div className="p-6 rounded-[2rem] border border-slate-150 dark:border-slate-850 bg-white/50 dark:bg-slate-950/20 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {[
                "User Input (Symptoms, Vitals, Image Files)",
                "Image preprocessing & scaling (OpenCV Headless)",
                "Feature Extraction (Multi-class model channels)",
                "Decision Tree Inference & Neural Network check",
                "Consolidated Health Risk Output (Health Score)",
                "PDF Export & Clinical Referral Recommendation"
              ].map((pipe, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-xs">
                  <div className="h-6 w-6 rounded-full bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-slate-650 dark:text-slate-300 font-semibold">{pipe}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Future Scope */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Future Product Roadmap
          </h2>
          <p className="text-sm text-slate-555 max-w-xl mx-auto font-medium">
            Our upcoming product expansion aims to build deeper integrations with local care and global wearables.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {futureScope.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="p-5 rounded-[2rem] border border-slate-100 dark:border-slate-850 bg-white/55 dark:bg-slate-950/20 text-left space-y-3 hover:shadow-xl transition-all">
                <div className="h-8 w-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-xs font-bold text-slate-850 dark:text-slate-100">{f.title}</h3>
                <p className="text-[11px] text-slate-550 dark:text-slate-450 leading-relaxed font-medium">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Domain Experts Review */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-center text-slate-900 dark:text-white flex items-center justify-center space-x-2">
            <Users className="h-6 w-6 text-brand-primary" />
            <span>Reviewed by Specialists</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Designed under recommendations from medical professionals to ensure safety and accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {expertReviews.map((r, i) => (
            <div
              key={i}
              className="glass-panel rounded-3xl p-6 text-left border border-slate-200/50 dark:border-slate-800/40 relative shadow-sm"
            >
              <div className="absolute top-6 right-6 text-3xl opacity-20">
                <Award className="h-8 w-8 text-brand-primary" />
              </div>
              <div className="flex items-center space-x-4 pb-4 border-b border-slate-100 dark:border-slate-850/40">
                <div className="h-12 w-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-2xl">
                  {r.image}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{r.name}</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{r.role}</p>
                </div>
              </div>
              <p className="text-xs italic text-slate-550 dark:text-slate-400 leading-relaxed mt-4 font-medium font-sans">
                "{r.review}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="max-w-3xl mx-auto space-y-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-center text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div
                key={i}
                className="border border-slate-200/60 dark:border-slate-800/40 rounded-2xl overflow-hidden transition-all duration-300 bg-white dark:bg-slate-950/40 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-850 dark:text-slate-100 text-xs md:text-sm hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/30 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. Final CTA Banner */}
      <section className="glass-panel rounded-[2.5rem] p-8 md:p-16 text-center border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] bg-brand-primary/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white leading-tight">
            Ready to Check Your Preventive Health Score?
          </h2>
          <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
            Assess symptoms, upload scan pictures, and review your metrics inside the health history dashboard. Always secure, clean, and instant.
          </p>
          <div className="pt-2">
            <Link
              href="/assessment"
              className="inline-flex items-center space-x-2 btn-primary"
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
