// frontend/src/pages/SearchPlacesPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivityLog } from '../ActivityLogContext'; // Import useActivityLog
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation

const SearchPlacesPage = () => {
    const [fromPlace, setFromPlace] = useState('');
    const [toPlace, setToPlace] = useState('');
    const [numPeople, setNumPeople] = useState(1);
    const [travelers, setTravelers] = useState([{ age: '', gender: '' }]);
    const [travelMode, setTravelMode] = useState('');
    const [priceCategory, setPriceCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [departureDate, setDepartureDate] = useState(''); // New state for departure date
    const [returnDate, setReturnDate] = useState('');     // New state for return date
    const [isRoundTrip, setIsRoundTrip] = useState(true); // New state for one-way/round-trip
    // const [isFlexibleDates, setIsFlexibleDates] = useState(false); // Removed: Flexible dates
    // const [currency, setCurrency] = useState('₹'); // Removed: Currency selection
    const currency = '₹'; // Fixed currency for simplicity and realism
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState('');
    // const [availabilityMessage, setAvailabilityMessage] = useState(''); // Removed: Availability message

    const { logActivity } = useActivityLog();
    const navigate = useNavigate();

    // Get today's date in YYYY-MM-DD format for date input min attribute
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // --- STYLES ---
    const pageStyle = {
        textAlign: 'center',
        padding: '40px 20px',
        backgroundColor: '#f4f7f6',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '40px auto',
        fontFamily: 'Arial, sans-serif',
    };

    const headingStyle = {
        color: '#34495e',
        fontSize: '2.2em',
        marginBottom: '30px',
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '500px',
        margin: '0 auto',
        padding: '25px',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    };

    const inputGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    };

    const labelStyle = {
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#555',
        fontSize: '0.95em',
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '1em',
        boxSizing: 'border-box',
    };

    const checkboxGroupStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        margin: '5px 0',
    };

    const selectStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '1em',
        boxSizing: 'border-box',
        backgroundColor: 'white',
    };

    const travelerGroupStyle = {
        border: '1px dashed #b0c4de',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '10px',
        backgroundColor: '#f8fbfc',
    };

    const addTravelerButtonStyle = {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9em',
        marginTop: '10px',
        alignSelf: 'flex-end',
    };

    const removeTravelerButtonStyle = {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.8em',
        marginLeft: '10px',
    };

    const submitButtonStyle = {
        padding: '15px 30px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.2em',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '20px',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
    };

    const buttonHoverStyle = {
        backgroundColor: '#2980b9',
        transform: 'translateY(-2px)',
    };

    const resultContainerStyle = {
        marginTop: '40px',
        padding: '30px',
        backgroundColor: '#e8f5e9',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        border: '1px solid #c8e6c9',
        textAlign: 'left',
    };

    const resultTitleStyle = {
        color: '#2e7d32',
        fontSize: '1.8em',
        marginBottom: '20px',
        borderBottom: '2px solid #2e7d32',
        paddingBottom: '10px',
    };

    const bookingLinksStyle = {
        marginTop: '25px',
        borderTop: '1px solid #ddd',
        paddingTop: '20px',
    };

    const linkStyle = {
        display: 'inline-block',
        margin: '0 15px 10px 0',
        padding: '10px 20px',
        backgroundColor: '#f0f0f0',
        color: '#333',
        textDecoration: 'none',
        borderRadius: '5px',
        border: '1px solid #ccc',
        transition: 'background-color 0.3s ease',
    };

    const linkHoverStyle = {
        backgroundColor: '#e0e0e0',
    };

    const printButtonStyle = {
        padding: '12px 25px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1em',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '30px',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
    };

    const printButtonHoverStyle = {
        backgroundColor: '#5a6268',
        transform: 'translateY(-2px)',
    };

    const errorMessageStyle = {
        color: '#e74c3c',
        marginTop: '15px',
        fontSize: '1em',
        fontWeight: 'bold',
    };

    // const availabilityMessageStyle = { // Removed: Availability message style
    //     backgroundColor: '#fff3cd',
    //     color: '#856404',
    //     padding: '10px',
    //     borderRadius: '5px',
    //     marginTop: '15px',
    //     border: '1px solid #ffeeba',
    //     fontSize: '0.9em',
    // };

    // --- SIMULATED DATA FOR PLACES AND AIRPORT CHECK ---
    const VALID_PLACES = [
        'Anantapur', 'Bangalore', 'Chennai', 'Hyderabad', 'Mumbai', 'Delhi',
        'Kolkata', 'Goa', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
        'London', 'Paris', 'New York City', 'Dubai', 'Singapore', 'Sydney'
    ].sort();

    const PLACES_WITH_AIRPORT = [
        'Bangalore', 'Chennai', 'Hyderabad', 'Mumbai', 'Delhi', 'Kolkata',
        'Goa', 'Pune', 'Ahmedabad', 'London', 'Paris', 'New York City', 'Dubai', 'Singapore', 'Sydney'
    ];

    const hasAirport = (place) => {
        return PLACES_WITH_AIRPORT.some(p => p.toLowerCase() === place.toLowerCase());
    };

    // --- SIMULATED TRAVEL ROUTES DATA (for estimated time and price ranges per person) ---
    const TRAVEL_ROUTES_DATA = {
        'anantapur-bangalore': {
            Bus: { time: '4-5 hours', distance: '210 km', priceCategories: { Economy: { minPerPerson: 300, maxPerPerson: 500 }, AC: { minPerPerson: 500, maxPerPerson: 800 } } },
            Train: { time: '5-6 hours', distance: '220 km', priceCategories: { Sleeper: { minPerPerson: 250, maxPerPerson: 400 }, 'AC Chair Car': { minPerPerson: 400, maxPerPerson: 700 }, 'AC 3 Tier': { minPerPerson: 700, maxPerPerson: 1200 } } },
            Car: { time: '3.5-4.5 hours', distance: '210 km', priceCategories: { Standard: { minPerPerson: 2500, maxPerPerson: 3500 }, Premium: { minPerPerson: 3500, maxPerPerson: 5000 } } }, // Total car price (per car, not per person)
        },
        'bangalore-chennai': {
            Airplane: { time: '1 hour', distance: '350 km', priceCategories: { Economy: { minPerPerson: 2500, maxPerPerson: 4000 }, Business: { minPerPerson: 5000, maxPerPerson: 8000 }, First: { minPerPerson: 8000, maxPerPerson: 15000 } } },
            Bus: { time: '6-7 hours', distance: '350 km', priceCategories: { Economy: { minPerPerson: 600, maxPerPerson: 900 }, AC: { minPerPerson: 900, maxPerPerson: 1500 } } },
            Train: { time: '6-8 hours', distance: '360 km', priceCategories: { Sleeper: { minPerPerson: 400, maxPerPerson: 700 }, 'AC Chair Car': { minPerPerson: 700, maxPerPerson: 1200 }, 'AC 3 Tier': { minPerPerson: 1200, maxPerPerson: 2000 } } },
            Car: { time: '5-6 hours', distance: '350 km', priceCategories: { Standard: { minPerPerson: 4000, maxPerPerson: 6000 }, Premium: { minPerPerson: 6000, maxPerPerson: 9000 } } },
        },
        'delhi-mumbai': {
            Airplane: { time: '2 hours', distance: '1150 km', priceCategories: { Economy: { minPerPerson: 4000, maxPerPerson: 7000 }, Business: { minPerPerson: 8000, maxPerPerson: 15000 }, First: { minPerPerson: 15000, maxPerPerson: 30000 } } },
            Train: { time: '16-20 hours', distance: '1380 km', priceCategories: { Sleeper: { minPerPerson: 800, maxPerPerson: 1500 }, 'AC 3 Tier': { minPerPerson: 1500, maxPerPerson: 2500 }, 'AC 2 Tier': { minPerPerson: 2500, maxPerPerson: 4000 } } },
            Bus: { time: '24-30 hours', distance: '1400 km', priceCategories: { Economy: { minPerPerson: 1200, maxPerPerson: 2000 }, Sleeper: { minPerPerson: 2000, maxPerPerson: 3000 } } },
            Car: { time: '20-24 hours', distance: '1400 km', priceCategories: { Standard: { minPerPerson: 15000, maxPerPerson: 25000 }, Premium: { minPerPerson: 25000, maxPerPerson: 40000 } } },
        },
        'london-paris': {
            Airplane: { time: '1.5 hours', distance: '340 km', priceCategories: { Economy: { minPerPerson: 5000, maxPerPerson: 8000 }, Business: { minPerPerson: 10000, maxPerPerson: 15000 } } },
            Train: { time: '2.5 hours', distance: '490 km', priceCategories: { Standard: { minPerPerson: 6000, maxPerPerson: 9000 }, Business: { minPerPerson: 12000, maxPerPerson: 20000 } } }, // Eurostar equivalent
            Car: { time: '6-7 hours', distance: '450 km', priceCategories: { Standard: { minPerPerson: 8000, maxPerPerson: 12000 }, Premium: { minPerPerson: 12000, maxPerPerson: 20000 } } },
        },
        'new york city-london': {
            Airplane: { time: '7-8 hours', distance: '5570 km', priceCategories: { Economy: { minPerPerson: 30000, maxPerPerson: 60000 }, Business: { minPerPerson: 80000, maxPerPerson: 120000 }, First: { minPerPerson: 150000, maxPerPerson: 250000 } } },
        },
        'goa-mumbai': {
            Airplane: { time: '1 hour', distance: '420 km', priceCategories: { Economy: { minPerPerson: 2000, maxPerPerson: 3500 }, Business: { minPerPerson: 4000, maxPerPerson: 7000 } } },
            Bus: { time: '10-12 hours', distance: '580 km', priceCategories: { Economy: { minPerPerson: 800, maxPerPerson: 1200 }, Sleeper: { minPerPerson: 1200, maxPerPerson: 1800 } } },
            Train: { time: '12-14 hours', distance: '600 km', priceCategories: { Sleeper: { minPerPerson: 500, maxPerPerson: 900 }, 'AC 3 Tier': { minPerPerson: 1000, maxPerPerson: 1600 } } },
            Car: { time: '9-11 hours', distance: '580 km', priceCategories: { Standard: { minPerPerson: 7000, maxPerPerson: 10000 }, Premium: { minPerPerson: 10000, maxPerPerson: 15000 } } },
        },
        // Generic fallback for routes not explicitly defined
        'default': {
            Bus: { time: 'Varies', distance: 'Varies', priceCategories: { Economy: { minPerPerson: 200, maxPerPerson: 1000 }, AC: { minPerPerson: 500, maxPerPerson: 2000 } } },
            Train: { time: 'Varies', distance: 'Varies', priceCategories: { Sleeper: { minPerPerson: 150, maxPerPerson: 800 }, 'AC Chair Car': { minPerPerson: 300, maxPerPerson: 1500 } } },
            Car: { time: 'Varies', distance: 'Varies', priceCategories: { Standard: { minPerPerson: 1000, maxPerPerson: 5000 }, Premium: { minPerPerson: 4000, maxPerPerson: 10000 } } },
            Airplane: { time: 'Varies', distance: 'Varies', priceCategories: { Economy: { minPerPerson: 3000, maxPerPerson: 10000 }, Business: { minPerPerson: 10000, maxPerPerson: 50000 } } },
        }
    };

    // --- HANDLERS ---
    const handleNumPeopleChange = (e) => {
        const count = parseInt(e.target.value, 10);
        setNumPeople(count);
        // Adjust travelers array based on number of people
        setTravelers(prev => {
            const newTravelers = [...prev];
            while (newTravelers.length < count) {
                newTravelers.push({ age: '', gender: '' });
            }
            return newTravelers.slice(0, count);
        });
    };

    const handleTravelerChange = (index, field, value) => {
        setTravelers(prev => {
            const newTravelers = [...prev];
            newTravelers[index] = { ...newTravelers[index], [field]: value };
            return newTravelers;
        });
    };

    const handleAddTraveler = () => {
        setNumPeople(prev => prev + 1);
        setTravelers(prev => [...prev, { age: '', gender: '' }]);
    };

    const handleRemoveTraveler = (index) => {
        setNumPeople(prev => prev - 1);
        setTravelers(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        // setAvailabilityMessage(''); // Removed: Clear previous availability messages

        // Validate if places are selected
        if (!fromPlace || !toPlace) {
            setError('Please select both From Place and To Place.');
            return;
        }

        // Validate if From and To places are the same
        if (fromPlace.toLowerCase() === toPlace.toLowerCase()) {
            setError('From Place and To Place cannot be the same. Please select different locations.');
            return;
        }

        // Validate if selected places are in the VALID_PLACES list
        if (!VALID_PLACES.includes(fromPlace) || !VALID_PLACES.includes(toPlace)) {
            setError('One or both selected places are not valid. Please choose from the provided list.');
            return;
        }

        if (numPeople <= 0) {
            setError('Number of people must be at least 1.');
            return;
        }

        const areAllTravelerDetailsFilled = travelers.every(t => t.age !== '' && t.gender !== '');
        if (!areAllTravelerDetailsFilled) {
            setError('Please provide age and gender for all travelers.');
            return;
        }

        // Validate dates
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day
        const depDate = new Date(departureDate);
        depDate.setHours(0, 0, 0, 0);

        if (!departureDate) {
            setError('Please select a Departure Date.');
            return;
        }
        if (depDate < today) {
            setError('Departure Date cannot be in the past.');
            return;
        }

        if (isRoundTrip && !returnDate) {
            setError('Please select a Return Date for your round trip.');
            return;
        }
        if (isRoundTrip) {
            const retDate = new Date(returnDate);
            retDate.setHours(0, 0, 0, 0);
            if (retDate < depDate) {
                setError('Return Date cannot be before Departure Date.');
                return;
            }
        }

        // Determine available travel modes
        let availableTravelModes = ['Bus', 'Train', 'Car']; // Always available
        const fromHasAirport = hasAirport(fromPlace);
        const toHasAirport = hasAirport(toPlace);

        if (fromHasAirport && toHasAirport) {
            availableTravelModes.unshift('Airplane'); // Add airplane if both places have airports
        }

        // Check if selected travel mode is valid
        if (travelMode && !availableTravelModes.includes(travelMode)) {
            setError(`'${travelMode}' is not a valid travel mode for the selected places. Please choose from: ${availableTravelModes.join(', ')}.`);
            setTravelMode(''); // Reset invalid selection
            setPriceCategory(''); // Reset price category if mode changes
            return;
        }

        if (!travelMode && availableTravelModes.length > 0) {
            setError('Please select a travel mode.');
            return;
        }

        // Get route data
        const routeKey = `${fromPlace.toLowerCase()}-${toPlace.toLowerCase()}`;
        const routeData = TRAVEL_ROUTES_DATA[routeKey] || TRAVEL_ROUTES_DATA['default'];
        const modeData = routeData[travelMode];

        if (!modeData) {
            setError(`No travel information available for ${travelMode} between ${fromPlace} and ${toPlace}.`);
            return;
        }

        // Validate price category if applicable
        if (['Airplane', 'Train'].includes(travelMode)) {
            if (!priceCategory) {
                setError(`Please select a price category for ${travelMode}.`);
                return;
            }
            if (!modeData.priceCategories[priceCategory]) {
                setError(`Invalid price category '${priceCategory}' for ${travelMode}.`);
                setPriceCategory('');
                return;
            }
        } else {
            // For Bus/Car, ensure priceCategory is reset if it was previously set
            if (priceCategory) setPriceCategory('');
        }

        // Validate price filters
        const parsedMinPrice = minPrice !== '' ? parseFloat(minPrice) : null;
        const parsedMaxPrice = maxPrice !== '' ? parseFloat(maxPrice) : null;

        if ((minPrice !== '' && isNaN(parsedMinPrice)) || (maxPrice !== '' && isNaN(parsedMaxPrice))) {
            setError('Please enter valid numbers for Min Price and Max Price.');
            return;
        }
        if (parsedMinPrice !== null && parsedMaxPrice !== null && parsedMinPrice > parsedMaxPrice) {
            setError('Minimum Price cannot be greater than Maximum Price.');
            return;
        }

        // Calculate estimated price range based on selected category or default for mode
        let estimatedPriceRange = { minPerPerson: 0, maxPerPerson: 0 };
        if (modeData.priceCategories[priceCategory]) {
            estimatedPriceRange = modeData.priceCategories[priceCategory];
        } else if (Object.keys(modeData.priceCategories).length > 0) {
            // If no specific category selected for Bus/Car, use the first available category (e.g., Standard/Economy)
            const firstCategoryKey = Object.keys(modeData.priceCategories)[0];
            estimatedPriceRange = modeData.priceCategories[firstCategoryKey];
        }

        // Adjust estimated price based on number of people (for Car, it's usually total, for others per person)
        const finalMinPrice = travelMode === 'Car' ? estimatedPriceRange.minPerPerson : estimatedPriceRange.minPerPerson * numPeople;
        const finalMaxPrice = travelMode === 'Car' ? estimatedPriceRange.maxPerPerson : estimatedPriceRange.maxPerPerson * numPeople;


        // Check if estimated price falls within user's filtered range
        let priceFilterMet = true;
        if (parsedMinPrice !== null && finalMaxPrice < parsedMinPrice) {
            priceFilterMet = false;
        }
        if (parsedMaxPrice !== null && finalMinPrice > parsedMaxPrice) {
            priceFilterMet = false;
        }

        if (!priceFilterMet && (minPrice !== '' || maxPrice !== '')) {
            setError(`The estimated price for this travel mode and category (${currency}${finalMinPrice} - ${currency}${finalMaxPrice}) is outside your specified price range.`);
            return;
        }

        // Removed: Simulated availability message logic


        const result = {
            fromPlace,
            toPlace,
            numPeople,
            travelers,
            travelMode,
            priceCategory: ['Airplane', 'Train'].includes(travelMode) ? priceCategory : 'N/A',
            minPrice: parsedMinPrice !== null ? parsedMinPrice : 'Any',
            maxPrice: parsedMaxPrice !== null ? parsedMaxPrice : 'Any',
            departureDate,
            returnDate: isRoundTrip ? returnDate : 'N/A',
            isRoundTrip,
            // isFlexibleDates, // Removed
            currency,
            estimatedTime: modeData.time,
            estimatedDistance: modeData.distance,
            estimatedPriceRange: { min: finalMinPrice, max: finalMaxPrice },
            timestamp: new Date().toLocaleString(),
        };

        setSearchResult(result);
        logActivity(`Searched for travel from ${fromPlace} to ${toPlace} via ${travelMode} on ${departureDate}`);
    };

    const handlePrintPdf = () => {
        if (!searchResult) {
            setError('No search results to print. Please perform a search first.');
            return;
        }

        const doc = new jsPDF();
        let yPos = 20;

        doc.setFontSize(18);
        doc.text("Travel Details Summary", 105, yPos, { align: "center" });
        yPos += 15;

        doc.setFontSize(12);
        doc.text(`Search Date: ${searchResult.timestamp}`, 10, yPos);
        yPos += 10;

        doc.setFontSize(14);
        doc.text("Journey Information:", 10, yPos);
        yPos += 8;
        doc.setFontSize(12);
        doc.text(`From: ${searchResult.fromPlace}`, 20, yPos);
        yPos += 7;
        doc.text(`To: ${searchResult.toPlace}`, 20, yPos);
        yPos += 7;
        doc.text(`Departure Date: ${searchResult.departureDate}`, 20, yPos);
        yPos += 7;
        if (searchResult.isRoundTrip) {
            doc.text(`Return Date: ${searchResult.returnDate}`, 20, yPos);
            yPos += 7;
        }
        doc.text(`Trip Type: ${searchResult.isRoundTrip ? 'Round Trip' : 'One Way'}`, 20, yPos);
        yPos += 7;
        // doc.text(`Flexible Dates: ${searchResult.isFlexibleDates ? 'Yes' : 'No'}`, 20, yPos); // Removed
        // yPos += 7; // Adjusted yPos if line removed
        doc.text(`Number of People: ${searchResult.numPeople}`, 20, yPos);
        yPos += 7;
        doc.text(`Selected Travel Mode: ${searchResult.travelMode || 'Not selected'}`, 20, yPos);
        yPos += 7;
        if (searchResult.priceCategory !== 'N/A') {
            doc.text(`Price Category: ${searchResult.priceCategory}`, 20, yPos);
            yPos += 7;
        }
        doc.text(`Estimated Time: ${searchResult.estimatedTime}`, 20, yPos);
        yPos += 7;
        doc.text(`Estimated Distance: ${searchResult.estimatedDistance}`, 20, yPos);
        yPos += 7;
        doc.text(`Estimated Price Range: ${searchResult.currency}${searchResult.estimatedPriceRange.min} - ${searchResult.currency}${searchResult.estimatedPriceRange.max}`, 20, yPos);
        yPos += 7;
        doc.text(`User Price Filter: Min ${searchResult.currency}${searchResult.minPrice} - Max ${searchResult.currency}${searchResult.maxPrice}`, 20, yPos);
        yPos += 10;

        doc.setFontSize(14);
        doc.text("Traveler Details:", 10, yPos);
        yPos += 8;
        searchResult.travelers.forEach((traveler, index) => {
            doc.setFontSize(12);
            doc.text(`Traveler ${index + 1}: Age - ${traveler.age}, Gender - ${traveler.gender}`, 20, yPos);
            yPos += 7;
        });
        yPos += 10;

        doc.setFontSize(14);
        doc.text("Suggested Booking Links:", 10, yPos);
        yPos += 8;
        doc.setFontSize(12);
        doc.text("ixigo.com: https://www.ixigo.com/", 20, yPos);
        yPos += 7;
        doc.text("abhibus.com: https://www.abhibus.com/", 20, yPos);
        yPos += 7;
        doc.text("makemytrip.com: https://www.makemytrip.com/", 20, yPos);
        yPos += 7;
        doc.text("redbus.in: https://www.redbus.in/", 20, yPos);
        yPos += 7;

        doc.save('travel_details.pdf');
        logActivity('Printed travel details to PDF');
    };

    const getAvailableTravelModes = () => {
        const fromHasAirport = hasAirport(fromPlace);
        const toHasAirport = hasAirport(toPlace);
        let modes = ['Bus', 'Train', 'Car'];
        if (fromHasAirport && toHasAirport) {
            modes.unshift('Airplane');
        }
        return modes;
    };

    const getPriceCategoriesForMode = () => {
        const routeKey = `${fromPlace.toLowerCase()}-${toPlace.toLowerCase()}`;
        const routeData = TRAVEL_ROUTES_DATA[routeKey] || TRAVEL_ROUTES_DATA['default'];
        const modeData = routeData[travelMode];
        if (modeData && modeData.priceCategories) {
            return Object.keys(modeData.priceCategories);
        }
        return [];
    };

    return (
        <div style={pageStyle}>
            <h2 style={headingStyle}>Search for Travel by Place</h2>

            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={inputGroupStyle}>
                    <label htmlFor="fromPlace" style={labelStyle}>From Place:</label>
                    <select
                        id="fromPlace"
                        value={fromPlace}
                        onChange={(e) => {
                            setFromPlace(e.target.value);
                            setTravelMode('');
                            setPriceCategory('');
                            setSearchResult(null);
                            setError('');
                            // setAvailabilityMessage(''); // Removed
                        }}
                        style={selectStyle}
                        required
                    >
                        <option value="">Select Starting Place</option>
                        {VALID_PLACES.map(place => (
                            <option key={place} value={place}>{place}</option>
                        ))}
                    </select>
                </div>

                <div style={inputGroupStyle}>
                    <label htmlFor="toPlace" style={labelStyle}>To Place:</label>
                    <select
                        id="toPlace"
                        value={toPlace}
                        onChange={(e) => {
                            setToPlace(e.target.value);
                            setTravelMode('');
                            setPriceCategory('');
                            setSearchResult(null);
                            setError('');
                            // setAvailabilityMessage(''); // Removed
                        }}
                        style={selectStyle}
                        required
                    >
                        <option value="">Select Destination Place</option>
                        {VALID_PLACES.map(place => (
                            <option key={place} value={place}>{place}</option>
                        ))}
                    </select>
                </div>

                <div style={inputGroupStyle}>
                    <label htmlFor="departureDate" style={labelStyle}>Departure Date:</label>
                    <input
                        type="date"
                        id="departureDate"
                        value={departureDate}
                        onChange={(e) => {
                            setDepartureDate(e.target.value);
                            setSearchResult(null);
                            setError('');
                            // setAvailabilityMessage(''); // Removed
                        }}
                        min={getTodayDate()} // Disable past dates
                        style={inputStyle}
                        required
                    />
                </div>

                <div style={checkboxGroupStyle}>
                    <input
                        type="checkbox"
                        id="isRoundTrip"
                        checked={isRoundTrip}
                        onChange={(e) => {
                            setIsRoundTrip(e.target.checked);
                            if (!e.target.checked) setReturnDate(''); // Clear return date if one-way
                            setSearchResult(null);
                            setError('');
                            // setAvailabilityMessage(''); // Removed
                        }}
                    />
                    <label htmlFor="isRoundTrip" style={labelStyle}>Round Trip</label>
                </div>

                {isRoundTrip && (
                    <div style={inputGroupStyle}>
                        <label htmlFor="returnDate" style={labelStyle}>Return Date:</label>
                        <input
                            type="date"
                            id="returnDate"
                            value={returnDate}
                            onChange={(e) => {
                                setReturnDate(e.target.value);
                                setSearchResult(null);
                                setError('');
                                // setAvailabilityMessage(''); // Removed
                            }}
                            min={departureDate || getTodayDate()} // Return date cannot be before departure date or today
                            style={inputStyle}
                            required={isRoundTrip}
                        />
                    </div>
                )}

                {/* Removed Flexible Dates checkbox */}
                {/* <div style={checkboxGroupStyle}>
                    <input
                        type="checkbox"
                        id="isFlexibleDates"
                        checked={isFlexibleDates}
                        onChange={(e) => setIsFlexibleDates(e.target.checked)}
                    />
                    <label htmlFor="isFlexibleDates" style={labelStyle}>I am flexible with dates</label>
                </div> */}

                <div style={inputGroupStyle}>
                    <label htmlFor="numPeople" style={labelStyle}>Number of People:</label>
                    <input
                        type="number"
                        id="numPeople"
                        value={numPeople}
                        onChange={handleNumPeopleChange}
                        min="1"
                        style={inputStyle}
                        required
                    />
                </div>

                {Array.from({ length: numPeople }).map((_, index) => (
                    <div key={index} style={travelerGroupStyle}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#34495e', fontSize: '1.1em' }}>Traveler {index + 1}</h4>
                        <div style={inputGroupStyle}>
                            <label htmlFor={`age-${index}`} style={labelStyle}>Age:</label>
                            <input
                                type="number"
                                id={`age-${index}`}
                                value={travelers[index]?.age || ''}
                                onChange={(e) => handleTravelerChange(index, 'age', e.target.value)}
                                min="0"
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div style={inputGroupStyle}>
                            <label htmlFor={`gender-${index}`} style={labelStyle}>Gender:</label>
                            <select
                                id={`gender-${index}`}
                                value={travelers[index]?.gender || ''}
                                onChange={(e) => handleTravelerChange(index, 'gender', e.target.value)}
                                style={selectStyle}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        {numPeople > 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveTraveler(index)}
                                style={removeTravelerButtonStyle}
                            >
                                Remove Traveler
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={handleAddTraveler} style={addTravelerButtonStyle}>
                    Add Another Traveler
                </button>

                <div style={inputGroupStyle}>
                    <label htmlFor="travelMode" style={labelStyle}>Travel Mode:</label>
                    <select
                        id="travelMode"
                        value={travelMode}
                        onChange={(e) => {
                            setTravelMode(e.target.value);
                            setPriceCategory('');
                            setSearchResult(null);
                            setError('');
                            // setAvailabilityMessage(''); // Removed
                        }}
                        style={selectStyle}
                        required
                    >
                        <option value="">Select Travel Mode</option>
                        {getAvailableTravelModes().map(mode => (
                            <option key={mode} value={mode}>{mode}</option>
                        ))}
                    </select>
                </div>

                {/* Price Category Selection - Visible only for Airplane and Train */}
                {['Airplane', 'Train'].includes(travelMode) && getPriceCategoriesForMode().length > 0 && (
                    <div style={inputGroupStyle}>
                        <label htmlFor="priceCategory" style={labelStyle}>Price Category:</label>
                        <select
                            id="priceCategory"
                            value={priceCategory}
                            onChange={(e) => setPriceCategory(e.target.value)}
                            style={selectStyle}
                            required
                        >
                            <option value="">Select Category</option>
                            {getPriceCategoriesForMode().map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Price Filtering Options */}
                <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
                    <div style={{ ...inputGroupStyle, flex: 1 }}>
                        <label htmlFor="minPrice" style={labelStyle}>Min Price ({currency}):</label>
                        <input
                            type="number"
                            id="minPrice"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            min="500" // Set minimum value to 500
                            style={inputStyle}
                            placeholder="e.g., 500"
                        />
                    </div>
                    <div style={{ ...inputGroupStyle, flex: 1 }}>
                        <label htmlFor="maxPrice" style={labelStyle}>Max Price ({currency}):</label>
                        <input
                            type="number"
                            id="maxPrice"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            min="0" // Set minimum value to 0
                            style={inputStyle}
                            placeholder="e.g., 5000"
                        />
                    </div>
                </div>

                {/* Removed Currency Selection */}
                {/* <div style={inputGroupStyle}>
                    <label htmlFor="currency" style={labelStyle}>Currency:</label>
                    <select
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="₹">INR (₹)</option>
                        <option value="$">USD ($)</option>
                        <option value="€">EUR (€)</option>
                        <option value="£">GBP (£)</option>
                    </select>
                </div> */}


                {error && <p style={errorMessageStyle}>{error}</p>}
                {/* Removed Availability Message Display */}
                {/* {availabilityMessage && <p style={availabilityMessageStyle}>{availabilityMessage}</p>} */}

                <button
                    type="submit"
                    style={submitButtonStyle}
                    onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
                    onMouseOut={(e) => Object.assign(e.target.style, submitButtonStyle)}
                >
                    Search for Journeys
                </button>
            </form>

            {searchResult && (
                <div style={resultContainerStyle}>
                    <h3 style={resultTitleStyle}>Your Journey Details</h3>
                    <p><strong>From:</strong> {searchResult.fromPlace}</p>
                    <p><strong>To:</strong> {searchResult.toPlace}</p>
                    <p><strong>Departure Date:</strong> {searchResult.departureDate}</p>
                    {searchResult.isRoundTrip && <p><strong>Return Date:</strong> {searchResult.returnDate}</p>}
                    <p><strong>Trip Type:</strong> {searchResult.isRoundTrip ? 'Round Trip' : 'One Way'}</p>
                    {/* Removed Flexible Dates display */}
                    {/* <p><strong>Flexible Dates:</strong> {searchResult.isFlexibleDates ? 'Yes' : 'No'}</p> */}
                    <p><strong>Number of People:</strong> {searchResult.numPeople}</p>
                    <p><strong>Travel Mode:</strong> {searchResult.travelMode}</p>
                    {searchResult.priceCategory !== 'N/A' && (
                        <p><strong>Price Category:</strong> {searchResult.priceCategory}</p>
                    )}
                    <p><strong>Estimated Time:</strong> {searchResult.estimatedTime}</p>
                    <p><strong>Estimated Distance:</strong> {searchResult.estimatedDistance}</p>
                    <p><strong>Estimated Price Range:</strong> {searchResult.currency}{searchResult.estimatedPriceRange.min} - {searchResult.currency}{searchResult.estimatedPriceRange.max}</p>
                    <p><strong>Your Price Filter:</strong> Min {searchResult.currency}{searchResult.minPrice} - Max {searchResult.currency}{searchResult.maxPrice}</p>


                    <h4>Traveler Information:</h4>
                    <ul style={{ listStyle: 'none', paddingLeft: '20px' }}>
                        {searchResult.travelers.map((traveler, index) => (
                            <li key={index}>Traveler {index + 1}: Age - {traveler.age}, Gender - {traveler.gender}</li>
                        ))}
                    </ul>

                    <div style={bookingLinksStyle}>
                        <h4>Book Your Seats:</h4>
                        <a
                            href="https://www.ixigo.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={linkStyle}
                            onMouseOver={(e) => Object.assign(e.target.style, linkHoverStyle)}
                            onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}
                        >
                            ixigo.com
                        </a>
                        <a
                            href="https://www.abhibus.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={linkStyle}
                            onMouseOver={(e) => Object.assign(e.target.style, linkHoverStyle)}
                            onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}
                        >
                            abhibus.com
                        </a>
                        <a
                            href="https://www.makemytrip.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={linkStyle}
                            onMouseOver={(e) => Object.assign(e.target.style, linkHoverStyle)}
                            onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}
                        >
                            makemytrip.com
                        </a>
                        <a
                            href="https://www.redbus.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={linkStyle}
                            onMouseOver={(e) => Object.assign(e.target.style, linkHoverStyle)}
                            onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}
                        >
                            redbus.in
                        </a>
                    </div>

                    <button
                        onClick={handlePrintPdf}
                        style={printButtonStyle}
                        onMouseOver={(e) => Object.assign(e.target.style, printButtonHoverStyle)}
                        onMouseOut={(e) => Object.assign(e.target.style, printButtonStyle)}
                    >
                        Print to PDF
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchPlacesPage;
