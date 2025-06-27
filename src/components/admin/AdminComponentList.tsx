
interface ComponentItem {
  id: string;
  name: string;
  category: string;
  status: 'completed' | 'in-progress' | 'pending';
  description: string;
  features?: string[];
}

export const adminComponents: ComponentItem[] = [
  {
    id: 'dashboard',
    name: 'Driver Dashboard',
    category: 'Core Features',
    status: 'completed',
    description: 'Main dashboard with statistics, quick actions, and driver status overview',
    features: [
      'Real-time driver status',
      'Earnings overview',
      'Quick action buttons',
      'Wallet integration',
      'Vehicle information display'
    ]
  },
  {
    id: 'auth',
    name: 'Authentication System',
    category: 'Core Features',
    status: 'completed',
    description: 'Complete login/signup system with OTP verification and password reset',
    features: [
      'Phone number authentication',
      'OTP verification',
      'Password reset functionality',
      'Driver-specific auth flow',
      'Session management'
    ]
  },
  {
    id: 'kyc',
    name: 'KYC Document Upload',
    category: 'Onboarding',
    status: 'completed',
    description: 'Document verification system for driver onboarding',
    features: [
      'Document upload interface',
      'AI verification integration',
      'Camera interface for photos',
      'Progress tracking',
      'Rejection handling'
    ]
  },
  {
    id: 'profile',
    name: 'Driver Profile',
    category: 'User Management',
    status: 'completed',
    description: 'Comprehensive driver profile management with personal and vehicle information',
    features: [
      'Personal information display',
      'Vehicle details',
      'Document status',
      'Statistics overview',
      'Profile actions'
    ]
  },
  {
    id: 'wallet',
    name: 'Wallet System',
    category: 'Financial',
    status: 'completed',
    description: 'Digital wallet for managing earnings and transactions',
    features: [
      'Balance display',
      'Transaction history',
      'Top-up functionality',
      'Multiple payment methods',
      'Real-time updates'
    ]
  },
  {
    id: 'rides',
    name: 'Ride Management',
    category: 'Core Features',
    status: 'in-progress',
    description: 'Complete ride lifecycle management from request to completion',
    features: [
      'Ride request handling',
      'Active trip tracking',
      'Trip completion',
      'Fare calculation',
      'Ride history'
    ]
  },
  {
    id: 'notifications',
    name: 'Notification System',
    category: 'Communication',
    status: 'completed',
    description: 'Push notifications and in-app messaging system',
    features: [
      'Real-time notifications',
      'Message categorization',
      'Read/unread status',
      'Action buttons',
      'Notification history'
    ]
  },
  {
    id: 'support',
    name: 'Support System',
    category: 'Support',
    status: 'in-progress',
    description: 'Integrated support system with ticket management',
    features: [
      'Ticket creation',
      'Category selection',
      'Chat interface',
      'File attachments',
      'Status tracking'
    ]
  },
  {
    id: 'emergency',
    name: 'SOS Emergency',
    category: 'Safety',
    status: 'completed',
    description: 'Emergency alert system for driver safety',
    features: [
      'One-tap emergency button',
      'Location sharing',
      'Contact emergency services',
      'Alert history',
      'Quick access'
    ]
  },
  {
    id: 'referral',
    name: 'Referral Program',
    category: 'Growth',
    status: 'completed',
    description: 'Driver referral system with rewards and tracking',
    features: [
      'Referral code generation',
      'Invite tracking',
      'Reward calculation',
      'Leaderboard',
      'Share functionality'
    ]
  },
  {
    id: 'earnings',
    name: 'Earnings History',
    category: 'Financial',
    status: 'completed',
    description: 'Detailed earnings tracking and analytics',
    features: [
      'Daily/weekly/monthly views',
      'Trip-wise breakdown',
      'Commission tracking',
      'Export functionality',
      'Performance metrics'
    ]
  },
  {
    id: 'admin-panel',
    name: 'Admin Dashboard',
    category: 'Administration',
    status: 'completed',
    description: 'Administrative panel for managing drivers and reviewing components',
    features: [
      'Component review system',
      'Driver management',
      'Analytics overview',
      'System monitoring',
      'Multi-device preview'
    ]
  }
];
