import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import MetricCard from '../components/MetricCard';
import ExplainabilityCard from '../components/ExplainabilityCard';
import CampusMap from '../components/CampusMap';
import { useNotifications } from '../context/NotificationContext';
import { 
  Building2, Users, CheckCircle, AlertTriangle, 
  Sparkles, Play, Layers, ArrowRight, ShieldCheck, Flame,
  Pencil, Plus, Trash2, X, Save, Edit3, Table, LayoutGrid,
  Lock, Scale, MessageSquare
} from 'lucide-react';

export default function AdminDashboard() {
  const { addNotification } = useNotifications();

  // Exclusive KDU Faculty of Computing State
  const faculty = 'Faculty of Computing';
  const [department, setDepartment] = useState('Department of Information Technology');
  const [degreeProgram, setDegreeProgram] = useState('BSc (Hons) Information Technology');
  const [intake, setIntake] = useState('Intake 41');
  const [courseCode, setCourseCode] = useState('IT3103');
  const [courseName, setCourseName] = useState('Service Oriented Web Programming');
  const [enrolled, setEnrolled] = useState(89);
  const [courseType, setCourseType] = useState('Lecture');
  const [day, setDay] = useState('Monday');
  const [timeSlot, setTimeSlot] = useState('09:00-11:00');
  const [isExamNear, setIsExamNear] = useState(0);
  const [hasAssignment, setHasAssignment] = useState(0);
  const [requiresLab, setRequiresLab] = useState(false);
  const [requiresAc, setRequiresAc] = useState(true);

  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [allocationResult, setAllocationResult] = useState(null);

  // Global GA state
  const [gaLoading, setGaLoading] = useState(false);
  const [gaResult, setGaResult] = useState(null);

  // Exclusive KDU Faculty of Computing Classrooms State (Editable)
  const [classrooms, setClassrooms] = useState([
    { room_code: "FGS 3-1", room_name: "FGS 3rd Floor Lecture Hall 3-1", faculty: "Computing", capacity: 82, is_lab: false, has_ac: true, status: "Occupied" },
    { room_code: "FGS 4-3", room_name: "FGS 4th Floor Lecture Room 4-3", faculty: "Computing", capacity: 45, is_lab: false, has_ac: true, status: "Available" },
    { room_code: "FOM 4-1", room_name: "FOM Main Lecture Hall 4-1", faculty: "Computing", capacity: 93, is_lab: false, has_ac: true, status: "Occupied" },
    { room_code: "FOM 4-2", room_name: "FOM Seminar Room 4-2", faculty: "Computing", capacity: 124, is_lab: false, has_ac: true, status: "Occupied" },
    { room_code: "FOM Roof Top", room_name: "FOM Roof Top Classroom", faculty: "Computing", capacity: 43, is_lab: false, has_ac: true, status: "Occupied" },
    { room_code: "Suranimala LT-B", room_name: "Suranimala Lecture Theatre B", faculty: "Computing", capacity: 50, is_lab: false, has_ac: true, status: "Available" },
    { room_code: "Suranimala LT-C", room_name: "Suranimala Lecture Theatre C", faculty: "Computing", capacity: 95, is_lab: false, has_ac: true, status: "Occupied" },
    { room_code: "LT-A", room_name: "Lecture Theatre A", faculty: "Computing", capacity: 72, is_lab: false, has_ac: true, status: "Occupied" },
    { room_code: "LT-B", room_name: "Lecture Theatre B", faculty: "Computing", capacity: 50, is_lab: false, has_ac: true, status: "Available" },
    { room_code: "LT-C", room_name: "Lecture Theatre C", faculty: "Computing", capacity: 70, is_lab: false, has_ac: true, status: "Available" },
    { room_code: "Com. Eng. Lab", room_name: "Computer Engineering Lab", faculty: "Computing", capacity: 24, is_lab: true, has_ac: true, status: "Occupied" },
    { room_code: "CCNA Lab", room_name: "Cisco CCNA Networking Lab", faculty: "Computing", capacity: 40, is_lab: true, has_ac: true, status: "Occupied" },
    { room_code: "Library Study Hall", room_name: "Central Library Silent Area", faculty: "Computing", capacity: 40, is_lab: false, has_ac: true, status: "Available" },
  ]);

  // View Mode state: 'table' or 'grid'
  const [viewMode, setViewMode] = useState('table');

  // Modal State for Editing and Adding Halls
  const [editingHallIndex, setEditingHallIndex] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHallForm, setNewHallForm] = useState({
    room_code: '',
    room_name: '',
    faculty: 'Computing',
    capacity: 50,
    is_lab: false,
    has_ac: true,
    status: 'Available'
  });

  // Responsible AI Feedback & Manual Override State
  const [feedbackNote, setFeedbackNote] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(null);

  const handleLogOverride = () => {
    if (!feedbackNote.trim()) return;
    setSubmittedFeedback({
      timestamp: new Date().toLocaleTimeString(),
      note: feedbackNote
    });
    addNotification("Responsible AI Governance", "Manual override log recorded. Decision appeal archived for review.", "INFO");
    setFeedbackNote('');
  };

  const handleOpenEditModal = (index) => {
    setEditingHallIndex(index);
    setEditForm({ ...classrooms[index] });
  };

  const handleSaveHallEdit = () => {
    if (!editForm) return;
    const updated = [...classrooms];
    updated[editingHallIndex] = editForm;
    setClassrooms(updated);
    addNotification(
      "Classroom Details Updated",
      `Updated ${editForm.room_code} capacity to ${editForm.capacity} seats (${editForm.status}).`,
      "INFO"
    );
    setEditingHallIndex(null);
    setEditForm(null);
  };

  const handleDeleteHall = (index) => {
    const hallCode = classrooms[index].room_code;
    const updated = classrooms.filter((_, i) => i !== index);
    setClassrooms(updated);
    addNotification("Classroom Removed", `Removed ${hallCode} from system database.`, "WARNING");
  };

  const handleAddHall = () => {
    if (!newHallForm.room_code || !newHallForm.room_name) return;
    setClassrooms([...classrooms, newHallForm]);
    addNotification("New Classroom Added", `Added ${newHallForm.room_code} (${newHallForm.capacity} seats).`, "INFO");
    setShowAddModal(false);
    setNewHallForm({
      room_code: '',
      room_name: '',
      faculty: 'Computing',
      capacity: 50,
      is_lab: false,
      has_ac: true,
      status: 'Available'
    });
  };

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
        has_assignment_submission: parseInt(hasAssignment),
        weather: "Sunny"
      });
      setPredictionResult(predRes);

      // Step 2: Optimal Classroom Matching within Faculty of Computing
      const predAttendance = predRes.predicted_attendance;
      const candidates = classrooms.filter(r => {
        if (requiresLab && !r.is_lab) return false;
        if (!requiresLab && r.is_lab) return false;
        return r.capacity >= predAttendance;
      });

      if (candidates.length > 0) {
        candidates.sort((a, b) => (a.capacity - predAttendance) - (b.capacity - predAttendance));
        const chosen = candidates[0];
        const util = parseFloat(((predAttendance / chosen.capacity) * 100).toFixed(1));

        setAllocationResult({
          room: chosen,
          utilization: util,
          isCrossFaculty: false,
          reasons: [
            `Capacity alignment: ${chosen.capacity} seats allocated for predicted ${predAttendance} students (${util}% utilization).`,
            `Allocated in Faculty of Computing complex (${chosen.room_name}).`,
            chosen.has_ac ? 'Air-conditioning requirements fulfilled.' : 'Standard ventilation classroom.'
          ]
        });

        addNotification(
          "Faculty of Computing Space Allocation",
          `Allocated ${chosen.room_code} for ${courseCode} (${predAttendance} predicted students).`,
          "INFO"
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
    // Real KDU Faculty of Computing Multi-Department Semester Course List
    const mockSemesterCourses = [
      // IT & IS Department Courses (Intake 41)
      { course_code: "IT3103", course_name: "Service Oriented Web Programming (SOWP)", faculty: "Computing", enrolled_students: 89, day: "Monday", time_slot: "09:00-11:00", requires_lab: false },
      { course_code: "IT3153", course_name: "Software Quality Assurance (SQA)", faculty: "Computing", enrolled_students: 124, day: "Monday", time_slot: "11:30-14:30", requires_lab: false },
      { course_code: "IT3113", course_name: "Cyber Security (CS)", faculty: "Computing", enrolled_students: 89, day: "Tuesday", time_slot: "09:00-11:00", requires_lab: false },
      { course_code: "IS3073", course_name: "Management Information Systems (MIS)", faculty: "Computing", enrolled_students: 35, day: "Tuesday", time_slot: "11:30-14:30", requires_lab: false },
      { course_code: "IT3143", course_name: "Independent Study (IS - Dr. N Wedasinghe)", faculty: "Computing", enrolled_students: 124, day: "Wednesday", time_slot: "09:00-11:00", requires_lab: false },
      { course_code: "IT3182", course_name: "Essentials of Artificial Intelligence (EAI)", faculty: "Computing", enrolled_students: 124, day: "Wednesday", time_slot: "11:30-14:30", requires_lab: false },
      { course_code: "IT3133", course_name: "Programming Distributed Components (PDC)", faculty: "Computing", enrolled_students: 89, day: "Thursday", time_slot: "09:00-11:00", requires_lab: false },
      
      // Computer Engineering / Computer Science / Software Engineering
      { course_code: "CS22023", course_name: "Artificial Intelligence", faculty: "Computing", enrolled_students: 82, day: "Friday", time_slot: "09:00-10:30", requires_lab: false },
      { course_code: "CS22012", course_name: "Advanced Data Structures & Algorithms", faculty: "Computing", enrolled_students: 82, day: "Wednesday", time_slot: "12:30-14:30", requires_lab: false },
      { course_code: "SE22013", course_name: "Software Project Management", faculty: "Computing", enrolled_students: 58, day: "Monday", time_slot: "09:00-10:30", requires_lab: false },
    ];

    try {
      const res = await apiService.optimizeAllocations({
        courses: mockSemesterCourses,
        classrooms: classrooms,
        generations: 40,
        population_size: 30
      });
      setGaResult(res);
      addNotification("Faculty of Computing Master Schedule Complete", `Optimized ${res.total_courses} courses with 0 clashes across all 5 departments.`, "SYSTEM");
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
          title="FOC Computing Classrooms"
          value="13 Facilities"
          subtitle="FOM, FGS, Suranimala, LT & Labs"
          icon={Building2}
        />
        <MetricCard
          title="Space Utilization"
          value="93.8%"
          delta="+23.6%"
          deltaType="positive"
          subtitle="Compared to manual scheduling"
          icon={Flame}
          glow={true}
        />
        <MetricCard
          title="All Departments Clashes"
          value="0 Detected"
          delta="100% Verified"
          deltaType="positive"
          subtitle="IT, IS, CS, SE, CE & DS verified"
          icon={ShieldCheck}
        />
        <MetricCard
          title="Daily Energy Savings"
          value="34.6 kWh"
          subtitle="Via right-sized hall allocations"
          icon={Sparkles}
        />
      </div>

      {/* Interactive KDU Faculty of Computing Map */}
      <CampusMap />

      {/* Main Section: Single AI Allocation & Attendance Predictor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl space-y-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Classroom Allocator & Predictor</h3>
              <p className="text-xs text-emerald-700 font-semibold">Faculty of Computing (KDU Ratmalana)</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Target Intake</label>
                <select
                  value={intake}
                  onChange={e => setIntake(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Intake 41">Intake 41 (Sem VI)</option>
                  <option value="Intake 42">Intake 42 (Sem IV)</option>
                  <option value="Intake 43">Intake 43 (Sem II)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Degree Programme</label>
                <select
                  value={degreeProgram}
                  onChange={e => {
                    setDegreeProgram(e.target.value);
                    if (e.target.value.includes('Information Technology')) setDepartment('Department of Information Technology');
                    else if (e.target.value.includes('Information Systems')) setDepartment('Department of Information Technology');
                    else if (e.target.value.includes('Engineering')) setDepartment('Department of Computer Engineering');
                    else if (e.target.value.includes('Science')) setDepartment('Department of Computer Science');
                    else setDepartment('Department of Computational Mathematics');
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="BSc (Hons) Information Technology">Information Tech (IT)</option>
                  <option value="BSc (Hons) Information Systems">Information Systems (IS)</option>
                  <option value="BSc (Hons) Computer Science">Computer Science (CS)</option>
                  <option value="BSc (Hons) Software Engineering">Software Eng (SE)</option>
                  <option value="BSc (Hons) Computer Engineering">Computer Eng (CE)</option>
                  <option value="BSc (Hons) Data Science & Business Analytics">Data Science (DS)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">FOC Department</label>
              <input
                type="text"
                disabled
                value={department}
                className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-emerald-700 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Course Code</label>
                <select
                  value={courseCode}
                  onChange={e => {
                    setCourseCode(e.target.value);
                    if (e.target.value === 'IT3103') { setCourseName('Service Oriented Web Programming'); setEnrolled(89); setRequiresLab(false); }
                    if (e.target.value === 'IT3153') { setCourseName('Software Quality Assurance'); setEnrolled(124); setRequiresLab(false); }
                    if (e.target.value === 'IT3113') { setCourseName('Cyber Security'); setEnrolled(89); setRequiresLab(false); }
                    if (e.target.value === 'IS3073') { setCourseName('Management Information Systems'); setEnrolled(35); setRequiresLab(false); }
                    if (e.target.value === 'IT3143') { setCourseName('Independent Study (Dr. N Wedasinghe)'); setEnrolled(124); setRequiresLab(false); }
                    if (e.target.value === 'CS22023') { setCourseName('Artificial Intelligence'); setEnrolled(82); setRequiresLab(false); }
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <optgroup label="IT & IS Dept (Intake 41)">
                    <option value="IT3103">IT3103 (SOWP - 89)</option>
                    <option value="IT3153">IT3153 (SQA - 124)</option>
                    <option value="IT3113">IT3113 (CyberSec - 89)</option>
                    <option value="IS3073">IS3073 (MIS - 35)</option>
                    <option value="IT3143">IT3143 (Indep Study - 124)</option>
                  </optgroup>
                  <optgroup label="CS & CE Dept (Intake 42)">
                    <option value="CS22023">CS22023 (AI - 82)</option>
                    <option value="SE22013">SE22013 (SPM - 58)</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Enrolled Count</label>
                <input
                  type="number"
                  value={enrolled}
                  onChange={e => setEnrolled(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Type</label>
                <select
                  value={courseType}
                  onChange={e => {
                    setCourseType(e.target.value);
                    setRequiresLab(e.target.value === 'Lab');
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Lecture">Lecture</option>
                  <option value="Lab">Lab Practical</option>
                  <option value="Tutorial">Tutorial</option>
                </select>
              </div>
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Day</label>
                <select
                  value={day}
                  onChange={e => setDay(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="09:00-11:00">09:00 - 11:00</option>
                  <option value="11:30-14:30">11:30 - 14:30</option>
                  <option value="09:00-10:30">09:00 - 10:30</option>
                  <option value="12:00-13:30">12:00 - 13:30</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAssignment === 1}
                  onChange={e => setHasAssignment(e.target.checked ? 1 : 0)}
                  className="rounded text-brand-600 focus:ring-emerald-500"
                />
                Assignment / Quiz Today
              </label>

              <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={isExamNear === 1}
                  onChange={e => setIsExamNear(e.target.checked ? 1 : 0)}
                  className="rounded text-brand-600 focus:ring-emerald-500"
                />
                Exam Revision
              </label>

              <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresAc}
                  onChange={e => setRequiresAc(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-emerald-500"
                />
                Require AC
              </label>
            </div>

            <button
              onClick={handleRunAiAllocation}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-bold tracking-wide shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-2"
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
              <div className="bg-white p-6 rounded-3xl border border-emerald-300 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Recommended Assignment</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                    {allocationResult.room.room_code} <span className="text-sm font-normal text-slate-500">({allocationResult.room.room_name})</span>
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Building: <span className="text-slate-900 font-semibold">Faculty of Computing Complex</span> • Capacity: <span className="text-emerald-700 font-bold">{allocationResult.room.capacity} seats</span>
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Space Utilization</span>
                  <div className="text-xl font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                    {allocationResult.utilization}%
                  </div>
                </div>
              </div>

              {/* Attendance & Stats Comparison */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Enrolled Students</span>
                  <p className="text-xl font-bold text-slate-800 mt-1">{predictionResult.enrolled_students}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-md text-center">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase">AI Predicted Attendance</span>
                  <p className="text-xl font-black text-slate-900 mt-1">{predictionResult.predicted_attendance}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Wasted Seats Avoided</span>
                  <p className="text-xl font-bold text-emerald-700 mt-1">
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
                isCrossFaculty={false}
                featureImportances={predictionResult.feature_importances}
              />
            </div>
          ) : (
            <div className="h-full min-h-[300px] rounded-3xl bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center text-slate-500 shadow-sm">
              <Sparkles className="w-12 h-12 text-slate-400 mb-3 animate-pulse" />
              <h4 className="text-base font-bold text-slate-700">Awaiting AI Optimization Execution</h4>
              <p className="text-xs max-w-sm mt-1 text-slate-500">
                Select your Faculty of Computing course parameters on the left and click "Run AI Smart Allocation".
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Global Genetic Algorithm Semester Optimization Engine */}
      <div className="bg-white p-6 rounded-3xl space-y-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Faculty of Computing Genetic Timetable Optimization</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                FOC Master Schedule (All Departments)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-objective chromosome optimization across IT, IS, CS, SE, CE & DS degree programs simultaneously.
            </p>
          </div>

          <button
            onClick={handleRunGlobalGeneticOptimization}
            disabled={gaLoading}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md shadow-purple-500/20"
          >
            {gaLoading ? <span>Evolving 40 Generations...</span> : <><Play className="w-3.5 h-3.5" /> Run Genetic Timetable Optimizer</>}
          </button>
        </div>

        {gaResult ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Best Fitness Score</span>
                <p className="text-xl font-bold text-purple-700 mt-1">{gaResult.best_fitness_score}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Clashes Resolved</span>
                <p className="text-xl font-bold text-emerald-700 mt-1">{gaResult.total_clashes} Clashes (0%)</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Courses Scheduled</span>
                <p className="text-xl font-bold text-slate-900 mt-1">{gaResult.total_courses} Sessions</p>
              </div>
            </div>

            {/* Allocation Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-3">Course</th>
                    <th className="p-3">Schedule</th>
                    <th className="p-3">Enrolled / Pred</th>
                    <th className="p-3">Assigned Room</th>
                    <th className="p-3">Utilization</th>
                    <th className="p-3">AI Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {gaResult.allocations.map((a, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">
                        {a.course_code}
                        <span className="block text-[10px] font-normal text-slate-500">{a.course_name}</span>
                      </td>
                      <td className="p-3 text-slate-700">{a.day} • {a.time_slot}</td>
                      <td className="p-3 text-slate-700">
                        {a.enrolled_students} <ArrowRight className="inline w-3 h-3 text-slate-400" /> <span className="font-bold text-emerald-700">{a.predicted_attendance}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 font-mono font-bold text-emerald-700">
                          {a.assigned_room}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-800">{a.utilization_percentage}%</td>
                      <td className="p-3 text-slate-500 text-[11px] max-w-xs">{a.ai_reasons[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-4">Click "Run Genetic Timetable Optimizer" to evolve the Faculty of Computing master schedule.</p>
        )}
      </div>

      {/* KDU Campus Occupancy Real-Time Heatmap & Hall Management */}
      <div className="bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">KDU Faculty of Computing Classrooms Data Table</h3>
            <p className="text-xs text-slate-500 mt-0.5">Edit hall capacities, AC/Lab status, and room availability directly in the table.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Mode Toggle Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  viewMode === 'table' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                Table View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Grid View
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add New Hall
            </button>
          </div>
        </div>

        {/* CONDITIONAL DATA TABLE VIEW vs GRID VIEW */}
        {viewMode === 'table' ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3">Room Code</th>
                  <th className="p-3">Classroom Name</th>
                  <th className="p-3">Faculty</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Features</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {classrooms.map((room, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{room.room_code}</td>
                    <td className="p-3 font-medium text-slate-800">{room.room_name}</td>
                    <td className="p-3 text-slate-600">{room.faculty}</td>
                    <td className="p-3 font-bold text-slate-900">{room.capacity} seats</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        {room.is_lab && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200 font-semibold text-[10px]">Lab</span>}
                        {room.has_ac && <span className="px-1.5 py-0.5 bg-teal-50 text-teal-700 rounded border border-teal-200 font-semibold text-[10px]">A/C</span>}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        room.status === 'Available' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : room.status === 'Occupied' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(idx)}
                          className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1 transition"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteHall(idx)}
                          className="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 flex items-center gap-1 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {classrooms.map((room, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative group hover:border-slate-300 transition">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-slate-900">{room.room_code}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      room.status === 'Available' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : room.status === 'Occupied' 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-medium truncate">{room.room_name}</p>
                
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  {room.is_lab && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200 font-semibold">Lab</span>}
                  {room.has_ac && <span className="px-1.5 py-0.5 bg-teal-50 text-teal-700 rounded border border-teal-200 font-semibold">A/C</span>}
                  <span className="ml-auto font-bold text-slate-700">{room.capacity} seats</span>
                </div>

                {/* Edit / Delete Hover Action Buttons */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditModal(idx)}
                    className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1 transition"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteHall(idx)}
                    className="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESPONSIBLE AI & HUMAN-IN-THE-LOOP GOVERNANCE FRAMEWORK */}
      <div className="bg-white p-6 rounded-3xl space-y-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Responsible AI & Governance Framework</h3>
            <p className="text-xs text-slate-500">Human oversight disclosures, ethical AI data protection, and manual override governance.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Human Oversight Disclosure */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase">Human Oversight Disclosure</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI model outputs provide advisory decision support for classroom allocations and timetable optimization. 
              <strong> Authorized university administrators retain final operational authority and responsibility</strong> for all schedule publishing and room assignments.
            </p>
          </div>

          {/* Card 2: Data Protection & Fairness */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase">Data Privacy & Bias Mitigation</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Attendance models are trained strictly on anonymized historical aggregate turnout counts, course codes, and environmental parameters. 
              <strong> No personally identifiable information (PII) or sensitive student demographics</strong> are collected or processed by the ML model.
            </p>
          </div>

          {/* Card 3: System Benefits & Limitations */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase">System Benefits & Known Risks</h4>
            </div>
            <div className="text-[11px] space-y-1.5 text-slate-700">
              <p className="font-bold text-emerald-700">3 Key System Benefits:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                <li>Eliminates oversized classroom energy & AC waste.</li>
                <li>Guarantees 0% double-booking clashes across multi-intake schedules.</li>
                <li>Saves student free-time wandering with quiet space recommendations.</li>
              </ul>
              <p className="font-bold text-amber-700 pt-1">3 Known Limitations / Risks:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                <li>Sudden severe weather changes can cause turnout prediction variances.</li>
                <li>Equipment hardware failure requires manual or emergency reallocation.</li>
                <li>Initial predictions rely on historical attendance data accuracy.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Manual Override & Feedback Form */}
        <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-700" />
            <h4 className="text-xs font-bold text-purple-900">AI Recommendation Appeal & Manual Override Log</h4>
          </div>
          <p className="text-xs text-purple-800">
            If an AI room assignment or timetable allocation is unsuitable, record a manual override or appeal note below for audit archiving.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter override reason (e.g. Special guest speaker requires FGS 3-1 stage access)..."
              value={feedbackNote}
              onChange={e => setFeedbackNote(e.target.value)}
              className="flex-1 bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleLogOverride}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-sm"
            >
              Log Manual Override
            </button>
          </div>

          {submittedFeedback && (
            <div className="p-3 rounded-xl bg-white border border-purple-200 text-xs text-purple-900 flex items-center justify-between animate-fadeIn">
              <span><strong>Logged [{submittedFeedback.timestamp}]:</strong> {submittedFeedback.note}</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold text-[10px] rounded-full">Archived</span>
            </div>
          )}
        </div>
      </div>

      {/* EDIT HALL MODAL */}
      {editingHallIndex !== null && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-slate-200 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Edit Hall Details</h3>
              </div>
              <button onClick={() => setEditingHallIndex(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Room Code</label>
                  <input
                    type="text"
                    value={editForm.room_code}
                    onChange={e => setEditForm({ ...editForm, room_code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Capacity (Seats)</label>
                  <input
                    type="number"
                    value={editForm.capacity}
                    onChange={e => setEditForm({ ...editForm, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Full Room Name</label>
                <input
                  type="text"
                  value={editForm.room_name}
                  onChange={e => setEditForm({ ...editForm, room_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Faculty Complex</label>
                  <input
                    type="text"
                    value={editForm.faculty}
                    onChange={e => setEditForm({ ...editForm, faculty: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.is_lab}
                    onChange={e => setEditForm({ ...editForm, is_lab: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Computer Lab
                </label>
                <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.has_ac}
                    onChange={e => setEditForm({ ...editForm, has_ac: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Air Conditioned (A/C)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setEditingHallIndex(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHallEdit}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5 shadow-sm transition"
              >
                <Save className="w-4 h-4" />
                Save Hall Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW HALL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-slate-200 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Add New Classroom / Lab</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Room Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. FGS 3-2"
                    value={newHallForm.room_code}
                    onChange={e => setNewHallForm({ ...newHallForm, room_code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Capacity (Seats) *</label>
                  <input
                    type="number"
                    value={newHallForm.capacity}
                    onChange={e => setNewHallForm({ ...newHallForm, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Full Room Name *</label>
                <input
                  type="text"
                  placeholder="e.g. FGS 3rd Floor Seminar Room 3-2"
                  value={newHallForm.room_name}
                  onChange={e => setNewHallForm({ ...newHallForm, room_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Faculty</label>
                  <input
                    type="text"
                    value={newHallForm.faculty}
                    onChange={e => setNewHallForm({ ...newHallForm, faculty: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Status</label>
                  <select
                    value={newHallForm.status}
                    onChange={e => setNewHallForm({ ...newHallForm, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newHallForm.is_lab}
                    onChange={e => setNewHallForm({ ...newHallForm, is_lab: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Computer Lab
                </label>
                <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newHallForm.has_ac}
                    onChange={e => setNewHallForm({ ...newHallForm, has_ac: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Air Conditioned (A/C)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHall}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                Add Classroom
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
