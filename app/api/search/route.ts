import { NextResponse } from "next/server";
import { generateAnswer } from "@/lib/xai";
import { searchWithSerpApi } from "@/lib/serpapi";

// Configure route segment
export const runtime = 'edge'; // Use edge runtime for better performance
export const maxDuration = 300; // 5 minutes timeout

async function errorResponse(message: string, status: number = 500) {
  return new NextResponse(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    // Validate request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return errorResponse("Invalid JSON in request body", 400);
    }

    if (!body || typeof body !== 'object') {
      return errorResponse("Invalid request body", 400);
    }

    const { query, previousContext } = body;
    
    if (!query || typeof query !== 'string') {
      return errorResponse("Query is required and must be a string", 400);
    }

    // Validate environment variables
    if (!process.env.SERPAPI_API_KEY || !process.env.XAI_API_KEY) {
      return errorResponse("API configuration is incomplete", 500);
    }

    // Get search results from SerpAPI
    const { searchResults, error } = await searchWithSerpApi(query);

    if (error) {
      console.error('SerpAPI error:', error);
      return errorResponse(`Failed to fetch search results: ${error}`, 500);
    }

    if (!searchResults?.length) {
      return errorResponse("No search results found", 404);
    }

    // Generate AI answer based on the search results and previous context
    try {
      let contextPrompt = `Based on these search results, provide a comprehensive answer to the question: "${query}"`;
      
      // Add previous context if available
      if (previousContext && typeof previousContext === 'string') {
        contextPrompt = `Previous context: ${previousContext}\n\nBased on the previous context and these new search results, provide a comprehensive answer to the follow-up question: "${query}"`;
      }

      contextPrompt += `\n\nSearch Results:\n\n${
        searchResults.map((r: any, i: number) => 
          `[${i + 1}] Title: ${r.title || ''}\nSnippet: ${r.snippet || ''}\nURL: ${r.link || ''}\n`
        ).join('\n')
      }`;
      
      const answer = await generateAnswer(contextPrompt);
      
      if (!answer) {
        return errorResponse("Failed to generate answer", 500);
      }

      return new NextResponse(
        JSON.stringify({
          answer,
          sources: searchResults,
          context: query
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate'
          }
        }
      );
    } catch (aiError: any) {
      console.error('AI answer generation error:', aiError);
      return errorResponse(
        aiError?.message?.includes('rate limit') 
          ? "AI service is currently busy. Please try again in a few minutes."
          : "Failed to generate answer from search results",
        aiError?.message?.includes('rate limit') ? 429 : 500
      );
    }
  } catch (error: any) {
    console.error('Search API error:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'An unknown error occurred',
      500
    );
  }
}