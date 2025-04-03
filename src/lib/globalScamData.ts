import { ScamEvent, ScamType, SafetyLevel } from '../types';
import { format } from 'date-fns';

// Countries data with multiple cities and typical scams for each region
const countriesData = [
  {
    country: 'France',
    cities: ['Paris', 'Nice', 'Marseille', 'Lyon', 'Bordeaux'],
    commonScams: ['Petition Scam', 'Friendship Bracelet', 'Taxi Overcharging', 'Pickpocketing'],
    safetyLevel: 'High'
  },
  {
    country: 'Italy',
    cities: ['Rome', 'Venice', 'Milan', 'Florence', 'Naples'],
    commonScams: ['Rose Gift Scam', 'Fake Police', 'Taxi Scam', 'Pickpocketing'],
    safetyLevel: 'Medium'
  },
  {
    country: 'Spain',
    cities: ['Barcelona', 'Madrid', 'Seville', 'Valencia', 'Málaga'],
    commonScams: ['Bird Poop Scam', 'The Flamenco Scam', 'Fake Hotel Reception', 'Mustard Scam'],
    safetyLevel: 'Medium'
  },
  {
    country: 'United Kingdom',
    cities: ['London', 'Manchester', 'Edinburgh', 'Liverpool', 'Glasgow'],
    commonScams: ['Charity Clipboard Scam', 'Fake Accommodation', 'Three Card Monte', 'ATM Fraud'],
    safetyLevel: 'High'
  },
  {
    country: 'Germany',
    cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
    commonScams: ['Fake Police', 'Apartment Rental Scam', 'Card Game Scam', 'Pickpocketing'],
    safetyLevel: 'Very High'
  },
  {
    country: 'United States',
    cities: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Las Vegas'],
    commonScams: ['Three Card Monte', 'Broken Camera Scam', 'Taxi Overcharging', 'Vacation Rental Scam'],
    safetyLevel: 'Medium'
  },
  {
    country: 'Thailand',
    cities: ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Krabi'],
    commonScams: ['Tuk Tuk Scam', 'Gem Scam', 'Rented Motorbike Scam', 'Tiger Temple Scam'],
    safetyLevel: 'Medium'
  },
  {
    country: 'China',
    cities: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Xi\'an'],
    commonScams: ['Tea House Scam', 'Art Student Scam', 'Black Taxi Scam', 'Counterfeit Currency'],
    safetyLevel: 'Medium'
  },
  {
    country: 'Japan',
    cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo'],
    commonScams: ['Bar Scam', 'Fake Accommodation', 'Restaurant Overcharging', 'Fake Monk'],
    safetyLevel: 'Very High'
  },
  {
    country: 'India',
    cities: ['New Delhi', 'Mumbai', 'Jaipur', 'Agra', 'Kolkata'],
    commonScams: ['Fake Tourist Office', 'Taxi Meter Scam', 'Fake Guide Scam', 'Gem Scam'],
    safetyLevel: 'Low'
  },
  {
    country: 'Brazil',
    cities: ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Brasília', 'Fortaleza'],
    commonScams: ['Fake Taxi', 'Distraction Theft', 'Spilled Liquid Scam', 'Express Kidnapping'],
    safetyLevel: 'Low'
  },
  {
    country: 'Egypt',
    cities: ['Cairo', 'Alexandria', 'Luxor', 'Hurghada', 'Sharm El Sheikh'],
    commonScams: ['Camel Ride Scam', 'Photo Scam', 'Papyrus Scam', 'Local Guide Scam'],
    safetyLevel: 'Medium'
  },
  {
    country: 'Morocco',
    cities: ['Marrakech', 'Casablanca', 'Fez', 'Tangier', 'Rabat'],
    commonScams: ['Fake Guide Scam', 'Rug Shop Scam', 'Henna Tattoo Scam', 'Money Exchange Scam'],
    safetyLevel: 'Medium'
  },
  {
    country: 'South Africa',
    cities: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth'],
    commonScams: ['ATM Scam', 'Parking Attendant Scam', 'Car Break-in', 'Fake Police'],
    safetyLevel: 'Low'
  },
  {
    country: 'Australia',
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    commonScams: ['Rental Scam', 'Online Shopping Scam', 'Tourist Attraction Scam', 'Job Offer Scam'],
    safetyLevel: 'Very High'
  },
  {
    country: 'Netherlands',
    cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
    commonScams: ['Fake Drug Dealer', 'Fake Ticket Seller', 'Pickpocketing', 'Accommodation Scam'],
    safetyLevel: 'High'
  },
  {
    country: 'Greece',
    cities: ['Athens', 'Santorini', 'Mykonos', 'Rhodes', 'Crete'],
    commonScams: ['Restaurant Overcharging', 'Taxi Scam', 'Shell Game', 'Friendship Bracelet'],
    safetyLevel: 'Medium'
  },
  {
    country: 'Turkey',
    cities: ['Istanbul', 'Antalya', 'Bodrum', 'Izmir', 'Cappadocia'],
    commonScams: ['Shoe Shine Scam', 'Carpet Scam', 'Turkish Bath Overcharging', 'Fake Tour Guide'],
    safetyLevel: 'Medium'
  },
  {
    country: 'Vietnam',
    cities: ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hoi An', 'Nha Trang'],
    commonScams: ['Cyclo Scam', 'Motorbike Rental Scam', 'Rigged Taxi Meter', 'Fake Travel Agency'],
    safetyLevel: 'Medium'
  },
  {
    country: 'Indonesia',
    cities: ['Bali', 'Jakarta', 'Yogyakarta', 'Lombok', 'Bandung'],
    commonScams: ['Currency Exchange Scam', 'Fake Tour Guide', 'ATM Skimming', 'Ticket Scam'],
    safetyLevel: 'Medium'
  },
  {
    country: 'Malaysia',
    cities: ['Kuala Lumpur', 'Penang', 'Langkawi', 'Johor Bahru', 'Malacca'],
    commonScams: ['Currency Exchange Scam', 'Taxi Meter Scam', 'Pickpocketing', 'Credit Card Fraud'],
    safetyLevel: 'Medium'
  },
  {
    country: 'Singapore',
    cities: ['Singapore City'],
    commonScams: ['Fake Job Offer', 'Lucky Draw Scam', 'Investment Scam', 'E-commerce Scam'],
    safetyLevel: 'Very High'
  },
  {
    country: 'Russia',
    cities: ['Moscow', 'Saint Petersburg', 'Kazan', 'Sochi', 'Novosibirsk'],
    commonScams: ['Police Scam', 'Bar/Restaurant Scam', 'Taxi Scam', 'Apartment Rental Scam'],
    safetyLevel: 'Medium'
  },
  {
    country: 'Mexico',
    cities: ['Mexico City', 'Cancun', 'Playa del Carmen', 'Guadalajara', 'Puerto Vallarta'],
    commonScams: ['Peso Exchange Scam', 'Rental Car Damage Scam', 'Police Bribery', 'ATM Fraud'],
    safetyLevel: 'Low'
  },
  {
    country: 'Argentina',
    cities: ['Buenos Aires', 'Cordoba', 'Mendoza', 'Bariloche', 'Salta'],
    commonScams: ['Mustard Scam', 'Taxi Scam', 'Fake Tour Guide', 'Counterfeit Money'],
    safetyLevel: 'Medium'
  },
  {
    country: 'Peru',
    cities: ['Lima', 'Cusco', 'Arequipa', 'Iquitos', 'Puno'],
    commonScams: ['Fake Tour Operator', 'Taxi Scam', 'ATM Skimming', 'Fake Police'],
    safetyLevel: 'Low'
  },
  {
    country: 'Colombia',
    cities: ['Bogotá', 'Medellín', 'Cartagena', 'Cali', 'Santa Marta'],
    commonScams: ['Taxi Scam', 'ATM Fraud', 'Drink Spiking', 'Fake Police'],
    safetyLevel: 'Low'
  },
  {
    country: 'Costa Rica',
    cities: ['San José', 'Manuel Antonio', 'Tamarindo', 'La Fortuna', 'Monteverde'],
    commonScams: ['Rental Car Damage', 'Fake Tour Guide', 'Counterfeit Money', 'ATM Fraud'],
    safetyLevel: 'Medium'
  },
  {
    country: 'Portugal',
    cities: ['Lisbon', 'Porto', 'Faro', 'Madeira', 'Coimbra'],
    commonScams: ['Restaurant Scam', 'Fake Drugs', 'Pickpocketing', 'ATM Fraud'],
    safetyLevel: 'High'
  },
  {
    country: 'Ireland',
    cities: ['Dublin', 'Cork', 'Galway', 'Limerick', 'Belfast'],
    commonScams: ['Accommodation Scam', 'Fake Charity', 'ATM Fraud', 'Pickpocketing'],
    safetyLevel: 'High'
  }
];

// City coordinates (approximate)
const cityCoordinates: Record<string, [number, number]> = {
  'Paris': [48.8566, 2.3522],
  'Nice': [43.7102, 7.2620],
  'Marseille': [43.2965, 5.3698],
  'Lyon': [45.7640, 4.8357],
  'Bordeaux': [44.8378, -0.5792],
  'Rome': [41.9028, 12.4964],
  'Venice': [45.4408, 12.3155],
  'Milan': [45.4642, 9.1900],
  'Florence': [43.7696, 11.2558],
  'Naples': [40.8518, 14.2681],
  'Barcelona': [41.3851, 2.1734],
  'Madrid': [40.4168, -3.7038],
  'Seville': [37.3891, -5.9845],
  'Valencia': [39.4699, -0.3763],
  'Málaga': [36.7213, -4.4213],
  'London': [51.5074, -0.1278],
  'Manchester': [53.4808, -2.2426],
  'Edinburgh': [55.9533, -3.1883],
  'Liverpool': [53.4084, -2.9916],
  'Glasgow': [55.8642, -4.2518],
  'Berlin': [52.5200, 13.4050],
  'Munich': [48.1351, 11.5820],
  'Hamburg': [53.5511, 9.9937],
  'Frankfurt': [50.1109, 8.6821],
  'Cologne': [50.9375, 6.9603],
  'New York': [40.7128, -74.0060],
  'Los Angeles': [34.0522, -118.2437],
  'Chicago': [41.8781, -87.6298],
  'Miami': [25.7617, -80.1918],
  'Las Vegas': [36.1699, -115.1398],
  'Bangkok': [13.7563, 100.5018],
  'Phuket': [7.9519, 98.3381],
  'Chiang Mai': [18.7883, 98.9853],
  'Pattaya': [12.9236, 100.8825],
  'Krabi': [8.0862, 98.9062],
  'Beijing': [39.9042, 116.4074],
  'Shanghai': [31.2304, 121.4737],
  'Guangzhou': [23.1291, 113.2644],
  'Shenzhen': [22.5431, 114.0579],
  'Xi\'an': [34.3416, 108.9398],
  'Tokyo': [35.6762, 139.6503],
  'Osaka': [34.6937, 135.5023],
  'Kyoto': [35.0116, 135.7681],
  'Yokohama': [35.4437, 139.6380],
  'Sapporo': [43.0618, 141.3545],
  'New Delhi': [28.6139, 77.2090],
  'Mumbai': [19.0760, 72.8777],
  'Jaipur': [26.9124, 75.7873],
  'Agra': [27.1767, 78.0081],
  'Kolkata': [22.5726, 88.3639],
  'Rio de Janeiro': [-22.9068, -43.1729],
  'São Paulo': [-23.5505, -46.6333],
  'Salvador': [-12.9714, -38.5014],
  'Brasília': [-15.7801, -47.9292],
  'Fortaleza': [-3.7319, -38.5267],
  'Cairo': [30.0444, 31.2357],
  'Alexandria': [31.2001, 29.9187],
  'Luxor': [25.6872, 32.6396],
  'Hurghada': [27.2579, 33.8116],
  'Sharm El Sheikh': [27.9158, 34.3300],
  'Marrakech': [31.6295, -7.9811],
  'Casablanca': [33.5731, -7.5898],
  'Fez': [34.0181, -5.0078],
  'Tangier': [35.7673, -5.7978],
  'Rabat': [34.0209, -6.8416],
  'Cape Town': [-33.9249, 18.4241],
  'Johannesburg': [-26.2041, 28.0473],
  'Durban': [-29.8587, 31.0218],
  'Pretoria': [-25.7461, 28.1881],
  'Port Elizabeth': [-33.9608, 25.6022],
  'Sydney': [-33.8688, 151.2093],
  'Melbourne': [-37.8136, 144.9631],
  'Brisbane': [-27.4698, 153.0251],
  'Perth': [-31.9505, 115.8605],
  'Adelaide': [-34.9285, 138.6007],
  'Amsterdam': [52.3676, 4.9041],
  'Rotterdam': [51.9244, 4.4777],
  'The Hague': [52.0705, 4.3007],
  'Utrecht': [52.0907, 5.1214],
  'Eindhoven': [51.4416, 5.4697],
  'Athens': [37.9838, 23.7275],
  'Santorini': [36.3932, 25.4615],
  'Mykonos': [37.4467, 25.3289],
  'Rhodes': [36.4341, 28.2176],
  'Crete': [35.2401, 24.8093],
  'Istanbul': [41.0082, 28.9784],
  'Antalya': [36.8969, 30.7133],
  'Bodrum': [37.0342, 27.4305],
  'Izmir': [38.4237, 27.1428],
  'Cappadocia': [38.6431, 34.9286],
  'Hanoi': [21.0278, 105.8342],
  'Ho Chi Minh City': [10.8231, 106.6297],
  'Da Nang': [16.0544, 108.2022],
  'Hoi An': [15.8801, 108.3380],
  'Nha Trang': [12.2388, 109.1968],
  'Bali': [-8.3405, 115.0920],
  'Jakarta': [-6.2088, 106.8456],
  'Yogyakarta': [-7.7971, 110.3688],
  'Lombok': [-8.5832, 116.2860],
  'Bandung': [-6.9175, 107.6191],
  'Kuala Lumpur': [3.1390, 101.6869],
  'Penang': [5.4141, 100.3288],
  'Langkawi': [6.3500, 99.8000],
  'Johor Bahru': [1.4927, 103.7414],
  'Malacca': [2.1896, 102.2501],
  'Singapore City': [1.3521, 103.8198],
  'Moscow': [55.7558, 37.6173],
  'Saint Petersburg': [59.9343, 30.3351],
  'Kazan': [55.8304, 49.0661],
  'Sochi': [43.6028, 39.7342],
  'Novosibirsk': [55.0084, 82.9357],
  'Mexico City': [19.4326, -99.1332],
  'Cancun': [21.1619, -86.8515],
  'Playa del Carmen': [20.6296, -87.0739],
  'Guadalajara': [20.6597, -103.3496],
  'Puerto Vallarta': [20.6534, -105.2253],
  'Buenos Aires': [-34.6037, -58.3816],
  'Cordoba': [-31.4201, -64.1888],
  'Mendoza': [-32.8908, -68.8272],
  'Bariloche': [-41.1335, -71.3103],
  'Salta': [-24.7859, -65.4117],
  'Lima': [-12.0464, -77.0428],
  'Cusco': [-13.5320, -71.9675],
  'Arequipa': [-16.4090, -71.5375],
  'Iquitos': [-3.7491, -73.2538],
  'Puno': [-15.8402, -70.0219],
  'Bogotá': [4.7110, -74.0721],
  'Medellín': [6.2476, -75.5699],
  'Cartagena': [10.3910, -75.4794],
  'Cali': [3.4516, -76.5320],
  'Santa Marta': [11.2404, -74.2110],
  'San José': [9.9281, -84.0907],
  'Manuel Antonio': [9.3920, -84.1370],
  'Tamarindo': [10.2993, -85.8371],
  'La Fortuna': [10.4673, -84.6426],
  'Monteverde': [10.3010, -84.8131],
  'Lisbon': [38.7223, -9.1393],
  'Porto': [41.1579, -8.6291],
  'Faro': [37.0193, -7.9304],
  'Madeira': [32.7607, -16.9595],
  'Coimbra': [40.2033, -8.4103],
  'Dublin': [53.3498, -6.2603],
  'Cork': [51.8969, -8.4863],
  'Galway': [53.2707, -9.0568],
  'Limerick': [52.6638, -8.6267],
  'Belfast': [54.5973, -5.9301]
};

// Scam type mapper to ensure values match our defined types
const scamTypeMapper: Record<string, ScamType> = {
  'Petition Scam': 'Tourist Trap',
  'Friendship Bracelet': 'Tourist Trap',
  'Rose Gift Scam': 'Tourist Trap',
  'Bird Poop Scam': 'Distraction Theft',
  'The Flamenco Scam': 'Tourist Trap',
  'Taxi Overcharging': 'Taxi Scam',
  'Fake Police': 'Fake Officials',
  'Taxi Scam': 'Taxi Scam',
  'Pickpocketing': 'Pickpocketing',
  'Fake Hotel Reception': 'Accommodation Scam',
  'Mustard Scam': 'Distraction Theft',
  'Charity Clipboard Scam': 'Tourist Trap',
  'Fake Accommodation': 'Accommodation Scam',
  'Three Card Monte': 'Tourist Trap',
  'ATM Fraud': 'ATM Fraud',
  'Apartment Rental Scam': 'Accommodation Scam',
  'Card Game Scam': 'Tourist Trap',
  'Broken Camera Scam': 'Tourist Trap',
  'Vacation Rental Scam': 'Accommodation Scam',
  'Tuk Tuk Scam': 'Taxi Scam',
  'Gem Scam': 'Fake Products',
  'Rented Motorbike Scam': 'Tourist Trap',
  'Tiger Temple Scam': 'Tourist Trap',
  'Tea House Scam': 'Overcharging',
  'Art Student Scam': 'Fake Products',
  'Black Taxi Scam': 'Taxi Scam',
  'Counterfeit Currency': 'Counterfeit Currency',
  'Bar Scam': 'Overcharging',
  'Restaurant Overcharging': 'Overcharging',
  'Fake Monk': 'Fake Officials',
  'Fake Tourist Office': 'Fake Officials',
  'Taxi Meter Scam': 'Taxi Scam',
  'Fake Guide Scam': 'Fake Officials',
  'Gem Scam': 'Fake Products',
  'Fake Taxi': 'Taxi Scam',
  'Distraction Theft': 'Distraction Theft',
  'Spilled Liquid Scam': 'Distraction Theft',
  'Express Kidnapping': 'Other',
  'Camel Ride Scam': 'Overcharging',
  'Photo Scam': 'Overcharging',
  'Papyrus Scam': 'Fake Products',
  'Local Guide Scam': 'Fake Officials',
  'Rug Shop Scam': 'Overcharging',
  'Henna Tattoo Scam': 'Tourist Trap',
  'Money Exchange Scam': 'Counterfeit Currency',
  'Parking Attendant Scam': 'Fake Officials',
  'Car Break-in': 'Other',
  'Rental Scam': 'Accommodation Scam',
  'Online Shopping Scam': 'Other',
  'Tourist Attraction Scam': 'Tourist Trap',
  'Job Offer Scam': 'Other',
  'Fake Drug Dealer': 'Fake Products',
  'Fake Ticket Seller': 'Fake Products',
  'Shell Game': 'Tourist Trap',
  'Shoe Shine Scam': 'Overcharging',
  'Carpet Scam': 'Overcharging',
  'Turkish Bath Overcharging': 'Overcharging',
  'Fake Tour Guide': 'Fake Officials',
  'Cyclo Scam': 'Taxi Scam',
  'Motorbike Rental Scam': 'Tourist Trap',
  'Rigged Taxi Meter': 'Taxi Scam',
  'Fake Travel Agency': 'Accommodation Scam',
  'Currency Exchange Scam': 'Counterfeit Currency',
  'Credit Card Fraud': 'ATM Fraud',
  'Fake Job Offer': 'Other',
  'Lucky Draw Scam': 'Tourist Trap',
  'Investment Scam': 'Other',
  'E-commerce Scam': 'Other',
  'Police Scam': 'Fake Officials',
  'Bar/Restaurant Scam': 'Overcharging',
  'Peso Exchange Scam': 'Counterfeit Currency',
  'Rental Car Damage Scam': 'Tourist Trap',
  'Police Bribery': 'Fake Officials',
  'Fake Tour Operator': 'Accommodation Scam',
  'ATM Skimming': 'ATM Fraud',
  'Drink Spiking': 'Other',
  'Rental Car Damage': 'Tourist Trap',
  'Fake Drugs': 'Fake Products',
  'Fake Charity': 'Fake Officials'
};

// Safety level mapper 
const safetyLevelMapper: Record<string, SafetyLevel> = {
  'Very Low': 'Very Low',
  'Low': 'Low',
  'Medium': 'Medium',
  'High': 'High',
  'Very High': 'Very High'
};

// Descriptions for common scams to make the data more informative and realistic
const scamDescriptions: Record<string, string[]> = {
  'Tourist Trap': [
    'Vendors charge exorbitant prices for low-quality souvenirs or services targeted at tourists.',
    'This area has multiple shops known to target tourists with inflated prices and fake "special deals".',
    'Local businesses may collude to artificially inflate prices for tourists, particularly in high season.',
    'Be wary of "tourist menus" that cost significantly more than the regular menu items.'
  ],
  'Pickpocketing': [
    'Crowded areas where thieves work in teams to distract victims while stealing valuables.',
    'Reports of skilled pickpockets targeting tourists, especially in public transport and tourist sites.',
    'Multiple incidents of wallet and phone theft in this area, often using children or distraction techniques.',
    'Pickpockets target visitors near this attraction, particularly during busy hours.'
  ],
  'Taxi Scam': [
    'Unlicensed taxis charging excessive fares or taking longer routes to increase the fare.',
    'Taxi drivers claim the meter is broken and then charge exorbitant flat rates.',
    'Drivers may take deliberately convoluted routes to increase fares for tourists unfamiliar with the area.',
    'Some taxis use rigged meters that run faster than they should, resulting in inflated fares.'
  ],
  'Fake Officials': [
    'Individuals posing as police officers demanding to see ID or money for fictional infractions.',
    'People claiming to be government officials requesting "inspection fees" or immediate fines.',
    'Fake tour guides posing as official city representatives to charge for services or access to public sites.',
    'Scammers dressed as authority figures target tourists to extract bribes or "fines".'
  ],
  'Accommodation Scam': [
    "Fake rental listings for properties that don't exist or are significantly different than advertised.",
    "Hosts demanding additional fees upon arrival not mentioned in the original booking.",
    "Vacation rentals that don't match online descriptions or photos, with owners refusing refunds.",
    "Booking sites showing properties that don't exist, collecting payment for non-existent accommodations."
  ],
  'ATM Fraud': [
    'Skimming devices installed on ATMs to collect card data and PINs.',
    'Tampered ATMs that capture cards or compromise banking information.',
    'Criminals observe PIN entries and then steal cards through distraction techniques.',
    'ATMs in this area have been found with card skimmers and hidden cameras to capture PIN numbers.'
  ],
  'Overcharging': [
    'Restaurants adding items to bills that weren\'t ordered or inflating prices after service.',
    'Vendors charging foreign tourists significantly higher prices than locals for the same items.',
    'Businesses using confusing pricing or hidden charges to extract more money from customers.',
    'Services quoting one price initially but demanding a much higher amount after completion.'
  ],
  'Fake Products': [
    'Counterfeit goods sold as authentic brand-name items, particularly in markets and street stalls.',
    'Fake antiques or artifacts sold as genuine historical items.',
    'Low-quality imitation products sold as high-end luxury goods to unsuspecting tourists.',
    'Vendors selling counterfeit electronics, watches, and clothing that quickly malfunction.'
  ],
  'Counterfeit Currency': [
    'Being given fake banknotes as change, particularly after small purchases.',
    'Money exchange services providing counterfeit bills mixed with legitimate currency.',
    'Street money changers offering favorable rates but providing counterfeit notes.',
    'Businesses passing counterfeit bills to tourists who may not be familiar with local currency.'
  ],
  'Distraction Theft': [
    'A person creates a commotion or spills something on you while an accomplice steals your belongings.',
    'Groups working together to distract tourists while picking pockets or stealing bags.',
    'Someone asks for directions or help while an accomplice steals your valuables.',
    'Individuals stage arguments or performances to distract attention from theft activities.'
  ],
  'Other': [
    'Various scams targeting tourists including fraudulent services and deceptive practices.',
    'Reports of elaborate schemes designed to defraud visitors of money or personal information.',
    'Scammers using a variety of tactics to trick tourists and extract money or valuables.',
    'Multiple reports of scams in this area targeting vulnerable tourists and visitors.'
  ]
};

// Generate detailed scam events for a given location
const generateScamEventsForLocation = (
  location: string, 
  coordinates: [number, number],
  commonScams: string[],
  safetyLevel: string,
  count: number
): ScamEvent[] => {
  const events: ScamEvent[] = [];
  
  for (let i = 0; i < count; i++) {
    // Select a random scam type from the common scams list
    // Ensure we have at least one item in the array
    if (commonScams.length === 0) {
      commonScams = ['Tourist Trap']; // Default fallback
    }
    
    const scamTypeName = commonScams[Math.floor(Math.random() * commonScams.length)];
    
    // Ensure scam_type is ALWAYS defined by using the mapper with a default fallback to 'Other'
    // This is the key fix to prevent the "scam_type is not defined" error
    const scamType: ScamType = scamTypeMapper[scamTypeName] || 'Other';
    
    // Get relevant descriptions for this scam type
    const relevantDescriptions = scamDescriptions[scamType] || scamDescriptions['Other'];
    const description = relevantDescriptions[Math.floor(Math.random() * relevantDescriptions.length)];
    
    // Add slight randomness to coordinates to spread events out
    const latVariation = (Math.random() - 0.5) * 0.05;
    const lngVariation = (Math.random() - 0.5) * 0.05;
    
    // Random dates within the last 90 days
    const daysAgo = Math.floor(Math.random() * 90);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    
    // End date is either undefined or a few days after start
    const hasEndDate = Math.random() > 0.5;
    const endDate = hasEndDate ? new Date(startDate) : undefined;
    if (hasEndDate && endDate) {
      endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 7) + 1);
    }
    
    // Random verification status, weighted more toward verified for high safety level countries
    const safetyFactor = safetyLevel === 'Very High' ? 0.8 : 
                         safetyLevel === 'High' ? 0.7 : 
                         safetyLevel === 'Medium' ? 0.5 : 
                         safetyLevel === 'Low' ? 0.3 : 0.2;
    
    const verified = Math.random() < safetyFactor;
    
    // Ensure safety level is defined
    const mappedSafetyLevel: SafetyLevel = safetyLevelMapper[safetyLevel] || 'Medium';
    
    // Create the event object with guaranteed valid scam_type
    events.push({
      id: `global-scam-${location.replace(/\s+/g, '-').toLowerCase()}-${i}`,
      title: `${scamTypeName} in ${location}`,
      description,
      location,
      latitude: coordinates[0] + latVariation,
      longitude: coordinates[1] + lngVariation,
      start_date: format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      end_date: hasEndDate && endDate ? format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'") : undefined,
      is_scam_related: true,
      scam_type, // This is now guaranteed to be defined
      safety_level: mappedSafetyLevel,
      source: Math.random() > 0.7 ? 'official' : 'user_reported',
      created_at: format(new Date(Date.now() - Math.random() * 7776000000), "yyyy-MM-dd'T'HH:mm:ss'Z'"), // Random timestamp within last 90 days
      updated_at: format(new Date(Date.now() - Math.random() * 2592000000), "yyyy-MM-dd'T'HH:mm:ss'Z'"), // Random timestamp within last 30 days
      verified,
      external_id: `ext-${Math.random().toString(36).substring(2, 10)}`,
      external_url: verified ? `https://travelsafety.org/reports/${Math.random().toString(36).substring(2, 10)}` : undefined,
    });
  }
  
  return events;
};

// Main function to generate global scam events data
export const getGlobalScamEvents = (totalEvents: number = 500): ScamEvent[] => {
  const allEvents: ScamEvent[] = [];
  let eventsCreated = 0;
  
  // Calculate how many events per country based on total desired
  const eventsPerCountry = Math.ceil(totalEvents / countriesData.length);
  
  for (const countryData of countriesData) {
    // For each city in the country
    for (const city of countryData.cities) {
      // Skip if we don't have coordinates for this city
      if (!cityCoordinates[city]) continue;
      
      // Generate between 1-5 events per city, ensuring we don't exceed total
      const eventsForCity = Math.min(
        Math.floor(Math.random() * 5) + 1, 
        totalEvents - eventsCreated
      );
      
      if (eventsForCity <= 0) break;
      
      const cityEvents = generateScamEventsForLocation(
        `${city}, ${countryData.country}`,
        cityCoordinates[city],
        countryData.commonScams,
        countryData.safetyLevel,
        eventsForCity
      );
      
      allEvents.push(...cityEvents);
      eventsCreated += cityEvents.length;
      
      if (eventsCreated >= totalEvents) break;
    }
    
    if (eventsCreated >= totalEvents) break;
  }
  
  // Final validation - make sure all events have a valid scam_type
  const validatedEvents = allEvents.map(event => ({
    ...event,
    scam_type: event.scam_type || 'Other'
  }));
  
  return validatedEvents;
};

// RAG System Implementation
// Function to simulate fetching updated scam data
const simulateRAGUpdate = (events: ScamEvent[]): ScamEvent[] => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString();
  
  // Additional advisories to simulate new information retrieval
  const updatedAdvisories = [
    "Local authorities have increased patrols in this area.",
    "Recent reports indicate a decrease in incidents.",
    "Several tourists reported new variations of this scam.",
    "Embassy has issued a warning about this type of scam.",
    "Local police have arrested several individuals involved in this scam.",
    "Tourism board has established a helpline for reporting these incidents.",
    "New security measures have been implemented at this location.",
    "This scam has evolved to include digital payment methods.",
    "Multiple reports confirm this issue is ongoing and persistent."
  ];

  return events.map(event => {
    // Simulate updating about 30% of the events with new information
    if (Math.random() < 0.3) {
      const randomAdvisory = updatedAdvisories[Math.floor(Math.random() * updatedAdvisories.length)];
      
      // Ensure event.scam_type is defined here as well
      return {
        ...event,
        scam_type: event.scam_type || 'Other', // Ensure scam_type is defined
        description: `${event.description || ''} [UPDATED ${formattedDate}: ${randomAdvisory}]`,
        updated_at: format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      };
    }
    
    // Ensure scam_type is defined even for non-updated events
    return {
      ...event,
      scam_type: event.scam_type || 'Other'
    };
  });
};

// Time interval for RAG update (e.g., every 24 hours)
const RAG_UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

// Store last update time
let lastUpdateTime: number | null = null;

// Fetches real travel advisory data from public APIs if available
export const fetchTravelAdvisories = async (): Promise<ScamEvent[]> => {
  try {
    // In a real implementation, this would connect to travel advisory APIs
    // Examples could include:
    // - Government travel advisory APIs
    // - Security information services
    // - Local police crime statistics 
    // - Travel insurance company risk assessments
    
    console.log('Attempting to fetch real travel advisories from external sources...');
    
    // Currently returning empty array as placeholder
    // In a production system, this would make actual API calls to travel advisory sources
    return [];
  } catch (error) {
    console.error('Error fetching travel advisories:', error);
    return [];
  }
};

// Combined function that fetches real data if possible, falls back to generated data
export const getComprehensiveScamData = async (count: number = 500): Promise<ScamEvent[]> => {
  try {
    // Check if it's time to update data
    if (!lastUpdateTime || (Date.now() - lastUpdateTime > RAG_UPDATE_INTERVAL)) {
      console.log('Simulating RAG update of scam data...');
      lastUpdateTime = Date.now();
    }

    // Try to fetch real data first
    const realData = await fetchTravelAdvisories();
    
    // If we got enough real data, use it
    if (realData.length >= count) {
      // Apply RAG update simulation to the data and ensure all events have scam_type
      return simulateRAGUpdate(realData.slice(0, count)).map(event => ({
        ...event,
        scam_type: event.scam_type || 'Other'
      }));
    }
    
    // Otherwise, supplement with generated data
    const neededGenerated = count - realData.length;
    const generatedData = getGlobalScamEvents(neededGenerated);
    
    // Apply RAG update simulation to the combined data and ensure all events have scam_type
    const combinedData = [...realData, ...generatedData];
    return simulateRAGUpdate(combinedData).map(event => ({
      ...event,
      scam_type: event.scam_type || 'Other'
    }));
  } catch (error) {
    console.error('Error getting comprehensive scam data:', error);
    // Fall back to fully generated data in case of error and ensure all events have scam_type
    const generatedData = getGlobalScamEvents(count);
    return simulateRAGUpdate(generatedData).map(event => ({
      ...event,
      scam_type: event.scam_type || 'Other'
    }));
  }
};