'use client';

import { Button } from "@/components/ui/button";
import { Gift, Users, Calendar as CalendarIcon, User } from 'lucide-react';

type Tab = 'your-wishlist' | 'friends-wishlists' | 'calendar-events' | 'profile';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-card h-full shadow-lg">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">AsYouWish</h1>
        <nav>
          {[
            { tab: 'your-wishlist', icon: Gift, label: 'Your Wishlist' },
            { tab: 'friends-wishlists', icon: Users, label: "Friends' Wishlists" },
            { tab: 'calendar-events', icon: CalendarIcon, label: 'Calendar Events' },
            { tab: 'profile', icon: User, label: 'Profile' },
          ].map(({ tab, icon: Icon, label }) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              className={`w-full justify-start mb-2 ${
                activeTab === tab ? 'text-primary-foreground' : 'text-black dark:text-white hover:text-primary'
              }`}
              onClick={() => setActiveTab(tab as Tab)}
            >
              <Icon className="mr-2 h-4 w-4" /> {label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
