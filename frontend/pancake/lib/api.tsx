async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchPancakeData() {
    try {
      const fetchOptions = {
        headers: { 
          "x-api-key": process.env.API_KEY || "",
        },
      };

      const response = await fetch("/api/pancake-data", fetchOptions);
     
      
      const result = await response.json();

      return result ;
    } catch (error) {
      console.error("Error fetching pancake data:", error);
      throw error;
    }
}