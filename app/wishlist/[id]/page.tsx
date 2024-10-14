// app/wishlist/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Wishlist, Item } from '@/lib/db';

const WishlistPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [wishlistItems, setWishlistItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchWishlist = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/getWishlistById', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ wishlist_id: id }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch wishlist');
        }

        const data = await response.json();

        setWishlist(data.wishlist);
        setWishlistItems(data.items);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!wishlist) {
    return <div>Wishlist not found</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <span className="text-4xl mr-2">{wishlist.emoji}</span>
        <h1 className="text-3xl font-bold">{wishlist.name}</h1>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 md:gap-4">
        {wishlistItems.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative w-full h-40 md:h-48">
              <Image
                src={item.image}
                alt={item.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-md"
              />
            </div>
            <CardContent className="p-2 md:p-4">
              <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">{item.name}</h3>
              <Progress
                value={(item.contributed / item.price) * 100}
                className="mb-1 md:mb-2"
              />
              <p className="text-xs md:text-sm text-gray-600">
                {item.contributed}₽ raised of {item.price}₽
              </p>
            </CardContent>
            <CardFooter className="bg-gray-50 p-2 md:p-4 flex justify-end">
              <Button size="sm">Contribute</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
