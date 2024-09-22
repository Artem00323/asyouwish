import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

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
      <h2 className="text-3xl font-bold text-indigo-800 mb-6">Friends' Wishlists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedFriends.map((friend) => (
          <Card key={friend.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={friend.avatar} alt={friend.name} />
                <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{friend.name}</CardTitle>
                <p className="text-sm text-gray-500">
                  {friend.event.type === 'birthday' ? (
                    <span className="flex items-center">
                      <Gift className="w-4 h-4 mr-1" /> Birthday
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" /> {friend.event.title}
                    </span>
                  )}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {friend.event.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <Link href={`/friend-wishlist/${friend.id}`} passHref>
                <Button variant="outline" className="w-full">
                  View Wishlist <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}