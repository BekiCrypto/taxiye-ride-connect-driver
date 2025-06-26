
import { 
  Monitor, 
  User, 
  Car, 
  DollarSign, 
  Bell, 
  HelpCircle, 
  FileText
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

export const adminComponents = [
  { id: 'dashboard', name: 'Dashboard', icon: Monitor, component: Dashboard },
  { id: 'kyc-upload', name: 'KYC Upload', icon: FileText, component: KYCUpload },
  { id: 'profile', name: 'Profile', icon: User, component: Profile },
  { id: 'wallet', name: 'Wallet', icon: DollarSign, component: Wallet },
  { id: 'support', name: 'Support', icon: HelpCircle, component: Support },
  { id: 'ride-request', name: 'Ride Request', icon: Car, component: RideRequest },
  { id: 'active-trip', name: 'Active Trip', icon: Car, component: ActiveTrip },
  { id: 'trip-summary', name: 'Trip Summary', icon: Car, component: TripSummary },
  { id: 'sos', name: 'SOS Emergency', icon: Bell, component: SOSEmergency },
  { id: 'login', name: 'Login', icon: User, component: Login }
];
