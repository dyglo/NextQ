import { getJson } from "serpapi";

export async function searchWithSerpApi(query: string) {
  if (!process.env.SERPAPI_API_KEY) {
    throw new Error('SERPAPI_API_KEY is not configured');
  }

  const searchParams = {
    q: query,
    api_key: process.env.SERPAPI_API_KEY,
    engine: "google",
    google_domain: "google.com",
    gl: "us",
    hl: "en",
    num: "5",
    safe: "active"
  };

  try {
    // Add retry logic for network issues
    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        // Convert params to URL query string
        const queryString = new URLSearchParams(searchParams).toString();
        const url = `https://serpapi.com/search?${queryString}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Extract and format the search results
        const searchResults = data.organic_results?.map((result: any, index: number) => ({
          title: result.title,
          link: result.link,
          snippet: result.snippet,
          position: index + 1
        })) || [];

        return {
          searchResults,
          error: null
        };
      } catch (error: any) {
        lastError = error;
        console.error('SerpAPI attempt failed:', error);
        
        // Network error, retry
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
          continue;
        }
        
        // All retries failed
        throw error;
      }
    }

    // If we get here, all retries failed
    throw lastError;
  } catch (error: any) {
    console.error('SerpAPI error:', error);
    return {
      searchResults: [],
      error: error?.message || 'An unknown error occurred while fetching search results'
    };
  }
}