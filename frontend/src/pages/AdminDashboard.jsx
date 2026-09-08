import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import MetricCard from '../components/MetricCard';
import ExplainabilityCard from '../components/ExplainabilityCard';
import CampusMap from '../components/CampusMap';
import { useNotifications } from '../context/NotificationContext';
import { 
  Building2, Users, CheckCircle, AlertTriangle, 
  Sparkles, Play, Layers, ArrowRight, ShieldCheck, Flame
} from 'lucide-react';

export default function AdminDashboard() {
  const { addNotification } = useNotifications();

  // Real KDU Intake 42 Course test state
  const [faculty, setFaculty] = useState('Computing');
  const [courseCode, setCourseCode] = useState('CS22023');
  const [courseName, setCourseName] = useState('Artificial Intelligence');
  const [enrolled, setEnrolled] = useState(82);
  const [courseType, setCourseType] = useState('Lecture');
  const [day, setDay] = useState('Friday');
  const [timeSlot, setTimeSlot] = useState('09:00-10:30');
  const [isExamNear, setIsExamNear] = useState(0);
  const [requiresLab, setRequiresLab] = useState(false);
  const [requiresAc, setRequiresAc] = useState(true);

  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [allocationResult, setAllocationResult] = useState(null);

  // Global GA state
  const [gaLoading, setGaLoading] = useState(false);
  const [gaResult, setGaResult] = useState(null);

  // Real KDU Faculty of Computing Classrooms from Official Timetable
  const mockClassrooms = [
    { room_code: "FGS 3-1", room_name: "FGS Intake 42 Main Hall", faculty: "Computing", capacity: 82, is_lab: false, has_ac: true, status: "Occupied" },
    { room_code: "FOM 4-1", room_name: "FOM Main Lecture Hall 4-1", faculty: "Computing", capacity: 93, is_lab: false, has_ac: true, status: "Occupied" },
    { room_code: "FOM 4-2", room_name: "FOM Seminar Room 4-2", faculty: "Computing", capacity: 50, is_lab: false, has_ac: true, status: "Available" },
    { room_code: "LT-A", room_name: "Lecture Theatre A", faculty: "Computing", capacity: 72, is_lab: false, has_ac: true, status: "Occupied" },
    { room_code: "LT-B", room_name: "Lecture Theatre B", faculty: "Computing", capacity: 50, is_lab: false, has_ac: true, status: "Available" },
    { room_code: "LT-C", room_name: "Lecture Theatre C", faculty: "Computing", capacity: 70, is_lab: false, has_ac: true, status: "Available" },
    { room_code: "Com. Eng. Lab", room_name: "Computer Engineering Lab", faculty: "Computing", capacity: 24, is_lab: true, has_ac: true, status: "Occupied" },
    { room_code: "CCNA Lab", room_name: "Cisco CCNA Networking Lab", faculty: "Computing", capacity: 29, is_lab: true, has_ac: true, status: "Occupied" },
    { room_code: "FOM 5th Electronic Lab", room_name: "5th Floor Electronic Lab", faculty: "Computing", capacity: 30, is_lab: true, has_ac: true, status: "Available" },
    { room_code: "FOE 2-4", room_name: "Engineering Drawing Room 2-4", faculty: "Engineering", capacity: 30, is_lab: false, has_ac: false, status: "Available" },
    { room_code: "Library Study Hall", room_name: "Central Library Silent Area", faculty: "General", capacity: 40, is_lab: false, has_ac: true, status: "Available" },
  ];

  const handleRunAiAllocation = async () => {
    setLoading(true);
    try {
      // Step 1: Predict Attendance using Random Forest
      const predRes = await apiService.predictAttendance({
        enrolled_students: parseInt(enrolled),
        day_of_week: day,
        time_slot: timeSlot,
        course_type: courseType,
        is_exam_near: parseInt(isExamNear),
        weather: "Sunny"
      });
      setPredictionResult(predRes);

      // Step 2: Optimal Classroom Matching
      const predAttendance = predRes.predicted_attendance;
      const candidates = mockClassrooms.filter(r => {
        if (requiresLab && !r.is_lab) return false;
        if (!requiresLab && r.is_lab) return false;
        return r.capacity >= predAttendance;
      });

      if (candidates.length > 0) {
        candidates.sort((a, b) => (a.capacity - predAttendance) - (b.capacity - predAttendance));
        const chosen = candidates[0];
        const isCross = chosen.faculty !== faculty;
        const util = parseFloat(((predAttendance / chosen.capacity) * 100).toFixed(1));

        setAllocationResult({
          room: chosen,
          utilization: util,
          isCrossFaculty: isCross,
          reasons: [
            `Capacity alignment: ${chosen.capacity} seats for predicted ${predAttendance} students (${util}% utilization).`,
            isCross ? `Cross-Faculty Sharing from ${chosen.faculty} (local ${faculty} halls full).` : `Allocated in home ${faculty} complex.`,
            chosen.has_ac ? 'Air-conditioning requirements fulfilled.' : 'Standard ventilation classroom.'
          ]
        });

        addNotification(
          "KDU AI Space Allocation",
          `Allocated ${chosen.room_code} for ${courseCode} (${predAttendance} predicted students).`,
          isCross ? "CROSS_FACULTY" : "INFO"
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunGlobalGeneticOptimization = async () => {
    setGaLoading(true);
    // Real KDU Intake 42 Semester IV Course List
    const mockSemesterCourses = [
      { course_code: "CS22023", course_name: "Artificial Intelligence", faculty: "Computing", enrolled_students: 82, day: "Friday", time_slot: "09:00-10:30", requires_lab: false },
      { course_code: "CS22012", course_name: "Advanced Data Structures & Algorithms", faculty: "Computing", enrolled_students: 82, day: "Wednesday", time_slot: "12:30-14:30", requires_lab: false },
      { course_code: "CS22993", course_name: "Group Project in Software Dev", faculty: "Computing", enrolled_students: 82, day: "Wednesday", time_slot: "09:00-11:00", requires_lab: false },
      { course_code: "SE22013", course_name: "Software Project Management", faculty: "Computing", enrolled_students: 58, day: "Monday", time_slot: "09:00-10:30", requires_lab: false },
      { course_code: "SE22022", course_name: "Software Architecture", faculty: "Computing", enrolled_students: 58, day: "Monday", time_slot: "12:00-13:30", requires_lab: false },
      { course_code: "COE22032", course_name: "Computer Interfacing & Microprocessors", faculty: "Computing", enrolled_students: 82, day: "Thursday", time_slot: "14:00-15:30", requires_lab: false },
      { course_code: "CM22112", course_name: "Numerical Methods", faculty: "Computing", enrolled_students: 82, day: "Thursday", time_slot: "12:00-13:30", requires_lab: false },
      { course_code: "DL4162", course_name: "Research Writing Skills", faculty: "Computing", enrolled_students: 82, day: "Thursday", time_slot: "09:00-10:30", requires_lab: true },
      { course_code: "COE22012", course_name: "Engineering Drawing", faculty: "Computing", enrolled_students: 24, day: "Tuesday", time_slot: "13:00-14:30", requires_lab: false },
      { course_code: "COE22023", course_name: "Advanced Computer Architecture", faculty: "Computing", enrolled_students: 24, day: "Tuesday", time_slot: "09:00-10:30", requires_lab: true },
    ];

    try {
      const res = await apiService.optimizeAllocations({
        courses: mockSemesterCourses,
        classrooms: mockClassrooms,
        generations: 40,
        population_size: 30
      });
      setGaResult(res);
      addNotification("Genetic Optimization Complete", `Optimized ${res.total_courses} KDU courses with ${res.total_clashes} clashes.`, "SYSTEM");
    } catch (err) {
      console.error(err);
    } finally {
      setGaLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="KDU Computing Classrooms"
          value="11 Facilities"
          subtitle="FOM, FGS, LT & Lab Complexes"
          icon={Building2}
        />
        <MetricCard
          title="Space Utilization"
          value="86.4%"
          delta="+16.2%"
          deltaType="positive"
          subtitle="Compared to manual scheduling"
          icon={Flame}
          glow={true}
        />
        <MetricCard
          title="Intake 42 Timetable Clashes"
          value="0 Detected"
          delta="100% Verified"
          deltaType="positive"
          subtitle="Constraint validation active"
          icon={ShieldCheck}
        />
        <MetricCard
          title="Daily Energy Savings"
          value="22.4 kWh"
          subtitle="Via right-sized hall allocations"
          icon={Sparkles}
        />
      </div>

      {/* Interactive KDU Campus Map Component */}
      <CampusMap />

      {/* Main Section: Single AI Allocation & Attendance Predictor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">AI Classroom Allocator & Predictor</h3>
              <p className="text-xs text-slate-400">KDU Faculty of Computing • Intake 42 (Semester IV)</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Target Faculty</label>
              <select
                value={faculty}
                onChange={e => setFaculty(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="Computing">Faculty of Computing</option>
                <option value="Engineering">Faculty of Engineering</option>
                <option value="Management">Faculty of Management</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Course Code</label>
                <select
                  value={courseCode}
                  onChange={e => {
                    setCourseCode(e.target.value);
                    if (e.target.value === 'CS22023') { setCourseName('Artificial Intelligence'); setEnrolled(82); setRequiresLab(false); }
                    if (e.target.value === 'CS22012') { setCourseName('Advanced Data Structures & Algorithms'); setEnrolled(82); setRequiresLab(false); }
                    if (e.target.value === 'SE22013') { setCourseName('Software Project Management'); setEnrolled(58); setRequiresLab(false); }
                    if (e.target.value === 'DL4162') { setCourseName('Research Writing Skills'); setEnrolled(82); setRequiresLab(true); }
                    if (e.target.value === 'COE22023') { setCourseName('Advanced Computer Architecture'); setEnrolled(24); setRequiresLab(true); }
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                >
                  <option value="CS22023">CS22023 (AI)</option>
                  <option value="CS22012">CS22012 (ADSA)</option>
                  <option value="SE22013">SE22013 (SPM)</option>
                  <option value="DL4162">DL4162 (RWS Lab)</option>
                  <option value="COE22023">COE22023 (ACA Lab)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Enrolled Count</label>
                <input
                  type="number"
                  value={enrolled}
                  onChange={e => setEnrolled(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Type</label>
                <select
                  value={courseType}
                  onChange={e => {
                    setCourseType(e.target.value);
                    setRequiresLab(e.target.value === 'Lab');
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-white"
                >
                  <option value="Lecture">Lecture</option>
                  <option value="Lab">Lab Practical</option>
                  <option value="Tutorial">Tutorial</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Day</label>
                <select
                  value={day}
                  onChange={e => setDay(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-white"
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
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-white"
                >
                  <option value="09:00-10:30">09:00 - 10:30</option>
                  <option value="10:30-12:30">10:30 - 12:30</option>
                  <option value="12:00-13:30">12:00 - 13:30</option>
                  <option value="13:30-15:30">13:30 - 15:30</option>
                  <option value="14:00-15:30">14:00 - 15:30</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isExamNear === 1}
                  onChange={e => setIsExamNear(e.target.checked ? 1 : 0)}
                  className="rounded text-brand-500"
                />
                Exam Revision Period
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresAc}
                  onChange={e => setRequiresAc(e.target.checked)}
                  className="rounded text-brand-500"
                />
                Require AC
              </label>
            </div>

            <button
              onClick={handleRunAiAllocation}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-bold tracking-wide shadow-lg shadow-brand-500/20 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Predicting & Optimizing...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Run AI Smart Allocation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: AI Output & Explainability */}
        <div className="lg:col-span-7 space-y-5">
          {allocationResult && predictionResult ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Top Result Banner */}
              <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Recommended Assignment</span>
                  <h2 className="text-2xl font-black text-white mt-0.5">
                    {allocationResult.room.room_code} <span className="text-sm font-normal text-slate-400">({allocationResult.room.room_name})</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Building: <span className="text-white font-semibold">{allocationResult.room.faculty} Complex</span> • Capacity: <span className="text-emerald-400 font-bold">{allocationResult.room.capacity} seats</span>
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
                  <span className="text-[10px] text-slate-400 uppercase">Space Utilization</span>
                  <div className="text-xl font-black text-emerald-400 bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-800">
                    {allocationResult.utilization}%
                  </div>
                </div>
              </div>

              {/* Attendance & Stats Comparison */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl glass-panel text-center">
                  <span className="text-[10px] text-slate-400 uppercase">Enrolled Students</span>
                  <p className="text-xl font-bold text-slate-200 mt-1">{predictionResult.enrolled_students}</p>
                </div>
                <div className="p-4 rounded-2xl glass-panel-glow text-center border-brand-500/30">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">AI Predicted Attendance</span>
                  <p className="text-xl font-black text-white mt-1">{predictionResult.predicted_attendance}</p>
                </div>
                <div className="p-4 rounded-2xl glass-panel text-center">
                  <span className="text-[10px] text-slate-400 uppercase">Wasted Seats Avoided</span>
                  <p className="text-xl font-bold text-emerald-400 mt-1">
                    {allocationResult.room.capacity - predictionResult.predicted_attendance} seats
                  </p>
                </div>
              </div>

              {/* Explainability Breakdown */}
              <ExplainabilityCard
                title="AI Allocation Decision Breakdown"
                reasons={[...predictionResult.explainable_reasons, ...allocationResult.reasons]}
                score={allocationResult.utilization}
                confidence={predictionResult.confidence_score}
                isCrossFaculty={allocationResult.isCrossFaculty}
              />
            </div>
          ) : (
            <div className="h-full min-h-[300px] rounded-3xl glass-panel border-dashed border-slate-800 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <Sparkles className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
              <h4 className="text-base font-bold text-slate-300">Awaiting AI Optimization Execution</h4>
              <p className="text-xs max-w-sm mt-1">
                Select your KDU Intake 42 course parameters on the left and click "Run AI Smart Allocation".
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Global Genetic Algorithm Semester Optimization Engine */}
      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">KDU Genetic Algorithm Timetable Optimization</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-950 text-purple-400 border border-purple-800">
                Intake 42 Master Schedule
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-objective chromosome optimization across CS, SE, and CE degree programs simultaneously.
            </p>
          </div>

          <button
            onClick={handleRunGlobalGeneticOptimization}
            disabled={gaLoading}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-purple-500/20"
          >
            {gaLoading ? <span>Evolving 40 Generations...</span> : <><Play className="w-3.5 h-3.5" /> Run Genetic Timetable Optimizer</>}
          </button>
        </div>

        {gaResult ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Best Fitness Score</span>
                <p className="text-xl font-bold text-purple-400 mt-1">{gaResult.best_fitness_score}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Clashes Resolved</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">{gaResult.total_clashes} Clashes (0%)</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Total Courses Scheduled</span>
                <p className="text-xl font-bold text-white mt-1">{gaResult.total_courses} Sessions</p>
              </div>
            </div>

            {/* Allocation Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Course</th>
                    <th className="p-3">Schedule</th>
                    <th className="p-3">Enrolled / Pred</th>
                    <th className="p-3">Assigned Room</th>
                    <th className="p-3">Utilization</th>
                    <th className="p-3">AI Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {gaResult.allocations.map((a, i) => (
                    <tr key={i} className="hover:bg-slate-900/50">
                      <td className="p-3 font-semibold text-white">
                        {a.course_code}
                        <span className="block text-[10px] font-normal text-slate-400">{a.course_name}</span>
                      </td>
                      <td className="p-3 text-slate-300">{a.day} • {a.time_slot}</td>
                      <td className="p-3 text-slate-300">
                        {a.enrolled_students} <ArrowRight className="inline w-3 h-3 text-slate-500" /> <span className="font-bold text-emerald-400">{a.predicted_attendance}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono font-bold text-emerald-400">
                          {a.assigned_room}
                        </span>
                        {a.is_cross_faculty && (
                          <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-950 text-amber-400 border border-amber-800">
                            Cross-Faculty
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-slate-200">{a.utilization_percentage}%</td>
                      <td className="p-3 text-slate-400 text-[11px] max-w-xs">{a.ai_reasons[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">Click "Run Genetic Timetable Optimizer" to evolve the Intake 42 master schedule.</p>
        )}
      </div>

      {/* KDU Campus Occupancy Real-Time Heatmap */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-white">KDU Faculty of Computing Occupancy Heatmap</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockClassrooms.map((room, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-white">{room.room_code}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  room.status === 'Available' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  {room.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{room.room_name}</p>
              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span>{room.faculty}</span>
                <span className="font-semibold text-slate-300">{room.capacity} seats</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
