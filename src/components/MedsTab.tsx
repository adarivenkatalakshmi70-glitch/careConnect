import React, { useState } from 'react';
import { Medication } from '../types';

interface MedsTabProps {
  medications: Medication[];
  onToggleMedication: (id: string) => void;
  onAddMedication: (med: Omit<Medication, 'id' | 'taken'>) => void;
  notificationPermission?: 'granted' | 'denied' | 'default' | 'unsupported';
  onRequestPermission?: () => void;
  onSimulateReminder?: (medId: string) => void;
}

export const MedsTab: React.FC<MedsTabProps> = ({
  medications,
  onToggleMedication,
  onAddMedication,
  notificationPermission = 'default',
  onRequestPermission = () => {},
  onSimulateReminder = (medId: string) => {}
}) => {
  // Tue 13 is selected by default to match specifications layout exactly
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(2); // 0 = Mon, 1 = Tue, etc.
  
  // Weekly structure
  const daysOfWeek = [
    { name: 'MON', date: 12 },
    { name: 'TUE', date: 13 },
    { name: 'WED', date: 14 },
    { name: 'THU', date: 15 },
    { name: 'FRI', date: 16 },
    { name: 'SAT', date: 17 },
    { name: 'SUN', date: 18 }
  ];

  // Add Med Dialog states
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [medName, setMedName] = useState<string>('');
  const [medDosage, setMedDosage] = useState<string>('');
  const [medTiming, setMedTiming] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Morning');
  const [medInstructions, setMedInstructions] = useState<string>('');

  const timings: ('Morning' | 'Afternoon' | 'Evening' | 'Night')[] = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName || !medDosage) {
      alert('Medication Name and Dosage are required.');
      return;
    }
    onAddMedication({
      name: medName,
      dosage: medDosage,
      timing: medTiming,
      instructions: `${medDosage} • ${medInstructions || 'Take as directed'}`,
      days: [1, 2, 3, 4, 5, 6, 7] // Take every day of the week by default
    });
    // Reset
    setMedName('');
    setMedDosage('');
    setMedTiming('Morning');
    setMedInstructions('');
    setShowAddForm(false);
  };

  // Group medications by timing for the CURRENT active day
  const getMedsByTiming = (timing: 'Morning' | 'Afternoon' | 'Evening' | 'Night') => {
    return medications.filter(m => m.timing === timing);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Dynamic Header */}
      <section>
        <h2 className="text-3xl font-extrabold text-[#1a1c1e] mb-4">Weekly Schedule</h2>
        <div className="flex justify-between items-center gap-2 overflow-x-auto pb-4 hide-scrollbar">
          {daysOfWeek.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={day.name}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex-1 min-w-[72px] h-[92px] rounded-xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#0040a1] bg-[#dae2ff] text-[#001847] font-bold shadow-sm'
                    : 'border-[#c3c6d6] bg-white text-[#1a1c1e] hover:bg-[#f3f3f6]'
                }`}
              >
                <span className={`text-sm ${isSelected ? 'text-[#0040a1]' : 'text-[#424654]'} font-semibold`}>
                  {day.name}
                </span>
                <span className="text-2xl font-extrabold block mt-1">{day.date}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Adding a Medication Block overlay/Form */}
      {showAddForm ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border-2 border-[#0040a1] space-y-4">
          <h3 className="text-xl font-bold text-[#0040a1] flex items-center justify-between">
            <span>Add New Prescription</span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-red-600 text-lg font-bold"
            >
              x
            </button>
          </h3>

          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-[#424654]">Medication Name</label>
              <input
                type="text"
                placeholder="e.g. Aspirin"
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                required
                className="min-h-[48px] border-2 border-[#737785] rounded-lg px-3 focus:border-[#0040a1] outline-none font-medium"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-[#424654]">Dosage</label>
              <input
                type="text"
                placeholder="e.g. 50mg or 2 tablets"
                value={medDosage}
                onChange={(e) => setMedDosage(e.target.value)}
                required
                className="min-h-[48px] border-2 border-[#737785] rounded-lg px-3 focus:border-[#0040a1] outline-none font-medium"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-[#424654]">Time of Day</label>
              <select
                value={medTiming}
                onChange={(e) => setMedTiming(e.target.value as any)}
                className="min-h-[48px] border-2 border-[#737785] rounded-lg px-3 focus:border-[#0040a1] bg-white outline-none font-medium"
              >
                {timings.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-[#424654]">Instructions / Food Notes</label>
              <input
                type="text"
                placeholder="e.g. Before food, take with warm milk"
                value={medInstructions}
                onChange={(e) => setMedInstructions(e.target.value)}
                className="min-h-[48px] border-2 border-[#737785] rounded-lg px-3 focus:border-[#0040a1] outline-none font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full min-h-[56px] bg-[#186c37] hover:bg-[#0f5424] text-white font-bold rounded-lg transition-all"
          >
            Save Medication
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full min-h-[64px] bg-[#0040a1] hover:bg-[#003080] text-white font-bold rounded-xl flex items-center justify-center gap-2 active:brightness-90 transition-all text-xl"
        >
          <span className="material-symbols-outlined text-[32px]">add_circle</span>
          Add New Medication
        </button>
      )}

      {/* MEDICATION TIMINGS STACK */}
      <div className="space-y-8 mt-4">
        {timings.map((timing) => {
          const timingMeds = getMedsByTiming(timing);
          // Set symbols icon mapping for timing
          let timingIcon = 'wb_sunny';
          if (timing === 'Afternoon') timingIcon = 'light_mode';
          if (timing === 'Evening') timingIcon = 'bedtime';
          if (timing === 'Night') timingIcon = 'nights_stay';

          return (
            <section key={timing}>
              <div id={`timing-${timing}`} className="flex items-center gap-3 mb-4 border-b pb-2 border-slate-200">
                <span className="material-symbols-outlined text-[#186c37] text-3xl font-bold">
                  {timingIcon}
                </span>
                <h3 className="text-2xl font-extrabold text-[#1a1c1e]">{timing}</h3>
              </div>

              {timingMeds.length > 0 ? (
                <div className="space-y-4">
                  {timingMeds.map((med) => {
                    return (
                      <div
                        key={med.id}
                        onClick={() => onToggleMedication(med.id)}
                        className={`transition-all duration-200 cursor-pointer flex items-center justify-between p-4 border-2 rounded-xl min-h-[88px] ${
                          med.taken
                            ? 'opacity-60 bg-[#eeeef0] border-[#c3c6d6]'
                            : 'bg-white border-[#c3c6d6] hover:border-[#0040a1] hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span 
                            className={`material-symbols-outlined text-3xl shrink-0 ${med.taken ? 'text-slate-400' : 'text-[#0040a1]'}`}
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            pill
                          </span>
                          <div>
                            <p className={`text-xl font-bold ${med.taken ? 'line-through text-slate-500' : 'text-[#1a1c1e]'}`}>
                              {med.name}
                            </p>
                            <p className="text-[#424654] text-base">{med.instructions}</p>
                          </div>
                        </div>

                        {/* Large accessibility friendly checkbox block and mini test alarm */}
                        <div onClick={(e) => e.stopPropagation()} className="relative flex items-center justify-end gap-3 shrink-0">
                          {/* Test Bell button */}
                          <button
                            type="button"
                            onClick={() => onSimulateReminder(med.id)}
                            title="Test alert for this dose"
                            className="w-11 h-11 rounded-full border border-slate-300 bg-slate-50 hover:bg-[#dae2ff] hover:text-[#0040a1] hover:border-[#b2c5ff] flex items-center justify-center transition-all cursor-pointer text-slate-500"
                          >
                            <span className="material-symbols-outlined text-lg">notifications_active</span>
                          </button>

                          <input
                            type="checkbox"
                            checked={med.taken}
                            onChange={() => onToggleMedication(med.id)}
                            className="w-10 h-10 rounded-lg border-2 border-[#737785] text-[#0040a1] focus:ring-[#0040a1] transition-all cursor-pointer accent-[#0040a1]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#f3f3f6] border-2 border-dashed border-[#c3c6d6] rounded-xl p-8 flex flex-col items-center justify-center text-center">
                  <p className="text-lg text-[#737785] font-medium">
                    No medications scheduled for this {timing.toLowerCase()}.
                  </p>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
