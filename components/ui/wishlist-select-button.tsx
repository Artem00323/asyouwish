// Remove the existing code in WishlistSelectButton.tsx
// And replace it with the following:

import React from 'react';
import { EventCard } from '@/components/ui/EventCard';

type WishlistSelectButtonProps = {
  id: string;
  name: string;
  date: Date;
  emoji: string;
  eventType: string;
  onSelect: (id: string) => void;
};

export function WishlistSelectButton(props: WishlistSelectButtonProps) {
  return (
    <EventCard
      id={props.id}
      name={props.name}
      date={props.date}
      emoji={props.emoji}
      eventType={props.eventType}
      onSelect={props.onSelect}
    />
  );
}
