import React, { useState } from 'react'; // Removed useEffect for demo
import { Link } from 'react-router-dom'; // Removed useNavigate if not used elsewhere
import styles from './StudentDashboard.module.css';
import { MessageSquare } from 'lucide-react';// Icon-library

// --- DEMO Placeholder Data ---
const placeholderProfile = {
    id: 'student1', // Added ID for potential use
    name: 'Demo Student',
    headline: 'Learning Full Stack Development',
    profilePictureUrl: 'https://via.placeholder.com/80', // Placeholder image
    skills: ['React', 'JavaScript', 'CSS', 'Node.js', 'HTML'],
};

const initialInvitations = [
    { id: 'proj123', title: 'Build a Simple Landing Page', description: 'Need a responsive landing page using HTML/CSS.', skills: ['HTML', 'CSS'], budget: '$150', deadline: '2024-08-15', clientName: 'Demo Startup Inc.' },
    { id: 'proj456', title: 'React Component Development', description: 'Create reusable React components for our library.', skills: ['React', 'JavaScript'], budget: '$40/hr', deadline: '2024-08-20', clientName: 'Demo Tech Solutions' },
    { id: 'proj777', title: 'Fix CSS Bug on Website', description: 'Small CSS alignment issue needs fixing on our main site.', skills: ['CSS'], budget: '$50', deadline: '2024-08-12', clientName: 'Web Agency Demo' },
];

const initialActiveProjects = [
    { id: 'proj789', title: 'Blog Post Writing', clientName: 'Demo Content Creators', deadline: '2024-08-10', status: 'In Progress', workspaceUrl: '/demo-projects/proj789' },
];

const initialCompletedProjects = [
    { id: 'proj001', title: 'Logo Design', clientName: 'Demo Marketing Co.', completionDate: '2024-07-25', amountEarned: '$100' },
    { id: 'proj002', title: 'Data Entry Task', clientName: 'Demo Admin Services', completionDate: '2024-07-18', amountEarned: '$50' },
];
// --- End DEMO Placeholder Data ---

function StudentDashboard() {
    // --- State Initialized with Demo Data ---
    const [profile, setProfile] = useState(placeholderProfile);
    const [invitations, setInvitations] = useState(initialInvitations);
    const [activeProjects, setActiveProjects] = useState(initialActiveProjects);
    const [completedProjects, setCompletedProjects] = useState(initialCompletedProjects);

    // No isLoading or error state needed for this demo version

    // --- Action Handlers (Simulated) ---
    const handleAccept = (projectId) => {
        console.log("Demo: Accepting project:", projectId);

        // 1. Find the accepted invitation
        const acceptedInvitation = invitations.find(inv => inv.id === projectId);
        if (!acceptedInvitation) return; // Should not happen in demo

        // 2. Remove from invitations
        setInvitations(prev => prev.filter(inv => inv.id !== projectId));

        // 3. Add to active projects (adjust structure as needed for consistency)
        const newActiveProject = {
            id: acceptedInvitation.id,
            title: acceptedInvitation.title,
            clientName: acceptedInvitation.clientName,
            deadline: acceptedInvitation.deadline,
            status: 'In Progress', // Set initial status
            workspaceUrl: `/demo-projects/${projectId}` // Example URL
        };
        setActiveProjects(prev => [...prev, newActiveProject]);

        alert(`Demo: Accepted project "${acceptedInvitation.title}"`);
    };

    const handleReject = (projectId) => {
        console.log("Demo: Rejecting project:", projectId);
        const rejectedInvitation = invitations.find(inv => inv.id === projectId);

        // Remove from invitations list
        setInvitations(prev => prev.filter(inv => inv.id !== projectId));

        alert(`Demo: Rejected project "${rejectedInvitation?.title || projectId}"`);
    };

    // --- Render Logic ---
    // No loading or error checks needed for demo

    return (
        <div className={styles.dashboardContainer}>
            <h1>My Dashboard (Demo)</h1>

            {/* --- Profile Summary Section --- */}
            <section className={styles.dashboardSection}>
                <h2>Profile Summary</h2>
                <div className={styles.profileSummary}>
                    <img
                        src={profile.profilePictureUrl} // Uses state
                        alt={`${profile.name}'s profile`}
                        className={styles.profilePic}
                    />
                    <div className={styles.profileInfo}>
                        <h3>{profile.name}</h3>
                        <p>{profile.headline}</p>
                        {profile.skills && profile.skills.length > 0 && (
                            <p className={styles.skillsPreview}>
                                <strong>Skills:</strong> {profile.skills.slice(0, 5).join(', ')}{profile.skills.length > 5 ? '...' : ''}
                            </p>
                        )}
                        {/* Link still works if you have routing set up */}
                        <Link to="/profile/edit" className={styles.editProfileButton}>
                            Edit Profile & Skills
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- New Project Invitations Section --- */}
            <section className={styles.dashboardSection}>
                <h2>New Project Invitations</h2>
                {invitations.length === 0 ? (
                    <p>No new project invitations available in this demo.</p>
                ) : (
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
                                    {/* Buttons now modify local state */}
                                    <button onClick={() => handleAccept(inv.id)} className={`${styles.button} ${styles.accept}`}>Accept Work</button>
                                    <button onClick={() => handleReject(inv.id)} className={`${styles.button} ${styles.reject}`}>Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* --- Active Projects Section --- */}
            <section className={styles.dashboardSection}>
                 <h2>My Active Projects</h2>
                {activeProjects.length === 0 ? (
                    <p>You have no active projects right now.</p>
                ) : (
                    <div className={styles.projectList}>
                        {activeProjects.map((proj) => (
                            <div key={proj.id} className={`${styles.projectCard} ${styles.activeProject}`}>
                                <div className={styles.cardHeader}>
                                    <h3>{proj.title}</h3>
                                    <Link
                                        to={`/chat/`} //add this when the back end is connected  to={`/chat/${proj.clientId}`}

                                        className={styles.msgLink}
                                        title={`Message ${proj.clientName}`}
                                    >
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


            {/* --- Completed Projects Section --- */}
            <section className={styles.dashboardSection}>
                <h2>Completed Projects</h2>
                 {completedProjects.length === 0 ? (
                    <p>You haven't completed any projects yet.</p>
                 ) : (
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

export default StudentDashboard;