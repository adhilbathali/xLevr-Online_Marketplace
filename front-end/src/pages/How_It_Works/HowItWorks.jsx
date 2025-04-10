import { Link } from "react-router-dom";
import styles from "./HowItWorks.module.css";


export default function HowItWorks() {
    return (
        <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>How It Works</h1>
            <div style={{ maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
                <h2>Welcome to Our Freelancing Platform for Students!</h2>
                <p>
                    Our platform uses advanced AI algorithms and an escrow payment system to ensure smooth collaboration between students and clients. Here’s how it works:
                </p>

                <ol>
                    <li>
                        <h3>Clients Post Projects from Predefined Categories</h3>
                        <p>
                            Clients begin by selecting a category that matches their needs (e.g., design, development, writing, marketing, etc.) and posting a project. This ensures projects are streamlined and well-organized for students to find.
                        </p>
                    </li>

                    <li>
                        <h3>AI Algorithm Matches Top Students</h3>
                        <p>
                            Our platform’s AI algorithm identifies the most suitable students for the project based on their scores and expertise. Notifications are sent to the top-ranking students, and the first student to accept the project gets the work.
                        </p>
                    </li>

                    <li>
                        <h3>Secure Payment with Escrow</h3>
                        <p>
                            Once a student accepts the project, the client processes the payment through our escrow system. The payment is securely held until the project is completed and approved by both parties.
                        </p>
                    </li>

                    <li>
                        <h3>Students Deliver Quality Work</h3>
                        <p>
                            The student completes the project and submits it for review. Both the client and student assess the work to ensure satisfaction on both sides.
                        </p>
                    </li>

                    <li>
                        <h3>Final Payment Release</h3>
                        <p>
                            Once the client and student approve the work, the escrow system releases the payment to the student. The platform retains a 5% commission as a service fee.
                        </p>
                    </li>
                </ol>

                <h2>Why Choose Our Platform?</h2>
                <ul>
                    <li>Predefined categories help streamline project posting and discovery.</li>
                    <li>Advanced AI algorithm ensures fair and efficient project matching.</li>
                    <li>Secure escrow system guarantees payment protection for both parties.</li>
                    <li>Earn money and gain real-world experience.</li>
                    <li>Transparent and reliable process for all users.</li>
                </ul>

                <p style={{ textAlign: "center", marginTop: "2rem" }}>
                Ready to get started? <strong><Link to="/signup">Sign up now</Link></strong> and let our platform help you thrive in your freelancing journey!
                </p>
            </div>
        </div>
    );
}