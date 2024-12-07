import { NextRequest, NextResponse } from 'next/server';
import { searchWithSerpApi } from '@/lib/serpapi';
import { generateAnswer } from '@/lib/xai';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, previousContext } = body;

    if (!query) {
      return new NextResponse(
        JSON.stringify({ error: 'Query is required' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { searchResults, error } = await searchWithSerpApi(query);

    if (error) {
      return new NextResponse(
        JSON.stringify({ error }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const contextPrompt = previousContext 
      ? `Previous context: ${previousContext}\n\nBased on the previous context and these new search results, provide a comprehensive answer to the follow-up question: "${query}"`
      : `Based on these search results, provide a comprehensive answer to the question: "${query}"`;

    const formattedResults = searchResults
      .map((r: any, i: number) => `[${i + 1}] ${r.title}\n${r.snippet}\nURL: ${r.link}\n`)
      .join('\n');

    const answer = await generateAnswer(`${contextPrompt}\n\nSearch Results:\n\n${formattedResults}`);

    if (!answer) {
      return new NextResponse(
        JSON.stringify({ error: 'Failed to generate answer' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
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
        },
      }
    );

  } catch (error: any) {
    console.error('API error:', error);
    return new NextResponse(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}