"use client";

import React, { useState } from "react";
import { 
  Users, FileText, Cpu, Camera, TrendingUp, ShieldCheck, 
  BarChart2, Activity, UserCheck, ShieldAlert, AlertCircle 
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"analytics" | "logs">("analytics");

  // Mock Admin Analytics Data
  const stats = [
    { label: "Total Platform Users", value: "1,248", icon: Users, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20" },
    { label: "AI Reports Generated", value: "3,842", icon: FileText, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20" },
    { label: "Model Execution Success", value: "99.8%", icon: ShieldCheck, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20" },
    { label: "Visions Scans Processed", value: "1,920", icon: Camera, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/20" }
  ];

  const uploadLogs = [
    { id: "log-1", time: "Just now", type: "Tongue Scan", status: "Success", model: "CNN-v2.1", file: "IMG_3849.png", user: "User #842" },
    { id: "log-2", time: "3 mins ago", type: "Eye Sclera Scan", status: "Success", model: "CNN-v2.1", file: "IMG_4901.jpg", user: "User #902" },
    { id: "log-3", time: "12 mins ago", type: "Symptom Form", status: "Success", model: "DTree-v1.4", file: "N/A (Form Data)", user: "User #124" },
    { id: "log-4", time: "25 mins ago", type: "Tongue Scan", status: "Success", model: "CNN-v2.1", file: "IMG_1289.png", user: "User #458" },
    { id: "log-5", time: "44 mins ago", type: "Eye Sclera Scan", status: "Success", model: "CNN-v2.1", file: "IMG_9210.jpg", user: "User #998" }
  ];

  const modelMetrics = [
    { name: "Tongue Coating CNN", accuracy: "94.8%", latency: "240ms", runs: "1,120" },
    { name: "Eye Sclera Yellowing CNN", accuracy: "96.2%", latency: "280ms", runs: "800" },
    { name: "Symptom Decision Tree", accuracy: "93.4%", latency: "15ms", runs: "1,922" }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left pb-12">
      {/* Title */}
      <div className="flex flex-col space-y-2">
        <div className="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Activity className="h-4 w-4" />
          <span>System Administration Panel</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          AI Administrative Dashboard
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
          Audit database predictions logs, check local CNN model parameters, and review system performance metrics.
        </p>
      </div>

      {/* Grid of counter widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="glass-panel rounded-3xl p-5 border border-slate-200/50 dark:border-slate-800/40 shadow-xl flex items-center space-x-4">
              <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${s.color}`}>
                <Icon className="h-5.5 w-5.5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{s.label}</span>
                <span className="text-xl font-black text-slate-850 dark:text-white leading-tight mt-0.5">{s.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selector Tabs */}
      <div className="flex space-x-4 border-b border-slate-200/50 dark:border-slate-800/40 pb-0.5">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 text-xs font-extrabold transition-all border-b-2 uppercase tracking-wider ${
            activeTab === "analytics"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-450 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          Model Analytics
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-3 text-xs font-extrabold transition-all border-b-2 uppercase tracking-wider ${
            activeTab === "logs"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-450 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          Image Upload Logs
        </button>
      </div>

      {/* Tab A: Model Analytics and Performance Graphs */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* SVG prediction histogram (2 cols) */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-xl text-left space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-855 dark:text-slate-200">Daily Prediction Volatility</h3>
              <p className="text-[10px] text-slate-400 font-medium">Tracking API requests volume compared against model load latencies</p>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-44 w-full">
              <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-slate-900" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-slate-900" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#cbd5e1" strokeWidth="0.8" className="dark:stroke-slate-800" />

                {/* Bars */}
                {[
                  { x: 30, h: 50, val: "120", day: "Mon" },
                  { x: 100, h: 75, val: "185", day: "Tue" },
                  { x: 170, h: 90, val: "220", day: "Wed" },
                  { x: 240, h: 60, val: "150", day: "Thu" },
                  { x: 310, h: 80, val: "205", day: "Fri" },
                  { x: 380, h: 95, val: "240", day: "Sat" },
                  { x: 450, h: 40, val: "98", day: "Sun" }
                ].map((bar, i) => (
                  <g key={i}>
                    {/* Bar path */}
                    <rect
                      x={bar.x}
                      y={100 - bar.h}
                      width="20"
                      height={bar.h}
                      rx="4"
                      fill="#2563eb"
                      opacity="0.85"
                      className="hover:opacity-100 transition-opacity"
                    />
                    {/* Val text */}
                    <text x={bar.x + 10} y={92 - bar.h} textAnchor="middle" fill="#475569" fontSize="7" fontWeight="bold">
                      {bar.val}
                    </text>
                    {/* Day label */}
                    <text x={bar.x + 10} y="112" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">
                      {bar.day}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Model Metrics Table (1 col) */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-xl text-left space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-855 dark:text-slate-200">Neural Network Stats</h3>
              <p className="text-[10px] text-slate-400">Current testing criteria parameters for active local classifiers</p>
            </div>

            <div className="space-y-4 pt-2">
              {modelMetrics.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{m.name}</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                      {m.accuracy}
                    </span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-450 font-bold">
                    <span>Latency: {m.latency}</span>
                    <span>Total Runs: {m.runs}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab B: Image Upload Logs Table */}
      {activeTab === "logs" && (
        <div className="glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-xl overflow-hidden animate-fade-in text-left">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/40">
            <h3 className="text-sm font-bold text-slate-855 dark:text-slate-200">Image Logs</h3>
            <p className="text-[10px] text-slate-405">Audits logs of base64 images upload and corresponding Neural pipeline latency</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-650">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-[9px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-850">
                <tr>
                  <th className="px-6 py-4 text-left">Timestamp</th>
                  <th className="px-6 py-4 text-left">Screener Type</th>
                  <th className="px-6 py-4 text-left">Model Used</th>
                  <th className="px-6 py-4 text-left">Image File</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {uploadLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 font-medium">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">{log.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 dark:text-slate-250 font-bold">{log.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-[10px]">{log.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 truncate max-w-xs">{log.file}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600">
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">{log.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Safety info disclaimer panel */}
      <div className="p-5 rounded-3xl border border-blue-500/10 bg-blue-500/5 text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed flex items-start space-x-3">
        <AlertCircle className="h-4.5 w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest text-[9px]">Administrative Privacy Audit Guidelines</h4>
          <p>
            This admin panel operates under local check conditions. No clinical images or raw patient files are stored without explicit cryptographic encryption keys. Ensure database log sizes conform to local GDPR/HIPAA standards.
          </p>
        </div>
      </div>
    </div>
  );
}
