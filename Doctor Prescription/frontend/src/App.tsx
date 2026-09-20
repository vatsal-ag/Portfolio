import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PrescriptionScanner } from './components/PrescriptionScanner';
import { PrescriptionResultView } from './components/PrescriptionResultView';
import { PrescriptionHistoryView } from './components/PrescriptionHistoryView';
import { CaretakerScheduleView } from './components/CaretakerScheduleView';
import { HipaaComplianceCenter } from './components/HipaaComplianceCenter';
import { PatientProfileModal } from './components/PatientProfileModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AlarmTriggerModal } from './components/AlarmTriggerModal';
import { MedicinePhotoVerifierModal } from './components/MedicinePhotoVerifierModal';
import { api } from './services/api';
import { PatientProfile, PrescriptionDetail, MedicationAlarm, PrescriptionMedicine } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [currentResult, setCurrentResult] = useState<PrescriptionDetail | null>(null);
  const [seniorMode, setSeniorMode] = useState<boolean>(false);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [showVerifierModal, setShowVerifierModal] = useState<boolean>(false);
  const [selectedMedicineForVerifier, setSelectedMedicineForVerifier] = useState<PrescriptionMedicine | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [activeAlarmForModal, setActiveAlarmForModal] = useState<MedicationAlarm | null>(null);

  useEffect(() => {
    // Load initial profile
    api.getProfile().then(setProfile).catch(console.error);

    // Apply senior mode class to body
    if (seniorMode) {
      document.body.classList.add('senior-mode');
    } else {
      document.body.classList.remove('senior-mode');
    }
  }, [seniorMode]);

  const handleScanComplete = (data: any) => {
    setCurrentResult(data);
    setActiveTab('result');
  };

  const handleMarkAlarmTaken = async (alarmId: number) => {
    await api.setAlarmAction(alarmId, 'TAKEN');
  };

  const handleSnoozeAlarm = async (alarmId: number) => {
    await api.setAlarmAction(alarmId, 'SNOOZED');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        seniorMode={seniorMode}
        setSeniorMode={setSeniorMode}
        profile={profile}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenApiKeyModal={() => setShowApiKeyModal(true)}
        onOpenMedicineVerifier={() => {
          setSelectedMedicineForVerifier(null);
          setShowVerifierModal(true);
        }}
        hasApiKey={hasApiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {activeTab === 'scan' && (
          <PrescriptionScanner
            onScanComplete={handleScanComplete}
            seniorMode={seniorMode}
          />
        )}

        {activeTab === 'result' && currentResult && (
          <PrescriptionResultView
            data={currentResult}
            onBack={() => setActiveTab('scan')}
            onGoToCaretaker={() => setActiveTab('caretaker')}
            onVerifyMedicineBox={(med) => {
              setSelectedMedicineForVerifier(med);
              setShowVerifierModal(true);
            }}
            seniorMode={seniorMode}
          />
        )}

        {activeTab === 'history' && (
          <PrescriptionHistoryView
            onSelectPrescription={(p) => {
              setCurrentResult(p);
              setActiveTab('result');
            }}
            seniorMode={seniorMode}
          />
        )}

        {activeTab === 'caretaker' && (
          <CaretakerScheduleView
            seniorMode={seniorMode}
            onSimulateAlarm={(alarm) => setActiveAlarmForModal(alarm)}
          />
        )}

        {activeTab === 'compliance' && (
          <HipaaComplianceCenter />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>RxVision AI • Doctor Prescription Reader &amp; Senior Caretaker Assistant</span>
          <span className="text-emerald-700 font-semibold">
            Strictly Compliant with HIPAA 45 CFR &amp; Indian IT Act 2000 (SPDI Rules)
          </span>
        </div>
      </footer>

      {/* Modals */}
      {showProfileModal && (
        <PatientProfileModal
          onClose={() => setShowProfileModal(false)}
          onProfileUpdated={(p) => setProfile(p)}
        />
      )}

      {showApiKeyModal && (
        <ApiKeyModal
          onClose={() => setShowApiKeyModal(false)}
          onKeyConfigured={() => setHasApiKey(true)}
        />
      )}

      {showVerifierModal && (
        <MedicinePhotoVerifierModal
          initialMedicine={selectedMedicineForVerifier}
          onClose={() => {
            setShowVerifierModal(false);
            setSelectedMedicineForVerifier(null);
          }}
          seniorMode={seniorMode}
        />
      )}

      {activeAlarmForModal && (
        <AlarmTriggerModal
          alarm={activeAlarmForModal}
          onClose={() => setActiveAlarmForModal(null)}
          onMarkTaken={handleMarkAlarmTaken}
          onSnooze={handleSnoozeAlarm}
        />
      )}
    </div>
  );
};
