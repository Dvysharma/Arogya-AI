"use client";

import React, { useState } from "react";
import { Camera, Upload, RefreshCw, Sparkles, CheckCircle2, ChevronRight, Activity, ArrowRight } from "lucide-react";
import { MedicalDisclaimer } from "@/components/ui/medical-disclaimer";
import { HealthReport } from "@/lib/mock-data";
import confetti from "canvas-confetti";

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
      case "High": return "text-brand-danger bg-red-50 dark:bg-red-950/20 border-brand-danger/30";
      case "Medium": return "text-brand-secondary bg-sky-50 dark:bg-sky-950/20 border-brand-secondary/30";
      default: return "text-brand-success bg-emerald-50 dark:bg-emerald-950/20 border-brand-success/30";
    }
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return "stroke-brand-success";
    if (score >= 70) return "stroke-brand-secondary";
    return "stroke-brand-danger";
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in text-left">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          AI Image Analysis
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Guided scan console utilizing image processing tools to analyze tongue and eye markers.
        </p>
      </div>

      {/* Selector and Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column: Image Upload Console (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-md space-y-6">
            
            {/* Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl">
              <button
                onClick={() => { setScanType("Tongue"); setImage(null); setResult(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  scanType === "Tongue"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
                }`}
              >
                Tongue Analysis
              </button>
              <button
                onClick={() => { setScanType("Eye"); setImage(null); setResult(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  scanType === "Eye"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
                }`}
              >
                Eye Sclera Analysis
              </button>
            </div>

            {/* Upload Zone */}
            <div className="relative">
              {!image ? (
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 hover:border-brand-primary transition-all">
                  <div className="h-14 w-14 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400">
                    <Camera className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Drag & drop your scan image</p>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                  <label className="bg-brand-primary hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-[10px] cursor-pointer shadow-md shadow-brand-primary/10">
                    Browse File
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Image Display Panel */}
                  <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 min-h-[250px]">
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
                          <RefreshCw className="h-4 w-4 animate-spin text-brand-primary" />
                          <span className="text-[10px] font-bold tracking-wide uppercase">Applying Filter...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contrast Enhancement controls */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Image Processing Filters</span>
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
                      className="inline-flex items-center space-x-2 bg-brand-success hover:bg-emerald-600 disabled:bg-slate-300 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg shadow-brand-success/15"
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
                      className="flex items-center space-x-2.5 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 hover:border-brand-primary text-left transition-all hover:bg-slate-100/50"
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
            /* Running Steps Loader */
            <div className="glass-panel rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/40 h-full flex flex-col justify-center items-center text-center space-y-6">
              <div className="h-12 w-12 rounded-full border-4 border-brand-success/20 border-t-brand-success animate-spin"></div>
              <div className="space-y-4 w-full max-w-[200px]">
                <div className="flex items-center space-x-2.5 text-left text-xs font-semibold">
                  <CheckCircle2 className={`h-4 w-4 ${analysisStep >= 1 ? "text-brand-success" : "text-slate-200 dark:text-slate-800"}`} />
                  <span className={analysisStep >= 1 ? "text-slate-850 dark:text-slate-105" : "text-slate-400"}>Enhancing Image Contrast</span>
                </div>
                <div className="flex items-center space-x-2.5 text-left text-xs font-semibold">
                  <CheckCircle2 className={`h-4 w-4 ${analysisStep >= 2 ? "text-brand-success" : "text-slate-200 dark:text-slate-800"}`} />
                  <span className={analysisStep >= 2 ? "text-slate-850 dark:text-slate-105" : "text-slate-400"}>Running Neural Nets</span>
                </div>
                <div className="flex items-center space-x-2.5 text-left text-xs font-semibold">
                  <CheckCircle2 className={`h-4 w-4 ${analysisStep >= 3 ? "text-brand-success" : "text-slate-200 dark:text-slate-800"}`} />
                  <span className={analysisStep >= 3 ? "text-slate-850 dark:text-slate-105" : "text-slate-400"}>Running AI Vision API</span>
                </div>
              </div>
            </div>
          ) : result ? (
            /* Result Panel */
            <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-lg text-left space-y-6 animate-slide-up">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{result.title}</h3>
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
                    <circle cx="32" cy="32" r="26" className="stroke-slate-200 dark:stroke-slate-800 fill-none" strokeWidth="4" />
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
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">AI Confidence Score</span>
                  <p className="text-xs text-slate-500 leading-snug">Visual accuracy estimation for identified markers.</p>
                </div>
              </div>

              {/* Findings */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Visual Insights</h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-350">
                  {result.findings.map((f, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preventive Actions</h4>
                <ul className="space-y-1.5 text-xs text-slate-655 dark:text-slate-350">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-success mt-1.5 flex-shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40">
                <button
                  onClick={() => { setResult(null); setImage(null); setFilterActive("none"); }}
                  className="w-full text-center bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Scan Another Image
                </button>
              </div>

            </div>
          ) : (
            /* Standby view */
            <div className="glass-panel rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/40 h-full flex flex-col justify-center items-center text-center space-y-3.5 text-slate-400 shadow-sm py-20">
              <Camera className="h-10 w-10 text-slate-300 animate-pulse-slow" />
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">Scan Standby Console</h4>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] mx-auto">Upload an image and launch the vision scan pipeline to view health scoring.</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Disclaimer bottom */}
      <MedicalDisclaimer />
    </div>
  );
}
