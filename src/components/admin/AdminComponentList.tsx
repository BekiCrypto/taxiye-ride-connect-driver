
import { 
  Monitor, 
  User, 
  Car, 
  DollarSign, 
  Bell, 
  HelpCircle, 
  FileText,
  Shield,
  Users
} from 'lucide-react';

// Import the components we want to preview
import Dashboard from '../Dashboard';
import Profile from '../Profile';
import Wallet from '../Wallet';
import Support from '../Support';
import KYCUpload from '../KYCUpload';
import RideRequest from '../RideRequest';
import ActiveTrip from '../ActiveTrip';
import TripSummary from '../TripSummary';
import SOSEmergency from '../SOSEmergency';
import Login from '../Login';
import PassengerDashboard from '../passenger/PassengerDashboard';
import PassengerRegistration from '../passenger/PassengerRegistration';
import RideBooking from '../passenger/RideBooking';
import ComplianceDashboard from './ComplianceDashboard';
import UserTypeSelector from '../UserTypeSelector';

export const adminComponents = [
  { id: 'dashboard', name: 'Driver Dashboard', icon: Monitor, component: Dashboard },
  { id: 'passenger-dashboard', name: 'Passenger Dashboard', icon: User, component: PassengerDashboard },
  { id: 'compliance', name: 'Compliance Dashboard', icon: Shield, component: ComplianceDashboard },
  { id: 'user-selector', name: 'User Type Selector', icon: Users, component: UserTypeSelector },
  { id: 'ride-booking', name: 'Ride Booking', icon: Car, component: RideBooking },
  { id: 'passenger-registration', name: 'Passenger Registration', icon: User, component: PassengerRegistration },
  { id: 'kyc-upload', name: 'Driver KYC Upload', icon: FileText, component: KYCUpload },
  { id: 'profile', name: 'Profile', icon: User, component: Profile },
  { id: 'wallet', name: 'Wallet', icon: DollarSign, component: Wallet },
  { id: 'support', name: 'Support', icon: HelpCircle, component: Support },
  { id: 'ride-request', name: 'Driver Ride Request', icon: Car, component: RideRequest },
  { id: 'active-trip', name: 'Active Trip', icon: Car, component: ActiveTrip },
  { id: 'trip-summary', name: 'Trip Summary', icon: Car, component: TripSummary },
  { id: 'sos', name: 'SOS Emergency', icon: Bell, component: SOSEmergency },
  { id: 'login', name: 'Login', icon: User, component: Login }
];
