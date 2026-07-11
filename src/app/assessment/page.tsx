"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, 
  Activity, ShieldCheck, Heart, RefreshCw, Sparkles, User, Info, Calendar
} from "lucide-react";
import { HealthReport } from "@/lib/mock-data";
import confetti from "canvas-confetti";
import { ArogyaLogo } from "@/components/ui/arogya-logo";

export default function Assessment() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<HealthReport | null>(null);

  // Form states
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<string>("Male");
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [smoking, setSmoking] = useState<"No" | "Occasionally" | "Regularly">("No");
  const [alcohol, setAlcohol] = useState<"No" | "Occasionally" | "Regularly">("No");
  const [exercise, setExercise] = useState<"None" | "1-2 days/week" | "3-5 days/week" | "Daily">("3-5 days/week");
  
  // Vitals
  const [sysBP, setSysBP] = useState<number>(120);
  const [diaBP, setDiaBP] = useState<number>(80);
  const [bloodSugar, setBloodSugar] = useState<number>(95);
  const [bmi, setBmi] = useState<number>(22.5);

  // Symptoms
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomText, setSymptomText] = useState<string>("");

  const symptomsList = [
    "Fatigue",
    "Fever",
    "Mild Headache",
    "Dry Throat",
    "Shortness of Breath",
    "Cough/Cold",
    "Chest Pain",
    "Abdominal Discomfort",
    "Dizziness"
  ];

  const handleSymptomToggle = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Comprehensive",
          age,
          gender,
          sleepHours,
          smoking,
          alcohol,
          exercise,
          sysBP,
          diaBP,
          bloodSugar,
          bmi,
          symptoms: selectedSymptoms,
          symptomText
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        
        // Trigger confetti for Low Risk reports
        if (data.risk === "Low") {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 }
          });
        }
      }
    } catch (error) {
      console.error("Failed to submit assessment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setSelectedSymptoms([]);
    setSymptomText("");
    setAge(25);
    setGender("Male");
    setSleepHours(7);
    setSmoking("No");
    setAlcohol("No");
    setExercise("3-5 days/week");
    setSysBP(120);
    setDiaBP(80);
    setBloodSugar(95);
    setBmi(22.5);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/30";
      case "Medium":
        return "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/30";
      default:
        return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/30";
    }
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return "stroke-brand-secondary";
    if (score >= 70) return "stroke-amber-500";
    return "stroke-rose-500";
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in text-left pb-12 circuit-bg">
      {/* Header Panel */}
      <div className="flex flex-col space-y-2">
        <div className="inline-flex items-center space-x-2 text-brand-primary dark:text-brand-secondary text-xs font-bold uppercase tracking-wider">
          <Heart className="h-4 w-4 fill-brand-primary/10" />
          <span>Interactive Health Screening</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Symptom & Lifestyle Screener
        </h1>
        <p className="text-xs md:text-sm text-slate-555 dark:text-slate-400 leading-relaxed max-w-xl font-medium">
          Enter your vital parameters, select lifestyle behaviors, and map symptoms to run local Decision Tree predictive models.
        </p>
      </div>

      {/* Main Form container */}
      {!result ? (
        <div className="glass-panel rounded-[2rem] p-6 md:p-8 border border-slate-200/50 dark:border-slate-800/40 shadow-2xl relative overflow-hidden">
          {/* Top subtle glow */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-brand-primary/5 rounded-full blur-3xl"></div>

          {/* Stepper Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200/50 dark:border-slate-800/40">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center space-x-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                      : step > s
                      ? "bg-brand-secondary/15 text-brand-secondary"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-650"
                  }`}
                >
                  {step > s ? <ShieldCheck className="h-4.5 w-4.5" /> : s}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider hidden sm:inline ${
                    step === s ? "text-slate-800 dark:text-slate-200" : "text-slate-400"
                  }`}
                >
                  {s === 1 ? "Lifestyle" : s === 2 ? "Vitals" : "Symptoms"}
                </span>
                {s < 3 && <ChevronRight className="h-3.5 w-3.5 text-slate-350 dark:text-slate-800 hidden sm:inline" />}
              </div>
            ))}
          </div>

          {submitting ? (
            /* Premium Processing state with loading skeletons */
            <div className="flex flex-col items-center justify-center py-16 space-y-8 animate-fade-in">
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-brand-primary/10 border-t-brand-primary animate-spin"></div>
                <ArogyaLogo width={45} height={45} animated={true} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-3 max-w-sm">
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200 animate-pulse">
                  Running Neural Classification...
                </h3>
                <p className="text-xs text-slate-455 dark:text-slate-405 leading-relaxed font-semibold">
                  We are cross-referencing lifestyle factors, symptoms database weights, and blood pressure logs against statistical datasets.
                </p>
              </div>

              {/* Skeletons mimicking data extraction */}
              <div className="w-full max-w-md space-y-3 pt-6">
                <div className="h-4 bg-slate-200/50 dark:bg-slate-900/60 rounded-md w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-200/50 dark:bg-slate-900/60 rounded-md w-5/6 animate-pulse"></div>
                <div className="h-4 bg-slate-200/50 dark:bg-slate-900/60 rounded-md w-1/2 animate-pulse"></div>
              </div>
            </div>
          ) : (
            /* Forms steps content */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Personal & Lifestyle parameters */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Age</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value) || 25)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-950/40 text-xs font-semibold outline-none focus:border-brand-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-950 text-xs font-bold outline-none focus:border-brand-primary transition-colors"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Daily Sleep (hours)</label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={sleepHours}
                        onChange={(e) => setSleepHours(parseInt(e.target.value) || 7)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-950/40 text-xs font-semibold outline-none focus:border-brand-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Weekly Exercise</label>
                      <select
                        value={exercise}
                        onChange={(e) => setExercise(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-955 text-xs font-bold outline-none focus:border-brand-primary transition-colors"
                      >
                        <option>None</option>
                        <option>1-2 days/week</option>
                        <option>3-5 days/week</option>
                        <option>Daily</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tobacco/Smoking</label>
                      <select
                        value={smoking}
                        onChange={(e) => setSmoking(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-955 text-xs font-bold outline-none focus:border-brand-primary transition-colors"
                      >
                        <option>No</option>
                        <option>Occasionally</option>
                        <option>Regularly</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Alcohol Consumption</label>
                      <select
                        value={alcohol}
                        onChange={(e) => setAlcohol(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-955 text-xs font-bold outline-none focus:border-brand-primary transition-colors"
                      >
                        <option>No</option>
                        <option>Occasionally</option>
                        <option>Regularly</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Physiological metrics (Vitals) */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Systolic BP (mmHg)</label>
                      <input
                        type="number"
                        min="50"
                        max="250"
                        value={sysBP}
                        onChange={(e) => setSysBP(parseInt(e.target.value) || 120)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-955/40 text-xs font-semibold outline-none focus:border-brand-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Diastolic BP (mmHg)</label>
                      <input
                        type="number"
                        min="30"
                        max="180"
                        value={diaBP}
                        onChange={(e) => setDiaBP(parseInt(e.target.value) || 80)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-955/40 text-xs font-semibold outline-none focus:border-brand-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fasting Blood Sugar (mg/dL)</label>
                      <input
                        type="number"
                        min="10"
                        max="500"
                        value={bloodSugar}
                        onChange={(e) => setBloodSugar(parseInt(e.target.value) || 95)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-955/40 text-xs font-semibold outline-none focus:border-brand-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Body Mass Index (BMI)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="10"
                        max="60"
                        value={bmi}
                        onChange={(e) => setBmi(parseFloat(e.target.value) || 22.5)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-955/40 text-xs font-semibold outline-none focus:border-brand-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Symptoms select list */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Select Symptoms</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {symptomsList.map((sym) => {
                        const isSelected = selectedSymptoms.includes(sym);
                        return (
                          <button
                            key={sym}
                            type="button"
                            onClick={() => handleSymptomToggle(sym)}
                            className={`px-3 py-3 rounded-2xl border text-xs font-bold transition-all duration-200 ${
                              isSelected
                                ? "bg-brand-primary text-white border-brand-primary shadow-md"
                                : "bg-white/40 dark:bg-slate-955/40 text-slate-650 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60"
                            }`}
                          >
                            {sym}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Describe symptoms or duration</label>
                    <textarea
                      rows={3}
                      value={symptomText}
                      onChange={(e) => setSymptomText(e.target.value)}
                      placeholder="Add details, duration, or any other signs you observe..."
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-955/40 text-xs font-semibold outline-none focus:border-brand-primary resize-none transition-colors"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Step Navigation buttons */}
              <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/40 pt-6">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-850 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary inline-flex items-center space-x-2 text-xs py-2.5 px-5"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-primary inline-flex items-center space-x-2 text-xs py-2.5 px-5"
                  >
                    <span>Analyze Assessment</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      ) : (
        /* RESULT VIEW - Apple / Ada Health style */
        <div className="space-y-8 animate-slide-up">
          <div className="glass-panel rounded-[2rem] p-6 md:p-8 border border-slate-200/50 dark:border-slate-800/40 shadow-2xl text-left space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-brand-primary/5 rounded-full blur-3xl"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200/50 dark:border-slate-800/40 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest flex items-center space-x-1">
                    <Sparkles className="h-3 w-3" />
                    <span>AI Model Analysis</span>
                  </span>
                  <h2 className="text-lg font-black text-slate-850 dark:text-slate-100">{result.title}</h2>
                  <p className="text-[10px] text-slate-400">Index Generated • {new Date(result.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Health Risk Level</span>
                  <div className={`mt-1 px-3.5 py-1 rounded-full text-[10px] font-extrabold border ${getRiskColor(result.risk)}`}>
                    {result.risk}
                  </div>
                </div>

                {/* Gauge widget */}
                <div className="relative flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="26" className="stroke-slate-100 dark:stroke-slate-900 fill-none" strokeWidth="4.5" />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      className={`fill-none transition-all duration-500 ${getScoreBg(result.score)}`}
                      strokeWidth="4.5"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={2 * Math.PI * 26 * (1 - result.score / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xs font-black text-slate-800 dark:text-white leading-none">{result.score}</span>
                    <span className="text-[6px] font-extrabold text-slate-400 uppercase leading-none mt-0.5">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Summary widget */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850/40 space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Info className="h-3.5 w-3.5 text-brand-primary" />
                <span>Risk Summary</span>
              </h3>
              <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-350 font-semibold">
                {result.summary}
              </p>
            </div>

            {/* Core Findings */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-450 border-b border-slate-100 dark:border-slate-850/50 pb-1.5">
                AI Pipeline Observations
              </h3>
              <ul className="space-y-3">
                {result.findings.map((finding, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-xs">
                    <div className="h-5 w-5 bg-brand-primary/10 text-brand-primary rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-slate-650 dark:text-slate-355 font-semibold leading-relaxed">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preventive Recommendations */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-455 border-b border-slate-100 dark:border-slate-850/50 pb-1.5">
                Preventive Guideline Checklist
              </h3>
              <ul className="space-y-3">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-xs">
                    <div className="h-5 w-5 bg-brand-secondary/10 text-brand-secondary rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-slate-650 dark:text-slate-355 font-semibold leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/40 pt-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-xs font-bold text-slate-455 hover:text-slate-850 dark:hover:text-white transition-colors"
              >
                Go to Dashboard
              </button>
              
              <button
                onClick={handleReset}
                className="btn-primary inline-flex items-center space-x-1.5 text-xs py-2.5 px-5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>New Screening</span>
              </button>
            </div>
          </div>

          {/* Medical disclaimer */}
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
      )}
    </div>
  );
}
