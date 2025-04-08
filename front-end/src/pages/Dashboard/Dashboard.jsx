// src/components/Dashboard/Dashboard.jsx
// *** FINAL VERSION: Fetches user data, renders full UI conditionally ***

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Ensure the CSS module import is correct and uncommented
import styles from './Dashboard.module.css';
import { MessageSquare } from 'lucide-react';

// Define your backend API Base URL (MUST MATCH backend port and Login.jsx)
const API_BASE_URL = 'http://localhost:5000'; // <-- ADJUST PORT IF NEEDED

// --- DEMO data for project sections (Remove/replace when fetching real data) ---
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


function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Keep for potential error redirects

    // Demo project states
    const [invitations, setInvitations] = useState(initialInvitations);
    const [activeProjects, setActiveProjects] = useState(initialActiveProjects);
    const [completedProjects, setCompletedProjects] = useState(initialCompletedProjects);

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

    // --- Demo Action Handlers (Keep temporarily) ---
     const handleAccept = (projectId) => { console.log("Demo Accept:", projectId); /* ... demo logic ... */ };
     const handleReject = (projectId) => { console.log("Demo Reject:", projectId); /* ... demo logic ... */ };


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

            {/* --- Active Projects Section (Uses Demo Data for now) --- */}
            <section className={styles.dashboardSection}>
                 <h2>My Active Projects</h2>
                  {/* TODO: Replace with actual fetch/render logic for role-specific active projects */}
                 {activeProjects.length === 0 ? (<p>No active projects.</p>) : (
                     <div className={styles.projectList}>
                         {activeProjects.map((proj) => (
                              <div key={proj.id} className={`${styles.projectCard} ${styles.activeProject}`}>
                                   <div className={styles.cardHeader}>
                                     <h3>{proj.title}</h3>
                                     <Link to={`/chat/`} className={styles.msgLink} title={`Message ${proj.clientName}`}> {/* TODO: Use actual chat link */}
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
                 {/* TODO: Replace with actual fetch/render logic for role-specific completed projects */}
                 {completedProjects.length === 0 ? (<p>No completed projects.</p>) : (
                     <div className={styles.projectList}>
                         {completedProjects.map((proj) => (
                              <div key={proj.id} className={`${styles.projectCard} ${styles.completedProject}`}>
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

export default Dashboard;