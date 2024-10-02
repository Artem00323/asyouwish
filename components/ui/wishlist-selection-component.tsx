'use client';

import { WishlistSelectButton } from '@/components/ui/wishlist-select-button';

type Wishlist = {
  id: string;
  name: string;
  description: string;
  image: string;
};

type WishlistSelectionComponentProps = {
  onSelectWishlist: (id: string) => void;
};

export function WishlistSelectionComponent({ onSelectWishlist }: WishlistSelectionComponentProps) {
  // Пример данных для вишлистов
  const wishlists: Wishlist[] = [
    { id: '1', name: 'Tech Gadgets', description: 'All the latest tech gadgets.', image: '/images/tech.jpg' },
    { id: '2', name: 'Home Appliances', description: 'Essentials for a modern home.', image: '/images/home.jpg' },
    { id: '3', name: 'Books', description: 'A collection of must-read books.', image: '/images/books.jpg' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-indigo-800 mb-6">Your Wishlists</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wishlists.map((wishlist) => (
          <WishlistSelectButton
            key={wishlist.id}
            id={wishlist.id}
            name={wishlist.name}
            description={wishlist.description}
            image={wishlist.image}
            onSelect={onSelectWishlist}
          />
        ))}
      </div>
    </div>
  );
}
