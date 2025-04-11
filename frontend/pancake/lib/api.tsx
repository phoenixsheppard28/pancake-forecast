async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchPancakeData() {
    try {
      const fetchOptions = {
        headers: { 
          "x-api-key": process.env.API_KEY || "",
        },
        cache: 'force-cache' as RequestCache
      };

      const firstHalfResponse = fetch("/api/pancake-data-first", fetchOptions);
      await delay(500);
      const secondHalfResponse = fetch("/api/pancake-data-second", fetchOptions);

      const [firstHalf, secondHalf] = await Promise.all([
        firstHalfResponse.then(res => res.json()),
        secondHalfResponse.then(res => res.json()),
      ]);

      return { ...firstHalf, ...secondHalf };
    } catch (error) {
      console.error("Error fetching pancake data:", error);
      throw error;
    }
}