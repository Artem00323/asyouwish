'use client';

import { Gift, Users, Calendar as CalendarIcon, User } from 'lucide-react';
import { Button } from "@/components/ui/button";

type Tab = 'your-wishlist' | 'friends-wishlists' | 'calendar-events' | 'profile';

interface BottomNavBarProps {
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  // Функция для определения цвета иконки
  const getIconColor = (isActive: boolean) => (isActive ? 'text-indigo-600' : 'text-gray-500');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-around py-2 h-15 md:hidden">      <button onClick={() => setActiveTab('your-wishlist')} className="flex flex-col items-center">
        <Gift className={`h-6 w-6 ${getIconColor(activeTab === 'your-wishlist')}`} />
        <span className={`text-xs ${getIconColor(activeTab === 'your-wishlist')}`}>Ваш список</span>
      </button>
      <button onClick={() => setActiveTab('friends-wishlists')} className="flex flex-col items-center">
        <Users className={`h-6 w-6 ${getIconColor(activeTab === 'friends-wishlists')}`} />
        <span className={`text-xs ${getIconColor(activeTab === 'friends-wishlists')}`}>Друзья</span>
      </button>
      <button onClick={() => setActiveTab('calendar-events')} className="flex flex-col items-center">
        <CalendarIcon className={`h-6 w-6 ${getIconColor(activeTab === 'calendar-events')}`} />
        <span className={`text-xs ${getIconColor(activeTab === 'calendar-events')}`}>Календарь</span>
      </button>
      <button onClick={() => setActiveTab('profile')} className="flex flex-col items-center">
        <User className={`h-6 w-6 ${getIconColor(activeTab === 'profile')}`} />
        <span className={`text-xs ${getIconColor(activeTab === 'profile')}`}>Профиль</span>
      </button>
    </div>
  );
};

export default BottomNavBar;
