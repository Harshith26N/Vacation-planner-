// frontend/src/pages/PackingSuggestionsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Assuming AuthContext provides user ID
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation

// Re-using the DETAILED_CITY_DATA for city names and adding common activities
const DETAILED_CITY_DATA = [
    {
        id: 'new-york-city',
        name: 'New York City',
        weatherCategory: 'temperate_mild_summer', // Adjusted for more common summer
        commonActivities: ['city_exploration', 'museums', 'nightlife', 'shopping', 'dining_out']
    },
    {
        id: 'bangkok',
        name: 'Bangkok',
        weatherCategory: 'hot_humid',
        commonActivities: ['city_exploration', 'temple_visits', 'street_food', 'markets', 'nightlife']
    },
    {
        id: 'paris',
        name: 'Paris',
        weatherCategory: 'temperate_mild_summer',
        commonActivities: ['city_exploration', 'museums', 'dining_out', 'romantic_walks', 'shopping']
    },
    {
        id: 'goa',
        name: 'Goa',
        weatherCategory: 'monsoon',
        commonActivities: ['beach_relax', 'water_sports', 'nightlife', 'sightseeing', 'dining_out']
    },
    {
        id: 'udaipur',
        name: 'Udaipur',
        weatherCategory: 'hot_dry',
        commonActivities: ['palace_visits', 'cultural_tours', 'boating', 'shopping', 'photography']
    },
    {
        id: 'leh-ladakh',
        name: 'Leh-Ladakh',
        weatherCategory: 'cold_dry_high_altitude',
        commonActivities: ['hiking', 'monastery_visits', 'adventure_sports', 'photography', 'spiritual_retreat']
    },
    {
        id: 'kyoto',
        name: 'Kyoto',
        weatherCategory: 'temperate_humid_summer',
        commonActivities: ['temple_visits', 'cultural_tours', 'garden_strolls', 'traditional_dining', 'photography']
    },
    {
        id: 'singapore',
        name: 'Singapore',
        weatherCategory: 'hot_humid',
        commonActivities: ['city_exploration', 'gardens', 'shopping', 'food_tours', 'nightlife']
    },
    {
        id: 'amritsar',
        name: 'Amritsar',
        weatherCategory: 'hot_dry',
        commonActivities: ['temple_visits', 'cultural_tours', 'food_tours', 'border_ceremony', 'shopping']
    },
    {
        id: 'rishikesh',
        name: 'Rishikesh',
        weatherCategory: 'temperate_monsoon',
        commonActivities: ['yoga_meditation', 'river_rafting', 'hiking', 'spiritual_retreat', 'adventure_sports']
    }
];

// --- Advanced Packing Rules Data ---
const PACKING_RULES = {
    // Base essentials, always included, quantity depends on duration for some
    baseEssentials: [
        { name: 'Passport/ID', quantity: 1, type: 'document' },
        { name: 'Wallet/Credit Cards', quantity: 1, type: 'document' },
        { name: 'Phone Charger & Power Bank', quantity: 1, type: 'electronics' },
        { name: 'Universal Travel Adapter', quantity: 1, type: 'electronics' },
        { name: 'Basic Toiletries', quantity: 1, type: 'personal' },
        { name: 'Medications (if any)', quantity: 1, type: 'personal' },
        { name: 'Reusable Water Bottle', quantity: 1, type: 'general' },
        { name: 'Daypack/Small Backpack', quantity: 1, type: 'general' },
        { name: 'Travel Insurance Documents', quantity: 1, type: 'document' },
        { name: 'Underwear', quantityPerDay: 1, type: 'clothing' },
        { name: 'Socks', quantityPerDay: 1, type: 'clothing' },
        { name: 'Pajamas', quantity: 1, type: 'clothing' },
    ],
    // Weather-based suggestions (per day or fixed quantity)
    weather: {
        'warm_humid': [
            { name: 'Lightweight T-shirts', quantityPerDay: 1, type: 'clothing' },
            { name: 'Shorts/Skirts', quantityPerDay: 0.5, type: 'clothing' },
            { name: 'Light trousers/dresses', quantityPerDay: 0.5, type: 'clothing' },
            { name: 'Sunscreen (high SPF)', quantity: 1, type: 'personal' },
            { name: 'Hat or Cap', quantity: 1, type: 'accessory' },
            { name: 'Sunglasses', quantity: 1, type: 'accessory' },
            { name: 'Insect Repellent', quantity: 1, type: 'personal' },
            { name: 'Small Umbrella/Light Rain Jacket', quantity: 1, type: 'clothing' },
            { name: 'Comfortable Sandals/Flip-flops', quantity: 1, type: 'footwear' },
        ],
        'hot_dry': [
            { name: 'Light, breathable tops', quantityPerDay: 1, type: 'clothing' },
            { name: 'Loose-fitting trousers/shorts', quantityPerDay: 0.5, type: 'clothing' },
            { name: 'Sunscreen (high SPF)', quantity: 1, type: 'personal' },
            { name: 'Wide-brimmed Hat', quantity: 1, type: 'accessory' },
            { name: 'Sunglasses', quantity: 1, type: 'accessory' },
            { name: 'Lip Balm with SPF', quantity: 1, type: 'personal' },
            { name: 'Comfortable Walking Shoes', quantity: 1, type: 'footwear' },
        ],
        'temperate_mild_summer': [
            { name: 'T-shirts/Light tops', quantityPerDay: 1, type: 'clothing' },
            { name: 'Jeans/Trousers/Shorts', quantityPerDay: 0.5, type: 'clothing' },
            { name: 'Light Jacket/Cardigan', quantity: 1, type: 'clothing' },
            { name: 'Comfortable Walking Shoes', quantity: 1, type: 'footwear' },
            { name: 'Small Umbrella', quantity: 1, type: 'accessory' },
        ],
        'hot_humid': [
            { name: 'Very Lightweight & Moisture-Wicking Clothes', quantityPerDay: 1.5, type: 'clothing' },
            { name: 'Sunscreen & After-Sun Lotion', quantity: 1, type: 'personal' },
            { name: 'Hat & Sunglasses', quantity: 1, type: 'accessory' },
            { name: 'Strong Insect Repellent', quantity: 1, type: 'personal' },
            { name: 'Light Rain Jacket/Umbrella', quantity: 1, type: 'clothing' },
            { name: 'Quick-Dry Towel', quantity: 1, type: 'general' },
            { name: 'Sandals & Breathable Shoes', quantity: 1, type: 'footwear' },
        ],
        'monsoon': [
            { name: 'Waterproof Jacket', quantity: 1, type: 'clothing' },
            { name: 'Waterproof Bags/Covers for Electronics', quantity: 1, type: 'general' },
            { name: 'Quick-Drying Clothes (synthetics)', quantityPerDay: 1.5, type: 'clothing' },
            { name: 'Waterproof Footwear (e.g., Crocs, Sandals)', quantity: 1, type: 'footwear' },
            { name: 'Insect Repellent', quantity: 1, type: 'personal' },
            { name: 'Light Cardigan (for AC)', quantity: 1, type: 'clothing' },
            { name: 'Basic First-Aid Kit', quantity: 1, type: 'personal' },
        ],
        'cold_dry_high_altitude': [
            { name: 'Thermal Base Layers', quantity: 2, type: 'clothing' },
            { name: 'Fleece Jacket', quantity: 1, type: 'clothing' },
            { name: 'Down Jacket', quantity: 1, type: 'clothing' },
            { name: 'Woolen Socks', quantityPerDay: 0.5, type: 'clothing' },
            { name: 'Warm Gloves', quantity: 1, type: 'accessory' },
            { name: 'Warm Hat/Ear Covering', quantity: 1, type: 'accessory' },
            { name: 'High SPF Sunscreen & Lip Balm', quantity: 1, type: 'personal' },
            { name: 'Sturdy, Waterproof Hiking Boots', quantity: 1, type: 'footwear' },
            { name: 'Altitude Sickness Medication (consult doctor)', quantity: 1, type: 'personal' },
        ],
        'temperate_humid_summer': [
            { name: 'Light Cotton Clothes', quantityPerDay: 1, type: 'clothing' },
            { name: 'Comfortable Walking Shoes', quantity: 1, type: 'footwear' },
            { name: 'Light Jacket or Sweater (evenings/AC)', quantity: 1, type: 'clothing' },
            { name: 'Compact Umbrella/Rain Poncho', quantity: 1, type: 'accessory' },
            { name: 'Insect Repellent', quantity: 1, type: 'personal' },
        ],
        'default': [ // Fallback if weatherCategory is missing or unrecognized
            { name: 'Casual Clothes', quantityPerDay: 1, type: 'clothing' },
            { name: 'Comfortable Shoes', quantity: 1, type: 'footwear' },
            { name: 'Basic Toiletries', quantity: 1, type: 'personal' },
        ]
    },
    // Activity-based suggestions (fixed quantity)
    activities: {
        'city_exploration': [
            { name: 'Comfortable Walking Shoes (extra pair)', quantity: 1, type: 'footwear' },
            { name: 'Small Crossbody Bag/Fanny Pack', quantity: 1, type: 'general' },
            { name: 'Portable Phone Charger', quantity: 1, type: 'electronics' },
        ],
        'museums': [
            { name: 'Light Sweater/Cardigan (for AC)', quantity: 1, type: 'clothing' },
            { name: 'Small Notebook & Pen', quantity: 1, type: 'general' },
        ],
        'nightlife': [
            { name: 'Dressy Outfit', quantity: 1, type: 'clothing' },
            { name: 'Stylish Shoes', quantity: 1, type: 'footwear' },
        ],
        'beach_relax': [
            { name: 'Swimsuit/Trunks', quantity: 2, type: 'clothing' },
            { name: 'Beach Towel', quantity: 1, type: 'general' },
            { name: 'Sun Hat', quantity: 1, type: 'accessory' },
            { name: 'Beach Bag', quantity: 1, type: 'general' },
            { name: 'Flip-flops/Sandals', quantity: 1, type: 'footwear' },
        ],
        'water_sports': [
            { name: 'Extra Swimsuit', quantity: 1, type: 'clothing' },
            { name: 'Rash Guard', quantity: 1, type: 'clothing' },
            { name: 'Waterproof Phone Pouch', quantity: 1, type: 'electronics' },
        ],
        'hiking': [
            { name: 'Hiking Boots/Shoes', quantity: 1, type: 'footwear' },
            { name: 'Hiking Socks', quantityPerDay: 0.5, type: 'clothing' },
            { name: 'Moisture-Wicking Clothes', quantityPerDay: 1, type: 'clothing' },
            { name: 'Small Backpack (for day hikes)', quantity: 1, type: 'general' },
            { name: 'First-Aid Kit', quantity: 1, type: 'personal' },
            { name: 'Headlamp/Flashlight', quantity: 1, type: 'electronics' },
        ],
        'photography': [
            { name: 'Camera & Lenses', quantity: 1, type: 'electronics' },
            { name: 'Extra Camera Batteries', quantity: 2, type: 'electronics' },
            { name: 'Memory Cards', quantity: 2, type: 'electronics' },
            { name: 'Tripod (if needed)', quantity: 1, type: 'general' },
        ],
        'yoga_meditation': [
            { name: 'Yoga Mat (travel-friendly)', quantity: 1, type: 'general' },
            { name: 'Comfortable Yoga Clothes', quantityPerDay: 0.5, type: 'clothing' },
        ],
        'river_rafting': [
            { name: 'Quick-Dry Shorts/Swim Trunks', quantity: 1, type: 'clothing' },
            { name: 'Water Shoes', quantity: 1, type: 'footwear' },
            { name: 'Waterproof Bag (for valuables)', quantity: 1, type: 'general' },
        ],
        'cultural_tours': [
            { name: 'Modest Clothing (shoulders/knees covered)', quantity: 1, type: 'clothing' },
            { name: 'Scarf (for temple visits)', quantity: 1, type: 'accessory' },
        ],
        'dining_out': [
            { name: 'Smart Casual Outfit', quantity: 1, type: 'clothing' },
            { name: 'Comfortable Dress Shoes', quantity: 1, type: 'footwear' },
        ],
        'romantic_walks': [
            { name: 'Comfortable yet Stylish Shoes', quantity: 1, type: 'footwear' },
        ],
        'street_food': [
            { name: 'Hand Sanitizer', quantity: 1, type: 'personal' },
            { name: 'Wet Wipes', quantity: 1, type: 'personal' },
        ],
        'markets': [
            { name: 'Reusable Shopping Bag', quantity: 1, type: 'general' },
            { name: 'Cash (local currency)', quantity: 1, type: 'document' },
        ],
        'palace_visits': [
            { name: 'Comfortable Walking Shoes', quantity: 1, type: 'footwear' },
            { name: 'Sunscreen & Hat', quantity: 1, type: 'personal' },
        ],
        'boating': [
            { name: 'Light Jacket/Windbreaker', quantity: 1, type: 'clothing' },
            { name: 'Sunscreen & Hat', quantity: 1, type: 'personal' },
        ],
        'border_ceremony': [
            { name: 'Hat/Cap (for sun)', quantity: 1, type: 'accessory' },
            { name: 'Water Bottle', quantity: 1, type: 'general' },
        ],
        'temple_visits': [
            { name: 'Modest Clothing (shoulders/knees covered)', quantity: 1, type: 'clothing' },
            { name: 'Socks (if shoes must be removed)', quantity: 1, type: 'clothing' },
        ],
        'garden_strolls': [
            { name: 'Comfortable Walking Shoes', quantity: 1, type: 'footwear' },
            { name: 'Light Jacket/Cardigan', quantity: 1, type: 'clothing' },
        ],
        'traditional_dining': [
            { name: 'Smart Casual Outfit', quantity: 1, type: 'clothing' },
        ],
        'adventure_sports': [
            { name: 'Durable Sportswear', quantityPerDay: 0.5, type: 'clothing' },
            { name: 'Action Camera', quantity: 1, type: 'electronics' },
            { name: 'Waterproof Bag (large)', quantity: 1, type: 'general' },
        ],
        'spiritual_retreat': [
            { name: 'Loose, Comfortable Clothing', quantityPerDay: 1, type: 'clothing' },
            { name: 'Journal & Pen', quantity: 1, type: 'general' },
        ],
        'shopping': [
            { name: 'Extra Foldable Bag', quantity: 1, type: 'general' },
            { name: 'Comfortable Walking Shoes', quantity: 1, type: 'footwear' },
        ],
        'food_tours': [
            { name: 'Antacids/Digestion Aids', quantity: 1, type: 'personal' },
            { name: 'Comfortable Walking Shoes', quantity: 1, type: 'footwear' },
        ]
    },
    // Travel style specific items/multipliers
    travelStyle: {
        'standard': { multiplier: 1, items: [] },
        'minimalist': {
            multiplier: 0.7, // Reduce quantities for some items
            items: [
                { name: 'Multi-purpose Soap', quantity: 1, type: 'personal' },
                { name: 'Microfiber Towel', quantity: 1, type: 'personal' },
                { name: 'Compact First Aid Kit', quantity: 1, type: 'personal' },
            ]
        },
        'luxury': {
            multiplier: 1.2, // Slightly increase quantities for some items (e.g., more outfit changes)
            items: [
                { name: 'Formal Wear (dress/suit)', quantity: 1, type: 'clothing' },
                { name: 'Jewelry/Accessories', quantity: 1, type: 'accessory' },
                { name: 'High-end Skincare/Cosmetics', quantity: 1, type: 'personal' },
                { name: 'Noise-Cancelling Headphones', quantity: 1, type: 'electronics' },
            ]
        },
        'adventurous': {
            multiplier: 1,
            items: [
                { name: 'Durable Backpack', quantity: 1, type: 'general' },
                { name: 'Headlamp/Flashlight (extra)', quantity: 1, type: 'electronics' },
                { name: 'Multi-tool', quantity: 1, type: 'general' },
                { name: 'Water Purification Tablets/Filter', quantity: 1, type: 'personal' },
            ]
        },
    },
    // Trip purpose specific items
    tripPurpose: {
        'leisure': [], // No specific items, covered by other categories
        'business': [
            { name: 'Business Attire (shirts, trousers/skirts)', quantityPerDay: 0.5, type: 'clothing' },
            { name: 'Blazer/Suit Jacket', quantity: 1, type: 'clothing' },
            { name: 'Laptop & Charger', quantity: 1, type: 'electronics' },
            { name: 'Portable Projector (if needed)', quantity: 1, type: 'electronics' },
            { name: 'Business Cards', quantity: 1, type: 'document' },
            { name: 'Notebook & Professional Pen', quantity: 1, type: 'general' },
        ],
        'family': [
            { name: 'Kids Snacks', quantity: 1, type: 'food' },
            { name: 'Child Medications', quantity: 1, type: 'personal' },
            { name: 'Small Toys/Books', quantity: 1, type: 'general' },
            { name: 'Baby Wipes/Diapers (if applicable)', quantity: 1, type: 'personal' },
            { name: 'Stroller/Baby Carrier', quantity: 1, type: 'general' },
        ],
    }
};

const PackingSuggestionsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Get current user from AuthContext

    const [selectedCityId, setSelectedCityId] = useState('');
    const [tripDuration, setTripDuration] = useState(3); // Default to 3 days
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [travelStyle, setTravelStyle] = useState('standard'); // New: Travel Style
    const [tripPurpose, setTripPurpose] = useState('leisure'); // New: Trip Purpose
    const [generatedPackingList, setGeneratedPackingList] = useState([]);
    const [customItemName, setCustomItemName] = useState('');
    const [customItemQuantity, setCustomItemQuantity] = useState(1);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'packed', 'unpacked'
    const [sortBy, setSortBy] = useState('type'); // 'name', 'type'

    // For custom alerts/confirmations
    const [infoMessage, setInfoMessage] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(null);


    // Unique key for localStorage based on user ID and selected city
    const userId = user ? user.id : 'guest';
    const localStorageKeyPackingList = `packing_list_${userId}_${selectedCityId}`;

    // Get the city data for the dropdown
    const cities = DETAILED_CITY_DATA.map(city => ({ id: city.id, name: city.name }));

    // Load packing list from localStorage when city or user changes
    useEffect(() => {
        if (selectedCityId) {
            const savedList = localStorage.getItem(localStorageKeyPackingList);
            if (savedList) {
                try {
                    setGeneratedPackingList(JSON.parse(savedList));
                } catch (e) {
                    console.error("Failed to parse saved packing list from localStorage", e);
                    setGeneratedPackingList([]);
                }
            } else {
                setGeneratedPackingList([]); // Clear if no saved list for this city
            }
        }
    }, [selectedCityId, localStorageKeyPackingList]);

    // Save packing list to localStorage whenever it changes
    useEffect(() => {
        if (selectedCityId && generatedPackingList.length > 0) {
            localStorage.setItem(localStorageKeyPackingList, JSON.stringify(generatedPackingList));
        } else if (selectedCityId && generatedPackingList.length === 0) {
            // If list becomes empty, remove it from local storage
            localStorage.removeItem(localStorageKeyPackingList);
        }
    }, [generatedPackingList, selectedCityId, localStorageKeyPackingList]);


    const handleGenerateList = () => {
        if (!selectedCityId || tripDuration <= 0) {
            setInfoMessage('Please select a city and a valid trip duration.');
            return;
        }

        const city = DETAILED_CITY_DATA.find(c => c.id === selectedCityId);
        if (!city) {
            setInfoMessage('Selected city data not found.');
            return;
        }

        let newPackingList = [...PACKING_RULES.baseEssentials];
        const styleMultiplier = PACKING_RULES.travelStyle[travelStyle]?.multiplier || 1;

        // Add weather-based items
        const weatherCat = city.weatherCategory || 'default';
        const weatherItems = PACKING_RULES.weather[weatherCat] || PACKING_RULES.weather['default'];
        weatherItems.forEach(item => {
            const quantity = item.quantity || Math.ceil(tripDuration * (item.quantityPerDay || 0) * styleMultiplier);
            if (quantity > 0) {
                newPackingList.push({ ...item, quantity: quantity });
            }
        });

        // Add activity-based items
        selectedActivities.forEach(activity => {
            const activityItems = PACKING_RULES.activities[activity];
            if (activityItems) {
                activityItems.forEach(item => {
                    const quantity = item.quantity || Math.ceil(tripDuration * (item.quantityPerDay || 0) * styleMultiplier);
                    if (quantity > 0) {
                        newPackingList.push({ ...item, quantity: quantity });
                    }
                });
            }
        });

        // Add travel style specific items
        const styleSpecificItems = PACKING_RULES.travelStyle[travelStyle]?.items || [];
        styleSpecificItems.forEach(item => {
            const quantity = item.quantity || Math.ceil(tripDuration * (item.quantityPerDay || 0) * styleMultiplier);
            if (quantity > 0) {
                newPackingList.push({ ...item, quantity: quantity });
            }
        });

        // Add trip purpose specific items
        const purposeSpecificItems = PACKING_RULES.tripPurpose[tripPurpose] || [];
        purposeSpecificItems.forEach(item => {
            const quantity = item.quantity || Math.ceil(tripDuration * (item.quantityPerDay || 0) * styleMultiplier);
            if (quantity > 0) {
                newPackingList.push({ ...item, quantity: quantity });
            }
        });


        // Remove duplicates and consolidate quantities if any
        const consolidatedList = {};
        newPackingList.forEach(item => {
            if (consolidatedList[item.name]) {
                consolidatedList[item.name].quantity = Math.max(consolidatedList[item.name].quantity, item.quantity);
            } else {
                consolidatedList[item.name] = { ...item, packed: false }; // Add packed status
            }
        });

        setGeneratedPackingList(Object.values(consolidatedList));
        setInfoMessage('Packing list generated successfully!');
    };

    const handleTogglePacked = (index) => {
        const updatedList = [...generatedPackingList];
        updatedList[index].packed = !updatedList[index].packed;
        setGeneratedPackingList(updatedList);
    };

    const handleUpdateQuantity = (index, newQuantity) => {
        const updatedList = [...generatedPackingList];
        updatedList[index].quantity = Math.max(1, parseInt(newQuantity) || 1); // Ensure quantity is at least 1
        setGeneratedPackingList(updatedList);
    };

    const handleAddCustomItem = () => {
        if (customItemName.trim()) {
            setGeneratedPackingList([
                ...generatedPackingList,
                { name: customItemName.trim(), packed: false, quantity: parseInt(customItemQuantity) || 1, type: 'custom' }
            ]);
            setCustomItemName('');
            setCustomItemQuantity(1);
            setInfoMessage('Custom item added!');
        } else {
            setInfoMessage('Please enter a name for the custom item.');
        }
    };

    const handleDeleteItem = (index) => {
        const updatedList = generatedPackingList.filter((_, i) => i !== index);
        setGeneratedPackingList(updatedList);
        setInfoMessage('Item deleted.');
    };

    const handleClearList = () => {
        setConfirmMessage('Are you sure you want to clear your current packing list? This cannot be undone.');
        setConfirmAction(() => () => {
            setGeneratedPackingList([]);
            localStorage.removeItem(localStorageKeyPackingList);
            setInfoMessage('Packing list cleared.');
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };

    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction();
        }
    };

    const handleCancelConfirm = () => {
        setShowConfirmModal(false);
        setConfirmAction(null);
        setConfirmMessage('');
    };

    // Get available activities for the selected city
    const currentCity = DETAILED_CITY_DATA.find(c => c.id === selectedCityId);
    const availableActivities = currentCity ? currentCity.commonActivities : [];

    // Filter and sort the packing list
    const filteredAndSortedList = useMemo(() => {
        let list = [...generatedPackingList];

        // Filter
        if (filterStatus === 'packed') {
            list = list.filter(item => item.packed);
        } else if (filterStatus === 'unpacked') {
            list = list.filter(item => !item.packed);
        }

        // Sort
        if (sortBy === 'name') {
            list.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'type') {
            list.sort((a, b) => {
                const typeOrder = ['document', 'clothing', 'footwear', 'personal', 'electronics', 'accessory', 'general', 'food', 'custom'];
                const typeA = typeOrder.indexOf(a.type);
                const typeB = typeOrder.indexOf(b.type);
                if (typeA === typeB) {
                    return a.name.localeCompare(b.name);
                }
                return typeA - typeB;
            });
        }
        return list;
    }, [generatedPackingList, filterStatus, sortBy]);

    // Group items by type for display
    const groupedPackingList = useMemo(() => {
        return filteredAndSortedList.reduce((acc, item) => {
            const type = item.type.charAt(0).toUpperCase() + item.type.slice(1); // Capitalize first letter
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(item);
            return acc;
        }, {});
    }, [filteredAndSortedList]);


    // --- PDF Generation ---
    const handlePrintPdf = () => {
        const doc = new jsPDF();
        let yPos = 20;

        doc.setFontSize(22);
        doc.text("Your Packing List Summary", 105, yPos, { align: "center" });
        yPos += 15;

        doc.setFontSize(14);
        doc.text("Trip Details:", 15, yPos);
        yPos += 8;
        doc.setFontSize(12);
        doc.text(`Destination: ${currentCity?.name || 'N/A'}`, 20, yPos);
        yPos += 7;
        doc.text(`Duration: ${tripDuration} days`, 20, yPos);
        yPos += 7;
        doc.text(`Travel Style: ${travelStyle.charAt(0).toUpperCase() + travelStyle.slice(1)}`, 20, yPos);
        yPos += 7;
        doc.text(`Trip Purpose: ${tripPurpose.charAt(0).toUpperCase() + tripPurpose.slice(1)}`, 20, yPos);
        yPos += 7;
        doc.text(`Selected Activities: ${selectedActivities.map(a => a.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())).join(', ') || 'None'}`, 20, yPos);
        yPos += 15;

        doc.setFontSize(14);
        doc.text("Packing List:", 15, yPos);
        yPos += 8;

        const typesOrderForPdf = ['Document', 'Clothing', 'Footwear', 'Personal', 'Electronics', 'Accessory', 'General', 'Food', 'Custom'];

        typesOrderForPdf.forEach(type => {
            if (groupedPackingList[type] && groupedPackingList[type].length > 0) {
                doc.setFontSize(12);
                doc.text(`${type} Items:`, 20, yPos);
                yPos += 7;
                groupedPackingList[type].forEach(item => {
                    doc.setFontSize(10);
                    const packedStatus = item.packed ? '(Packed)' : '(Unpacked)';
                    doc.text(`- ${item.name} (Qty: ${item.quantity}) ${packedStatus}`, 25, yPos);
                    yPos += 6;
                    if (yPos > 280) { // Check for page overflow
                        doc.addPage();
                        yPos = 20;
                    }
                });
                yPos += 5; // Small gap between categories
            }
        });

        doc.save('PackingListSummary.pdf');
        setInfoMessage('Packing list exported to PDF.');
    };


    // Styles
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
            maxWidth: '900px',
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
        title: {
            textAlign: 'center',
            color: '#2c3e50',
            fontSize: '3em',
            marginBottom: '30px',
            fontWeight: '700',
            textShadow: '1px 1px 5px rgba(0,0,0,0.08)',
        },
        sectionTitle: {
            color: '#34495e',
            fontSize: '2em',
            marginBottom: '20px',
            fontWeight: '600',
            borderLeft: '5px solid #3498db',
            paddingLeft: '15px',
            marginTop: '40px',
        },
        inputGroup: {
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            alignItems: 'center',
        },
        selectField: {
            flex: '1 1 200px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1em',
            backgroundColor: 'white',
        },
        numberInput: {
            width: '80px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1em',
            textAlign: 'center',
        },
        button: {
            padding: '12px 25px',
            backgroundColor: '#6f42c1', // Purple for packing list
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1em',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        packingListDisplay: {
            backgroundColor: '#fefefe',
            padding: '25px',
            borderRadius: '10px',
            border: '1px solid #e0e6ed',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            marginTop: '20px',
        },
        packingListItem: {
            backgroundColor: '#ecf0f1',
            padding: '12px 18px',
            marginBottom: '10px',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            transition: 'background-color 0.2s ease',
        },
        packedItem: {
            textDecoration: 'line-through',
            color: '#7f8c8d',
            backgroundColor: '#dce4e6',
        },
        checkbox: {
            marginRight: '10px',
            transform: 'scale(1.2)',
            cursor: 'pointer',
        },
        itemText: {
            flexGrow: 1,
            fontSize: '1em',
            color: '#34495e',
        },
        quantityInput: {
            width: '50px',
            padding: '5px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '0.9em',
            textAlign: 'center',
            margin: '0 10px',
        },
        deleteItemButton: {
            background: 'none',
            border: 'none',
            color: '#dc3545',
            fontSize: '1.3em',
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '50%',
            transition: 'background-color 0.2s ease, color 0.2s ease',
            marginLeft: '10px',
        },
        'deleteItemButton:hover': {
            backgroundColor: '#dc3545',
            color: 'white',
        },
        customItemInput: {
            flex: '1 1 200px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1em',
        },
        addCustomButton: {
            padding: '12px 25px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1em',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        clearListButton: {
            padding: '10px 20px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9em',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            marginTop: '30px',
        },
        activityCheckboxGroup: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            marginTop: '15px',
            marginBottom: '20px',
            padding: '10px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#fcfcfc',
        },
        activityCheckbox: {
            marginRight: '5px',
            transform: 'scale(1.1)',
            cursor: 'pointer',
        },
        activityLabel: {
            fontSize: '0.95em',
            color: '#555',
            display: 'flex',
            alignItems: 'center',
        },
        '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
        },
        alertMessage: {
            backgroundColor: '#ffe0b2', // Light orange
            color: '#e65100', // Dark orange text
            padding: '10px 15px',
            borderRadius: '8px',
            marginBottom: '15px',
            fontSize: '0.9em',
            fontWeight: 'bold',
            border: '1px solid #ffcc80',
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        modalContent: {
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            textAlign: 'center',
            maxWidth: '400px',
            width: '90%',
        },
        modalButton: {
            padding: '10px 20px',
            margin: '0 10px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
        },
        modalConfirmButton: {
            backgroundColor: '#dc3545',
            color: 'white',
        },
        modalCancelButton: {
            backgroundColor: '#6c757d',
            color: 'white',
        },
        filterSortGroup: {
            display: 'flex',
            gap: '15px',
            marginBottom: '20px',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
        },
        filterSortLabel: {
            fontWeight: 'bold',
            color: '#555',
            fontSize: '0.95em',
        }
    };

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <div style={styles.card}>
                <button onClick={() => navigate(-1)} style={styles.backButton}>&larr; Back to Dashboard</button>
                <h1 style={styles.title}>Smart Packing Suggestions</h1>

                {infoMessage && (
                    <p style={styles.alertMessage}>{infoMessage}</p>
                )}

                <section>
                    <h2 style={styles.sectionTitle}>Generate Packing List</h2>
                    <div style={styles.inputGroup}>
                        <select
                            value={selectedCityId}
                            onChange={(e) => {
                                setSelectedCityId(e.target.value);
                                setGeneratedPackingList([]); // Clear list on city change
                                setSelectedActivities([]); // Clear activities on city change
                            }}
                            style={styles.selectField}
                        >
                            <option value="">Select a city</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Trip Duration (days)"
                            value={tripDuration}
                            onChange={(e) => setTripDuration(parseInt(e.target.value) || 0)}
                            style={styles.numberInput}
                            min="1"
                        />
                        <select
                            value={travelStyle}
                            onChange={(e) => setTravelStyle(e.target.value)}
                            style={styles.selectField}
                        >
                            <option value="standard">Standard Style</option>
                            <option value="minimalist">Minimalist Style</option>
                            <option value="luxury">Luxury Style</option>
                            <option value="adventurous">Adventurous Style</option>
                        </select>
                        <select
                            value={tripPurpose}
                            onChange={(e) => setTripPurpose(e.target.value)}
                            style={styles.selectField}
                        >
                            <option value="leisure">Leisure Trip</option>
                            <option value="business">Business Trip</option>
                            <option value="family">Family Trip</option>
                        </select>
                        <button onClick={handleGenerateList} style={styles.button}>Generate List</button>
                    </div>

                    {selectedCityId && availableActivities.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ ...styles.sectionTitle, fontSize: '1.2em', borderLeft: '3px solid #3498db', paddingLeft: '10px', marginTop: '15px' }}>
                                Select Activities for {currentCity?.name}:
                            </h3>
                            <div style={styles.activityCheckboxGroup}>
                                {availableActivities.map(activity => (
                                    <label key={activity} style={styles.activityLabel}>
                                        <input
                                            type="checkbox"
                                            value={activity}
                                            checked={selectedActivities.includes(activity)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedActivities([...selectedActivities, activity]);
                                                } else {
                                                    setSelectedActivities(selectedActivities.filter(a => a !== activity));
                                                }
                                            }}
                                            style={styles.activityCheckbox}
                                        />
                                        {activity.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())} {/* Format activity name */}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {generatedPackingList.length > 0 && (
                    <section style={styles.packingListDisplay}>
                        <h2 style={styles.sectionTitle}>Your Packing List</h2>

                        <div style={styles.filterSortGroup}>
                            <span style={styles.filterSortLabel}>Filter:</span>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={styles.selectField}>
                                <option value="all">All Items</option>
                                <option value="packed">Packed Items</option>
                                <option value="unpacked">Unpacked Items</option>
                            </select>

                            <span style={styles.filterSortLabel}>Sort By:</span>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.selectField}>
                                <option value="type">Category</option>
                                <option value="name">Name</option>
                            </select>
                        </div>

                        {Object.keys(groupedPackingList).length > 0 ? (
                            Object.entries(groupedPackingList).map(([type, items]) => (
                                <div key={type} style={{ marginBottom: '20px' }}>
                                    <h3 style={{ ...styles.subSectionTitle, marginTop: '10px', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>{type}</h3>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {items.map((item, index) => (
                                            <li key={item.name} style={{ ...styles.packingListItem, ...(item.packed ? styles.packedItem : {}) }}>
                                                <input
                                                    type="checkbox"
                                                    checked={item.packed}
                                                    onChange={() => handleTogglePacked(generatedPackingList.findIndex(li => li.name === item.name))} // Find original index
                                                    style={styles.checkbox}
                                                />
                                                <span style={styles.itemText}>{item.name}</span>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleUpdateQuantity(generatedPackingList.findIndex(li => li.name === item.name), e.target.value)} // Find original index
                                                    style={styles.quantityInput}
                                                    min="1"
                                                />
                                                <button onClick={() => handleDeleteItem(generatedPackingList.findIndex(li => li.name === item.name))} style={styles.deleteItemButton}>&times;</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#777' }}>No items match your current filter/sort criteria.</p>
                        )}


                        <h3 style={{ ...styles.sectionTitle, fontSize: '1.4em', borderLeft: '3px solid #007bff', paddingLeft: '10px', marginTop: '25px' }}>Add Custom Item</h3>
                        <div style={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder="e.g., Favorite book"
                                value={customItemName}
                                onChange={(e) => setCustomItemName(e.target.value)}
                                style={styles.customItemInput}
                            />
                            <input
                                type="number"
                                placeholder="Qty"
                                value={customItemQuantity}
                                onChange={(e) => setCustomItemQuantity(parseInt(e.target.value) || 1)}
                                style={{ ...styles.numberInput, width: '60px' }}
                                min="1"
                            />
                            <button onClick={handleAddCustomItem} style={styles.addCustomButton}>Add Item</button>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <button onClick={handleClearList} style={styles.clearListButton}>Clear Packing List</button>
                            <button
                                onClick={handlePrintPdf}
                                style={{ ...styles.button, backgroundColor: '#6c757d', marginLeft: '15px' }}
                            >
                                Print Packing List to PDF
                            </button>
                        </div>
                    </section>
                )}
            </div>

            {showConfirmModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <p>{confirmMessage}</p>
                        <button
                            onClick={handleConfirm}
                            style={{ ...styles.modalButton, ...styles.modalConfirmButton }}
                        >
                            Yes
                        </button>
                        <button
                            onClick={handleCancelConfirm}
                            style={{ ...styles.modalButton, ...styles.modalCancelButton }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PackingSuggestionsPage;
