// components/FriendsWishlists.tsx

import React, { useState, useEffect } from 'react';
import { EventCard } from '@/components/ui/EventCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import axios from 'axios';
import { PendingRequestCard } from '@/components/ui/requestCard';

// Define the Friend type
type Friend = {
  user_id: string;
  name: string;
  avatar?: string;
};

export function FriendsWishlists() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [friendIdInput, setFriendIdInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get current user ID (adjust based on your auth implementation)
  const currentUserId = localStorage.getItem('user_id');

  // Fetch friends and pending requests on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUserId) {
          setError('User not authenticated');
          return;
        }

        // Fetch friends
        const friendsResponse = await axios.post('/api/getFriends', {
          user_id: currentUserId,
        });
        setFriends(friendsResponse.data.friends);

        // Fetch pending friend requests
        const pendingResponse = await axios.get('/api/getPendingFriendRequests', {
          params: {
            user_id: currentUserId,
          },
        });

        setPendingRequests(pendingResponse.data.pendingRequests);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [currentUserId]);

  const handleAddFriend = async () => {
    setError(null);
    setSuccessMessage(null);
    if (!friendIdInput) {
      setError('Please enter a user ID');
      return;
    }
    if (!currentUserId) {
      setError('User not authenticated');
      return;
    }
    try {
      await axios.post('/api/addFriendship', {
        user_id: currentUserId,
        friend_id: friendIdInput,
      });
      setSuccessMessage('Friend request sent');
      setFriendIdInput('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        setError(errorMessage);
      } else {
        console.error('Error adding friend:', error);
        setError('An error occurred');
      }
    }
  };

  const handleRespondToRequest = async (friend_id: string, action: 'accept' | 'reject') => {
    try {
      if (!currentUserId) {
        setError('User not authenticated');
        return;
      }
      await axios.post('/api/respondToFriendRequest', {
        user_id: currentUserId,
        friend_id,
        action,
      });
      // Update the pending requests and friends list
      setPendingRequests((prev) => prev.filter((req) => req.user_id !== friend_id));
      if (action === 'accept') {
        // Fetch updated friends list
        const friendsResponse = await axios.post('/api/getFriends', {
          user_id: currentUserId,
        });
        setFriends(friendsResponse.data.friends);
      }
    } catch (error) {
      console.error('Error responding to friend request:', error);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-primary mb-6">Friends&apos; Wishlists</h2>

      <div className="space-y-6 p-6 bg-card rounded-lg">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Enter friend's user ID"
              className="pl-4 pr-4 py-2 w-full bg-background text-foreground"
              value={friendIdInput}
              onChange={(e) => setFriendIdInput(e.target.value)}
            />
          </div>
          <Button
            className="flex items-center justify-center space-x-2 w-full sm:w-auto"
            onClick={handleAddFriend}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Friend</span>
          </Button>
        </div>

        {error && <div className="text-red-500">{error}</div>}
        {successMessage && <div className="text-green-500">{successMessage}</div>}

        {/* Pending Friend Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-black">Pending Friend Requests</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRequests.map((request) => (
                <PendingRequestCard
                  key={request.user_id}
                  id={request.user_id}
                  name={request.name}
                  avatar={request.avatar}
                  onAccept={() => handleRespondToRequest(request.user_id, 'accept')}
                  onReject={() => handleRespondToRequest(request.user_id, 'reject')}
                />
              ))}
            </div>
          </div>
        )}

        {/* Friends List */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.map((friend) => (
            <EventCard
              key={friend.user_id}
              id={friend.user_id}
              name={friend.name}
              date={new Date()} // Adjust as needed
              avatar={friend.avatar || 'avatars/Me.jpg'}
              eventType="Wishlist"
              link={`/friend-wishlists/${friend.user_id}`}
              hideEventType={true} // Hide the explanatory text
            />
          ))}
        </div>
      </div>
    </>
  );
}
