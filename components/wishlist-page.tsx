'use client';

import { useState } from 'react';
import { PlusCircle, Share2, Trash2, Info } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

import Sidebar from '@/components/sidebar';
import { FriendsWishlists } from '@/components/friends-wishlist-component'
import { CalendarComponent } from '@/components/calendar-component'
import { ProfileComponent } from '@/components/profile-component'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Event } from '@/components/ui/types';
import { YourWishlistComponent } from '@/components/your-wishlist-component'

type WishlistItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  contributed: number;
};

type Tab = 'your-wishlist' | 'friends-wishlists' | 'calendar-events' | 'profile';

export function WishlistPageComponent() {
  const [activeTab, setActiveTab] = useState<Tab>('your-wishlist');
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    { id: '1', name: 'Smartphone', image: '/images/iphone.jpg', price: 999, contributed: 250 },
    { id: '2', name: 'Laptop', image: '/images/macbook.jpg', price: 1499, contributed: 750 },
    { id: '3', name: 'Headphones', image: '/images/airpods.jpg', price: 299, contributed: 100 },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const events: Event[] = [
    { id: uuidv4(), title: "Alice's Birthday", date: new Date(2024, 8, 15), type: 'birthday', friendId: 'alice123' },
    { id: uuidv4(), title: "Bob's Graduation", date: new Date(2024, 9, 20), type: 'event', friendId: 'bob456' },
    { id: uuidv4(), title: "Charlie's Wedding", date: new Date(2024, 8, 5), type: 'event', friendId: 'charlie789' },
    { id: uuidv4(), title: "David's Birthday", date: new Date(2024, 8, 5), type: 'birthday', friendId: 'david101' },
    { id: uuidv4(), title: "Artem's Birthday", date: new Date(2024, 8, 5), type: 'birthday', friendId: 'artem137' },
  ];

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const handleAddItem = () => {
    console.log("Add item clicked");
  };

  const handleShareWishlist = () => {
    console.log("Share wishlist clicked");
  };

  const handleDeleteItem = (id: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const handleItemDetails = (id: string) => {
    console.log("Item details clicked for id:", id);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-4 md:p-8 transition-all duration-300 overflow-auto">
        {activeTab === 'your-wishlist' && <YourWishlistComponent />}
        {activeTab === 'friends-wishlists' && <FriendsWishlists />}
        {activeTab === 'calendar-events' && <CalendarComponent events={events} />}
        {activeTab === 'profile' && <ProfileComponent />}
      </main>
    </div>
  );
}