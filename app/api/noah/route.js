import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
})

export async function POST(req) {
    try {
        const { message } = await req.json();

        const response = await cohere.chat({
            model: 'command-nightly',
            message: message || "Hey Noah!",
        });

        const reply = response.text;

        return new Response(JSON.stringify({ reply }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Noah panicked", error);
        return new Response(JSON.stringify({ error: 'Noah lost in his thoughts' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}