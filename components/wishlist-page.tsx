'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Sidebar from '@/components/sidebar';
import BottomNavBar from '@/components/bottom-nav-bar';
import { YourWishlistComponent } from '@/components/your-wishlist-component';
import { FriendsWishlists } from '@/components/friends-wishlist-component';
import { CalendarComponent } from '@/components/calendar-component';
import { ProfileComponent } from '@/components/profile-component';
import { Event } from '@/components/ui/types';

type Tab = 'your-wishlist' | 'friends-wishlists' | 'calendar-events' | 'profile';

export function WishlistPageComponent() {
  const [activeTab, setActiveTab] = useState<Tab>('your-wishlist');

  const events: Event[] = [
    { id: uuidv4(), title: "Alice's Birthday", date: new Date(2024, 8, 15), type: 'birthday', friendId: 'alice123' },
    { id: uuidv4(), title: "Bob's Graduation", date: new Date(2024, 9, 20), type: 'event', friendId: 'bob456' },
    { id: uuidv4(), title: "Charlie's Wedding", date: new Date(2024, 8, 5), type: 'event', friendId: 'charlie789' },
    { id: uuidv4(), title: "David's Birthday", date: new Date(2024, 8, 5), type: 'birthday', friendId: 'david101' },
    { id: uuidv4(), title: "Artem's Birthday", date: new Date(2024, 8, 5), type: 'birthday', friendId: 'artem137' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for larger screens */}
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        {/* Main content */}
        <main
          className="flex-1 p-4 md:p-8 overflow-auto"
          style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))' }} // Adjust bottom padding
        >
          {activeTab === 'your-wishlist' && <YourWishlistComponent />}
          {activeTab === 'friends-wishlists' && <FriendsWishlists />}
          {activeTab === 'calendar-events' && <CalendarComponent events={events} />}
          {activeTab === 'profile' && <ProfileComponent />}
        </main>
      </div>
      {/* Bottom navigation for mobile devices */}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}