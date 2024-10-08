'use client';

import { useState } from 'react';
import { PlusCircle, Share2, Trash2, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Modal } from '@/components/ui/modal';
import { AddItemModal } from '@/components/add-item-component'; // Ensure correct path
import QRCode from 'react-qr-code'; // Import QRCode component
import Image from 'next/image'; // Import Image component

// Define the Wishlist type
type Wishlist = {
  id: string;
  name: string;
  description: string;
  emoji: string;
};

// Update ItemData interface to match AddItemModal structure
interface ItemData {
  name: string;
  image: string | File; // Accept both string and File for the image
  price: number;
  description: string;
}

interface WishlistItem extends Omit<ItemData, 'image'> {
  id: string;
  contributed: number;
  image: string | File; // Allow image to be a string or File
}

type YourWishlistComponentProps = {
  wishlistId: string;
  wishlists: Wishlist[];
  onDeleteWishlist: (id: string) => void;
  onBack: () => void;
};

export function YourWishlistComponent({
  wishlistId,
  wishlists,
  onDeleteWishlist,
  onBack,
}: YourWishlistComponentProps) {
  const wishlist = wishlists.find((w) => w.id === wishlistId);
  const wishlistName = wishlist ? wishlist.name : 'Your Wishlist';
  const wishlistEmoji = wishlist ? wishlist.emoji : '🎁';

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    { id: '1', name: 'Smartphone', image: '/images/iphone.jpg', price: 999, contributed: 250, description: 'Smartphone' },
    { id: '2', name: 'Laptop', image: '/images/macbook.jpg', price: 1499, contributed: 750, description: 'Laptop' },
    { id: '3', name: 'Headphones', image: '/images/airpods.jpg', price: 299, contributed: 100, description: 'Headphones' },
  ]);

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Function to add a new item to the wishlist
  const handleAddItem = (newItem: ItemData) => {
    const newItemData: WishlistItem = {
      id: (wishlistItems.length + 1).toString(), // Assign a new ID
      name: newItem.name,
      image: newItem.image,
      price: newItem.price,
      contributed: 0, // Initialize contributed value
      description: newItem.description,
    };
    setWishlistItems([...wishlistItems, newItemData]); // Add the new item to the list
  };

  const handleShareWishlist = () => {
    setIsShareModalOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const handleItemDetails = (id: string) => {
    console.log('Item details clicked for id:', id);
  };

  const handleDeleteWishlist = () => {
    onDeleteWishlist(wishlistId);
    setIsDeleteModalOpen(false);
  };

  const renderImage = (image: string | File) => {
    if (typeof image === 'string') {
      return image;
    }
    return URL.createObjectURL(image); // Convert File to a URL
  };

  // Generate the link for the wishlist
  const wishlistLink = `https://example.com/wishlist/${wishlistId}`;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 text-black">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-3xl mr-2">{wishlistEmoji}</span> {/* Display the emoji */}
          <h2 className="text-2xl font-bold text-black">{wishlistName}</h2>
        </div>
        <div className="mt-4 md:mt-0 flex justify-center md:justify-end">
          <div className="flex space-x-2">
            <Button onClick={() => setIsAddItemModalOpen(true)} size="sm" className="w-24">
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
              {typeof item.image === 'string' ? (
                <Image
                  src={renderImage(item.image)}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-md"
                />
              ) : (
                // For dynamic images (File objects), we need to use <img> tag
                <img
                  src={renderImage(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-t-md"
                />
              )}
            </div>
            <CardContent className="p-2 md:p-4">
              <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">{item.name}</h3>
              <Progress value={(item.contributed / item.price) * 100} className="mb-1 md:mb-2" />
              <p className="text-xs md:text-sm text-gray-600">
                {item.contributed}₽ raised of {item.price}₽
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

      {/* "Delete Wishlist" button at the bottom right */}
      <div className="flex justify-end mt-6">
        <Button variant="destructive" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete Wishlist
        </Button>
      </div>

      {/* AddItemModal for adding new items */}
      {isAddItemModalOpen && (
        <AddItemModal
          isOpen={isAddItemModalOpen}
          onClose={() => setIsAddItemModalOpen(false)}
          onAddItem={handleAddItem}
        />
      )}

      {/* ShareWishlistModal */}
      {isShareModalOpen && (
        <Modal onClose={() => setIsShareModalOpen(false)}>
          <div className="p-4 text-black flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">Share Wishlist</h2>
            <QRCode value={wishlistLink} size={200} />
            <div className="mt-4 w-full">
              <p className="text-sm mb-2">Share this link:</p>
              <div className="flex items-center">
                <input
                  type="text"
                  readOnly
                  value={wishlistLink}
                  className="border border-gray-300 rounded-md p-2 flex-1"
                />
                <Button onClick={() => navigator.clipboard.writeText(wishlistLink)} className="ml-2">
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation modal for deletion */}
      {isDeleteModalOpen && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <div className="p-4 text-black">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete the &quot;{wishlistName}&quot; wishlist? This action cannot
              be undone.
            </p>
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
