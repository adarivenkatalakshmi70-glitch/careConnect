import React, { useState } from 'react';

export const SubsidiesTab: React.FC = () => {
  // Eligibility Tool state
  const [checkerStep, setCheckerStep] = useState<number>(1);
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [concessionCard, setConcessionCard] = useState<string | null>(null);

  // Application dialog
  const [applyingProgram, setApplyingProgram] = useState<string | null>(null);
  const [appMobile, setAppMobile] = useState<string>('');
  const [appCode, setAppCode] = useState<string>('');
  const [successApply, setSuccessApply] = useState<boolean>(false);

  // Safety net tracker values
  const [spentIndividual, setSpentIndividual] = useState<number>(240.00);
  const [spentConcession, setSpentConcession] = useState<number>(24.50);
  const [showAddSpend, setShowAddSpend] = useState<boolean>(false);
  const [extraSpend, setExtraSpend] = useState<string>('');

  // Call simulation
  const [onActiveCall, setOnActiveCall] = useState<boolean>(false);

  const resetChecker = () => {
    setCheckerStep(1);
    setAgeGroup(null);
    setConcessionCard(null);
  };

  const handleApplyNow = (programName: string) => {
    setApplyingProgram(programName);
    setSuccessApply(false);
  };

  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appMobile) {
      alert('Please provide contact number.');
      return;
    }
    setSuccessApply(true);
    setTimeout(() => {
      setApplyingProgram(null);
    }, 2500);
  };

  const handleAddSpendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(extraSpend);
    if (!isNaN(val) && val > 0) {
      setSpentConcession(prev => Math.min(36.00, prev + val));
      setSpentIndividual(prev => prev + val);
      setExtraSpend('');
      setShowAddSpend(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Intro section */}
      <section className="mt-2">
        <h2 className="text-3xl font-extrabold text-[#1a1c1e] mb-2">Subsidized Medicine</h2>
        <p className="text-xl text-[#424654] leading-relaxed">
          Find financial support for your essential prescriptions and healthcare needs. Use the eligibility checkers below to qualify instantly.
        </p>
      </section>

      {/* SEC 1: BENTO STYLE ELIGIBILITY CHECKER */}
      <section className="bg-[#0056d2] text-white p-6 rounded-xl border-2 border-[#0040a1] shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            fact_check
          </span>
          <h3 className="text-2xl font-bold">Eligibility Checker</h3>
        </div>
        <p className="text-base mb-6 text-blue-100">
          Answer simple questions to see which medical programs you qualify for today.
        </p>

        <div className="bg-white text-slate-900 p-6 rounded-xl border-2 border-[#c3c6d6]" id="eligibility-tool">
          {checkerStep === 1 && (
            <div id="q1">
              <label className="text-lg font-bold block mb-4">What is your age group?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setAgeGroup('Under 65');
                    setCheckerStep(2);
                  }}
                  className="w-full min-h-[56px] border-2 border-[#737785] hover:border-[#0040a1] hover:bg-slate-50 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Under 65
                </button>
                <button
                  onClick={() => {
                    setAgeGroup('65 or Older');
                    setCheckerStep(2);
                  }}
                  className="w-full min-h-[56px] border-2 border-[#737785] hover:border-[#0040a1] hover:bg-slate-50 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  65 or Older
                </button>
              </div>
            </div>
          )}

          {checkerStep === 2 && (
            <div id="q2" className="animate-in fade-in duration-200">
              <label className="text-lg font-bold block mb-4">
                Do you possess an active Pensioner Concession Card?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setConcessionCard('Yes');
                    setCheckerStep(3);
                  }}
                  className="w-full min-h-[56px] border-2 border-[#737785] hover:border-[#0040a1] hover:bg-slate-50 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setConcessionCard('No');
                    setCheckerStep(3);
                  }}
                  className="w-full min-h-[56px] border-2 border-[#737785] hover:border-[#0040a1] hover:bg-slate-50 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  No
                </button>
              </div>
              <button
                onClick={() => setCheckerStep(1)}
                className="mt-4 text-xs font-bold text-[#0040a1] block hover:underline"
              >
                ← Back to Age Focus
              </button>
            </div>
          )}

          {checkerStep === 3 && (
            <div id="result" className="text-center py-4 animate-in zoom-in-95 duration-200">
              <span className="material-symbols-outlined text-[#186c37] text-6xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <p className="text-2xl font-bold text-[#186c37] mb-2">You may be eligible!</p>
              
              <div className="bg-[#a0f2af]/30 p-4 rounded-lg text-left max-w-sm mx-auto text-sm my-4 border border-[#a0f2af] space-y-1">
                <p><strong>Age Category:</strong> {ageGroup}</p>
                <p><strong>Pension Concession:</strong> {concessionCard}</p>
                <p className="text-[#1e713b] font-bold mt-1">Recommended program: {ageGroup === '65 or Older' ? 'Senior Health Subsidy' : 'Safety Net Threshold & Family caps'}</p>
              </div>

              <p className="text-base text-slate-500 mb-4">
                Based on your answers, you qualify for the subsidies detailed below.
              </p>
              <button onClick={resetChecker} className="text-[#0040a1] font-bold hover:underline">
                Reset Eligibiliy Tool & Start Over
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SEC 2: SUBSIDY PROGRAMS DIRECTORY */}
      <section className="space-y-8">
        <h3 className="text-2xl font-bold text-[#1a1c1e] border-b-2 border-slate-200 pb-2">Available Subsidies</h3>

        {/* PROG 1: Senior Health Subsidy */}
        <div className="bg-white border-2 border-[#c3c6d6] rounded-xl overflow-hidden shadow-sm hover:border-[#0040a1] transition-all">
          <div className="h-48 relative">
            <img
              alt="Pharmacist application organizer representation"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdhZAprkkILhhR2_pedLqaZdDW9LDoH9dBDvOSdbLCk9tXuKcv6TIIBNJyHNgOGCQO33_dNApMJBW9JH2k4-G0tydjGwoE0VyHgmMNMtVPWmIoPF_pUxaAX7ZpTFhOBgIktaNKPIVwSg3NgRzmzjZox8qqVsF1J_b_kSxsT6HlUa4WyHdJc1iwPhdMO5RpKKLW32hRL6GumyBUO-r4Khl8nl5E-jIAcXAubJNkf1PoUegecJax-eNwqyLdU1O4fcjebWzgww4Jow"
            />
            <div className="absolute top-4 right-4 bg-[#186c37] text-white px-4 py-1.5 rounded-full font-bold text-sm shadow">
              Active Today
            </div>
          </div>
          <div className="p-6">
            <h4 className="text-2xl font-extrabold text-[#1a1c1e] mb-2">Senior Health Subsidy</h4>
            <p className="text-lg text-[#424654] mb-4">
              Reduces the cost of essential chronic hypertension and diabetes medications by up to 80% for citizens over 65.
            </p>
            <div className="bg-[#f3f3f6] p-4 rounded-lg mb-6 border-l-4 border-[#0040a1]">
              <p className="text-base font-bold text-[#0040a1] mb-1">Checklist Eligibility Criteria:</p>
              <ul className="text-base space-y-1 text-[#424654] font-medium">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
                  Aged 65+ years
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
                  Declared Low-income threshold
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
                  Resident in active zones for 5+ years
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleApplyNow('Senior Health Subsidy')}
              className="w-full min-h-[56px] bg-[#0040a1] hover:bg-[#003080] text-white font-bold text-lg rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Apply Program Now
            </button>
          </div>
        </div>

        {/* PROG 2: Safety Net Threshold Tracker */}
        <div className="bg-white border-2 border-[#c3c6d6] rounded-xl overflow-hidden p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-2xl font-extrabold text-[#1a1c1e]">Safety Net Threshold</h4>
              <p className="text-sm font-semibold text-[#424654] mt-0.5">Government Auto Health Cap</p>
            </div>
            <span className="bg-[#e8e8ea] text-[#424654] px-4 py-1 rounded-full font-bold text-sm">
              Automatic
            </span>
          </div>
          <p className="text-lg text-[#424654] mb-4">
            Once you spend cumulative limits on medicines in a year, further prescriptions are 100% free or capped at concession rates.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="border-2 border-[#c3c6d6] p-4 rounded-xl text-center">
              <p className="font-bold text-slate-500 uppercase tracking-wide text-xs">Individual Limit</p>
              <p className="text-3xl font-extrabold text-[#0040a1] mt-1">${spentIndividual.toFixed(1)} / $240.00</p>
              <div className="w-full bg-slate-200 h-2.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-[#0040a1] h-full" 
                  style={{ width: `${Math.min(100, (spentIndividual / 240) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="border-2 border-[#186c37] bg-[#a0f2af]/10 p-4 rounded-xl text-center">
              <p className="font-bold text-[#1e713b] uppercase tracking-wide text-xs">Concession Card Cap</p>
              <p className="text-3xl font-extrabold text-[#186c37] mt-1">
                ${spentConcession.toFixed(1)} / $36.00
              </p>
              <div className="w-full bg-[#186c37]/20 h-2.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-[#186c37] h-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (spentConcession / 36) * 100)}%` }}
                ></div>
              </div>
              {spentConcession >= 36 ? (
                <span className="text-xs font-bold text-[#186c37] mt-1 block">✓ Free Medicines Unlocked!</span>
              ) : (
                <span className="text-xs font-semibold text-slate-500 mt-1 block">
                  ${(36.00 - spentConcession).toFixed(1)} left to unlock FREE limit
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {showAddSpend ? (
              <form onSubmit={handleAddSpendSubmit} className="flex gap-2 items-center bg-slate-50 p-4 rounded-lg border border-[#c3c6d6] max-w-sm mx-auto animate-in slide-in-from-top duration-200">
                <div className="flex-1">
                  <label className="text-xs font-bold block mb-1">Receipt cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 12.50"
                    value={extraSpend}
                    onChange={(e) => setExtraSpend(e.target.value)}
                    className="w-full min-h-[40px] px-2 border border-slate-400 bg-white rounded text-sm text-center"
                    required
                  />
                </div>
                <div className="flex gap-1.5 self-end">
                  <button type="submit" className="h-10 px-4 bg-[#186c37] text-white text-xs rounded font-bold hover:brightness-110">
                    Add
                  </button>
                  <button type="button" onClick={() => setShowAddSpend(false)} className="text-xs text-red-600 font-bold px-2">
                    X
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowAddSpend(true)}
                className="w-full min-h-[56px] border-2 border-[#0040a1] text-[#0040a1] font-bold text-lg rounded-xl hover:bg-[#dae2ff] transition-all cursor-pointer shadow-sm"
              >
                View My Progress & Log Receipt
              </button>
            )}
          </div>
        </div>

        {/* PROG 3: Rural Access Grant */}
        <div className="bg-white border-2 border-[#c3c6d6] rounded-xl overflow-hidden shadow-sm hover:border-[#0040a1] transition-all">
          <div className="h-48 relative">
            <img
              alt="Professional speaking kindly to patient"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS5TOTya9Zy3hz_NsffShzXKJ5gU9Oy20GZq-aJLGG06TJzo0MZzjMs-fnnsOBYVniDPObOSc-Sv_E1YO6x_RhDu8QdtcJXcTi-GV3vhK1NqWBGATE4APbU0iDT8dhPoMsZ7hg2_qPwaUwi-78IBPwSEF6GyurGvb4xXiIFWcDge9y0W6VhJmPnfHuB7Le_DMGM75lSROlQZzxanOq_N_lB55ITJROg_RBaKPMRc3jzowhwGePuKakJxY_2EnhYn64VuFZf15FaQ"
            />
          </div>
          <div className="p-6">
            <h4 className="text-2xl font-extrabold text-[#1a1c1e] mb-2">Rural Access Grant</h4>
            <p className="text-lg text-[#424654] mb-4">
              Direct travel and home prescription delivery subsidies for elderly patients living more than 50km from a specialized base clinic.
            </p>
            <div className="bg-[#f3f3f6] p-4 rounded-lg mb-6 border-l-4 border-[#940010]">
              <p className="text-base font-bold text-[#940010] mb-1">Grant Verification:</p>
              <p className="text-[#424654] font-medium leading-normal">
                Requires direct residential verification via a recent municipal electricity bill or registered government photo ID.
              </p>
            </div>
            <button
              onClick={() => handleApplyNow('Rural Access Grant')}
              className="w-full min-h-[56px] bg-[#0040a1] hover:bg-[#003080] text-white font-bold text-lg rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Apply Program Now
            </button>
          </div>
        </div>
      </section>

      {/* REGISTRATION FORM OVERLAY */}
      {applyingProgram && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form onSubmit={submitApplication} className="bg-white rounded-2xl border-2 border-[#0040a1] p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="text-xl font-bold text-[#0040a1]">Apply: {applyingProgram}</h4>
              <button
                type="button"
                onClick={() => setApplyingProgram(null)}
                className="text-red-600 font-extrabold text-lg"
              >
                x
              </button>
            </div>

            {successApply ? (
              <div className="text-center py-6 animate-in zoom-in-95 duration-200 space-y-3">
                <span className="material-symbols-outlined text-[#186c37] text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <h5 className="text-lg font-bold text-[#186c37]">Application Dispatched</h5>
                <p className="text-sm text-[#424654]">
                  A medical subsidies case officer will reach out to you via SMS shortly. Thank you.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-[#424654]">
                  Enter your contact details. A social healthcare worker will assist you in lodging the formal request securely.
                </p>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#1a1c1e]">Call back Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. (555) 0199"
                    value={appMobile}
                    onChange={(e) => setAppMobile(e.target.value)}
                    required
                    className="min-h-[48px] border-2 border-[#737785] rounded-xl px-3 outline-none focus:border-[#0040a1]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#1a1c1e]">Medicare ID / Concession Card Code</label>
                  <input
                    type="text"
                    placeholder="e.g. MC-1299-X"
                    value={appCode}
                    onChange={(e) => setAppCode(e.target.value)}
                    className="min-h-[48px] border-2 border-[#737785] rounded-xl px-3 outline-none focus:border-[#0040a1]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[56px] bg-[#0040a1] text-white font-bold rounded-xl text-lg hover:bg-[#003080] transition-colors"
                >
                  Submit Pre-Application
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* HELPLINE HELPMATE SUPPORT BLOCK */}
      <section className="bg-[#eeeef0] p-8 rounded-xl text-center border-2 border-[#c3c6d6] relative">
        <h3 className="text-2xl font-extrabold mb-1">Need Direct Assistance?</h3>
        <p className="text-base text-[#424654] mb-6">
          Our government welfare support team is available 24/7 to help seniors process their applications.
        </p>

        {onActiveCall ? (
          <div className="bg-[#ba1b20] text-white p-4 rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white animate-in zoom-in duration-200">
            <span className="material-symbols-outlined text-4xl animate-bounce">call</span>
            <p className="font-bold text-lg">Simulating Dialing: 1800 555 0199</p>
            <p className="text-xs opacity-80 animate-pulse">Your CareConnect speaker is active...</p>
            <button
              onClick={() => setOnActiveCall(false)}
              className="mt-3 bg-white text-red-600 px-6 py-2 rounded-full font-bold text-xs"
            >
              Hang Up
            </button>
          </div>
        ) : (
          <button
            onClick={() => setOnActiveCall(true)}
            className="inline-flex items-center justify-center gap-3 w-full min-h-[64px] bg-[#940010] hover:bg-[#ba1b20] text-white rounded-xl active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-2xl">call</span>
            <span className="text-xl font-bold tracking-wider">1800 555 0199</span>
          </button>
        )}

        <p className="text-xs font-bold text-[#737785] mt-4">
          Free-call dispatch hotline for pensioner concession card holders.
        </p>
      </section>
    </div>
  );
};
