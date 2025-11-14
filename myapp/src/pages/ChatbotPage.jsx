// frontend/src/pages/ChatbotPage.jsx
import React from 'react';
import ChatbotComponent from '../components/ChatbotComponent'; // Ensure correct path to your ChatbotComponent

const ChatbotPage = () => {
    const pageStyle = {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        minHeight: 'calc(100vh - 120px)', // Adjust based on your header/footer height
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const headingStyle = {
        color: '#34495e',
        fontSize: '2.5em',
        marginBottom: '30px',
    };

    return (
        <div style={pageStyle}>
            <h2 style={headingStyle}>Your Personal Travel Chatbot</h2>
            <ChatbotComponent />
        </div>
    );
};

export default ChatbotPage;
