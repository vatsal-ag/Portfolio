import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  Calendar, 
  User, 
  Building2, 
  Stethoscope, 
  Pill, 
  Sparkles, 
  Clock, 
  ArrowLeft, 
  Eye, 
  Bell, 
  BookOpen,
  ExternalLink,
  HeartHandshake,
  Camera,
  FileCheck,
  Shield,
  KeyRound,
  ChevronDown,
  ChevronUp,
  Heart,
  HelpCircle,
  Award
} from 'lucide-react';
import { PrescriptionDetail, PrescriptionMedicine, InteractionRecord } from '../types';
import { api } from '../services/api';

interface PrescriptionResultViewProps {
  data: PrescriptionDetail;
  onBack: () => void;
  onGoToCaretaker: () => void;
  onVerifyMedicineBox: (medicine: PrescriptionMedicine) => void;
  seniorMode: boolean;
}

export const PrescriptionResultView: React.FC<PrescriptionResultViewProps> = ({
  data,
  onBack,
  onGoToCaretaker,
  onVerifyMedicineBox,
  seniorMode
}) => {
  const [showOriginalScan, setShowOriginalScan] = useState(false);
  const [expandedProof, setExpandedProof] = useState<{ [medIndex: number]: boolean }>({});
  const [nomineePin, setNomineePin] = useState('');
  const [nomineeNotes, setNomineeNotes] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [pinError, setPinError] = useState('');
  const [prescriptionState, setPrescriptionState] = useState(data.prescription);

  const { medicines, interactions } = data;
  const prescription = prescriptionState;

  const synergies = interactions.filter(i => i.severity === 'SYNERGY');
  const criticalWarnings = interactions.filter(i => i.severity === 'CRITICAL');
  const moderateWarnings = interactions.filter(i => i.severity === 'MODERATE');

  const toggleProof = (index: number) => {
    setExpandedProof(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleNomineeUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUnlocking(true);
    setPinError('');
    try {
      const res = await api.reviewByNominee(prescription.id, nomineePin, nomineeNotes || 'Authorized by Nominee');
      setPrescriptionState(res.prescription);
    } catch (err: any) {
      setPinError(err.message || 'Incorrect Nominee PIN. Please verify.');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handlePatientGentleConsent = async () => {
    setIsUnlocking(true);
    try {
      const res = await api.patientConsentView(prescription.id);
      setPrescriptionState(res.prescription);
    } catch (err: any) {
      alert('Error updating view: ' + err.message);
    } finally {
      setIsUnlocking(false);
    }
  };

  const isSensitiveLocked = prescription.is_severe_diagnosis && prescription.nominee_review_required && !prescription.nominee_reviewed;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 text-sm font-bold shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Scan Another Prescription</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {prescription.image_filename && (
            <button
              onClick={() => setShowOriginalScan(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 text-sm font-bold shadow-xs transition-colors"
            >
              <Eye className="w-4 h-4 text-teal-600" />
              <span>Original Doctor Slip</span>
            </button>
          )}

          <button
            onClick={onGoToCaretaker}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white bg-teal-600 hover:bg-teal-700 text-sm font-bold shadow-md hover:shadow-teal-600/20 transition-all"
          >
            <Bell className="w-4 h-4" />
            <span>Set Meal-Aligned Alarms</span>
          </button>
        </div>
      </div>

      {/* COMPASSIONATE CARE & MENTAL HEALTH SHIELD (For Severe / Oncology Diagnoses) */}
      {isSensitiveLocked ? (
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-indigo-700/50 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 inline-block">
                Compassionate Care Protocol Active
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit']">
                Gentle Health Briefing &amp; Nominee Support Shield
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Medical news can feel overwhelming. To protect the patient's emotional wellbeing and peace of mind, your treating physician and Curafy AI recommend that your primary designated caregiver or nominee reviews this clinical report first.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            {/* Nominee Unlock Form */}
            <form onSubmit={handleNomineeUnlock} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Designated Nominee / Caregiver Unlock</span>
              </div>
              <p className="text-xs text-slate-300">
                Enter your 4-digit Caregiver PIN (default is <strong className="text-amber-300">1234</strong>) to review full clinical findings first:
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  maxLength={6}
                  placeholder="Nominee PIN (e.g. 1234)"
                  value={nomineePin}
                  onChange={(e) => setNomineePin(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-slate-900/80 border border-white/20 text-white placeholder-slate-400 text-sm font-mono tracking-widest text-center"
                  required
                />
                <button
                  type="submit"
                  disabled={isUnlocking}
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-colors shrink-0"
                >
                  {isUnlocking ? 'Verifying...' : 'Unlock Full Review'}
                </button>
              </div>
              {pinError && <p className="text-xs text-rose-300 font-semibold">{pinError}</p>}
            </form>

            {/* Patient Gentle Disclosure Option */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Patient Direct Gentle Disclosure</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  If you are the patient and feel emotionally prepared to read your care plan with gentle, reassuring clinical explanations, you can proceed directly.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePatientGentleConsent}
                disabled={isUnlocking}
                className="w-full py-2.5 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors border border-white/30"
              >
                I Feel Prepared — Proceed with Gentle Care View
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* COMPASSIONATE SUMMARY BANNER (When unlocked for sensitive cases) */}
      {!isSensitiveLocked && prescription.compassionate_summary && (
        <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-50 rounded-3xl p-6 sm:p-7 border-2 border-teal-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-teal-950 font-['Outfit']">
                Gentle Patient Guidance &amp; Treatment Outline
              </h3>
              <p className="text-xs text-teal-700 font-medium">Framed with care, emotional reassurance, and clear medical next-steps</p>
            </div>
          </div>
          <p className={`text-slate-800 font-medium leading-relaxed ${seniorMode ? 'text-base sm:text-lg' : 'text-sm'}`}>
            {prescription.compassionate_summary}
          </p>
          {prescription.nominee_reviewed && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-3 py-1.5 rounded-xl border border-emerald-200 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Reviewed &amp; supported by designated caregiver/nominee</span>
            </div>
          )}
        </div>
      )}

      {/* Prescription Clinical Header Banner */}
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 overflow-hidden">
        {/* Subtle decorative watermark */}
        <span className="absolute right-6 top-4 text-8xl font-serif font-black text-slate-100/70 select-none pointer-events-none">
          ℞
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5" /> Digitized Health Record
              </span>
              <span className="text-xs font-mono text-slate-400">#RX-{prescription.id}</span>
            </div>
            <h1 className={`font-black text-slate-900 font-['Outfit'] ${
              seniorMode ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl'
            }`}>
              {isSensitiveLocked ? 'Treatment Care Protocol' : (prescription.title || prescription.diagnosis)}
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Prescription Date: <strong>{prescription.prescription_date || 'Dated upon scan'}</strong></span>
          </div>
        </div>

        {/* Doctor & Clinic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="w-11 h-11 rounded-2xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Doctor</p>
              <p className="text-sm font-bold text-slate-900 truncate">{prescription.doctor_name || 'Physician'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Hospital / Clinic</p>
              <p className="text-sm font-bold text-slate-900 truncate">{prescription.clinic_or_hospital || 'Medical Center'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="w-11 h-11 rounded-2xl bg-teal-100/80 text-teal-700 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Diagnosis</p>
              <p className="text-sm font-bold text-slate-900 truncate">
                {isSensitiveLocked ? 'Restricted Pending Nominee Review' : (prescription.diagnosis || 'Clinical Consultation')}
              </p>
            </div>
          </div>
        </div>

        {prescription.notes && (
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100/80 text-xs sm:text-sm text-teal-950 font-medium">
            <span className="font-bold text-teal-800">Doctor's Clinical Directive:</span> {prescription.notes}
          </div>
        )}
      </div>

      {/* SYNERGY HIGHLIGHTS */}
      {synergies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-black text-slate-900 font-['Outfit']">
              Why These Medicines Were Prescribed Together (Synergy Detected)
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {synergies.map((syn, idx) => (
              <div 
                key={idx}
                className="relative bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-50 rounded-3xl p-6 sm:p-7 border-2 border-emerald-300 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-black shrink-0">
                      ✓
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-emerald-950 font-['Outfit']">
                      {syn.title}
                    </h3>
                  </div>

                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-200/80 text-emerald-900 shrink-0 self-start sm:self-auto">
                    {syn.medicines_involved}
                  </span>
                </div>

                <p className={`text-emerald-950 font-medium leading-relaxed ${seniorMode ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                  {syn.explanation}
                </p>

                <div className="flex items-start gap-2.5 p-3.5 bg-white/90 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-emerald-900 font-semibold shadow-2xs">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{syn.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HEALTH SAFETY & CONTRAINDICATION WARNINGS */}
      {(criticalWarnings.length > 0 || moderateWarnings.length > 0) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-black text-slate-900 font-['Outfit']">
              Safety Alerts: Cross-Check with Your Chronic Conditions &amp; Daily Medicines
            </h2>
          </div>

          <div className="space-y-3">
            {/* Critical Warnings */}
            {criticalWarnings.map((warn, idx) => (
              <div 
                key={`crit-${idx}`}
                className="bg-rose-50/90 rounded-3xl p-6 sm:p-7 border-2 border-rose-300 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                      <AlertOctagon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-rose-950 font-['Outfit']">
                      {warn.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-rose-200 text-rose-900 uppercase tracking-wider shrink-0 self-start sm:self-auto">
                    Critical Safety Alert
                  </span>
                </div>

                <p className={`text-rose-950 font-medium leading-relaxed ${seniorMode ? 'text-base sm:text-lg' : 'text-sm'}`}>
                  {warn.explanation}
                </p>

                <div className="p-3.5 bg-white/90 rounded-2xl border border-rose-200 text-xs sm:text-sm text-rose-950 font-semibold">
                  <strong className="text-rose-700">Patient Action:</strong> {warn.recommendation}
                </div>
              </div>
            ))}

            {/* Moderate Warnings */}
            {moderateWarnings.map((warn, idx) => (
              <div 
                key={`mod-${idx}`}
                className="bg-amber-50/90 rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-amber-950 font-['Outfit']">
                      {warn.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-amber-200 text-amber-900 uppercase tracking-wider shrink-0 self-start sm:self-auto">
                    {warn.interaction_type === 'HIGH_POTENCY_WARNING' ? 'Potency Guidance' : 'Moderate Caution'}
                  </span>
                </div>

                <p className={`text-amber-950 font-medium ${seniorMode ? 'text-base' : 'text-sm'}`}>
                  {warn.explanation}
                </p>

                <div className="p-3.5 bg-white/90 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-950 font-semibold">
                  <strong className="text-amber-700">Advice:</strong> {warn.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DECODED MEDICINES LIST WITH PROOF ARTICLES & LIGHTER ALTERNATIVES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-black text-slate-900 font-['Outfit']">
              Decoded Medicines &amp; Patient Instructions ({medicines.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Evidence-Backed Clinical Translations</span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {medicines.map((med, index) => {
            const hasProof = med.proof_articles && med.proof_articles.length > 0;
            const isProofOpen = expandedProof[index];

            return (
              <div 
                key={index}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md transition-all space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 text-xs font-black flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h3 className={`font-black text-slate-900 font-['Outfit'] ${
                        seniorMode ? 'text-2xl' : 'text-xl'
                      }`}>
                        {med.brand_name}
                      </h3>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {med.category}
                      </span>
                      {med.is_controlled_or_high_power && (
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          {med.potency_level || 'High Potency'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Active Formulation: <strong className="text-slate-700">{med.generic_name}</strong>
                    </p>
                  </div>

                  {/* Frequency & Dosage Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-extrabold shrink-0">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>{med.frequency}</span>
                  </div>
                </div>

                {/* Patient Purpose Box */}
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100/90 space-y-1">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    What This Medicine Is Used For:
                  </p>
                  <p className={`text-slate-800 font-medium ${seniorMode ? 'text-base sm:text-lg' : 'text-sm'}`}>
                    {med.purpose}
                  </p>
                </div>

                {/* HIGH-POWER / CONTROLLED MEDICINE: LIGHTER ALTERNATIVE RECOMMENDATION */}
                {med.is_controlled_or_high_power && med.lighter_alternative_name && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 space-y-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-amber-950">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Controlled / High-Power Drug Notice &amp; Recommended Lighter Step-Down</span>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      {med.potency_explanation}
                    </p>
                    <div className="mt-2 p-3 bg-white/95 rounded-xl border border-amber-200 text-xs space-y-1">
                      <span className="font-extrabold text-slate-900 block">
                        🌱 Suggested Lighter Option to Discuss with Doctor: <span className="text-teal-700">{med.lighter_alternative_name}</span>
                      </span>
                      <p className="text-slate-600 italic">
                        <strong>Clinical Rationale:</strong> {med.lighter_alternative_rationale}
                      </p>
                    </div>
                  </div>
                )}

                {/* Instructions & Timing Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-medium block text-[11px]">Dosage Strength</span>
                    <span className="font-bold text-slate-900">{med.dosage}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-medium block text-[11px]">Course Duration</span>
                    <span className="font-bold text-slate-900">{med.duration}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-medium block text-[11px]">Instructions</span>
                    <span className="font-bold text-slate-900">{med.instructions}</span>
                  </div>
                </div>

                {med.synergy_role && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Synergy Pairing:</strong> {med.synergy_role}</span>
                  </div>
                )}

                {/* MEDICAL PROOF & PEER-REVIEWED ARTICLES (PubMed / Cochrane) */}
                {hasProof && (
                  <div className="pt-2">
                    <button
                      onClick={() => toggleProof(index)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-950 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-600" />
                        <span>Medicine Proof Articles &amp; Clinical Trials ({med.proof_articles?.length})</span>
                      </div>
                      <div className="flex items-center gap-1 text-indigo-700">
                        <span>{isProofOpen ? 'Hide Evidence' : 'View PubMed Evidence'}</span>
                        {isProofOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isProofOpen && (
                      <div className="mt-3 space-y-2.5">
                        {med.proof_articles?.map((art, aIdx) => (
                          <div 
                            key={aIdx} 
                            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                              <span className="font-bold text-slate-900 text-xs leading-snug">
                                {art.title}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase shrink-0 self-start">
                                {art.evidence_grade}
                              </span>
                            </div>

                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              <strong className="text-slate-700">Key Finding:</strong> {art.key_finding}
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                              <span>Published in <strong className="text-slate-700">{art.journal} ({art.year})</strong></span>
                              <a
                                href={art.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-teal-700 font-bold hover:underline"
                              >
                                <span>PubMed PMID: {art.pmid}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Physical Medicine Box Substitute Verification Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">
                    Got an alternate brand or strip from chemist?
                  </div>
                  <button
                    onClick={() => onVerifyMedicineBox(med)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 text-xs font-bold transition-all border border-slate-200/80 shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-teal-600" />
                    <span>Verify Medicine Box / Substitute Photo</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Step CTA */}
      <div className="bg-gradient-to-r from-teal-700 via-sky-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-black font-['Outfit'] flex items-center justify-center sm:justify-start gap-2">
            <HeartHandshake className="w-5 h-5 text-teal-300" />
            Elderly Caretaker Feature Active
          </h3>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            We've automatically aligned these medicines with Grandpa's daily breakfast, lunch, and dinner routine.
            Enable smart alarms so no dose is ever missed!
          </p>
        </div>

        <button
          onClick={onGoToCaretaker}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-teal-900 hover:bg-teal-50 font-black text-sm shadow-md transition-all shrink-0 hover:scale-105"
        >
          <span>Open Caretaker Alarms</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>

      {/* Original Prescription Slip Modal */}
      {showOriginalScan && prescription.image_filename && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm">
                Original Scanned Prescription Slip ({prescription.prescription_date})
              </h4>
              <button
                onClick={() => setShowOriginalScan(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold px-2 py-1"
              >
                Close ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex items-center justify-center bg-slate-100">
              <img
                src={`/uploads/${prescription.image_filename}`}
                alt="Original Prescription"
                className="max-h-[70vh] rounded-xl shadow border border-slate-300 object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
