import { Routes, Route, Navigate } from "react-router-dom";
import RoleGuard from "../components/RoleGuard";
import Layout from "../components/Layout";
import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard";
import Patients from "../pages/patient/PatientList";
import PatientProfile from "../pages/patient/PatientProfile";
import Appointments from "../pages/appointment/AppointmentList";
import DoctorList from "../pages/doctor/DoctorList";
import AddDoctor from "../pages/doctor/DoctorForm";
import AvailabilityEditor from "../pages/doctor/AvailabilityEditor";
import EMR from "../pages/EMR";
import Pharmacy from "../pages/Pharmacy";
import Laboratory from "../pages/Laboratory";
import Billing from "../pages/Billing";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import UserManagement from "../pages/admin/UserManagement";
import { Role } from "../types";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Universal Protected Routes */}
      <Route element={<RoleGuard allowedRoles={[Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.LAB, Role.PHARMACY, Role.PATIENT]} />}>
        <Route element={<Layout><Dashboard /></Layout>} path="/dashboard" />
        <Route element={<Layout><Settings /></Layout>} path="/settings" />
      </Route>

      {/* Admin & Receptionist */}
      <Route element={<RoleGuard allowedRoles={[Role.ADMIN, Role.RECEPTIONIST]} />}>
        <Route element={<Layout><Billing /></Layout>} path="/billing" />
      </Route>

      {/* Clinical Staff */}
      <Route element={<RoleGuard allowedRoles={[Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST]} />}>
        <Route element={<Layout><Patients /></Layout>} path="/patients" />
        <Route element={<Layout><PatientProfile /></Layout>} path="/patients/:id" />
        <Route element={<Layout><DoctorList /></Layout>} path="/doctors" />
        <Route element={<Layout><AddDoctor /></Layout>} path="/doctors/add" />
        <Route element={<Layout><AvailabilityEditor /></Layout>} path="/doctors/availability" />
        <Route element={<Layout><Appointments /></Layout>} path="/appointments" />
      </Route>

      {/* Clinical Workflows */}
      <Route element={<RoleGuard allowedRoles={[Role.ADMIN, Role.DOCTOR]} />}>
         <Route element={<Layout><EMR /></Layout>} path="/emr" />
      </Route>

      {/* Specialized Modules */}
      <Route element={<RoleGuard allowedRoles={[Role.ADMIN, Role.LAB]} />}>
         <Route element={<Layout><Laboratory /></Layout>} path="/lab" />
      </Route>
      <Route element={<RoleGuard allowedRoles={[Role.ADMIN, Role.PHARMACY]} />}>
         <Route element={<Layout><Pharmacy /></Layout>} path="/pharmacy" />
      </Route>

      {/* Admin Only */}
      <Route element={<RoleGuard allowedRoles={[Role.ADMIN]} />}>
        <Route element={<Layout><Analytics /></Layout>} path="/analytics" />
        <Route element={<Layout><UserManagement /></Layout>} path="/admin/users" />
      </Route>

      {/* Fallback */}
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
           <h1 className="text-9xl font-black text-emerald-50 mb-4 select-none">403</h1>
           <div className="text-center relative -top-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
              <p className="text-gray-500 mb-8 max-w-sm">You do not have the required permissions to access this clinical module.</p>
              <button onClick={() => window.history.back()} className="h-12 px-8 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-600/20 hover:scale-105 transition-transform">
                 Go Back
              </button>
           </div>
        </div>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
