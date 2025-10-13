import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ModelName = "openai" | "llama3";

export async function generateNoahResponse(opts: {
    model?: ModelName;
    prompt: string;
    userId: string | null;
    sessionId: string | null;
}) {
    const model = opts.model ?? (process.env.NOAH_DEFAULT_MODEL as ModelName) ?? "openai";
    const prompts = opts.prompt;

    if(model === "openai") {
        const res = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are Noah, EaziWage AI assistant. Be concise and professional in your responses. Do not reveal PII." },
                { role: "user", content: prompts }
            ],
            max_completion_tokens: 800,
            temperature: 0.1,
            user: opts.userId ?? undefined,
        });

        const text = res.choices[0]?.message?.content ?? "";
        return { text, meta: { engine: "openai", model: res.model || "gpt-4o" } };
    } else {
        const url = process.env.LLAMA3_API_URL;
        const apiKey = process.env.LLAMA3_API_KEY;
        const body = {
            input: prompts,
            parameters: {
                max_new_tokens: 800,
                temperature: 0.0,
            }
        };

        const r = await fetch(url || "", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
            },
            body: JSON.stringify(body),
        });

        if(!r.ok) {
            const error = await r.text();
            throw new Error(`Llama3 API error: ${r.status} ${error}`);
        }
        const data = await r.json();
        const text = data?.generated_text ?? data?.results?.[0]?.text ?? JSON.stringify(data);
        return { text, meta: { engine: "llama3" } };
    }
}