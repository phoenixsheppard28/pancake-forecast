
const CACHE_KEY = 'pancake-data-cache';
const CACHE_DATE_KEY = 'pancake-data-cache-date';

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchPancakeData() {
    try {
      // Check if localStorage is available (browser environment)
      if (typeof window !== 'undefined') {
        // Check if we have cached data from today
        const today = new   Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" })
        const cachedDate = localStorage.getItem(CACHE_DATE_KEY);
        const cachedData = localStorage.getItem(CACHE_KEY);

        // If we have valid cached data from today, return it
        if (cachedDate === today && cachedData) {
          console.log(cachedData);
          console.log(today);
          return JSON.parse(cachedData);
        }
      }

      // If cache is invalid or missing, fetch new data
      const firstHalfResponse = fetch("/api/pancake-data-first", {
          headers: { "x-api-key": process.env.API_KEY || "" }
      });

      await delay(500);

      const secondHalfResponse = fetch("/api/pancake-data-second", {
          headers: { "x-api-key": process.env.API_KEY || "" }
      });

      const [firstHalf, secondHalf] = await Promise.all([
        firstHalfResponse.then(res => res.json()),
        secondHalfResponse.then(res => res.json()),
      ]);

      const combinedData = { ...firstHalf, ...secondHalf };

      // Cache the new data if localStorage is available
      if (typeof window !== 'undefined') {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(CACHE_KEY, JSON.stringify(combinedData));
        localStorage.setItem(CACHE_DATE_KEY, today);
      }

      return combinedData;
    } catch (error) {
      console.error("Error fetching pancake date, please reload. error:", error);
      
      // If there's an error but we have cached data, return it as fallback
      if (typeof window !== 'undefined') {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          console.log('Using cached data as fallback due to fetch error');
          return JSON.parse(cachedData);
        }
      }
      
      throw error;
    }
}