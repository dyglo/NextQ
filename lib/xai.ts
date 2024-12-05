import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1"
});

export async function generateAnswer(prompt: string) {
  if (!process.env.XAI_API_KEY) {
    throw new Error('XAI_API_KEY is not configured');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "grok-beta",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable assistant focused on providing accurate, well-researched answers. Format your response in markdown with sections: Summary, Key Points, and Sources. Include relevant quotes from the search results to support your answer."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return completion.choices[0].message.content;
  } catch (error: any) {
    console.error("xAI API error:", error);

    // Handle rate limit errors
    if (error?.status === 429 || error?.message?.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please try again in a few minutes.');
    }

    // Handle other API errors
    if (error?.response?.data?.error) {
      throw new Error(error.response.data.error.message);
    }

    throw new Error(error?.message || "Failed to generate answer");
  }
}