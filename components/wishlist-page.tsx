// wishlist-page.tsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { PlusCircle, Share2, Trash2, Info, Gift, Users, User, Calendar as CalendarIcon } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Link from 'next/link';
import Image from 'next/image';

type WishlistItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  contributed: number;
};

type Tab = 'your-wishlist' | 'friends-wishlists' | 'calendar-events' | 'profile';

type Event = {
  id: string;
  title: string;
  date: Date;
  type: 'birthday' | 'event';
  friendId: string;
};

export function WishlistPageComponent() {
  const [activeTab, setActiveTab] = useState<Tab>('your-wishlist'); // Explicitly typed as Tab
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    { id: '1', name: 'Smartphone', image: '/images/iphone.jpg', price: 999, contributed: 250 },
    { id: '2', name: 'Laptop', image: '/images/macbook.jpg', price: 1499, contributed: 750 },
    { id: '3', name: 'Headphones', image: '/images/airpods.jpg', price: 299, contributed: 100 },
  ]);

  // State for Calendar Events
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Sample events data
  const events: Event[] = [
    { id: '1', title: "Alice's Birthday", date: new Date(2023, 5, 15), type: 'birthday', friendId: 'alice123' },
    { id: '2', title: "Bob's Graduation", date: new Date(2023, 5, 20), type: 'event', friendId: 'bob456' },
    { id: '3', title: "Charlie's Wedding", date: new Date(2023, 6, 5), type: 'event', friendId: 'charlie789' },
    { id: '4', title: "David's Birthday", date: new Date(2023, 6, 10), type: 'birthday', friendId: 'david101' },
  ];

  const eventDates = events.map(event => event.date);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // Handlers for Wishlist
  const handleAddItem = () => {
    // Implement add item logic here
    console.log("Add item clicked");
  };

  const handleShareWishlist = () => {
    // Implement share wishlist logic here
    console.log("Share wishlist clicked");
  };

  const handleDeleteItem = (id: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const handleItemDetails = (id: string) => {
    // Implement item details logic here
    console.log("Item details clicked for id:", id);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-4 md:p-8 transition-all duration-300">
        {activeTab === 'your-wishlist' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-indigo-800">Your Wishlist</h2>
              <div>
                <Button onClick={handleAddItem} className="mr-2">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
                <Button onClick={handleShareWishlist} variant="outline">
                  <Share2 className="mr-2 h-4 w-4" /> Share Wishlist
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-md"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <Progress value={(item.contributed / item.price) * 100} className="mb-2" />
                    <p className="text-sm text-gray-600">
                      ${item.contributed} raised of ${item.price}
                    </p>
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-4 flex justify-between">
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleItemDetails(item.id)}>
                      <Info className="mr-2 h-4 w-4" /> Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'friends-wishlists' && (
          <>
            <h2 className="text-3xl font-bold text-indigo-800 mb-6">Friends' Wishlists</h2>
            {/* Implement friends' wishlists UI here */}
            <p className="text-gray-600">Coming soon...</p>
          </>
        )}

        {activeTab === 'calendar-events' && (
          <>
            <h2 className="text-3xl font-bold text-indigo-800 mb-6">Calendar Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-8">
              <Card className="p-4 overflow-hidden">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border shadow w-full max-w-full"
                  modifiers={{
                    event: eventDates,
                  }}
                  modifiersStyles={{
                    event: { fontWeight: 'bold', color: 'white', backgroundColor: '#4f46e5' },
                  }}
                />
              </Card>
              <Card className="p-4 overflow-auto max-h-[calc(100vh-200px)]">
                <h3 className="text-xl font-semibold mb-4">Events on {selectedDate?.toDateString()}</h3>
                {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map(event => (
                    <Link href={`/friend-wishlist/${event.friendId}`} key={event.id}>
                      <CardContent className="mb-4 p-4 bg-indigo-50 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors">
                        <div className="flex items-center">
                          {event.type === 'birthday' ? (
                            <Gift className="mr-2 h-5 w-5 text-indigo-600" />
                          ) : (
                            <CalendarIcon className="mr-2 h-5 w-5 text-indigo-600" />
                          )}
                          <span className="font-medium text-indigo-800">{event.title}</span>
                        </div>
                      </CardContent>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500">No events on this date.</p>
                )}
              </Card>
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <>
            <h2 className="text-3xl font-bold text-indigo-800 mb-6">Profile</h2>
            {/* Implement profile UI here */}
            <p className="text-gray-600">Coming soon...</p>
          </>
        )}
      </main>
    </div>
  );
}
