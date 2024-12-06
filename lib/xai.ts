import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1"
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateAnswer(prompt: string, retries = 3): Promise<string> {
  if (!process.env.XAI_API_KEY) {
    throw new Error('XAI_API_KEY is not configured');
  }

  let lastError: any;
  
  for (let i = 0; i < retries; i++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "grok-beta",
        messages: [
          {
            role: "system",
            content: `You are a knowledgeable assistant focused on providing accurate, well-researched answers. Format your response in markdown with sections: Summary, Key Points, and Sources.

When answering follow-up questions:
1. Acknowledge the connection to the previous context
2. Build upon the previous information
3. Add new relevant information
4. Make clear connections between the previous and new information
5. Include relevant quotes from the search results to support your answer

Always maintain context and coherence across the conversation.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        presence_penalty: 0.6, // Encourage the model to introduce new information
        frequency_penalty: 0.3 // Slightly discourage repetition
      });

      return completion.choices[0].message.content || 'No response generated';
      
    } catch (error: any) {
      lastError = error;
      console.error(`xAI API error (attempt ${i + 1}/${retries}):`, error);

      // Check for rate limit error
      if (error?.message?.includes('rate limit') || error?.status === 429) {
        if (i < retries - 1) {
          // Wait for 1 minute before retrying
          await sleep(60000);
          continue;
        }
        throw new Error('Rate limit exceeded. Please try again in a few minutes.');
      }

      // For other errors, wait a shorter time
      if (i < retries - 1) {
        await sleep(1000 * (i + 1));
        continue;
      }
    }
  }

  // If we get here, all retries failed
  throw new Error(lastError?.message || "Failed to generate answer after multiple attempts");
}