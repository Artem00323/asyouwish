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
    <Card key={id} className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatar || '/default-avatar.jpg'} alt={name} />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base font-semibold">{name}</CardTitle>
          <p className="text-sm text-gray-500 flex items-center">
            <UserPlus className="w-4 h-4 mr-1" /> Friend Request
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1" onClick={() => onAccept(id)}>
            Accept
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => onReject(id)}>
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
