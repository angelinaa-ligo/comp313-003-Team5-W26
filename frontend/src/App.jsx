import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css'
import LoginForm from './pages/LoginForm';
import SignUpForm from './pages/SignupForm';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>        
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/l" element={<Navigate to="/home" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App
