import { NextResponse } from "next/server";
import { generateAnswer } from "@/lib/xai";
import { searchWithSerpApi } from "@/lib/serpapi";

export const maxDuration = 300; // Set maximum duration to 300 seconds
export const dynamic = 'force-dynamic'; // Disable static optimization
export const fetchCache = 'force-no-store'; // Disable response caching

export async function POST(request: Request) {
  try {
    // Validate request body
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { query, previousContext } = body;
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: "Query is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.SERPAPI_API_KEY || !process.env.XAI_API_KEY) {
      return NextResponse.json(
        { error: "API configuration is incomplete" },
        { status: 500 }
      );
    }

    // Get search results from SerpAPI
    const { searchResults, error } = await searchWithSerpApi(query);

    if (error) {
      console.error('SerpAPI error:', error);
      return NextResponse.json(
        { error: `Failed to fetch search results: ${error}` },
        { status: 500 }
      );
    }

    if (!searchResults?.length) {
      return NextResponse.json(
        { error: "No search results found" },
        { status: 404 }
      );
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
        throw new Error("Failed to generate answer");
      }

      const response = {
        answer,
        sources: searchResults,
        context: query
      };

      // Validate response before sending
      const responseStr = JSON.stringify(response);
      JSON.parse(responseStr); // Verify JSON is valid

      return new NextResponse(responseStr, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      });
    } catch (aiError) {
      console.error('AI answer generation error:', aiError);
      return NextResponse.json(
        { error: "Failed to generate answer from search results" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}