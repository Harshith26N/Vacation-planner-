// frontend/src/pages/ContactPage.jsx
import React, { useState } from 'react';

const ContactPage = () => {
    // State to manage form inputs
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [emailError, setEmailError] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');

    const contactPageStyle = {
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        maxWidth: '700px',
        margin: '40px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)' // Adjust based on your header/footer if any
    };

    const headingStyle = {
        color: '#34495e',
        fontSize: '2.5em',
        marginBottom: '20px',
    };

    const paragraphStyle = {
        fontSize: '1.2em',
        color: '#555',
        marginBottom: '15px',
        lineHeight: '1.6',
    };

    const emailLinkStyle = {
        color: '#3498db',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1.3em',
        transition: 'color 0.3s ease',
    };

    const emailLinkHoverStyle = {
        color: '#2980b9',
        textDecoration: 'underline',
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        maxWidth: '450px',
        margin: '30px 0',
        padding: '25px',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    };

    const inputStyle = {
        padding: '12px 15px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontSize: '1em',
        width: '100%',
        boxSizing: 'border-box', // Include padding in width
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '100px',
        resize: 'vertical',
    };

    const submitButtonStyle = {
        padding: '15px 25px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1em',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        marginTop: '10px',
    };

    const submitButtonHoverStyle = {
        backgroundColor: '#218838',
        transform: 'translateY(-1px)',
    };

    const errorTextStyle = {
        color: '#e74c3c',
        fontSize: '0.9em',
        marginTop: '-10px',
        marginBottom: '10px',
        textAlign: 'left',
    };

    const successMessageStyle = {
        color: '#28a745',
        fontSize: '1.1em',
        fontWeight: 'bold',
        marginTop: '20px',
    };

    // Email validation on blur
    const handleEmailBlur = () => {
        if (userEmail && !userEmail.includes('@')) {
            setEmailError('Email must contain an "@" symbol.');
        } else {
            setEmailError('');
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission

        // Basic validation
        if (!userName || !userEmail || !feedback) {
            setSubmitMessage('Please fill in all fields.');
            return;
        }

        if (emailError) { // Check if there's an existing email error
            setSubmitMessage('Please correct the email address.');
            return;
        }

        // In a real application, you would send this data to your backend API
        console.log({
            userName,
            userEmail,
            feedback,
        });

        // Simulate successful submission
        setSubmitMessage('Thank you for your feedback! We will get back to you soon.');
        setUserName('');
        setUserEmail('');
        setFeedback('');
        setEmailError(''); // Clear any lingering email errors
    };

    return (
        <div style={contactPageStyle}>
            <h2 style={headingStyle}>Contact Us</h2>
            <p style={paragraphStyle}>
                We're here to help! If you encounter any issues, have questions, or need assistance, please don't hesitate to reach out.
            </p>

            <form style={formStyle} onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                <div>
                    <input
                        type="email" // Use type="email" for better mobile keyboard and basic browser validation
                        placeholder="Your Email Address"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        onBlur={handleEmailBlur} // Validate on blur
                        style={inputStyle}
                        required
                    />
                    {emailError && <p style={errorTextStyle}>{emailError}</p>}
                </div>
                <div>
                    <textarea
                        placeholder="Your Feedback or Issue"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        style={textareaStyle}
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    style={submitButtonStyle}
                    onMouseOver={(e) => Object.assign(e.target.style, submitButtonHoverStyle)}
                    onMouseOut={(e) => Object.assign(e.target.style, submitButtonStyle)}
                >
                    Send Feedback
                </button>
                {submitMessage && <p style={submitMessage.includes('Thank you') ? successMessageStyle : errorTextStyle}>{submitMessage}</p>}
            </form>

            <p style={paragraphStyle}>
                Alternatively, you can send an email directly to:
            </p>
            <p>
                <a
                    href="mailto:224g1a3212@srit.ac.in?subject=Issue/Query from Travel Dashboard User"
                    style={emailLinkStyle}
                    onMouseOver={(e) => Object.assign(e.target.style, emailLinkHoverStyle)}
                    onMouseOut={(e) => Object.assign(e.target.style, emailLinkStyle)}
                >
                    224g1a3212@srit.ac.in
                </a>
            </p>
            <p style={{ ...paragraphStyle, marginTop: '25px', fontStyle: 'italic', color: '#777' }}>
                We aim to respond to all inquiries within 24-48 hours.
            </p>
        </div>
    );
};

export default ContactPage;
