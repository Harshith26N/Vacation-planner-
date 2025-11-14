// frontend/src/pages/PlacesPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// --- IMPORT LOCAL IMAGES ---
import goaImage from '../assets/goa.jpg';
import udaipurImage from '../assets/udaipur.jpeg';
import ladakhImage from '../assets/ladakh.jpg'; // For Leh-Ladakh
import kyotoImage from '../assets/kyoto2.jpg';
import parisImage from '../assets/paris.jpeg';
import bangkokImage from '../assets/bangkok.jpg';
import nycImage from '../assets/nyc.jpg'; // For New York City
import singaporeImage from '../assets/singapore.jpg';
import amritsarImage from '../assets/amritsar.jpg';
import rishikeshImage from '../assets/rishikesh.jpeg';
import manaliImage from '../assets/manali.jpeg'; // Assuming you have a Manali image
import tirupatiImage from '../assets/tirupati.jpg'; // Assuming you have a Tirupati image
import shirdiImage from '../assets/shirdi.jpg'; // Assuming you have a Shirdi image
import munnarImage from '../assets/munnar.jpeg'; // Assuming you have a Munnar image
import andamanImage from '../assets/andaman.jpg'; // Assuming you have an Andaman image
import delhiImage from '../assets/delhi.jpg'; // Assuming you have a Delhi image
import mumbaiImage from '../assets/mumbai.jpg'; // Assuming you have a Mumbai image


// --- SIMULATED DATA FOR PLACES SUGGESTIONS ---
// Added a 'typeSpecific' tag to help categorize places more broadly for travel types
const ALL_SUGGESTED_PLACES = [
  {
    id: 'goa',
    name: 'Goa, India',
    description: 'Beautiful beaches, vibrant nightlife, and Portuguese heritage. Great for relaxation and parties.',
    budgetCategory: ['mid-range', 'budget'],
    suitableFor: ['solo', 'couple', 'friends', 'relaxation', 'nightlife', 'food exploration', 'beaches'],
    typeSpecific: ['party', 'beach', 'solo-friendly', 'friends-trip'],
    image: goaImage,
  },
  {
    id: 'udaipur',
    name: 'Udaipur, India',
    description: 'The "City of Lakes" known for its royal palaces, rich history, and romantic ambiance.',
    budgetCategory: ['mid-range', 'luxury'],
    suitableFor: ['couple', 'family', 'cultural immersion', 'history & architecture', 'relaxation', 'sightseeing'],
    typeSpecific: ['romantic', 'luxury', 'cultural', 'family-friendly'],
    image: udaipurImage,
  },
  {
    id: 'leh-ladakh',
    name: 'Leh-Ladakh, India',
    description: 'Stunning mountain landscapes, Buddhist monasteries, and adventure sports. Ideal for thrill-seekers.',
    budgetCategory: ['mid-range', 'budget'],
    suitableFor: ['solo', 'friends', 'adventure sports', 'nature & outdoors', 'cultural immersion', 'backpacking', 'mountains'],
    typeSpecific: ['adventure', 'backpacking', 'mountains'],
    image: ladakhImage,
  },
  {
    id: 'kyoto',
    name: 'Kyoto, Japan',
    description: 'Ancient temples, traditional gardens, geishas, and serene beauty. A cultural delight.',
    budgetCategory: ['luxury', 'mid-range'],
    suitableFor: ['solo', 'couple', 'family', 'cultural immersion', 'history & architecture', 'sightseeing', 'food exploration'],
    typeSpecific: ['cultural', 'history', 'family-friendly'],
    image: kyotoImage,
  },
  {
    id: 'paris',
    name: 'Paris, France',
    description: 'The "City of Love" famous for its iconic landmarks, art, fashion, and romantic atmosphere.',
    budgetCategory: ['luxury', 'mid-range'],
    suitableFor: ['couple', 'solo', 'friends', 'cultural immersion', 'sightseeing', 'food exploration', 'shopping', 'nightlife'],
    typeSpecific: ['romantic', 'luxury', 'cultural', 'sightseeing'],
    image: parisImage,
  },
  {
    id: 'bangkok',
    name: 'Bangkok, Thailand',
    description: 'Bustling city with ornate temples, vibrant street life, delicious food, and lively markets.',
    budgetCategory: ['budget', 'mid-range'],
    suitableFor: ['solo', 'friends', 'food exploration', 'nightlife', 'shopping', 'cultural immersion'],
    typeSpecific: ['budget-friendly', 'nightlife', 'food', 'cultural'],
    image: bangkokImage,
  },
  {
    id: 'new-york-city',
    name: 'New York City, USA',
    description: 'A global hub of finance, fashion, art, and culture. Endless attractions and energy.',
    budgetCategory: ['luxury', 'mid-range'],
    suitableFor: ['solo', 'friends', 'business', 'sightseeing', 'shopping', 'nightlife', 'cultural immersion'],
    typeSpecific: ['city-break', 'business', 'shopping', 'nightlife'],
    image: nycImage,
  },
  {
    id: 'singapore',
    name: 'Singapore',
    description: 'Modern city-state known for its stunning architecture, lush gardens, and diverse culinary scene.',
    budgetCategory: ['luxury', 'mid-range'],
    suitableFor: ['family', 'solo', 'business', 'sightseeing', 'food exploration', 'shopping', 'relaxation'],
    typeSpecific: ['city-break', 'family-friendly', 'luxury', 'food'],
    image: singaporeImage,
  },
  {
    id: 'amritsar',
    name: 'Amritsar, India',
    description: 'Home to the Golden Temple, a spiritual and cultural center. Rich history and delicious food.',
    budgetCategory: ['budget', 'mid-range'],
    suitableFor: ['family', 'solo', 'pilgrimage', 'cultural immersion', 'food exploration', 'history & architecture'],
    typeSpecific: ['pilgrimage', 'cultural', 'family-friendly'],
    image: amritsarImage,
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh, India',
    description: 'Yoga capital of the world, nestled in the Himalayas by the Ganges. Adventure sports and spirituality.',
    budgetCategory: ['budget', 'mid-range'],
    suitableFor: ['solo', 'adventure sports', 'relaxation', 'nature & outdoors', 'pilgrimage', 'wellness & spa', 'mountains'],
    typeSpecific: ['spiritual', 'adventure', 'wellness', 'solo-friendly', 'mountains'],
    image: rishikeshImage,
  },
  {
    id: 'manali',
    name: 'Manali, India',
    description: 'Popular hill station for adventure sports like paragliding, rafting, and skiing. Scenic beauty.',
    budgetCategory: ['budget', 'mid-range'],
    suitableFor: ['friends', 'adventure sports', 'nature & outdoors', 'solo', 'mountains'],
    typeSpecific: ['adventure', 'mountains', 'friends-trip'],
    image: manaliImage,
  },
  {
    id: 'tirupati',
    name: 'Tirupati, India',
    description: 'Major pilgrimage center, home to the Venkateswara Temple. Important spiritual destination.',
    budgetCategory: ['budget', 'mid-range'],
    suitableFor: ['family', 'pilgrimage', 'cultural immersion'],
    typeSpecific: ['pilgrimage', 'family-friendly'],
    image: tirupatiImage,
  },
  {
    id: 'shirdi',
    name: 'Shirdi, India',
    description: 'Renowned pilgrimage site dedicated to Sai Baba. Attracts devotees seeking spiritual solace.',
    budgetCategory: ['budget', 'mid-range'],
    suitableFor: ['family', 'pilgrimage', 'cultural immersion'],
    typeSpecific: ['pilgrimage', 'family-friendly'],
    image: shirdiImage,
  },
  {
    id: 'munnar',
    name: 'Munnar, India',
    description: 'Lush green tea plantations, misty mountains, and waterfalls. Perfect for a serene and romantic getaway.',
    budgetCategory: ['mid-range', 'luxury'],
    suitableFor: ['couple', 'family', 'relaxation', 'nature & outdoors'],
    typeSpecific: ['romantic', 'nature', 'family-friendly'],
    image: munnarImage,
  },
  {
    id: 'andaman-nicobar',
    name: 'Andaman & Nicobar Islands, India',
    description: 'Pristine beaches, clear waters, and thrilling water sports. A tropical paradise.',
    budgetCategory: ['mid-range', 'luxury'],
    suitableFor: ['couple', 'friends', 'family', 'relaxation', 'adventure sports', 'nature & outdoors', 'beaches'],
    typeSpecific: ['beach', 'adventure', 'romantic', 'family-friendly', 'friends-trip'],
    image: andamanImage,
  },
  {
    id: 'delhi',
    name: 'Delhi, India',
    description: 'Capital city with a rich history, iconic monuments, vibrant markets, and diverse food scene.',
    budgetCategory: ['budget', 'mid-range'],
    suitableFor: ['solo', 'family', 'friends', 'business', 'cultural immersion', 'history & architecture', 'food exploration', 'shopping', 'sightseeing'],
    typeSpecific: ['city-break', 'cultural', 'history', 'business'],
    image: delhiImage,
  },
  {
    id: 'mumbai',
    name: 'Mumbai, India',
    description: 'India\'s financial capital and a bustling metropolis. Famous for Bollywood, historical sites, and vibrant street life.',
    budgetCategory: ['mid-range', 'luxury'],
    suitableFor: ['solo', 'friends', 'business', 'cultural immersion', 'sightseeing', 'nightlife', 'food exploration', 'shopping'],
    typeSpecific: ['city-break', 'business', 'nightlife', 'cultural'],
    image: mumbaiImage,
  },
];

// --- HELPER FUNCTIONS FOR BUDGET AND TRAVEL TYPE MAPPING ---

const parseBudgetToRange = (budgetStr) => {
  const cleanedStr = budgetStr.toLowerCase().replace(/,/g, ''); // Remove commas

  // Handle 'Lakh' and 'k' conversions
  let numericalValue;
  if (cleanedStr.includes('lakh')) {
    numericalValue = parseFloat(cleanedStr.replace('lakh', '')) * 100000;
  } else if (cleanedStr.includes('k')) {
    numericalValue = parseFloat(cleanedStr.replace('k', '')) * 1000;
  } else if (cleanedStr.includes('-')) {
    const parts = cleanedStr.split('-').map(p => parseFloat(p.trim()));
    // Return a range if it's explicitly a range
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { min: parts[0], max: parts[1] };
    }
    numericalValue = parts[0]; // Take the first part if it's not a valid range
  } else {
    numericalValue = parseFloat(cleanedStr.replace(/[^0-9.]/g, '')); // Remove other non-numeric chars
  }

  // If a single value, assume a range around it for flexibility
  if (!isNaN(numericalValue)) {
    return { min: numericalValue * 0.8, max: numericalValue * 1.2 }; // +/- 20%
  }
  return { min: 0, max: Infinity }; // Fallback
};

const getBudgetCategories = (minBudget, maxBudget) => {
  const categories = new Set(); // Use a Set to avoid duplicates

  if (maxBudget < 70000) {
    categories.add('budget');
  }
  if (minBudget <= 200000 && maxBudget >= 50000) {
    categories.add('mid-range');
  }
  if (minBudget > 150000) { // High end of mid-range and luxury
    categories.add('luxury');
  }
  // Add broad categories if overlaps
  if (minBudget <= 100000 && maxBudget >= 100000) {
    categories.add('mid-range');
  }

  return Array.from(categories);
};


const PlacesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state || {}; // Get formData passed from TripPlanningPage

  // Destructure relevant data for filtering
  const { budget, travelType, activities, numPersons } = formData;

  // A mapping of travelType to preferred 'typeSpecific' tags or suitableFor categories
  const travelTypePreferences = {
    'family': ['pilgrimage', 'family-friendly', 'cultural', 'nature', 'relaxation'],
    'solo': ['solo-friendly', 'adventure', 'backpacking', 'cultural', 'spiritual', 'city-break'],
    'couple': ['romantic', 'luxury', 'nature', 'relaxation', 'cultural'],
    'friends': ['friends-trip', 'adventure', 'nightlife', 'beach', 'city-break'],
    'business': ['business', 'city-break'],
    'backpacker': ['backpacking', 'budget-friendly', 'adventure', 'solo-friendly', 'nature'],
    'luxury': ['luxury', 'romantic', 'relaxation'],
    'pilgrimage': ['pilgrimage', 'cultural'],
    'medical': ['city-break'], // Medical tourism often in major cities with specific facilities
  };

  const getFilteredPlaces = () => {
    // If no essential data, show nothing or a fallback.
    if (!travelType) {
      return [];
    }

    const { min: userMinBudget, max: userMaxBudget } = parseBudgetToRange(budget || '0'); // Default budget to 0 if not provided
    const userBudgetCategories = getBudgetCategories(userMinBudget, userMaxBudget);

    // Step 1: Filter primarily by Travel Type Preferences
    let initialFiltered = ALL_SUGGESTED_PLACES.filter(place => {
      const preferredTags = travelTypePreferences[travelType] || [];
      // A place matches if it has *any* of the preferred tags/suitableFor categories
      const matchesTypePreference = preferredTags.some(tag =>
        place.typeSpecific.includes(tag) || place.suitableFor.includes(tag)
      );
      return matchesTypePreference;
    });

    // If initial filtering by travel type yielded no results,
    // broaden the scope to include places merely 'suitableFor' that travel type.
    if (initialFiltered.length === 0) {
        initialFiltered = ALL_SUGGESTED_PLACES.filter(place =>
            place.suitableFor.includes(travelType)
        );
    }

    // Step 2: Refine by Budget Category
    let refinedByBudget = initialFiltered.filter(place => {
      return userBudgetCategories.some(cat => place.budgetCategory.includes(cat));
    });

    // If budget refinement eliminates all, fallback to initial type-filtered places
    if (refinedByBudget.length === 0 && initialFiltered.length > 0) {
        refinedByBudget = initialFiltered;
    }


    // Step 3: Refine by Activities (if any activities are selected)
    let finalFiltered = refinedByBudget;
    if (activities && activities.length > 0) {
      finalFiltered = refinedByBudget.filter(place => {
        // Normalize activity names from form (e.g., "Adventure Sports" to "adventure_sports")
        const normalizedActivities = activities.map(activity => activity.toLowerCase().replace(/ /g, '_'));
        // Check if any of the place's suitableFor categories match user's selected activities
        return normalizedActivities.some(userActivity => place.suitableFor.includes(userActivity.replace(/_/g, ' '))); // Normalize suitableFor too
      });
    }

    // Step 4: Fallback mechanisms if filters are too restrictive
    if (finalFiltered.length === 0) {
      // If activities filter was too strict, revert to only budget and type filtered
      if (activities && activities.length > 0 && refinedByBudget.length > 0) {
          finalFiltered = refinedByBudget;
      } else {
        // If still no results, try to match just by travelType or show general popular ones
        const generalByType = ALL_SUGGESTED_PLACES.filter(place => place.suitableFor.includes(travelType));
        if (generalByType.length > 0) {
            finalFiltered = generalByType;
        } else {
            // Ultimate fallback: show a few popular destinations
            finalFiltered = ALL_SUGGESTED_PLACES.slice(0, 4); // Show top 4 popular ones as last resort
        }
      }
    }

    // Ensure variety by potentially shuffling or selecting a diverse set if many options
    // For now, we'll just return what we have.
    return finalFiltered.slice(0, 6); // Limit to a reasonable number of suggestions
  };

  const suggestedPlaces = getFilteredPlaces();

  const goBackToForm = () => {
    navigate('/'); // Navigate back to the main trip planning form
  };

  const handleCityClick = (cityId) => {
    navigate(`/city/${cityId}`);
  };

  // --- Dynamic CSS Styles (consistent with TripPlanningPage) ---
  const pageContainerStyle = {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f5f7fa',
    padding: '50px 20px',
    minHeight: 'calc(100vh - 120px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  };

  const contentCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
    padding: '60px',
    width: '100%',
    maxWidth: '1200px', // Wider card for places
    boxSizing: 'border-box',
    animation: 'slideInUp 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    marginTop: '50px',
    marginBottom: '50px',
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
    maxWidth: '800px',
    margin: '0 auto 50px auto',
    lineHeight: '1.6',
  };

  const placesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
    marginTop: '40px',
  };

  const placeCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid #e0e6ed',
    cursor: 'pointer', // Indicate that the card is clickable
  };

  const placeCardHoverStyle = {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
  };

  const placeImageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderBottom: '1px solid #f0f0f0',
  };

  const placeContentStyle = {
    padding: '25px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const placeNameStyle = {
    fontSize: '1.8em',
    fontWeight: '700',
    color: '#34495e',
    marginBottom: '10px',
  };

  const placeDescriptionStyle = {
    fontSize: '1em',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '15px',
    flexGrow: 1,
  };

  const placeInfoStyle = {
    fontSize: '0.9em',
    color: '#7f8c8d',
    marginBottom: '5px',
  };

  const backButtonStyle = {
    padding: '15px 30px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '40px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 6px 20px rgba(149, 165, 166, 0.3)',
  };

  const backButtonHoverStyle = {
    backgroundColor: '#7f8c8d',
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 25px rgba(149, 165, 166, 0.4)',
  };


  return (
    <div style={pageContainerStyle}>
      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(80px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div style={contentCardStyle}>
        <h2 style={headingStyle}>Your Personalized Destination Ideas!</h2>
        <p style={subHeadingStyle}>
          Based on your preferences (Travel Type: <strong>{formData.travelType || 'N/A'}</strong>, Budget: <strong>{formData.budget || 'N/A'}</strong>),
          here are some places you might love. **Click on a city card to see more details!**
        </p>

        {suggestedPlaces.length > 0 ? (
          <div style={placesGridStyle}>
            {suggestedPlaces.map(place => (
              <div
                key={place.id}
                style={placeCardStyle}
                onMouseOver={(e) => Object.assign(e.currentTarget.style, placeCardHoverStyle)}
                onMouseOut={(e) => Object.assign(e.currentTarget.style, placeCardStyle)}
                onClick={() => handleCityClick(place.id)}
              >
                <img src={place.image} alt={place.name} style={placeImageStyle} />
                <div style={placeContentStyle}>
                  <h3 style={placeNameStyle}>{place.name}</h3>
                  <p style={placeDescriptionStyle}>{place.description}</p>
                  <p style={placeInfoStyle}>
                    <strong>Ideal for:</strong> {place.suitableFor.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                  </p>
                  <p style={placeInfoStyle}>
                    <strong>Budget:</strong> {place.budgetCategory.map(b => b.charAt(0).toUpperCase() + b.slice(1)).join('/')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{textAlign: 'center', fontSize: '1.2em', color: '#e74c3c', marginTop: '40px'}}>
            We couldn't find specific places matching all your exact criteria.
            <br />
            You provided: Travel Type: "{formData.travelType || 'Not specified'}", Budget: "{formData.budget || 'Not specified'}", Activities: "{formData.activities.join(', ') || 'None selected'}".
            <br/>
            Please try adjusting your preferences on the previous page to get more tailored suggestions.
          </p>
        )}

        <button
          onClick={goBackToForm}
          style={backButtonStyle}
          onMouseOver={(e) => Object.assign(e.target.style, backButtonHoverStyle)}
          onMouseOut={(e) => Object.assign(e.target.style, backButtonStyle)}
        >
          Go Back to Adjust Preferences
        </button>
      </div>
    </div>
  );
};

export default PlacesPage;