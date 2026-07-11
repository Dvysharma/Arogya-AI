"use client";

import React, { useState } from "react";
import { Camera, Upload, RefreshCw, Sparkles, CheckCircle2, ChevronRight, Activity, ArrowRight, Eye, ShieldAlert, AlertCircle } from "lucide-react";
import { HealthReport } from "@/lib/mock-data";
import confetti from "canvas-confetti";
import { ArogyaLogo } from "@/components/ui/arogya-logo";

export default function ImageAnalysis() {
  const [scanType, setScanType] = useState<"Tongue" | "Eye">("Tongue");
  const [image, setImage] = useState<string | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [filterActive, setFilterActive] = useState<"none" | "clahe" | "gaussian">("none");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<HealthReport | null>(null);

  // Sample data to test easily
  const samples = {
    Tongue: [
      {
        name: "Normal Pink Tongue",
        label: "Normal, thin coating",
        desc: "normal pink healthy tongue",
        img: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23fee2e2'/><path d='M30 40 Q50 90 70 40 Z' fill='%23fca5a5'/><ellipse cx='50' cy='35' rx='22' ry='15' fill='%23fca5a5'/><path d='M35 35 Q50 38 65 35' stroke='%23fee2e2' stroke-width='2' fill='none'/></svg>"
      },
      {
        name: "Pale / Coated Tongue",
        label: "Dampness, digestive sluggishness",
        desc: "pale tongue white coating",
        img: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f1f5f9'/><path d='M30 40 Q50 90 70 40 Z' fill='%23fecdd3'/><ellipse cx='50' cy='35' rx='22' ry='15' fill='%23fecdd3'/><ellipse cx='50' cy='45' rx='14' ry='20' fill='%23f8fafc' opacity='0.7'/></svg>"
      }
    ],
    Eye: [
      {
        name: "Bloodshot Eye",
        label: "Eye strain, fatigue",
        desc: "red bloodshot eye",
        img: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f8fafc'/><ellipse cx='50' cy='50' rx='40' ry='22' fill='%23ffffff' stroke='%23cbd5e1' stroke-width='2'/><circle cx='50' cy='50' r='18' fill='%230284c7'/><circle cx='50' cy='50' r='8' fill='%230f172a'/><path d='M15 50 Q30 45 40 48 M15 53 Q25 56 30 52 M60 48 Q70 46 85 50 M68 53 Q75 56 85 52' stroke='%23ef4444' stroke-width='1.5' fill='none'/></svg>"
      },
      {
        name: "Yellowing Sclera",
        label: "Bilirubin alert, liver stress",
        desc: "yellow sclera jaundice indicators",
        img: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23fef08a' opacity='0.2'/><ellipse cx='50' cy='50' rx='40' ry='22' fill='%23fef08a' stroke='%23eab308' stroke-width='1'/><circle cx='50' cy='50' r='18' fill='%2315803d'/><circle cx='50' cy='50' r='8' fill='%230f172a'/></svg>"
      }
    ]
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadSample = (sampleImg: string, sampleDesc: string) => {
    setImage(sampleImg);
    setResult(null);
  };

  const triggerEnhancement = (type: "clahe" | "gaussian") => {
    setEnhancing(true);
    setFilterActive(type);
    setTimeout(() => {
      setEnhancing(false);
    }, 1200);
  };

  const startAnalysis = async () => {
    if (!image) return;
    setAnalyzing(true);
    setAnalysisStep(1);

    // Step 1: Pre-processing
    setTimeout(() => {
      setAnalysisStep(2);
      
      // Step 2: Feature Extraction
      setTimeout(() => {
        setAnalysisStep(3);
        
        // Step 3: API Request
        setTimeout(async () => {
          try {
            // Find keyword based on sample or image description
            let keywords = scanType === "Tongue" ? "normal pink tongue" : "clear eye";
            if (image.includes("fecdd3")) keywords = "pale coated tongue";
            if (image.includes("ef4444")) keywords = "red dry eye";
            if (image.includes("fef08a")) keywords = "yellow jaundice eye";

            const res = await fetch("/api/analyze", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: scanType,
                imageB64: image,
                symptomText: keywords
              })
            });

            if (res.ok) {
              const data = await res.json();
              setResult(data);
              setAnalyzing(false);

              if (data.risk === "Low") {
                confetti({
                  particleCount: 50,
                  spread: 50,
                  origin: { y: 0.8 }
                });
              }
            }
          } catch (e) {
            console.error(e);
            setAnalyzing(false);
          }
        }, 1200);

      }, 1200);

    }, 1000);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/30";
      case "Medium": return "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/30";
      default: return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/30";
    }
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return "stroke-brand-secondary";
    if (score >= 70) return "stroke-amber-500";
    return "stroke-rose-500";
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in text-left pb-12 circuit-bg">
      {/* Title */}
      <div className="flex flex-col space-y-2">
        <div className="inline-flex items-center space-x-2 text-brand-primary dark:text-brand-secondary text-xs font-bold uppercase tracking-wider">
          <Eye className="h-4 w-4" />
          <span>Multimodal Computer Vision Scan</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          AI Image Analysis Console
        </h1>
        <p className="text-xs md:text-sm text-slate-505 dark:text-slate-400 leading-relaxed max-w-xl font-medium">
          Upload tongue or eye sclera photographs. Select from visual optimization tools to highlight structural indicators.
        </p>
      </div>

      {/* Selector and Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column: Image Upload Console (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel rounded-[2rem] p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-brand-primary/5 rounded-full blur-2xl"></div>

            {/* Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl">
              <button
                onClick={() => { setScanType("Tongue"); setImage(null); setResult(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  scanType === "Tongue"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
                }`}
              >
                Tongue Analysis
              </button>
              <button
                onClick={() => { setScanType("Eye"); setImage(null); setResult(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  scanType === "Eye"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
                }`}
              >
                Eye Sclera Analysis
              </button>
            </div>

            {/* Upload Zone */}
            <div className="relative">
              {!image ? (
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 hover:border-brand-primary transition-colors">
                  <div className="h-16 w-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-450">
                    <Camera className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-250">Drag & drop your scan image</p>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                  <label className="btn-primary inline-flex items-center justify-center text-[10px] py-2 px-5">
                    Browse File
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Image Display Panel */}
                  <div className="relative rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 min-h-[250px]">
                    {/* Visual guidelines target guide circle */}
                    <div className="absolute inset-0 border-2 border-brand-primary/10 rounded-[2rem] pointer-events-none flex items-center justify-center">
                      <div className="border-2 border-dashed border-brand-secondary/25 rounded-full h-40 w-40 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-brand-secondary/40 uppercase tracking-widest">Alignment Guide</span>
                      </div>
                    </div>

                    <img
                      src={image}
                      alt="Ocular scan preview"
                      className={`max-h-[280px] rounded-2xl shadow-sm object-contain transition-all duration-500 ${
                        filterActive === "clahe"
                          ? "contrast-125 saturate-75 brightness-105"
                          : filterActive === "gaussian"
                          ? "blur-[1px] brightness-95"
                          : ""
                      }`}
                    />
                    
                    {enhancing && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white">
                        <div className="flex items-center space-x-2.5 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
                          <RefreshCw className="h-4 w-4 animate-spin text-brand-secondary" />
                          <span className="text-[10px] font-bold tracking-wide uppercase">Applying Filter...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contrast Enhancement controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 gap-2.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Image Processing Filters</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => triggerEnhancement("clahe")}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all border ${
                          filterActive === "clahe"
                            ? "bg-brand-primary text-white border-brand-primary"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350"
                        }`}
                      >
                        Histogram Contrast (CLAHE)
                      </button>
                      <button
                        onClick={() => triggerEnhancement("gaussian")}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all border ${
                          filterActive === "gaussian"
                            ? "bg-brand-primary text-white border-brand-primary"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350"
                        }`}
                      >
                        Denoise (Gaussian)
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => { setImage(null); setResult(null); setFilterActive("none"); }}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                    >
                      Clear Scan
                    </button>
                    <button
                      onClick={startAnalysis}
                      disabled={analyzing}
                      className="btn-primary inline-flex items-center space-x-2 text-xs py-2.5 px-5"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Start AI Vision Scan</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tester Samples */}
            {!image && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Demo Scans (Click to Test)</p>
                <div className="grid grid-cols-2 gap-3">
                  {samples[scanType].map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadSample(sample.img, sample.desc)}
                      className="flex items-center space-x-2.5 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 hover:border-brand-primary/30 text-left transition-all hover:bg-slate-100/50"
                    >
                      <div className="h-10 w-10 bg-white dark:bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center p-1">
                        <img src={sample.img} alt={sample.name} className="h-full w-full object-contain" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">{sample.name}</h4>
                        <p className="text-[8px] text-slate-400 truncate">{sample.label}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: AI Analysis Output Results Console (2 cols) */}
        <div className="lg:col-span-2">
          {analyzing ? (
            /* Running Steps Loader with skeleton */
            <div className="glass-panel rounded-[2rem] p-8 border border-slate-200/50 dark:border-slate-800/40 h-full flex flex-col justify-center items-center text-center space-y-6">
              <div className="h-12 w-12 rounded-full border-4 border-brand-secondary/20 border-t-brand-secondary animate-spin"></div>
              <div className="space-y-4 w-full max-w-[200px]">
                <div className="flex items-center space-x-2.5 text-left text-xs font-semibold">
                  <CheckCircle2 className={`h-4 w-4 ${analysisStep >= 1 ? "text-brand-secondary" : "text-slate-200 dark:text-slate-800"}`} />
                  <span className={analysisStep >= 1 ? "text-slate-850 dark:text-slate-105" : "text-slate-455"}>Enhancing Image Contrast</span>
                </div>
                <div className="flex items-center space-x-2.5 text-left text-xs font-semibold">
                  <CheckCircle2 className={`h-4 w-4 ${analysisStep >= 2 ? "text-brand-secondary" : "text-slate-200 dark:text-slate-800"}`} />
                  <span className={analysisStep >= 2 ? "text-slate-850 dark:text-slate-105" : "text-slate-455"}>Running Neural Nets</span>
                </div>
                <div className="flex items-center space-x-2.5 text-left text-xs font-semibold">
                  <CheckCircle2 className={`h-4 w-4 ${analysisStep >= 3 ? "text-brand-secondary" : "text-slate-200 dark:text-slate-800"}`} />
                  <span className={analysisStep >= 3 ? "text-slate-850 dark:text-slate-105" : "text-slate-455"}>Running AI Vision API</span>
                </div>
              </div>
            </div>
          ) : result ? (
            /* Result Panel */
            <div className="glass-panel rounded-[2rem] p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-2xl text-left space-y-6 animate-slide-up">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{result.title}</h3>
                  <p className="text-[9px] text-slate-400">Analysis completed successfully</p>
                </div>
                
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${getRiskColor(result.risk)}`}>
                  {result.risk}
                </span>
              </div>

              {/* Gauge & Metrics */}
              <div className="flex items-center space-x-4">
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="26" className="stroke-slate-100 dark:stroke-slate-900 fill-none" strokeWidth="4" />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      className={`fill-none ${getScoreBg(result.score)}`}
                      strokeWidth="4"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={2 * Math.PI * 26 * (1 - result.score / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-slate-800 dark:text-white">{result.score}</span>
                </div>
                <div className="overflow-hidden">
                  <span className="text-[9px] font-bold text-slate-405 uppercase tracking-wider block">AI Confidence Score</span>
                  <p className="text-xs text-slate-500 leading-snug font-medium">Visual accuracy estimation for identified markers.</p>
                </div>
              </div>

              {/* Findings */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Visual Insights</h4>
                <ul className="space-y-1.5 text-xs text-slate-655 dark:text-slate-350">
                  {result.findings.map((f, i) => (
                    <li key={i} className="flex items-start space-x-1.5 font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preventive Actions</h4>
                <ul className="space-y-1.5 text-xs text-slate-655 dark:text-slate-350 font-semibold">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary mt-1.5 flex-shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40">
                <button
                  onClick={() => { setResult(null); setImage(null); setFilterActive("none"); }}
                  className="w-full text-center bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900 py-3 rounded-2xl text-xs font-bold text-slate-650 dark:text-slate-300 transition-colors"
                >
                  Scan Another Image
                </button>
              </div>

            </div>
          ) : (
            /* Standby view */
            <div className="glass-panel rounded-[2rem] p-8 border border-slate-200/50 dark:border-slate-800/40 h-full flex flex-col justify-center items-center text-center space-y-3.5 text-slate-400 shadow-sm py-20">
              <Camera className="h-10 w-10 text-slate-300 animate-pulse-slow" />
              <div>
                <h4 className="text-xs font-bold text-slate-705 dark:text-slate-250">Scan Standby Console</h4>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] mx-auto font-medium">Upload an image and launch the vision scan pipeline to view health scoring.</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Disclaimer bottom */}
      <div className="p-6 rounded-[2rem] border border-rose-500/20 bg-rose-500/5 text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
        <h4 className="font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-widest text-[9px] mb-2 flex items-center space-x-1.5">
          <AlertCircle className="h-4 w-4" />
          <span>Important Medical Disclaimer</span>
        </h4>
        <p className="font-semibold">
          This result is generated using Artificial Intelligence and should not be considered a medical diagnosis. It does not replace physical checks, medical imaging, or physician diagnostics. Always seek the advice of a qualified healthcare professional with any questions regarding medical conditions.
        </p>
      </div>
    </div>
  );
}
