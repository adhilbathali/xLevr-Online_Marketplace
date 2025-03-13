import React from 'react';
import { Routes, Route } from 'react-router-dom'; // NO BrowserRouter here
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Categories from './pages/Categories/Categories';
import HowItWorks from './pages/How_It_Works/HowItWorks';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div> {/* Removed BrowserRouter, just a regular div now */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;