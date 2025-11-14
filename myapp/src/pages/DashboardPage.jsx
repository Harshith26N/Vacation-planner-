// frontend/src/pages/DashboardPage.jsx
import React, { useEffect, useState, useMemo } from 'react'; // Import useMemo
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Ensure this is correctly imported
import { useActivityLog } from '../ActivityLogContext'; // Import useActivityLog

// --- SIMULATED TRIP DATA ---
// IMPORTANT: In a real application, this data should come from your backend database
// via a TripContext or direct API calls. This is for demonstration purposes.
const SIMULATED_TRIPS = [
    {
        id: 'trip-1',
        name: 'Summer Europe Adventure',
        destination: 'Paris, France',
        destinationId: 'paris',
        startDate: '2025-08-10', // Upcoming
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
        startDate: '2025-09-01', // Upcoming
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
        startDate: '2024-12-20', // Past
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
        startDate: '2024-06-05', // Past
        endDate: '2024-06-15',
        status: 'Past',
        budget: 1500,
        actualSpent: 1200,
        notes: "Breathtaking views and peaceful treks. Stayed within budget."
    }
];

const DashboardPage = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { recentActivities, logActivity } = useActivityLog(); // Consume ActivityLogContext
    const [dashboardMessage, setDashboardMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // --- STATES FOR DASHBOARD FEATURES ---
    // Removed: upcomingTrip state as the card is being removed
    const [overallBudget, setOverallBudget] = useState(0);
    const [totalActualSpent, setTotalActualSpent] = useState(0);
    const [budgetAlert, setBudgetAlert] = useState('');
    const [currency, setCurrency] = useState('USD'); // Default currency for display

    // Unique keys for localStorage based on user ID
    const userId = user ? user.id : 'guest';
    const localStorageKeyBudget = `budget_tracker_${userId}_overall`;
    const localStorageKeyExpenses = `budget_tracker_${userId}_expenses`;
    const localStorageKeyCurrency = `budget_tracker_${userId}_currency`;

    // --- STYLES ---
    const pageStyle = {
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        maxWidth: '900px',
        margin: '40px auto',
    };

    const headingStyle = {
        color: '#34495e',
        fontSize: '2.5em',
        marginBottom: '30px',
    };

    const profileInfoStyle = {
        fontSize: '1.1em',
        lineHeight: '1.8',
        color: '#555',
    };

    const errorMessageStyle = {
        color: '#e74c3c',
        marginTop: '20px',
        fontSize: '1.1em',
    };

    const buttonContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '40px',
    };

    const buttonStyle = {
        padding: '15px 30px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.2em',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        flex: '1 1 250px',
        maxWidth: '300px',
        boxShadow: '0 6px 20px rgba(52, 152, 219, 0.3)',
    };

    const buttonHoverStyle = {
        backgroundColor: '#2980b9',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(52, 152, 219, 0.4)',
    };

    const widgetContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
        marginTop: '40px',
        marginBottom: '40px',
    };

    const widgetCardStyle = {
        backgroundColor: '#f9f9f9',
        borderRadius: '15px',
        padding: '25px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0',
        textAlign: 'left',
    };

    const widgetTitleStyle = {
        color: '#34495e',
        fontSize: '1.5em',
        marginBottom: '15px',
        fontWeight: '600',
        borderBottom: '2px solid #3498db',
        paddingBottom: '10px',
    };

    const alertStyle = {
        backgroundColor: '#ffe0b2', // Light orange for warning
        color: '#e65100', // Dark orange text
        padding: '15px',
        borderRadius: '8px',
        marginTop: '20px',
        fontWeight: 'bold',
        fontSize: '1em',
        border: '1px solid #ffcc80',
    };

    const successAlertStyle = {
        backgroundColor: '#e8f5e9', // Light green for success
        color: '#2e7d32', // Dark green text
        padding: '15px',
        borderRadius: '8px',
        marginTop: '20px',
        fontWeight: 'bold',
        fontSize: '1em',
        border: '1px solid #c8e6c9',
    };

    // --- HANDLERS ---
    const handlePlanTripClick = () => {
        logActivity('Navigated to Plan New Trip');
        navigate('/plan-trip');
    };

    const handleBudgetTrackerClick = () => {
        logActivity('Navigated to Budget Tracker');
        navigate('/budget-tracker');
    };

    const handlePackingSuggestionsClick = () => {
        logActivity('Navigated to Packing Suggestions');
        navigate('/packing-suggestions');
    };

    const handleTripHistoryClick = () => {
        logActivity('Navigated to Trip History');
        navigate('/trip-history');
    };

    // Handler for "Search by Place"
    const handleSearchByPlaceClick = () => {
        logActivity('Initiated search by place');
        navigate('/search-places'); // Assuming you'll have a route for searching places
    };

    // --- EFFECT HOOKS ---
    useEffect(() => {
        const loadDashboardData = () => {
            if (isAuthenticated && user) {
                setDashboardMessage(`Your personalized travel dashboard is ready, ${user.username}!`);

                // --- Load data from localStorage for budget and currency ---
                const savedBudget = localStorage.getItem(localStorageKeyBudget);
                const savedExpenses = localStorage.getItem(localStorageKeyExpenses);
                const savedCurrency = localStorage.getItem(localStorageKeyCurrency);

                setOverallBudget(savedBudget ? parseFloat(savedBudget) : 0);
                setCurrency(savedCurrency || 'USD');

                let expensesData = [];
                if (savedExpenses) {
                    try {
                        expensesData = JSON.parse(savedExpenses);
                    } catch (e) {
                        console.error("Failed to parse saved expenses from localStorage", e);
                    }
                }
                const actualExpenses = expensesData.filter(exp => !exp.isPlanned);
                const totalSpent = actualExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                setTotalActualSpent(totalSpent);

                // Removed: Logic for finding the next upcoming trip, as the card is removed.

                setError(''); // Clear any previous errors
            } else if (!isAuthenticated) {
                setError('You must be logged in to view the dashboard.');
            }
            setLoading(false);
        };

        // Call loadDashboardData immediately
        loadDashboardData();

        // Dependencies: Re-run only if authentication status or user changes
    }, [isAuthenticated, user, localStorageKeyBudget, localStorageKeyExpenses, localStorageKeyCurrency]);


    // NEW: Separate useEffect for budget alert calculation
    useEffect(() => {
        if (overallBudget > 0) {
            const remaining = overallBudget - totalActualSpent;
            if (remaining <= 0) {
                setBudgetAlert(`Warning: You are ${currency}${(-remaining).toFixed(2)} over your overall budget!`);
            } else if (remaining < overallBudget * 0.2) { // Less than 20% remaining
                setBudgetAlert(`Heads up! You have less than 20% (${currency}${remaining.toFixed(2)}) of your overall budget remaining.`);
            } else {
                setBudgetAlert(''); // Clear alert if budget is healthy
            }
        } else {
            setBudgetAlert('Set an overall budget to track your spending!');
        }
    }, [overallBudget, totalActualSpent, currency]); // This useEffect only depends on budget values


    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '2em', color: '#34495e' }}>
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div style={pageStyle}>
                <h2 style={headingStyle}>Dashboard Access Error</h2>
                <p style={errorMessageStyle}>{error}</p>
                {!isAuthenticated && ( // Only show login prompt if not authenticated
                    <p style={{ ...profileInfoStyle, marginTop: '20px' }}>Please <a href="/login" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>log in</a> to continue.</p>
                )}
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <h2 style={headingStyle}>Your Dashboard</h2>
            {isAuthenticated && user ? (
                <>
                    <p style={profileInfoStyle}>
                        Welcome, <strong style={{ color: '#3498db' }}>{user.username}</strong>!
                    </p>
                    <p style={profileInfoStyle}>{dashboardMessage}</p>

                    <div style={{ ...profileInfoStyle, backgroundColor: '#ecf0f1', padding: '20px', borderRadius: '8px', marginTop: '30px', boxShadow: 'inset 0 1px 5px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ color: '#34495e', marginBottom: '15px' }}>Your Profile Info:</h3>
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#777' }}>
                            This is where you can plan your trips and make new adventures!
                        </p>
                    </div>

                    {/* Notifications/Alerts Section */}
                    {budgetAlert && (
                        <div style={budgetAlert.includes('Warning') || budgetAlert.includes('over budget') || budgetAlert.includes('Heads up') ? alertStyle : successAlertStyle}>
                            {budgetAlert}
                        </div>
                    )}

                    {/* Widgets Container */}
                    <div style={widgetContainerStyle}>
                        {/* Removed: Upcoming Trip Overview Widget */}
                        {/* The grid layout will automatically adjust for the removal */}

                        {/* Budget at a Glance Widget */}
                        <div style={widgetCardStyle}>
                            <h3 style={widgetTitleStyle}>Budget at a Glance</h3>
                            <p><strong>Overall Budget:</strong> {currency}{overallBudget.toFixed(2)}</p>
                            <p><strong>Actual Spent:</strong> {currency}{totalActualSpent.toFixed(2)}</p>
                            <p style={{ color: (overallBudget - totalActualSpent) < 0 ? '#e74c3c' : '#2ecc71' }}>
                                <strong>Remaining:</strong> {currency}{(overallBudget - totalActualSpent).toFixed(2)}
                            </p>
                            <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px', height: '10px', marginTop: '10px' }}>
                                <div style={{
                                    width: `${Math.min(100, (totalActualSpent / overallBudget) * 100)}%`,
                                    height: '100%',
                                    backgroundColor: (overallBudget - totalActualSpent) < 0 ? '#e74c3c' : (overallBudget - totalActualSpent) < overallBudget * 0.2 ? '#e67e22' : '#2ecc71',
                                    borderRadius: '5px',
                                    transition: 'width 0.5s ease-in-out, background-color 0.5s ease-in-out'
                                }}></div>
                            </div>
                            <button
                                onClick={handleBudgetTrackerClick}
                                style={{ ...buttonStyle, padding: '8px 15px', fontSize: '0.9em', marginTop: '15px', backgroundColor: '#28a745', boxShadow: 'none' }}
                                onMouseOver={(e) => Object.assign(e.target.style, { ...buttonHoverStyle, backgroundColor: '#218838' })}
                                onMouseOut={(e) => Object.assign(e.target.style, { ...buttonStyle, backgroundColor: '#28a745' })}
                            >
                                Go to Budget Tracker
                            </button>
                        </div>

                        {/* Recent Activity Feed Widget */}
                        <div style={widgetCardStyle}>
                            <h3 style={widgetTitleStyle}>Recent Activity</h3>
                            {recentActivities.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {/* Display recent activities from ActivityLogContext */}
                                    {recentActivities.map((activity) => (
                                        <li key={activity.id} style={{ marginBottom: '8px', fontSize: '0.95em', color: '#666' }}>
                                            <span style={{ fontWeight: 'bold' }}>{activity.timestamp}:</span> {activity.text}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No recent activities yet. Start exploring!</p>
                            )}
                        </div>

                        {/* Quick Links / Action Buttons */}
                        {/* This div will now take up more space if the other two widgets are side-by-side */}
                        <div style={{ ...widgetCardStyle, gridColumn: '1 / -1', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h3 style={widgetTitleStyle}>Quick Actions</h3>
                            <div style={buttonContainerStyle}>
                                {/* Plan a New Trip Button */}
                                <button
                                    style={buttonStyle}
                                    onClick={handlePlanTripClick}
                                    onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
                                    onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
                                >
                                    Plan a New Trip
                                </button>

                                {/* Manage Budget Button */}
                                <button
                                    style={{ ...buttonStyle, backgroundColor: '#28a745' }}
                                    onClick={handleBudgetTrackerClick}
                                    onMouseOver={(e) => Object.assign(e.target.style, { ...buttonHoverStyle, backgroundColor: '#218838' })}
                                    onMouseOut={(e) => Object.assign(e.target.style, { ...buttonStyle, backgroundColor: '#28a745' })}
                                >
                                    Manage Budget
                                </button>

                                {/* Get Packing Suggestions Button */}
                                <button
                                    style={{ ...buttonStyle, backgroundColor: '#6f42c1' }}
                                    onClick={handlePackingSuggestionsClick}
                                    onMouseOver={(e) => Object.assign(e.target.style, { ...buttonHoverStyle, backgroundColor: '#5a359b' })}
                                    onMouseOut={(e) => Object.assign(e.target.style, { ...buttonStyle, backgroundColor: '#6f42c1' })}
                                >
                                    Get Packing Suggestions
                                </button>

                                {/* View Trip History Button */}
                                <button
                                    style={{ ...buttonStyle, backgroundColor: '#e74c3c' }}
                                    onClick={handleTripHistoryClick}
                                    onMouseOver={(e) => Object.assign(e.target.style, { ...buttonHoverStyle, backgroundColor: '#c0392b' })}
                                    onMouseOut={(e) => Object.assign(e.target.style, { ...buttonStyle, backgroundColor: '#e74c3c' })}
                                >
                                    View Trip History
                                </button>

                                {/* Search by Place Button */}
                                <button
                                    style={{ ...buttonStyle, backgroundColor: '#ffc107', color: '#333', boxShadow: '0 6px 20px rgba(255, 193, 7, 0.3)' }}
                                    onClick={handleSearchByPlaceClick}
                                    onMouseOver={(e) => Object.assign(e.target.style, { ...buttonHoverStyle, backgroundColor: '#e0a800', boxShadow: '0 8px 25px rgba(255, 193, 7, 0.4)' })}
                                    onMouseOut={(e) => Object.assign(e.target.style, { ...buttonStyle, backgroundColor: '#ffc107', color: '#333', boxShadow: '0 6px 20px rgba(255, 193, 7, 0.3)' })}
                                >
                                    Search by Place
                                </button>

                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p style={profileInfoStyle}>Please log in to view your dashboard.</p>
            )}
        </div>
    );
};

export default DashboardPage;