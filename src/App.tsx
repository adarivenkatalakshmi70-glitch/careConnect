import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { DashboardTab } from './components/DashboardTab';
import { MedsTab } from './components/MedsTab';
import { BookingTab } from './components/BookingTab';
import { HelpTab } from './components/HelpTab';
import { SubsidiesTab } from './components/SubsidiesTab';
import { Profile, Medication, Appointment, TabType } from './types';
import { INITIAL_MEDICATIONS } from './data';
import { 
  getNotificationStatus, 
  requestNotificationPermission, 
  sendMedicationNotification, 
  getTimingTimeLabel 
} from './utils/notifications';

export default function App() {
  // Try loading profile from localstorage, fallback to default completed demo profile so all features show immediately
  const [profile, setProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('careconnect_profile');
    if (saved) return JSON.parse(saved);
    const defaultProfile: Profile = {
      name: 'Martha Stewart',
      dob: '1941-08-03',
      emergencyContact: '(555) 019-9922',
      completed: true,
      step: 3
    };
    localStorage.setItem('careconnect_profile', JSON.stringify(defaultProfile));
    return defaultProfile;
  });

  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');

  // Load medications
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('careconnect_medications');
    return saved ? JSON.parse(saved) : INITIAL_MEDICATIONS;
  });

  // Load appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('careconnect_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  // Emergency SOS Trigger Modal states
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [sosCountdown, setSosCountdown] = useState<number>(5);
  const [sosDispatched, setSosDispatched] = useState<boolean>(false);

  // Notification Permissions and States
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    return getNotificationStatus().permission;
  });
  
  // Track notified medications so they don't fire repeatedly
  const [notifiedMedIds, setNotifiedMedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('careconnect_notified_meds');
    return saved ? JSON.parse(saved) : [];
  });

  // For the active fully interactive fallback in-app alert modal
  const [alertMedication, setAlertMedication] = useState<Medication | null>(null);

  // Sound chime function (Web Audio API)
  const playChimeSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.15); // A5
      osc.frequency.setValueAtTime(1174.66, now + 0.3); // D6
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {
      console.warn("Audio chime block or unsupported:", e);
    }
  };

  const triggerMedicationReminder = (med: Medication) => {
    // 1. Play auditory alarm
    playChimeSound();
    
    // 2. Try the browser native notification API
    const title = `Medication Due: ${med.name}`;
    const body = `${med.dosage} is scheduled for your ${med.timing}. Instructions: ${med.instructions}`;
    sendMedicationNotification(title, body, med.id);
    
    // 3. Trigger standard interactive fallback in-app card popup so they cannot possibly miss it
    setAlertMedication(med);
  };

  // Request browser permissions helper
  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    setNotificationPermission(result);
    if (result === 'granted') {
      sendMedicationNotification(
        'Alerts Enabled Successfully',
        'CareConnect will now gently remind you when medications are due.'
      );
    } else if (result === 'denied') {
      alert('Notification permissions were blocked. Please enable them in your browser settings to receive desktop push alarms.');
    }
  };

  // Force simulate helper so users can instantly experience the push notification & visual alert!
  const handleSimulateReminder = (medId: string) => {
    const targetMed = medications.find(m => m.id === medId);
    if (targetMed) {
      triggerMedicationReminder(targetMed);
    }
  };

  // Clean the notified ID list at midnight
  useEffect(() => {
    const midnightInterval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setNotifiedMedIds([]);
        localStorage.removeItem('careconnect_notified_meds');
      }
    }, 60000);
    return () => clearInterval(midnightInterval);
  }, []);

  // Save notified IDs
  useEffect(() => {
    localStorage.setItem('careconnect_notified_meds', JSON.stringify(notifiedMedIds));
  }, [notifiedMedIds]);

  // Background check loop
  useEffect(() => {
    // Regularly update permission on cycle
    setNotificationPermission(getNotificationStatus().permission);

    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      
      // Map hour ranges to timing schedules
      let activeTiming: 'Morning' | 'Afternoon' | 'Evening' | 'Night' | null = null;
      if (currentHour >= 8 && currentHour <= 11) {
        activeTiming = 'Morning';
      } else if (currentHour >= 12 && currentHour <= 15) {
        activeTiming = 'Afternoon';
      } else if (currentHour >= 17 && currentHour <= 19) {
        activeTiming = 'Evening';
      } else if (currentHour >= 20 && currentHour <= 23) {
        activeTiming = 'Night';
      }

      if (!activeTiming) return;

      // Check current day of week (1=Mon, ..., 7=Sun)
      const currentDay = now.getDay() === 0 ? 7 : now.getDay();

      medications.forEach(med => {
        // If it's the right schedule timing, has not been taken, matches scheduled days, and hasn't notified yet
        if (
          med.timing === activeTiming && 
          !med.taken && 
          med.days.includes(currentDay) &&
          !notifiedMedIds.includes(med.id)
        ) {
          setNotifiedMedIds(prev => {
            if (prev.includes(med.id)) return prev;
            triggerMedicationReminder(med);
            return [...prev, med.id];
          });
        }
      });
    }, 15000); // Trigger check every 15 seconds

    return () => clearInterval(checkInterval);
  }, [medications, notifiedMedIds]);

  // Save profile state shifts
  const handleOnboardingComplete = (newProfile: Profile) => {
    setProfile(newProfile);
    localStorage.setItem('careconnect_profile', JSON.stringify(newProfile));
  };

  // Save changes locally
  useEffect(() => {
    localStorage.setItem('careconnect_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('careconnect_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Handler for toggle med checked status
  const handleToggleMedication = (id: string) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  // Confirm medication from upcoming card inside dashboard
  const handleConfirmUpcomingMedication = (id: string) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, taken: true } : m));
  };

  // Adding med dynamically
  const handleAddNewMedication = (newMed: Omit<Medication, 'id' | 'taken'>) => {
    const m: Medication = {
      id: `med-${Date.now()}`,
      taken: false,
      ...newMed
    };
    setMedications(prev => [m, ...prev]);
  };

  // Add Appointment
  const handleAddAppointment = (newAppt: Omit<Appointment, 'id'>) => {
    const appt: Appointment = {
      id: `appt-${Date.now()}`,
      ...newAppt
    };
    setAppointments(prev => [appt, ...prev]);
  };

  // Cancel Appointment
  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // Emergency countdown ticker logic
  useEffect(() => {
    let timer: any;
    if (sosActive && !sosDispatched) {
      if (sosCountdown > 0) {
        timer = setTimeout(() => {
          setSosCountdown(prev => prev - 1);
        }, 1000);
      } else {
        setSosDispatched(true);
      }
    }
    return () => clearTimeout(timer);
  }, [sosActive, sosCountdown, sosDispatched]);

  const triggerSOS = () => {
    setSosActive(true);
    setSosCountdown(5);
    setSosDispatched(false);
  };

  const cancelSOS = () => {
    setSosActive(false);
    setSosCountdown(5);
    setSosDispatched(false);
  };

  // Reset demo profile utility
  const handleResetDemoAndOnboardAgain = () => {
    if (confirm('Are you sure you want to reset your CareConnect profile and start steps over?')) {
      localStorage.removeItem('careconnect_profile');
      localStorage.removeItem('careconnect_medications');
      localStorage.removeItem('careconnect_appointments');
      setProfile(null);
      setMedications(INITIAL_MEDICATIONS);
      setAppointments([]);
      setActiveTab('Dashboard');
    }
  };

  // Show onboarding steps if profile has not been completed yet
  if (!profile || !profile.completed) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#f9f9fc] pb-28 text-[#1a1c1e] relative">
      {/* Universal Sticky Accessible Header */}
      <Header 
        title={activeTab} 
        onBack={activeTab !== 'Dashboard' ? () => setActiveTab('Dashboard') : undefined} 
        onHelp={() => alert(`CareConnect Senior Guide:\n\n1. Use 'Meds' to record taken pills.\n2. Tap 'Booking' to speak with clinicians.\n3. Hold 'Emergency SOS' button during critical events.\n\nSupport Line: 1800 555 0199`)}
      />

      {/* Main Column Grid Content */}
      <main className="max-w-[800px] mx-auto px-6 pt-6">
        {activeTab === 'Dashboard' && (
          <DashboardTab
            name={profile.name}
            medications={medications}
            onConfirmMedication={handleConfirmUpcomingMedication}
            onNavigate={setActiveTab}
            onTriggerSOS={triggerSOS}
            notificationPermission={notificationPermission}
            onRequestPermission={handleRequestPermission}
            onSimulateReminder={handleSimulateReminder}
          />
        )}

        {activeTab === 'Meds' && (
          <MedsTab
            medications={medications}
            onToggleMedication={handleToggleMedication}
            onAddMedication={handleAddNewMedication}
            notificationPermission={notificationPermission}
            onRequestPermission={handleRequestPermission}
            onSimulateReminder={handleSimulateReminder}
          />
        )}

        {activeTab === 'Booking' && (
          <BookingTab
            appointments={appointments}
            onAddAppointment={handleAddAppointment}
            onCancelAppointment={handleCancelAppointment}
          />
        )}

        {activeTab === 'Help' && (
          <HelpTab onTriggerSOS={triggerSOS} />
        )}

        {activeTab === 'Subsidies' && (
          <SubsidiesTab />
        )}

        {/* Small accessibility reset switch */}
        <div className="mt-16 text-center border-t border-slate-200 pt-6">
          <button
            onClick={handleResetDemoAndOnboardAgain}
            className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
          >
            Reset Clinic Demo Profile & Onboarding Steps
          </button>
        </div>
      </main>

      {/* Primary Bottom Action tab bar */}
      <BottomNavigation activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* EMERGENCY SOS TRIGGER COUNTDOWN MODAL OVERLAY */}
      {sosActive && (
        <div className="fixed inset-0 z-[100] bg-[#1a1c1e]/95 flex items-center justify-center p-6 text-white text-center">
          <div className="max-w-md w-full space-y-8 animate-in zoom-in-95 duration-200">
            {/* Pulsating emergency icon */}
            <div className="w-24 h-24 bg-[#940010] rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <span className="material-symbols-outlined text-5xl text-white font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                emergency
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold tracking-widest uppercase text-red-500">
                {sosDispatched ? 'DISPATCHED SUCCESS' : 'CRITICAL EMERGENCY'}
              </h2>
              {sosDispatched ? (
                <p className="text-xl leading-relaxed text-slate-200 font-medium">
                  Direct live GPS coordinates, medical records, and emergency context have been securely routed to local welfare dispatchers. Help is on the way.
                </p>
              ) : (
                <p className="text-xl leading-relaxed text-slate-200">
                  Alerting emergency services and direct contact <strong className="text-white">({profile.emergencyContact})</strong> in:
                </p>
              )}
            </div>

            {/* Simulated countdown */}
            {!sosDispatched && (
              <div className="text-7xl font-extrabold text-white animate-bounce">
                {sosCountdown}
              </div>
            )}

            {sosDispatched && (
              <div className="bg-[#186c37]/20 border-2 border-[#186c37] p-4 rounded-xl text-left space-y-2 text-sm text-[#a3f5b2]">
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>Direct Satellite Alert Transmitted</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>Martha Stewart Profile Dispatched</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>Contact Notification Dispatched</span>
                </p>
              </div>
            )}

            {/* Core Action handlers */}
            <div className="pt-4">
              {sosDispatched ? (
                <div className="space-y-4">
                  <a
                    href="tel:911"
                    className="w-full min-h-[64px] bg-[#186c37] hover:bg-[#0f5424] text-white font-bold text-xl rounded-xl flex items-center justify-center gap-2 shadow"
                  >
                    <span className="material-symbols-outlined">call</span>
                    Direct Call Dispatch (911)
                  </a>
                  <button
                    onClick={cancelSOS}
                    className="w-full min-h-[56px] border-2 border-[#737785] text-slate-300 font-bold hover:text-white rounded-xl text-lg hover:border-white transition-all"
                  >
                    Close Emergency Dashboard
                  </button>
                </div>
              ) : (
                <button
                  onClick={cancelSOS}
                  className="w-full min-h-[64px] bg-[#940010] hover:bg-red-800 text-white font-extrabold text-xl rounded-xl shadow-lg border-2 border-red-500 active:scale-95 transition-all uppercase tracking-wider"
                >
                  CANCEL OUT OF SOS
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GENTLE INTERACTIVE FALLBACK MEDICATION POPUP ALARM */}
      {alertMedication && (
        <div className="fixed inset-0 z-[110] bg-black/70 flex items-center justify-center p-6 text-center animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-4 border-[#0040a1] max-w-md w-full p-8 space-y-6 shadow-2xl relative text-[#1a1c1e] animate-in zoom-in-95 duration-200">
            {/* Pulsating Pill Design */}
            <div className="w-20 h-20 bg-[#dae2ff] text-[#0040a1] rounded-full flex items-center justify-center mx-auto border-2 border-[#b2c5ff] animate-bounce">
              <span className="material-symbols-outlined text-5xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                pill
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-extrabold text-[#0040a1] tracking-tight">Medication Time!</h3>
              <p className="text-lg text-slate-500 font-semibold">It is time for your scheduled dosage.</p>
            </div>

            {/* Medicine Box details */}
            <div className="bg-[#dae2ff]/40 p-5 rounded-2xl border-2 border-[#b2c5ff] text-left space-y-2">
              <p className="text-2xl font-extrabold text-[#001847]">{alertMedication.name}</p>
              <div className="text-base text-slate-700 font-bold flex flex-wrap gap-2 mt-1">
                <span className="bg-white/80 border border-slate-200 px-3 py-1 rounded-full">{alertMedication.dosage}</span>
                <span className="bg-[#186c37]/10 text-[#1e713b] border border-[#a0f2af] px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  {alertMedication.timing} Schedule
                </span>
              </div>
              {alertMedication.instructions && (
                <div className="mt-3 text-sm text-[#424654] border-t border-slate-300/60 pt-3 flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-slate-500 text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                  <p className="font-semibold leading-relaxed">{alertMedication.instructions}</p>
                </div>
              )}
            </div>

            {/* Dual CTA */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  // Mark as taken
                  setMedications(prev => prev.map(m => m.id === alertMedication.id ? { ...m, taken: true } : m));
                  setAlertMedication(null);
                  
                  // Success confirmation sound
                  try {
                    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                    if (AudioContext) {
                      const ctx = new AudioContext();
                      const now = ctx.currentTime;
                      const osc = ctx.createOscillator();
                      const gain = ctx.createGain();
                      osc.type = 'sine';
                      osc.frequency.setValueAtTime(523.25, now); // C5
                      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
                      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
                      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
                      gain.gain.setValueAtTime(0.2, now);
                      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                      osc.connect(gain);
                      gain.connect(ctx.destination);
                      osc.start(now);
                      osc.stop(now + 0.5);
                    }
                  } catch (err) {}
                }}
                className="w-full min-h-[64px] bg-[#186c37] hover:bg-[#0f5424] text-white font-extrabold text-xl rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl font-bold">check_circle</span>
                I Have Taken My Pills
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Snooze for 5 minutes (for the demo, we will reset the notified state so it triggers again on the next check)
                    setNotifiedMedIds(prev => prev.filter(id => id !== alertMedication.id));
                    setAlertMedication(null);
                    alert("Notification snoozed. CareConnect will alert you again in a few moments.");
                  }}
                  className="flex-1 min-h-[56px] border-2 border-slate-300 font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Remind Me Later
                </button>
                <button
                  onClick={() => setAlertMedication(null)}
                  className="flex-1 min-h-[56px] border-2 border-red-200 font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
