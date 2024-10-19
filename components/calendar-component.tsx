// calendar-component.tsx
'use client';

import { useState } from 'react';
import { Gift, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Event } from '@/components/ui/types';

interface CalendarComponentProps {
  events: Event[];
}

export function CalendarComponent({ events }: CalendarComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
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
                      <Gift className="mr-2 h-5 w-5 text-primary" />
                    ) : (
                      <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                    )}
                    <span className="font-medium text-foreground">{event.title}</span>
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
