import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import ExplainabilityCard from '../components/ExplainabilityCard';
import CampusMap from '../components/CampusMap';
import { 
  BookOpen, Search, MapPin, Zap, CheckCircle2, 
  Sparkles, Coffee, Clock, Compass 
} from 'lucide-react';

export default function StudentPortal() {
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
      {/* Student Greeting & Timetable */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Student Academic Hub & Timetable</h2>
            <p className="text-xs text-slate-400">Kasun Bandara • D-COE-25-0023 • BSc (Hons) Computer Engineering (Intake 42 Sem IV)</p>
          </div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400">
            Friday Schedule Active
          </span>
        </div>

        {/* Real KDU Intake 42 Student Timetable */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-brand-950/60 border border-brand-800/80 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Friday • 09:00 - 10:30</span>
            <h4 className="text-xs font-bold text-white">CS22023 - Artificial Intelligence</h4>
            <p className="text-[11px] text-emerald-400">Room FGS 3-1 (Mrs. WJ Samaraweera)</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Friday • 10:30 - 12:30</span>
            <h4 className="text-xs font-bold text-white">Free Period (2 Hours)</h4>
            <p className="text-[11px] text-slate-400">AI Study Recommender active below</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Friday • 12:30 - 14:30</span>
            <h4 className="text-xs font-bold text-white">CS22012 - ADSA Practical</h4>
            <p className="text-[11px] text-slate-400">Lecture Theatre A (LT-A)</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Friday • 14:30 - 16:00</span>
            <h4 className="text-xs font-bold text-white">Self-Study & Revision</h4>
            <p className="text-[11px] text-slate-400">Library Silent Study Area</p>
          </div>
        </div>
      </div>

      {/* Feature 4 & 13: Smart Study Space Recommender */}
      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">Smart Study Space Recommender for Free Hours</h3>
              <p className="text-xs text-slate-400">AI ranks nearest vacant spaces, quiet zones, and charging stations on campus.</p>
            </div>
          </div>

          <button
            onClick={handleGetRecommendations}
            disabled={recLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition flex items-center gap-2"
          >
            <Compass className="w-3.5 h-3.5" />
            Find Best Spaces For Me
          </button>
        </div>

        {/* Preference Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">My Current Faculty</label>
            <select
              value={studentFaculty}
              onChange={e => setStudentFaculty(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            >
              <option value="Computing">Faculty of Computing</option>
              <option value="Engineering">Faculty of Engineering</option>
              <option value="Management">Faculty of Management</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer pt-4">
              <input
                type="checkbox"
                checked={needQuiet}
                onChange={e => setNeedQuiet(e.target.checked)}
                className="rounded text-brand-500"
              />
              Require Silent / Quiet Space
            </label>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer pt-4">
              <input
                type="checkbox"
                checked={requireCharging}
                onChange={e => setRequireCharging(e.target.checked)}
                className="rounded text-brand-500"
              />
              Require Laptop Charging Ports
            </label>
          </div>
        </div>

        {/* Recommendation Cards */}
        {studyRecs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
            {studyRecs.ranked_spaces.map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl glass-panel-glow border-emerald-500/30 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-400 text-sm">{s.room_code}</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Match: {s.match_score}%
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{s.room_name}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {s.building} ({s.faculty})
                  </p>
                </div>

                <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  {s.ai_reasons.map((r, i) => (
                    <p key={i} className="flex items-start gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      {r}
                    </p>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{s.quiet_level} Zone</span>
                  <span className="text-emerald-400 font-semibold">{s.capacity} Available Desks</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">Click "Find Best Spaces For Me" to compute personalized AI recommendations.</p>
        )}
      </div>

      {/* Interactive KDU Campus Space Map */}
      <CampusMap />

      {/* Feature 3 & 14: AI Empty Classroom Finder */}
      <div className="glass-panel p-6 rounded-3xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">AI Empty Classroom & Lab Finder</h3>
            <p className="text-xs text-slate-400">Real-time availability of vacant lecture halls and computer labs.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search room or hall..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white"
              />
            </div>

            <select
              value={filterFaculty}
              onChange={e => setFilterFaculty(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
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
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Room Code</th>
                <th className="p-3">Name & Building</th>
                <th className="p-3">Faculty</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Zone Type</th>
                <th className="p-3">Amenities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredClassrooms.map((room, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="p-3 font-mono font-bold text-emerald-400">{room.room_code}</td>
                  <td className="p-3 font-semibold text-white">
                    {room.room_name}
                    <span className="block text-[10px] font-normal text-slate-400">{room.building}</span>
                  </td>
                  <td className="p-3 text-slate-300">{room.faculty}</td>
                  <td className="p-3 text-slate-300 font-bold">{room.capacity} seats</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                      {room.quiet_level}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-[11px]">
                    {room.has_ac ? '❄️ AC ' : ''} {room.has_charging_ports ? '⚡ Power ' : ''} {room.has_wifi ? '📶 Wi-Fi' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
