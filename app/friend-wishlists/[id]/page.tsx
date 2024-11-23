'use client';

import React from 'react';
import { FriendWishlistView } from '@/components/friend-wishlist-view';
import { useParams } from 'next/navigation';

export default function FriendWishlistPage() {
  const params = useParams();
  const friendId = params.id as string;

  if (!friendId) {
    return <div>Invalid friend ID</div>;
  }

  return <FriendWishlistView friendId={friendId} />;
} 