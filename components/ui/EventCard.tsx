import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

type EventCardProps = {
  id: string;
  name: string;
  date: Date;
  emoji?: string; // For wishlists
  avatar?: string; // For friends
  eventType: string;
  onSelect?: (id: string) => void; // For wishlists
  link?: string; // For friends
};

export function EventCard({
  id,
  name,
  date,
  emoji,
  avatar,
  eventType,
  onSelect,
  link,
}: EventCardProps) {
  return (
    <Card key={id} className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        {/* Display Avatar or Emoji */}
        {avatar ? (
          <Avatar className="w-12 h-12">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="w-12 h-12">
            <AvatarFallback>
              <span className="text-xl">{emoji}</span>
            </AvatarFallback>
          </Avatar>
        )}
        <div>
          <CardTitle className="text-base font-semibold">{name}</CardTitle>
          <p className="text-sm text-gray-500">
            {eventType === 'birthday' ? (
              <span className="flex items-center">
                <Gift className="w-4 h-4 mr-1" /> Birthday
              </span>
            ) : (
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" /> {eventType}
              </span>
            )}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Display the date before the button */}
        <p className="text-sm text-gray-600 mb-4">
          {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        {onSelect ? (
          <Button variant="outline" className="w-full" onClick={() => onSelect(id)}>
            View Wishlist <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Link href={link || '#'} passHref>
            <Button variant="outline" className="w-full">
              View Wishlists <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
