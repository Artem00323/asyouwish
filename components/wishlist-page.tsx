'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Sidebar from '@/components/sidebar';
import BottomNavBar from '@/components/bottom-nav-bar';
import { YourWishlistComponent } from '@/components/your-wishlist-component';
import { FriendsWishlists } from '@/components/friends-wishlist-component';
import { CalendarComponent } from '@/components/calendar-component';
import { ProfileComponent } from '@/components/profile-component';
import { WishlistSelectionComponent } from '@/components/ui/wishlist-selection-component';
import { Event } from '@/components/ui/types';

// Тип вкладок
export type Tab = 'your-wishlist' | 'friends-wishlists' | 'calendar-events' | 'profile';

export function WishlistPageComponent() {
  // Состояние для активной вкладки
  const [activeTab, setActiveTab] = useState<Tab>('your-wishlist');
  const [selectedWishlistId, setSelectedWishlistId] = useState<string | null>(null);

  // Пример данных для календаря
  const events: Event[] = [
    { id: uuidv4(), title: "Alice's Birthday", date: new Date(2024, 8, 15), type: 'birthday', friendId: 'alice123' },
    { id: uuidv4(), title: "Bob's Graduation", date: new Date(2024, 9, 20), type: 'event', friendId: 'bob456' },
    // ... другие события
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar для больших экранов */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Основная область контента и навигация снизу */}
      <div className="flex flex-col flex-1 relative">
        {/* Основной контент */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          {/* Отображение контента в зависимости от активной вкладки */}
          {activeTab === 'your-wishlist' && (
            selectedWishlistId === null ? (
              <WishlistSelectionComponent onSelectWishlist={setSelectedWishlistId} />
            ) : (
              <YourWishlistComponent
                wishlistId={selectedWishlistId}
                onBack={() => setSelectedWishlistId(null)}
              />
            )
          )}
          {activeTab === 'friends-wishlists' && <FriendsWishlists />}
          {activeTab === 'calendar-events' && <CalendarComponent events={events} />}
          {activeTab === 'profile' && <ProfileComponent />}
        </main>

        {/* Навигация внизу для мобильных устройств */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-10">
          <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>

    
  );
}
