async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchPancakeData() {
    try {
      const firstHalfResponse = fetch("/api/pancake-data-first", {
          headers: { "x-api-key": process.env.API_KEY || "" }
      });

      await delay(500); // 500ms delay before second request

      const secondHalfResponse = fetch("/api/pancake-data-second", {
          headers: { "x-api-key": process.env.API_KEY || "" }
      });

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