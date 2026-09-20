import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  HeartPulse, 
  Pill, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { api } from '../services/api';
import { PatientProfile, OngoingMedication } from '../types';

interface PatientProfileModalProps {
  onClose: () => void;
  onProfileUpdated: (profile: PatientProfile) => void;
}

const COMMON_CONDITIONS = [
  'Type 2 Diabetes',
  'Chronic Acid Reflux (GERD)',
  'Hypertension',
  'Mild Knee Osteoarthritis',
  'Peptic Ulcer Disease',
  'Chronic Kidney Disease',
  'Asthma / Wheezing'
];

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  onClose,
  onProfileUpdated
}) => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [ongoingMeds, setOngoingMeds] = useState<OngoingMedication[]>([]);
  const [newCondition, setNewCondition] = useState('');
  const [newMedName, setNewMedName] = useState('');
  const [newMedGeneric, setNewMedGeneric] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedPurpose, setNewMedPurpose] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [p, m] = await Promise.all([api.getProfile(), api.getOngoingMedications()]);
      setProfile(p);
      setOngoingMeds(m);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleCondition = (condition: string) => {
    if (!profile) return;
    const exists = profile.chronic_conditions.includes(condition);
    const updatedConditions = exists
      ? profile.chronic_conditions.filter(c => c !== condition)
      : [...profile.chronic_conditions, condition];

    const newProfile = { ...profile, chronic_conditions: updatedConditions };
    setProfile(newProfile);
  };

  const handleAddCustomCondition = () => {
    if (!newCondition.trim() || !profile) return;
    if (!profile.chronic_conditions.includes(newCondition.trim())) {
      setProfile({
        ...profile,
        chronic_conditions: [...profile.chronic_conditions, newCondition.trim()]
      });
    }
    setNewCondition('');
  };

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    try {
      const added = await api.addOngoingMedication({
        name: newMedName.trim(),
        generic_name: newMedGeneric.trim() || newMedName.trim(),
        dosage: newMedDosage.trim() || 'Daily',
        purpose: newMedPurpose.trim() || 'Long-term health control'
      });
      setOngoingMeds([...ongoingMeds, added]);
      setNewMedName('');
      setNewMedGeneric('');
      setNewMedDosage('');
      setNewMedPurpose('');
    } catch (err: any) {
      alert('Error adding medication: ' + err.message);
    }
  };

  const handleDeleteMedication = async (id: number) => {
    try {
      await api.deleteOngoingMedication(id);
      setOngoingMeds(ongoingMeds.filter(m => m.id !== id));
    } catch (err: any) {
      alert('Error deleting medication: ' + err.message);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const saved = await api.updateProfile(profile);
      onProfileUpdated(saved);
      onClose();
    } catch (err: any) {
      alert('Error saving profile: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-lg font-['Outfit']">
              Patient Health Profile &amp; Interaction Safety Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Basic Demographic */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600">Patient Full Name</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full mt-1 p-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Age</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                className="w-full mt-1 p-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Emergency Phone</label>
              <input
                type="text"
                value={profile.emergency_contact_phone}
                onChange={(e) => setProfile({ ...profile, emergency_contact_phone: e.target.value })}
                className="w-full mt-1 p-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800"
              />
            </div>
          </div>

          {/* Chronic Conditions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                Long-Term / Chronic Health Conditions
              </label>
              <span className="text-[11px] text-slate-400">Used for automatic drug safety checks</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {COMMON_CONDITIONS.map((cond) => {
                const isSelected = profile.chronic_conditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => handleToggleCondition(cond)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    {cond}
                  </button>
                );
              })}
            </div>

            {/* Custom condition input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add another long-term problem (e.g. Fatty Liver)..."
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomCondition(); } }}
                className="flex-1 p-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
              <button
                type="button"
                onClick={handleAddCustomCondition}
                className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900"
              >
                Add
              </button>
            </div>
          </div>

          {/* Ongoing Daily Medications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-teal-600" />
                Daily Ongoing Medications ({ongoingMeds.length})
              </label>
              <span className="text-[11px] text-slate-400">Cross-referenced against new prescriptions</span>
            </div>

            <div className="space-y-2">
              {ongoingMeds.map((med) => (
                <div 
                  key={med.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800 text-sm">{med.name}</span>
                    <span className="text-slate-500 ml-2">({med.dosage})</span>
                    <p className="text-slate-500 text-[11px]">{med.purpose}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteMedication(med.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new ongoing medication form */}
            <form onSubmit={handleAddMedication} className="p-3.5 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-2">
              <span className="text-xs font-bold text-teal-900 block">Add Daily Medicine:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Medicine Name (e.g., Metformin)"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="p-2 rounded-xl border border-teal-200 bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g., 500mg BD)"
                  value={newMedDosage}
                  onChange={(e) => setNewMedDosage(e.target.value)}
                  className="p-2 rounded-xl border border-teal-200 bg-white"
                />
                <input
                  type="text"
                  placeholder="Purpose (e.g., Diabetes control)"
                  value={newMedPurpose}
                  onChange={(e) => setNewMedPurpose(e.target.value)}
                  className="p-2 rounded-xl border border-teal-200 bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs"
              >
                + Add Ongoing Medicine
              </button>
            </form>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Encrypted locally in patient device database under HIPAA 45 CFR § 164.312.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow"
          >
            {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
