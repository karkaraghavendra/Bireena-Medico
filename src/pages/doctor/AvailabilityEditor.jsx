import { useState } from "react";
import { 
  ChevronRight, 
  Copy, 
  Plus, 
  X,
  ChevronDown
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timeSlots = [
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM"
];

const mockSchedule = {
  "08:00 AM - 10:00 AM": { "Mon": "09:00 - 10:00", "Wed": "09:00 - 10:00", "Fri": "09:00 - 10:00" },
  "10:00 AM - 12:00 PM": { "Tue": "10:00 - 12:00", "Thu": "10:00 - 12:00" },
  "12:00 PM - 02:00 PM": { "Mon": "12:00 - 01:00", "Wed": "12:00 - 01:00", "Fri": "12:00 - 01:00" },
  "02:00 PM - 04:00 PM": { "Mon": "02:00 - 04:00", "Tue": "02:00 - 04:00", "Thu": "02:00 - 04:00" },
  "04:00 PM - 06:00 PM": { "Wed": "04:00 - 05:00", "Fri": "04:00 - 05:00" },
  "06:00 PM - 08:00 PM": { "Tue": "06:00 - 08:00" }
};

export default function AvailabilityEditor() {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState("Dr. Alexander Smith");

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumbs */}
      <div>
        <h1 className="text-3xl font-black text-primary-dark tracking-tighter">Availability Editor</h1>
        <div className="flex items-center gap-2 text-sm font-bold text-gray-400 mt-1">
          <Link to="/doctors" className="hover:text-primary transition-colors">Doctors</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary/60">Availability Editor</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative group min-w-[300px]">
            <select 
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="appearance-none w-full h-12 px-4 bg-bg-primary border border-primary/10 rounded-xl focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none font-bold text-gray-700"
            >
              <option>Dr. Alexander Smith</option>
              <option>Dr. Sarah Johnson</option>
              <option>Dr. Michael Brown</option>
              <option>Dr. Emily Davis</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-gray-500 rounded-xl font-bold text-sm shadow-sm hover:border-primary/20 transition-all">
              <Copy className="w-4 h-4" />
              Copy from previous week
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
              Add Time Slot
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 bg-bg-primary/30 text-gray-400 text-[10px] uppercase font-black tracking-widest text-center border border-gray-50">Time</th>
                {days.map(day => (
                  <th key={day} className="p-4 bg-bg-primary/30 text-gray-400 text-[10px] uppercase font-black tracking-widest text-center border border-gray-50">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time}>
                  <td className="p-4 text-[10px] font-black text-primary-dark whitespace-nowrap bg-bg-primary/10 border border-gray-50 text-center uppercase tracking-tight">
                    {time}
                  </td>
                  {days.map(day => {
                    const slot = mockSchedule[time]?.[day];
                    return (
                      <td key={day} className="p-2 border border-gray-50 min-w-[120px] h-24">
                        <AnimatePresence>
                          {slot && (
                            <motion.div 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="h-full bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col justify-between group relative"
                            >
                              <span className="text-[10px] font-black text-primary-forest tracking-tighter">
                                {slot}
                              </span>
                              <button className="absolute right-2 top-2 p-1 text-primary-forest opacity-0 group-hover:opacity-100 hover:bg-emerald-100 rounded-md transition-all">
                                <X className="w-3 h-3" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend & Footer */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Slot</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/doctors")}
              className="px-8 py-3 bg-white border border-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              Cancel
            </button>
            <button 
              onClick={() => navigate("/doctors")}
              className="px-10 py-4 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
