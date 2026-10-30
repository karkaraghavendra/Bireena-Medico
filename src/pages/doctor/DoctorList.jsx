import { useState } from "react";
import { 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Plus,
  X,
  Check,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

const INITIAL_DOCTORS = [
  {
    id: 1,
    name: "Dr. Alexander Smith",
    specialization: "General Practitioner",
    specializationColor: "bg-emerald-100 text-emerald-700",
    availability: "Mon, Wed, Fri",
    timeSlots: "09:00 AM - 05:00 PM",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    specializationColor: "bg-blue-100 text-blue-700",
    availability: "Tue, Thu, Sat",
    timeSlots: "10:00 AM - 06:00 PM",
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Dr. Michael Brown",
    specialization: "Dermatologist",
    specializationColor: "bg-purple-100 text-purple-700",
    availability: "Mon, Tue, Thu",
    timeSlots: "09:00 AM - 04:00 PM",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Dr. Emily Davis",
    specialization: "Pediatrician",
    specializationColor: "bg-orange-100 text-orange-700",
    availability: "Wed, Fri, Sat",
    timeSlots: "09:00 AM - 05:00 PM",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop"
  }
];

export default function DoctorList() {
  const [doctors, setDoctors] = useState(() => {
    const stored = localStorage.getItem("medico_doctors");
    if (!stored) {
      localStorage.setItem("medico_doctors", JSON.stringify(INITIAL_DOCTORS));
      return INITIAL_DOCTORS;
    }
    return JSON.parse(stored);
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All Specializations");
  const [selectedDay, setSelectedDay] = useState("All");
  const [hideUnavailable, setHideUnavailable] = useState(false);

  const deleteDoctor = (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      const updated = doctors.filter(d => d.id !== id);
      setDoctors(updated);
      localStorage.setItem("medico_doctors", JSON.stringify(updated));
    }
  };

  const isAvailable = (docAvailability, day) => {
    if (day === "All") return true;
    const days = docAvailability.split(",").map(d => d.trim().toLowerCase());
    return days.includes(day.toLowerCase());
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === "All Specializations" || 
                                 doctor.specialization === selectedSpecialization;
    
    if (selectedDay !== "All" && hideUnavailable) {
      const available = isAvailable(doctor.availability, selectedDay);
      if (!available) return false;
    }

    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary-dark tracking-tighter">Doctors</h1>
          <p className="text-gray-500 font-medium">Manage and view all registered doctors.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/doctors/availability"
            className="inline-flex items-center gap-2 bg-white border border-gray-100 text-gray-500 px-6 py-3 rounded-2xl font-bold shadow-sm hover:border-primary/20 hover:scale-105 transition-all"
          >
            <Clock className="w-5 h-5 text-primary/60" />
            Availability Editor
          </Link>
          <Link 
            to="/doctors/add"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" />
            Add Doctor
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Day Filter above search bar */}
        <div className="p-6 border-b border-gray-50 bg-bg-primary/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
            <p className="text-xs font-black text-primary-dark uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Filter by Availability Day
            </p>
            {selectedDay !== "All" && (
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={hideUnavailable}
                  onChange={(e) => setHideUnavailable(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                />
                Hide unavailable doctors on {selectedDay}
              </label>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold transition-all border",
                  selectedDay === day
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/15 scale-[1.02]"
                    : "bg-white text-gray-500 border-gray-100 hover:bg-primary/5 hover:text-primary-dark hover:border-primary/20"
                )}
              >
                {day === "All" ? "All Days" : day}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search doctors..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-bg-primary border border-primary/10 rounded-xl focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none"
            />
          </div>
          <div className="relative group">
            <select 
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="appearance-none h-12 pl-4 pr-12 bg-bg-primary border border-primary/10 rounded-xl focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none font-bold text-gray-600 min-w-[200px]"
            >
              <option>All Specializations</option>
              <option>General Practitioner</option>
              <option>Cardiologist</option>
              <option>Dermatologist</option>
              <option>Pediatrician</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-primary/30 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                <th className="px-8 py-4">Name</th>
                <th className="px-8 py-4">Specialization</th>
                <th className="px-8 py-4">Availability</th>
                <th className="px-8 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredDoctors.map((doctor) => {
                  const availableOnSelectedDay = isAvailable(doctor.availability, selectedDay);
                  const isMarkedUnavailable = selectedDay !== "All" && !availableOnSelectedDay;
                  return (
                    <motion.tr 
                      key={doctor.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "group transition-all duration-200 border-l-4",
                        isMarkedUnavailable 
                          ? "bg-red-50/15 hover:bg-red-50/25 border-l-red-550 border-l-red-500" 
                          : "border-l-transparent hover:bg-bg-primary/20"
                      )}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img 
                              src={doctor.image} 
                              alt={doctor.name} 
                              className={cn(
                                "w-12 h-12 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform",
                                isMarkedUnavailable && "grayscale-[30%] opacity-80"
                              )}
                            />
                            {isMarkedUnavailable && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <X className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "font-bold tracking-tight",
                                isMarkedUnavailable ? "text-gray-400 line-through" : "text-primary-dark"
                              )}>
                                {doctor.name}
                              </span>
                              {isMarkedUnavailable && (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-700 font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                  Not Available on {selectedDay}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-xs font-bold",
                          doctor.specializationColor || "bg-emerald-50 text-emerald-700"
                        )}>
                          {doctor.specialization}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1.5/2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn(
                              "text-sm font-bold",
                              (selectedDay !== "All" && !availableOnSelectedDay) 
                                ? "text-red-500 line-through decoration-red-400 font-extrabold" 
                                : "text-gray-700"
                            )}>
                              {doctor.availability}
                            </span>
                            
                            {selectedDay !== "All" && (
                              availableOnSelectedDay ? (
                                <span className="px-2 py-0.5 rounded-md text-[9px] uppercase font-black tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1 font-extrabold">
                                  <Check className="w-3 h-3 text-emerald-550 stroke-[3]" />
                                  Available on {selectedDay}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md text-[9px] uppercase font-black tracking-wider bg-red-50 text-red-600 border border-red-150 border-red-200 animate-pulse font-extrabold flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 text-red-500" />
                                  Not Available on {selectedDay}
                                </span>
                              )
                            )}
                          </div>
                          <p className={cn(
                            "text-xs font-bold",
                            (selectedDay !== "All" && !availableOnSelectedDay) ? "text-gray-400" : "text-emerald-600"
                          )}>
                            {doctor.timeSlots}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => deleteDoctor(doctor.id)}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete Doctor"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-50 flex items-center justify-between">
          <p className="text-gray-400 text-sm font-bold">
            Showing {filteredDoctors.length > 0 ? "1" : "0"} to {filteredDoctors.length} of {filteredDoctors.length} doctors
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-primary transition-colors disabled:opacity-30">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-primary-forest font-bold text-sm border border-primary/20">
              1
            </button>
            <button className="p-2 text-gray-400 hover:text-primary transition-colors disabled:opacity-30">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronDown(props) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
