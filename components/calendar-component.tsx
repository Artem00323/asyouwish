// calendar-component.tsx
'use client';

import { useState, useEffect } from 'react';
import { Gift, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Event } from '@/components/ui/types';

export function CalendarComponent() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: localStorage.getItem('user_id'),
            startDate: firstDayOfMonth.toISOString(),
            endDate: lastDayOfMonth.toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        console.log('Fetched events:', data.events);
        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [selectedDate]);

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-primary mb-6">Calendar Events</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Calendar events={events} onSelectDate={setSelectedDate} selectedDate={selectedDate} />
        </div>
        {/* Events List */}
        <Card className="p-4 overflow-auto hover:shadow-lg transition-shadow duration-300 bg-card">
          <h3 className="text-xl font-semibold mb-4">Events on {selectedDate.toDateString()}</h3>
          {getEventsForDate(selectedDate).length > 0 ? (
            getEventsForDate(selectedDate).map((event) => (
              <Link href={`/friend-wishlist/${event.friendId}`} key={event.id}>
                <CardContent className="mb-4 p-4 bg-secondary rounded-lg cursor-pointer hover:bg-accent transition-colors">
                  <div className="flex items-center">
                    {event.type === 'birthday' ? (
                      <Gift className="mr-2 h-5 w-5 text-blue-600" />
                    ) : (
                      <CalendarIcon className="mr-2 h-5 w-5 text-blue-600" />
                    )}
                    <span className="font-medium text-foreground">{event.title}</span>
                    <span className="ml-2 text-sm text-gray-500">({event.friendname})</span>
                  </div>
                </CardContent>
              </Link>
            ))
          ) : (
            <p className="text-muted-foreground">No events on this date.</p>
          )}
        </Card>
      </div>
    </>
  );
}
