export async function searchWithSerpApi(query: string) {
  if (!process.env.SERPAPI_API_KEY) {
    throw new Error('SERPAPI_API_KEY is not configured');
  }

  try {
    const searchParams = new URLSearchParams();
    searchParams.append('api_key', process.env.SERPAPI_API_KEY);
    searchParams.append('q', query);
    searchParams.append('engine', 'google');
    searchParams.append('google_domain', 'google.com');
    searchParams.append('gl', 'us');
    searchParams.append('hl', 'en');
    searchParams.append('num', '5');
    searchParams.append('safe', 'active');

    const response = await fetch(`https://serpapi.com/search?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`SerpAPI request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.organic_results || !Array.isArray(data.organic_results)) {
      throw new Error('Invalid response format from SerpAPI');
    }

    const searchResults = data.organic_results.map((result: any, index: number) => ({
      title: result.title || '',
      link: result.link || '',
      snippet: result.snippet || '',
      position: index + 1
    }));

    if (!searchResults.length) {
      throw new Error('No search results found');
    }

    return {
      searchResults,
      error: null
    };

  } catch (error: any) {
    console.error('SerpAPI error:', error);
    return {
      searchResults: [],
      error: error.message || 'Failed to fetch search results'
    };
  }
}