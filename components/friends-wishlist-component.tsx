import React from 'react'
import { EventCard } from '@/components/ui/EventCard'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserPlus } from 'lucide-react'

// Define the Friend type
type Friend = {
  id: string
  name: string
  avatar: string
}

const friends: Friend[] = [
  { id: 'alice123', name: 'Alice Johnson', avatar: 'avatars/Alice.jpg'},
  { id: 'bob456', name: 'Bob Smith', avatar: 'avatars/Bob.jpg'},
  { id: 'charlie789', name: 'Charlie Brown', avatar: 'avatars/Charlie.jpg'},
  { id: 'david101', name: 'David Lee', avatar: 'avatars/David.jpg'},
]

export function FriendsWishlists() {
  const handleAddFriend = () => {
    // Placeholder function for adding a new friend
    console.log("Add friend functionality to be implemented")
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
      <h2 className="text-3xl font-bold text-primary mb-6">Friends&apos; Wishlists</h2>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Enter friend's name or email"
            className="pl-4 pr-4 py-2 w-full bg-white text-black"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends.map((friend) => (
          <EventCard
            key={friend.id}
            id={friend.id}
            name={friend.name}
            date={new Date()} // Passing a default date to satisfy the prop requirement
            avatar={friend.avatar}
            eventType="Wishlist" // Using a generic event type
            link={`/friend-wishlists/${friend.id}`}
          />
        ))}
      </div>
    </div>
  )
}