"use client"
import { cn } from "../lib/utils"

interface DateSidebarProps {
  dates: Array<{
    dateString: string
    display: string
    day: string
    hasPancakes: boolean
  }>
  selectedDate: string
  onSelectDate: (date: string) => void
}

export default function DateSidebar({ dates, selectedDate, onSelectDate }: DateSidebarProps) {
  return (
    <aside className="w-64 bg-amber-700 text-white p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6 text-amber-100">Next 9 Days</h2>
      <div className="space-y-2">
        {dates.map((date) => (
          <button
            key={date.dateString}
            onClick={() => onSelectDate(date.dateString)}
            className={cn(
              "w-full text-left p-3 rounded-md transition-colors",
              selectedDate === date.dateString ? "bg-amber-500 text-white" : "hover:bg-amber-600",
              date.hasPancakes ? "border-l-4 border-yellow-300" : "",
            )}
          >
            <div className="font-medium">{date.day}</div>
            <div className="text-sm opacity-90">{date.display}</div>
            {date.hasPancakes && <div className="text-xs mt-1 text-yellow-200">Pancakes available!</div>}
          </button>
        ))}
      </div>
    </aside>
  )
}
