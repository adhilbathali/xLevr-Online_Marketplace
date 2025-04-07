// src/App.js (Modified)
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Categories from './pages/Categories/Categories';
import HowItWorks from './pages/How_It_Works/HowItWorks';
import Login from './components/Auth/Login'; // Assuming this is your student login component path
import Signup from './components/Auth/Signup';
import Footer from './components/Footer/Footer';
import Require from './pages/RequirementForm/Require';
import Chat from './pages/Message/message';
import StudentRegister from './components/Auth/Student_register'; // Ensure path is correct
import StudentDashboard from './pages/Student_Dashboard/StudentDashboard'; // Ensure path is correct

// Import the ProtectedRoute component
import ProtectedRoute from './components/Routing/ProtectedRoute'; // <-- Import ProtectedRoute (adjust path if needed)

function App() {
  return (
    <div> {/* Keep the structure */}
      <Navbar />
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/login" element={<Login />} /> {/* Student login route */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/student-register" element={<StudentRegister/>} />
        <Route path="/student-dashboard" element={<StudentDashboard/>} />
        <Route path='/require' element={<Require/>} />
        <Route path="/Chat" element={<Chat />} />

        {/* --- Protected Student Route --- */}
        <Route
          path="/student-dashboard" // The path for the dashboard
          element={
            // Wrap the component with ProtectedRoute
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Add other routes here if needed */}

      </Routes>
      <Footer />
    </div>
  );
}

export default App;