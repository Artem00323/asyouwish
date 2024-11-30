'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Share2, Trash2, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Modal } from '@/components/ui/modal';
import { AddItemModal } from '@/components/add-item-component';
import QRCode from 'react-qr-code';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/components/backend/firebase';
import { Item } from '@/lib/db';
import { Wishlist } from './ui/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

interface ItemData {
  name: string;
  image?: string | File;
  price: number;
  description: string;
}

type WishlistItem = {
  id: number;
  wishlist_id: string;
  name: string;
  image: string;
  price: number;
  contributed: number;
  description: string;
};

type YourWishlistComponentProps = {
  wishlistId: string; // UUID
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

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Get current user
  const [user] = useAuthState(auth);

  // Fetch items when the component mounts or wishlistId changes
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoadingItems(true);
      try {
        const response = await fetch('/api/getWishlistItems', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ wishlist_id: wishlistId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }

        const data: { items: Item[] } = await response.json();

        const itemsFromDb: WishlistItem[] = data.items.map((item) => ({
          id: item.id,
          wishlist_id: item.wishlist_id,
          name: item.name,
          image: item.image,
          price: item.price,
          contributed: item.contributed,
          description: item.description,
        }));

        setWishlistItems(itemsFromDb);
      } catch (err) {
        console.error('Error fetching items:', err);
      } finally {
        setIsLoadingItems(false);
      }
    };

    fetchItems();
  }, [wishlistId]);

  // Function to add a new item to the wishlist
  const handleAddItem = async (newItem: ItemData) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();

      // Handle image upload separately if image is a File
      let imageUrl = '';
      if (newItem.image) {
        if (typeof newItem.image === 'string') {
          imageUrl = newItem.image;
        } else if (newItem.image instanceof File) {
          const reader = new FileReader();
          reader.readAsDataURL(newItem.image);
          await new Promise((resolve) => {
            reader.onload = () => {
              imageUrl = reader.result as string;
              resolve(null);
            };
          });
        }
      }

      const response = await fetch('/api/addItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wishlist_id: wishlistId,
          name: newItem.name,
          image: imageUrl,
          price: newItem.price,
          description: newItem.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      const data = await response.json();

      const addedItem: WishlistItem = {
        id: data.item.id,
        wishlist_id: data.item.wishlist_id,
        name: data.item.name,
        image: data.item.image,
        price: Number(data.item.price),
        contributed: Number(data.item.contributed),
        description: data.item.description,
      };

      setWishlistItems([...wishlistItems, addedItem]);
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();

      const response = await fetch('/api/deleteItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleShareWishlist = () => {
    setIsShareModalOpen(true);
  };

  const handleItemDetails = (id: number) => {
    const item = wishlistItems.find(item => item.id === id);
    if (item) {
      setSelectedItem(item);
      setIsDetailsModalOpen(true);
    }
  };

  // Function to delete the wishlist
  const handleDeleteWishlist = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();

      const response = await fetch('/api/deleteWishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add token to header
        },
        body: JSON.stringify({
          wishlist_id: wishlistId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete wishlist');
      }

      // Call the callback to remove the wishlist from parent component
      onDeleteWishlist(wishlistId);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Error deleting wishlist:', err);
    }
  };

  const renderImage = (image: string) => {
    return image;
  };

  // State to hold the wishlist link
  const [wishlistLink, setWishlistLink] = useState('');

  useEffect(() => {
    // Generate the correct shared wishlist URL
    const baseUrl = window.location.origin;
    setWishlistLink(`${baseUrl}/shared-wishlist/${wishlistId}`);
  }, [wishlistId]);

  const toggleShowMore = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncateDescription = (description: string, length: number) => {
    if (description.length <= length) return description;
    return description.substring(0, length) + '...';
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onBack} 
            className="mr-2 bg-background text-primary hover:bg-primary hover:text-background transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-4xl mr-2">{wishlistEmoji}</span>
          <h2 className="text-3xl font-bold text-primary">{wishlistName}</h2>
        </div>
        <div className="mt-4 md:mt-0 flex justify-center md:justify-end">
          <div className="flex space-x-2">
            <Button onClick={() => setIsAddItemModalOpen(true)} size="sm" className="w-24">
              <PlusCircle className="mr-2 h-4 w-4" /> Add
            </Button>
            <Button
              onClick={() => {
                // Track the share wishlist goal
                // @ts-ignore
                window.ym && window.ym(98829853, 'reachGoal', 'Share wishlist', {
                  wishlist_id: wishlistId,
                  wishlist_name: wishlistName
                });
                handleShareWishlist();
              }}
              variant="outline"
              size="sm"
              className="w-24 text-primary"
            >
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </div>
      </div>

      {isLoadingItems ? (
        <div className="text-foreground">Loading items...</div>
      ) : (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 md:gap-4">
          {wishlistItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card flex flex-col"
            >
              <div className="relative w-full h-40 md:h-48">
                <Image
                  src={renderImage(item.image)}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-md"
                />
              </div>
              <CardContent className="p-2 md:p-4 flex-grow flex flex-col">
                <div className="h-14 mb-2">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground line-clamp-2">
                    {item.name}
                  </h3>
                </div>
                <Progress
                  value={(item.contributed / item.price) * 100}
                  className="mb-1 md:mb-2"
                />
                <p className="text-xs md:text-sm text-muted-foreground mt-auto">
                  {item.contributed}₽ raised of {item.price}₽
                </p>
              </CardContent>
              <CardFooter className="bg-secondary p-2 md:p-4 flex justify-between">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash2 className="mr-1 md:mr-2 h-4 w-4" />{' '}
                  <span className="hidden md:inline">Delete</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleItemDetails(item.id)}>
                  <Info className="mr-1 md:mr-2 h-4 w-4" />{' '}
                  <span className="hidden md:inline">Details</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

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
            {wishlistLink && <QRCode value={wishlistLink} size={200} />}
            <div className="mt-4 w-full">
              <p className="text-sm mb-2">Share this link:</p>
              <div className="flex items-center">
                <input
                  type="text"
                  readOnly
                  value={wishlistLink}
                  className="border border-gray-300 rounded-md p-2 flex-1"
                />
                <Button
                  onClick={() => navigator.clipboard.writeText(wishlistLink)}
                  className="ml-2"
                >
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
              Are you sure you want to delete the &quot;{wishlistName}&quot; wishlist? This action
              cannot be undone.
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

      {/* Item Details Modal */}
      {isDetailsModalOpen && selectedItem && (
        <Dialog open={isDetailsModalOpen} onOpenChange={() => setIsDetailsModalOpen(false)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Item Details</DialogTitle>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto px-4">
              <Card className="border-none shadow-none">
                <CardContent className="p-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="mt-4 border border-gray-200">
                      <CardContent className="p-4">
                        <div className="relative w-full h-40 mb-4 overflow-hidden rounded-md">
                          <Image
                            src={selectedItem.image}
                            alt={selectedItem.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{selectedItem.name}</h3>
                        <p className="text-sm text-violet-600 font-medium mb-2">
                          {Number(selectedItem.price).toFixed(2)}₽
                        </p>
                        <p className="text-sm text-gray-600">
                          {showFullDescription
                            ? selectedItem.description
                            : truncateDescription(selectedItem.description, 100)}
                          {selectedItem.description.length > 100 && (
                            <button 
                              className="text-violet-600 hover:text-violet-700 ml-1 focus:outline-none" 
                              onClick={toggleShowMore}
                            >
                              {showFullDescription ? 'Show less' : 'Show more'}
                            </button>
                          )}
                        </p>
                        <Progress
                          value={(selectedItem.contributed / selectedItem.price) * 100}
                          className="mt-4"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {selectedItem.contributed}₽ raised of {selectedItem.price}₽
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
