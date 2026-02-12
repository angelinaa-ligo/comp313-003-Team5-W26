import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>        
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App
