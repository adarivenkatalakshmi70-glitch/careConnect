import React, { useState, useEffect } from 'react';
import { Medication, TabType } from '../types';

interface DashboardTabProps {
  name: string;
  medications: Medication[];
  onConfirmMedication: (id: string) => void;
  onNavigate: (tab: TabType) => void;
  onTriggerSOS: () => void;
  notificationPermission?: 'granted' | 'denied' | 'default' | 'unsupported';
  onRequestPermission?: () => void;
  onSimulateReminder?: (medId: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  name,
  medications,
  onConfirmMedication,
  onNavigate,
  onTriggerSOS,
  notificationPermission = 'default',
  onRequestPermission = () => {},
  onSimulateReminder = (medId: string) => {}
}) => {
  // Pulse and steps simulations
  const [pulse, setPulse] = useState<number>(72);
  const [steps, setSteps] = useState<number>(3420);
  const [isPulsing, setIsPulsing] = useState<boolean>(true);
  const [showLogSteps, setShowLogSteps] = useState<boolean>(false);
  const [newSteps, setNewSteps] = useState<string>('');

  // Find the first upcoming medication that hasn't been taken yet today
  const upcomingMed = medications.find(m => !m.taken);

  // Simulate pulse rate fluctuating slightly for natural reality
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulse(prev => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + delta;
        return next > 65 && next < 85 ? next : prev;
      });
      // Toggle pulse animation
      setIsPulsing(p => !p);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  const handleAddSteps = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(newSteps);
    if (!isNaN(parsed) && parsed > 0) {
      setSteps(prev => prev + parsed);
      setNewSteps('');
      setShowLogSteps(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header section with personalized name greeting */}
      <div className="bg-white p-6 rounded-xl border-2 border-[#c3c6d6] flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1a1c1e]">Hello, {name || 'Patient'}!</h2>
          <p className="text-lg text-[#424654] mt-1">Here is your customized health checklist for today.</p>
        </div>
        <div className="text-right text-[#0040a1] font-bold text-lg hidden md:block">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* 🔔 BROWSER NOTIFICATION CONTROL CENTER */}
      <section className="bg-white p-5 rounded-xl border-2 border-[#c3c6d6] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#dae2ff] text-[#0040a1] rounded-xl shrink-0">
              <span className="material-symbols-outlined text-2xl font-bold">notifications_active</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1a1c1e] flex items-center gap-2 flex-wrap">
                <span>Medication Push Notifications</span>
                {notificationPermission === 'granted' ? (
                  <span className="bg-[#a0f2af] text-[#1e713b] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#1e713b] rounded-full animate-ping"></span>
                    Active
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                    Setup Needed
                  </span>
                )}
              </h3>
              <p className="text-sm text-[#424654] mt-0.5">
                CareConnect uses your browser to sound a gentle buzzer when it's time to take your pills, even if you are looking at other tabs.
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            {notificationPermission !== 'granted' && (
              <button
                type="button"
                onClick={onRequestPermission}
                className="w-full sm:w-auto min-h-[44px] bg-[#0040a1] hover:bg-[#003080] text-white font-bold px-4 rounded-lg text-sm transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">notifications</span>
                Enable Push Alerts
              </button>
            )}
            {notificationPermission === 'granted' && (
              <div className="text-right text-[#1e713b] text-sm font-bold flex items-center gap-1 justify-end pr-2">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Browser Linked
              </div>
            )}
          </div>
        </div>

        {/* Live demonstration toolkit for testing */}
        <div className="border-t border-slate-200/80 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[#424654] font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-[#0040a1]" style={{ fontVariationSettings: "'FILL' 1" }}>offline_bolt</span>
            Try it out immediately:
          </span>
          <div className="flex gap-2 w-full sm:w-auto">
            {upcomingMed ? (
              <button
                type="button"
                onClick={() => onSimulateReminder(upcomingMed.id)}
                className="flex-1 sm:flex-initial min-h-[36px] bg-[#dae2ff] text-[#001847] hover:bg-[#b2c5ff] px-3 py-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-sm">notifications_active</span>
                Simulate Dose Reminder: {upcomingMed.name}
              </button>
            ) : medications.length > 0 ? (
              <button
                type="button"
                onClick={() => onSimulateReminder(medications[0].id)}
                className="flex-1 sm:flex-initial min-h-[36px] bg-[#dae2ff] text-[#001847] hover:bg-[#b2c5ff] px-3 py-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-sm">notifications_active</span>
                Simulate Dose Reminder: {medications[0].name}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* EMERGENCY SOS TRIGGER */}
      <section>
        <button
          onClick={onTriggerSOS}
          className="w-full bg-[#940010] text-white min-h-[88px] rounded-xl flex items-center justify-center gap-4 active:scale-95 hover:brightness-110 cursor-pointer shadow-lg border-4 border-white/20 transition-all group"
        >
          <span className="material-symbols-outlined text-4xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
            emergency
          </span>
          <span className="text-2xl font-extrabold tracking-widest uppercase group-hover:tracking-wider transition-all">
            EMERGENCY SOS
          </span>
        </button>
        <p className="text-center text-[#737785] text-sm mt-2">
          Press to immediately alert your emergency contact & medical dispatcher.
        </p>
      </section>

      {/* UPCOMING MEDICATIONS */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-[#424654] px-1">Upcoming Medication</h3>
        {upcomingMed ? (
          <div className="bg-white border-2 border-[#c3c6d6] rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
            {/* Clock Circle */}
            <div className="bg-[#dae2ff] text-[#001847] w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 border-[#b2c5ff] shrink-0">
              <span className="text-3xl font-extrabold">{upcomingMed.timing === 'Night' ? '9' : upcomingMed.timing === 'Evening' ? '6' : upcomingMed.timing === 'Afternoon' ? '1' : '10'}</span>
              <span className="text-xs font-bold uppercase">{upcomingMed.timing === 'Night' || upcomingMed.timing === 'Evening' ? 'PM' : 'AM'}</span>
            </div>

            {/* Med text details */}
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-3xl font-extrabold text-[#0040a1]">{upcomingMed.name}</h4>
              <p className="text-xl text-[#424654] font-medium">{upcomingMed.instructions}</p>
            </div>

            {/* Taken Action button */}
            <div className="shrink-0 w-full sm:w-auto">
              <button
                onClick={() => onConfirmMedication(upcomingMed.id)}
                className="w-full sm:w-auto bg-[#a0f2af] hover:bg-[#8ade9b] text-[#1e713b] hover:text-[#0f5424] min-h-[64px] px-8 rounded-full text-lg font-bold active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined font-bold">check_circle</span>
                Confirm Taken
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#a0f2af]/20 border-2 border-[#a0f2af] rounded-xl p-6 text-center text-[#1e713b] flex flex-col items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <div>
              <h4 className="text-xl font-bold">All caught up!</h4>
              <p className="text-base mt-0.5">You have verified taking all medicines scheduled for today.</p>
            </div>
          </div>
        )}
      </section>

      {/* CORE ACTIONS GRID */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-[#424654] px-1">Main Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Action 1: Book Doctor */}
          <div
            onClick={() => onNavigate('Booking')}
            className="bg-white border-2 border-[#c3c6d6] rounded-xl overflow-hidden hover:border-[#0040a1] cursor-pointer group shadow-sm active:scale-[0.99] transition-all"
          >
            <div className="h-44 w-full relative overflow-hidden">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Clinic female doctor smiling warmly"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmety5eI1iCPbLebQS924XApVlG71mHvp9jA1_aNR4PoFZ6EXQG3hdqI_b3XaKspI0OkBaQqSVe48qFKqlbhyvkDeFiDasgSIIv67suK2kmRpAxgOnKj7trm9lhR3mmA4WeN8OJGOxGG7l_YnDz-qIYaF7sRR7hkYeEahCZEoQ5IgiOl_TXTJwqtP8Tz4ta6qWf3PbfihLJdxD88s3V6CglrwHgE0O_GHhlsTcgu7vl1lep_zhVSjzfN4kJc1WnEJ6FblPqY7qOg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <span className="absolute bottom-4 left-4 text-2xl font-extrabold text-white">Book Doctor</span>
            </div>
            <div className="p-6">
              <p className="text-lg text-[#424654]">Schedule a physical clinic visit or a live video call with your GP.</p>
            </div>
          </div>

          {/* Action 2: Find Volunteers */}
          <div
            onClick={() => onNavigate('Help')}
            className="bg-white border-2 border-[#c3c6d6] rounded-xl overflow-hidden hover:border-[#0040a1] cursor-pointer group shadow-sm active:scale-[0.99] transition-all"
          >
            <div className="h-44 w-full relative overflow-hidden">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Young volunteer laughing and assisting an elderly with a colorful garden project"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfg2y1C_oAVBI1ge17_6ZiJ3C-Arjl4YYD4idnoH7xCCIeGEXxVayTDaKGD8ms-YVSuOEKsMCtC3WBdxjcS5JNi38Ech-Afr1rFWGKiYB32yOgEJ22oIIeoXP0SkAVHgDOLvMn3CHbVssp_vOUu0PJ_7Ug2wpbYcZWjT2g2SYaA0KJp_f3rK4Ng0IbMyoJ5mGm6m5QRXJvwfPV2PYmDI2K2WtDceZlbV5F3uwWf73Y41Jowp27kxRatty5e65Br-ooI6ghD-28HQ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <span className="absolute bottom-4 left-4 text-2xl font-extrabold text-white">Find Volunteers</span>
            </div>
            <div className="p-6">
              <p className="text-lg text-[#424654]">Request companionship, assistance with local grocery shopping, or social walks.</p>
            </div>
          </div>

          {/* Action 3: Medicine Subsidies */}
          <div
            onClick={() => onNavigate('Subsidies')}
            className="bg-white border-2 border-[#c3c6d6] rounded-xl md:col-span-2 overflow-hidden hover:border-[#0040a1] cursor-pointer group shadow-sm active:scale-[0.99] transition-all flex flex-col md:flex-row"
          >
            <div className="h-44 md:h-auto md:w-1/2 relative overflow-hidden">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Health medicine bottles representation"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlI4Hp409NRjMpjWOCYjKGdVlO6TcrAjUVPCuQTnXPv87CFF4CYHcaJL7cVwED0BX21QjmMR1RNqECyOa7kxp6cSauFqNkQwohGuESyTG3_G93gYOJaMgKJH58K2SnRw3B7O1EtGY6DY2KFu6mawQ9-FI-wPUhO1ZL3sGQPqco4F-qokb_7jVr2G1UOSBhfORuRX4C-ltktJCVkx710aVdD462zu4LdvbYHS5EEJbtZGxOsqrCkPFXZ6FWZItWZ_EqhX0vMuhgMw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <span className="absolute bottom-4 left-4 text-2xl font-extrabold text-white">Medicine Programs</span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
              <p className="text-lg text-[#424654]">
                Explore government health subsidies and immediate cost refill caps available to reduce current prescription prices.
              </p>
              <div className="mt-4 flex items-center text-[#0040a1] font-bold">
                Learn more
                <span className="material-symbols-outlined ml-1">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pulse component */}
        <div className="bg-[#f3f3f6] p-6 rounded-xl border-2 border-[#c3c6d6] text-center flex flex-col items-center justify-center min-h-[160px]">
          <span 
            className={`material-symbols-outlined text-[#186c37] text-4xl mb-2 transition-transform duration-300 ${isPulsing ? 'scale-[1.12]' : 'scale-100'}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
          <p className="text-base font-bold text-[#424654] uppercase tracking-wider">Verified Pulse</p>
          <h4 className="text-3xl font-extrabold text-[#1a1c1e] mt-1">{pulse} BPM</h4>
          <span className="text-xs font-semibold text-[#186c37] flex items-center gap-1 mt-1">
            <span className="w-2.5 h-2.5 bg-[#a0f2af] border border-[#186c37] rounded-full inline-block animate-ping"></span>
            Simulated Real-time Sensor
          </span>
        </div>

        {/* Steps component with active logger */}
        <div className="bg-[#f3f3f6] p-6 rounded-xl border-2 border-[#c3c6d6] text-center flex flex-col items-center justify-center min-h-[160px] relative">
          <span className="material-symbols-outlined text-[#0040a1] text-4xl mb-2">
            footprint
          </span>
          <p className="text-base font-bold text-[#424654] uppercase tracking-wider">Today's Steps</p>
          <h4 className="text-3xl font-extrabold text-[#1a1c1e] mt-1">{steps.toLocaleString()}</h4>

          <div className="mt-3 w-full">
            {showLogSteps ? (
              <form onSubmit={handleAddSteps} className="flex gap-2 items-center max-w-[200px] mx-auto">
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={newSteps}
                  onChange={(e) => setNewSteps(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-400 bg-white rounded text-sm text-center"
                  autoFocus
                />
                <button type="submit" className="p-1 px-3 bg-[#186c37] text-white text-xs rounded hover:brightness-110 font-semibold">
                  Log
                </button>
                <button type="button" onClick={() => setShowLogSteps(false)} className="text-xs text-red-600 hover:underline">
                  X
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowLogSteps(true)}
                className="text-xs font-bold text-[#0040a1] border-b border-dashed border-[#0040a1]"
              >
                + Add walk data
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
