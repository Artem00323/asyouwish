'use client';

import { Gift, Users, Calendar as CalendarIcon, User } from 'lucide-react';

type Tab = 'your-wishlist' | 'friends-wishlists' | 'calendar-events' | 'profile';

interface BottomNavBarProps {
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  // Function to determine icon and text color
  const getColor = (isActive: boolean) => 
    isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card shadow-md flex justify-around py-2">
      <button onClick={() => setActiveTab('your-wishlist')} className="flex flex-col items-center">
        <Gift className={`h-6 w-6 ${getColor(activeTab === 'your-wishlist')}`} />
        <span className={`text-xs ${getColor(activeTab === 'your-wishlist')}`}>Your Wishlists</span>
      </button>
      <button onClick={() => setActiveTab('friends-wishlists')} className="flex flex-col items-center">
        <Users className={`h-6 w-6 ${getColor(activeTab === 'friends-wishlists')}`} />
        <span className={`text-xs ${getColor(activeTab === 'friends-wishlists')}`}>Friends</span>
      </button>
      <button onClick={() => setActiveTab('calendar-events')} className="flex flex-col items-center">
        <CalendarIcon className={`h-6 w-6 ${getColor(activeTab === 'calendar-events')}`} />
        <span className={`text-xs ${getColor(activeTab === 'calendar-events')}`}>Calendar</span>
      </button>
      <button onClick={() => setActiveTab('profile')} className="flex flex-col items-center">
        <User className={`h-6 w-6 ${getColor(activeTab === 'profile')}`} />
        <span className={`text-xs ${getColor(activeTab === 'profile')}`}>Profile</span>
      </button>
    </div>
  );
};

export default BottomNavBar;
