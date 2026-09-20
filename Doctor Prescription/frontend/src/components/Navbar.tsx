import React, { useState } from 'react';
import { 
  FileText, 
  History, 
  Clock, 
  User, 
  ShieldCheck, 
  Sparkles, 
  Key, 
  Eye, 
  HeartHandshake,
  CheckCircle2,
  Camera
} from 'lucide-react';
import { PatientProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  seniorMode: boolean;
  setSeniorMode: (enabled: boolean) => void;
  profile: PatientProfile | null;
  onOpenProfile: () => void;
  onOpenApiKeyModal: () => void;
  onOpenMedicineVerifier: () => void;
  hasApiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  seniorMode,
  setSeniorMode,
  profile,
  onOpenProfile,
  onOpenApiKeyModal,
  onOpenMedicineVerifier,
  hasApiKey
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top emergency / patient status bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> HIPAA &amp; IT ACT 2000 COMPLIANT
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">
            Local Encrypted Health Vault
          </span>
        </div>
        <div className="flex items-center gap-4">
          {profile && (
            <button 
              onClick={onOpenProfile}
              className="text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <User className="w-3 h-3 text-teal-400" />
              <span>Patient: <strong className="text-white">{profile.full_name}</strong> ({profile.age}y)</span>
            </button>
          )}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              hasApiKey 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                : 'bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900'
            }`}
            title="Configure Gemini Vision API Key"
          >
            <Key className="w-3 h-3" />
            <span>{hasApiKey ? 'Gemini 2.5 Live OCR Active' : 'Demo Mode (Click for Gemini API)'}</span>
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('scan')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 font-['Outfit']">
                  Rx<span className="text-teal-600">Vision</span>
                </span>
                <span className="text-[10px] sm:text-xs uppercase px-2 py-0.5 rounded-full font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  AI Assistant
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">
                Doctor Handwriting OCR • Medicine Synergy • Senior Caretaker
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('scan')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'scan'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Scan Prescription
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <History className="w-4 h-4" />
              Medical History Vault
            </button>

            <button
              onClick={() => setActiveTab('caretaker')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'caretaker'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              Elderly Caretaker &amp; Alarms
            </button>

            <button
              onClick={() => setActiveTab('compliance')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'compliance'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              HIPAA &amp; Privacy Center
            </button>

            <button
              onClick={onOpenMedicineVerifier}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 transition-all border border-teal-200 shadow-sm"
              title="Verify if medicine box given by chemist is the same or safe generic substitute"
            >
              <Camera className="w-4 h-4 text-teal-600" />
              Verify Box Photo
            </button>
          </nav>

          {/* Senior Accessibility Toggle & Profile */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSeniorMode(!seniorMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                seniorMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/50 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
              title="Toggle Large Fonts & High Contrast for Senior Users"
            >
              <Eye className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Senior Mode:</span>
              <span>{seniorMode ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={onOpenProfile}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200"
              title="Manage Chronic Conditions & Daily Meds"
            >
              <User className="w-5 h-5 text-teal-600" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex overflow-x-auto py-2 border-t border-slate-100 gap-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('scan')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'scan' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Scan Prescription
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'history' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Medical Vault
          </button>
          <button
            onClick={() => setActiveTab('caretaker')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'caretaker' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Caretaker &amp; Alarms
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'compliance' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            HIPAA Center
          </button>
        </div>
      </div>
    </header>
  );
};
