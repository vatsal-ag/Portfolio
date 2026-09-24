import React, { useState, useEffect } from 'react';
import { 
  Salad, 
  Clock, 
  Heart, 
  AlertTriangle, 
  Droplet, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Coffee, 
  Flame, 
  RefreshCw,
  Utensils,
  Pill,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';
import { DietPlan } from '../types';
import { api } from '../services/api';

interface PersonalizedDietViewProps {
  seniorMode: boolean;
}

export const PersonalizedDietView: React.FC<PersonalizedDietViewProps> = ({
  seniorMode
}) => {
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDiet();
  }, []);

  const loadDiet = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPersonalizedDiet();
      setDietPlan(data);
    } catch (err) {
      console.error('Failed to load personalized diet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMealIcon = (mealName: string) => {
    const lower = mealName.toLowerCase();
    if (lower.includes('breakfast')) return <Sun className="w-5 h-5 text-amber-500" />;
    if (lower.includes('morning') || lower.includes('refreshment')) return <Coffee className="w-5 h-5 text-teal-500" />;
    if (lower.includes('lunch')) return <Utensils className="w-5 h-5 text-indigo-500" />;
    if (lower.includes('evening')) return <Sunset className="w-5 h-5 text-orange-500" />;
    return <Moon className="w-5 h-5 text-purple-500" />;
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-700">Synthesizing Clinical Nutrition Plan...</p>
        <p className="text-xs text-slate-500">Cross-referencing chronic conditions with active medications.</p>
      </div>
    );
  }

  if (!dietPlan) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
        <p className="text-sm font-bold text-slate-700">Unable to load diet recommendations.</p>
        <button
          onClick={loadDiet}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Diet Header Banner */}
      <div className="relative bg-gradient-to-r from-teal-800 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 uppercase tracking-wider flex items-center gap-1.5">
            <Salad className="w-3.5 h-3.5" /> Condition-Specific Clinical Nutrition
          </span>
          <span className="text-xs text-teal-200 font-semibold">
            Patient: <strong className="text-white">{dietPlan.patient_name}</strong>
          </span>
        </div>

        <h1 className={`font-black font-['Outfit'] ${
          seniorMode ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl'
        }`}>
          {dietPlan.diet_title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-teal-200 font-medium">Dynamically Balanced For:</span>
          {dietPlan.conditions_addressed.map((cond, idx) => (
            <span
              key={idx}
              className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/20"
            >
              ✓ {cond}
            </span>
          ))}
        </div>
      </div>

      {/* ACUTE ILLNESS RECOVERY HIGHLIGHTS */}
      {dietPlan.acute_tips && dietPlan.acute_tips.length > 0 && (
        <div className="bg-amber-50/80 rounded-3xl p-6 border-2 border-amber-300 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 className="text-base sm:text-lg font-black text-amber-950 font-['Outfit']">
              Active Prescription Nutritional Guardrails
            </h2>
          </div>
          <div className="space-y-2">
            {dietPlan.acute_tips.map((tip, idx) => (
              <p key={idx} className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed">
                {tip}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* DAILY MEAL ROUTINE & PRESCRIPTION SYNC */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-black text-slate-900 font-['Outfit']">
              Daily Meal Routine Aligned with Prescription Schedule
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Prevents Gastric Ulcers &amp; Optimizes Absorption</span>
        </div>

        <div className="space-y-4">
          {dietPlan.meals.map((meal, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-teal-400 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    {getMealIcon(meal.meal)}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit']">
                      {meal.meal}
                    </h3>
                    <span className="text-xs font-bold text-teal-700">
                      {meal.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Recommendation */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Recommended Meal / Menu:
                </span>
                <p className={`text-slate-900 font-bold ${seniorMode ? 'text-base sm:text-lg' : 'text-sm'}`}>
                  {meal.menu}
                </p>
              </div>

              {/* Therapeutic Rationale */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-700">
                <strong className="text-slate-900">Why It Works:</strong> {meal.therapeutic_reason}
              </div>

              {/* Prescription Synchronization Badge */}
              <div className="p-3.5 bg-teal-50/70 rounded-2xl border border-teal-200 text-xs font-semibold text-teal-950 flex items-start gap-2.5">
                <Pill className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-teal-900">Medication Sync Directive:</strong> {meal.prescription_sync}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUPER HEALING FOODS (RECOMMENDED) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-black text-slate-900 font-['Outfit']">
            Super Healing Foods to Accelerate Recovery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dietPlan.healing_foods.map((food, idx) => (
            <div
              key={idx}
              className="bg-emerald-50/60 rounded-3xl p-5 border border-emerald-200/80 shadow-2xs space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm sm:text-base font-black text-emerald-950 font-['Outfit']">
                  {food.food}
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 shrink-0">
                  {food.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-900 font-medium leading-relaxed">
                {food.benefits}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FOODS TO STRICTLY AVOID (CONTRAINDICATED) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h2 className="text-lg font-black text-slate-900 font-['Outfit']">
            Foods to Strictly Avoid (Potential Medical Complications)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dietPlan.avoid_foods.map((item, idx) => (
            <div
              key={idx}
              className="bg-rose-50/60 rounded-3xl p-5 border border-rose-200 shadow-2xs space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm sm:text-base font-black text-rose-950 font-['Outfit'] flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                  {item.food}
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 shrink-0">
                  {item.severity}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed">
                <strong>Why It's Harmful:</strong> {item.danger}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* HYDRATION & FLUID TARGET */}
      <div className="bg-sky-50 rounded-3xl p-6 sm:p-8 border border-sky-200 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0">
            <Droplet className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-sky-950 font-['Outfit']">
              Target Daily Hydration: {dietPlan.hydration.daily_target_liters} Liters
            </h3>
            <p className="text-xs text-sky-800 font-medium">Critical for renal clearance of medication metabolites</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="p-3.5 bg-white/90 rounded-2xl border border-sky-100 space-y-1">
            <span className="font-bold text-sky-900 block">Beneficial Fluids:</span>
            <ul className="list-disc list-inside text-slate-700 space-y-0.5">
              {dietPlan.hydration.recommended_beverages.map((bev, bIdx) => (
                <li key={bIdx}>{bev}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 bg-white/90 rounded-2xl border border-sky-100 space-y-1">
            <span className="font-bold text-sky-900 block">Fluid Timing Rule:</span>
            <p className="text-slate-700 leading-relaxed">
              {dietPlan.hydration.timing_rule}
            </p>
          </div>
        </div>
      </div>

      {/* Clinical Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 leading-relaxed flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>{dietPlan.clinical_disclaimer}</span>
      </div>
    </div>
  );
};
