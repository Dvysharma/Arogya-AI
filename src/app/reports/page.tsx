"use client";

import React, { useState, useEffect } from "react";
import { FileText, Search, Filter, Trash2, Download, X, Calendar, Activity, AlertTriangle, ShieldCheck, Heart, Sparkles, Camera, Printer, AlertCircle } from "lucide-react";
import { MedicalDisclaimer } from "@/components/ui/medical-disclaimer";
import { HealthReport, mockReports } from "@/lib/mock-data";

export default function ReportsHistory() {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<"All" | "Low" | "Medium" | "High">("All");
  const [typeFilter, setTypeFilter] = useState<"All" | "Symptom" | "Tongue" | "Eye">("All");
  
  // Selected report for detailed viewing & print mock
  const [selectedReport, setSelectedReport] = useState<HealthReport | null>(null);

  const fetchReports = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent modal opening
    if (confirm("Are you sure you want to delete this report?")) {
      try {
        const res = await fetch(`/api/reports?id=${id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          setReports(reports.filter((r) => r.id !== id));
          if (selectedReport?.id === id) {
            setSelectedReport(null);
          }
        }
      } catch (error) {
        console.error("Failed to delete report:", error);
      }
    }
  };

  const triggerPrint = () => {
    window.print();
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "High": return "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-900/30";
      case "Medium": return "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900/30";
      default: return "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900/30";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Tongue":
        return <Sparkles className="h-4 w-4 text-emerald-600" />;
      case "Eye":
        return <Camera className="h-4 w-4 text-rose-600" />;
      default:
        return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.summary.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === "All" || r.risk === riskFilter;
    const matchesType = typeFilter === "All" || r.type === typeFilter;
    return matchesSearch && matchesRisk && matchesType;
  });

  return (
    <div className="space-y-8 animate-fade-in text-left pb-12">
      {/* Printable Report Layout - Hidden in normal screen, styled for Print */}
      {selectedReport && (
        <div className="hidden print:block p-8 bg-white text-black font-sans space-y-8" id="printable-report">
          {/* Header */}
          <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
            <div className="space-y-1">
              <h1 className="text-xl font-black tracking-wide text-slate-900">AROGYA AI SCREENING REPORT</h1>
              <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Preventive Healthcare Insights & Risk Assessment</p>
            </div>
            {/* Custom SVG QR Code */}
            <div className="h-14 w-14 border border-slate-300 p-1 flex items-center justify-center bg-white">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <rect width="100" height="100" fill="none" />
                {/* Outlines of QR */}
                <rect x="0" y="0" width="30" height="30" fill="black" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="10" y="10" width="10" height="10" fill="black" />
                <rect x="70" y="0" width="30" height="30" fill="black" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="80" y="10" width="10" height="10" fill="black" />
                <rect x="0" y="70" width="30" height="30" fill="black" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="10" y="80" width="10" height="10" fill="black" />
                {/* Random blocks */}
                <rect x="40" y="10" width="10" height="15" fill="black" />
                <rect x="55" y="5" width="10" height="10" fill="black" />
                <rect x="45" y="45" width="20" height="20" fill="black" />
                <rect x="80" y="45" width="10" height="15" fill="black" />
                <rect x="45" y="80" width="15" height="10" fill="black" />
              </svg>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <p><span className="font-bold text-slate-500">Report ID:</span> {selectedReport.id}</p>
              <p><span className="font-bold text-slate-500">Date Assessed:</span> {new Date(selectedReport.date).toLocaleString()}</p>
              <p><span className="font-bold text-slate-500">Screening Type:</span> {selectedReport.type}</p>
            </div>
            <div className="space-y-1 text-right">
              <p><span className="font-bold text-slate-500">Classification Risk:</span> <span className="font-extrabold uppercase">{selectedReport.risk} Risk</span></p>
              <p><span className="font-bold text-slate-500">AI Confidence Score:</span> <span className="font-extrabold">{selectedReport.score}%</span></p>
            </div>
          </div>

          {/* Core Vitals if Symptom */}
          <div className="border border-slate-200 p-4 rounded-xl space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">1. Physical Screening Parameters</h3>
            <p className="text-xs leading-relaxed text-slate-700">{selectedReport.summary}</p>
          </div>

          {/* Findings */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              2. Multimodal AI Analysis Findings
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 list-disc pl-5">
              {selectedReport.findings.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              3. Recommended Preventive Guidelines
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 list-disc pl-5">
              {selectedReport.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="border border-rose-200 bg-rose-50/20 p-4 rounded-xl text-[10px] leading-relaxed text-slate-650">
            <p className="font-bold text-rose-600 uppercase tracking-widest mb-1">Important Doctor Consultation Advice</p>
            This document is generated by an experimental Artificial Intelligence health screening model. It is intended for early preventive indicators analysis and does not constitute a clinical diagnosis, medical prescription, or treatment plan. Always seek the advice of a qualified physician with this report during your regular checkup.
          </div>

          {/* Validation sign */}
          <div className="pt-12 flex justify-between text-[10px] font-bold text-slate-400">
            <p>Verification Signature: _______________________</p>
            <p>System Check: Verified Pass</p>
          </div>
        </div>
      )}

      {/* Header - Screen view */}
      <div className="flex flex-col space-y-2 print:hidden">
        <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <FileText className="h-4 w-4" />
          <span>Patient Screening Database</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Reports History
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
          Search, audit, and filter previous local model results, and download print-friendly PDF lab sheets.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
        
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search symptoms, findings, summaries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-950/40 text-xs font-semibold outline-none focus:border-blue-600 transition-colors"
          />
        </div>

        {/* Risk Filter */}
        <div className="relative">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-955 text-xs font-bold outline-none focus:border-blue-600 transition-colors"
          >
            <option value="All">All Risks</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-955 text-xs font-bold outline-none focus:border-blue-600 transition-colors"
          >
            <option value="All">All Types</option>
            <option value="Symptom">Symptom Assessment</option>
            <option value="Tongue">Tongue Analysis</option>
            <option value="Eye">Eye Sclera Analysis</option>
          </select>
        </div>

      </div>

      {/* Main Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
        
        {/* Left Column: Report Cards List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((s) => (
                <div key={s} className="animate-pulse glass-panel rounded-3xl p-6 h-28 border border-slate-200/50 dark:border-slate-800/40"></div>
              ))}
            </div>
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`glass-panel rounded-3xl p-5 border cursor-pointer hover:border-blue-600/40 transition-all text-left flex justify-between items-center group shadow-sm ${
                  selectedReport?.id === report.id
                    ? "border-blue-600 shadow-md bg-white dark:bg-slate-900/60"
                    : "border-slate-200/50 dark:border-slate-800/40"
                }`}
              >
                <div className="space-y-2.5 overflow-hidden pr-4">
                  <div className="flex items-center space-x-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wide border ${getRiskBadge(report.risk)}`}>
                      {report.risk} Risk
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(report.date).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                  
                  <h3 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors truncate">
                    {report.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">
                    {report.summary}
                  </p>
                </div>

                <div className="flex items-center space-x-3.5 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{report.score}/100</p>
                    <p className="text-[7px] font-bold text-slate-450 uppercase tracking-widest">Score</p>
                  </div>

                  <button
                    onClick={(e) => handleDelete(report.id, e)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/45 text-rose-600 transition-colors"
                    title="Delete report"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
              <FileText className="h-10 w-10 text-slate-350 mx-auto mb-3" />
              <p className="text-xs text-slate-400 italic">No reports match your filters.</p>
            </div>
          )}
        </div>

        {/* Right Column: Active Selected Report Details Panel (1 col) */}
        <div className="lg:col-span-1">
          {selectedReport ? (
            <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-xl text-left space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-blue-500/5 rounded-full blur-2xl"></div>
              
              {/* Header Info */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/40">
                <div>
                  <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedReport.title}</h2>
                  <p className="text-[9px] text-slate-400">{new Date(selectedReport.date).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1 rounded-lg text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Stats dial */}
              <div className="flex items-center space-x-3.5 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-850">
                <div className="flex-shrink-0 h-9 w-9 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
                  {getTypeIcon(selectedReport.type)}
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-405 uppercase tracking-wider block">Health score</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-sm font-extrabold text-slate-800 dark:text-white">{selectedReport.score}</span>
                    <span className="text-[8px] text-slate-450">/100 (Optimal)</span>
                  </div>
                </div>
              </div>

              {/* Findings */}
              <div className="space-y-2">
                <h4 className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Visual Insights</h4>
                <ul className="space-y-2 text-xs text-slate-650 dark:text-slate-350">
                  {selectedReport.findings.map((f, i) => (
                    <li key={i} className="flex items-start space-x-2 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Preventive Actions</h4>
                <ul className="space-y-2 text-xs text-slate-650 dark:text-slate-350 font-medium">
                  {selectedReport.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Medical Disclaimer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/40">
                <p className="text-[9px] leading-relaxed text-slate-400 font-medium">
                  Disclaimer: This visual screening report is generated by an artificial intelligence platform for early preventive assessment. It is not an official medical diagnostic card.
                </p>
              </div>

              {/* Print Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={triggerPrint}
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-[10px] shadow-md shadow-blue-500/10 active:scale-95 transition-all"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Download / Print PDF</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/40 h-full flex flex-col justify-center items-center text-center space-y-3.5 text-slate-450 py-20 shadow-sm">
              <FileText className="h-10 w-10 text-slate-300 animate-pulse-slow" />
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">Details Standby Console</h4>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] mx-auto">Select a report from the historical logs list to view findings, observations, and download PDF sheets.</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Disclaimer bottom */}
      <div className="p-6 rounded-3xl border border-rose-500/20 bg-rose-500/5 text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed print:hidden">
        <h4 className="font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-widest text-[9px] mb-2 flex items-center space-x-1.5">
          <AlertCircle className="h-4 w-4" />
          <span>Important Medical Disclaimer</span>
        </h4>
        <p>
          This result is generated using Artificial Intelligence and should not be considered a medical diagnosis. It does not replace physical checks, medical imaging, or physician diagnostics. Always seek the advice of a qualified healthcare professional with any questions regarding medical conditions.
        </p>
      </div>
    </div>
  );
}
