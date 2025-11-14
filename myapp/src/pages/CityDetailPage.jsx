// frontend/src/pages/CityDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// --- Import Images ---
import newyorkSkyline from '../assets/newyork_skyline.jpeg';
import bangkokTemple from '../assets/bangkok_temple.jpeg';
import parisEiffel from '../assets/paris_eiffel.jpeg';
import kyotoTemple from '../assets/kyoto_temple.jpeg';
import goaBeach from '../assets/goa_beach.jpeg';
import udaipurPalace from '../assets/udaipur_palace.jpeg';
import ladakhMonastery from '../assets/ladakh_monastery.jpeg';
import singaporeGardens from '../assets/singapore_gardens.jpeg';
import amritsarGoldenTemple from '../assets/amritsar_golden_temple.jpeg';
import rishikeshGhat from '../assets/rishikesh_ghat.jpeg';

import nycImage from '../assets/nyc.jpg';


// --- SIMULATED DETAILED CITY DATA ---
// Removed 'weatherCategory' as it's now primarily used by PackingSuggestionsPage
const DETAILED_CITY_DATA = [
  {
    id: 'new-york-city',
    name: 'New York City',
    tagline: 'The City That Never Sleeps',
    mainImage: nycImage,
    greatness: "New York City is a global hub of finance, fashion, art, and culture. Its iconic skyline, diverse neighborhoods, and endless attractions make it a truly unique destination. From Broadway shows to world-class museums, and diverse culinary experiences, NYC offers something for everyone.",
    historicPlaces: [
      { name: 'Statue of Liberty', description: 'A symbol of freedom and democracy, gifted by France.' },
      { name: 'Ellis Island', description: 'Historic gateway for millions of immigrants to the US.' },
      { name: 'Empire State Building', description: 'An Art Deco skyscraper, one of NYC\'s most famous landmarks.' },
    ],
    mustVisit: [
      'Times Square', 'Central Park', 'Museum of Modern Art (MoMA)', 'Metropolitan Museum of Art (The Met)',
      'Broadway Show', 'Brooklyn Bridge', 'High Line', 'Grand Central Terminal'
    ],
    foodHighlights: [
      'New York-style Pizza', 'Bagels and Lox', 'Cheesecake', 'Street Food (hot dogs, pretzels)'
    ],
    bookingLinks: {
      flights: 'https://www.ixigo.com/flights-to-new-york-city-nyc-from-all-places-lp-2747169',
      hotels: 'https://www.booking.com/city/us/new-york.html',
      buses: 'https://www.redbus.in/bus-tickets/new-york',
      trains: 'https://www.amtrak.com/stations/ny-new-york.html',
    },
    images: [newyorkSkyline, 'https://via.placeholder.com/600x400/B0E0E6/FFFFFF?text=Times+Square', 'https://via.placeholder.com/600x400/ADD8E6/FFFFFF?text=Central+Park']
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    tagline: 'The City of Angels',
    mainImage: bangkokTemple,
    greatness: "Bangkok is a vibrant and bustling metropolis known for its ornate temples, lively street life, and delicious food. It perfectly blends traditional Thai culture with modern development, offering unique experiences from floating markets to towering skyscrapers.",
    historicPlaces: [
      { name: 'Grand Palace & Wat Phra Kaeo', description: 'Former royal residence and home to the Emerald Buddha.' },
      { name: 'Wat Arun (Temple of Dawn)', description: 'Stunning temple on the Chao Phraya River, famous for its spires.' },
      { name: 'Wat Pho (Temple of the Reclining Buddha)', description: 'Home to the giant reclining Buddha statue.' },
    ],
    mustVisit: [
      'Chatuchak Weekend Market', 'Chao Phraya River Cruise', 'Asiatique The Riverfront',
      'Jim Thompson House', 'Khao San Road', 'Lumphini Park'
    ],
    foodHighlights: [
      'Pad Thai', 'Tom Yum Goong', 'Green Curry', 'Mango Sticky Rice', 'Street Food'
    ],
    bookingLinks: {
      flights: 'https://www.ixigo.com/flights-to-bangkok-bkk-from-all-places-lp-2746401',
      hotels: 'https://www.booking.com/city/th/bangkok.html',
      buses: 'https://www.busonlineticket.co.th/bus-from/bangkok/',
      trains: 'https://www.thairailwayticket.com/',
    },
    images: [bangkokTemple, 'https://via.placeholder.com/600x400/98FB98/FFFFFF?text=Grand+Palace', 'https://via.placeholder.com/600x400/ADD8E6/FFFFFF?text=Floating+Market']
  },
  {
    id: 'paris',
    name: 'Paris',
    tagline: 'The City of Love',
    mainImage: parisEiffel,
    greatness: "Paris is renowned for its romantic ambiance, iconic landmarks, world-class art, and haute couture. It's a city that captivates with its beautiful architecture, charming cafes, and a rich history visible at every turn.",
    historicPlaces: [
      { name: 'Eiffel Tower', description: 'The most iconic symbol of Paris, offering breathtaking views.' },
      { name: 'Louvre Museum', description: 'Home to thousands of works of art, including the Mona Lisa.' },
      { name: 'Notre Dame Cathedral', description: 'A masterpiece of French Gothic architecture.' },
      { name: 'Arc de Triomphe', description: 'Honors those who fought and died for France in the French Revolutionary and Napoleonic Wars.' },
    ],
    mustVisit: [
      'Champs-Élysées', 'Sacre-Coeur Basilica', 'Montmartre', 'Musée d\'Orsay',
      'Seine River Cruise', 'Palace of Versailles (day trip)'
    ],
    foodHighlights: [
      'Croissants', 'Macarons', 'Escargots', 'Crepes', 'French Cheese'
    ],
    bookingLinks: {
      flights: 'https://www.ixigo.com/flights-to-paris-cdg-from-all-places-lp-2747196',
      hotels: 'https://www.booking.com/city/fr/paris.html',
      buses: 'https://www.flixbus.fr/',
      trains: 'https://www.sncf-connect.com/',
    },
    images: [parisEiffel, 'https://via.placeholder.com/600x400/DDA0DD/FFFFFF?text=Louvre', 'https://via.placeholder.com/600x400/FFB6C1/FFFFFF?text=Notre+Dame']
  },
  {
    id: 'goa',
    name: 'Goa',
    tagline: 'Beaches, Parties, and Sun',
    mainImage: goaBeach,
    greatness: 'Goa is India\'s smallest state, but arguably its most famous tourist destination, known for its stunning beaches, vibrant nightlife, Portuguese-influenced architecture, and laid-back atmosphere. It offers a perfect blend of relaxation and adventure.',
    historicPlaces: [
      { name: 'Basilica of Bom Jesus', description: 'A UNESCO World Heritage site, housing the relics of St. Francis Xavier.' },
      { name: 'Se Cathedral', description: 'One of the largest churches in Asia, part of the Churches and Convents of Goa.' },
      { name: 'Fort Aguada', description: 'A 17th-century Portuguese fort overlooking the Arabian Sea.' },
    ],
    mustVisit: [
      'Palolem Beach', 'Anjuna Flea Market', 'Dudhsagar Waterfalls', 'Baga Beach',
      'Old Goa', 'Spice Plantations', 'Chapora Fort'
    ],
    foodHighlights: [
      'Goan Fish Curry', 'Pork Vindaloo', 'Xacuti', 'Feni (local cashew/coconut liquor)', 'Prawn Balchão'
    ],
    bookingLinks: {
      flights: 'https://www.ixigo.com/flights-to-goa-goi-from-all-places-lp-2746409',
      hotels: 'https://www.booking.com/region/in/goa.html',
      buses: 'https://www.abhibus.com/bus-tickets/goa',
      trains: 'https://www.indianrail.gov.in/railhom.html',
    },
    images: [goaBeach, 'https://via.placeholder.com/600x400/FFD700/FFFFFF?text=Dudhsagar', 'https://via.placeholder.com/600x400/FFC0CB/FFFFFF?text=Anjuna']
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    tagline: 'The City of Lakes and Palaces',
    mainImage: udaipurPalace,
    greatness: 'Udaipur, often called the "Venice of the East," is a romantic city in Rajasthan, famous for its beautiful lakes, majestic palaces, and rich Rajput history. Its stunning architecture and serene boat rides offer a truly royal experience.',
    historicPlaces: [
      { name: 'City Palace', description: 'A grand complex of palaces, courtyards, and gardens, overlooking Lake Pichola.' },
      { name: 'Lake Pichola', description: 'An artificial freshwater lake, home to several islands and the iconic Lake Palace.' },
      { name: 'Jag Mandir', description: 'A palace on an island in Lake Pichola, known for its elegant architecture.' },
      { name: 'Saheliyon-ki-Bari', description: 'A beautiful garden of maids, with fountains and marble elephants.' },
    ],
    mustVisit: [
      'Jagdish Temple', 'Fateh Sagar Lake', 'Bagore Ki Haveli', 'Sajjangarh Palace (Monsoon Palace)',
      'Cable Car Ride (Karni Mata Temple)'
    ],
    foodHighlights: [
      'Dal Bati Churma', 'Gatte Ki Sabzi', 'Laal Maas (non-veg)', 'Mirchi Bada'
    ],
    bookingLinks: {
      flights: 'https://www.ixigo.com/flights-to-udaipur-uda-from-all-places-lp-2746445',
      hotels: 'https://www.booking.com/city/in/udaipur.html',
      buses: 'https://www.abhibus.com/bus-tickets/udaipur',
      trains: 'https://www.indianrail.gov.in/railhom.html',
    },
    images: [udaipurPalace, 'https://via.placeholder.com/600x400/ADD8E6/FFFFFF?text=Lake+Pichola', 'https://via.placeholder.com/600x400/ADD8E6/FFFFFF?text=City+Palace']
  },
  {
    id: 'leh-ladakh',
    name: 'Leh-Ladakh',
    tagline: 'The Land of High Passes',
    mainImage: ladakhMonastery,
    greatness: 'Ladakh, a high-altitude cold desert, is famous for its breathtaking landscapes, serene Buddhist monasteries, and thrilling adventure sports. It offers a unique cultural experience amidst rugged mountains and pristine valleys.',
    historicPlaces: [
      { name: 'Leh Palace', description: 'A former royal palace overlooking the town of Leh, resembling the Potala Palace in Lhasa.' },
      { name: 'Shanti Stupa', description: 'A white-domed Buddhist stupa offering panoramic views of Leh.' },
      { name: 'Thiksey Monastery', description: 'A magnificent Tibetan Buddhist monastery of the Gelugpa sect.' },
    ],
    mustVisit: [
      'Pangong Tso Lake', 'Magnetic Hill', 'Nubra Valley', 'Khardung La Pass',
      'Hemis Monastery', 'Diskit Monastery', 'Lamayuru Monastery'
    ],
    foodHighlights: [
      'Thukpa', 'Momo', 'Skyu', 'Chhutagi', 'Butter Tea'
    ],
    bookingLinks: {
      flights: 'https://www.ixigo.com/flights-to-leh-ixl-from-all-places-lp-2746420',
      hotels: 'https://www.booking.com/region/in/ladakh.html',
      buses: 'https://www.abhibus.com/bus-tickets/leh-ladakh',
      trains: 'https://www.indianrail.gov.in/railhom.html',
    },
    images: [ladakhMonastery, 'https://via.placeholder.com/600x400/A7C7E7/FFFFFF?text=Pangong+Lake', 'https://via.placeholder.com/600x400/A7C7E7/FFFFFF?text=Nubra+Valley']
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    tagline: 'Japan\'s Cultural Capital',
    mainImage: kyotoTemple,
    greatness: 'Kyoto, once the imperial capital of Japan, is celebrated for its ancient temples, beautiful gardens, traditional geisha districts, and rich cultural heritage. It offers a serene and authentic Japanese experience.',
    historicPlaces: [
      { name: 'Kinkaku-ji (Golden Pavilion)', description: 'A stunning Zen Buddhist temple covered in gold leaf.' },
      { name: 'Fushimi Inari-taisha', description: 'Famous for its thousands of vibrant orange torii gates leading up Mt. Inari.' },
      { name: 'Kiyomizu-dera Temple', description: 'A wooden temple perched on a hillside with panoramic views.' },
    ],
    mustVisit: [
      'Arashiyama Bamboo Grove', 'Gion District', 'Nishiki Market', 'Philosopher\'s Path',
      'Ryoan-ji Temple', 'Kyoto Imperial Palace'
    ],
    foodHighlights: [
      'Kaiseki (traditional multi-course dinner)', 'Matcha (green tea)', 'Yatsuhashi (sweet mochi confection)', 'Sake'
    ],
    bookingLinks: {
      flights: 'https://www.ixigo.com/flights-to-japan-jp-from-all-places-lp-2746415',
      hotels: 'https://www.booking.com/city/jp/kyoto.html',
      buses: 'https://japanbusonline.com/',
      trains: 'https://www.japanrailpass.net/en/',
    },
    images: [kyotoTemple, 'https://via.placeholder.com/600x400/FFB6C1/FFFFFF?text=Fushimi+Inari', 'https://via.placeholder.com/600x400/FFB6C1/FFFFFF?text=Arashiyama']
  },
  {
    id: 'singapore',
    name: 'Singapore',
    tagline: 'The Garden City',
    mainImage: singaporeGardens,
    greatness: 'Singapore is a vibrant island nation known for its stunning modern architecture, lush green spaces, diverse cultural tapestry, and world-class culinary scene. It\'s a melting pot of cultures with efficient public transport and a very safe environment.',
    historicPlaces: [
      { name: 'National Museum of Singapore', description: 'Oldest museum in Singapore, showcasing the nation\'s history.' },
      { name: 'Peranakan Shophouses (Joo Chiat/Katong)', description: 'Colorful, preserved shophouses reflecting Peranakan culture.' },
      { name: 'Buddha Tooth Relic Temple', description: 'A beautiful Buddhist temple in Chinatown, housing a sacred relic.' },
    ],
    mustVisit: [
      'Gardens by the Bay (Cloud Forest, Flower Dome)', 'Marina Bay Sands (SkyPark)', 'Sentosa Island',
      'ArtScience Museum', 'Singapore Zoo (Night Safari)', 'Chinatown', 'Little India'
    ],
    foodHighlights: [
      'Hainanese Chicken Rice', 'Laksa', 'Chilli Crab', 'Char Kway Teow', 'Satay'
    ],
    bookingLinks: {
      flights: 'https://www.ixigo.com/flights-to-singapore-sin-from-all-places-lp-2746435',
      hotels: 'https://www.booking.com/city/sg/singapore.html',
      buses: 'https://www.busonlineticket.com/bus-from/singapore',
      trains: 'https://www.easybook.com/en-sg/train/singapore-to-malaysia',
    },
    images: [singaporeGardens, 'https://via.placeholder.com/600x400/FFDAB9/FFFFFF?text=Marina+Bay+Sands', 'https://via.placeholder.com/600x400/FFDAB9/FFFFFF?text=Chinatown']
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    tagline: 'Spiritual Heart of Sikhism',
    mainImage: amritsarGoldenTemple,
    greatness: 'Amritsar, in Punjab, is home to the Harmandir Sahib, popularly known as the Golden Temple, the spiritual and cultural hub for Sikhs. The city offers a profound cultural experience, delicious food, and a deep sense of history and devotion.',
    historicPlaces: [
      { name: 'Golden Temple (Harmandir Sahib)', description: 'The holiest gurudwara of Sikhism, stunningly beautiful and serene.' },
      { name: 'Jallianwala Bagh', description: 'A historic garden and memorial of national importance.' },
      { name: 'Partition Museum', description: 'Dedicated to the Partition of India, showcasing personal stories and history.' },
    ],
    mustVisit: [
      'Wagah Border Ceremony', 'Akal Takht', 'Gobindgarh Fort', 'Central Sikh Museum',
      'Hall Bazaar (shopping)', 'Local Food Streets'
    ],
    foodHighlights: [
      'Amritsari Kulcha', 'Chole Bhature', 'Lassi', 'Makki ki Roti & Sarson ka Saag', 'Jalebi'
    ],
    bookingLinks: {
      flights: 'https://www.ixigo.com/flights-to-amritsar-atq-from-all-places-lp-2746399',
      hotels: 'https://www.booking.com/city/in/amritsar.html',
      buses: 'https://www.abhibus.com/bus-tickets/amritsar',
      trains: 'https://www.indianrail.gov.in/railhom.html',
    },
    images: [amritsarGoldenTemple, 'https://via.placeholder.com/600x400/F0F8FF/FFFFFF?text=Jallianwala+Bagh', 'https://via.placeholder.com/600x400/F0F8FF/FFFFFF?text=Wagah+Border']
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    tagline: 'Yoga Capital of the World',
    mainImage: rishikeshGhat,
    greatness: 'Rishikesh, nestled in the Himalayas along the Ganges River, is renowned as the Yoga Capital of the World. It offers a unique blend of spirituality, adventure sports like river rafting, and serene natural beauty, attracting pilgrims and thrill-seekers alike.',
    historicPlaces: [
      { name: 'Lakshman Jhula', description: 'An iconic suspension bridge offering scenic views of the Ganges and temples.' },
      { name: 'Ram Jhula', description: 'Another famous suspension bridge connecting various ashrams and temples.' },
      { name: 'Beatles Ashram (Maharishi Mahesh Yogi Ashram)', description: 'Historic ashram where The Beatles famously stayed and meditated.' },
    ],
    mustVisit: [
      'Triveni Ghat (Ganga Aarti)', 'Neer Garh Waterfall', 'River Rafting (Ganges)',
      'Bungee Jumping (Mohan Chatti)', 'Parmarth Niketan Ashram', 'The Shivpuri (camping & rafting point)'
    ],
    foodHighlights: [
      'Aloo Poori', 'Chai', 'Healthy Vegan/Vegetarian Cuisine', 'Local Sweets'
    ],
    bookingLinks: {
      flights: 'https://www.ixigo.com/flights-to-dehradun-ddn-from-all-places-lp-2746405',
      hotels: 'https://www.booking.com/city/in/rishikesh.html',
      buses: 'https://www.abhibus.com/bus-tickets/rishikesh',
      trains: 'https://www.indianrail.gov.in/railhom.html',
    },
    images: [rishikeshGhat, 'https://via.placeholder.com/600x400/AFEEEE/FFFFFF?text=Lakshman+Jhula', 'https://via.placeholder.com/600x400/AFEEEE/FFFFFF?text=Rafting']
  }
];


const CityDetailPage = () => {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    const fetchCityDetails = setTimeout(() => {
      const foundCity = DETAILED_CITY_DATA.find(city => city.id === cityId);

      if (foundCity) {
        setCityData(foundCity);
      } else {
        setError(`City details for "${cityId}" not found.`);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(fetchCityDetails);
  }, [cityId]);

  if (loading) {
    return (
      <div style={styles.loadingError}>
        <div style={styles.spinner}></div>
        Loading city details...
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingError}>
        <p>{error}</p>
        <button onClick={() => navigate('/places')} style={styles.backButton}>Go Back to Places</button>
      </div>
    );
  }

  if (!cityData) {
    return (
      <div style={styles.loadingError}>
        <p>No city data to display.</p>
        <button onClick={() => navigate('/places')} style={styles.backButton}>Go Back to Places</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={styles.card}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>&larr; Back to Destinations</button>

        <img src={cityData.mainImage} alt={cityData.name} style={styles.mainImage} />

        <h1 style={styles.title}>{cityData.name}</h1>
        <p style={styles.tagline}>{cityData.tagline}</p>

        <p style={styles.sectionText}>{cityData.greatness}</p>

        <hr style={styles.divider} />

        <h2 style={styles.sectionTitle}>Must-Visit Places & Activities</h2>
        <ul style={styles.list}>
          {cityData.mustVisit.map((item, index) => (
            <li key={index} style={styles.listItem}>{item}</li>
          ))}
        </ul>

        <hr style={styles.divider} />

        <h2 style={styles.sectionTitle}>Historic Places</h2>
        <div style={styles.historicPlacesGrid}>
          {cityData.historicPlaces.map((place, index) => (
            <div key={index} style={styles.historicPlaceCard}>
              <h4 style={styles.historicPlaceName}>{place.name}</h4>
              <p style={styles.historicPlaceDescription}>{place.description}</p>
            </div>
          ))}
        </div>

        <hr style={styles.divider} />

        <h2 style={styles.sectionTitle}>Local Food Highlights</h2>
        <ul style={styles.list}>
          {cityData.foodHighlights.map((item, index) => (
            <li key={index} style={styles.listItem}>{item}</li>
          ))}
        </ul>

        <hr style={styles.divider} />

        <h2 style={styles.sectionTitle}>Book Your Journey</h2>
        <p style={styles.sectionText}>Ready to explore {cityData.name}? Find the best deals on flights, hotels, buses, and trains below:</p>
        <div style={styles.bookingLinksContainer}>
          {cityData.bookingLinks.flights && (
            <a href={cityData.bookingLinks.flights} target="_blank" rel="noopener noreferrer" style={styles.bookingButton}>
              Book Flights (e.g., Ixigo)
            </a>
          )}
          {cityData.bookingLinks.hotels && (
            <a href={cityData.bookingLinks.hotels} target="_blank" rel="noopener noreferrer" style={styles.bookingButton}>
              Book Hotels (e.g., Booking.com)
            </a>
          )}
          {cityData.bookingLinks.buses && (
            <a href={cityData.bookingLinks.buses} target="_blank" rel="noopener noreferrer" style={styles.bookingButton}>
              Book Buses (e.g., AbhiBus / RedBus)
            </a>
            )}
          {cityData.bookingLinks.trains && (
            <a href={cityData.bookingLinks.trains} target="_blank" rel="noopener noreferrer" style={styles.bookingButton}>
              Book Trains (e.g., IndianRail/Amtrak)
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f5f7fa',
    padding: '40px 20px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
    padding: '40px 60px',
    width: '100%',
    maxWidth: '1000px',
    boxSizing: 'border-box',
    animation: 'fadeIn 0.8s ease-out',
    position: 'relative',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1em',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    marginBottom: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  'backButton:hover': {
    backgroundColor: '#5a6268',
    transform: 'translateY(-2px)',
  },
  mainImage: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '15px',
    marginBottom: '30px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: '3.5em',
    marginBottom: '10px',
    fontWeight: '800',
    textShadow: '2px 2px 8px rgba(0,0,0,0.1)',
  },
  tagline: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '1.5em',
    marginBottom: '40px',
    fontStyle: 'italic',
  },
  divider: {
    border: '0',
    height: '1px',
    background: '#e0e0e0',
    margin: '40px 0',
  },
  sectionTitle: {
    color: '#34495e',
    fontSize: '2.2em',
    marginBottom: '20px',
    fontWeight: '700',
    borderLeft: '5px solid #3498db',
    paddingLeft: '15px',
  },
  sectionText: {
    fontSize: '1.1em',
    lineHeight: '1.8',
    color: '#555',
    marginBottom: '20px',
  },
  list: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
  },
  listItem: {
    backgroundColor: '#ecf0f1',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '1em',
    color: '#34495e',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  historicPlacesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    boxSizing: 'border-box',
    gap: '30px',
    marginTop: '20px',
  },
  historicPlaceCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    border: '1px solid #e0e6ed',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  'historicPlaceCard:hover': {
    transform: 'translateY(-5px)',
  },
  historicPlaceName: {
    fontSize: '1.4em',
    fontWeight: '600',
    color: '#34495e',
    marginBottom: '8px',
    marginTop: '0',
  },
  historicPlaceDescription: {
    fontSize: '0.95em',
    color: '#666',
    lineHeight: '1.5',
  },
  bookingLinksContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    marginTop: '30px',
  },
  bookingButton: {
    padding: '15px 25px',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 6px 20px rgba(52, 152, 219, 0.3)',
    textAlign: 'center',
    flex: '1 1 auto',
    maxWidth: '280px',
  },
  'bookingButton:hover': {
    backgroundColor: '#2980b9',
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 25px rgba(52, 152, 219, 0.4)',
  },
  loadingError: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 120px)',
    fontSize: '1.8em',
    color: '#3498db',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  spinner: {
    border: '8px solid #f3f3f3',
    borderTop: '8px solid #3498db',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  }
};

export default CityDetailPage;
