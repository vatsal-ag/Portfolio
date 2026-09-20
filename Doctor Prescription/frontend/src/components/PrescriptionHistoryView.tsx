import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Calendar, 
  User, 
  Building2, 
  Stethoscope, 
  Pill, 
  Trash2, 
  Eye, 
  ArrowRight, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { PrescriptionDetail } from '../types';

interface PrescriptionHistoryViewProps {
  onSelectPrescription: (data: PrescriptionDetail) => void;
  seniorMode: boolean;
}

export const PrescriptionHistoryView: React.FC<PrescriptionHistoryViewProps> = ({
  onSelectPrescription,
  seniorMode
}) => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionDetail[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadPrescriptions = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPrescriptions(search);
      setPrescriptions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, [search]);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Permanently delete this prescription and all associated records per HIPAA Right to Erasure?')) {
      return;
    }
    try {
      await api.deletePrescription(id);
      loadPrescriptions();
    } catch (err: any) {
      alert('Delete error: ' + err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`font-black text-slate-900 font-['Outfit'] ${
            seniorMode ? 'text-3xl' : 'text-2xl sm:text-3xl'
          }`}>
            Medical History &amp; Prescription Vault
          </h1>
          <p className="text-sm text-slate-500">
            All your scanned doctor prescriptions are dated, decoded, and archived here so you never need to carry physical files.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search doctor, date, disease..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-teal-500 shadow-sm"
          />
        </div>
      </div>

      {/* Prescription Cards Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400">Loading prescription archives...</div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No Prescriptions Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {search ? 'No prescriptions match your search query.' : 'Scan a new doctor prescription or load a sample test to start building your digital health history!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prescriptions.map(({ prescription, medicines, interactions }) => (
            <div
              key={prescription.id}
              onClick={() => onSelectPrescription({ prescription, medicines, interactions })}
              className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer space-y-4 relative"
            >
              {/* Header with Date Badge */}
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                  <Calendar className="w-3.5 h-3.5" />
                  {prescription.prescription_date || 'Undated'}
                </span>

                <button
                  onClick={(e) => handleDelete(prescription.id, e)}
                  className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="HIPAA Secure Purge (Right to be Forgotten)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Doctor */}
              <div className="space-y-1">
                <h3 className={`font-black text-slate-900 group-hover:text-teal-700 transition-colors font-['Outfit'] ${
                  seniorMode ? 'text-xl' : 'text-lg'
                }`}>
                  {prescription.title || prescription.diagnosis}
                </h3>
                <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {prescription.doctor_name} • {prescription.clinic_or_hospital}
                </p>
              </div>

              {/* Medicines Pills */}
              <div className="flex flex-wrap gap-1.5">
                {medicines.map((m, idx) => (
                  <span 
                    key={idx}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200"
                  >
                    {m.brand_name} ({m.dosage})
                  </span>
                ))}
              </div>

              {/* Interactions Summary */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  {interactions.some(i => i.severity === 'SYNERGY') && (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      ✓ Synergy Active
                    </span>
                  )}
                  {interactions.some(i => i.severity === 'CRITICAL') && (
                    <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded">
                      ⚠ Contraindication Flagged
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 text-teal-600 font-bold group-hover:translate-x-1 transition-transform">
                  View Decoded File <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
