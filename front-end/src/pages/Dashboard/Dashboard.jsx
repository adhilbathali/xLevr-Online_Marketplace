// src/components/Dashboard/Dashboard.jsx
// *** FINAL VERSION: Fetches user data, renders full UI conditionally ***

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Ensure the CSS module import is correct and uncommented
import styles from './Dashboard.module.css';
import { MessageSquare } from 'lucide-react';
import axios from 'axios';

// Define your backend API Base URL (MUST MATCH backend port and Login.jsx)
const API_BASE_URL = 'http://localhost:5000'; // <-- ADJUST PORT IF NEEDED


function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Keep for potential error redirects

    // Demo project states
    const [invitations, setInvitations] = useState([]);
    const [activeProjects, setActiveProjects] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
    const [unacceptedProjects, setUnacceptedProjects] = useState([]);

    const user = JSON.parse(localStorage.getItem("authUser"));

    const fetchGigs = async () => {
      try {
          console.log("🚀 Starting axios request...");

          if (!user || !user.role || !user.id) {
              throw new Error("User info missing from localStorage");
          }

          if (user.role === "student") {
              const response = await axios.get(`http://localhost:5000/api/gigs/student/dashboard/${user.id}`);
              console.log("✅ Student gigs received:", response.data);

              setInvitations(response.data.notifiedGigs);
              setActiveProjects(response.data.acceptedGigs);
              setCompletedProjects(response.data.completedGigs);
          } else if (user.role === "professional") {
              const response = await axios.get(`http://localhost:5000/api/gigs/professional/dashboard/${user.id}`);
              console.log("✅ Professional gigs received:", response.data);

              setActiveProjects(response.data.activeGigs);
              setCompletedProjects(response.data.completedGigs);
              setUnacceptedProjects(response.data.unacceptedGigs);
          } else {
              throw new Error("Invalid user role.");
          }

      } catch (err) {
          console.error("❌ Axios Error:", err.response?.data || err.message || err);
          setError("Failed to fetch gigs.");
      } finally {
          setLoading(false);
      }
  };



    useEffect(() => {
      fetchGigs();
    }, [user.id]);
    

    useEffect(() => {
        // console.log("Dashboard mounting. Fetching user data..."); // Keep logs if helpful
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('authToken');

            if (!token) {
                console.error("Dashboard Error: No auth token found.");
                setError('Authentication token not found. Please login.');
                setLoading(false);
                // navigate('/login'); // Consider enabling redirect
                return;
            }

            try {
                // console.log("Dashboard: Sending request to /api/auth/me");
                const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                });
                // console.log("Dashboard: Received response status:", response.status);

                if (response.ok) {
                    const data = await response.json();
                    // console.log("Dashboard: Fetched user data:", data);
                    if (data?.role) { // Check if data and role exist
                        setUserData(data);
                        // console.log("Dashboard: User data set successfully.");
                    } else {
                        console.error("Dashboard Error: Fetched data missing role:", data);
                        setError("Failed to load valid user profile data.");
                    }
                } else { // Handle HTTP errors
                    if (response.status === 401) {
                       console.error("Dashboard Error: 401 Unauthorized.");
                       setError('Session expired/invalid. Please log in again.');
                       localStorage.removeItem('authToken');
                       localStorage.removeItem('authUser');
                       // navigate('/login'); // Consider enabling redirect
                    } else {
                       let errorMsg = `Error fetching data: Status ${response.status}`;
                       try { const errorData = await response.json(); errorMsg = errorData.message || errorMsg; } catch (e) { /* ignore parsing error */ }
                       setError(errorMsg);
                       console.error(`Dashboard Error: ${errorMsg}`);
                    }
                }
            } catch (err) { // Handle network errors
                console.error("Dashboard Error: Network error during fetch:", err);
                setError('Network error fetching profile.');
            } finally {
                // console.log("Dashboard: Setting loading to false.");
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]); // Dependency array

    // handle accept and reject work
    const handleAccept = async (gigId) => {
        try {
          console.log("📡 Sending accept request for gig:", gigId);
      
          const response = await axios.post(`http://localhost:5000/api/gigs/accept/${gigId}`, {
            "studentId": `${JSON.parse(localStorage.getItem("authUser"))?.id}`,

          });
      
          console.log("✅ Gig accepted:", response.data);
          fetchGigs(); // refetch data if function is passed
        } catch (error) {
          const errMsg = error.response?.data || "❌ Failed to accept gig.";
          console.error("❌ Error accepting gig:", errMsg);
          setError(errMsg);
        }
      };

      const handleReject = async (gigId) => {
        try {
          const response = await axios.post(
            `http://localhost:5000/api/gigs/reject/${gigId}`,
            { studentId : `${JSON.parse(localStorage.getItem("authUser"))?.id}` }, // Sending the student ID in the body
          );
      
          setSuccess("Gig rejected successfully.");
          fetchGigs(); // Refresh the list of gigs after rejection
        } catch (err) {
          console.error("❌ Reject Gig Error:", err.response?.data || err.message);
          setError("Failed to reject gig.");
        }
      };

    // handle approve
    const handleApprove = async (gigId) => {
        try {
          console.log("📡 Sending approve request for gig:", gigId);
      
          const response = await axios.post(
            `http://localhost:5000/api/gigs/approve/${gigId}`,
            {
              professionalId: `${JSON.parse(localStorage.getItem("authUser"))?.id}`,
            }
          );
      
          console.log("✅ Gig approved:", response.data);
          fetchGigs(); // Refresh data after approval
        } catch (error) {
          const errMsg = error.response?.data || "❌ Failed to approve gig.";
          console.error("❌ Error approving gig:", errMsg);
          setError(errMsg);
        }
      };      
      

    // --- RENDER LOGIC ---
    // 1. Show Loading Indicator
    if (loading) {
        return <div className={styles.loadingMessage}>Loading Dashboard...</div>; // Use CSS module class
    }

    // 2. Show Error Message
    if (error) {
        return (
            // Use CSS module class
            <div className={styles.errorMessage} style={{ padding: '20px', textAlign: 'center' }}>
                <p>Error: {error}</p>
                <Link to="/login">Return to Login</Link>
            </div>
        );
    }

    // 3. Show Message if Data is Still Missing (Should ideally be caught by error state now)
    if (!userData) {
        return <div className={styles.errorMessage} style={{ padding: '20px', textAlign: 'center' }}>Could not load user data. Please try logging in again.</div>; // Use CSS module class
    }

    // 4. Render the MAIN Dashboard Content
    return (
        // Use the main container style
        <div className={styles.dashboardContainer}>

            {/* == CONDITIONAL TITLE == */}
            <h1>{userData.role === 'student' ? "Student Dashboard" : "Professional Dashboard"}</h1>
            <h2>Welcome, {userData.firstName || userData.username}!</h2>

            {/* --- Profile Summary Section --- */}
            <section className={styles.dashboardSection}>
                <h2>Profile Summary</h2>
                <div className={styles.profileSummary}>
                    <img
                        // TODO: Replace with actual profile picture URL from userData if available
                        src={'https://via.placeholder.com/80'}
                        alt={`${userData.firstName || userData.username}'s profile`}
                        className={styles.profilePic}
                    />
                    <div className={styles.profileInfo}>
                        <h3>
                           {userData.firstName && userData.lastName
                               ? `${userData.firstName} ${userData.lastName}`
                               : userData.username // Fallback to username
                           }
                        </h3>
                        <p>Email: {userData.email}</p>
                        <p>Role: <strong style={{ textTransform: 'capitalize' }}>{userData.role}</strong></p>

                        {/* == CONDITIONAL STUDENT DETAILS == */}
                        {userData.role === 'student' && (
                            <>
                                {userData.university && <p><strong>University:</strong> {userData.university}</p>}
                                {userData.studentId && <p><strong>Student ID:</strong> {userData.studentId}</p>}
                                {userData.graduationYear && <p><strong>Graduation Year:</strong> {userData.graduationYear}</p>}
                                {/* Ensure isVerified comes from backend /me response for students */}
                                {userData.hasOwnProperty('isVerified') && <p><strong>Account Verified:</strong> {userData.isVerified ? 'Yes' : 'No'}</p>}
                            </>
                        )}

                        {/* == CONDITIONAL PROFESSIONAL DETAILS == */}
                        {userData.role === 'professional' && (
                            <>
                                {/* Add professional-specific fields fetched from /api/auth/me if they exist */}
                                {/* Example: {userData.company && <p><strong>Company:</strong> {userData.company}</p>} */}
                                <p><i>(Professional-specific profile details go here if available)</i></p>
                            </>
                        )}

                        {/* TODO: Display skills if available in userData */}
                        {/* {userData.skills && userData.skills.length > 0 && (
                            <p className={styles.skillsPreview}>
                                <strong>Skills:</strong> {userData.skills.slice(0, 5).join(', ')}{userData.skills.length > 5 ? '...' : ''}
                            </p>
                        )} */}

                        <Link to="/profile/edit" className={styles.editProfileButton}>
                            Edit Profile & Skills
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- Role-Specific Sections --- */}

            {/* == STUDENT: Invitations Section (Uses Demo Data for now) == */}
            {userData.role === 'student' && (
                 <section className={styles.dashboardSection}>
                    <h2>New Project Invitations</h2>
                    {/* TODO: Replace with actual fetch/render logic for student invitations */}
                    {invitations.length === 0 ? (<p>No new project invitations.</p>) : (
                        <div className={styles.projectList}>
                            {invitations.map((inv) => (
                                <div key={inv.id} className={styles.projectCard}>
                                     <h3>{inv.title}</h3>
                                     <p className={styles.description}>{inv.description}</p>
                                     <p><strong>Skills:</strong> {inv.refinedFilters.RS.join(', ')}</p>
                                     <p><strong>Budget:</strong> {inv.projectBudget}</p>
                                     <p><strong>Deadline:</strong> {inv.deadline.slice(0, 10)}</p>
                                     {inv.clientName && <p><strong>Client:</strong> {inv.clientName}</p>}
                                     <div className={styles.actionButtons}>
                                         <button onClick={() => handleAccept(inv._id)} className={`${styles.button} ${styles.accept}`}>Accept Work</button>
                                         <button onClick={() => handleReject(inv._id)} className={`${styles.button} ${styles.reject}`}>Reject</button>
                                     </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* == PROFESSIONAL: Post Job / Manage Postings Section == */}
            {userData.role === 'professional' && (
                <section className={styles.dashboardSection}>
                    <h2>Manage Job Postings</h2>
                    {/* TODO: Fetch professional's posted jobs */}
                    <p>(List of your posted jobs - Pending, Active, Completed - goes here)</p>
                    {/* --- MODIFIED Link --- */}
                    <Link
                        to="/categories" // <-- CHANGE THIS to navigate to categories page
                        className={styles.button}
                        style={{backgroundColor: '#17a2b8', color:'white', textDecoration:'none'}}
                    >
                        Post a New Job Requirement
                    </Link>
                     {/* --- END MODIFIED Link --- */}
                </section>
             )}

            {/* == STUDENT: Active + Completed Projects == */}
{userData.role === 'student' && (
  <>
    {/* --- Active Projects Section (Student) --- */}
    <section className={styles.dashboardSection}>
      <h2>My Active Projects</h2>
      {activeProjects.length === 0 ? (
        <p>No active projects.</p>
      ) : (
        <div className={styles.projectList}>
          {activeProjects.map((proj) => (
            <div key={proj.id} className={`${styles.projectCard} ${styles.activeProject}`}>
              <div className={styles.cardHeader}>
                <h3>{proj.projectTitle}</h3>
                <Link to={`/chat/`} className={styles.msgLink} title={`Message ${proj.companyTitle}`}>
                  <MessageSquare size={20} />
                </Link>
              </div>
              <p><strong>Client:</strong> {proj.companyTitle}</p>
              <p><strong>Deadline:</strong> {proj.deadline.slice(0, 10)}</p>
              <p><strong>Status:</strong> {proj.status}</p>
            </div>
          ))}
        </div>
      )}
    </section>

    {/* --- Completed Projects Section (Student) --- */}
    <section className={styles.dashboardSection}>
      <h2>Completed Projects</h2>
      {completedProjects.length === 0 ? (
        <p>No completed projects.</p>
      ) : (
        <div className={styles.projectList}>
          {completedProjects.map((proj) => (
            <div key={proj.id} className={`${styles.projectCard} ${styles.completedProject}`}>
              <h3>{proj.title}</h3>
              <p><strong>Client:</strong> {proj.companyTitle}</p>
              <p><strong>Completed:</strong> {proj.deadline.slice(0, 10)}</p>
              <p><strong>Earned:</strong> {proj.projectBudget}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  </>
)}

{/* == PROFESSIONAL: Active + Completed Projects == */}
{userData.role === 'professional' && (
  <>

    {/* --- Awaiting Student Acceptance Section --- */}
    <section className={styles.dashboardSection}>
      <h2>Awaiting Student Acceptance</h2>
      {unacceptedProjects.length === 0 ? (
        <p>No pending invitations.</p>
      ) : (
        <div className={styles.projectList}>
          {unacceptedProjects.map((proj) => (
            <div key={proj.id} className={`${styles.projectCard} ${styles.awaitingProject}`}>
              <h3>{proj.projectTitle}</h3>
              <p><strong>Posted On:</strong> {proj.createdAt.slice(0, 10)}</p>
              <p><strong>Budget:</strong> {proj.projectBudget}</p>
              <p><strong>Skills Required:</strong> {proj.refinedFilters.RS.join(', ')}</p>
              <p><strong>Deadline:</strong> {proj.deadline.slice(0, 10)}</p>
              <p><strong>Status:</strong> {proj.status}</p>
            </div>
          ))}
        </div>
      )}
    </section>


    {/* --- Active Projects Section (Professional) --- */}
    <section className={styles.dashboardSection}>
      <h2>Pending Approvals</h2>
      {activeProjects.length === 0 ? (
        <p>No active projects.</p>
      ) : (
        <div className={styles.projectList}>
          {activeProjects.map((proj) => (
            <div key={proj.id} className={`${styles.projectCard} ${styles.activeProject}`}>
              <div className={styles.cardHeader}>
                <h3>{proj.projectTitle}</h3>
              </div>
              <p><strong>Client:</strong> {proj.companyTitle}</p>
              <p><strong>Deadline:</strong> {proj.deadline.slice(0, 10)}</p>
              <button className={styles.approveBtn} onClick={() => handleApprove(proj._id)}>
                Approve Work
              </button>
            </div>
          ))}
        </div>
      )}
    </section>

    {/* --- Completed Projects Section (Professional) --- */}
    <section className={styles.dashboardSection}>
      <h2>Completed Projects</h2>
      {completedProjects.length === 0 ? (
        <p>No completed projects.</p>
      ) : (
        <div className={styles.projectList}>
          {completedProjects.map((proj) => (
            <div key={proj.id} className={`${styles.projectCard} ${styles.completedProject}`}>
              <h3>{proj.projectTitle}</h3>
              <p><strong>Client:</strong> {proj.companyTitle}</p>
              <p><strong>Completed:</strong> {proj.deadline?.slice(0, 10)}</p>
              <p><strong>Earned:</strong> {`₹${proj.projectBudget}`}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  </>
)}


        </div>
    );
}

export default Dashboard;