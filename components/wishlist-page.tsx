'use client';

import { useState } from 'react';
import { PlusCircle, Share2, Trash2, Info, Gift, CalendarIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import Image from 'next/image';

import Sidebar from '@/components/sidebar';
import { FriendsWishlists } from '@/components/friends-wishlist-component'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar } from '@/components/ui/calendar';
import { Event } from '@/components/ui/types'; // Adjust the import path accordingly

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
        {activeTab === 'your-wishlist' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-indigo-800">Your Wishlist</h2>
              <div>
                <Button onClick={handleAddItem} className="mr-2">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
                <Button
                  onClick={handleShareWishlist}
                  variant="outline"
                  className="text-black hover:bg-gray-200 transition-colors duration-200"
                >
                  <Share2 className="mr-2 h-4 w-4" /> Share Wishlist
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
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

        {activeTab === 'friends-wishlists' && <FriendsWishlists />}

        {activeTab === 'calendar-events' && (
          <>
            <h2 className="text-3xl font-bold text-indigo-800 mb-6">Calendar Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
              <Calendar 
                events={events} 
                onSelectDate={setSelectedDate} 
                selectedDate={selectedDate}
              />
              <Card className="p-4 overflow-auto">
                <h3 className="text-xl font-semibold mb-4">Events on {selectedDate.toDateString()}</h3>
                {getEventsForDate(selectedDate).length > 0 ? (
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
            <p className="text-gray-600">Coming soon...</p>
          </>
        )}
      </main>
    </div>
  );
}