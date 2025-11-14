// frontend/src/pages/TripPlanningPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// --- SIMULATED DATA (No longer used for direct validation here, but kept for context if needed for future logic) ---
const MAJOR_AIRPORT_CITIES = []; // No longer directly used
const SMALL_LOCAL_CITIES = []; // No longer directly used

// Helper function to extract country (simplified: no longer directly used)
const getCountryFromCity = (city) => {
  const parts = city.split(',').map(p => p.trim());
  return parts.length > 1 ? parts[parts.length - 1] : '';
};

// Helper to check if a city is likely to have major airport connectivity (no longer directly used)
const hasMajorAirportConnectivity = (city) => {
  // Logic removed as origin/destination are gone
  return true; // Dummy return
};
// --- END SIMULATED DATA ---

const TripPlanningPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [formData, setFormData] = useState({
    travelType: 'solo',
    numPersons: 1,
    startDate: '',
    endDate: '',
    budget: '',
    activities: [],
    transportation: [],
    accommodation: 'hotel',
    notes: '',
  });

  const [dateError, setDateError] = useState('');
  const [budgetError, setBudgetError] = useState(''); // NEW: State for budget error

  // Get today's date in YYYY-MM-DD format for min date attribute
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' || type === 'radio') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked
          ? (type === 'checkbox' ? [...prevData[name], value] : value)
          : (type === 'checkbox' ? prevData[name].filter((item) => item !== value) : prevData[name]),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    // Date validation
    if (name === 'startDate' || name === 'endDate') {
      const newFormData = { ...formData, [name]: value };
      if (newFormData.startDate && newFormData.endDate && new Date(newFormData.startDate) > new Date(newFormData.endDate)) {
        setDateError('End Date cannot be before Start Date.');
      } else {
        setDateError('');
      }
    }

    // NEW: Budget validation on change (optional, but good for immediate feedback)
    if (name === 'budget') {
      // Clean the input to get a pure number (remove commas, spaces, currency symbols, "Lakh", etc.)
      const cleanBudget = parseFloat(value.replace(/[^0-9.]/g, ''));
      if (isNaN(cleanBudget) || cleanBudget < 1000 || cleanBudget > 2500000) {
        setBudgetError('Budget must be between ₹1,000 and ₹25,00,000.');
      } else {
        setBudgetError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prioritize specific error messages
    if (dateError) {
      alert(dateError);
      return;
    }
    if (budgetError) { // Check budgetError state before proceeding
      alert(budgetError);
      return;
    }

    // Basic validation for budget and dates being filled
    if (!formData.budget || !formData.startDate || !formData.endDate) {
      alert("Please fill in Budget, Start Date Travel, and End Date Travel to get personalized suggestions.");
      return;
    }

    // Final check for budget during submission (in case user didn't trigger handleChange for budget correctly)
    const cleanBudget = parseFloat(formData.budget.replace(/[^0-9.]/g, ''));
    if (isNaN(cleanBudget) || cleanBudget < 1000 || cleanBudget > 2500000) {
        alert('Budget must be between ₹1,000 and ₹25,00,000.');
        setBudgetError('Budget must be between ₹1,000 and ₹25,00,000.'); // Set error state
        return;
    }


    console.log('Trip Planning Form Submitted for Suggestions:', formData);

    // Redirect to PlacesPage, passing formData as state
    navigate('/places', { state: formData });
  };

  // --- Dynamic CSS Styles (retained and refined for elegance) ---
  const pageContainerStyle = {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f5f7fa',
    padding: '50px 20px',
    minHeight: 'calc(100vh - 120px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  };

  const formCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
    padding: '60px',
    width: '100%',
    maxWidth: '1000px',
    boxSizing: 'border-box',
    animation: 'slideInUp 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  const headingStyle = {
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: '3.2em',
    marginBottom: '15px',
    fontWeight: '700',
    textShadow: '1px 1px 5px rgba(0,0,0,0.08)',
  };

  const subHeadingStyle = {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '1.3em',
    marginBottom: '50px',
    maxWidth: '700px',
    margin: '0 auto 50px auto',
    lineHeight: '1.6',
  };

  const formSectionTitleStyle = {
    fontWeight: 'bold',
    color: '#34495e',
    fontSize: '1.4em',
    marginBottom: '25px',
    marginTop: '40px',
    borderBottom: '2px solid #e0e6ed',
    paddingBottom: '10px',
    textAlign: 'left',
  };

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '35px',
    marginBottom: '30px',
  };

  const formGroupStyle = {
    marginBottom: '15px',
    position: 'relative',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '12px',
    fontWeight: '600',
    color: '#34495e',
    fontSize: '1.1em',
    transition: 'color 0.3s ease',
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    border: '1px solid #dcdfe6',
    borderRadius: '12px',
    fontSize: '1.1em',
    transition: 'border-color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
  };

  const inputFocusStyle = {
    borderColor: '#6a9aff',
    boxShadow: '0 0 15px rgba(106, 154, 255, 0.3)',
    outline: 'none',
    transform: 'scale(1.005)',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20viewBox%3D%220%200%20256%20448%22%20enable-background%3D%22new%200%200%20256%20448%22%3E%3Cstyle%20type%3D%22text/css%22%3E.arrow%7Bfill:%23424242;%7D%3C/style%3E%3Cpath%20class%3D%22arrow%22%20d%3D%22M255.9%20168c0-4.2-1.6-7.9-4.8-11.2L133.3%204.8c-3.2-3.2-6.9-4.8-11.2-4.8s-7.9%201.6-11.2%204.8L4.8%20156.8c-3.2%203.2-4.8%206.9-4.8%2011.2s1.6%207.9%204.8%2011.2l2.3%202.3c3.2%203.2%206.9%204.8%2011.2%204.8H80v152c0%2017.6%2014.4%2032%2032%2032h16c17.6%200%2032-14.4%2032-32V181.5h61.7c4.2%200%207.9-1.6%2011.2-4.8L251.2%20179.2c3.1-3.2%204.7-6.9%204.7-11.2z%22/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 18px center',
    backgroundSize: '12px',
    paddingRight: '40px',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '160px',
    resize: 'vertical',
  };

  const radioCheckboxGroupStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '18px',
    marginTop: '10px',
  };

  const radioCheckboxItemStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#555',
    fontWeight: 'normal',
    backgroundColor: '#f8f9fa',
    padding: '14px 22px',
    borderRadius: '12px',
    border: '1px solid #e0e6ed',
    transition: 'background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
  };

  const radioCheckboxItemCheckedStyle = {
    backgroundColor: '#eaf7ff',
    borderColor: '#6a9aff',
    color: '#2980b9',
    fontWeight: '600',
    transform: 'scale(1.02)',
    boxShadow: '0 3px 10px rgba(106, 154, 255, 0.2)',
  };

  const radioCheckboxInputStyle = {
    marginRight: '12px',
    width: '24px',
    height: '24px',
    accentColor: '#6a9aff',
    cursor: 'pointer',
  };

  const submitButtonStyle = {
    width: '100%',
    padding: '22px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '1.5em',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '60px',
    transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
    boxShadow: '0 10px 30px rgba(46, 204, 113, 0.35)',
  };

  const submitButtonHoverStyle = {
    backgroundColor: '#27ae60',
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 35px rgba(46, 204, 113, 0.5)',
  };

  const errorMessageText = {
    color: '#dc3545',
    fontSize: '0.9em',
    marginTop: '8px',
    fontWeight: 'normal',
  };

  const travelTypes = [
    { value: 'solo', label: 'Solo Adventure' },
    { value: 'couple', label: 'Romantic Getaway' },
    { value: 'family', label: 'Family Fun' },
    { value: 'friends', label: 'Friends Trip' },
    { value: 'business', label: 'Business Travel' },
    { value: 'backpacker', label: 'Backpacking' },
    { value: 'luxury', label: 'Luxury Trip' },
    { value: 'pilgrimage', label: 'Pilgrimage' },
    { value: 'medical', label: 'Medical Tourism' },
  ];

  return (
    <div style={pageContainerStyle}>
      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(80px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <div style={formCardStyle}>
        <h2 style={headingStyle}>Find Your Perfect Destination!</h2>
        <p style={subHeadingStyle}>
          Tell us your travel style and budget, and we'll suggest amazing places tailored just for you.
        </p>

        <form onSubmit={handleSubmit}>

          <h3 style={formSectionTitleStyle}>When and How much?</h3>
          <div style={formGridStyle}>
            {/* Number of Persons */}
            <div style={formGroupStyle}>
              <label htmlFor="numPersons" style={labelStyle}>Number of Persons</label>
              <input
                type="number"
                id="numPersons"
                name="numPersons"
                value={formData.numPersons}
                onChange={handleChange}
                min="1"
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            {/* Start Date Travel */}
            <div style={formGroupStyle}>
              <label htmlFor="startDate" style={labelStyle}>Start Date Travel</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={getMinDate()}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            {/* End Date Travel */}
            <div style={formGroupStyle}>
              <label htmlFor="endDate" style={labelStyle}>End Date Travel</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || getMinDate()}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
              {dateError && <p style={errorMessageText}>{dateError}</p>}
            </div>

            {/* Budget - In Rs */}
            <div style={formGroupStyle}>
              <label htmlFor="budget" style={labelStyle}>Estimated Budget (in Rupees)</label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g., 50,000, 1,00,000 - 1,50,000, 2 Lakh"
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
              {budgetError && <p style={errorMessageText}>{budgetError}</p>} {/* Display budget error */}
            </div>

            {/* Accommodation Type */}
            <div style={formGroupStyle}>
              <label htmlFor="accommodation" style={labelStyle}>Preferred Accommodation</label>
              <select
                id="accommodation"
                name="accommodation"
                value={formData.accommodation}
                onChange={handleChange}
                style={selectStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, selectStyle)}
              >
                <option value="hotel">Hotel</option>
                <option value="resort">Resort</option>
                <option value="guesthouse">Guesthouse</option>
                <option value="hostel">Hostel</option>
                <option value="airbnb">Airbnb/Rental</option>
              </select>
            </div>
          </div>

          <h3 style={formSectionTitleStyle}>What kind of trip is it?</h3>
          {/* Travel Type - Radio buttons */}
          <div style={{...formGroupStyle}}>
            <label style={labelStyle}>Travel Type</label>
            <div style={radioCheckboxGroupStyle}>
              {travelTypes.map((type) => (
                <label
                  key={type.value}
                  style={formData.travelType === type.value ? {...radioCheckboxItemStyle, ...radioCheckboxItemCheckedStyle} : radioCheckboxItemStyle}
                >
                  <input
                    type="radio"
                    name="travelType"
                    value={type.value}
                    checked={formData.travelType === type.value}
                    onChange={handleChange}
                    style={radioCheckboxInputStyle}
                  />
                  {type.label}
                </label>
              ))}
            </div>
          </div>

          <h3 style={formSectionTitleStyle}>Your Interests & Preferences</h3>
          {/* Activities */}
          <div style={{...formGroupStyle, marginBottom: '30px'}}>
            <label style={labelStyle}>Preferred Activities</label>
            <div style={radioCheckboxGroupStyle}>
              {[
                'Sightseeing', 'Adventure Sports', 'Relaxation', 'Cultural Immersion',
                'Shopping', 'Nightlife', 'Food Exploration', 'Nature & Outdoors', 'History & Architecture', 'Wellness & Spa'
              ].map((activity) => (
                <label
                  key={activity}
                  style={formData.activities.includes(activity) ? {...radioCheckboxItemStyle, ...radioCheckboxItemCheckedStyle} : radioCheckboxItemStyle}
                >
                  <input
                    type="checkbox"
                    name="activities"
                    value={activity}
                    checked={formData.activities.includes(activity)}
                    onChange={handleChange}
                    style={radioCheckboxInputStyle}
                  />
                  {activity}
                </label>
              ))}
            </div>
          </div>

          {/* Transportation */}
          <div style={{...formGroupStyle, marginBottom: '30px'}}>
            <label style={labelStyle}>Preferred Transportation</label>
            <div style={radioCheckboxGroupStyle}>
              {[
                'Flights', 'Train', 'Bus', 'Rental Car', 'Cruise', 'Local Public Transport', 'Bicycle'
              ].map((transport) => (
                <label
                  key={transport}
                  style={formData.transportation.includes(transport) ? {...radioCheckboxItemStyle, ...radioCheckboxItemCheckedStyle} : radioCheckboxItemStyle}
                >
                  <input
                    type="checkbox"
                    name="transportation"
                    value={transport}
                    checked={formData.transportation.includes(transport)}
                    onChange={handleChange}
                    style={radioCheckboxInputStyle}
                  />
                  {transport}
                </label>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div style={formGroupStyle}>
            <label htmlFor="notes" style={labelStyle}>Additional Notes / Specific Requests</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g., 'Prefer vegetarian food', 'Accessible options needed', 'Want to visit specific landmarks'"
              style={textareaStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, textareaStyle)}
            ></textarea>
          </div>

          <button
            type="submit"
            style={submitButtonStyle}
            onMouseOver={(e) => Object.assign(e.target.style, submitButtonHoverStyle)}
            onMouseOut={(e) => Object.assign(e.target.style, submitButtonStyle)}
          >
            Generate My Destination Ideas
          </button>
        </form>
      </div>
    </div>
  );
};

export default TripPlanningPage;