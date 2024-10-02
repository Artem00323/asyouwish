'use client';

import { useState } from 'react';
import { PlusCircle, Share2, Trash2, Info, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Modal } from '@/components/ui/modal'; // Предполагается, что у вас есть компонент Modal

type WishlistItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  contributed: number;
};

type YourWishlistComponentProps = {
  wishlistId: string;
  onBack: () => void;
};

export function YourWishlistComponent({ wishlistId, onBack }: YourWishlistComponentProps) {
  // Получите название вишлиста по его ID
  const wishlistName = getWishlistNameById(wishlistId); // Реализуйте эту функцию для получения названия

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    { id: '1', name: 'Smartphone', image: '/images/iphone.jpg', price: 999, contributed: 250 },
    { id: '2', name: 'Laptop', image: '/images/macbook.jpg', price: 1499, contributed: 750 },
    { id: '3', name: 'Headphones', image: '/images/airpods.jpg', price: 299, contributed: 100 },
  ]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleDeleteWishlist = () => {
    // Логика удаления вишлиста
    console.log("Wishlist deleted");
    setIsDeleteModalOpen(false);
    onBack(); // Возврат к выбору вишлистов после удаления
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 text-black">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold text-black">{wishlistName}</h2>
        </div>
        <div className="mt-4 md:mt-0 flex justify-center md:justify-end">
          <div className="flex space-x-2">
            <Button onClick={handleAddItem} size="sm" className="w-24">
              <PlusCircle className="mr-2 h-4 w-4" /> Add
            </Button>
            <Button
              onClick={handleShareWishlist}
              variant="outline"
              size="sm"
              className="w-24 text-black"
            >
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 md:gap-4">
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

      {/* Кнопка "Delete Wishlist" внизу справа */}
      <div className="flex justify-end mt-6">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete Wishlist
        </Button>
      </div>

      {/* Модальное окно подтверждения удаления */}
      {isDeleteModalOpen && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <div className="p-4 text-black">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete the "{wishlistName}" wishlist? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteWishlist}>
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// Пример функции для получения названия вишлиста по ID
function getWishlistNameById(id: string): string {
  const wishlists = [
    { id: '1', name: 'Tech Gadgets' },
    { id: '2', name: 'Home Appliances' },
    { id: '3', name: 'Books' },
  ];
  const wishlist = wishlists.find((w) => w.id === id);
  return wishlist ? wishlist.name : 'Your Wishlist';
}
