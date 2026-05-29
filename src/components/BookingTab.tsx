import React, { useState } from 'react';
import { Doctor, Appointment, DoctorSpecialty } from '../types';
import { DOCTORS } from '../data';

interface BookingTabProps {
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onCancelAppointment: (id: string) => void;
}

export const BookingTab: React.FC<BookingTabProps> = ({
  appointments,
  onAddAppointment,
  onCancelAppointment
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<DoctorSpecialty | 'All'>('All');
  
  // Booking Modal States
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('Today, Tuesday 13');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');
  const [symptoms, setSymptoms] = useState<string>('');
  const [successBooking, setSuccessBooking] = useState<Appointment | null>(null);

  const specialties: (DoctorSpecialty | 'All')[] = [
    'All',
    'General Physician',
    'Heart Specialist',
    'Eye Doctor',
    'Dermatologist'
  ];

  const timeSlots = ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '4:45 PM'];
  const dates = ['Today, Tuesday 13', 'Tomorrow, Wednesday 14', 'Thursday 15', 'Friday 16'];

  // Filter doctors
  const filteredDoctors = DOCTORS.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBook = () => {
    if (!selectedDoctor) return;
    const appointmentDetails = {
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      dateTime: selectedDate,
      timeSlot: selectedSlot,
      notes: symptoms || 'Routine Checkup'
    };
    onAddAppointment(appointmentDetails);
    
    // Save locally for UI confirmation
    setSuccessBooking({
      id: Math.random().toString(),
      ...appointmentDetails
    });
    
    // Reset modal states
    setSelectedDoctor(null);
    setSymptoms('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Search Input Bar */}
      <section className="mt-2">
        <label className="sr-only">Search Doctors</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-[#737785]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a Doctor by Name or Specialty"
            className="w-full min-h-[64px] pl-12 pr-12 bg-white border-2 border-[#737785] text-lg font-bold rounded-xl focus:border-[#0040a1] focus:ring-0 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737785] hover:text-[#0040a1]"
            >
              <span className="material-symbols-outlined text-[28px]">close</span>
            </button>
          )}
        </div>
      </section>

      {/* Filter Chips Horizontal Section */}
      <section>
        <div className="flex overflow-x-auto gap-3 py-1 hide-scrollbar">
          {specialties.map((spec) => {
            const isSelected = selectedSpecialty === spec;
            return (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`flex-shrink-0 px-6 py-3 rounded-full border-2 text-base font-bold active:scale-95 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#0040a1] bg-[#0040a1] text-white shadow'
                    : 'border-[#737785] bg-white text-[#424654] hover:bg-[#f3f3f6]'
                }`}
              >
                {spec}
              </button>
            );
          })}
        </div>
      </section>

      {/* CURRENT ACTIVE BOOKINGS */}
      {appointments.length > 0 && (
        <section className="bg-[#dae2ff] p-6 rounded-xl border-2 border-[#0040a1]">
          <h3 className="text-xl font-bold text-[#001847] mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">event_upcoming</span>
            Your Booked Consultations
          </h3>
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div key={appt.id} className="bg-white p-4 rounded-lg border border-[#c3c6d6] flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#0040a1] text-lg">{appt.doctorName}</h4>
                  <p className="text-sm font-semibold text-[#424654]">{appt.doctorSpecialty}</p>
                  <p className="text-sm font-bold text-[#186c37] mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                    {appt.dateTime} at {appt.timeSlot}
                  </p>
                </div>
                <button
                  onClick={() => onCancelAppointment(appt.id)}
                  className="bg-[#ffdad6] hover:bg-[#ffb3ac] text-[#930010] p-2 text-sm font-bold rounded-lg border border-[#ffb3ac]"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DOCTORS DIRECTORY */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-[#1a1c1e] border-b pb-2">Medical Directory</h3>
        
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredDoctors.map((doc) => {
              const hasApptWithThisDoc = appointments.some(a => a.doctorId === doc.id);

              return (
                <article
                  key={doc.id}
                  className="bg-white border-2 border-[#c3c6d6] rounded-xl overflow-hidden shadow-sm hover:border-[#0040a1] transition-all"
                >
                  <div className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    {/* Doctor Headshot with Available tag */}
                    <div className="relative w-full sm:w-40 aspect-square rounded-lg overflow-hidden border-2 border-[#c3c6d6] shrink-0">
                      <img
                        alt={`Portrait of ${doc.name}`}
                        className="w-full h-full object-cover"
                        src={doc.image}
                      />
                      {doc.availableToday && (
                        <div className="absolute bottom-2 right-2 bg-[#186c37] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                          <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse border border-[#186c37]"></span>
                          Available Today
                        </div>
                      )}
                    </div>

                    {/* Dr details */}
                    <div className="flex-1 space-y-2">
                      <h4 className="text-3xl font-extrabold text-[#1a1c1e]">{doc.name}</h4>
                      <p className="text-lg font-bold text-[#424654]">{doc.specialty} • {doc.experience} Years Exp.</p>
                      <div className="flex items-center gap-1 text-[#186c37] text-base font-bold">
                        <span className="material-symbols-outlined text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        <span>{doc.rating} ({doc.reviewsCount}+ Reviews)</span>
                      </div>
                      {!doc.availableToday && (
                        <p className="text-[#940010] text-sm font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          Next Available: {doc.nextAvailable}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Booking CTA trigger */}
                  <div className="px-6 pb-6">
                    {hasApptWithThisDoc ? (
                      <button
                        disabled
                        className="w-full min-h-[56px] bg-[#e8e8ea] text-[#737785] font-bold rounded-xl flex items-center justify-center gap-2 border border-[#c3c6d6] cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined">verified</span>
                        Appointment Already Scheduled
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedDoctor(doc)}
                        className="w-full min-h-[56px] bg-[#0040a1] hover:bg-[#003080] text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm"
                      >
                        <span className="material-symbols-outlined">calendar_month</span>
                        {doc.availableToday ? 'Book Appointment' : 'View Schedule & Register'}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#f3f3f6] rounded-xl border-2 border-dashed border-[#c3c6d6]">
            <p className="text-lg text-[#737785] font-bold">No doctors found matching "{searchQuery}" in "{selectedSpecialty}".</p>
          </div>
        )}
      </section>

      {/* BOOKING MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-[#0040a1] max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h4 className="text-2xl font-bold text-[#0040a1]">Consultation Setup</h4>
                <p className="text-sm font-semibold text-[#424654]">With {selectedDoctor.name}</p>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="w-10 h-10 hover:bg-[#eeeef0] rounded-full flex items-center justify-center text-red-600 font-extrabold text-lg"
              >
                x
              </button>
            </div>

            {/* Selection values */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#424654]">Choose Appointment Date</label>
                <div className="grid grid-cols-2 gap-2">
                  {dates.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`p-2.5 text-xs font-bold rounded-lg border-2 text-center transition-all ${
                        selectedDate === d
                          ? 'border-[#0040a1] bg-[#dae2ff] text-[#001847]'
                          : 'border-[#c3c6d6] bg-white text-[#424654] hover:bg-slate-50'
                      }`}
                    >
                      {d.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#424654]">Choose Time Slot</label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 px-4 text-xs font-bold rounded-lg border-2 text-center transition-all ${
                        selectedSlot === slot
                          ? 'border-[#0040a1] bg-[#dae2ff] text-[#001847]'
                          : 'border-[#c3c6d6] bg-white text-[#424654] hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#424654]" htmlFor="symptoms">Describe Symptoms or Notes (Optional)</label>
                <textarea
                  id="symptoms"
                  rows={3}
                  placeholder="e.g. Regular health checkup focus or headache monitoring"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="p-3 border-2 border-[#737785] rounded-xl text-sm font-medium focus:border-[#0040a1] focus:ring-0 outline-none w-full"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setSelectedDoctor(null)}
                className="flex-1 min-h-[56px] border-2 border-[#737785] font-bold rounded-xl text-lg hover:bg-slate-50 transition-all dark:text-slate-900"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleBook}
                className="flex-1 min-h-[56px] bg-[#0040a1] text-white font-bold rounded-xl text-lg hover:bg-[#003080] transition-all"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION SUCCESS DIALOG */}
      {successBooking && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-[#186c37] p-6 max-w-md w-full text-center space-y-6 shadow-2xl animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-[#a0f2af] rounded-full flex items-center justify-center mx-auto text-[#1e713b]">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-[#1e713b]">Appointment Confirmed!</h4>
              <p className="text-[#424654] text-base font-semibold">
                Your consultation has been successfully added. You will receive an SMS reminder 2 hours prior.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-sm space-y-1.5">
              <p><strong>Doctor:</strong> {successBooking.doctorName}</p>
              <p><strong>Specialty:</strong> {successBooking.doctorSpecialty}</p>
              <p><strong>Scheduled:</strong> {successBooking.dateTime} at {successBooking.timeSlot}</p>
              <p><strong>Reason:</strong> {successBooking.notes}</p>
            </div>

            <button
              onClick={() => setSuccessBooking(null)}
              className="w-full min-h-[56px] bg-[#186c37] hover:bg-[#0f5424] text-white font-bold rounded-xl text-lg transition-all"
            >
              Close Confirmation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
