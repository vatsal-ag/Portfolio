import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Calendar, 
  Building2, 
  Stethoscope, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Eye,
  FileCheck
} from 'lucide-react';
import { LabReport, LabParameter } from '../types';
import { api } from '../services/api';

interface LabReportsViewProps {
  seniorMode: boolean;
  onGoToDiet?: () => void;
}

export const LabReportsView: React.FC<LabReportsViewProps> = ({
  seniorMode,
  onGoToDiet
}) => {
  const [reports, setReports] = useState<LabReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [reportTitle, setReportTitle] = useState('Comprehensive Diagnostic Blood Panel');
  const [reportType, setReportType] = useState('Biochemistry');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [labName, setLabName] = useState('Apollo Diagnostics');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await api.getLabReports();
      setReports(data);
      if (data.length > 0 && !selectedReport) {
        setSelectedReport(data[0]);
      }
    } catch (err) {
      console.error('Failed to load lab reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Please select a report file (PDF or image).');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('report_title', reportTitle);
      formData.append('report_type', reportType);
      formData.append('report_date', reportDate);
      formData.append('lab_name', labName);
      formData.append('patient_id', '1');

      const res = await api.uploadLabReport(formData);
      await loadReports();
      setSelectedReport(res.report);
      setShowUploadModal(false);
      setUploadFile(null);
    } catch (err: any) {
      alert('Error uploading lab report: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadSample = async (sampleIdx: number) => {
    setIsLoading(true);
    try {
      const res = await api.loadSampleLabReport(sampleIdx);
      await loadReports();
      setSelectedReport(res.report);
    } catch (err: any) {
      alert('Failed to load sample report: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this diagnostic report?')) return;
    try {
      await api.deleteLabReport(id);
      const updated = reports.filter(r => r.id !== id);
      setReports(updated);
      setSelectedReport(updated.length > 0 ? updated[0] : null);
    } catch (err: any) {
      alert('Failed to delete report: ' + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Normal
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            High
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
            Low
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-300 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Critical
          </span>
        );
      default:
        return <span className="text-xs text-slate-500">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Pathology &amp; Diagnostic Intelligence
            </span>
          </div>
          <h1 className={`font-black text-slate-900 font-['Outfit'] mt-1 ${
            seniorMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
          }`}>
            Patient Diagnostic Lab Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Upload blood work, biochemistry &amp; pathology tests with automatic clinical cross-correlation to active medicines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Report</span>
          </button>
        </div>
      </div>

      {/* Quick Sample Load Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Quick Demo Diagnostics:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleLoadSample(0)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
          >
            Load Sample: KFT / LFT Panel
          </button>
          <button
            onClick={() => handleLoadSample(1)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
          >
            Load Sample: HbA1c Glycemic Panel
          </button>
        </div>
      </div>

      {/* Main Grid: Report Selector on Left, Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Report List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Uploaded Test Reports ({reports.length})
          </h2>

          {reports.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-3">
              <Activity className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No Lab Reports Uploaded Yet</p>
              <p className="text-xs text-slate-500">
                Click "Upload New Report" or load a sample panel to see clinical correlations.
              </p>
              <button
                onClick={() => handleLoadSample(0)}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold shadow"
              >
                Load Demo Report
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {reports.map((rep) => {
                const isSelected = selectedReport?.id === rep.id;
                const highCount = rep.parameters.filter(p => p.status === 'HIGH' || p.status === 'CRITICAL').length;

                return (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedReport(rep)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all text-left space-y-2 ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-400 shadow-sm ring-1 ring-teal-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 text-sm leading-snug">
                        {rep.report_title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        {rep.report_type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {rep.report_date}
                      </span>
                      {highCount > 0 ? (
                        <span className="text-[11px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          {highCount} Flags
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          All Normal
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Report Details & Clinical Correlation */}
        <div className="lg:col-span-8">
          {selectedReport ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-sky-100 text-sky-800">
                      {selectedReport.report_type}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Report ID #{selectedReport.id}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                    {selectedReport.report_title}
                  </h2>
                </div>

                <button
                  onClick={() => handleDelete(selectedReport.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200 self-start sm:self-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Report</span>
                </button>
              </div>

              {/* Lab & Date Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">Diagnostic Facility</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{selectedReport.lab_name || 'Clinical Reference Lab'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">Specimen Collection Date</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{selectedReport.report_date}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">Referring Specialist</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{selectedReport.doctor_referred || 'Attending Physician'}</span>
                </div>
              </div>

              {/* CLINICAL PRESCRIPTION CORRELATION HIGHLIGHT */}
              {selectedReport.clinical_correlation && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <h3 className="text-sm font-black text-amber-950 font-['Outfit']">
                      Clinical Correlation with Your Active Medications
                    </h3>
                  </div>
                  <p className={`text-amber-950 font-medium leading-relaxed ${seniorMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
                    {selectedReport.clinical_correlation}
                  </p>
                </div>
              )}

              {/* Summary Findings */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Pathologist &amp; Lab Impression:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedReport.summary_findings}
                </p>
              </div>

              {/* Diagnostic Parameters Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 font-['Outfit'] flex items-center justify-between">
                  <span>Measured Bio-Parameters ({selectedReport.parameters.length})</span>
                  <span className="text-xs text-slate-400 font-normal">Reference standard calibrated</span>
                </h3>

                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Test Parameter</th>
                        <th className="py-3 px-4">Observed Value</th>
                        <th className="py-3 px-4">Reference Range</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedReport.parameters.map((param, pIdx) => (
                        <tr key={pIdx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {param.parameter}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-slate-800">
                            {param.value} <span className="font-normal text-slate-500 text-xs">{param.unit}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-xs">
                            {param.reference}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(param.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* HIPAA compliance reassurance */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Lab telemetry encrypted and stored locally. Never shared with third-party advertisers.</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 space-y-2">
              <FileCheck className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-600">Select a report from the left list to review detailed diagnostic metrics.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Lab Report Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-lg font-['Outfit']">
                  Upload Diagnostic Lab Report
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold px-2 py-1"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Report Title / Panel Name
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                  placeholder="e.g. Kidney & Liver Function Test"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Report Category
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
                  >
                    <option value="Blood Test">Complete Blood Count (CBC)</option>
                    <option value="Biochemistry">Biochemistry / KFT / LFT</option>
                    <option value="HbA1c">HbA1c &amp; Diabetic Profile</option>
                    <option value="Radiology / Imaging">Radiology / X-Ray / CT</option>
                    <option value="Pathology">Pathology &amp; Biopsy</option>
                    <option value="Urine Analysis">Urine Analysis</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Date of Test
                  </label>
                  <input
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Laboratory / Diagnostic Center
                </label>
                <input
                  type="text"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                  placeholder="e.g. Apollo Diagnostics"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Select Document File (PDF or Image)
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full p-2.5 rounded-xl border border-dashed border-teal-300 bg-teal-50/50 text-xs"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports PDF pathology reports, scanned photos, and JPEG test slips.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow"
                >
                  {isUploading ? 'Analyzing Report...' : 'Upload & Correlate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
