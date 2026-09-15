import React, { useState } from 'react';
import { MapPin, Navigation, Info, Compass, ShieldCheck, CheckCircle2, Footprints } from 'lucide-react';

export default function CampusMap({ selectedBuilding = null, onSelectBuilding = () => {} }) {
  // Real KDU Ratmalana Campus Building Locations & Calibrated Floor Allocations
  const buildings = [
    {
      id: "FOC-A",
      name: "Faculty of Computing (FOM Building)",
      code: "FOM 4-1 / 4-2",
      faculty: "Computing",
      coords: { x: 45, y: 50 },
      lat: 6.819300,
      lng: 79.887200,
      distanceFromFOC: "0m (Home)",
      walkTime: "0 min",
      status: "Occupied",
      rooms: ["FOM 4-1 (93 seats)", "FOM 4-2 (124 seats - IT/IS Hall)"],
      amenities: ["Air Conditioned", "Projector", "Wi-Fi"]
    },
    {
      id: "SURANIMALA",
      name: "Suranimala Lecture Theatre Complex",
      code: "Suranimala LT-B / LT-C",
      faculty: "Computing",
      coords: { x: 38, y: 62 },
      lat: 6.819050,
      lng: 79.887300,
      distanceFromFOC: "25m",
      walkTime: "25 sec",
      status: "Occupied",
      rooms: ["Suranimala LT-B (50 seats)", "Suranimala LT-C (95 seats - SOWP/CyberSec)"],
      amenities: ["Air Conditioned", "Projector", "Wi-Fi"]
    },
    {
      id: "LT-COMPLEX",
      name: "Computing Lecture Theatre Complex",
      code: "LT-A / LT-B / LT-C",
      faculty: "Computing",
      coords: { x: 30, y: 52 },
      lat: 6.819200,
      lng: 79.887100,
      distanceFromFOC: "35m",
      walkTime: "30 sec",
      status: "Available",
      rooms: ["LT-A (72 seats)", "LT-B (50 seats)", "LT-C (70 seats)"],
      amenities: ["Air Conditioned", "Projector", "Wi-Fi"]
    },
    {
      id: "LAB-COMPLEX",
      name: "Computing Laboratories Complex",
      code: "CCNA / Com. Eng. Labs",
      faculty: "Computing",
      coords: { x: 60, y: 48 },
      lat: 6.819500,
      lng: 79.887400,
      distanceFromFOC: "45m",
      walkTime: "40 sec",
      status: "Occupied",
      rooms: ["CCNA Lab (40 PCs)", "Com. Eng. Lab (24 PCs)", "FOM 5th Electronic Lab"],
      amenities: ["Air Conditioned", "High-Speed PCs", "Networking Hardware"]
    },
    {
      id: "LIB-COMPLEX",
      name: "Central Library & Study Commons",
      code: "Library Study Hall",
      faculty: "General",
      coords: { x: 75, y: 65 },
      lat: 6.819100,
      lng: 79.887900,
      distanceFromFOC: "120m",
      walkTime: "1.5 min",
      status: "Available",
      rooms: ["Library Silent Study Hall (40 desks)", "Discussion Pods"],
      amenities: ["Silent Zone", "Laptop Power Outlets", "Wi-Fi"]
    },
    {
      id: "FGS-BLD",
      name: "Faculty of Graduate Studies (FGS Building)",
      code: "FGS 3-1 & 4-3",
      faculty: "Computing",
      coords: { x: 82, y: 20 },
      lat: 6.817500,
      lng: 79.886000,
      distanceFromFOC: "420m (Distant Block)",
      walkTime: "5 min",
      status: "Occupied",
      rooms: ["FGS 3-1 (3rd Floor Hall - 82 seats)", "FGS 4-3 (4th Floor Hall - 45 seats)"],
      amenities: ["Air Conditioned", "Projector", "Elevator Access", "Wi-Fi"]
    }
  ];

  const [activeBuilding, setActiveBuilding] = useState(buildings[0]);

  return (
    <div className="rounded-3xl bg-white p-6 space-y-5 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Interactive KDU Campus Space Map & Department Allocations</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Calibrated KDU Faculty of Computing room locations (FOM, FGS, Suranimala LT-B/C, LT & Lab Complexes).
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Available
          </span>
          <span className="flex items-center gap-1.5 text-rose-600">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Occupied
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive Campus Visual Map Canvas */}
        <div className="lg:col-span-8 relative w-full h-80 sm:h-96 rounded-2xl bg-slate-100 border border-slate-300 overflow-hidden shadow-inner flex items-center justify-center p-4">
          {/* Simulated Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

          {/* Road / Path Visual Connections */}
          <svg className="absolute inset-0 w-full h-full stroke-slate-400 stroke-2 fill-none pointer-events-none">
            <path d="M 45% 50% L 38% 62% L 30% 52%" strokeDasharray="4 4" />
            <path d="M 45% 50% L 60% 48% L 75% 65%" strokeDasharray="4 4" />
            <path d="M 60% 48% L 82% 20%" strokeDasharray="6 4" stroke="#f43f5e" />
          </svg>

          {/* Building Markers */}
          {buildings.map((b) => {
            const isSelected = activeBuilding.id === b.id;
            return (
              <button
                key={b.id}
                onClick={() => {
                  setActiveBuilding(b);
                  onSelectBuilding(b);
                }}
                style={{ left: `${b.coords.x}%`, top: `${b.coords.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ${
                  isSelected ? 'z-30 scale-125' : 'z-10 hover:scale-110'
                }`}
              >
                <div className="relative flex flex-col items-center">
                  {/* Glowing Marker Icon */}
                  <div className={`p-2.5 rounded-xl border shadow-lg transition-all ${
                    b.status === 'Available' 
                      ? 'bg-white border-emerald-500 text-emerald-600 shadow-emerald-500/20' 
                      : 'bg-white border-rose-500 text-rose-600 shadow-rose-500/20'
                  } ${isSelected ? 'ring-4 ring-emerald-500/30 ring-offset-2 ring-offset-white' : ''}`}>
                    <MapPin className="w-5 h-5" />
                  </div>

                  {/* Room Label Badge */}
                  <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-white whitespace-nowrap shadow-md">
                    {b.code}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Building Detail Sidebar */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-emerald-300 shadow-md space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">{activeBuilding.faculty} Faculty</span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                activeBuilding.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {activeBuilding.status}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-1">{activeBuilding.name}</h4>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              GPS: {activeBuilding.lat}, {activeBuilding.lng}
            </p>
          </div>

          {/* Calibrated Distance & Walk Time Badge */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Footprints className="w-4 h-4 text-emerald-600" />
              <span>Walk from FOC:</span>
            </div>
            <div className="text-right font-bold text-emerald-700">
              {activeBuilding.distanceFromFOC} ({activeBuilding.walkTime})
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
            <p className="font-semibold text-slate-800">Active Lecture Halls:</p>
            <ul className="space-y-1 text-slate-700">
              {activeBuilding.rooms.map((r, i) => (
                <li key={i} className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-200 text-xs space-y-1">
            <p className="font-semibold text-slate-800">Amenities:</p>
            <div className="flex flex-wrap gap-1.5">
              {activeBuilding.amenities.map((a, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-medium">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
