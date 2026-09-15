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

  const handleEmergencyReallocate = async () => {
    try {
      const res = await apiService.emergencyReallocate({
        damaged_room_code: damagedRoom,
        course_info: { course_code: "CS22023", enrolled_students: 82, predicted_attendance: 68 },
        available_rooms: Object.values(mockRooms).filter(r => r.room_code !== damagedRoom)
      });
      setEmergencyResult(res);
      if (res.success && res.allocated_room) {
        addNotification("EMERGENCY: Room Reallocated", res.message, "EMERGENCY");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Lecturer Greeting & Current Schedule */}
      <div className="bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Lecturer Timetable & Portal</h2>
            <p className="text-xs text-slate-500">Mrs. WJ Samaraweera • Department of Computer Engineering</p>
          </div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
            Intake 42 Sem IV Active
          </span>
        </div>

        {/* Real KDU Lecturer Schedule Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Friday • 09:00 - 10:30</span>
            <h4 className="text-sm font-bold text-slate-900">CS22023 - Artificial Intelligence</h4>
            <p className="text-xs text-slate-600">Allocated Room: <strong className="text-slate-900 font-mono">FGS 3-1</strong> (82 Seats)</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Tuesday • 09:00 - 10:30</span>
            <h4 className="text-sm font-bold text-slate-900">COE22023 - Advanced Comp Arch</h4>
            <p className="text-xs text-slate-600">Allocated Lab: <strong className="text-slate-900 font-mono">Com. Eng. Lab</strong> (24 PCs)</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Tuesday • 13:00 - 14:30</span>
            <h4 className="text-sm font-bold text-slate-900">COE22012 - Engineering Drawing</h4>
            <p className="text-xs text-slate-600">Allocated Room: <strong className="text-slate-900 font-mono">FOE 2-4</strong> (30 Seats)</p>
          </div>
        </div>
      </div>

      {/* Feature 7 & 11: Smart Classroom Swapping Engine */}
      <div className="bg-white p-6 rounded-3xl space-y-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Smart Classroom Swapping Optimizer</h3>
            <p className="text-xs text-slate-500">AI evaluates if exchanging two classrooms improves KDU campus space utilization.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Room A */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Classroom A Setup</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-700 font-semibold block mb-1">Room A</label>
                <select
                  value={roomA}
                  onChange={e => setRoomA(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.keys(mockRooms).map(k => <option key={k} value={k}>{k} ({mockRooms[k].capacity} seats)</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-700 font-semibold block mb-1">Actual Students in A</label>
                <input
                  type="number"
                  value={studentsA}
                  onChange={e => setStudentsA(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-600">
              Current Utilization: <strong className="text-slate-900">{((studentsA / mockRooms[roomA].capacity) * 100).toFixed(1)}%</strong>
            </p>
          </div>

          {/* Room B */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Classroom B Setup</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-700 font-semibold block mb-1">Room B</label>
                <select
                  value={roomB}
                  onChange={e => setRoomB(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.keys(mockRooms).map(k => <option key={k} value={k}>{k} ({mockRooms[k].capacity} seats)</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-700 font-semibold block mb-1">Actual Students in B</label>
                <input
                  type="number"
                  value={studentsB}
                  onChange={e => setStudentsB(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-600">
              Current Utilization: <strong className="text-slate-900">{((studentsB / mockRooms[roomB].capacity) * 100).toFixed(1)}%</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleEvaluateSwap}
          disabled={swapLoading}
          className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Evaluate AI Room Swap Gain
        </button>

        {swapResult && (
          <div className="p-5 rounded-2xl bg-white border border-emerald-300 shadow-md space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                swapResult.is_swap_recommended ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {swapResult.is_swap_recommended ? 'AI Recommendation: SWAP APPROVED' : 'AI Recommendation: NO BENEFIT'}
              </span>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Utilization Boost</span>
                <span className="text-base font-black text-emerald-700">+{swapResult.utilization_gain}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200">
              <div>
                <span className="text-slate-500 font-medium">Current Average Utilization:</span>
                <p className="text-sm font-bold text-slate-800">{swapResult.current_avg_utilization}%</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">New Average Utilization:</span>
                <p className="text-sm font-bold text-emerald-700">{swapResult.swapped_avg_utilization}%</p>
              </div>
            </div>

            <ul className="space-y-1 text-xs text-slate-700 pt-1">
              {swapResult.reasons.map((r, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
        <div className="bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Classroom Booking System</h3>
              <p className="text-[11px] text-slate-500">Reserve rooms with real-time clash & capacity validation</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Event / Make-up Lecture Title</label>
              <input
                type="text"
                value={bookEvent}
                onChange={e => setBookEvent(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Target Room</label>
                <select
                  value={bookRoom}
                  onChange={e => setBookRoom(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.keys(mockRooms).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Expected Attendees</label>
                <input
                  type="number"
                  value={bookAttendees}
                  onChange={e => setBookAttendees(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Day</label>
                <select
                  value={bookDay}
                  onChange={e => setBookDay(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Time Slot</label>
                <select
                  value={bookSlot}
                  onChange={e => setBookSlot(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                bookingStatus.success ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium' : 'bg-red-50 border border-red-200 text-red-800 font-medium'
              }`}>
                {bookingStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />}
                <span>{bookingStatus.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Feature 19: Emergency Classroom Reallocation */}
        <div className="bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Emergency Classroom Reallocation</h3>
              <p className="text-[11px] text-slate-500">Triggered by equipment damage, AC failure, or room maintenance</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Unavailable Room</label>
              <select
                value={damagedRoom}
                onChange={e => setDamagedRoom(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="FGS 3-1">FGS 3-1 (Power / AC Failure)</option>
                <option value="Com. Eng. Lab">Com. Eng. Lab (Hardware Maintenance)</option>
                <option value="LT-A">LT-A (Emergency Renovation)</option>
              </select>
            </div>

            <p className="text-slate-600 text-[11px]">
              AI will instantly locate the nearest vacant room with identical capacity and dispatch automated notifications to all enrolled students.
            </p>

            <button
              onClick={handleEmergencyReallocate}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-sm"
            >
              Trigger Instant Emergency Relocation
            </button>

            {emergencyResult && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1 animate-fadeIn">
                <p className="font-bold text-rose-700">✅ {emergencyResult.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
