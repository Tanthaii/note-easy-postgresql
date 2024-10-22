import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';  // นำเข้า Register component
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  {/* เส้นทางสำหรับหน้าล็อกอิน */}
        <Route path="/register" element={<Register />} />  {/* เส้นทางสำหรับหน้า Register */}
        <Route path="/notes" element={(
          <>
            <NoteForm />
            <NoteList />
          </>
        )} />  {/* เส้นทางสำหรับหน้าจัดการ Note */}
      </Routes>
    </Router>
  );
}

export default App;
