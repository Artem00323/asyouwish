// lib/db.ts
import { sql } from '@vercel/postgres';
import { Event } from '@/components/ui/types';

export interface User {
  user_id: string;
  name: string;
  email: string;
  password_hash: string;
  join_date: string;
  updated_at: string;
  avatar_url?: string;
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

export interface UserQuizAnswers {
  id: string;
  user_id: string;
  birth_date: string;
  heard_from: string;
  created_at?: string;
}

export interface Friend {
  user_id: string;
  name: string;
  avatar_url?: string;
  avatar?: string;
};

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
    SELECT user_id, name, email, avatar_url
    FROM users
    WHERE user_id = ${user_id}
  `;
  return rows[0] || null;
};

// Function to add a friendship
export const addFriendship = async (
  user_id: string,
  friend_id: string,
  status: 'pending' | 'accepted' | 'rejected'
): Promise<void> => {
  const existingFriendship = await sql`
    SELECT * FROM friendships
    WHERE (user_id = ${user_id} AND friend_id = ${friend_id})
    OR (user_id = ${friend_id} AND friend_id = ${user_id})
  `;

  if (existingFriendship.rows.length > 0) {
    throw new Error('Friendship already exists');
  }

  await sql`
    INSERT INTO friendships (user_id, friend_id, status, created_at, updated_at)
    VALUES (${user_id}, ${friend_id}, ${status}, NOW(), NOW())
  `;
};

// Function to get friends for a user
export const getFriendsForUser = async (user_id: string): Promise<User[]> => {
  const { rows } = await sql<User>`
    SELECT u.user_id, u.name, u.email, u.avatar_url
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

// Add this interface definition
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  wishlistCount: number;
  friendsCount: number;
  event: EventType | null;
  recentActivity: Array<{
    type: string;
    title: string;
    date: string;
  }>;
}

// Also add this interface if not already defined
export interface EventType {
  type: string;
  date: Date;
  title: string;
}

export const getUserProfile = async (user_id: string): Promise<UserProfile> => {
  const { rows: [user] } = await sql<User>`
    SELECT user_id, name, email, avatar_url, created_at as join_date
    FROM users
    WHERE user_id = ${user_id};
  `;

  if (!user) {
    throw new Error('User not found');
  }

  const { rows: wishlists } = await sql<{ count: number }>`
    SELECT COUNT(*) as count
    FROM wishlists
    WHERE user_id = ${user_id};
  `;

  const { rows: friends } = await sql<{ count: number }>`
    SELECT COUNT(*) as count
    FROM friendships
    WHERE (user_id = ${user_id} OR friend_id = ${user_id}) AND status = 'accepted';
  `;

  const { rows: [latestEvent] } = await sql<EventType>`
    SELECT name as title, date, event_type as type
    FROM wishlists
    WHERE user_id = ${user_id}
    ORDER BY date DESC
    LIMIT 1;
  `;

  const { rows: recentActivity } = await sql<{ type: string; title: string; date: string }>`
    (SELECT 'wishlist_created' as type, name as title, created_at as date
     FROM wishlists
     WHERE user_id = ${user_id})
    UNION ALL
    (SELECT 'item_added' as type, items.name as title, items.created_at as date
     FROM items
     JOIN wishlists ON items.wishlist_id = wishlists.id
     WHERE wishlists.user_id = ${user_id})
    UNION ALL
    (SELECT 'friendship_created' as type, users.name as title, friendships.created_at as date
     FROM friendships
     JOIN users ON (friendships.friend_id = users.user_id)
     WHERE friendships.user_id = ${user_id} AND friendships.status = 'accepted')
    ORDER BY date DESC
    LIMIT 5;
  `;

  return {
    id: user.user_id,
    name: user.name,
    email: user.email,
    avatar: user.avatar_url || `/avatars/default.png`,
    joinDate: user.join_date,
    wishlistCount: wishlists[0].count,
    friendsCount: friends[0].count,
    event: latestEvent || null,
    recentActivity: recentActivity,
  };
};

export const getEventsForUserAndFriends = async (
  userId: string, 
  startDate: Date, 
  endDate: Date
): Promise<Event[]> => {
  const { rows } = await sql`
    SELECT 
      w.id::text,
      w.name as title,
      w.date,
      w.event_type as type,
      w.user_id as "friendId",
      u.name as friendname
    FROM wishlists w
    JOIN users u ON w.user_id = u.user_id
    LEFT JOIN friendships f ON 
      (f.user_id = ${userId} AND f.friend_id = w.user_id) OR 
      (f.friend_id = ${userId} AND f.user_id = w.user_id)
    WHERE (
      w.user_id = ${userId} OR 
      (f.status = 'accepted' AND (
        f.user_id = ${userId} OR 
        f.friend_id = ${userId}
      ))
    )
    AND w.date >= ${startDate.toISOString()}
    AND w.date <= ${endDate.toISOString()}
    ORDER BY w.date ASC
  `;

  return rows.map(row => ({
    id: row.id,
    title: row.title,
    date: new Date(row.date).toISOString(),
    type: row.type,
    friendId: row.friendId,
    friendname: row.friendname
  }));
};

export const searchUsersByName = async (searchQuery: string): Promise<User[]> => {
  const { rows } = await sql<User>`
    SELECT user_id, name, email, avatar_url
    FROM users
    WHERE 
      unaccent(LOWER(name)) LIKE unaccent(LOWER(${`%${searchQuery}%`}))
    LIMIT 5;
  `;
  return rows;
};

export const getOutgoingAndDeclinedRequests = async (user_id: string): Promise<{ outgoing: Friend[]; declined: Friend[] }> => {
  const { rows } = await sql`
    SELECT 
      u.user_id,
      u.name,
      u.avatar_url,
      f.status
    FROM users u
    JOIN friendships f ON f.friend_id = u.user_id
    WHERE f.user_id = ${user_id} 
    AND f.status IN ('pending', 'rejected');
  `;

  return {
    outgoing: rows.filter(row => row.status === 'pending').map(row => ({
      user_id: row.user_id,
      name: row.name,
      avatar_url: row.avatar_url
    })),
    declined: rows.filter(row => row.status === 'rejected').map(row => ({
      user_id: row.user_id,
      name: row.name,
      avatar_url: row.avatar_url
    }))
  };
};

export const deleteFriendship = async (user_id: string, friend_id: string): Promise<void> => {
  await sql`
    DELETE FROM friendships 
    WHERE user_id = ${user_id} 
    AND friend_id = ${friend_id} 
    AND status = 'pending'
  `;
};

export const getFriendWishlists = async (friend_id: string): Promise<Wishlist[]> => {
  const { rows: wishlists } = await sql<Wishlist>`
    SELECT w.*, u.name as friend_name
    FROM wishlists w
    JOIN users u ON w.user_id = u.user_id
    WHERE w.user_id = ${friend_id}
    ORDER BY w.date ASC;
  `;

  // Get items for each wishlist
  const wishlistsWithItems = await Promise.all(
    wishlists.map(async (wishlist) => {
      const items = await getItemsForWishlist(wishlist.id);
      return { ...wishlist, items };
    })
  );

  return wishlistsWithItems;
};

export const getFriendWishlistItems = async (wishlist_id: string, user_id: string): Promise<Item[]> => {
  const { rows } = await sql<Item>`
    SELECT i.*, w.user_id as owner_id
    FROM items i
    JOIN wishlists w ON i.wishlist_id = w.id
    JOIN friendships f ON 
      (f.user_id = ${user_id} AND f.friend_id = w.user_id)
      OR (f.friend_id = ${user_id} AND f.user_id = w.user_id)
    WHERE w.id = ${wishlist_id}
    AND f.status = 'accepted'
    ORDER BY i.created_at DESC;
  `;
  return rows;
};

