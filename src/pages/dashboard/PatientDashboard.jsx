export default function PatientDashboard({ user }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
      <h1 className="text-3xl font-black text-primary-dark tracking-tighter italic">Patient Dashboard</h1>
      <p className="text-gray-500 mt-2 font-medium">Hello, <span className="text-primary font-bold">{user?.name}</span>. Your health records are up to date.</p>
    </div>
  );
}
