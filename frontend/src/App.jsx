import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/navbar';
import Hero from './components/sections/hero';
import Features from './components/sections/features';
import Footer from './components/layout/footer';
import RegisterComplaint from './pages/registercomplaint';
import Profile from './pages/profile';
import ResultPage from './pages/resultpage';

const LandingPage = () => (
  <>
    <Hero />
    <Features />
    <Footer />
  </>
);

const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/result';

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register-complaint" element={<RegisterComplaint />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </div>
  );
};

export default App;
