"use client";

import React, { useState, useEffect } from "react";
import { FileText, Search, Filter, Trash2, Download, X, Calendar, Activity, AlertTriangle, ShieldCheck } from "lucide-react";
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
      case "High": return "bg-brand-danger/10 text-brand-danger";
      case "Medium": return "bg-brand-secondary/10 text-brand-secondary";
      default: return "bg-brand-success/10 text-brand-success";
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
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Health Reports History
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Review, search, filter, and print previous AI screenings and lifestyle reports.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search symptoms, findings, summaries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs font-semibold outline-none focus:border-brand-primary"
          />
        </div>

        {/* Risk Filter */}
        <div className="relative">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-brand-primary"
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
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold outline-none focus:border-brand-primary"
          >
            <option value="All">All Types</option>
            <option value="Symptom">Symptom Assessment</option>
            <option value="Tongue">Tongue Analysis</option>
            <option value="Eye">Eye Sclera Analysis</option>
          </select>
        </div>

      </div>

      {/* Main Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Report Cards List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((s) => (
                <div key={s} className="animate-pulse glass-panel rounded-3xl p-6 h-28"></div>
              ))}
            </div>
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`glass-panel rounded-3xl p-5 border cursor-pointer hover:border-brand-primary/45 transition-all text-left flex justify-between items-center group ${
                  selectedReport?.id === report.id
                    ? "border-brand-primary shadow-md bg-white dark:bg-slate-900/60"
                    : "border-slate-200/50 dark:border-slate-800/40"
                }`}
              >
                <div className="space-y-2.5 overflow-hidden pr-4">
                  <div className="flex items-center space-x-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wide ${getRiskBadge(report.risk)}`}>
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
                  
                  <h3 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-primary transition-colors truncate">
                    {report.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {report.summary}
                  </p>
                </div>

                <div className="flex items-center space-x-3.5 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{report.score}/100</p>
                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Confidence</p>
                  </div>

                  <button
                    onClick={(e) => handleDelete(report.id, e)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/45 text-brand-danger transition-colors"
                    title="Delete report"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
              <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-xs text-slate-400 italic">No reports match your filters.</p>
            </div>
          )}
        </div>

        {/* Right Column: Active Selected Report Details Panel (1 col) */}
        <div className="lg:col-span-1 print:col-span-3">
          {selectedReport ? (
            <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-lg text-left space-y-6 print:border-none print:shadow-none print:p-0">
              
              {/* Header Info */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/40">
                <div>
                  <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedReport.title}</h2>
                  <p className="text-[9px] text-slate-405">{new Date(selectedReport.date).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 print:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Stats dial mock */}
              <div className="flex items-center space-x-3.5 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/30">
                <div className="flex-shrink-0 h-10 w-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Health Metric Score</span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-base font-extrabold text-slate-800 dark:text-white">{selectedReport.score}</span>
                    <span className="text-[9px] text-slate-400">/100 (Optimal Index)</span>
                  </div>
                </div>
              </div>

              {/* Findings */}
              <div className="space-y-2">
                <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Visual Insights</h4>
                <ul className="space-y-1.5 text-xs text-slate-650 dark:text-slate-350">
                  {selectedReport.findings.map((f, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Preventive Actions</h4>
                <ul className="space-y-1.5 text-xs text-slate-650 dark:text-slate-350">
                  {selectedReport.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-success mt-1.5 flex-shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Medical Disclaimer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40">
                <p className="text-[9px] leading-relaxed text-slate-400 italic">
                  Disclaimer: This visual screening report is generated by an artificial intelligence platform for wellness screening. It is not an official medical diagnostic card.
                </p>
              </div>

              {/* Print Action Buttons */}
              <div className="flex space-x-2 pt-2 print:hidden">
                <button
                  onClick={triggerPrint}
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-brand-primary hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-brand-primary/10"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download / Print PDF</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/40 h-full flex flex-col justify-center items-center text-center space-y-3.5 text-slate-400 py-20 shadow-sm print:hidden">
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
      <MedicalDisclaimer />
    </div>
  );
}
