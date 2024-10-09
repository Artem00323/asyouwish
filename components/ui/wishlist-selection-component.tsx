'use client';

import { WishlistSelectButton } from '@/components/ui/wishlist-select-button';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

// Define the Wishlist type
type Wishlist = {
  id: string;
  name: string;
  date: Date;
  emoji: string;
  eventType: string;
};

type WishlistSelectionComponentProps = {
  wishlists: Wishlist[];
  setWishlists: React.Dispatch<React.SetStateAction<Wishlist[]>>;
  onSelectWishlist: (id: string) => void;
};

export function WishlistSelectionComponent({
  wishlists,
  setWishlists,
  onSelectWishlist,
}: WishlistSelectionComponentProps) {
  const [isAddWishlistModalOpen, setIsAddWishlistModalOpen] = useState(false);

  // Function to handle adding a new wishlist
  const handleAddWishlist = (newWishlist: Omit<Wishlist, 'id'>) => {
    const newWishlistData: Wishlist = {
      id: (wishlists.length + 1).toString(), // Assign a new ID
      ...newWishlist,
    };
    setWishlists([...wishlists, newWishlistData]); // Add the new wishlist to the list
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-800">Your Wishlists</h2>
        <Button onClick={() => setIsAddWishlistModalOpen(true)} size="sm" className="w-24">
          <PlusCircle className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wishlists.map((wishlist) => (
          <WishlistSelectButton
            key={wishlist.id}
            id={wishlist.id}
            name={wishlist.name}
            date={wishlist.date}
            emoji={wishlist.emoji}
            eventType={wishlist.eventType}
            onSelect={onSelectWishlist}
          />
        ))}
      </div>

      {/* AddWishlistModal */}
      {isAddWishlistModalOpen && (
        <AddWishlistModal
          onClose={() => setIsAddWishlistModalOpen(false)}
          onAddWishlist={handleAddWishlist}
        />
      )}
    </div>
  );
}

// Define the AddWishlistModal component
type AddWishlistModalProps = {
  onClose: () => void;
  onAddWishlist: (wishlist: Omit<Wishlist, 'id'>) => void;
};

function AddWishlistModal({ onClose, onAddWishlist }: AddWishlistModalProps) {
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState('birthday');
  const [date, setDate] = useState('');

  // Map event types to emojis
  const eventEmojis: { [key: string]: string } = {
    birthday: '🎂',
    newyear: '🎉',
    wedding: '💍',
    graduation: '🎓',
  };

  const handleSubmit = () => {
    const emoji = eventEmojis[eventType] || '🎁'; // Set emoji based on event type or default
    onAddWishlist({
      name,
      date: new Date(date),
      emoji,
      eventType,
    });
    onClose();
    // Reset form
    setName('');
    setDate('');
    setEventType('birthday');
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-4 text-black">
        <h2 className="text-lg font-semibold mb-4">Add New Wishlist</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {/* Replace description with date input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Event Date</label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Event Type</label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="birthday">Birthday</option>
            <option value="newyear">New Year</option>
            <option value="wedding">Wedding</option>
            <option value="graduation">Graduation</option>
          </select>
        </div>
        {/* Display the emoji based on selected event */}
        <div className="mb-4 flex flex-col items-center">
          <span className="text-6xl">{eventEmojis[eventType] || '🎁'}</span>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add</Button>
        </div>
      </div>
    </Modal>
  );
}
