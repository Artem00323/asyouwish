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

// Define the types
export type Tab = 'your-wishlist' | 'friends-wishlists' | 'calendar-events' | 'profile';

type Wishlist = {
  id: string;
  name: string;
  date: Date;
  emoji: string;
  eventType: string;
};

export function WishlistPageComponent() {
  const [activeTab, setActiveTab] = useState<Tab>('your-wishlist');
  const [selectedWishlistId, setSelectedWishlistId] = useState<string | null>(null);

  // Sample data for the calendar
  const events: Event[] = [
    {
      id: uuidv4(),
      title: "Alice's Birthday",
      date: new Date(2024, 8, 15),
      type: 'birthday',
      friendId: 'alice123',
    },
    {
      id: uuidv4(),
      title: "Bob's Graduation",
      date: new Date(2024, 9, 20),
      type: 'event',
      friendId: 'bob456',
    },
    // ... other events
  ];

  // State for wishlists
  const [wishlists, setWishlists] = useState<Wishlist[]>([
    {
      id: '1',
      name: 'Birthday Wishes',
      date: new Date(2024, 8, 15),
      emoji: '🎂',
      eventType: 'birthday',
    },
    {
      id: '2',
      name: 'New Year Gifts',
      date: new Date(2024, 0, 1), // January 1st, 2024
      emoji: '🎉',
      eventType: 'newyear',
    },
    {
      id: '3',
      name: 'Wedding Registry',
      date: new Date(2024, 6, 20),
      emoji: '💍',
      eventType: 'wedding',
    },
  ]);

  // Function to delete a wishlist
  const handleDeleteWishlist = (id: string) => {
    setWishlists(wishlists.filter((wishlist) => wishlist.id !== id));
    setSelectedWishlistId(null); // Return to wishlist selection
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main content area and bottom navigation */}
      <div className="flex flex-col flex-1 relative">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          {/* Display content based on active tab */}
          {activeTab === 'your-wishlist' && (
            selectedWishlistId === null ? (
              <WishlistSelectionComponent
                wishlists={wishlists}
                setWishlists={setWishlists}
                onSelectWishlist={setSelectedWishlistId}
              />
            ) : (
              <YourWishlistComponent
                wishlistId={selectedWishlistId}
                wishlists={wishlists}
                onDeleteWishlist={handleDeleteWishlist}
                onBack={() => setSelectedWishlistId(null)}
              />
            )
          )}
          {activeTab === 'friends-wishlists' && <FriendsWishlists />}
          {activeTab === 'calendar-events' && <CalendarComponent events={events} />}
          {activeTab === 'profile' && <ProfileComponent />}
        </main>

        {/* Bottom navigation for mobile devices */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-10">
          <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
