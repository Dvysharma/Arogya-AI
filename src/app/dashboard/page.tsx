"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { Heart, Activity, FileText, Camera, ShieldAlert, ChevronRight, RefreshCw, Calendar, Sparkles } from "lucide-react";
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
          const data = await res.ok ? await res.json() : mockReports;
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

  // Calculate average health score
  const recentReports = reports.slice(0, 3);
  const activeReportsCount = reports.length;
  
  // Calculate average score dynamically based on reports loaded, fallback to mockDashboardStats
  const currentHealthScore = reports.length > 0 
    ? Math.round(reports.reduce((acc, r) => acc + r.score, 0) / reports.length)
    : mockDashboardStats.healthScore;

  // Gauge colors
  const getScoreColor = (score: number) => {
    if (score >= 85) return "stroke-brand-success";
    if (score >= 70) return "stroke-brand-secondary";
    return "stroke-brand-danger";
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "High":
        return "bg-brand-danger/10 text-brand-danger";
      case "Medium":
        return "bg-brand-secondary/10 text-brand-secondary";
      default:
        return "bg-brand-success/10 text-brand-success";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Tongue":
        return <Sparkles className="h-4 w-4" />;
      case "Eye":
        return <Camera className="h-4 w-4" />;
      default:
        return <ShieldAlert className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Namaste, Guest User
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Welcome back to Arogya AI. Here is your preventive health summary.
          </p>
        </div>
        
        <div className="flex items-center space-x-3 text-xs font-semibold text-slate-400">
          <Calendar className="h-4 w-4 text-brand-primary" />
          <span>July 10, 2026</span>
          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-brand-primary transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Widget A: Health Score Gauge */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 h-24 w-24 bg-brand-primary/5 rounded-full blur-2xl"></div>
          
          <div className="w-full text-left">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">AI Health Score</h3>
            <p className="text-[10px] text-slate-400">Composite index based on all screenings</p>
          </div>

          {/* SVG Circular Progress Ring */}
          <div className="relative flex items-center justify-center my-6">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                strokeWidth="10"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                className={`fill-none transition-all duration-1000 ${getScoreColor(currentHealthScore)}`}
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 60}
                strokeDashoffset={2 * Math.PI * 60 * (1 - currentHealthScore / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{currentHealthScore}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Index</span>
            </div>
          </div>

          <div className="text-xs font-semibold text-brand-success flex items-center space-x-1">
            <Activity className="h-3.5 w-3.5" />
            <span>{mockDashboardStats.scoreChange}</span>
          </div>
        </div>

        {/* Widget B: Recent Assessment Card */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between text-left shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Last Screening</h3>
            <p className="text-[10px] text-slate-400">Details of your most recent evaluation</p>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-3 py-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-4 my-4">
              <div className="flex items-center space-x-2.5">
                <div className="h-8 w-8 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                  {getTypeIcon(reports[0].type)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{reports[0].title}</h4>
                  <p className="text-[10px] text-slate-400">
                    {new Date(reports[0].date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40">
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                  {reports[0].summary}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-slate-400 italic">No reports found.</p>
              <Link href="/assessment" className="text-xs font-bold text-brand-primary mt-2 inline-block hover:underline">
                Create first screening
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-2">
            <span className="font-semibold text-slate-400">Risk Assessment</span>
            {reports.length > 0 && (
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getRiskBadge(reports[0].risk)}`}>
                {reports[0].risk} Risk
              </span>
            )}
          </div>
        </div>

        {/* Widget C: Quick Navigation Actions */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between text-left shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Quick Actions</h3>
            <p className="text-[10px] text-slate-400">Launch standard health screening pipelines</p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 py-4">
            <Link
              href="/assessment"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-brand-primary/5 hover:bg-brand-primary/10 border border-brand-primary/10 hover:border-brand-primary/30 transition-all text-center space-y-1.5 active:scale-95"
            >
              <ShieldAlert className="h-5 w-5 text-brand-primary" />
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Symptom Assessment</span>
            </Link>

            <Link
              href="/image-analysis"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-brand-success/5 hover:bg-brand-success/10 border border-brand-success/10 hover:border-brand-success/30 transition-all text-center space-y-1.5 active:scale-95"
            >
              <Camera className="h-5 w-5 text-brand-success" />
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Scan Tongue/Eye</span>
            </Link>
          </div>

          <Link
            href="/reports"
            className="w-full flex items-center justify-between text-xs font-semibold text-brand-primary hover:text-blue-700 pt-2 group"
          >
            <span>View all {activeReportsCount} reports</span>
            <ChevronRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 3. Graph and Tip Banner row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget D: Health Score Recharts Trend */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 text-left shadow-sm">
          <div className="flex items-center justify-between pb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Health Index Trend</h3>
              <p className="text-[10px] text-slate-400">Monthly evolution of your preventive health index</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
              6 Months
            </span>
          </div>

          <div className="h-48 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDashboardStats.scoreHistory}>
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  domain={[50, 100]}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid #cbd5e1",
                    borderRadius: "12px",
                    fontSize: "11px",
                    color: "#0f172a",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: "#2563EB", strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widget E: Sliding Health Tip of the Day */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between text-left relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 h-32 w-32 bg-brand-success/5 rounded-full blur-3xl"></div>
          
          <div className="flex items-center space-x-2">
            <div className="bg-brand-success/15 p-2 rounded-xl text-brand-success">
              <Heart className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-brand-success uppercase tracking-wider">Health Tip of the Day</h3>
              <p className="text-[9px] text-slate-400">Preventive wellness guidance</p>
            </div>
          </div>

          {/* Simple sliding content */}
          <div className="my-6 min-h-[90px] flex items-center">
            <p className="text-xs leading-relaxed font-semibold text-slate-700 dark:text-slate-300 transition-opacity duration-500">
              {healthTips[tipIndex]}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-4">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Arogya Wellness</span>
            <div className="flex space-x-1.5">
              {healthTips.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTipIndex(idx)}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    idx === tipIndex ? "bg-brand-success w-4" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                  aria-label={`Go to tip ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Recent Reports List Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 text-left shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/40">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Recent Health Screenings</h3>
            <p className="text-[10px] text-slate-400">Log of recent AI analyses and lifestyle assessments</p>
          </div>
          <Link
            href="/reports"
            className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
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
                  <div className="h-9 w-9 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">
                    {getTypeIcon(report.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-primary transition-colors">
                      {report.title}
                    </h4>
                    <p className="text-[10px] text-slate-400">
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
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{report.score}/100</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Score</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase ${getRiskBadge(report.risk)}`}>
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
