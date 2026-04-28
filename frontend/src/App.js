import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import ChatbotPage from './pages/ChatbotPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/upload" replace />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/results/:jobId" element={<ResultsPage />} />
          <Route path="/chatbot/:jobId" element={<ChatbotPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
