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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main content and BottomNavBar */}
      <div className="flex flex-col flex-1 relative">
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          {activeTab === 'your-wishlist' && <YourWishlistComponent />}
          {activeTab === 'friends-wishlists' && <FriendsWishlists />}
          {activeTab === 'calendar-events' && <CalendarComponent events={events} />}
          {activeTab === 'profile' && <ProfileComponent />}
        </main>

        {/* Bottom navigation for mobile devices */}
        <div className="md:hidden">
          <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}