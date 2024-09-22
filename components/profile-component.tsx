// components/ui/profile-component.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // Updated import
import { User, Mail, Gift, Calendar, Settings, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EventType {
  type: string;
  date: Date;
  title: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: Date;
  wishlistCount: number;
  friendsCount: number;
  event: EventType;
}

export function ProfileComponent() {
  const router = useRouter(); // Initialize the router

  // Example user data. Replace with real data fetching logic.
  const user: UserProfile = {
    id: 'bob456',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    avatar: '/avatars/Bob.jpg', // Corrected path
    joinDate: new Date('2023-01-15'),
    wishlistCount: 3,
    friendsCount: 42,
    event: {
      type: 'event',
      date: new Date(2024, 9, 20), // October is month index 9
      title: "Graduation",
    },
  };

  // Handler for logging out
  const handleLogout = () => {
    // Implement your logout logic here.
    // This could involve clearing tokens from localStorage, cookies, or calling an API endpoint.
    // Example for clearing localStorage:
    // localStorage.removeItem('authToken');
    
    // After logout logic, redirect to the modern landing page
    router.push('/modern-landing-page');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6">Profile</h2>
      
      {/* User Information Card */}
      <Card className='hover:shadow-lg transition-shadow duration-300'>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-indigo-600" />
              <span>Joined {user.joinDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="text-indigo-600" />
              <span>{user.wishlistCount} Wishlists</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="text-indigo-600" />
              <span>{user.friendsCount} Friends</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings Card */}
      <Card className='hover:shadow-lg transition-shadow duration-300'>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Mail className="mr-2 h-4 w-4" /> Update Email
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" /> Preferences
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:bg-gray-200 hover:text-red-700 transition-colors duration-200"
            onClick={handleLogout} // Attach the logout handler
          >
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity Card */}
      <Card className='hover:shadow-lg transition-shadow duration-300'>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-center gap-2">
              <Gift className="text-indigo-600" />
              <span>Added new item to Summer Wishlist</span>
            </li>
            <li className="flex items-center gap-2">
              <User className="text-indigo-600" />
              <span>Became friends with Jane Smith</span>
            </li>
            <li className="flex items-center gap-2">
              <Calendar className="text-indigo-600" />
              <span>Created Birthday Wishlist</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
