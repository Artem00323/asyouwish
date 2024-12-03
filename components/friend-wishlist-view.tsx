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
import { ContributeModal } from '@/components/contribute-modal';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/components/backend/firebase';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Contributor {
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  amount: number;
  message?: string;
}

interface WishlistItem {
  id: number;
  wishlist_id: string;
  name: string;
  image: string;
  price: number;
  contributed: number;
  description: string;
  contributors?: Contributor[];
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
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const fromCalendar = searchParams.get('from') === 'calendar';
  const wishlistId = searchParams.get('wishlist');
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(null);
  const [friendName, setFriendName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user] = useAuthState(auth);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [showContributors, setShowContributors] = useState(false);
  const [selectedItemContributors, setSelectedItemContributors] = useState<{
    itemName: string;
    contributors: Contributor[];
  } | null>(null);

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

  const handleContribute = async (amount: number, message: string) => {
    if (!user || !selectedItem || !selectedWishlist) return;

    try {
      const response = await fetch('/api/contribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          item_id: selectedItem.id,
          sender_id: user.uid,
          receiver_id: friendId,
          amount: Number(amount.toFixed(2)),
          message,
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const contributorsResponse = await fetch('/api/getContributors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: selectedItem.id }),
      });

      const { contributors } = await contributorsResponse.json();

      const updatedItems = selectedWishlist.items.map(item =>
        item.id === selectedItem.id
          ? {
              ...item,
              contributed: Number(item.contributed || 0) + Number(amount),
              contributors: contributors.map((c: { 
                sender_id: string;
                sender_name: string;
                sender_avatar: string;
                amount: number;
                messages: string;
              }) => ({
                user_id: c.sender_id,
                name: c.sender_name,
                avatar_url: c.sender_avatar,
                amount: Number(c.amount),
                message: c.messages
              }))
            }
          : item
      );

      setSelectedWishlist(prev => prev ? { ...prev, items: updatedItems } : null);
      setIsContributeModalOpen(false);
    } catch {
      alert('Failed to process contribution');
    }
  };

  const ContributorsDialog = ({
    isOpen,
    onClose,
    contributors,
    itemName,
  }: {
    isOpen: boolean;
    onClose: () => void;
    contributors: Contributor[];
    itemName: string;
  }) => {
    const sortedContributors = [...contributors].sort((a, b) => b.amount - a.amount);

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[calc(100%-2rem)] mx-auto sm:w-full max-w-lg rounded-lg">
          <DialogHeader>
            <DialogTitle>Contributors for {itemName}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-4">
              {sortedContributors.map((contributor) => (
                <div key={contributor.user_id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={contributor.avatar_url || '/avatars/default.png'} />
                    <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{contributor.name}</p>
                    {contributor.message && (
                      <p className="text-sm text-muted-foreground mt-1 italic">
                        "{contributor.message}"
                      </p>
                    )}
                  </div>
                  <p className="font-medium whitespace-nowrap">{contributor.amount.toFixed(2)}₽</p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
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
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 hover:bg-transparent flex items-center"
                    onClick={() => {
                      if (item.contributors?.length) {
                        setSelectedItemContributors({
                          itemName: item.name,
                          contributors: item.contributors
                        });
                        setShowContributors(true);
                      }
                    }}
                    disabled={!item.contributors?.length}
                  >
                    <span className="text-sm text-muted-foreground mr-2">
                      {item.contributed}₽ raised
                    </span>
                    {item.contributors && item.contributors.length > 0 && (
                      <div className="flex -space-x-2">
                        {item.contributors.slice(0, 3).map((contributor, index) => (
                          <Avatar
                            key={`${contributor.user_id}-${index}`}
                            className="w-6 h-6 border-2 border-background"
                          >
                            <AvatarImage src={contributor.avatar_url || '/avatars/default.png'} />
                            <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                        {item.contributors.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                            +{item.contributors.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsContributeModalOpen(true);
                    }}
                    disabled={Number(item.contributed) >= Number(item.price)}
                  >
                    {Number(item.contributed) >= Number(item.price) ? 'Fully Funded' : 'Contribute'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedItem && (
          <ContributeModal
            isOpen={isContributeModalOpen}
            onClose={() => {
              setIsContributeModalOpen(false);
              setSelectedItem(null);
            }}
            itemName={selectedItem.name}
            itemPrice={selectedItem.price}
            contributed={selectedItem.contributed}
            onContribute={handleContribute}
          />
        )}

        {selectedItemContributors && (
          <ContributorsDialog
            isOpen={showContributors}
            onClose={() => setShowContributors(false)}
            contributors={selectedItemContributors.contributors}
            itemName={selectedItemContributors.itemName}
          />
        )}
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