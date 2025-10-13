import { CohereClient } from "cohere-ai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { user_id, session_id, user_message, source } = await req.json();

    // Step 1: Get Noah's response from Cohere
    const cohereResponse = await cohere.chat({
      model: "command-nightly",
      message: user_message || "Hey Noah!",
    });

    const noah_response = cohereResponse.text;

    // Step 2: Insert chat into Supabase
    const { data, error } = await supabase
      .from("noah_chats")
      .insert([
        {
          user_id,
          session_id,
          user_message,
          noah_response,
          source: source || "unknown",
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert failed", error);
      return new Response(
        JSON.stringify({ error: "Failed to save chat in Noah's memory" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ reply: noah_response, chat: data[0] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Noah panicked", err);
    return new Response(
      JSON.stringify({ error: "Noah got lost in his thoughts" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}