import React, { useState } from 'react';
import { AttendanceRecord, Student } from '../types';
import { FileDown, Search, Filter } from 'lucide-react';

interface ReportsProps {
  attendance: AttendanceRecord[];
  students: Student[];
}

export const Reports: React.FC<ReportsProps> = ({ attendance, students }) => {
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = attendance.filter(record => {
    const matchesDate = record.date === filterDate;
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.studentRoll.includes(searchTerm);
    return matchesDate && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ["Date", "Name", "Roll No", "Time", "Status", "Confidence"];
    const rows = filteredRecords.map(r => [
      r.date, 
      r.studentName, 
      r.studentRoll, 
      new Date(r.timestamp).toLocaleTimeString(), 
      r.status, 
      `${(r.confidence * 100).toFixed(1)}%`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${filterDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Attendance Reports</h2>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          <FileDown className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-slate-400 w-5 h-5" />
          <input 
            type="date" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 font-semibold text-slate-600 text-sm">Student</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Roll No</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Time</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{record.studentName}</div>
                    </td>
                    <td className="p-4 text-slate-600">{record.studentRoll}</td>
                    <td className="p-4 text-slate-600 font-mono text-xs">
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">
                      {(record.confidence * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No attendance records found for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};