import { Student } from '../types';

// In a real production app, this would interact with the Python Backend (DeepFace)
// or use tensorflow.js/face-api.js in the browser.
// For this portable demo, we simulate the "Matching" process.

export const captureImage = (videoElement: HTMLVideoElement): string => {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  }
  return '';
};

// Simulates sending the image to the backend for recognition
export const recognizeFace = async (
  currentImage: string,
  students: Student[]
): Promise<{ match: boolean; student?: Student; confidence: number }> => {
  
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // LOGIC FOR DEMO:
      // If we have students, we pick one randomly or successful match logic.
      // In a real app, this compares 'currentImage' with student.photoUrl embeddings.
      
      if (students.length === 0) {
        resolve({ match: false, confidence: 0 });
        return;
      }

      // For demonstration purposes, we will return a successful match 
      // of the last registered student (to make testing easy for the user),
      // or a random one if they want to simulate multiple people.
      
      // We'll mimic a 80% success rate for the demo effect
      const isSuccess = Math.random() > 0.2; 
      
      if (isSuccess) {
        // Pick a random student
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        resolve({
          match: true,
          student: randomStudent,
          confidence: 0.85 + Math.random() * 0.14 // Random high confidence
        });
      } else {
        resolve({ match: false, confidence: 0.1 + Math.random() * 0.2 });
      }

    }, 1500); // 1.5s delay
  });
};