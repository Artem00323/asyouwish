// ui/wishlist-selection-component.tsx
'use client';

import { EventCard } from '@/components/ui/EventCard';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/components/backend/firebase';

// Define the Wishlist type with date required
type Wishlist = {
  id: string;
  name: string;
  date: Date; // Date is now required
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-800">Your Wishlists</h2>
        <Button onClick={() => setIsAddWishlistModalOpen(true)} size="sm" className="w-24">
          <PlusCircle className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlists.map((wishlist) => (
          <EventCard
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
          onAddWishlist={(newWishlist) => {
            // Update the wishlists state with the new wishlist
            setWishlists([...wishlists, newWishlist]);
          }}
        />
      )}
    </div>
  );
}

// Define the AddWishlistModal component
type AddWishlistModalProps = {
  onClose: () => void;
  onAddWishlist: (wishlist: Wishlist) => void;
};

function AddWishlistModal({ onClose, onAddWishlist }: AddWishlistModalProps) {
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState('birthday');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user] = useAuthState(auth);

  // New state variables for custom event name and emoji
  const [customEventName, setCustomEventName] = useState('');
  const [customEventEmoji, setCustomEventEmoji] = useState('');

  // Event type to emoji mapping
  const eventEmojis: { [key: string]: string } = {
    birthday: '🎂',
    newyear: '🎉',
    wedding: '💍',
    graduation: '🎓',
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('You need to be logged in to add a wishlist');
      return;
    }
    setIsSubmitting(true);

    // Validate required fields
    if (!name.trim()) {
      alert('Please enter a name for your wishlist');
      setIsSubmitting(false);
      return;
    }

    if (!date.trim()) {
      alert('Please select a date for your wishlist');
      setIsSubmitting(false);
      return;
    }

    // Validate custom event name and emoji
    if (eventType === 'custom') {
      if (!customEventName.trim()) {
        alert('Please enter a custom event name');
        setIsSubmitting(false);
        return;
      }
      if (!customEventEmoji.trim()) {
        alert('Please enter an emoji for your custom event');
        setIsSubmitting(false);
        return;
      }
    }

    const emoji =
      eventType === 'custom' ? customEventEmoji || '🎁' : eventEmojis[eventType] || '🎁';
    const eventTypeName = eventType === 'custom' ? customEventName : eventType;

    const newWishlistData = {
      user_id: user.uid,
      name,
      date, // Date in ISO string format
      emoji,
      event_type: eventTypeName,
    };

    try {
      const response = await fetch('/api/addWishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWishlistData),
      });

      if (!response.ok) {
        throw new Error('Failed to add wishlist');
      }

      const data = await response.json();
      const addedWishlist = data.wishlist;

      // Convert date string to Date object
      addedWishlist.date = new Date(addedWishlist.date);

      // Cast data to Wishlist type
      const wishlist: Wishlist = {
        id: addedWishlist.id,
        name: addedWishlist.name,
        date: addedWishlist.date,
        emoji: addedWishlist.emoji,
        eventType: addedWishlist.event_type,
      };

      onAddWishlist(wishlist);
      onClose();

      // Reset the form
      setName('');
      setDate('');
      setEventType('birthday');
      setCustomEventName('');
      setCustomEventEmoji('');
    } catch (error) {
      console.error('Error adding wishlist:', error);
      alert('An error occurred while adding the wishlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-4 text-black">
        <h2 className="text-lg font-semibold mb-4">Add New Wishlist</h2>
        {/* Wishlist Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {/* Event Date Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Event Date</label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        {/* Event Type Selection */}
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
            <option value="custom">Custom</option>
          </select>
        </div>
        {/* Custom Event Name and Emoji Input */}
        {eventType === 'custom' && (
          <>
            {/* Custom Event Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Custom Event Name</label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={customEventName}
                onChange={(e) => setCustomEventName(e.target.value)}
              />
            </div>
            {/* Emoji Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Emoji</label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-3xl"
                type="text"
                value={customEventEmoji}
                onChange={(e) => setCustomEventEmoji(e.target.value)}
              />
            </div>
          </>
        )}
        {/* Display Selected Emoji */}
        <div className="mb-4 flex flex-col items-center">
          <span className="text-6xl">
            {eventType === 'custom'
              ? customEventEmoji || '🎁'
              : eventEmojis[eventType] || '🎁'}
          </span>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
