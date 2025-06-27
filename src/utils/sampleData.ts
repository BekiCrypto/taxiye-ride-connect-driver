
// Sample data for development and testing
export const sampleRides = [
  {
    id: 'ride-001',
    driver_phone_ref: 'DRV_+251911123456',
    passenger_name: 'Amara Tadesse',
    passenger_phone: '+251922234567',
    passenger_phone_ref: 'PSG_+251922234567',
    pickup_location: 'Bole Atlas, Addis Ababa',
    dropoff_location: 'Mercato, Addis Ababa',
    distance_km: 8.5,
    status: 'completed' as const,
    fare: 120.50,
    commission: 24.10,
    net_earnings: 96.40,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    started_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ride-002',
    driver_phone_ref: 'DRV_+251911123456',
    passenger_name: 'Belay Wondimu',
    passenger_phone: '+251933345678',
    passenger_phone_ref: 'PSG_+251933345678',
    pickup_location: 'Piassa, Addis Ababa',
    dropoff_location: 'CMC, Addis Ababa',
    distance_km: 12.3,
    status: 'completed' as const,
    fare: 180.75,
    commission: 36.15,
    net_earnings: 144.60,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    started_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ride-003',
    driver_phone_ref: 'DRV_+251911123456',
    passenger_name: 'Chaltu Mohammed',
    passenger_phone: '+251944456789',
    passenger_phone_ref: 'PSG_+251944456789',
    pickup_location: 'Kazanchis, Addis Ababa',
    dropoff_location: 'Bole Airport, Addis Ababa',
    distance_km: 15.7,
    status: 'in_progress' as const,
    fare: null,
    commission: null,
    net_earnings: null,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    started_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    completed_at: null
  }
];

export const sampleNotifications = [
  {
    id: 'notif-001',
    driver_phone_ref: 'DRV_+251911123456',
    title: 'New Ride Request',
    message: 'You have a new ride request from Bole Atlas to Mercato. Estimated fare: 120 ETB',
    type: 'ride_request',
    is_read: false,
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-002',
    driver_phone_ref: 'DRV_+251911123456',
    title: 'Weekly Earnings Summary',
    message: 'Great week! You earned 2,340 ETB from 18 completed trips. Keep up the excellent work!',
    type: 'earnings',
    is_read: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-003',
    driver_phone_ref: 'DRV_+251911123456',
    title: 'Document Verified',
    message: 'Your driving license has been successfully verified. You can now accept rides!',
    type: 'verification',
    is_read: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const sampleWalletTransactions = [
  {
    id: 'txn-001',
    driver_phone_ref: 'DRV_+251911123456',
    type: 'ride_earning' as const,
    source: 'ride' as const,
    amount: 96.40,
    status: 'completed' as const,
    description: 'Earnings from Bole Atlas to Mercato trip',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: 'txn-002',
    driver_phone_ref: 'DRV_+251911123456',
    type: 'topup' as const,
    source: 'telebirr' as const,
    amount: 500.00,
    status: 'completed' as const,
    description: 'Wallet top-up via TeleBirr',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'txn-003',
    driver_phone_ref: 'DRV_+251911123456',
    type: 'ride_earning' as const,
    source: 'ride' as const,
    amount: 144.60,
    status: 'completed' as const,
    description: 'Earnings from Piassa to CMC trip',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

export const samplePromoCode = {
  id: 'promo-001',
  code: 'WELCOME2024',
  driver_bonus: 100.00,
  is_active: true,
  max_uses: 1000,
  current_uses: 245,
  expiry_date: '2024-12-31',
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
};

// Ethiopian driver and location specific data
export const ethiopianLocations = [
  'Bole Atlas, Addis Ababa',
  'Mercato, Addis Ababa',
  'Piassa, Addis Ababa',
  'CMC, Addis Ababa',
  'Kazanchis, Addis Ababa',
  'Bole Airport, Addis Ababa',
  'Mexico, Addis Ababa',
  'Arat Kilo, Addis Ababa',
  'Sidist Kilo, Addis Ababa',
  'Lebu, Addis Ababa',
  'Gerji, Addis Ababa',
  'Hayat, Addis Ababa'
];

export const ethiopianNames = [
  'Amara Tadesse',
  'Belay Wondimu',
  'Chaltu Mohammed',
  'Dawit Alemayehu',
  'Eskinder Teshome',
  'Fantu Bekele',
  'Girma Haile',
  'Hanan Ahmed',
  'Ibrahim Hassan',
  'Kalkidan Getnet'
];

export const ethiopianPhoneNumbers = [
  '+251911123456',
  '+251922234567',
  '+251933345678',
  '+251944456789',
  '+251955567890',
  '+251966678901',
  '+251977789012',
  '+251988890123',
  '+251999901234'
];
