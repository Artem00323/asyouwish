'use client';

import { Gift, Users, Calendar as CalendarIcon, User } from 'lucide-react';

type Tab = 'your-wishlist' | 'friends-wishlists' | 'calendar-events' | 'profile';

interface BottomNavBarProps {
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  // Function to determine icon color
  const getIconColor = (isActive: boolean) => (isActive ? 'text-indigo-600' : 'text-gray-500');

  return (
    <div className="bg-white shadow-md flex justify-around py-2 md:hidden">
      <button onClick={() => setActiveTab('your-wishlist')} className="flex flex-col items-center">
        <Gift className={`h-6 w-6 ${getIconColor(activeTab === 'your-wishlist')}`} />
        <span className={`text-xs ${getIconColor(activeTab === 'your-wishlist')}`}>Your Wishlist</span>
      </button>
      <button onClick={() => setActiveTab('friends-wishlists')} className="flex flex-col items-center">
        <Users className={`h-6 w-6 ${getIconColor(activeTab === 'friends-wishlists')}`} />
        <span className={`text-xs ${getIconColor(activeTab === 'friends-wishlists')}`}>Friends</span>
      </button>
      <button onClick={() => setActiveTab('calendar-events')} className="flex flex-col items-center">
        <CalendarIcon className={`h-6 w-6 ${getIconColor(activeTab === 'calendar-events')}`} />
        <span className={`text-xs ${getIconColor(activeTab === 'calendar-events')}`}>Calendar</span>
      </button>
      <button onClick={() => setActiveTab('profile')} className="flex flex-col items-center">
        <User className={`h-6 w-6 ${getIconColor(activeTab === 'profile')}`} />
        <span className={`text-xs ${getIconColor(activeTab === 'profile')}`}>Profile</span>
      </button>
    </div>
  );
};

export default BottomNavBar;
