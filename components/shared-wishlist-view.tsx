'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gift, LogIn } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { auth } from '@/components/backend/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Modal } from "@/components/ui/modal";
import QRCode from 'react-qr-code';
// import { Item } from '@/lib/db';

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

interface SharedWishlistViewProps {
  wishlistId: string;
}

interface ApiItem {
  id: number;
  wishlist_id: string;
  name: string;
  image: string | null;
  price: string | number;
  contributed: string | number;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse {
  wishlist: {
    id: string;
    user_id: string;
    name: string;
    date: string;
    emoji: string;
    event_type: string;
    created_at?: string;
    updated_at?: string;
  };
  items: ApiItem[];
  ownerName: string;
}

// interface ApiErrorResponse {
//   message: string;
//   errors?: Array<{ message: string }>;
// }

export function SharedWishlistView({ wishlistId }: SharedWishlistViewProps) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [ownerName, setOwnerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [wishlistLink, setWishlistLink] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get<ApiResponse>(`/api/getSharedWishlist/${wishlistId}`);
        
        if (!response.data?.wishlist) {
          throw new Error('No wishlist found');
        }

        const wishlistData: Wishlist = {
          ...response.data.wishlist,
          items: response.data.items.map((item: ApiItem) => ({
            id: item.id,
            wishlist_id: item.wishlist_id,
            name: item.name,
            image: item.image || '/placeholder.png',
            price: Number(item.price),
            contributed: Number(item.contributed || 0),
            description: item.description || '',
            created_at: item.created_at,
            updated_at: item.updated_at
          }))
        };

        setWishlist(wishlistData);
        setOwnerName(response.data.ownerName || 'Unknown');
      } catch (error) {
        console.error('Error fetching shared wishlist:', error);
        setError('Unable to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    if (wishlistId) {
      fetchWishlist();
    }
  }, [wishlistId]);

  useEffect(() => {
    const baseUrl = window.location.origin;
    setWishlistLink(`${baseUrl}/shared-wishlist/${wishlistId}`);
  }, [wishlistId]);

  const handleBack = () => {
    if (user) {
      router.push('/wishlist');
    } else {
      router.push('/');
    }
  };

  const handleSignUp = () => {
    router.push('/modern-landing-page');
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>;
  }

  if (error || !wishlist) {
    return (
      <Card className="p-8 text-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Gift className="w-12 h-12 text-gray-400" />
          <h4 className="text-lg font-medium text-gray-600">Error</h4>
          <p className="text-gray-500">{error || 'Wishlist not found'}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {user && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleBack}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h2 className="text-3xl font-bold text-primary">
            {ownerName}&apos;s {wishlist.name}
          </h2>
        </div>
        {!user && (
          <Button onClick={handleSignUp} className="ml-4">
            <LogIn className="mr-2 h-4 w-4" />
            Sign Up to Contribute
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist?.items?.map((item) => (
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

      {isShareModalOpen && (
        <Modal onClose={() => setIsShareModalOpen(false)}>
          <div className="p-4 text-black flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">Share Wishlist</h2>
            {wishlistLink && <QRCode value={wishlistLink} size={200} />}
            <div className="mt-4 w-full">
              <p className="text-sm mb-2">Share this link:</p>
              <div className="flex items-center">
                <input
                  type="text"
                  readOnly
                  value={wishlistLink}
                  className="border border-gray-300 rounded-md p-2 flex-1"
                />
                <Button
                  onClick={() => navigator.clipboard.writeText(wishlistLink)}
                  className="ml-2"
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
} 