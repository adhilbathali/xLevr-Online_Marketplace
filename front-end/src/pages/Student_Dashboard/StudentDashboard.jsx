// src/components/Dashboard/StudentDashboard.jsx
// --- MODIFIED TO FETCH REAL USER DATA ---

import React, { useState, useEffect } from 'react'; // Import useEffect
import { Link } from 'react-router-dom';
import styles from './StudentDashboard.module.css';
import { MessageSquare } from 'lucide-react'; // Keep if used

// Define your backend API Base URL (MUST MATCH backend port and Login.jsx)
const API_BASE_URL = 'http://localhost:5000'; // <-- ADJUST PORT IF NEEDED (e.g., 5001)

// --- Keep DEMO data for project sections for now ---
// We will fetch this separately later
const initialInvitations = [
    { id: 'proj123', title: 'Build a Simple Landing Page', description: 'Need a responsive landing page using HTML/CSS.', skills: ['HTML', 'CSS'], budget: '$150', deadline: '2024-08-15', clientName: 'Demo Startup Inc.' },
    { id: 'proj456', title: 'React Component Development', description: 'Create reusable React components for our library.', skills: ['React', 'JavaScript'], budget: '$40/hr', deadline: '2024-08-20', clientName: 'Demo Tech Solutions' },
];
const initialActiveProjects = [
    { id: 'proj789', title: 'Blog Post Writing', clientName: 'Demo Content Creators', deadline: '2024-08-10', status: 'In Progress', workspaceUrl: '/demo-projects/proj789' },
];
const initialCompletedProjects = [
    { id: 'proj001', title: 'Logo Design', clientName: 'Demo Marketing Co.', completionDate: '2024-07-25', amountEarned: '$100' },
];
// --- End DEMO Project Data ---


function StudentDashboard() {
    // --- State for Fetched Data ---
    const [studentData, setStudentData] = useState(null); // To store data from /api/auth/me
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- State for Demo Project Data (kept temporarily) ---
    const [invitations, setInvitations] = useState(initialInvitations);
    const [activeProjects, setActiveProjects] = useState(initialActiveProjects);
    const [completedProjects, setCompletedProjects] = useState(initialCompletedProjects);

    // --- Fetch User Data Effect ---
    useEffect(() => {
        const fetchStudentData = async () => {
            setLoading(true);
            setError(null);
            // Use the SAME key used to store the token during login
            const token = localStorage.getItem('authToken'); // <-- MAKE SURE THIS KEY MATCHES LOGIN.JSX

            if (!token) {
                setError('Authentication token not found. Please login.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Send the token
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched student data:", data); // Log fetched data
                    // Ensure the fetched user is actually a student
                    if (data && data.role === 'student') {
                        setStudentData(data); // Set the profile data
                        // Note: We are NOT setting project/invitation data here yet
                    } else {
                        console.error("User data fetched, but role is not 'student':", data);
                        setError("Logged in user is not a student.");
                    }
                } else {
                    // Handle HTTP errors (401, 404, 500 etc.)
                    if (response.status === 401) {
                       setError('Your session may have expired. Please log in again.');
                       // Optional: Clear token & redirect
                       // localStorage.removeItem('authToken');
                       // localStorage.removeItem('authUser');
                       // navigate('/login');
                    } else {
                       const errorData = await response.json().catch(() => ({ message: `Server error: ${response.status}` }));
                       setError(errorData.message || `Error fetching data: ${response.status}`);
                    }
                }
            } catch (err) {
                console.error("Network error fetching student data:", err);
                setError('Network error fetching profile. Could not reach server.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, []); // Empty dependency array = run once on component mount

    // --- Action Handlers (Simulated - Keep demo logic for now) ---
     const handleAccept = (projectId) => {
         console.log("Demo: Accepting project:", projectId);
         const acceptedInvitation = invitations.find(inv => inv.id === projectId);
         if (!acceptedInvitation) return;
         setInvitations(prev => prev.filter(inv => inv.id !== projectId));
         const newActiveProject = { /* ... create active project object ... */ };
         setActiveProjects(prev => [...prev, newActiveProject]);
         alert(`Demo: Accepted project "${acceptedInvitation.title}"`);
     };
     const handleReject = (projectId) => {
         console.log("Demo: Rejecting project:", projectId);
         const rejectedInvitation = invitations.find(inv => inv.id === projectId);
         setInvitations(prev => prev.filter(inv => inv.id !== projectId));
         alert(`Demo: Rejected project "${rejectedInvitation?.title || projectId}"`);
     };


    // --- Render Logic ---
    if (loading) {
        return <div className={styles.loadingMessage}>Loading Dashboard Data...</div>; // Or a spinner
    }

    if (error) {
        return <div className={styles.errorMessage} style={{ padding: '20px' }}>Error: {error}</div>;
    }

    if (!studentData) {
        // This could happen if loading finished but data is still null (e.g., fetch error handled above)
        return <div className={styles.errorMessage} style={{ padding: '20px' }}>Could not load student profile data.</div>;
    }

    // --- Main Dashboard Content ---
    // Uses 'studentData' for profile, keeps demo state for projects for now
    return (
        <div className={styles.dashboardContainer}>
            {/* Use fetched name, fallback to username */}
            <h1>{studentData.firstName || studentData.username}'s Dashboard</h1>

            {/* --- Profile Summary Section (Uses Fetched Data) --- */}
            <section className={styles.dashboardSection}>
                <h2>Profile Summary</h2>
                <div className={styles.profileSummary}>
                    <img
                        // TODO: Update profilePictureUrl if it's part of fetched studentData
                        src={'https://via.placeholder.com/80'} // Using placeholder for now
                        alt={`${studentData.firstName || studentData.username}'s profile`}
                        className={styles.profilePic}
                    />
                    <div className={styles.profileInfo}>
                        {/* Display fetched first/last names if available, else username */}
                        <h3>
                           {studentData.firstName && studentData.lastName
                               ? `${studentData.firstName} ${studentData.lastName}`
                               : studentData.username
                           }
                        </h3>
                         {/* TODO: Add headline if it's part of fetched studentData */}
                        <p>{studentData.email}</p> {/* Display fetched email */}
                        {/* TODO: Display skills if they are part of fetched studentData */}
                        {/* Example: studentData.skills && <p>Skills: {studentData.skills.join(', ')}</p> */}

                        {/* Link to edit profile page */}
                        <Link to="/profile/edit" className={styles.editProfileButton}>
                            Edit Profile & Skills
                        </Link>
                    </div>
                </div>
                 <p><strong>University:</strong> {studentData.university || 'Not Specified'}</p>
                 {studentData.studentId && <p><strong>Student ID:</strong> {studentData.studentId}</p>}
                 {studentData.graduationYear && <p><strong>Graduation Year:</strong> {studentData.graduationYear}</p>}
                 <p><strong>Account Verified:</strong> {studentData.isVerified ? 'Yes' : 'No'}</p>
            </section>

            {/* --- New Project Invitations Section (Uses Demo Data for now) --- */}
            <section className={styles.dashboardSection}>
                <h2>New Project Invitations</h2>
                {invitations.length === 0 ? (
                    <p>No new project invitations available.</p> /* Updated message */
                ) : (
                    <div className={styles.projectList}>
                        {invitations.map((inv) => (
                            <div key={inv.id} className={styles.projectCard}>
                                {/* ... JSX for invitations remains the same for now ... */}
                                <h3>{inv.title}</h3>
                                 <p className={styles.description}>{inv.description}</p>
                                 <p><strong>Skills:</strong> {inv.skills.join(', ')}</p>
                                 <p><strong>Budget:</strong> {inv.budget}</p>
                                 <p><strong>Deadline:</strong> {inv.deadline}</p>
                                 {inv.clientName && <p><strong>Client:</strong> {inv.clientName}</p>}
                                 <div className={styles.actionButtons}>
                                     <button onClick={() => handleAccept(inv.id)} className={`${styles.button} ${styles.accept}`}>Accept Work</button>
                                     <button onClick={() => handleReject(inv.id)} className={`${styles.button} ${styles.reject}`}>Reject</button>
                                 </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* --- Active Projects Section (Uses Demo Data for now) --- */}
            <section className={styles.dashboardSection}>
                 <h2>My Active Projects</h2>
                 {activeProjects.length === 0 ? (
                     <p>You have no active projects right now.</p>
                 ) : (
                     <div className={styles.projectList}>
                         {activeProjects.map((proj) => (
                              <div key={proj.id} className={`${styles.projectCard} ${styles.activeProject}`}>
                                  {/* ... JSX for active projects remains the same for now ... */}
                                   <div className={styles.cardHeader}>
                                     <h3>{proj.title}</h3>
                                     <Link to={`/chat/`} className={styles.msgLink} title={`Message ${proj.clientName}`}>
                                         <MessageSquare size={20} />
                                     </Link>
                                 </div>
                                 <p><strong>Client:</strong> {proj.clientName}</p>
                                 <p><strong>Deadline:</strong> {proj.deadline}</p>
                                 <p><strong>Status:</strong> {proj.status}</p>
                                 <Link to={proj.workspaceUrl} className={styles.detailsLink}>
                                     View Details / Workspace
                                 </Link>
                              </div>
                         ))}
                     </div>
                 )}
             </section>

            {/* --- Completed Projects Section (Uses Demo Data for now) --- */}
            <section className={styles.dashboardSection}>
                <h2>Completed Projects</h2>
                 {completedProjects.length === 0 ? (
                     <p>You haven't completed any projects yet.</p>
                 ) : (
                     <div className={styles.projectList}>
                         {completedProjects.map((proj) => (
                              <div key={proj.id} className={`${styles.projectCard} ${styles.completedProject}`}>
                                 {/* ... JSX for completed projects remains the same for now ... */}
                                  <h3>{proj.title}</h3>
                                 <p><strong>Client:</strong> {proj.clientName}</p>
                                 <p><strong>Completed:</strong> {proj.completionDate}</p>
                                 <p><strong>Earned:</strong> {proj.amountEarned}</p>
                              </div>
                         ))}
                     </div>
                 )}
            </section>
        </div>
    );
}

export default StudentDashboard;