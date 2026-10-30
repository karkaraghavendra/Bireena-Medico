export default function DoctorDashboard({ user }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
      <h1 className="text-3xl font-black text-primary-dark tracking-tighter italic">Doctor Dashboard</h1>
      <p className="text-gray-500 mt-2 font-medium">Welcome back, <span className="text-primary font-bold">{user?.name}</span>. You have 0 pending consultations today.</p>
    </div>
  );
}
