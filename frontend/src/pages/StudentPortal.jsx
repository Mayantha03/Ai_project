import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import ExplainabilityCard from '../components/ExplainabilityCard';
import CampusMap from '../components/CampusMap';
import { 
  BookOpen, Search, MapPin, Zap, CheckCircle2, 
  Sparkles, Coffee, Clock, Compass, Calendar, Map
} from 'lucide-react';

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState("timetable");
  const [selectedDay, setSelectedDay] = useState("Friday");
  
  // Empty Room Finder State
  const [filterFaculty, setFilterFaculty] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Study Space Recommender State
  const [studentFaculty, setStudentFaculty] = useState('Computing');
  const [needQuiet, setNeedQuiet] = useState(true);
  const [requireCharging, setRequireCharging] = useState(true);
  const [studyRecs, setStudyRecs] = useState(null);
  const [recLoading, setRecLoading] = useState(false);

  // Real KDU Faculty of Computing Classrooms
  const mockAvailableSpaces = [
    { room_code: "Library Study Hall", room_name: "Central Library Silent Study Area", faculty: "General", building: "Central Library Commons", quiet_level: "SILENT", capacity: 40, has_ac: true, has_charging_ports: true, has_wifi: true },
    { room_code: "FOM 4-2", room_name: "FOM Seminar Room 4-2", faculty: "Computing", building: "FOM Building", quiet_level: "MODERATE", capacity: 50, has_ac: true, has_charging_ports: true, has_wifi: true },
    { room_code: "LT-B", room_name: "Lecture Theatre B", faculty: "Computing", building: "Lecture Theatre Complex", quiet_level: "MODERATE", capacity: 50, has_ac: true, has_charging_ports: true, has_wifi: true },
    { room_code: "LT-C", room_name: "Lecture Theatre C", faculty: "Computing", building: "Lecture Theatre Complex", quiet_level: "SILENT", capacity: 70, has_ac: true, has_charging_ports: true, has_wifi: true },
    { room_code: "FOE 2-4", room_name: "Engineering Drawing Room 2-4", faculty: "Engineering", building: "FOE Main Building", quiet_level: "MODERATE", capacity: 30, has_ac: false, has_charging_ports: true, has_wifi: true },
  ];

  const mockWeeklyTimetable = {
    Monday: [
      { time: "09:00 - 11:00", title: "CS22032 - Database Systems", location: "FOM 4-1 (Dr. Nuwan)", type: "lecture" },
      { time: "11:00 - 13:00", title: "CS22042 - System Analysis", location: "FOM 4-2 (Mr. Silva)", type: "lecture" },
      { time: "13:00 - 14:30", title: "Free Period", location: "AI Study Recommender active below", type: "free" },
      { time: "14:30 - 16:30", title: "CS22023 - Artificial Intelligence", location: "FGS 3-1 (Mrs. WJ Samaraweera)", type: "lecture" }
    ],
    Tuesday: [
      { time: "08:30 - 10:30", title: "Free Period", location: "AI Study Recommender active below", type: "free" },
      { time: "10:30 - 12:30", title: "CS22053 - Computer Networks", location: "LT-B (Dr. Perera)", type: "lecture" },
      { time: "13:30 - 15:30", title: "CS22032 - DB Practical", location: "Computing Lab 2", type: "practical" }
    ],
    Wednesday: [
      { time: "08:30 - 11:30", title: "CS22023 - AI Practical", location: "Computing Lab 1", type: "practical" },
      { time: "12:30 - 14:30", title: "CS22053 - Networks Practical", location: "Network Lab", type: "practical" },
      { time: "14:30 - 16:30", title: "Free Period", location: "AI Study Recommender active below", type: "free" }
    ],
    Thursday: [
      { time: "09:00 - 11:00", title: "CS22063 - Software Engineering", location: "LT-C (Prof. Karunaratne)", type: "lecture" },
      { time: "11:00 - 13:00", title: "Free Period", location: "AI Study Recommender active below", type: "free" },
      { time: "14:00 - 16:00", title: "CS22063 - SE Practical", location: "Computing Lab 3", type: "practical" }
    ],
    Friday: [
      { time: "09:00 - 10:30", title: "CS22023 - Artificial Intelligence", location: "FGS 3-1 (Mrs. WJ Samaraweera)", type: "lecture" },
      { time: "10:30 - 12:30", title: "Free Period (2 Hours)", location: "AI Study Recommender active below", type: "free" },
      { time: "12:30 - 14:30", title: "CS22012 - ADSA Practical", location: "Lecture Theatre A (LT-A)", type: "practical" },
      { time: "14:30 - 16:00", title: "Self-Study & Revision", location: "Library Silent Study Area", type: "free" }
    ]
  };

  const [timetableData, setTimetableData] = useState(mockWeeklyTimetable);
  const [studentDegree, setStudentDegree] = useState("Computer Science");
  const [studentIntake, setStudentIntake] = useState("Intake 42");

  useEffect(() => {
    const saved = localStorage.getItem('smartCampusTimetable');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const allocs = parsed.allocations || [];
        
        // Enhance with course names from saved courses if available
        const savedCourses = localStorage.getItem('smartCampusCourses');
        let parsedCourses = [];
        if (savedCourses) {
          try { parsedCourses = JSON.parse(savedCourses); } catch(e){}
        }

        const newTimetable = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] };
        
        allocs.forEach(a => {
          if (newTimetable[a.day]) {
            const matchedCourse = parsedCourses.find(pc => pc.course_code === a.course_code);
            
            // Filter by selected degree (department) and intake
            const courseDept = (matchedCourse && matchedCourse.department) ? matchedCourse.department : (a.department || "");
            const courseIntake = (matchedCourse && matchedCourse.intake) ? matchedCourse.intake : (a.intake || "");
            
            let shortCode = "";
            if (studentDegree === "Computer Science") shortCode = "CS";
            else if (studentDegree === "Software Engineering") shortCode = "SE";
            else if (studentDegree === "Computer Engineering") shortCode = "CE";
            else if (studentDegree === "Information Technology") shortCode = "IT";
            else if (studentDegree === "Information Systems") shortCode = "IS";
            else if (studentDegree === "Data Science") shortCode = "DBA";

            const matchesDegree = courseDept.includes(shortCode) || courseDept.includes(studentDegree);

            // Only add if it matches the student's profile
            if (matchesDegree && courseIntake === studentIntake) {
              const cName = (matchedCourse && matchedCourse.course_name) ? matchedCourse.course_name : a.course_name;
              const lName = (matchedCourse && matchedCourse.lecturer_name) ? matchedCourse.lecturer_name : a.lecturer_name;

              newTimetable[a.day].push({
                time: a.time_slot,
                title: `${a.course_code} - ${cName || 'Course'}`,
                location: `${a.assigned_room} ${lName && lName !== 'Unassigned Lecturer' ? '(' + lName + ')' : ''}`,
                type: (a.room_name && a.room_name.toLowerCase().includes('lab')) ? 'practical' : 'lecture'
              });
            }
          }
        });
        
        Object.keys(newTimetable).forEach(day => {
          newTimetable[day].sort((x, y) => x.time.localeCompare(y.time));
          if (newTimetable[day].length === 0) {
            newTimetable[day].push({ time: "08:30 - 16:30", title: "Free Day", location: "AI Study Recommender active below", type: "free" });
          }
        });
        
        setTimetableData(newTimetable);
      } catch (e) {
        console.error("Error parsing timetable for student", e);
      }
    }
  }, [studentDegree, studentIntake]);

  const handleGetRecommendations = async () => {
    setRecLoading(true);
    try {
      const res = await apiService.recommendStudySpaces({
        student_faculty: studentFaculty,
        available_spaces: mockAvailableSpaces,
        need_quiet: needQuiet,
        require_charging: requireCharging
      });
      setStudyRecs(res);
    } catch (e) {
      console.error(e);
    } finally {
      setRecLoading(false);
    }
  };

  const filteredClassrooms = mockAvailableSpaces.filter(r => {
    if (filterFaculty !== 'All' && r.faculty !== filterFaculty) return false;
    if (filterType !== 'All' && r.quiet_level !== filterType) return false;
    if (searchTerm && !r.room_name.toLowerCase().includes(searchTerm.toLowerCase()) && !r.room_code.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button 
          onClick={() => setActiveTab("timetable")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === "timetable" 
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" 
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Calendar className="w-4 h-4" /> My Timetable
        </button>
        <button 
          onClick={() => setActiveTab("study")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === "study" 
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" 
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Compass className="w-4 h-4" /> Study Recommender
        </button>
        <button 
          onClick={() => setActiveTab("map")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === "map" 
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" 
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Map className="w-4 h-4" /> Map & Classrooms
        </button>
      </div>

      {/* Student Greeting & Timetable */}
      {activeTab === "timetable" && (
      <div className="bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Student Academic Hub & Timetable</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 font-semibold">Viewing as: Kasun Bandara • </span>
              <select 
                value={studentDegree} 
                onChange={e => setStudentDegree(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Information Systems">Information Systems</option>
                <option value="Data Science">Data Science</option>
              </select>
              <select 
                value={studentIntake} 
                onChange={e => setStudentIntake(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Intake 41">Intake 41</option>
                <option value="Intake 42">Intake 42</option>
              </select>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 w-fit">
            {selectedDay} Schedule Active
          </span>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex gap-2 pb-2 overflow-x-auto">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedDay === day 
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Weekly Timetable Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          {timetableData[selectedDay].map((slot, idx) => (
            <div key={idx} className={`p-3.5 rounded-2xl border space-y-1 ${
              slot.type === 'lecture' ? 'bg-emerald-50 border-emerald-200' :
              slot.type === 'practical' ? 'bg-blue-50 border-blue-200' :
              'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-[10px] font-bold uppercase ${
                slot.type === 'lecture' ? 'text-emerald-800' :
                slot.type === 'practical' ? 'text-blue-800' :
                'text-slate-500'
              }`}>{selectedDay} • {slot.time}</span>
              <h4 className="text-xs font-bold text-slate-900">{slot.title}</h4>
              <p className={`text-[11px] font-medium ${
                slot.type === 'lecture' ? 'text-emerald-700' :
                slot.type === 'practical' ? 'text-blue-700' :
                'text-slate-500'
              }`}>{slot.location}</p>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Feature 4 & 13: Smart Study Space Recommender */}
      {activeTab === "study" && (
      <div className="bg-white p-6 rounded-3xl space-y-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Smart Study Space Recommender for Free Hours</h3>
              <p className="text-xs text-slate-500">AI ranks nearest vacant spaces, quiet zones, and charging stations on campus.</p>
            </div>
          </div>

          <button
            onClick={handleGetRecommendations}
            disabled={recLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition flex items-center gap-2"
          >
            <Compass className="w-3.5 h-3.5" />
            Find Best Spaces For Me
          </button>
        </div>

        {/* Preference Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <label className="text-slate-700 font-semibold block mb-1">My Current Faculty</label>
            <select
              value={studentFaculty}
              onChange={e => setStudentFaculty(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Computing">Faculty of Computing</option>
              <option value="Engineering">Faculty of Engineering</option>
              <option value="Management">Faculty of Management</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer pt-4">
              <input
                type="checkbox"
                checked={needQuiet}
                onChange={e => setNeedQuiet(e.target.checked)}
                className="rounded text-brand-600 focus:ring-emerald-500"
              />
              Require Silent / Quiet Space
            </label>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer pt-4">
              <input
                type="checkbox"
                checked={requireCharging}
                onChange={e => setRequireCharging(e.target.checked)}
                className="rounded text-brand-600 focus:ring-emerald-500"
              />
              Require Laptop Charging Ports
            </label>
          </div>
        </div>

        {/* Recommendation Cards */}
        {studyRecs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
            {studyRecs.ranked_spaces.map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-emerald-300 shadow-md space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-700 text-sm">{s.room_code}</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Match: {s.match_score}%
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{s.room_name}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {s.building} ({s.faculty})
                  </p>
                </div>

                <div className="space-y-1 text-xs text-slate-700 pt-2 border-t border-slate-200">
                  {s.ai_reasons.map((r, i) => (
                    <p key={i} className="flex items-start gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      {r}
                    </p>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <span>{s.quiet_level} Zone</span>
                  <span className="text-emerald-700 font-bold">{s.capacity} Available Desks</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-4">Click "Find Best Spaces For Me" to compute personalized AI recommendations.</p>
        )}
      </div>
      )}

      {/* Interactive KDU Campus Space Map & AI Finders */}
      {activeTab === "map" && (
      <div className="space-y-8">
        <CampusMap />

      {/* Feature 3 & 14: AI Empty Classroom Finder */}
      <div className="bg-white p-6 rounded-3xl space-y-5 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">AI Empty Classroom & Lab Finder</h3>
            <p className="text-xs text-slate-500">Real-time availability of vacant lecture halls and computer labs.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search room or hall..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <select
              value={filterFaculty}
              onChange={e => setFilterFaculty(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Faculties</option>
              <option value="Computing">Computing</option>
              <option value="Engineering">Engineering</option>
              <option value="Management">Management</option>
              <option value="General">Library Commons</option>
            </select>
          </div>
        </div>

        {/* Table of Available Spaces */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-200 font-bold">
              <tr>
                <th className="p-3">Room Code</th>
                <th className="p-3">Name & Building</th>
                <th className="p-3">Faculty</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Zone Type</th>
                <th className="p-3">Amenities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredClassrooms.map((room, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-emerald-700">{room.room_code}</td>
                  <td className="p-3 font-semibold text-slate-900">
                    {room.room_name}
                    <span className="block text-[10px] font-normal text-slate-500">{room.building}</span>
                  </td>
                  <td className="p-3 text-slate-700">{room.faculty}</td>
                  <td className="p-3 text-slate-700 font-bold">{room.capacity} seats</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-medium">
                      {room.quiet_level}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 text-[11px]">
                    {room.has_ac ? '❄️ AC ' : ''} {room.has_charging_ports ? '⚡ Power ' : ''} {room.has_wifi ? '📶 Wi-Fi' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      )}
    </div>
  );
}
