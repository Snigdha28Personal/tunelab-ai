"use client";

import React from "react";
import { Sparkles, Activity, Code, HelpCircle, Layers } from "lucide-react";

interface HeaderProps {
  useDemoMode: boolean;
  setUseDemoMode: (val: boolean) => void;
  onOpenAbout: () => void;
}

export function Header({ useDemoMode, setUseDemoMode, onOpenAbout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-white">
              <Layers className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">TuneLab</span>
              <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200">
                v1.0 ML Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">AI Fine-Tuning Experimentation & Decision Platform</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mode Switcher */}
          <div className="flex items-center space-x-1.5 rounded-full border border-slate-200 bg-slate-100 p-1 text-xs shadow-xs">
            <span className="flex items-center text-slate-500 pl-2 pr-1 font-medium">
              <Activity className="mr-1 h-3.5 w-3.5 text-emerald-600 animate-pulse" />
              Engine:
            </span>
            <button
              onClick={() => setUseDemoMode(true)}
              className={`rounded-full px-3 py-1 font-semibold transition-all ${
                useDemoMode
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Demo Mode
            </button>
            <button
              onClick={() => setUseDemoMode(false)}
              className={`rounded-full px-3 py-1 font-semibold transition-all ${
                !useDemoMode
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              OpenAI API
            </button>
          </div>

          {/* Portfolio & Interview Guide */}
          <button
            onClick={onOpenAbout}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50 hover:text-indigo-600 shadow-xs"
          >
            <HelpCircle className="h-4 w-4 text-indigo-600" />
            <span>About / PM Portfolio</span>
          </button>
        </div>
      </div>
    </header>
  );
}
