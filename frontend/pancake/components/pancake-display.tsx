import { format, parseISO } from "date-fns"
import { cn } from "../lib/utils"

interface PancakeDisplayProps {
  pancakes: Array<{
    hall: string
    pancake: string
  }>
  date: string
}

export default function PancakeDisplay({ pancakes, date }: PancakeDisplayProps) {
  const formatHallName = (hall: string) => {
    return hall
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getPancakeColor = (pancakeType: string) => {
    const types = {
      Pancakes: "bg-amber-100 border-amber-300",
      "Chocolate Chip Pancakes": "bg-amber-200 border-amber-400",
      "Pumpkin Pancakes": "bg-orange-100 border-orange-300",
      "Vegan Pancakes": "bg-green-50 border-green-200",
    }

    return types[pancakeType as keyof typeof types] || "bg-yellow-50 border-yellow-200"
  }

  const displayDate = format(parseISO(date), "EEEE, MMMM d, yyyy")

  if (pancakes.length === 0) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">{displayDate}</h2>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-amber-700">No pancakes available on this day. Check another day!</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-amber-800 mb-4">{displayDate}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pancakes.map((item, index) => (
          <div
            key={index}
            className={cn(
              "rounded-lg shadow-md p-6 border-2 transition-transform hover:scale-105",
              getPancakeColor(item.pancake),
            )}
          >
            <h3 className="text-lg font-bold text-amber-900 mb-2">{formatHallName(item.hall)}</h3>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <p className="text-amber-800">{item.pancake}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
