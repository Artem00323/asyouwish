'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

type WishlistSelectButtonProps = {
  id: string;
  name: string;
  description: string;
  image: string;
  onSelect: (id: string) => void;
};

export function WishlistSelectButton({ id, name, description, image, onSelect }: WishlistSelectButtonProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full h-40">
        <Image
          src={image}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-t-md"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {/* <Button variant="outline" className="w-full">
          View Wishlist <ChevronRight className="w-4 h-4 ml-2" />
        </Button> */}
        {/* <Button variant="default" size="default" className="w-full" onClick={() => onSelect(id)}>
          View Wishlist
        </Button> */}
        <Button variant="outline" size="default" className="w-full" onClick={() => onSelect(id)}>
          View Wishlist <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
