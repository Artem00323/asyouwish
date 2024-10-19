// components/ui/profile-component.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Gift, Calendar, Settings, LogOut, PlusCircle, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { EditProfileComponent } from './edit-profile-component';
import { PreferencesComponent } from './preferences-component';

interface EventType {
  type: string;
  date: Date;
  title: string;
}

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

export function ProfileComponent() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) {
      return 'Unknown date';
    }
    return format(date, 'PP'); // This will format the date as "Oct 10, 2024"
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/getUserProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: localStorage.getItem('user_id') }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUser(data.userProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    router.push('/modern-landing-page');
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async (updatedProfile: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/updateUserProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
          name: updatedProfile.name,
          avatar_url: updatedProfile.avatar,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser((prevUser) => ({
        ...prevUser!,
        ...updatedUser,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      // You might want to show an error message to the user here
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error loading user profile</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-indigo-800 mb-6">Profile</h2>
      
      {isEditing ? (
        <EditProfileComponent user={user} onSave={handleSaveProfile} onCancel={() => setIsEditing(false)} />
      ) : showPreferences ? (
        <PreferencesComponent 
          onSave={(preferences) => {
            // Handle saving preferences
            console.log('Saving preferences:', preferences);
            setShowPreferences(false);
          }} 
          onCancel={() => setShowPreferences(false)} 
        />
      ) : (
        <>
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
                  <span>Joined {formatDate(user.joinDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="text-indigo-600" />
                  <span>{user.wishlistCount} Wishlists</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="text-indigo-600" />
                  <span>{user.friendsCount} Friends</span>
                </div>
                {user.event && (
                  <div className="flex items-center gap-2">
                    <Calendar className="text-indigo-600" />
                    <span>Next event: {user.event.title} on {formatDate(user.event.date)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Settings Card */}
          <Card className='hover:shadow-lg transition-shadow duration-300'>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start" onClick={handleEditProfile}>
                <User className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
              {/* <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" /> Update Email
              </Button> */}
              <Button variant="outline" className="w-full justify-start" onClick={() => setShowPreferences(true)}>
                <Settings className="mr-2 h-4 w-4" /> Preferences
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:bg-gray-200 hover:text-red-700 transition-colors duration-200"
                onClick={handleLogout}
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
                {user.recentActivity.slice(0, 5).map((activity, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {activity.type === 'wishlist_created' && <Gift className="text-primary flex-shrink-0" />}
                    {activity.type === 'item_added' && <PlusCircle className="text-primary flex-shrink-0" />}
                    {activity.type === 'friendship_created' && <UserPlus className="text-primary flex-shrink-0" />}
                    <span className="truncate flex-grow">
                      {activity.title.length > 30 ? `${activity.title.substring(0, 30)}...` : activity.title}
                    </span>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(new Date(activity.date))}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
