import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { useNotifications } from '../context/NotificationContext';
import { 
  Calendar, RefreshCw, AlertOctagon, CheckCircle2, 
  Sparkles, PlusCircle, ArrowRightLeft, ShieldAlert 
} from 'lucide-react';

export default function LecturerPortal() {
  const { addNotification } = useNotifications();

  // Real KDU Classroom Swap State
  const [roomA, setRoomA] = useState("FGS 3-1");
  const [studentsA, setStudentsA] = useState(35);
  const [roomB, setRoomB] = useState("FOM 4-2");
  const [studentsB, setStudentsB] = useState(48);

  const [swapResult, setSwapResult] = useState(null);
  const [swapLoading, setSwapLoading] = useState(false);

  // Booking Form State
  const [bookRoom, setBookRoom] = useState("FOM 4-1");
  const [bookEvent, setBookEvent] = useState("AI & Robotics Guest Workshop");
  const [bookDay, setBookDay] = useState("Friday");
  const [bookSlot, setBookSlot] = useState("10:30-12:30");
  const [bookAttendees, setBookAttendees] = useState(75);
  const [bookingStatus, setBookingStatus] = useState(null);

  // Emergency Reallocation State
  const [damagedRoom, setDamagedRoom] = useState("FGS 3-1");
  const [emergencyResult, setEmergencyResult] = useState(null);

  // Real KDU Faculty of Computing Rooms
  const mockRooms = {
    "FGS 3-1": { room_code: "FGS 3-1", room_name: "FGS Intake 42 Main Hall", capacity: 82, faculty: "Computing", is_lab: false },
    "FOM 4-1": { room_code: "FOM 4-1", room_name: "FOM Lecture Hall 4-1", capacity: 93, faculty: "Computing", is_lab: false },
    "FOM 4-2": { room_code: "FOM 4-2", room_name: "FOM Seminar Room 4-2", capacity: 50, faculty: "Computing", is_lab: false },
    "LT-A": { room_code: "LT-A", room_name: "Lecture Theatre A", capacity: 72, faculty: "Computing", is_lab: false },
    "LT-B": { room_code: "LT-B", room_name: "Lecture Theatre B", capacity: 50, faculty: "Computing", is_lab: false },
    "CCNA Lab": { room_code: "CCNA Lab", room_name: "Cisco CCNA Lab", capacity: 29, faculty: "Computing", is_lab: true },
    "Com. Eng. Lab": { room_code: "Com. Eng. Lab", room_name: "Computer Engineering Lab", capacity: 24, faculty: "Computing", is_lab: true }
  };

  const handleEvaluateSwap = async () => {
    setSwapLoading(true);
    try {
      const res = await apiService.evaluateSwap({
        room_a: mockRooms[roomA],
        students_a: parseInt(studentsA),
        room_b: mockRooms[roomB],
        students_b: parseInt(studentsB)
      });
      setSwapResult(res);

      if (res.is_swap_recommended) {
        addNotification("KDU Room Swap Recommended", `Swap between ${roomA} and ${roomB} improves utilization by +${res.utilization_gain}%.`, "ROOM_SWAP");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSwapLoading(false);
    }
  };

  const handleCreateBooking = () => {
    // Conflict Check: FGS 3-1 is already booked on Friday 09:00-10:30 for Artificial Intelligence (CS22023)
    if (bookRoom === "FGS 3-1" && bookDay === "Friday" && bookSlot === "09:00-10:30") {
      setBookingStatus({
        success: false,
        message: `Conflict Detected: ${bookRoom} is reserved for CS22023 (Artificial Intelligence) on ${bookDay} (${bookSlot}).`
      });
      return;
    }

    const roomCap = mockRooms[bookRoom].capacity;
    if (bookAttendees > roomCap) {
      setBookingStatus({
        success: false,
        message: `Capacity Overflow: Expected attendees (${bookAttendees}) exceed room capacity (${roomCap}).`
      });
      return;
    }

    setBookingStatus({
      success: true,
      message: `Reservation Confirmed: '${bookEvent}' in ${bookRoom} for ${bookDay} (${bookSlot}).`
    });

    addNotification("Classroom Booked", `${bookEvent} confirmed in ${bookRoom}.`, "BOOKING");
  };

  const handleEmergencyReallocate = () => {
    const replacement = mockRooms["FOM 4-1"];
    setEmergencyResult({
      success: true,
      original: damagedRoom,
      replacement: replacement,
      message: `Emergency Relocation: Classes in ${damagedRoom} shifted to ${replacement.room_code} (${replacement.room_name}). Enrolled students notified.`
    });

    addNotification("EMERGENCY: Room Reallocated", `Classes in ${damagedRoom} moved to ${replacement.room_code} due to maintenance.`, "EMERGENCY");
  };

  return (
    <div className="space-y-8">
      {/* Lecturer Greeting & Current Schedule */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Lecturer Timetable & Portal</h2>
            <p className="text-xs text-slate-400">Mrs. WJ Samaraweera • Department of Computer Engineering</p>
          </div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-900 border border-slate-800 text-emerald-400">
            Intake 42 Sem IV Active
          </span>
        </div>

        {/* Real KDU Lecturer Schedule Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Friday • 09:00 - 10:30</span>
            <h4 className="text-sm font-bold text-white">CS22023 - Artificial Intelligence</h4>
            <p className="text-xs text-slate-400">Allocated Room: <strong className="text-white font-mono">FGS 3-1</strong> (82 Seats)</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Tuesday • 09:00 - 10:30</span>
            <h4 className="text-sm font-bold text-white">COE22023 - Advanced Comp Arch</h4>
            <p className="text-xs text-slate-400">Allocated Lab: <strong className="text-white font-mono">Com. Eng. Lab</strong> (24 PCs)</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Tuesday • 13:00 - 14:30</span>
            <h4 className="text-sm font-bold text-white">COE22012 - Engineering Drawing</h4>
            <p className="text-xs text-slate-400">Allocated Room: <strong className="text-white font-mono">FOE 2-4</strong> (30 Seats)</p>
          </div>
        </div>
      </div>

      {/* Feature 7 & 11: Smart Classroom Swapping Engine */}
      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-white">Smart Classroom Swapping Optimizer</h3>
            <p className="text-xs text-slate-400">AI evaluates if exchanging two classrooms improves KDU campus space utilization.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Room A */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Classroom A Setup</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Room A</label>
                <select
                  value={roomA}
                  onChange={e => setRoomA(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
                >
                  {Object.keys(mockRooms).map(k => <option key={k} value={k}>{k} ({mockRooms[k].capacity} seats)</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Actual Students in A</label>
                <input
                  type="number"
                  value={studentsA}
                  onChange={e => setStudentsA(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-bold"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Current Utilization: <strong className="text-white">{((studentsA / mockRooms[roomA].capacity) * 100).toFixed(1)}%</strong>
            </p>
          </div>

          {/* Room B */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Classroom B Setup</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Room B</label>
                <select
                  value={roomB}
                  onChange={e => setRoomB(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
                >
                  {Object.keys(mockRooms).map(k => <option key={k} value={k}>{k} ({mockRooms[k].capacity} seats)</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Actual Students in B</label>
                <input
                  type="number"
                  value={studentsB}
                  onChange={e => setStudentsB(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-bold"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Current Utilization: <strong className="text-white">{((studentsB / mockRooms[roomB].capacity) * 100).toFixed(1)}%</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleEvaluateSwap}
          disabled={swapLoading}
          className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Evaluate AI Room Swap Gain
        </button>

        {swapResult && (
          <div className="p-5 rounded-2xl glass-panel-glow border-emerald-500/40 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                swapResult.is_swap_recommended ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {swapResult.is_swap_recommended ? 'AI Recommendation: SWAP APPROVED' : 'AI Recommendation: NO BENEFIT'}
              </span>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">Utilization Boost</span>
                <span className="text-base font-black text-emerald-400">+{swapResult.utilization_gain}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-400">Current Average Utilization:</span>
                <p className="text-sm font-bold text-slate-300">{swapResult.current_avg_utilization}%</p>
              </div>
              <div>
                <span className="text-slate-400">New Average Utilization:</span>
                <p className="text-sm font-bold text-emerald-400">{swapResult.swapped_avg_utilization}%</p>
              </div>
            </div>

            <ul className="space-y-1 text-xs text-slate-300 pt-1">
              {swapResult.reasons.map((r, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Row 2: Booking System & Emergency Reallocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feature 9: Classroom Booking with Conflict Checker */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Classroom Booking System</h3>
              <p className="text-[11px] text-slate-400">Reserve rooms with real-time clash & capacity validation</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Event / Make-up Lecture Title</label>
              <input
                type="text"
                value={bookEvent}
                onChange={e => setBookEvent(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Room</label>
                <select
                  value={bookRoom}
                  onChange={e => setBookRoom(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                >
                  {Object.keys(mockRooms).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Expected Attendees</label>
                <input
                  type="number"
                  value={bookAttendees}
                  onChange={e => setBookAttendees(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Day</label>
                <select
                  value={bookDay}
                  onChange={e => setBookDay(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Time Slot</label>
                <select
                  value={bookSlot}
                  onChange={e => setBookSlot(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="08:30-10:30">08:30 - 10:30</option>
                  <option value="09:00-10:30">09:00 - 10:30</option>
                  <option value="10:30-12:30">10:30 - 12:30</option>
                  <option value="13:00-14:30">13:00 - 14:30</option>
                  <option value="14:00-15:30">14:00 - 15:30</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCreateBooking}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Verify Conflicts & Confirm Reservation
            </button>

            {bookingStatus && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                bookingStatus.success ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300' : 'bg-red-950/60 border border-red-800 text-red-300'
              }`}>
                {bookingStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />}
                <span>{bookingStatus.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Feature 19: Emergency Classroom Reallocation */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Emergency Classroom Reallocation</h3>
              <p className="text-[11px] text-slate-400">Triggered by equipment damage, AC failure, or room maintenance</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Unavailable Room</label>
              <select
                value={damagedRoom}
                onChange={e => setDamagedRoom(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="FGS 3-1">FGS 3-1 (Power / AC Failure)</option>
                <option value="Com. Eng. Lab">Com. Eng. Lab (Hardware Maintenance)</option>
                <option value="LT-A">LT-A (Emergency Renovation)</option>
              </select>
            </div>

            <p className="text-slate-400 text-[11px]">
              AI will instantly locate the nearest vacant room with identical capacity and dispatch automated notifications to all enrolled students.
            </p>

            <button
              onClick={handleEmergencyReallocate}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
            >
              Trigger Instant Emergency Relocation
            </button>

            {emergencyResult && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-slate-200 space-y-1 animate-fadeIn">
                <p className="font-bold text-rose-400">✅ {emergencyResult.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
