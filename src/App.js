import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ScalePractice from './pages/ScalePractice';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h1 className="text-4xl font-bold">Music Theory Trainer</h1>
      <Link
        to="/scale-practice"
        className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
      >
        Scale Practice
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scale-practice" element={<ScalePractice />} />
      </Routes>
    </Router>
  );
} 