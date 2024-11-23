'use client';

import React, { useState, useEffect } from 'react';
import { EventCard } from '@/components/ui/EventCard';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gift } from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";
import { useRouter, useSearchParams } from 'next/navigation';

interface WishlistItem {
  id: number;
  wishlist_id: string;
  name: string;
  image: string;
  price: number;
  contributed: number;
  description: string;
  created_at?: string;
  updated_at?: string;
}

interface Wishlist {
  id: string;
  user_id: string;
  name: string;
  date: string;
  emoji: string;
  event_type: string;
  created_at?: string;
  updated_at?: string;
  items: WishlistItem[];
}

export function FriendWishlistView({ friendId }: { friendId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCalendar = searchParams.get('from') === 'calendar';
  const wishlistId = searchParams.get('wishlist');
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(null);
  const [friendName, setFriendName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (wishlistId && wishlists.length > 0) {
      const wishlist = wishlists.find(w => w.id === wishlistId);
      if (wishlist) {
        setSelectedWishlist(wishlist);
      }
    }
  }, [wishlistId, wishlists]);

  useEffect(() => {
    const fetchFriendWishlists = async () => {
      try {
        const currentUserId = localStorage.getItem('user_id');
        if (!currentUserId) {
          setError('User not authenticated');
          return;
        }

        const response = await axios.post('/api/getFriendWishlists', {
          friend_id: friendId,
          user_id: currentUserId
        });
        
        if (response.data && response.data.wishlists) {
          setWishlists(response.data.wishlists);
          setFriendName(response.data.friendName);
        } else {
          setError('No wishlists found');
        }
      } catch (error) {
        console.error('Error fetching friend wishlists:', error);
        setError('Unable to load wishlists');
      } finally {
        setLoading(false);
      }
    };

    fetchFriendWishlists();
  }, [friendId]);

  const handleBack = () => {
    if (selectedWishlist) {
      setSelectedWishlist(null);
    } else if (fromCalendar) {
      router.push('/wishlist?tab=calendar-events');
    } else {
      router.push('/wishlist?tab=friends-wishlists');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>;
  }

  if (error) {
    return (
      <Card className="p-8 text-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Gift className="w-12 h-12 text-gray-400" />
          <h4 className="text-lg font-medium text-gray-600">Error</h4>
          <p className="text-gray-500">{error}</p>
        </div>
      </Card>
    );
  }

  // Render individual wishlist view
  if (selectedWishlist) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleBack}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-3xl font-bold text-primary">{selectedWishlist.name}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedWishlist.items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={item.image || '/placeholder.png'}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold line-clamp-1">{item.name}</h3>
                  <p className="text-sm font-medium text-primary">
                    {item.price}₽
                  </p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {item.description}
                </p>
                <Progress 
                  value={(item.contributed / item.price) * 100}
                  className="mb-2"
                />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{item.contributed}₽ raised</span>
                  <span>{((item.contributed / item.price) * 100).toFixed(0)}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Render wishlist selection view
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleBack}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold text-primary">{friendName}&apos;s Wishlists</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlists.map((wishlist) => (
          <EventCard
            key={wishlist.id}
            id={wishlist.id}
            name={wishlist.name}
            emoji={wishlist.emoji}
            date={new Date(wishlist.date)}
            eventType="Wishlist"
            onSelect={() => setSelectedWishlist(wishlist)}
            hideEventType={true}
          />
        ))}
      </div>

      {wishlists.length === 0 && (
        <Card className="p-8 text-center bg-gray-50">
          <div className="flex flex-col items-center gap-3">
            <Gift className="w-12 h-12 text-gray-400" />
            <h4 className="text-lg font-medium text-gray-600">No Wishlists</h4>
            <p className="text-gray-500">
              This friend hasn&apos;t created any wishlists yet
            </p>
          </div>
        </Card>
      )}
    </div>
  );
} 