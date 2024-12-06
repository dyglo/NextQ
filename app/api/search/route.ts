import { NextResponse } from "next/server";
import { generateAnswer } from "@/lib/xai";
import { searchWithSerpApi } from "@/lib/serpapi";

export async function POST(request: Request) {
  try {
    const { query, previousContext } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
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
      if (previousContext) {
        contextPrompt = `Previous context: ${previousContext}\n\nBased on the previous context and these new search results, provide a comprehensive answer to the follow-up question: "${query}"`;
      }

      contextPrompt += `\n\nSearch Results:\n\n${
        searchResults.map((r: any, i: number) => 
          `[${i + 1}] Title: ${r.title}\nSnippet: ${r.snippet}\nURL: ${r.link}\n`
        ).join('\n')
      }`;
      
      const answer = await generateAnswer(contextPrompt);
      
      if (!answer) {
        throw new Error("Failed to generate answer");
      }

      return NextResponse.json({ 
        answer,
        sources: searchResults,
        context: query // Return the current query as context for future reference
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