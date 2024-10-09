import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, ChevronRight } from 'lucide-react';

type WishlistSelectButtonProps = {
  id: string;
  name: string;
  date: Date;
  emoji: string;
  eventType: string;
  onSelect: (id: string) => void;
};

export function WishlistSelectButton({
  id,
  name,
  date,
  emoji,
  eventType,
  onSelect,
}: WishlistSelectButtonProps) {
  return (
    <Card key={id} className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4">
        {/* Display the emoji instead of the avatar */}
        <div className="w-12 h-12 flex items-center justify-center text-4xl">
          {emoji}
        </div>
        <div>
          <CardTitle>{name}</CardTitle>
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
      <CardContent>
        {/* Display the date before the button */}
        <p className="text-sm text-gray-600 mb-4">
          {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <Button variant="outline" className="w-full" onClick={() => onSelect(id)}>
          View Wishlist <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
