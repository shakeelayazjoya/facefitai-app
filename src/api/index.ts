// Basic API client placeholder
export const api = {
  // Add your API methods here
  get: async (url: string) => {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },
};
