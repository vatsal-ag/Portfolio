import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  Pill,
  HeartPulse,
  Flame,
  Stethoscope,
  Clock,
  Lock,
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import { api } from '../services/api';
import { PrescriptionDetail } from '../types';

interface PrescriptionScannerProps {
  onScanComplete: (data: any) => void;
  seniorMode: boolean;
}

export const PrescriptionScanner: React.FC<PrescriptionScannerProps> = ({
  onScanComplete,
  seniorMode
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scanSteps = [
    { title: 'Enhancing Image Quality', detail: 'Optimizing contrast & handwriting legibility' },
    { title: 'Deciphering Cursive Handwriting', detail: 'Transcribing doctor shorthand & Rx symbols' },
    { title: 'Translating Medicine Formulations', detail: 'Explaining purpose & indications in patient language' },
    { title: 'Pharmacological Synergy Check', detail: 'Detecting protective pairings (e.g. Painkiller + Antacid)' },
    { title: 'Cross-Checking Patient Safety', detail: 'Verifying against chronic diseases (Diabetes, Ulcers, Reflux)' },
    { title: 'Generating Caretaker Schedule', detail: 'Aligning alarms with your daily breakfast & dinner habits' }
  ];

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WEBP, or scanned SVG).');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setFileName(file.name);
    setIsLoading(true);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < scanSteps.length - 1 ? prev + 1 : prev));
    }, 700);

    try {
      const result = await api.uploadPrescription(file);
      clearInterval(interval);
      setLoadingStep(scanSteps.length - 1);
      setTimeout(() => {
        setIsLoading(false);
        onScanComplete(result);
      }, 500);
    } catch (err: any) {
      clearInterval(interval);
      setIsLoading(false);
      alert('Prescription analysis error: ' + (err.message || 'Unknown error'));
    }
  };

  const handleSampleClick = async (sampleId: string) => {
    setIsLoading(true);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < scanSteps.length - 1 ? prev + 1 : prev));
    }, 600);

    try {
      const result = await api.loadSamplePrescription(sampleId);
      clearInterval(interval);
      setLoadingStep(scanSteps.length - 1);
      setTimeout(() => {
        setIsLoading(false);
        onScanComplete(result);
      }, 400);
    } catch (err: any) {
      clearInterval(interval);
      setIsLoading(false);
      alert('Failed to load sample: ' + (err.message || 'Error'));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Hero Banner with Modern Gradient */}
      <div className="text-center space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-50 to-sky-50 border border-teal-200/80 text-teal-800 text-xs font-bold shadow-sm">
          <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
          <span>Next-Gen Medical Handwriting OCR &amp; Patient Safety System</span>
        </div>
        
        <h1 className={`font-black tracking-tight text-slate-900 font-['Outfit'] ${
          seniorMode ? 'text-3xl sm:text-5xl leading-tight' : 'text-3xl sm:text-4xl lg:text-5xl'
        }`}>
          Read Doctor's Prescription &amp; <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Protect Patient Health
          </span>
        </h1>
        
        <p className={`text-slate-600 max-w-2xl mx-auto font-medium ${
          seniorMode ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
        }`}>
          Snap a photo or upload your doctor's slip. RxVision reads illegible handwriting,
          explains what each pill does, highlights why medicines were paired (like gas relievers with painkillers),
          and ensures new drugs don't clash with chronic conditions.
        </p>

        {/* Feature Pill Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Cursive Handwriting OCR
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Synergy Detection
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs">
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" /> Chronic Disease Cross-Check
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs">
            <Clock className="w-3.5 h-3.5 text-blue-500" /> Meal-Aligned Alarms
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs">
            <Lock className="w-3.5 h-3.5 text-teal-600" /> 100% HIPAA Private
          </span>
        </div>
      </div>

      {/* Main Upload Dropzone */}
      <div className={`relative bg-white rounded-3xl p-6 sm:p-10 border-2 transition-all shadow-sm ${
        isDragging 
          ? 'border-teal-500 bg-teal-50/40 ring-4 ring-teal-500/10' 
          : 'border-slate-200 hover:border-teal-400 hover:shadow-md'
      }`}>
        {!isLoading ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            className="flex flex-col items-center justify-center text-center space-y-5 cursor-pointer py-4"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />

            {/* Glowing Icon Circle */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-teal-500 to-sky-500 rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Upload className="w-10 h-10" />
              </div>
            </div>

            <div className="space-y-1.5 max-w-md">
              <p className={`font-black text-slate-900 font-['Outfit'] ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
                Drop your prescription image here
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Supports camera snapshots, photos, JPG, PNG, WEBP (Doctors' handwritten or printed slips)
              </p>
            </div>

            {/* Upload Buttons Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md hover:shadow-teal-600/25 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Camera className="w-4 h-4" />
                <span>Upload / Take Photo</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <span>Browse Files</span>
              </button>
            </div>

            {/* HIPAA Safeguard Banner */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>HIPAA Compliant: Non-clinical sensitive PII is redacted prior to OCR processing.</span>
            </div>
          </div>
        ) : (
          /* High-Fidelity Scanning Stepper */
          <div className="py-8 px-2 sm:px-6 flex flex-col items-center text-center space-y-6 max-w-xl mx-auto">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-teal-600 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                AI Reading Prescription &amp; Verifying Safety
              </h3>
              <p className="text-xs text-slate-500">
                Translating doctors' cursive notes, checking combinations &amp; calculating meal hours
              </p>
            </div>

            {/* Stepper Card */}
            <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-left">
              {scanSteps.map((step, idx) => {
                const isCompleted = idx < loadingStep;
                const isCurrent = idx === loadingStep;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      isCompleted 
                        ? 'bg-emerald-500 text-white' 
                        : isCurrent 
                        ? 'bg-teal-600 text-white animate-pulse' 
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${
                        isCurrent ? 'text-teal-900 font-extrabold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{step.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 1-Click Clinical Sample Prescriptions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-teal-600" />
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-600 font-['Outfit']">
              Try Realistic Doctor Prescriptions (1-Click Instant Demo)
            </h2>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Zero setup required</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sample 1: Knee Arthritis & Painkiller Synergy */}
          <div 
            onClick={() => handleSampleClick('sample-painkiller-synergy')}
            className="group relative bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all cursor-pointer space-y-4 overflow-hidden"
          >
            {/* Background Rx Watermark */}
            <span className="absolute -right-2 -bottom-4 text-7xl font-serif font-black text-slate-100/60 select-none group-hover:text-teal-50 transition-colors">
              ℞
            </span>

            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                    Orthopedics &amp; Joint Clinic
                  </span>
                  <span className="text-[11px] text-slate-400">15 Sep 2026</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors font-['Outfit']">
                  Knee Joint Arthritis (Painkiller + Gas Reliever Synergy)
                </h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 relative z-10">
              <strong>Prescribed:</strong> Combiflam 400mg (NSAID Painkiller) + Pantocid 40 (Antacid / Gas Reliever) + Shelcal 500 (Calcium).
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] pt-1 relative z-10">
              <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Gastric Mucosal Protection Synergy
              </span>
              <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Clashes with Grandpa's Acid Reflux
              </span>
            </div>
          </div>

          {/* Sample 2: Respiratory Infection & Probiotic Synergy */}
          <div 
            onClick={() => handleSampleClick('sample-respiratory-infection')}
            className="group relative bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all cursor-pointer space-y-4 overflow-hidden"
          >
            {/* Background Rx Watermark */}
            <span className="absolute -right-2 -bottom-4 text-7xl font-serif font-black text-slate-100/60 select-none group-hover:text-teal-50 transition-colors">
              ℞
            </span>

            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    Pulmonology &amp; Chest Care
                  </span>
                  <span className="text-[11px] text-slate-400">16 Sep 2026</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors font-['Outfit']">
                  Acute Bronchitis (Antibiotic + Gut Flora Probiotic Synergy)
                </h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 relative z-10">
              <strong>Prescribed:</strong> Augmentin 625mg (Antibacterial) + Darolac (Probiotic blend) + Montair LC (Bedtime cough relief).
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] pt-1 relative z-10">
              <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Gut Microbiome Preservation Synergy
              </span>
              <span className="inline-flex items-center gap-1 text-blue-800 font-bold bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> 2h Interval Between Antibiotic &amp; Flora
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
