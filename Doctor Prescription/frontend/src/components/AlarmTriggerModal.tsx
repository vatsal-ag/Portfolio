import React, { useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Volume2, 
  Utensils, 
  AlertCircle,
  X
} from 'lucide-react';
import { MedicationAlarm } from '../types';
import { audioAlarm } from '../services/audioAlarm';

interface AlarmTriggerModalProps {
  alarm: MedicationAlarm;
  onClose: () => void;
  onMarkTaken: (alarmId: number) => void;
  onSnooze: (alarmId: number) => void;
}

export const AlarmTriggerModal: React.FC<AlarmTriggerModalProps> = ({
  alarm,
  onClose,
  onMarkTaken,
  onSnooze
}) => {
  useEffect(() => {
    // Sound chime on display
    audioAlarm.playMedicationChime();
  }, [alarm]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-10 shadow-2xl border-4 border-amber-400 space-y-6 text-center relative">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pulsing Alarm Icon */}
        <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto ring-8 ring-amber-50 animate-bounce">
          <Bell className="w-10 h-10" />
        </div>

        {/* Big Senior-Friendly Text */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Volume2 className="w-4 h-4" /> Medicine Time Reminder
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit']">
            {alarm.medicine_name}
          </h2>
          <p className="text-xl font-bold text-teal-700 font-mono">
            Dosage: {alarm.dosage}
          </p>
        </div>

        {/* Meal Context Card */}
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-950 space-y-1">
          <p className="text-sm font-extrabold flex items-center justify-center gap-2">
            <Utensils className="w-4 h-4 text-amber-600" />
            {alarm.meal_context}
          </p>
          <p className="text-xs sm:text-sm text-slate-700">
            {alarm.instructions}
          </p>
        </div>

        {/* Large Senior-Friendly Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              onMarkTaken(alarm.id);
              onClose();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg sm:text-xl shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6" />
            I Have Taken This Medicine
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onSnooze(alarm.id);
                onClose();
              }}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4 text-slate-500" />
              Snooze 10 Mins
            </button>

            <a
              href="tel:+15557890142"
              className="py-3 px-4 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-sky-600" />
              Call Caretaker
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
