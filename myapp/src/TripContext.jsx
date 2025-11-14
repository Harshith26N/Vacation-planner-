// frontend/src/TripContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; // To get the current user ID

// Create the context
const TripContext = createContext(null);

// Custom hook to use the trip context
export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

// Provider component
export const TripProvider = ({ children }) => {
  const { user } = useAuth(); // Get current user from AuthContext
  const [trips, setTrips] = useState([]);
  const userId = user ? user.id : 'guest'; // Use 'guest' for unauthenticated users

  // Local Storage Key for trips
  const localStorageKeyTrips = `user_trips_${userId}`;

  // Load trips from localStorage on initial mount
  useEffect(() => {
    const savedTrips = localStorage.getItem(localStorageKeyTrips);
    if (savedTrips) {
      try {
        setTrips(JSON.parse(savedTrips));
      } catch (e) {
        console.error("Failed to parse saved trips from localStorage", e);
        setTrips([]);
      }
    } else {
      // For initial demonstration, populate with simulated trips if none exist
      // In a real app, this would be empty or fetched from a backend
      const SIMULATED_TRIPS = [
        {
          id: 'trip-1',
          name: 'Summer Europe Adventure',
          destination: 'Paris',
          destinationId: 'paris',
          startDate: '2025-08-10',
          endDate: '2025-08-25',
          status: 'Upcoming'
        },
        {
          id: 'trip-2',
          name: 'Beach Getaway to Goa',
          destination: 'Goa',
          destinationId: 'goa',
          startDate: '2025-09-01',
          endDate: '2025-09-07',
          status: 'Upcoming'
        },
        {
          id: 'trip-3',
          name: 'NYC Winter Break',
          destination: 'New York City',
          destinationId: 'new-york-city',
          startDate: '2024-12-20', // Past date
          endDate: '2024-12-27', // Past date
          status: 'Past'
        },
        {
          id: 'trip-4',
          name: 'Kyoto Cultural Tour',
          destination: 'Kyoto',
          destinationId: 'kyoto',
          startDate: '2024-05-10', // Past date
          endDate: '2024-05-17', // Past date
          status: 'Past'
        }
      ];
      setTrips(SIMULATED_TRIPS);
      localStorage.setItem(localStorageKeyTrips, JSON.stringify(SIMULATED_TRIPS));
    }
  }, [userId, localStorageKeyTrips]); // Re-load if user changes

  // Save trips to localStorage whenever they change
  useEffect(() => {
    // Only save if trips array is not empty (to avoid overwriting initial load with empty array)
    // and if it's not the initial render where SIMULATED_TRIPS might be set.
    // A more robust check might involve a flag or checking if trips were loaded from storage.
    if (trips.length > 0 || localStorage.getItem(localStorageKeyTrips)) {
        localStorage.setItem(localStorageKeyTrips, JSON.stringify(trips));
    }
  }, [trips, localStorageKeyTrips]);

  // Function to add a new trip
  const addTrip = useCallback((newTrip) => {
    setTrips(prevTrips => {
      const updatedTrips = [...prevTrips, { ...newTrip, id: `trip-${Date.now()}` }];
      return updatedTrips;
    });
  }, []);

  // Function to update a trip (e.g., change status from upcoming to past)
  const updateTrip = useCallback((tripId, updatedFields) => {
    setTrips(prevTrips => {
      return prevTrips.map(trip =>
        trip.id === tripId ? { ...trip, ...updatedFields } : trip
      );
    });
  }, []);

  // Function to delete a trip
  const deleteTrip = useCallback((tripId) => {
    setTrips(prevTrips => {
      return prevTrips.filter(trip => trip.id !== tripId);
    });
  }, []);

  return (
    <TripContext.Provider value={{ trips, addTrip, updateTrip, deleteTrip }}>
      {children}
    </TripContext.Provider>
  );
};
