import React, { useState } from 'react';
import { CameraView } from '../components/CameraView';
import { Student, AttendanceRecord } from '../types';
import { recognizeFace } from '../services/faceMockService';
import { markAttendance } from '../services/db';
import { CheckCircle, AlertCircle, ScanFace } from 'lucide-react';

interface AttendanceProps {
  students: Student[];
  onUpdate: () => void;
}

export const Attendance: React.FC<AttendanceProps> = ({ students, onUpdate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    status: 'idle' | 'success' | 'failed';
    student?: Student;
    message?: string;
  }>({ status: 'idle' });

  const handleScan = async (imageData: string) => {
    setIsProcessing(true);
    setResult({ status: 'idle' });

    try {
      const matchResult = await recognizeFace(imageData, students);

      if (matchResult.match && matchResult.student) {
        const student = matchResult.student;
        
        const record: AttendanceRecord = {
          id: crypto.randomUUID(),
          studentId: student.id,
          studentName: student.name,
          studentRoll: student.rollNumber,
          date: new Date().toISOString().split('T')[0],
          timestamp: new Date().toISOString(),
          status: 'Present',
          confidence: matchResult.confidence
        };

        markAttendance(record);
        onUpdate();
        
        setResult({
          status: 'success',
          student: student,
          message: `Attendance marked for ${student.name}`
        });
      } else {
        setResult({
          status: 'failed',
          message: "Face not recognized. Please try again or register the student."
        });
      }
    } catch (error) {
      setResult({ status: 'failed', message: "System error occurred." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <ScanFace className="w-8 h-8 text-indigo-600" />
          Mark Attendance
        </h2>
        <p className="text-slate-500 mt-2">Position yourself in the frame and click scan.</p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="w-full max-w-2xl relative">
          <CameraView 
            onCapture={handleScan} 
            isScanning={isProcessing} 
            label="Scan Face"
          />
          
          {/* Result Overlay */}
          {result.status !== 'idle' && (
            <div className={`mt-6 p-4 rounded-xl border flex items-center gap-4 max-w-lg mx-auto shadow-lg animate-in zoom-in duration-300
              ${result.status === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              
              <div className={`p-2 rounded-full ${result.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                {result.status === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-lg">
                  {result.status === 'success' ? 'Success!' : 'Not Recognized'}
                </h4>
                <p className="text-sm opacity-90">{result.message}</p>
                {result.student && (
                   <p className="text-xs mt-1 font-mono bg-white/50 inline-block px-2 py-1 rounded">
                     Roll: {result.student.rollNumber} • Class: {result.student.className}
                   </p>
                )}
              </div>

              {result.status === 'success' && result.student?.photoUrl && (
                <img 
                  src={result.student.photoUrl} 
                  alt="Match" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
              )}
            </div>
          )}
        </div>

        <div className="w-full max-w-lg">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 text-sm mb-1">Demo Mode Info:</h4>
            <p className="text-xs text-yellow-700">
              This is a client-side simulation. In a real Python implementation:
            </p>
            <ul className="text-xs text-yellow-700 list-disc ml-4 mt-1 space-y-1">
              <li>The captured image is sent to the backend API.</li>
              <li>DeepFace/Facenet512 compares embeddings.</li>
              <li>Here, we simulate a random match with registered students for demonstration.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};