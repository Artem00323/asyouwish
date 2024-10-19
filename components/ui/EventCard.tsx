// components/ui/EventCard.tsx

import React from 'react';
import { Card, CardTitle } from "@/components/ui/card";
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
  hideEventType?: boolean; // New prop to hide explanatory text
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
  hideEventType = false,
}: EventCardProps) {
  // Format the date in short format for mobile devices
  const formattedDateMobile = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  // Format the date in long format for larger screens
  const formattedDateDesktop = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Determine if we should use onSelect or link
  const isLink = Boolean(link || onSelect);

  // Function to handle click
  const handleClick = () => {
    if (onSelect) {
      onSelect(id);
    }
    // If using link, navigation will be handled by <Link>
  };

  // Build the clickable content for mobile devices
  const MobileCardContent = () => (
    <div className="p-4">
      {/* Top Section */}
      <div className="flex items-center">
        {/* Display Avatar or Emoji */}
        {avatar ? (
          <Avatar className="w-12 h-12">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="w-12 h-12">
            <AvatarFallback>
              <span className="text-xl">{emoji}</span>
            </AvatarFallback>
          </Avatar>
        )}

        {/* Event Type and Date */}
        <div className="ml-4 flex flex-col">
          {!hideEventType && (
            <p className="text-sm text-gray-500 flex items-center">
              {eventType === 'birthday' ? (
                <>
                  <Gift className="w-4 h-4 mr-1" /> Birthday
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-1" /> {eventType}
                </>
              )}
            </p>
          )}
          <p className="text-sm text-gray-500">{formattedDateMobile}</p>
        </div>
      </div>

      {/* Title at the Bottom */}
      <div className="mt-4">
        <CardTitle
          className="text-base font-semibold line-clamp-2 break-words"
          style={{ wordBreak: 'break-word', hyphens: 'auto' }}
        >
          {name}
        </CardTitle>
      </div>
    </div>
  );

  // Build the desktop version of the card
  const DesktopCardContent = () => (
    <div className="p-4">
      {/* Top Section */}
      <div className="flex items-center">
        {/* Display Avatar or Emoji */}
        {avatar ? (
          <Avatar className="w-12 h-12">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="w-12 h-12">
            <AvatarFallback>
              <span className="text-xl">{emoji}</span>
            </AvatarFallback>
          </Avatar>
        )}

        {/* Event Type and Date */}
        <div className="ml-4">
          {!hideEventType && (
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
          )}
          <p className="text-sm text-gray-500">{formattedDateDesktop}</p>
        </div>
      </div>

      {/* Title */}
      <div className="mt-4">
        <CardTitle
          className="text-base font-semibold line-clamp-2 break-words"
          style={{ wordBreak: 'break-word', hyphens: 'auto' }}
        >
          {name}
        </CardTitle>
      </div>

      {/* Button */}
      <div className="mt-4">
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
      </div>
    </div>
  );

  return (
    <Card
      key={id}
      className={`hover:shadow-lg transition-shadow duration-300 ${
        isLink ? 'cursor-pointer' : ''
      }`}
    >
      {/* Mobile Version */}
      <div className="sm:hidden">
        {isLink ? (
          link ? (
            <Link href={link}>
              <a>{MobileCardContent()}</a>
            </Link>
          ) : (
            <button onClick={handleClick} className="w-full text-left">
              {MobileCardContent()}
            </button>
          )
        ) : (
          MobileCardContent()
        )}
      </div>

      {/* Desktop Version */}
      <div className="hidden sm:block">
        {DesktopCardContent()}
      </div>
    </Card>
  );
}
