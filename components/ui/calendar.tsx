// calendar.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CustomReactSelect } from '@/components/ui/custom-select';
import { Event } from '@/components/ui/types';

interface CalendarProps {
  events?: Event[];
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

export function Calendar({ events = [], onSelectDate, selectedDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const years = Array.from({ length: 12 }, (_, i) => new Date().getFullYear() - 6 + i);

  const handleMonthChange = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
  };

  const monthOptions = monthNames.map((month, index) => ({ value: index, label: month }));
  const yearOptions = years.map((year) => ({ value: year, label: year.toString() }));

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCells = () => {
    const cells = [];
    const totalCells = 42; // 6 rows * 7 days

    for (let i = 0; i < totalCells; i++) {
      const dayOfMonth = i - firstDayOfMonth + 1;
      const isCurrentMonth = dayOfMonth > 0 && dayOfMonth <= daysInMonth;
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayOfMonth);
      const isToday = isCurrentMonth && date.toDateString() === new Date().toDateString();
      const isSelected = isCurrentMonth && date.toDateString() === selectedDate.toDateString();
      const eventsForDate = events.filter((e) => e.date.toDateString() === date.toDateString());

      cells.push(
        <div
          key={i}
          className={cn(
            'border border-gray p-1 md:p-2 relative cursor-pointer text-black overflow-hidden',
            !isCurrentMonth && 'bg-gray-50 text-gray-400',
            isToday && 'bg-blue-100',
            isSelected && 'bg-indigo-200 border-2 border-indigo-500',
            'transition-colors duration-200 hover:bg-gray-200 hover:scale-105',
            'h-20 md:h-24 w-full',
          )}
          onClick={() => isCurrentMonth && onSelectDate(date)}
        >
          {isCurrentMonth && (
            <>
              <span className={cn('absolute top-1 left-1 text-xs md:text-sm', isSelected && 'font-bold')}>
                {dayOfMonth}
              </span>
              {eventsForDate.length > 0 && (
                <div className="absolute bottom-1 left-1 right-1 flex flex-col gap-1 overflow-hidden">
                  {/* Dots on mobile, titles on desktop */}
                  <div className="flex md:hidden">
                    {eventsForDate.slice(0, 3).map((e) => (
                      <span key={e.id} className="text-indigo-600">
                        <span className="inline-block w-2 h-2 rounded-full bg-indigo-600"></span>
                      </span>
                    ))}
                    {eventsForDate.length > 3 && (
                      <span className="text-xs text-indigo-600">+{eventsForDate.length - 3}</span>
                    )}
                  </div>
                  <div className="hidden md:flex flex-col overflow-hidden">
                    {eventsForDate.slice(0, 2).map((e) => (
                      <span key={e.id} className="text-xs text-indigo-600 truncate">
                        • {e.title}
                      </span>
                    ))}
                    {eventsForDate.length > 2 && (
                      <span className="text-xs text-indigo-600">+{eventsForDate.length - 2}</span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>,
      );
    }

    return cells;
  };

  return (
    <div className="bg-white rounded-lg shadow p-2 md:p-4 hover:shadow-lg transition-shadow duration-300 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 text-black space-x-2">
        {/* Previous Button */}
        <Button onClick={prevMonth} variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Selectors */}
        <div className="flex items-center space-x-2 flex-1 justify-center">
          <CustomReactSelect<number>
            options={monthOptions}
            value={currentDate.getMonth()}
            onChange={handleMonthChange}
            placeholder="Select Month"
            className="w-full max-w-[160px]"
            isSearchable={false}
          />

          <CustomReactSelect<number>
            options={yearOptions}
            value={currentDate.getFullYear()}
            onChange={handleYearChange}
            placeholder="Select Year"
            className="w-full max-w-[100px]"
            isSearchable={false}
          />
        </div>

        {/* Next Button */}
        <Button onClick={nextMonth} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-1 min-w-[300px]">
          {/* Weekday Headers */}
          {weekDays.map((day) => (
            <div key={day} className="text-center font-semibold p-1 md:p-2 text-black text-xs md:text-base">
              <span className="md:hidden">{day.charAt(0)}</span>
              <span className="hidden md:inline">{day}</span>
            </div>
          ))}
          {/* Calendar Cells */}
          {renderCells()}
        </div>
      </div>
    </div>
  );
}
