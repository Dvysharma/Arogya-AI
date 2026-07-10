"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Activity, ShieldCheck, Heart, RefreshCw } from "lucide-react";
import { MedicalDisclaimer } from "@/components/ui/medical-disclaimer";
import { HealthReport } from "@/lib/mock-data";
import confetti from "canvas-confetti";

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
        return "text-brand-danger bg-red-50 dark:bg-red-950/20 border-brand-danger/30";
      case "Medium":
        return "text-brand-secondary bg-sky-50 dark:bg-sky-950/20 border-brand-secondary/30";
      default:
        return "text-brand-success bg-emerald-50 dark:bg-emerald-950/20 border-brand-success/30";
    }
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return "stroke-brand-success";
    if (score >= 70) return "stroke-brand-secondary";
    return "stroke-brand-danger";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in text-left">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          AI Health Assessment
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Guided multi-step questionnaire mapping symptoms, physiological metrics, and lifestyle.
        </p>
      </div>

      {/* Main Container */}
      {!result ? (
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-200/50 dark:border-slate-800/40 shadow-md">
          {/* Step Indicators */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200/50 dark:border-slate-800/40">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center space-x-2">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s
                      ? "bg-brand-primary text-white"
                      : step > s
                      ? "bg-brand-success/15 text-brand-success"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {step > s ? <ShieldCheck className="h-4 w-4" /> : s}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider hidden sm:inline ${
                    step === s ? "text-slate-800 dark:text-slate-200" : "text-slate-400"
                  }`}
                >
                  {s === 1 ? "Lifestyle" : s === 2 ? "Vitals" : "Symptoms"}
                </span>
                {s < 3 && <ChevronRight className="h-3.5 w-3.5 text-slate-300 hidden sm:inline" />}
              </div>
            ))}
          </div>

          {submitting ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-brand-primary/10 border-t-brand-primary animate-spin"></div>
                <Heart className="h-6 w-6 text-brand-primary fill-brand-primary/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
              </div>
              <div className="text-center space-y-2 max-w-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 animate-pulse">
                  Analyzing Screening Data...
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Our AI models are cross-referencing your symptoms and lifestyle scores to build your preventive screening profile.
                </p>
              </div>
            </div>
          ) : (
            /* Form Steps */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Personal & Lifestyle */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Age</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value) || 25)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs font-semibold outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-brand-primary"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sleep Duration (hrs)</label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={sleepHours}
                        onChange={(e) => setSleepHours(parseInt(e.target.value) || 7)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs font-semibold outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Exercise Frequency</label>
                      <select
                        value={exercise}
                        onChange={(e) => setExercise(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-brand-primary"
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
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Smoking</label>
                      <select
                        value={smoking}
                        onChange={(e) => setSmoking(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-brand-primary"
                      >
                        <option>No</option>
                        <option>Occasionally</option>
                        <option>Regularly</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Alcohol</label>
                      <select
                        value={alcohol}
                        onChange={(e) => setAlcohol(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-brand-primary"
                      >
                        <option>No</option>
                        <option>Occasionally</option>
                        <option>Regularly</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Vitals */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Systolic BP (mmHg)</label>
                      <input
                        type="number"
                        min="50"
                        max="250"
                        value={sysBP}
                        onChange={(e) => setSysBP(parseInt(e.target.value) || 120)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs font-semibold outline-none focus:border-brand-primary"
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
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs font-semibold outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Blood Sugar (optional, mg/dL)</label>
                      <input
                        type="number"
                        min="10"
                        max="500"
                        value={bloodSugar}
                        onChange={(e) => setBloodSugar(parseInt(e.target.value) || 95)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs font-semibold outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">BMI (Body Mass Index)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="10"
                        max="60"
                        value={bmi}
                        onChange={(e) => setBmi(parseFloat(e.target.value) || 22.5)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs font-semibold outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Symptoms */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Symptoms you feel</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {symptomsList.map((sym) => {
                        const isSelected = selectedSymptoms.includes(sym);
                        return (
                          <button
                            key={sym}
                            type="button"
                            onClick={() => handleSymptomToggle(sym)}
                            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                              isSelected
                                ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                                : "bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60"
                            }`}
                          >
                            {sym}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Additional Symptom Details</label>
                    <textarea
                      rows={3}
                      value={symptomText}
                      onChange={(e) => setSymptomText(e.target.value)}
                      placeholder="Describe how long symptoms have occurred, or add any other discomfort..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs font-semibold outline-none focus:border-brand-primary resize-none"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/40 pt-6">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
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
                    className="inline-flex items-center space-x-2 bg-brand-primary hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 bg-brand-success hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors"
                  >
                    <span>Submit for AI Analysis</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      ) : (
        /* RESULT VIEW */
        <div className="space-y-8 animate-slide-up">
          {/* Main Results card */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-200/50 dark:border-slate-800/40 shadow-lg text-left space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-brand-primary/5 rounded-full blur-3xl"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200/50 dark:border-slate-800/40 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-850 dark:text-slate-100">{result.title}</h2>
                  <p className="text-[10px] text-slate-400">Screening Complete • {new Date(result.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-400">Risk Assessment</span>
                  <div className={`mt-0.5 px-3 py-1 rounded-full text-[10px] font-bold border ${getRiskColor(result.risk)}`}>
                    {result.risk} Risk
                  </div>
                </div>

                {/* mini gauge */}
                <div className="relative flex items-center justify-center">
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
              </div>
            </div>

            {/* Findings Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Analysis Summary</h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {result.summary}
              </p>
            </div>

            {/* Key Clinical Findings */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Visual & Textual Findings</h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-350">
                {result.findings.map((finding, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Preventive Actions & Guidance</h3>
              <ul className="space-y-2 text-xs text-slate-655 dark:text-slate-350">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-success mt-1.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/40 pt-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-xs font-bold text-slate-500 hover:text-slate-850 dark:hover:text-white transition-colors"
              >
                Go to Dashboard
              </button>
              
              <button
                onClick={handleReset}
                className="inline-flex items-center space-x-1.5 bg-brand-primary hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all active:scale-95"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>New Screening</span>
              </button>
            </div>
          </div>

          {/* Persistent disclaimer below results */}
          <MedicalDisclaimer />
        </div>
      )}
    </div>
  );
}
