import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';

type PendingRequestCardProps = {
  id: string;
  name: string;
  avatar?: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
};

export function PendingRequestCard({
  id,
  name,
  avatar,
  onAccept,
  onReject,
}: PendingRequestCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar className="h-12 w-12 ring-2 ring-primary/10">
          <AvatarImage src={avatar || '/avatars/default.png'} alt={name} />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-base font-semibold">{name}</CardTitle>
          <p className="text-sm text-gray-500 flex items-center">
            <UserPlus className="w-4 h-4 mr-1" /> Friend Request
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex gap-2">
          <Button 
            variant="default" 
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={() => onAccept(id)}
          >
            Accept
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 text-gray-600 hover:bg-gray-50"
            onClick={() => onReject(id)}
          >
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
