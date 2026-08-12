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
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-slate-950">
              <Layers className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-extrabold tracking-tight text-white">TuneLab</span>
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                v1.0 ML Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400">AI Fine-Tuning Experimentation & Decision Platform</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mode Switcher */}
          <div className="flex items-center space-x-2 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1 text-xs">
            <span className="flex items-center text-slate-400">
              <Activity className="mr-1.5 h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              Engine:
            </span>
            <button
              onClick={() => setUseDemoMode(true)}
              className={`rounded-full px-2.5 py-0.5 font-medium transition-all ${
                useDemoMode
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Demo Mode
            </button>
            <button
              onClick={() => setUseDemoMode(false)}
              className={`rounded-full px-2.5 py-0.5 font-medium transition-all ${
                !useDemoMode
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              OpenAI API
            </button>
          </div>

          {/* Portfolio & Interview Guide */}
          <button
            onClick={onOpenAbout}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-700 hover:text-white shadow-sm"
          >
            <HelpCircle className="h-4 w-4 text-indigo-400" />
            <span>About / PM Portfolio Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
}
