import React from 'react';
import { EventCard } from '@/components/ui/EventCard';

// Define the Friend type
type Friend = {
  id: string;
  name: string;
  avatar: string;
  event: {
    type: 'birthday' | 'event';
    date: Date;
    title?: string;
  };
};

const friends: Friend[] = [
  { id: 'alice123', name: 'Alice Johnson', avatar: 'avatars/Alice.jpg', event: { type: 'birthday', date: new Date(2024, 8, 15) } },
  { id: 'bob456', name: 'Bob Smith', avatar: 'avatars/Bob.jpg', event: { type: 'event', date: new Date(2024, 9, 20), title: "Graduation" } },
  { id: 'charlie789', name: 'Charlie Brown', avatar: 'avatars/Charlie.jpg', event: { type: 'event', date: new Date(2024, 8, 5), title: "Wedding" } },
  { id: 'david101', name: 'David Lee', avatar: 'avatars/David.jpg', event: { type: 'birthday', date: new Date(2024, 8, 5) } },
];

export function FriendsWishlists() {
  const sortedFriends = [...friends].sort((a, b) => a.event.date.getTime() - b.event.date.getTime());

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6">Friends&apos; Wishlists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedFriends.map((friend) => (
          <EventCard
            key={friend.id}
            id={friend.id}
            name={friend.name}
            date={friend.event.date}
            avatar={friend.avatar}
            eventType={friend.event.type === 'birthday' ? 'birthday' : friend.event.title || 'Event'}
            link={`/friend-wishlist/${friend.id}`}
          />
        ))}
      </div>
    </div>
  );
}
