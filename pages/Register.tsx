import React, { useState } from 'react';
import { CameraView } from '../components/CameraView';
import { Student } from '../types';
import { Save, UserPlus, Trash2 } from 'lucide-react';
import { saveStudent } from '../services/db';

interface RegisterProps {
  onSuccess: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    className: '',
  });
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capturedImage) {
      alert("Please capture a face photo first.");
      return;
    }

    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const newStudent: Student = {
        id: crypto.randomUUID(),
        name: formData.name,
        rollNumber: formData.rollNumber,
        className: formData.className,
        photoUrl: capturedImage,
        registeredAt: new Date().toISOString(),
      };

      saveStudent(newStudent);
      setLoading(false);
      onSuccess();
      setFormData({ name: '', rollNumber: '', className: '' });
      setCapturedImage(null);
      alert("Student registered successfully!");
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-indigo-600" />
            Register Student
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="e.g. John Doe"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label>
                <input
                  type="text"
                  required
                  value={formData.rollNumber}
                  onChange={e => setFormData({...formData, rollNumber: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="e.g. 101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                <input
                  type="text"
                  required
                  value={formData.className}
                  onChange={e => setFormData({...formData, className: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="e.g. CS-A"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !capturedImage}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-white transition-all shadow-lg
                ${loading || !capturedImage 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'}`}
            >
              {loading ? 'Saving...' : <><Save className="w-5 h-5" /> Register Student</>}
            </button>
          </form>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-700">
          <strong>Note:</strong> Ensure the face is clearly visible and well-lit. This image will be used as the reference for attendance marking.
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Face Capture</h3>
        {capturedImage ? (
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-video bg-black">
            <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
            <button 
              onClick={() => setCapturedImage(null)}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-sm font-medium text-center">Image Captured Successfully</p>
            </div>
          </div>
        ) : (
          <CameraView onCapture={handleCapture} label="Capture Reference Photo" />
        )}
      </div>
    </div>
  );
};