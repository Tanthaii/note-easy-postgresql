import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const NoteForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [user] = useAuthState(auth);

  const handleAddNote = async () => {
    try {
      if (user) {
        const response = await fetch('http://localhost:5000/add-note', {  // ระบุ URL ที่ถูกต้องไปยัง backend
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            category,
            userId: user.uid,
          }),
        });
        
  
        const data = await response.json();  // ตรวจสอบการตอบกลับจาก API
        console.log(data);  // ดูว่าการตอบกลับจาก API เป็นอย่างไร
  
        if (response.ok) {
          setTitle('');
          setContent('');
          setCategory('');
        } else {
          alert('Error adding note');
        }
      }
    } catch (error) {
      console.error('Error:', error.message);  // ตรวจสอบข้อผิดพลาดจากการเรียก API
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-green-500">
      <h1 className="text-5xl font-bold text-white mb-4">Note</h1>
      <div className="flex items-center justify-center w-full">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border flex-1 mr-2 bg-white"
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="p-2 border flex-1 mr-2 bg-white"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border flex-1 mr-2 bg-white"
        />
        <button
          onClick={handleAddNote}
          className="bg-blue-500 hover:bg-red-600 p-2 text-white rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
        >
          Add Note
        </button>
      </div>
    </div>
  );
};

export default NoteForm;
