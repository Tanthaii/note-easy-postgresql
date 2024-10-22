import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth"; // ใช้เพื่อดึงข้อมูลผู้ใช้ที่ล็อกอิน
import { auth } from "../firebase"; // ฟังก์ชันเชื่อมต่อ Firebase Auth

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [sortOrder, setSortOrder] = useState("date");
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth); // รับข้อมูลผู้ใช้ที่ล็อกอิน

  // ดึงข้อมูลจาก backend (PostgreSQL) แทน Firebase
  useEffect(() => {
    const fetchNotes = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:5000/notes?userId=${user.uid}`);  // ส่ง userId ไปยัง backend
          // เรียก API เพื่อดึงข้อมูลโน้ต
          const data = await response.json(); // แปลงข้อมูลที่ได้เป็น JSON
          setNotes(data); // อัปเดต state ด้วยข้อมูลโน้ต
          setLoading(false); // ปิดสถานะ loading หลังจากโหลดเสร็จ
        } catch (error) {
          console.error('Error fetching notes:', error); // แสดงข้อผิดพลาดหากดึงข้อมูลไม่สำเร็จ
        }
      }
    };

    fetchNotes(); // เรียกฟังก์ชัน fetchNotes เมื่อคอมโพเนนท์ถูกสร้าง
  }, [user]); // ทำงานใหม่เมื่อ user เปลี่ยนแปลง

  // ฟังก์ชันจัดเรียงโน้ต
  const sortNotes = (notes, order) => {
    if (order === "date") {
      return notes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (order === "category") {
      return notes.sort((a, b) => a.category.localeCompare(b.category));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-500 p-8">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setSortOrder("date")}
          className="px-4 py-2 bg-blue-500 text-white mx-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105"
        >
          Sort by Date
        </button>
        <button
          onClick={() => setSortOrder("category")}
          className="px-4 py-2 bg-blue-500 text-white mx-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105"
        >
          Sort by Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          <p className="ml-4 text-white">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortNotes([...notes], sortOrder).map((note) => (
            <div
              key={note.id}
              className="p-4 border border-black bg-white rounded-md shadow-lg"
              style={{ width: "100%", gridAutoRows: "auto" }}
            >
              <h2 className="font-bold text-lg mb-2">
                {note.title || "No Title"}
              </h2>
              <p className="text-gray-700 mb-2">
                {note.content || "No Content"}
              </p>
              <p className="text-gray-500">{note.category || "No Category"}</p>
              <p className="text-gray-400 text-sm mt-2">
                {new Date(note.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
