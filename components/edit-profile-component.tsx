import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from '@/components/profile-component';

interface EditProfileComponentProps {
  user: UserProfile;
  onSave: (updatedProfile: Partial<UserProfile>) => void;
  onCancel: () => void;
}

export function EditProfileComponent({ user, onSave, onCancel }: EditProfileComponentProps) {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);

  const handleSave = () => {
    onSave({ name, avatar });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await fetch('/api/uploadAvatar', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const { avatarUrl } = await response.json();
          setAvatar(avatarUrl);
        } else {
          console.error('Failed to upload avatar');
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    }
  };

  return (
    <Card className='hover:shadow-lg transition-shadow duration-300'>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <Label htmlFor="avatar-upload" className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            Change Avatar
          </Label>
          <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
