"use client"

import { useEffect, useState } from "react"
import { format, addDays } from "date-fns"
import { fetchPancakeData } from "../../lib/api"
import DateSidebar from "../../components/date-sidebar"
import PancakeDisplay from "../../components/pancake-display"

export default function Home() {
  const [pancakeData, setPancakeData] = useState<Record<string, Array<{ hall: string; pancake: string }>>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"))

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchPancakeData()
        setPancakeData(data)
      } catch (err) {
        setError("Failed to load pancake data. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Generate the next 8 days from today
  const generateDates = () => {
    const today = new Date()
    const dates = []

    for (let i = 0; i < 8; i++) {
      const date = addDays(today, i)
      dates.push({
        dateString: format(date, "yyyy-MM-dd"),
        display: format(date, "dd/MM/yyyy"),
        day: format(date, "EEEE"),
        hasPancakes: Boolean(pancakeData[format(date, "yyyy-MM-dd")]?.length),
      })
    }

    return dates
  }

  const dates = generateDates()

  return (
    <div className="flex min-h-screen bg-amber-50">
      <DateSidebar dates={dates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-amber-800 mb-6">Pancake Tracker</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-amber-700">Loading pancake data...</div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
        ) : (
          <PancakeDisplay pancakes={pancakeData[selectedDate] || []} date={selectedDate} />
        )}
      </main>
    </div>
  )
}
