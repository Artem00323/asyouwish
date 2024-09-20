import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CalendarProps {
  events?: { date: Date; title: string }[]
  onSelectDate: (date: Date) => void
  selectedDate: Date
}

export function Calendar({ events = [], onSelectDate, selectedDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const renderCells = () => {
    const cells = []
    const totalCells = 42 // 6 rows * 7 days

    for (let i = 0; i < totalCells; i++) {
      const dayOfMonth = i - firstDayOfMonth + 1
      const isCurrentMonth = dayOfMonth > 0 && dayOfMonth <= daysInMonth
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayOfMonth)
      const isToday = isCurrentMonth && date.toDateString() === new Date().toDateString()
      const isSelected = isCurrentMonth && date.toDateString() === selectedDate.toDateString()
      const event = events.find(e => e.date.toDateString() === date.toDateString())

      cells.push(
        <div
          key={i}
          className={cn(
            "border border-gray-200 p-2 h-24 relative cursor-pointer",
            !isCurrentMonth && "bg-gray-50",
            isToday && "bg-blue-100",
            isSelected && "bg-indigo-200"
          )}
          onClick={() => isCurrentMonth && onSelectDate(date)}
        >
          {isCurrentMonth && (
            <>
              <span className={cn("absolute top-1 left-1 text-sm", isSelected && "font-bold")}>{dayOfMonth}</span>
              {event && (
                <div className="absolute bottom-1 left-1 right-1 text-xs text-blue-600 truncate">
                  {event.title}
                </div>
              )}
            </>
          )}
        </div>
      )
    }

    return cells
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={prevMonth} variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <Button onClick={nextMonth} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="text-center font-semibold p-2">
            {day}
          </div>
        ))}
        {renderCells()}
      </div>
    </div>
  )
}