// frontend/src/pages/TripHistoryPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivityLog } from '../ActivityLogContext';

// IMPORTANT: In a real application, this data should come from your backend database
// via a TripContext or direct API calls. This is for demonstration purposes.
const SIMULATED_TRIPS = [
    {
        id: 'trip-1',
        name: 'Summer Europe Adventure',
        destination: 'Paris, France',
        destinationId: 'paris',
        startDate: '2025-08-10',
        endDate: '2025-08-25',
        status: 'Upcoming',
        budget: 3500,
        actualSpent: 0,
        notes: "Excited for the Eiffel Tower and Louvre!"
    },
    {
        id: 'trip-2',
        name: 'Beach Getaway to Goa',
        destination: 'Goa, India',
        destinationId: 'goa',
        startDate: '2025-09-01',
        endDate: '2025-09-07',
        status: 'Upcoming',
        budget: 800,
        actualSpent: 0,
        notes: "Relaxing by the beach, enjoying seafood."
    },
    {
        id: 'trip-3',
        name: 'NYC Winter Break',
        destination: 'New York City, USA',
        destinationId: 'new-york-city',
        startDate: '2024-12-20',
        endDate: '2024-12-27',
        status: 'Past',
        budget: 2000,
        actualSpent: 2150,
        notes: "Christmas lights and Broadway shows. Went slightly over budget."
    },
    {
        id: 'trip-4',
        name: 'Hiking in Himalayas',
        destination: 'Leh-Ladakh, India',
        destinationId: 'leh-ladakh',
        startDate: '2024-06-05',
        endDate: '2024-06-15',
        status: 'Past',
        budget: 1500,
        actualSpent: 1200,
        notes: "Breathtaking views and peaceful treks. Stayed within budget."
    }
];

const TripHistoryPage = () => {
    const navigate = useNavigate();
    const { logActivity } = useActivityLog();

    // Filter past trips from the simulated data
    const pastTrips = SIMULATED_TRIPS.filter(
        (trip) => new Date(trip.endDate) < new Date()
    ).sort((a, b) => new Date(b.endDate) - new Date(a.endDate)); // Sort by most recent first

    const pageStyle = {
        textAlign: 'center',
        padding: '40px 20px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        maxWidth: '900px',
        margin: '40px auto',
    };

    const listStyle = {
        listStyle: 'none',
        padding: 0,
        margin: '20px 0',
    };

    const listItemStyle = {
        backgroundColor: '#f9f9f9',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '10px',
        textAlign: 'left',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    };

    const tripDetailsStyle = {
        flex: '2',
        minWidth: '200px',
    };

    const buttonStyle = {
        padding: '8px 15px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9em',
        transition: 'background-color 0.3s ease',
    };

    const buttonHoverStyle = {
        backgroundColor: '#2980b9',
    };

    return (
        <div style={pageStyle}>
            <h2 style={{ color: '#34495e', fontSize: '2em', marginBottom: '20px' }}>Your Trip History</h2>
            {pastTrips.length > 0 ? (
                <ul style={listStyle}>
                    {pastTrips.map(trip => (
                        <li key={trip.id} style={listItemStyle}>
                            <div style={tripDetailsStyle}>
                                <strong>{trip.name}</strong> - {trip.destination}
                                <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#666' }}>
                                    {new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()}
                                </p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#666' }}>
                                    Budget: {trip.budget ? `$${trip.budget.toFixed(2)}` : 'N/A'} | Spent: {trip.actualSpent ? `$${trip.actualSpent.toFixed(2)}` : 'N/A'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    // You would navigate to a detailed trip page here, e.g., `/trip/${trip.id}`
                                    // For now, let's just log the activity.
                                    logActivity(`Attempted to view details for past trip: ${trip.name}`);
                                    alert(`Viewing details for: ${trip.name}\n(Details page coming soon!)`);
                                }}
                                style={buttonStyle}
                                onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
                                onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
                            >
                                View Details
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No past trips recorded yet. Start planning some new adventures!</p>
            )}
            <button
                onClick={() => {
                    navigate('/dashboard');
                    logActivity('Navigated back to Dashboard from Trip History');
                }}
                style={{ ...buttonStyle, backgroundColor: '#6c757d', marginTop: '30px' }}
                onMouseOver={(e) => Object.assign(e.target.style, { backgroundColor: '#5a6268' })}
                onMouseOut={(e) => Object.assign(e.target.style, { backgroundColor: '#6c757d' })}
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default TripHistoryPage;