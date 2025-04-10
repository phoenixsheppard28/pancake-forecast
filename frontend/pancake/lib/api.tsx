export async function fetchPancakeData(): Promise<Record<string, Array<{ hall: string; pancake: string }>>> {
    try {
      const [firstHalfResponse, secondHalfResponse] = await Promise.all([
        fetch("/api/pancake-data-first", {
            headers: {
                "x-api-key": process.env.API_KEY || "",
            },
        }),
        fetch("/api/pancake-data-second", {
            headers: {
                "x-api-key": process.env.API_KEY || "",
            },
        }),
    ]);

  
        if (!firstHalfResponse.ok || !secondHalfResponse.ok) {
          throw new Error(`Failed to fetch pancake data`);
      }

      const firstHalf = await firstHalfResponse.json();
      const secondHalf = await secondHalfResponse.json();

      // Combine the results
      return { ...firstHalf, ...secondHalf };
    } catch (error) {
      console.error("Error fetching pancake data:", error);
      throw error;
    }
  }
  