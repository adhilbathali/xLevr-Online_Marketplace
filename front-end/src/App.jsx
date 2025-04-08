// src/App.js (Corrected)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Added Router and Navigate
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Categories from './pages/Categories/Categories';
import HowItWorks from './pages/How_It_Works/HowItWorks';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Footer from './components/Footer/Footer';
import Require from './pages/RequirementForm/Require';
import Chat from './pages/Message/message';
import StudentRegister from './components/Auth/Student_register';
import Dashboard from './pages/Dashboard/Dashboard'; // Renamed import

// Import the ProtectedRoute component
import ProtectedRoute from './components/Routing/ProtectedRoute';

function App() {
  return (
    // Wrap everything in Router
    <Router>
      <div> {/* Keep the structure */}
        <Navbar />
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/student-register" element={<StudentRegister/>} />
          {/* <Route path="/dashboard" element={<Dashboard/>} /> */} {/* <-- REMOVED this public route */}
          <Route path='/require' element={<Require/>} />
          <Route path="/Chat" element={<Chat />} /> {/* Note: Case-sensitive path? Usually lowercase */}

          {/* --- Protected Routes --- */}
          <Route element={<ProtectedRoute />}> {/* Protection Wrapper */}
            <Route path="/student/dashboard" element={<Dashboard />} /> Uses unified Dashboard
            <Route path="/professional/dashboard" element={<Dashboard />} /> {/* Uses unified Dashboard */}
            {/* Add other protected routes here, e.g.: */}
            {/* <Route path="/profile/edit" element={<EditProfile />} /> */}
            {/* <Route path="/jobs/post" element={<PostJobForm />} /> */}
          </Route>

          {/* Optional: Catch-all 404 Route */}
           <Route path="*" element={<div>404 Page Not Found</div>} />

        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;