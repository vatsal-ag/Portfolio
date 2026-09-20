import React, { useState } from 'react';
import { Key, Sparkles, X, Check, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

interface ApiKeyModalProps {
  onClose: () => void;
  onKeyConfigured: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose, onKeyConfigured }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsSubmitting(true);
    try {
      const ok = await api.setApiKey(apiKey.trim());
      if (ok) {
        setStatusMsg('Gemini Vision AI key successfully configured!');
        onKeyConfigured();
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        alert('Failed to configure key.');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
              Gemini Vision AI Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Enter your Google Gemini API key to enable live handwriting recognition with <strong>Gemini 2.5 Flash Vision</strong>.
          Without a key, the app runs smoothly in full Demo Mode with built-in realistic clinical prescriptions.
        </p>

        {statusMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block">Gemini API Key</label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow"
            >
              {isSubmitting ? 'Verifying...' : 'Save & Activate Key'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
