import { useAuth } from "../hooks/useAuth";
import { Role } from "../types";
import AdminDashboard from "./dashboard/AdminDashboard";
import DoctorDashboard from "./dashboard/DoctorDashboard";
import PatientDashboard from "./dashboard/PatientDashboard";
import StaffDashboard from "./dashboard/StaffDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === Role.ADMIN) return <AdminDashboard user={user} />;
  if (user?.role === Role.DOCTOR) return <DoctorDashboard user={user} />;
  if ([Role.RECEPTIONIST, Role.LAB, Role.PHARMACY].includes(user?.role)) {
    return <StaffDashboard user={user} />;
  }
  return <PatientDashboard user={user} />;
}
