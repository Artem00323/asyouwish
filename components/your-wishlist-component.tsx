'use client';

import { useState } from 'react';
import { PlusCircle, Share2, Trash2, Info } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type WishlistItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  contributed: number;
};

export function YourWishlistComponent() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    { id: '1', name: 'Smartphone', image: '/images/iphone.jpg', price: 999, contributed: 250 },
    { id: '2', name: 'Laptop', image: '/images/macbook.jpg', price: 1499, contributed: 750 },
    { id: '3', name: 'Headphones', image: '/images/airpods.jpg', price: 299, contributed: 100 },
  ]);

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
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-2 md:mb-0">Your Wishlist</h2>
        <div className="flex">
          <Button onClick={handleAddItem} className="mr-2" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
          </Button>
          <Button
            onClick={handleShareWishlist}
            variant="outline"
            className="text-black hover:bg-gray-200 transition-colors duration-200"
            size="sm"
          >
            <Share2 className="mr-2 h-4 w-4" /> Share Wishlist
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative w-full h-40 md:h-48">
              <Image
                src={item.image}
                alt={item.name}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-t-md"
              />
            </div>
            <CardContent className="p-2 md:p-4">
              <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">{item.name}</h3>
              <Progress value={(item.contributed / item.price) * 100} className="mb-1 md:mb-2" />
              <p className="text-xs md:text-sm text-gray-600">
                ${item.contributed} raised of ${item.price}
              </p>
            </CardContent>
            <CardFooter className="bg-gray-50 p-2 md:p-4 flex justify-between">
              <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                <Trash2 className="mr-1 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">Delete</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleItemDetails(item.id)}>
                <Info className="mr-1 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">Details</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}