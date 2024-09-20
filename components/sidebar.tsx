'use client';

import { Button } from "@/components/ui/button";
import { Gift, Users, Calendar as CalendarIcon, User } from 'lucide-react';

type Tab = 'your-wishlist' | 'friends-wishlists' | 'calendar-events' | 'profile';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  // Helper function to determine text color
  const getTextColor = (isActive: boolean) => (isActive ? 'text-white' : 'text-black');

  return (
    <div className="w-64 bg-white h-full shadow-lg">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-indigo-800 mb-4">AsYouWish</h1>
        <nav>
          <Button
            variant={activeTab === 'your-wishlist' ? 'default' : 'ghost'}
            className={`w-full justify-start mb-2 ${getTextColor(activeTab === 'your-wishlist')}`}
            onClick={() => setActiveTab('your-wishlist')}
          >
            <Gift className="mr-2 h-4 w-4" /> Your Wishlist
          </Button>
          <Button
            variant={activeTab === 'friends-wishlists' ? 'default' : 'ghost'}
            className={`w-full justify-start mb-2 ${getTextColor(activeTab === 'friends-wishlists')}`}
            onClick={() => setActiveTab('friends-wishlists')}
          >
            <Users className="mr-2 h-4 w-4" /> Friends' Wishlists
          </Button>
          <Button
            variant={activeTab === 'calendar-events' ? 'default' : 'ghost'}
            className={`w-full justify-start mb-2 ${getTextColor(activeTab === 'calendar-events')}`}
            onClick={() => setActiveTab('calendar-events')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" /> Calendar Events
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            className={`w-full justify-start mb-2 ${getTextColor(activeTab === 'profile')}`}
            onClick={() => setActiveTab('profile')}
          >
            <User className="mr-2 h-4 w-4" /> Profile
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
