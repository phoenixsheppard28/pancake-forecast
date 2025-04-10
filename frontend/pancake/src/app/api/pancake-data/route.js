// pages/api/pancake-data.js (Next.js API route)
export default async function handler(req, res) {
    try {
      const apiResponse = await fetch('https://umpancake.vercel.app/forecast', {
        headers: {
          'x-api-key': process.env.API_KEY,
        },
      });
      
      if (!apiResponse.ok) {
        throw new Error('Failed to fetch from backend');
      }
      
      const data = await apiResponse.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching pancake data:', error);
      return res.status(500).json({ error: 'Failed to retrieve pancake data' });
    }
  }