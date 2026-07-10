"use client";

import React, { useState } from "react";
import { User, Mail, ShieldAlert, Heart, Calendar, Eye, Activity, HeartHandshake, PhoneCall } from "lucide-react";
import { mockUserProfile, UserProfile } from "@/lib/mock-data";

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [isEditing, setIsEditing] = useState(false);

  // Edit states
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [height, setHeight] = useState(profile.height);
  const [weight, setWeight] = useState(profile.weight);
  const [bloodSugar, setBloodSugar] = useState(profile.bloodSugar || 90);
  const [sleepHours, setSleepHours] = useState(profile.sleepHours);

  const handleSave = () => {
    setProfile({
      ...profile,
      name,
      age,
      height,
      weight,
      bloodSugar,
      sleepHours
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Health Profile
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Manage your personal vitals, physical statistics, and emergency contact registries.
          </p>
        </div>
        
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="w-full md:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-brand-primary hover:bg-blue-700 text-white shadow-md shadow-brand-primary/10 transition-colors"
        >
          {isEditing ? "Save Profile Card" : "Edit Profile Card"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Personal Profile summary card (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-md text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-28 w-28 bg-brand-primary/5 rounded-full blur-2xl"></div>
            
            {/* Avatar */}
            <div className="relative mx-auto h-20 w-20 rounded-full bg-brand-primary/10 flex items-center justify-center text-4xl shadow-inner border border-slate-200/30">
              👤
            </div>
            
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-center text-base font-extrabold px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 outline-none"
                />
              ) : (
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">{profile.name}</h3>
              )}
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">Registered Patient</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 text-left text-xs text-slate-600 dark:text-slate-350">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="truncate">{profile.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>
                  Age:{" "}
                  {isEditing ? (
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 28)}
                      className="w-16 px-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    />
                  ) : (
                    profile.age
                  )}{" "}
                  years • {profile.gender}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldAlert className="h-4 w-4 text-slate-400" />
                <span>Blood Type: <b className="text-slate-800 dark:text-slate-200">{profile.bloodGroup}</b></span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Detailed Vitals & Lifestyle Metrics (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Physical Vitals & Biomarkers */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-sm text-left space-y-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-brand-primary" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Physical Stats & Vitals</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Height</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full mt-1 text-sm font-bold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-1 rounded"
                  />
                ) : (
                  <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">{profile.height}</span>
                )}
              </div>
              
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Weight</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full mt-1 text-sm font-bold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-1 rounded"
                  />
                ) : (
                  <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">{profile.weight}</span>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Blood Sugar</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={bloodSugar}
                    onChange={(e) => setBloodSugar(parseInt(e.target.value) || 90)}
                    className="w-full mt-1 text-sm font-bold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-1 rounded"
                  />
                ) : (
                  <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">{profile.bloodSugar} mg/dL</span>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Blood Pressure</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">{profile.sysBP}/{profile.diaBP} mmHg</span>
              </div>
            </div>
          </div>

          {/* Section 2: Lifestyle Habitation factors */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-sm text-left space-y-6">
            <div className="flex items-center space-x-2">
              <HeartHandshake className="h-5 w-5 text-brand-success" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Habit & Lifestyle Registries</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 text-xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Exercise Level</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white mt-1">{profile.exercise}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 text-xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Sleep Hours</p>
                {isEditing ? (
                  <input
                    type="number"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseInt(e.target.value) || 7)}
                    className="w-16 mt-1 text-sm font-bold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-1 rounded"
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-800 dark:text-white mt-1">{profile.sleepHours} hrs / night</p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 text-xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tobacco Smoking</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white mt-1">{profile.smoking}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 text-xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Alcohol Habits</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white mt-1">{profile.alcohol}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Emergency registry details */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-sm text-left space-y-4">
            <div className="flex items-center space-x-2">
              <PhoneCall className="h-5 w-5 text-brand-danger animate-pulse-slow" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Emergency SOS Contact</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl bg-red-50/40 dark:bg-red-950/10 border border-red-100 dark:border-red-950/30 space-y-2 sm:space-y-0 text-xs">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">{profile.emergencyContact.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{profile.emergencyContact.relation}</p>
              </div>
              <span className="font-bold text-brand-danger text-sm tracking-wide">
                {profile.emergencyContact.phone}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
