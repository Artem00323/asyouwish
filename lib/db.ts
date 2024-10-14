// lib/db.ts
import { sql } from '@vercel/postgres';

export interface User {
  user_id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at?: string;
  updated_at?: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  name: string;
  date: string;
  emoji: string;
  event_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface Item {
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

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export const ensureUserInDatabase = async (userData: User) => {
  const { user_id, name, email, password_hash } = userData;

  await sql`
    INSERT INTO users (user_id, name, email, password_hash, created_at, updated_at)
    VALUES (${user_id}, ${name}, ${email}, ${password_hash}, NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE 
    SET name = EXCLUDED.name,
        email = EXCLUDED.email,
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW();
  `;
};

export const getWishlistsForUser = async (user_id: string): Promise<Wishlist[]> => {
  const { rows } = await sql<Wishlist>`
    SELECT * FROM wishlists WHERE user_id = ${user_id};
  `;
  return rows;
};

export const addWishlist = async (wishlistData: Omit<Wishlist, 'id' | 'created_at' | 'updated_at'>): Promise<Wishlist[]> => {
  const { user_id, name, date, emoji, event_type } = wishlistData;

  const result = await sql<Wishlist[]>`
    INSERT INTO wishlists (user_id, name, date, emoji, event_type, created_at, updated_at)
    VALUES (${user_id}, ${name}, ${date}, ${emoji}, ${event_type}, NOW(), NOW())
    RETURNING *;
  `;

  return result.rows[0];
};

// Функция для удаления списка желаний по его ID
export const deleteWishlistById = async (wishlist_id: string, user_id: string): Promise<void> => {
  await sql`
    DELETE FROM wishlists
    WHERE id = ${wishlist_id} AND user_id = ${user_id};
  `;
};

// Function to get items for a wishlist
export const getItemsForWishlist = async (wishlist_id: string): Promise<Item[]> => {
  const { rows } = await sql<Item>`
    SELECT * FROM items WHERE wishlist_id = ${wishlist_id};
  `;
  return rows;
};

// Function to add a new item
export const addItemToWishlist = async (
  itemData: Omit<Item, 'id' | 'created_at' | 'updated_at' | 'contributed'>
): Promise<Item> => {
  const { wishlist_id, name, image, price, description } = itemData;
  const { rows } = await sql<Item>`
    INSERT INTO items (wishlist_id, name, image, price, description, contributed, created_at, updated_at)
    VALUES (${wishlist_id}, ${name}, ${image}, ${price}, ${description}, 0, NOW(), NOW())
    RETURNING *;
  `;
  return rows[0];
};

// Function to delete an item
export const deleteItemById = async (item_id: number, user_id: string): Promise<void> => {
  await sql`
    DELETE FROM items
    USING wishlists
    WHERE items.id = ${item_id}
    AND items.wishlist_id = wishlists.id
    AND wishlists.user_id = ${user_id};
  `;
};

export const getWishlistById = async (wishlist_id: string): Promise<Wishlist | null> => {
  const { rows } = await sql<Wishlist>`
    SELECT * FROM wishlists WHERE id = ${wishlist_id};
  `;
  return rows[0] || null;
};

// Function to get items by wishlist ID
export const getItemsByWishlistId = async (wishlist_id: string): Promise<Item[]> => {
  const { rows } = await sql<Item>`
    SELECT * FROM items WHERE wishlist_id = ${wishlist_id};
  `;
  return rows;
};

// Function to get a user by user_id
export const getUserById = async (user_id: string): Promise<User | null> => {
  const { rows } = await sql<User>`
    SELECT * FROM users WHERE user_id = ${user_id};
  `;
  return rows[0] || null;
};

// Function to add a friendship
export const addFriendship = async (
  user_id: string,
  friend_id: string,
  status: string = 'pending'
): Promise<Friendship> => {
  // Check if friendship already exists
  const { rows: existingFriendships } = await sql<Friendship>`
    SELECT * FROM friendships
    WHERE 
      (user_id = ${user_id} AND friend_id = ${friend_id})
      OR
      (user_id = ${friend_id} AND friend_id = ${user_id});
  `;

  if (existingFriendships.length > 0) {
    throw new Error('Friendship already exists');
  }

  // Insert new friendship
  const { rows } = await sql<Friendship>`
    INSERT INTO friendships (user_id, friend_id, status, created_at, updated_at)
    VALUES (${user_id}, ${friend_id}, ${status}, NOW(), NOW())
    RETURNING *;
  `;
  return rows[0];
};

// Function to get friends for a user
export const getFriendsForUser = async (user_id: string): Promise<User[]> => {
  const { rows } = await sql<User>`
    SELECT u.*
    FROM users u
    JOIN friendships f ON
      (f.user_id = ${user_id} AND f.friend_id = u.user_id)
      OR (f.friend_id = ${user_id} AND f.user_id = u.user_id)
    WHERE f.status = 'accepted';
  `;
  return rows;
};

// Function to get pending friend requests for a user
export const getPendingFriendRequests = async (user_id: string): Promise<User[]> => {
  const { rows } = await sql<User>`
    SELECT u.*
    FROM users u
    JOIN friendships f ON f.user_id = u.user_id
    WHERE f.friend_id = ${user_id} AND f.status = 'pending';
  `;
  return rows;
};

// Function to update friendship status
export const updateFriendshipStatus = async (
  user_id: string,
  friend_id: string,
  status: 'accepted' | 'rejected'
): Promise<void> => {
  await sql`
    UPDATE friendships
    SET status = ${status}, updated_at = NOW()
    WHERE user_id = ${friend_id} AND friend_id = ${user_id};
  `;
};