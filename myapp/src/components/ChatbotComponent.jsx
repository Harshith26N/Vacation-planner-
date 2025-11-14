// frontend/src/components/ChatbotComponent.jsx
import React, { useState, useRef, useEffect } from 'react';

const ChatbotComponent = () => {
    const [messages, setMessages] = useState([]); // Stores chat messages { sender: 'user' | 'bot', text: '...' }
    const [inputMessage, setInputMessage] = useState(''); // Current message typed by user
    const [isLoading, setIsLoading] = useState(false); // To show loading indicator
    const messagesEndRef = useRef(null); // Ref for auto-scrolling to bottom of chat

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Function to send message to backend and get bot response
    const sendMessage = async () => {
        if (inputMessage.trim() === '') return;

        const newUserMessage = { sender: 'user', text: inputMessage.trim() };
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);
        setInputMessage(''); // Clear input field
        setIsLoading(true); // Show loading indicator

        try {
            // Make API call to your Flask backend
            const response = await fetch('http://localhost:5000/api/chatbot', { // Adjust URL if your backend is different
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // If your chatbot endpoint requires authentication, add Authorization header here:
                    // 'Authorization': `Bearer ${yourAuthToken}`
                },
                body: JSON.stringify({ message: inputMessage.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                const botResponse = { sender: 'bot', text: data.response };
                setMessages((prevMessages) => [...prevMessages, botResponse]);
            } else {
                // Handle errors from backend
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: 'bot', text: `Error: ${data.message || 'Could not get a response.'}` },
                ]);
            }
        } catch (error) {
            console.error('Error communicating with chatbot backend:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: 'Sorry, I am having trouble connecting right now.' },
            ]);
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            sendMessage();
        }
    };

    // --- Styles for the Chatbot UI ---
    const chatContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        height: '500px', // Fixed height for chat window
        width: '100%',
        maxWidth: '500px',
        margin: '40px auto',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        backgroundColor: '#fdfdfd',
    };

    const messagesAreaStyle = {
        flexGrow: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundColor: '#f4f7f6',
        borderBottom: '1px solid #e0e0e0',
    };

    const messageBubbleStyle = (sender) => ({
        maxWidth: '80%',
        padding: '10px 15px',
        borderRadius: '20px',
        alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: sender === 'user' ? '#3498db' : '#ecf0f1',
        color: sender === 'user' ? 'white' : '#34495e',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        wordBreak: 'break-word',
    });

    const inputAreaStyle = {
        display: 'flex',
        padding: '15px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#ffffff',
    };

    const inputFieldStyle = {
        flexGrow: 1,
        padding: '12px 15px',
        border: '1px solid #ccc',
        borderRadius: '25px',
        fontSize: '1em',
        marginRight: '10px',
        outline: 'none',
    };

    const sendButtonStyle = {
        padding: '12px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        fontSize: '1em',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    const sendButtonHoverStyle = {
        backgroundColor: '#218838',
    };

    const loadingIndicatorStyle = {
        textAlign: 'center',
        padding: '10px',
        color: '#6c757d',
        fontStyle: 'italic',
    };

    return (
        <div style={chatContainerStyle}>
            <div style={messagesAreaStyle}>
                {messages.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#6c757d', marginTop: '20px' }}>
                        Type a message to start chatting!
                    </p>
                )}
                {messages.map((msg, index) => (
                    <div key={index} style={messageBubbleStyle(msg.sender)}>
                        {msg.text}
                    </div>
                ))}
                {isLoading && (
                    <div style={loadingIndicatorStyle}>
                        Bot is typing...
                    </div>
                )}
                <div ref={messagesEndRef} /> {/* Scroll target */}
            </div>
            <div style={inputAreaStyle}>
                <input
                    type="text"
                    style={inputFieldStyle}
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                />
                <button
                    style={sendButtonStyle}
                    onMouseOver={(e) => Object.assign(e.target.style, sendButtonHoverStyle)}
                    onMouseOut={(e) => Object.assign(e.target.style, sendButtonStyle)}
                    onClick={sendMessage}
                    disabled={isLoading}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatbotComponent;
