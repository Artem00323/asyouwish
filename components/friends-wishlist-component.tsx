// components/FriendsWishlists.tsx

import React, { useState, useEffect } from 'react';
import { EventCard } from '@/components/ui/EventCard';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users } from 'lucide-react';
import axios from 'axios';
import { PendingRequestCard } from '@/components/ui/requestCard';
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from 'use-debounce';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Friend } from '@/lib/db';

type SearchResult = {
  user_id: string;
  name: string;
  avatar_url?: string;
  friendshipStatus?: 'friends' | 'pending' | null;
};

export function FriendsWishlists() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<Friend[]>([]);
  const [declinedRequests, setDeclinedRequests] = useState<Friend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

        // Fetch all data in parallel
        const [friendsResponse, pendingResponse, outgoingAndDeclinedResponse] = await Promise.all([
          axios.post('/api/getFriends', { user_id: currentUserId }),
          axios.get('/api/getPendingFriendRequests', { params: { user_id: currentUserId } }),
          axios.get('/api/getOutgoingAndDeclinedRequests', { params: { user_id: currentUserId } })
        ]);

        setFriends(friendsResponse.data.friends.map((friend: Friend) => ({
          user_id: friend.user_id,
          name: friend.name,
          avatar: friend.avatar_url || '/avatars/default.png',
        })));

        setPendingRequests(pendingResponse.data.pendingRequests);
        setOutgoingRequests(outgoingAndDeclinedResponse.data.outgoing);
        setDeclinedRequests(outgoingAndDeclinedResponse.data.declined);
      } catch (error) {
        console.error('Error fetching friends data:', error);
        setError('Unable to fetch friends data');
      }
    };
    fetchData();
  }, [currentUserId]);

  useEffect(() => {
    const searchUsers = async () => {
      if (debouncedSearchQuery.length < 2) {
        setSearchResults([]);
        setIsDropdownOpen(false);
        return;
      }

      setIsSearching(true);
      setIsDropdownOpen(true);
      try {
        const response = await axios.post('/api/searchUsers', {
          searchQuery: debouncedSearchQuery.toLowerCase(),
          currentUserId,
        });
        
        const users = response.data.users;
        setSearchResults(users);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || 'Search is temporarily unavailable');
        }
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchUsers();
  }, [debouncedSearchQuery, currentUserId]);

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

  const handleSelectUser = async (user: SearchResult) => {
    try {
      if (!currentUserId) {
        setError('User not authenticated');
        return;
      }

      // Send friend request
      await axios.post('/api/addFriendship', {
        user_id: currentUserId,
        friend_id: user.user_id,
      });

      // Add the user to outgoingRequests
      setOutgoingRequests(prev => [...prev, {
        user_id: user.user_id,
        name: user.name,
        avatar_url: user.avatar_url
      }]);

      // Update UI state
      setSearchQuery('');
      setIsDropdownOpen(false);
      setSuccessMessage('Friend request sent to ' + user.name);
      
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        setError(errorMessage);
      } else {
        setError('Unable to send friend request');
      }
    }
  };

  const handleCancelRequest = async (friend_id: string) => {
    try {
      if (!currentUserId) {
        setError('User not authenticated');
        return;
      }

      await axios.post('/api/cancelFriendRequest', {
        user_id: currentUserId,
        friend_id,
      });

      // Update the outgoing requests list
      setOutgoingRequests((prev) => 
        prev.filter((req) => req.user_id !== friend_id)
      );

      setSuccessMessage('Friend request canceled');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error canceling friend request:', error);
      setError('Unable to cancel friend request');
    }
  };

  return (
    <div className="container mx-auto p-4 bg-background">
      <div className="min-h-screen">
        <h2 className="text-3xl font-bold text-primary mb-6">Friends&apos; Wishlists</h2>

        {/* Search and Add Friend Section */}
        <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search friends by name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(e.target.value.length >= 2);
                  }}
                  className="w-full px-4 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-[100%] mt-1 bg-card rounded-lg border shadow-lg z-50">
                    <div className="max-h-[300px] overflow-y-auto">
                      {isSearching ? (
                        <div className="p-4 text-sm text-gray-500 text-center">
                          <span className="inline-block animate-spin mr-2">⭮</span>
                          Searching...
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div>
                          {searchResults.map((user) => (
                            <div
                              key={user.user_id}
                              className={`p-3 flex items-center gap-3 ${
                                user.friendshipStatus ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
                              }`}
                              onClick={() => !user.friendshipStatus && handleSelectUser(user)}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar_url || '/avatars/default.png'} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{user.name}</p>
                                <p className="text-xs text-gray-500">
                                  {user.friendshipStatus === 'friends' && '✓ Already friends'}
                                  {user.friendshipStatus === 'pending' && '⏳ Request pending'}
                                  {!user.friendshipStatus && 'Click to send friend request'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-sm text-gray-500 text-center">
                          No users found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}
            {successMessage && (
              <div className="text-green-500 mt-4 text-sm flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {successMessage}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Friend Requests Section */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Pending Friend Requests ({pendingRequests.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Outgoing Requests Section */}
        {outgoingRequests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Pending Sent Requests ({outgoingRequests.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {outgoingRequests.map((request) => (
                <Card key={request.user_id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.avatar_url || '/avatars/default.png'} />
                      <AvatarFallback>{request.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{request.name}</p>
                      <p className="text-sm text-gray-500">Awaiting response</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleCancelRequest(request.user_id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Declined Requests Section */}
        {declinedRequests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Declined Requests ({declinedRequests.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {declinedRequests.map((request) => (
                <Card key={request.user_id} className="p-4 bg-card">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.avatar_url || '/avatars/default.png'} />
                      <AvatarFallback>{request.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{request.name}</p>
                      <p className="text-sm text-red-500">Request declined</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Friends List Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Your Friends ({friends.length})
          </h3>
          {friends.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <EventCard
                  key={friend.user_id}
                  id={friend.user_id}
                  name={friend.name}
                  avatar={friend.avatar}
                  eventType="Wishlist"
                  link={`/friend-wishlists/${friend.user_id}`}
                  hideEventType={true}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <Users className="w-12 h-12 text-muted-foreground" />
                <h4 className="text-lg font-medium">No Friends Yet</h4>
                <p className="text-muted-foreground">
                  Search for friends above to start connecting
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
