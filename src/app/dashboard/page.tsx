"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Heart, Activity, FileText, Camera, ShieldAlert, ChevronRight, 
  RefreshCw, Calendar, Sparkles, TrendingUp, Info, UserCheck, CheckCircle
} from "lucide-react";
import { mockDashboardStats, mockReports, healthTips, HealthReport } from "@/lib/mock-data";

export default function Dashboard() {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Fetch reports
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/reports");
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        } else {
          setReports(mockReports);
        }
      } catch (e) {
        setReports(mockReports);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Tip carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const recentReports = reports.slice(0, 4);
  const activeReportsCount = reports.length;
  
  // Calculate average score dynamically based on reports loaded, fallback to mockDashboardStats
  const currentHealthScore = reports.length > 0 
    ? Math.round(reports.reduce((acc, r) => acc + r.score, 0) / reports.length)
    : mockDashboardStats.healthScore;

  // Count risk distribution
  const riskCounts = reports.reduce((acc, r) => {
    acc[r.risk] = (acc[r.risk] || 0) + 1;
    return acc;
  }, { Low: 0, Medium: 0, High: 0 } as Record<string, number>);

  if (reports.length === 0) {
    riskCounts.Low = 3;
    riskCounts.Medium = 1;
    riskCounts.High = 0;
  }

  // Gauge colors
  const getScoreColor = (score: number) => {
    if (score >= 85) return "stroke-emerald-500";
    if (score >= 70) return "stroke-amber-500";
    return "stroke-rose-500";
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "High":
        return "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-900/30";
      case "Medium":
        return "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900/30";
      default:
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900/30";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Tongue":
        return <Sparkles className="h-4.5 w-4.5" />;
      case "Eye":
        return <Camera className="h-4.5 w-4.5" />;
      default:
        return <ShieldAlert className="h-4.5 w-4.5" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 text-left">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Health Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Monitor screening history, vital trends, and personalized preventive metrics.
          </p>
        </div>
        
        <div className="flex items-center space-x-3 text-xs font-semibold text-slate-400">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span>July 11, 2026</span>
          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-500 hover:text-blue-600 transition-colors"
            title="Refresh dashboard stats"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main Stats Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Widget A: Health Score Circular Gauge */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/5 rounded-full blur-2xl"></div>
          
          <div className="w-full text-left">
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200">AI Health Index</h3>
            <p className="text-[10px] text-slate-400">Composite index based on cumulative screenings</p>
          </div>

          <div className="relative flex items-center justify-center my-6">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                className="stroke-slate-100 dark:stroke-slate-900 fill-none"
                strokeWidth="9"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                className={`fill-none transition-all duration-1000 ${getScoreColor(currentHealthScore)}`}
                strokeWidth="9"
                strokeDasharray={2 * Math.PI * 60}
                strokeDashoffset={2 * Math.PI * 60 * (1 - currentHealthScore / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{currentHealthScore}</span>
              <span className="text-[8px] text-slate-450 font-bold uppercase tracking-widest mt-1">Optimal</span>
            </div>
          </div>

          <div className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
            <Activity className="h-3.5 w-3.5" />
            <span>Stable over last 3 screenings</span>
          </div>
        </div>

        {/* Widget B: Recent Assessment Card */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between text-left shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200">Latest Screening Report</h3>
            <p className="text-[10px] text-slate-400">Highlights of your most recent AI model check</p>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-3 py-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-4 my-3">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
                  {getTypeIcon(reports[0].type)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{reports[0].title}</h4>
                  <p className="text-[10px] text-slate-400">
                    {new Date(reports[0].date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850">
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                  {reports[0].summary}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-slate-400 italic">No reports logged.</p>
              <Link href="/assessment" className="text-xs font-bold text-blue-600 mt-2 inline-block hover:underline">
                Start first screening
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Calculated Risk</span>
            {reports.length > 0 && (
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${getRiskBadge(reports[0].risk)}`}>
                {reports[0].risk}
              </span>
            )}
          </div>
        </div>

        {/* Widget C: Quick Launch Tools */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between text-left shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200">Start Screening</h3>
            <p className="text-[10px] text-slate-400">Choose a diagnostic mapping layer</p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 py-4">
            <Link
              href="/assessment"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 hover:border-blue-500/30 transition-all text-center space-y-1.5 active:scale-95 shadow-sm"
            >
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200">Symptom Form</span>
            </Link>

            <Link
              href="/image-analysis"
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/30 transition-all text-center space-y-1.5 active:scale-95 shadow-sm"
            >
              <Camera className="h-5 w-5 text-emerald-600" />
              <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200">Image Scan</span>
            </Link>
          </div>

          <Link
            href="/reports"
            className="w-full flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 pt-2 group"
          >
            <span>Browse History ({activeReportsCount} reports)</span>
            <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 3. Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget D: Custom SVG Health Score Trend */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 text-left shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200">Weekly Health Score Trend</h3>
              <p className="text-[10px] text-slate-400">Evolution of screening accuracy scores over the last 6 months</p>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 uppercase tracking-wide">
              6 Months
            </span>
          </div>

          {/* Responsive SVG Line Chart */}
          <div className="relative h-44 w-full">
            <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-slate-900" />
              <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-slate-900" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-slate-900" />
              
              {/* Area path */}
              <path
                d="M 10 90 L 100 80 L 200 65 L 300 70 L 400 45 L 490 35 L 490 120 L 10 120 Z"
                fill="url(#chartGrad)"
              />
              
              {/* Score Line */}
              <path
                d="M 10 90 L 100 80 L 200 65 L 300 70 L 400 45 L 490 35"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {[
                { x: 10, y: 90, label: "Jan" },
                { x: 100, y: 80, label: "Feb" },
                { x: 200, y: 65, label: "Mar" },
                { x: 300, y: 70, label: "Apr" },
                { x: 400, y: 45, label: "May" },
                { x: 490, y: 35, label: "Jun" }
              ].map((pt, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                  <text x={pt.x} y="115" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Widget E: Risk Categories Split Ratio */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 text-left shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-855 dark:text-slate-200">Risk Profile Split</h3>
            <p className="text-[10px] text-slate-400">Distribution of your assessment reports by risk level</p>
          </div>

          <div className="flex items-center space-x-6 my-4">
            {/* Custom Pie Chart */}
            <div className="relative h-20 w-20 flex-shrink-0">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3" className="dark:stroke-slate-900" />
                
                {/* Low Risk green section */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.5"
                  strokeDasharray="75 25" strokeDashoffset="25" />
                {/* Medium Risk yellow section */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3.5"
                  strokeDasharray="25 75" strokeDashoffset="50" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-black text-slate-700 dark:text-slate-350">75% Low</span>
              </div>
            </div>

            {/* Labels */}
            <div className="space-y-1.5 text-[10px] font-semibold text-slate-500">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Low Risk: {riskCounts.Low} ({reports.length > 0 ? Math.round((riskCounts.Low / reports.length) * 100) : 75}%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Medium Risk: {riskCounts.Medium} ({reports.length > 0 ? Math.round((riskCounts.Medium / reports.length) * 100) : 25}%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span>High Risk: {riskCounts.High} (0%)</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center space-x-2">
            <Info className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed font-medium">
              Excellent! Your risk mapping profile remains heavily clustered in the healthy Low-Medium risk index.
            </span>
          </div>
        </div>

      </div>

      {/* 4. Sliding Health Tip of the Day & Doctor Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sliding Health Tip */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between text-left shadow-xl relative overflow-hidden md:col-span-2">
          <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
          
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500/15 p-2 rounded-xl text-emerald-600">
              <Heart className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Health Tip of the Day</h3>
              <p className="text-[9px] text-slate-400">Preventive wellness guidance</p>
            </div>
          </div>

          <div className="my-6 min-h-[50px] flex items-center">
            <p className="text-xs leading-relaxed font-bold text-slate-700 dark:text-slate-300">
              {healthTips[tipIndex]}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-4">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">Arogya Wellness</span>
            <div className="flex space-x-1.5">
              {healthTips.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTipIndex(idx)}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    idx === tipIndex ? "bg-emerald-500 w-4" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                  aria-label={`Go to tip ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Doctor Consultation Recommendation Widget */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between text-left shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-rose-500/5 rounded-full blur-2xl"></div>
          
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center space-x-1">
              <ShieldAlert className="h-4 w-4" />
              <span>Medical Consult Advice</span>
            </h3>
            <p className="text-[9px] text-slate-450 uppercase font-bold">Standard Screening Alert</p>
          </div>

          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350 font-medium my-4">
            Arogya AI screening is a preliminary tool. Always schedule a clinical consultation with your physician to evaluate visual indicators and vital metrics.
          </p>

          <Link
            href="/reports"
            className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-slate-850 dark:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-[10px] transition-colors"
          >
            Export Report to PDF
          </Link>
        </div>

      </div>

      {/* 5. Recent Reports List Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 text-left shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/40">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Recent Health Screenings</h3>
            <p className="text-[10px] text-slate-400">Log of recent AI analyses and lifestyle assessments</p>
          </div>
          <Link
            href="/reports"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1"
          >
            <span>All History</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4 py-6">
            <div className="h-6 bg-slate-100 dark:bg-slate-900 rounded w-full"></div>
            <div className="h-6 bg-slate-100 dark:bg-slate-900 rounded w-full"></div>
          </div>
        ) : reports.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between py-4 group">
                <div className="flex items-center space-x-3.5">
                  <div className="h-9 w-9 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-350">
                    {getTypeIcon(report.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                      {report.title}
                    </h4>
                    <p className="text-[10px] text-slate-455">
                      Type: {report.type} • {new Date(report.date).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-850 dark:text-slate-100">{report.score}/100</p>
                    <p className="text-[8px] font-bold text-slate-450 uppercase tracking-widest">Score</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase border ${getRiskBadge(report.risk)}`}>
                    {report.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xs text-slate-400 italic">No reports logged. Begin an assessment to populate your dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}
