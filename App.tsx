import React, { useState, useEffect } from 'react';
import { LayoutDashboard, UserPlus, ScanFace, FileBarChart, LogOut, Menu, X } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Register } from './pages/Register';
import { Attendance } from './pages/Attendance';
import { Reports } from './pages/Reports';
import { ViewState, Student, AttendanceRecord } from './types';
import { getStudents, getAttendance } from './services/db';

export default function App() {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initial Data Load
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setStudents(getStudents());
    setAttendance(getAttendance());
  };

  const NavItem = ({ id, label, icon: Icon }: { id: ViewState, label: string, icon: any }) => (
    <button
      onClick={() => {
        setView(id);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 
        ${view === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ScanFace className="w-8 h-8 text-indigo-500" />
          <span className="font-bold text-xl tracking-tight">FaceGuard</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`
        fixed md:sticky md:top-0 h-screen w-64 bg-slate-900 text-white p-6 flex flex-col z-40 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:flex items-center gap-2 mb-10 px-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <ScanFace className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">FaceGuard</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem id="DASHBOARD" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="REGISTER" label="Register Student" icon={UserPlus} />
          <NavItem id="ATTENDANCE" label="Mark Attendance" icon={ScanFace} />
          <NavItem id="REPORTS" label="Reports" icon={FileBarChart} />
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            v1.0.0 • Client Simulation
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen scroll-smooth">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {view === 'DASHBOARD' && 'Overview'}
              {view === 'REGISTER' && 'Registration'}
              {view === 'ATTENDANCE' && 'Live Attendance'}
              {view === 'REPORTS' && 'Analytics'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Welcome to the attendance management portal.</p>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Admin User</span>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {view === 'DASHBOARD' && <Dashboard students={students} attendance={attendance} />}
        {view === 'REGISTER' && <Register onSuccess={refreshData} />}
        {view === 'ATTENDANCE' && <Attendance students={students} onUpdate={refreshData} />}
        {view === 'REPORTS' && <Reports attendance={attendance} students={students} />}
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}