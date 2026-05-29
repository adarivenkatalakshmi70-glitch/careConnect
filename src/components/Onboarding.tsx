import React, { useState } from 'react';
import { Profile } from '../types';

interface OnboardingProps {
  onComplete: (profile: Profile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  
  // Step 2 selections
  const [chronicConditions, setChronicConditions] = useState<string[]>([]);
  const conditions = ['Hypertension', 'Diabetes', 'High Cholesterol', 'General Health & Wellness'];

  const toggleCondition = (cond: string) => {
    if (chronicConditions.includes(cond)) {
      setChronicConditions(chronicConditions.filter(c => c !== cond));
    } else {
      setChronicConditions([...chronicConditions, cond]);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!name || !dob || !emergencyContact) {
        alert('Please fill out all mandatory fields marked with *');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      onComplete({
        name,
        dob,
        emergencyContact,
        completed: true,
        step: 3
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Banner indicating CareConnect is secure */}
      <header className="w-full bg-white border-b-2 border-[#c3c6d6] text-center py-4">
        <h1 className="text-3xl font-extrabold text-[#0040a1]">CareConnect</h1>
        <p className="text-sm font-semibold text-[#186c37] flex items-center justify-center gap-1 mt-1">
          <span className="material-symbols-outlined text-xs">shield</span>
          Your data is encrypted and 100% secure
        </p>
      </header>

      <main className="flex-grow w-full max-w-[800px] mx-auto px-6 py-8 pb-32">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-[#0040a1]">Step {step} of 3</span>
            <span className="text-lg font-bold text-[#424654]">
              {step === 1 && 'Profile Setup'}
              {step === 2 && 'Personalize Care'}
              {step === 3 && 'Confirmation'}
            </span>
          </div>
          <div className="w-full bg-[#e8e8ea] h-4 rounded-full overflow-hidden border-2 border-[#c3c6d6]">
            <div 
              className="bg-[#0040a1] h-full transition-all duration-500 ease-out" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-8">
            <section>
              <h2 className="text-4xl font-bold tracking-tight mb-3">Welcome to CareConnect</h2>
              <p className="text-xl text-[#424654] leading-relaxed">
                Let's start by getting to know you. This information ensures your healthcare team can provide the safest care possible.
              </p>
            </section>

            {/* Inputs */}
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold text-[#1a1c1e] flex items-center gap-1" htmlFor="fullname">
                  Full Name <span className="text-[#940010] font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fullname"
                    placeholder="e.g. Martha Stewart"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full min-h-[56px] px-4 rounded-xl border-2 border-[#737785] bg-white text-lg font-medium focus:border-[#0040a1] focus:ring-0 outline-none transition-all"
                  />
                  {name && (
                    <button
                      type="button"
                      onClick={() => setName('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737785] hover:text-[#1a1c1e] w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold text-[#1a1c1e] flex items-center gap-1" htmlFor="dob">
                  Date of Birth <span className="text-[#940010] font-bold">*</span>
                </label>
                <input
                  type="date"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="w-full min-h-[56px] px-4 rounded-xl border-2 border-[#737785] bg-white text-lg font-medium focus:border-[#0040a1] focus:ring-0 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold text-[#1a1c1e] flex items-center gap-1" htmlFor="emergency">
                  Emergency Contact Number <span className="text-[#940010] font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="emergency"
                    placeholder="(555) 000-0000"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    required
                    className="w-full min-h-[56px] px-4 rounded-xl border-2 border-[#737785] bg-white text-lg font-medium focus:border-[#0040a1] focus:ring-0 outline-none transition-all"
                  />
                  {emergencyContact && (
                    <button
                      type="button"
                      onClick={() => setEmergencyContact('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737785] hover:text-[#1a1c1e] w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Helpful tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="p-6 bg-[#a0f2af] text-[#1e713b] rounded-xl border-2 border-[#c3c6d6] flex gap-4">
                <span className="material-symbols-outlined shrink-0 text-3xl font-semibold">shield</span>
                <div>
                  <h4 className="text-lg font-bold mb-1">Safety First</h4>
                  <p className="text-base">Your emergency contact allows us to alert loved ones immediately if you need urgent help.</p>
                </div>
              </div>

              <div className="p-6 bg-[#e8e8ea] text-[#424654] rounded-xl border-2 border-[#c3c6d6] flex gap-4">
                <span className="material-symbols-outlined shrink-0 text-3xl font-semibold">verified_user</span>
                <div>
                  <h4 className="text-lg font-bold mb-1">Identity Check</h4>
                  <p className="text-base">Matching your name and birth date ensures your medical records are always accurate.</p>
                </div>
              </div>
            </div>

            {/* Photo anchor card */}
            <div className="relative h-48 rounded-xl overflow-hidden border-2 border-[#c3c6d6] group mb-8">
              <img 
                alt="Healthcare Trust" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV0eTqFib2AtW-aoqxl0cItVs4d9IKOEtsAUhVcUoMcpj0SNHG_PRybMr9kgdbaNcr2qYgfjOOtDMtm6CV1CnA1DP1MfL0cnIGk-DJ4SkD36IBOKYxWTbdMAjMzfAwy7JaE4wfEkfQ9b3Uv0RoDjmy0OFOzb2O7rzL0ywpUc-lQsnI-3WY18C_B1by-fRAQHCAQ5GZMwVwDkPvOrtAz2IZh3aBUR28e-9QP7pulYuebXFFLMGsKG06HNPnrvYjWcciBvxitp4jDA"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0040a1]/80 to-transparent flex items-end p-6">
                <p className="text-white text-lg font-semibold">Your patient data is fully encrypted and secure at all times.</p>
              </div>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <section>
              <h2 className="text-4xl font-bold tracking-tight mb-3">What are your health focus areas?</h2>
              <p className="text-xl text-[#424654]">
                This helps customize the list of recommended subsidies, local volunteer services and alerts matching your daily lifestyle needs.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conditions.map((cond) => {
                const selected = chronicConditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => toggleCondition(cond)}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      selected 
                        ? 'border-[#0040a1] bg-[#dae2ff] text-[#001847]' 
                        : 'border-[#c3c6d6] bg-white text-[#1a1c1e] hover:bg-[#f3f3f6]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">{cond}</span>
                      <span className="material-symbols-outlined text-2xl font-bold">
                        {selected ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </div>
                    <p className="text-sm text-[#424654] mt-2">
                      {cond === 'Hypertension' && 'Monitors blood pressure, medication lists and refills.'}
                      {cond === 'Diabetes' && 'Tracks insulin routines, diabetic friendly checkups.'}
                      {cond === 'High Cholesterol' && 'Subsidizes cholesterol medicines like Lipis and Statins.'}
                      {cond === 'General Health & Wellness' && 'Keeps steps, physical pulse, general vitamins.'}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="p-6 bg-[#dae2ff] rounded-xl border-2 border-[#0040a1] text-[#001847] flex gap-3">
              <span className="material-symbols-outlined text-2xl">info</span>
              <p className="text-base font-medium">
                Tip: You can change or edit these focus areas at any time in the future from your profile tab inside the dashboard.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 text-center py-8">
            <div className="w-24 h-24 bg-[#a0f2af] rounded-full flex items-center justify-center mx-auto text-[#1e713b]">
              <span className="material-symbols-outlined text-5xl font-extrabold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>

            <section className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tight text-[#0040a1]">You are all set, {name}!</h2>
              <p className="text-xl text-[#424654] max-w-lg mx-auto leading-relaxed">
                Your secure health file has been opened dynamically. CareConnect is ready to help you coordinate medication timers, book professional doctors, and access volunteer support.
              </p>
            </section>

            <div className="bg-white p-6 rounded-xl border-2 border-[#c3c6d6] text-left max-w-md mx-auto space-y-3">
              <h3 className="font-bold text-[#1a1c1e] border-b pb-2 mb-2">Registration Receipt</h3>
              <p className="flex justify-between"><strong>Patient:</strong> <span>{name}</span></p>
              <p className="flex justify-between"><strong>DOB:</strong> <span>{dob}</span></p>
              <p className="flex justify-between"><strong>Emergency Line:</strong> <span>{emergencyContact}</span></p>
              <p className="flex justify-between"><strong>Focus:</strong> <span>{chronicConditions.join(', ') || 'General Wellness'}</span></p>
            </div>
          </div>
        )}
      </main>

      {/* Persistent sticky footer for next steps */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#c3c6d6] z-50 py-4 shadow-lg">
        <div className="max-w-[800px] mx-auto px-6">
          <button
            onClick={handleNext}
            className="w-full min-h-[64px] bg-[#0040a1] hover:bg-[#003080] text-white active:scale-95 transition-all text-xl font-bold rounded-xl flex items-center justify-center gap-2 shadow"
          >
            {step < 3 ? 'Next' : 'Enter Dashboard'}
            <span className="material-symbols-outlined font-bold">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
