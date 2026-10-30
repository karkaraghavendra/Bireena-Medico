import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Clock, 
  UserCheck, 
  Check,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "../../lib/utils";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const INITIAL_STAFF = [
  { id: "ADMIN_1", name: "Administrator", role: "ADMIN", email: "admin@medico.com", status: "Active" },
  { id: "DOC_1", name: "Dr. Roberts", role: "DOCTOR", email: "roberts@medico.com", status: "Active" },
  { id: "STF_1", name: "Staff Member", role: "RECEPTIONIST", email: "reception@medico.com", status: "Active" },
  { id: "LAB_1", name: "Lab Technician", role: "LAB", email: "lab@medico.com", status: "Active" },
  { id: "PHM_1", name: "Pharmacist", role: "PHARMACY", email: "pharmacy@medico.com", status: "Active" }
];

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

export default function DoctorForm() {
  const navigate = useNavigate();
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    specialization: "General Practitioner",
    experience: "",
    about: "",
    availabilityDays: ["Mon", "Wed", "Fri"],
    slots: [
      { id: "initial-slot", from: "09:00 AM", to: "05:00 PM" }
    ]
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleDay = (day) => {
    setDoctorForm(prev => {
      const days = prev.availabilityDays.includes(day)
        ? prev.availabilityDays.filter(d => d !== day)
        : [...prev.availabilityDays, day];
      return { ...prev, availabilityDays: days };
    });
  };

  const addSlot = () => {
    setDoctorForm(prev => ({
      ...prev,
      slots: [...prev.slots, { id: String(Date.now()), from: "09:00 AM", to: "05:00 PM" }]
    }));
  };

  const removeSlot = (id) => {
    setDoctorForm(prev => ({
      ...prev,
      slots: prev.slots.length > 1 ? prev.slots.filter(s => s.id !== id) : prev.slots
    }));
  };

  const updateSlotTimes = (id, field, value) => {
    setDoctorForm(prev => ({
      ...prev,
      slots: prev.slots.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const handleSaveDoctor = (e) => {
    e.preventDefault();
    if (!doctorForm.name.trim()) {
      alert("Please enter doctor's name");
      return;
    }
    if (!doctorForm.experience || Number(doctorForm.experience) <= 0) {
      alert("Please enter a valid experience period");
      return;
    }
    if (doctorForm.availabilityDays.length === 0) {
      alert("Please check at least one day of availability");
      return;
    }

    const stored = localStorage.getItem("medico_doctors");
    const docList = stored ? JSON.parse(stored) : INITIAL_DOCTORS;

    const colorMap = {
      "General Practitioner": "bg-emerald-100 text-emerald-700",
      "Cardiologist": "bg-blue-100 text-blue-700",
      "Dermatologist": "bg-purple-100 text-purple-700",
      "Pediatrician": "bg-orange-100 text-orange-700",
      "Neurologist": "bg-rose-100 text-rose-700"
    };

    const newDoctor = {
      id: Date.now(),
      name: doctorForm.name.startsWith("Dr. ") ? doctorForm.name.trim() : `Dr. ${doctorForm.name.trim()}`,
      specialization: doctorForm.specialization,
      specializationColor: colorMap[doctorForm.specialization] || "bg-teal-100 text-teal-700",
      availability: DAYS_OF_WEEK.filter(d => doctorForm.availabilityDays.includes(d)).join(", "),
      timeSlots: doctorForm.slots.map(s => `${s.from} - ${s.to}`).join(" / "),
      image: `https://images.unsplash.com/photo-${1551836022 + Math.floor(Math.random() * 500000)}?q=80&w=200&auto=format&fit=crop`
    };

    const updated = [...docList, newDoctor];
    localStorage.setItem("medico_doctors", JSON.stringify(updated));

    // Also register them into the Staff system if they don't already exist
    const staffStored = localStorage.getItem("medico_staff");
    const currentStaff = staffStored ? JSON.parse(staffStored) : INITIAL_STAFF;

    const emailPrefix = doctorForm.name.toLowerCase().replace(/\s+/g, ".").replace("dr.", "");
    const newStaffMember = {
      id: `DOC_${Date.now().toString().slice(-4)}`,
      name: newDoctor.name,
      role: "DOCTOR",
      email: `${emailPrefix}@medico.com`,
      status: "Active"
    };
    const updatedStaff = [...currentStaff, newStaffMember];
    localStorage.setItem("medico_staff", JSON.stringify(updatedStaff));

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      navigate("/doctors");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header and Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
          <Link to="/doctors" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Doctors
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary/60">Add Doctor</span>
        </div>
        <h1 className="text-3xl font-black text-primary-dark tracking-tighter mt-2">Add Doctor</h1>
      </div>

      <form onSubmit={handleSaveDoctor} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-12 space-y-8">
        {saveSuccess && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 font-bold animate-pulse">
            <UserCheck className="w-6 h-6 text-emerald-600" />
            Doctor registration successful! Back to doctors registry...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Basic Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-primary-dark tracking-tight uppercase tracking-wider text-[11px] mb-1">Doctor Demographics</h3>
              <p className="text-gray-400 text-xs font-bold">Enter credentials, specializations, and career profile description.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Sarah Johnson"
                className="w-full h-12 px-5 bg-bg-primary border border-primary/10 rounded-xl focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none font-bold text-gray-700 text-sm"
                value={doctorForm.name}
                onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Specialization</label>
              <select 
                className="w-full h-12 px-5 bg-bg-primary border border-primary/10 rounded-xl focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none font-bold text-gray-700 text-sm"
                value={doctorForm.specialization}
                onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})}
              >
                <option>General Practitioner</option>
                <option>Cardiologist</option>
                <option>Dermatologist</option>
                <option>Pediatrician</option>
                <option>Neurologist</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Experience (Years)</label>
              <input 
                type="number" 
                required
                min="1"
                placeholder="e.g. 12"
                className="w-full h-12 px-5 bg-bg-primary border border-primary/10 rounded-xl focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none font-bold text-gray-700 text-sm"
                value={doctorForm.experience}
                onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">About Doctor & CV Description</label>
              <textarea 
                placeholder="Brief medical background research and professional summary..."
                rows={4}
                className="w-full p-5 bg-bg-primary border border-primary/10 rounded-xl focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none font-bold text-gray-600 text-sm resize-none"
                value={doctorForm.about}
                onChange={(e) => setDoctorForm({...doctorForm, about: e.target.value})}
              />
            </div>
          </div>

          {/* Availability and Time Slots */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-primary-dark tracking-tight uppercase tracking-wider text-[11px] mb-1">Availability Days & Slots</h3>
              <p className="text-gray-400 text-xs font-bold">Configure weekly availability schedule checks and hours.</p>
            </div>

            {/* Availability Checkboxes */}
            <div className="space-y-3 bg-bg-primary/20 p-5 rounded-2xl border border-primary/5">
              <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest flex items-center gap-1">Available Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map(day => {
                  const isChecked = doctorForm.availabilityDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={cn(
                        "h-10 px-4 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5",
                        isChecked 
                          ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                          : "bg-white text-gray-500 border-gray-100 hover:bg-primary/5"
                      )}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Form Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-primary-dark uppercase tracking-widest ml-1">Hours / Time Slots</label>
              </div>

              <div className="space-y-3">
                {doctorForm.slots.map((slot) => (
                  <div key={slot.id} className="flex items-center gap-3 animate-in fade-in slide-in-from-right-1 duration-200">
                    <div className="relative flex-1 group">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        value={slot.from}
                        placeholder="09:00 AM"
                        onChange={(e) => updateSlotTimes(slot.id, "from", e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-bg-primary border border-primary/10 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-xs font-bold text-gray-600"
                      />
                    </div>
                    <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">to</span>
                    <div className="relative flex-1 group">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        value={slot.to}
                        placeholder="05:00 PM"
                        onChange={(e) => updateSlotTimes(slot.id, "to", e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-bg-primary border border-primary/10 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-xs font-bold text-gray-600"
                      />
                    </div>
                    {doctorForm.slots.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeSlot(slot.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                <button 
                  type="button"
                  onClick={addSlot}
                  className="flex items-center gap-1.5 px-4 py-2 border border-primary/20 text-primary rounded-xl font-bold text-xs hover:bg-primary/5 transition-all mt-3"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Slot Range
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
          <button 
            type="button"
            onClick={() => navigate("/doctors")}
            className="px-6 py-2.5 bg-gray-50 text-gray-500 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.03] transition-transform text-sm"
          >
            <Plus className="w-4 h-4 whitespace-nowrap" />
            Save Doctor
          </button>
        </div>
      </form>
    </div>
  );
}
