// app/api/noah/route.ts
import { streamText } from 'ai';
import { cohere as createCohere } from '@ai-sdk/cohere';
import { createClient } from '@supabase/supabase-js';

// --- Initialize Supabase client ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// --- Initialize Cohere model ---
const cohere = createCohere({
  apiKey: process.env.COHERE_API_KEY!,
} as any);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // --- Optional: Save messages for analytics/logs ---
    await supabase.from('chat_logs').insert([{ messages }]);

    // --- Stream Cohere response ---
    const response = await streamText({
      model: 'command-r-plus',
      messages,
      temperature: 0.7,
    });

    return response.toTextStreamResponse();
  } catch (err) {
    console.error('Noah API Error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong with Noah.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
