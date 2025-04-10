export async function fetchPancakeData(): Promise<Record<string, Array<{ hall: string; pancake: string }>>> {
    try {
      const response = await fetch("https://umpancake.vercel.app/api/pancake-data")
  
      if (!response.ok) {
        throw new Error(`Failed to fetch pancake data: ${response.status}`)
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error fetching pancake data:", error)
      throw error
    }
  }
  