import React, { useMemo } from 'react';
import { Student, AttendanceRecord } from '../types';
import { Users, UserCheck, Clock, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  students: Student[];
  attendance: AttendanceRecord[];
}

export const Dashboard: React.FC<DashboardProps> = ({ students, attendance }) => {
  const today = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    const todayRecords = attendance.filter(r => r.date === today);
    const presentCount = todayRecords.length;
    const totalStudents = students.length;
    const absentCount = Math.max(0, totalStudents - presentCount);
    
    // Calculate weekly data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const chartData = last7Days.map(date => {
      const count = attendance.filter(r => r.date === date).length;
      return { date: date.slice(5), present: count };
    });

    return { presentCount, totalStudents, absentCount, chartData };
  }, [students, attendance, today]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={<Users className="text-blue-500" />} 
          color="bg-blue-50"
        />
        <StatCard 
          title="Present Today" 
          value={stats.presentCount} 
          icon={<UserCheck className="text-green-500" />} 
          color="bg-green-50"
        />
        <StatCard 
          title="Absent Today" 
          value={stats.absentCount} 
          icon={<Clock className="text-orange-500" />} 
          color="bg-orange-50"
        />
        <StatCard 
          title="Date" 
          value={today} 
          icon={<Calendar className="text-purple-500" />} 
          color="bg-purple-50"
          isText
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Weekly Attendance Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="present" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {attendance.slice().reverse().slice(0, 5).map((record) => (
              <div key={record.timestamp} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {record.studentName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{record.studentName}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(record.timestamp).toLocaleTimeString()} • {record.status}
                  </p>
                </div>
              </div>
            ))}
            {attendance.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-4">No records yet today.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, isText = false }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 transition hover:shadow-md">
    <div className={`p-3 rounded-lg ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className={`text-2xl font-bold text-slate-800 ${isText ? 'text-lg' : ''}`}>{value}</p>
    </div>
  </div>
);