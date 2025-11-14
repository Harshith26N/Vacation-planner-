// frontend/src/pages/WelcomePage.jsx
import React from 'react';
import { useAuth } from '../AuthContext';

// --- Import your local images here ---
// Make sure these paths correctly point to your images
import himalayas from '../assets/himalayas.jpg';
import maldives from '../assets/maldives.jpg';
import rome from '../assets/rome.jpg';
import kyoto from '../assets/kyoto.jpg';
import sahara from '../assets/sahara.jpg';
import patagonia from '../assets/patagonia.jpg';

const WelcomePage = () => {
  const { user } = useAuth();

  // --- Inline Styles for a Sophisticated & Elegant Look ---

  const pageContainerStyle = {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f8f9fa',
    color: '#343a40',
    padding: '40px 20px',
    animation: 'fadeIn 1s ease-out',
  };

  const welcomeSectionStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    maxWidth: '900px',
    margin: '40px auto',
    position: 'relative',
    overflow: 'hidden',
  };

  const welcomeBgGradient = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(46, 204, 113, 0.1))',
    zIndex: 0,
  };

  const welcomeContentStyle = {
    position: 'relative',
    zIndex: 1,
  };

  const headingStyle = {
    color: '#28a745',
    fontSize: '3.5em',
    marginBottom: '15px',
    fontWeight: '700',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    letterSpacing: '-1px',
  };

  const subHeadingStyle = {
    fontSize: '1.8em',
    color: '#6c757d',
    marginBottom: '30px',
    maxWidth: '700px',
    margin: '0 auto 30px auto',
  };

  const sectionTitleStyle = {
    textAlign: 'center',
    fontSize: '2.5em',
    color: '#34495e',
    margin: '80px 0 40px 0',
    fontWeight: '600',
    borderBottom: '2px solid #3498db',
    display: 'inline-block',
    paddingBottom: '10px',
    textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
  };

  // --- Destination Gallery Styles --- (Unchanged)
  const galleryContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  };

  const galleryItemStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const galleryItemHoverStyle = {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 25px rgba(0,0,0,0.2)',
  };

  const galleryImageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderBottom: '1px solid #eee',
  };

  const galleryInfoStyle = {
    padding: '20px',
  };

  const galleryTitleStyle = {
    fontSize: '1.6em',
    color: '#34495e',
    marginBottom: '10px',
    fontWeight: 'bold',
  };

  const galleryDescriptionStyle = {
    fontSize: '0.95em',
    color: '#666',
    lineHeight: '1.5',
  };

  // --- User Review / Testimonial Styles ---
  // Container for the scrolling effect
  const marqueeWrapperStyle = {
    overflow: 'hidden', // Hide content overflowing horizontally
    whiteSpace: 'nowrap', // Prevent wrapping of testimonial cards
    maxWidth: '100%', // Ensure it respects parent width
    boxSizing: 'border-box', // Include padding and border in element's total width and height
    padding: '20px 0', // Some vertical padding
    backgroundColor: '#e9ecef', // Light grey background for the marquee section
    borderRadius: '12px',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
    margin: '0 auto',
  };

  const marqueeContentStyle = {
    display: 'inline-flex', // Allows cards to be side-by-side without wrapping
    animation: 'marquee-scroll linear infinite', // Apply the scrolling animation
    // Initial animation duration (will be calculated dynamically)
  };

  const testimonialCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    flexShrink: 0, // Prevent cards from shrinking
    width: '300px', // Fixed width for each card
    margin: '0 15px', // Spacing between cards
  };

  const testimonialCardHoverStyle = {
    transform: 'scale(1.03)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  };

  const quoteIconStyle = {
    fontSize: '3em',
    color: '#3498db',
    marginBottom: '15px',
  };

  const reviewTextStyle = {
    fontSize: '1.1em',
    color: '#444',
    lineHeight: '1.6',
    fontStyle: 'italic',
    marginBottom: '20px',
    whiteSpace: 'normal', // Allow text inside card to wrap
  };

  const reviewerNameStyle = {
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: '1.05em',
  };

  // --- Placeholder Data for Destinations and Reviews ---
  const destinationPics = [
    { id: 1, name: "Majestic Himalayas", image: himalayas, description: "Experience the awe-inspiring peaks and serene valleys, perfect for adventure or tranquil retreats." },
    { id: 2, name: "Tropical Maldives", image: maldives, description: "White sand beaches, crystal clear waters, and vibrant marine life await your ultimate relaxation." },
    { id: 3, name: "Historic Rome", image: rome, description: "Step back in time amidst ancient ruins, vibrant culture, and world-renowned culinary delights." },
    { id: 4, name: "Kyoto's Temples", image: kyoto, description: "Discover tranquility in ancient temples and beautiful gardens, a blend of tradition and natural beauty." },
    { id: 5, name: "Sahara Desert", image: sahara, description: "An unforgettable adventure under vast, starry skies, exploring the dramatic landscapes of the desert." },
    { id: 6, name: "Patagonia Trails", image: patagonia, description: "Rugged beauty and breathtaking landscapes for the adventurer, offering unparalleled hiking and scenic vistas." }
  ];

  const userReviews = [
    { id: 1, name: "Anjali Sharma, Mumbai", review: "This planner made organizing my European trip a breeze! The interface is so intuitive and beautiful. Highly recommend for any traveler." },
    { id: 2, name: "Rahul Singh, Delhi", review: "Absolutely loved the destination suggestions! Found a hidden gem in Southeast Asia I wouldn't have otherwise. A true smart companion." },
    { id: 3, name: "Priya Das, Bangalore", review: "The collaborative planning feature saved my group so much hassle. We could all contribute to the itinerary easily. Fantastic!" },
    { id: 4, name: "Vikram Reddy, Hyderabad", review: "The budget tracker is a lifesaver! Kept my finances in check during my backpacking trip across South America. Incredibly useful." },
    { id: 5, name: "Sneha Jain, Chennai", review: "From packing lists to document storage, this app truly covers every detail. It's like having a personal travel assistant." },
    { id: 6, name: "Amit Kumar, Kolkata", review: "Seamless experience! The recommendations were spot on and helped me discover local delights. A must-have for every trip." },
  ];

  // Duplicate reviews to create a continuous loop effect for the marquee
  const loopingReviews = [...userReviews, ...userReviews, ...userReviews]; // Duplicate multiple times for smooth loop

  return (
    <div style={pageContainerStyle}>
      {/* Global styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes marquee-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); } /* Scrolls half the content length for a loop */
        }
      `}</style>
      <div style={welcomeSectionStyle}>
        <div style={welcomeBgGradient}></div>
        <div style={welcomeContentStyle}>
          <h2 style={headingStyle}>Welcome, {user ? user.username : 'Traveler'}!</h2>
          <p style={subHeadingStyle}>
            Your passport to effortless travel planning. Explore, dream, discover – all in one place.
          </p>
        </div>
      </div>

      {/* About Traveling Section */}
      <h3 style={sectionTitleStyle}>Plan Your Perfect Escape</h3>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        maxWidth: '900px',
        margin: '40px auto',
        padding: '40px',
        lineHeight: '1.7',
        fontSize: '1.1em',
        color: '#444',
      }}>
        <p>
          At Smart Vacation Planner, we believe every journey should be as unique as you are. Whether you're a solo adventurer, a couple seeking romance, or a family on a fun-filled quest, our platform empowers you to design the perfect itinerary. From discovering breathtaking destinations to meticulously managing your budget and collaborating with travel companions, we've got you covered.
        </p>
        <p style={{ marginTop: '15px' }}>
          Dive into a world of possibilities, get personalized recommendations, and keep all your travel essentials in one secure place. Say goodbye to scattered notes and hello to seamless, joyful exploration. Your dream vacation starts here!
        </p>
      </div>

      {/* Destination Showcase */}
      <h3 style={sectionTitleStyle}>Explore Breathtaking Destinations</h3>
      <div style={galleryContainerStyle}>
        {destinationPics.map((dest) => (
          <div
            key={dest.id}
            style={galleryItemStyle}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, galleryItemHoverStyle)}
            onMouseOut={(e) => Object.assign(e.currentTarget.style, galleryItemStyle)}
          >
            <img src={dest.image} alt={dest.name} style={galleryImageStyle} />
            <div style={galleryInfoStyle}>
              <h4 style={galleryTitleStyle}>{dest.name}</h4>
              <p style={galleryDescriptionStyle}>{dest.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* User Reviews / Testimonials - Now with Marquee Effect */}
      <h3 style={sectionTitleStyle}>What Our Users Say</h3>
      <div style={marqueeWrapperStyle}>
        <div style={{
          ...marqueeContentStyle,
          // Calculate dynamic animation duration based on content length for consistent speed
          animationDuration: `${loopingReviews.length * 5}s`, // Adjust 5s per card for speed
        }}>
          {loopingReviews.map((review, index) => (
            <div
              key={`${review.id}-${index}`} // Use index in key for duplicated items
              style={testimonialCardStyle}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, testimonialCardHoverStyle)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, testimonialCardStyle)}
            >
              <span style={quoteIconStyle}>“</span>
              <p style={reviewTextStyle}>{review.review}</p>
              <p style={reviewerNameStyle}>- {review.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Small Call to Action (as dashboard is in header) */}
      <div style={{ textAlign: 'center', margin: '80px 0 40px 0' }}>
        <p style={{ fontSize: '1.4em', color: '#34495e' }}>Ready to plan your next journey? Head to your **Dashboard** through the navigation bar!</p>
      </div>
    </div>
  );
};

export default WelcomePage;