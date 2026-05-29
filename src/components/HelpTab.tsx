import React, { useState, useEffect, useRef } from 'react';
import { Volunteer, ChatMessage, HelpRequest } from '../types';
import { VOLUNTEERS } from '../data';

interface HelpTabProps {
  onTriggerSOS: () => void;
}

export const HelpTab: React.FC<HelpTabProps> = ({ onTriggerSOS }) => {
  const [activeChatVolunteer, setActiveChatVolunteer] = useState<Volunteer | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [typingInput, setTypingInput] = useState<string>('');

  // Custom request states
  const [showRequestForm, setShowRequestForm] = useState<boolean>(false);
  const [requestDetails, setRequestDetails] = useState<string>('');
  const [activeRequests, setActiveRequests] = useState<HelpRequest[]>([]);
  const [broadcastProgress, setBroadcastProgress] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll inside chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChatVolunteer]);

  const openChatForVolunteer = (vol: Volunteer) => {
    setActiveChatVolunteer(vol);
    // Initialize standard message if first time chatting
    if (!chatMessages[vol.id]) {
      setChatMessages(prev => ({
        ...prev,
        [vol.id]: [
          {
            id: 'init-msg',
            sender: 'volunteer',
            text: `Hello! I'm ${vol.name}. I read that you're nearby and I have some free hours today. How can I assist you?`,
            timestamp: 'Just now'
          }
        ]
      }));
    }
  };

  const handleSendMessage = () => {
    if (!activeChatVolunteer || !typingInput.trim()) return;
    const volId = activeChatVolunteer.id;
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: typingInput,
      timestamp: 'Today'
    };

    setChatMessages(prev => ({
      ...prev,
      [volId]: [...(prev[volId] || []), userMsg]
    }));

    const userTextCopy = typingInput;
    setTypingInput('');

    // Simulated volunteer response timeout
    setTimeout(() => {
      let replyText = `I'd be absolutely happy to help with that! Let me head over to your area soon. I will message you when I'm 5 minutes away.`;
      
      // Smart contextual responses
      const textLower = userTextCopy.toLowerCase();
      if (textLower.includes('grocery') || textLower.includes('buying') || textLower.includes('shop')) {
        replyText = `Understood! I will pick up your groceries. Could you write me down a list of items and which store you prefer? I can go to the corner store or pharmacy.`;
      } else if (textLower.includes('walk') || textLower.includes('park') || textLower.includes('outside')) {
        replyText = `A walk sounds wonderful! It is a lovely sunny day. I can accompany you right to the main park and back. Let me grab some water bottles.`;
      } else if (textLower.includes('hello') || textLower.includes('hi')) {
        replyText = `Hi there! I was just organizing some garden tools. I'm completely free and happy to chat or help with household chores.`;
      }

      const volunteerReply: ChatMessage = {
        id: Math.random().toString(),
        sender: 'volunteer',
        text: replyText,
        timestamp: 'Just now'
      };

      setChatMessages(prev => ({
        ...prev,
        [volId]: [...(prev[volId] || []), volunteerReply]
      }));
    }, 1200);
  };

  const handleBroadcastRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestDetails.trim()) return;

    // Show broadcast animations
    setBroadcastProgress('Broadcasting secure request securely to verified volunteers within 2.5km...');
    
    setTimeout(() => {
      setBroadcastProgress('Checking safety credentials and medical backup...');
    }, 1500);

    setTimeout(() => {
      const newReq: HelpRequest = {
        id: Math.random().toString(),
        type: 'Custom Assistance',
        details: requestDetails,
        status: 'Accepted',
        volunteerName: 'Sarah Jenkins'
      };

      setActiveRequests(prev => [newReq, ...prev]);
      setBroadcastProgress(null);
      setShowRequestForm(false);
      setRequestDetails('');

      // Open message modal with the accepting volunteer Sarah Jenkins
      const sarahVol = VOLUNTEERS.find(v => v.name === 'Sarah Jenkins') || VOLUNTEERS[0];
      openChatForVolunteer(sarahVol);

      // Inject notification from Sarah saying she accepted
      setTimeout(() => {
        setChatMessages(prev => {
          const arr = prev[sarahVol.id] || [];
          return {
            ...prev,
            [sarahVol.id]: [
              ...arr,
              {
                id: 'accept-broadcast-msg',
                sender: 'volunteer',
                text: `Hi Martha! I just saw your request: "${newReq.details}" and I've accepted it. I will grab my gear and walk over!`,
                timestamp: 'Just now'
              }
            ]
          };
        });
      }, 500);

    }, 3000);
  };

  const triggerSpecificRequest = (title: string) => {
    setRequestDetails(`Help request for: ${title}`);
    setShowRequestForm(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Safety Verification Banner */}
      <section className="bg-[#a0f2af] text-[#1a1c1e] rounded-xl p-6 border-2 border-[#c3c6d6] flex items-start gap-4">
        <span className="material-symbols-outlined text-4xl text-[#186c37]" style={{ fontVariationSettings: "'FILL' 1" }}>
          verified_user
        </span>
        <div>
          <h2 className="text-xl font-bold text-[#1e713b] mb-1">Safety First</h2>
          <p className="text-base text-[#1a1c1e]">
            Every volunteer in our hub has passed a comprehensive criminal background check and in-person ID verification. We prioritize your peace of mind.
          </p>
        </div>
      </section>

      {/* Request Help Action */}
      <section className="space-y-4">
        <h3 className="text-2xl font-bold text-[#101010]">How can we help today?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => triggerSpecificRequest('Grocery Pickup')}
            className="flex flex-col items-center justify-center p-6 bg-white border-2 border-[#c3c6d6] rounded-xl hover:border-[#0040a1] hover:bg-[#f3f3f6] transition-colors active:scale-95 min-h-[140px] cursor-pointer"
          >
            <span className="material-symbols-outlined text-4xl text-[#0040a1] mb-2">shopping_basket</span>
            <span className="text-lg font-bold">Grocery Pickup</span>
          </button>
          
          <button
            onClick={() => triggerSpecificRequest('A Walk in the Park')}
            className="flex flex-col items-center justify-center p-6 bg-white border-2 border-[#c3c6d6] rounded-xl hover:border-[#0040a1] hover:bg-[#f3f3f6] transition-colors active:scale-95 min-h-[140px] cursor-pointer"
          >
            <span className="material-symbols-outlined text-4xl text-[#0040a1] mb-2">park</span>
            <span className="text-lg font-bold">A Walk in the Park</span>
          </button>
        </div>

        {showRequestForm ? (
          <form onSubmit={handleBroadcastRequest} className="bg-white p-6 rounded-xl border-2 border-[#0040a1] space-y-4 shadow-sm">
            <h4 className="font-bold text-lg text-[#0040a1]">Describe Help Needed</h4>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500">Requirements / Details</label>
              <textarea
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                placeholder="e.g. Please pick up bread, milk, and blood pressure pills from Walgreens corner store."
                className="p-3 border-2 border-[#737785] rounded-xl font-medium focus:border-[#0040a1] focus:ring-0 outline-none w-full"
                rows={3}
                required
              ></textarea>
            </div>

            {broadcastProgress ? (
              <div className="bg-[#dae2ff] p-4 rounded-xl border border-[#b2c5ff] text-center text-[#001847] flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
                <span className="text-sm font-semibold">{broadcastProgress}</span>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 min-h-[48px] border-2 border-[#737785] rounded-lg font-bold hover:bg-slate-50 text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[48px] bg-[#0040a1] hover:bg-[#003080] text-white rounded-lg font-bold"
                >
                  Broadcast Request
                </button>
              </div>
            )}
          </form>
        ) : (
          <button
            onClick={() => setShowRequestForm(true)}
            className="w-full min-h-[64px] bg-[#0040a1] hover:bg-[#003080] text-white font-bold text-lg rounded-xl shadow active:scale-95 transition-all uppercase tracking-wider cursor-pointer"
          >
            Create Custom Request
          </button>
        )}
      </section>

      {/* ACTIVE BROADCASTS */}
      {activeRequests.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xl font-bold text-[#101010]">Requested Job Statuses</h3>
          <div className="space-y-3">
            {activeRequests.map(req => (
              <div key={req.id} className="bg-white p-4 rounded-xl border-2 border-[#c3c6d6] flex justify-between items-center shadow-sm">
                <div>
                  <h4 className="font-bold text-lg">{req.type}</h4>
                  <p className="text-sm font-medium text-[#424654]">{req.details}</p>
                  {req.volunteerName && (
                    <p className="text-[#186c37] text-xs font-bold mt-1">
                      Accepted by volunteer: {req.volunteerName} (Sarah Jenkins)
                    </p>
                  )}
                </div>
                <div className="bg-[#a0f2af] text-[#1e713b] text-xs font-bold px-3 py-1.5 rounded-full border border-[#1e713b]">
                  {req.status === 'Accepted' ? 'Matched' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BROWSE VOLUNTEERS */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="text-2xl font-bold text-[#1a1c1e]">Nearby Volunteers</h3>
          <span className="text-[#0040a1] font-bold text-base underline">3 Active Today</span>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
          {VOLUNTEERS.map((vol) => (
            <div
              key={vol.id}
              className="min-w-[280px] max-w-[290px] bg-white border-2 border-[#c3c6d6] rounded-xl overflow-hidden flex flex-col shadow-sm"
            >
              <img
                className="h-44 w-full object-cover shrink-0"
                alt={`Portrait photograph of volunteer ${vol.name}`}
                src={vol.image}
              />
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-[#1a1c1e]">{vol.name}</h4>
                  <div className="flex items-center text-[#186c37] font-bold">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="text-xs ml-0.5">{vol.rating}</span>
                  </div>
                </div>
                
                <p className="text-base text-[#424654] italic flex-grow">"{vol.quote}"</p>
                
                <button
                  onClick={() => openChatForVolunteer(vol)}
                  className="mt-4 w-full h-12 border-2 border-[#0040a1] text-[#0040a1] font-bold text-base rounded-xl hover:bg-[#dae2ff] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  Message {vol.name.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HELPLINE OR SOS ALTERNATIVE BAR */}
      <section>
        <button
          onClick={onTriggerSOS}
          className="w-full h-[64px] bg-[#940010] hover:bg-[#73000b] text-white font-extrabold uppercase tracking-wide rounded-xl shadow-md active:brightness-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-3xl">emergency</span>
          EMERGENCY SOS
        </button>
        <p className="text-center text-xs text-[#737785] font-bold mt-2">Immediate connection to local dispatch services</p>
      </section>

      {/* CHAT MODAL BOTTOM SHEET OVERLAY */}
      {activeChatVolunteer && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-md h-[560px] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl relative border-t sm:border-2 border-[#0040a1] animate-in slide-in-from-bottom duration-300">
            {/* Header info */}
            <div className="p-4 border-b-2 border-[#c3c6d6] flex justify-between items-center bg-slate-50 rounded-t-3xl sm:rounded-t-[22px]">
              <div className="flex items-center gap-3">
                <img
                  src={activeChatVolunteer.image}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#0040a1]"
                  alt={activeChatVolunteer.name}
                />
                <div>
                  <h4 className="font-bold text-lg text-slate-900">{activeChatVolunteer.name}</h4>
                  <p className="text-sm text-[#186c37] font-bold flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#186c37] inline-block animate-[pulse_1.5s_infinite]"></span>
                    Nearby & Active
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveChatVolunteer(null)}
                className="material-symbols-outlined text-3xl p-2 text-slate-500 hover:text-slate-900 hover:bg-[#eeeef0] rounded-full"
              >
                close
              </button>
            </div>

            {/* Chat message logs */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-100 flex flex-col">
              {(chatMessages[activeChatVolunteer.id] || []).map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-base leading-relaxed ${
                        isUser
                          ? 'bg-[#0040a1] text-white rounded-br-none shadow'
                          : 'bg-white text-slate-900 rounded-bl-none border border-[#c3c6d6]'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`text-[10px] block mt-1 text-right ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Form messaging input block */}
            <div className="p-4 bg-white border-t border-[#c3c6d6] rounded-b-3xl">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Type a helper instructions message..."
                  value={typingInput}
                  onChange={(e) => setTypingInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-grow border-2 border-[#737785] rounded-xl min-h-[56px] px-4 text-base font-semibold focus:border-[#0040a1] focus:ring-0 outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="bg-[#0040a1] hover:bg-[#003080] text-white w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow active:scale-95 transition-all text-xl"
                >
                  <span className="material-symbols-outlined leading-none">send</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
