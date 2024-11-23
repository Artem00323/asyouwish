'use client';

import React from 'react';
import { SharedWishlistView } from '@/components/shared-wishlist-view';
import { useParams } from 'next/navigation';

export default function SharedWishlistPage() {
  const params = useParams();
  const wishlistId = params.id as string;

  if (!wishlistId) {
    return <div>Invalid wishlist ID</div>;
  }

  return <SharedWishlistView wishlistId={wishlistId} />;
} 