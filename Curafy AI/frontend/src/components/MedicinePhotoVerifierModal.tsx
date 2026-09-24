import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Pill, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { PrescriptionMedicine } from '../types';

interface MedicinePhotoVerifierModalProps {
  initialMedicine?: PrescriptionMedicine | null;
  onClose: () => void;
  seniorMode: boolean;
}

export const MedicinePhotoVerifierModal: React.FC<MedicinePhotoVerifierModalProps> = ({
  initialMedicine,
  onClose,
  seniorMode
}) => {
  const [prescribedBrand, setPrescribedBrand] = useState(initialMedicine?.brand_name || 'Pantocid 40');
  const [prescribedGeneric, setPrescribedGeneric] = useState(initialMedicine?.generic_name || 'Pantoprazole Sodium 40mg');
  const [prescribedDosage, setPrescribedDosage] = useState(initialMedicine?.dosage || '40mg');
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setImagePreview(URL.createObjectURL(file));
    setIsVerifying(true);
    setResult(null);

    try {
      const data = await api.verifyMedicinePhoto(file, {
        brand_name: prescribedBrand,
        generic_name: prescribedGeneric,
        dosage: prescribedDosage
      });
      setResult(data);
    } catch (e: any) {
      alert('Verification error: ' + e.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSampleTest = async (sampleId: string) => {
    setIsVerifying(true);
    setResult(null);

    try {
      const data = await api.getSampleMedicineVerification(sampleId);
      setPrescribedBrand(data.prescribed.brand_name);
      setPrescribedGeneric(data.prescribed.generic_name);
      setPrescribedDosage(data.prescribed.dosage);
      setImagePreview(`/uploads/${data.box_image}`);
      setResult(data);
    } catch (e: any) {
      alert('Error loading sample: ' + e.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const isGenericEquivalent = result?.verification?.match_status === 'GENERIC_EQUIVALENT';
  const isExactMatch = result?.verification?.match_status === 'EXACT_MATCH';
  const isWrongMedicine = result?.verification?.match_status === 'DIFFERENT_MEDICINE';
  const isDosageMismatch = result?.verification?.match_status === 'DOSAGE_MISMATCH';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg font-['Outfit']">
                Medicine Packaging &amp; Substitute Verifier
              </h3>
              <p className="text-xs text-slate-500">
                Did the pharmacy give you a different brand? Snap a photo to verify if it is safe!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prescribed Reference Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block">
            Comparing against prescribed medicine:
          </span>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-black text-slate-900 text-base">{prescribedBrand}</span>
              <span className="text-slate-600 text-xs ml-2">({prescribedGeneric})</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-teal-700">
              Dosage: {prescribedDosage}
            </span>
          </div>
        </div>

        {/* Upload or Camera Zone */}
        {!result && !isVerifying && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors space-y-3 bg-slate-50/50"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Upload or take photo of the physical medicine box/strip
              </p>
              <p className="text-xs text-slate-500">
                Our AI will read the pharmaceutical formula and strength on the packaging
              </p>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isVerifying && (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-800">
              Inspecting Packaging Photo &amp; Active Ingredients...
            </p>
            <p className="text-xs text-slate-400">
              Comparing chemical formula, salt equivalence, and dosage strength
            </p>
          </div>
        )}

        {/* Verification Result Display */}
        {result && (
          <div className="space-y-4 animate-fade-in">
            {/* Packaging Image & Match Verdict */}
            {imagePreview && (
              <div className="flex justify-center bg-slate-100 p-3 rounded-2xl border border-slate-200">
                <img
                  src={imagePreview}
                  alt="Medicine Packaging"
                  className="max-h-48 rounded-xl object-contain shadow-sm"
                />
              </div>
            )}

            {/* Verdict Card */}
            <div className={`p-5 rounded-2xl border-2 space-y-2 ${
              isGenericEquivalent
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : isExactMatch
                ? 'bg-teal-50 border-teal-300 text-teal-950'
                : isWrongMedicine
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              <div className="flex items-center gap-2">
                {isGenericEquivalent || isExactMatch ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : isWrongMedicine ? (
                  <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                )}

                <h4 className="text-base sm:text-lg font-black font-['Outfit']">
                  {result.verification.verdict_title}
                </h4>

                <span className={`ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  result.verification.is_safe_substitute
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-rose-200 text-rose-900'
                }`}>
                  {result.verification.is_safe_substitute ? 'SAFE TO TAKE' : 'DO NOT TAKE'}
                </span>
              </div>

              <p className={`font-medium ${seniorMode ? 'text-base' : 'text-sm'}`}>
                {result.verification.patient_explanation}
              </p>

              <div className="pt-2 border-t border-black/10 text-xs font-semibold flex items-start gap-1.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Pharmacist Directive: {result.verification.pharmacist_advice}</span>
              </div>
            </div>

            {/* Chemical Details Side-by-Side Comparison */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Doctor Prescribed</span>
                <p className="font-bold text-slate-800">{prescribedBrand}</p>
                <p className="text-slate-500">{prescribedGeneric}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Identified in Photo</span>
                <p className="font-bold text-slate-800">{result.verification.detected_brand_name}</p>
                <p className="text-slate-500">{result.verification.detected_generic_name} ({result.verification.detected_dosage})</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setResult(null);
                  setImagePreview(null);
                }}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 underline"
              >
                Scan Another Medicine Box
              </button>
            </div>
          </div>
        )}

        {/* 1-Click Demo Samples */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">
            Instant Demo: Test Packaging Verification
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleSampleTest('sample-pan40-substitute')}
              className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-left transition-colors"
            >
              <span className="text-xs font-bold text-emerald-950 block">Pan 40 (Substitute)</span>
              <span className="text-[10px] text-emerald-700">Identical salt for Pantocid 40</span>
            </button>

            <button
              onClick={() => handleSampleTest('sample-combiflam-exact')}
              className="p-2.5 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-100 text-left transition-colors"
            >
              <span className="text-xs font-bold text-teal-950 block">Combiflam Box</span>
              <span className="text-[10px] text-teal-700">Exact match confirmation</span>
            </button>

            <button
              onClick={() => handleSampleTest('sample-wrong-medicine')}
              className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-left transition-colors"
            >
              <span className="text-xs font-bold text-rose-950 block">Cetirizine (Mismatch)</span>
              <span className="text-[10px] text-rose-700">Wrong medicine alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
