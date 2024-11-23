// calendar-component.tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Gift } from 'lucide-react';
import axios from 'axios';
import { Event } from '@/components/ui/types';
import { useRouter } from 'next/navigation';
import { CalendarIcon, CalendarX } from 'lucide-react';

// interface EventResponse extends Omit<Event, 'date'> {
//   date: string;
// }

export function CalendarComponent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const currentUserId = localStorage.getItem('user_id');
        if (!currentUserId) {
          setError('User not authenticated');
          return;
        }

        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const response = await axios.post('/api/events', {
          user_id: currentUserId,
          startDate: firstDay.toISOString(),
          endDate: lastDay.toISOString()
        });

        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Unable to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event: Event) => {
    router.push(`/friend-wishlists/${event.friendId}?wishlist=${event.id}`);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      new Date(event.date).toDateString() === date.toDateString()
    );
  };

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const selectedEvents = getEventsForDate(selectedDate);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <Calendar
          events={events}
          onSelectDate={setSelectedDate}
          selectedDate={selectedDate}
        />
      </div>
      
      <div className="bg-white rounded-lg border flex flex-col h-full">
        <h3 className="text-lg font-semibold p-4 border-b flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          {selectedDate.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })}
        </h3>
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-3">
            {selectedEvents.length > 0 ? (
              selectedEvents.map(event => (
                <Card 
                  key={event.id} 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.friendname}&apos;s {event.type}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <CalendarX className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No events on this date
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const EventCalendar = CalendarComponent;
