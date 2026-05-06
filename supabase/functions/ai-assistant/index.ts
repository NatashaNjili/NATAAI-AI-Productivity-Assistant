const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  email: `You are an expert business writing assistant. Generate complete, well-structured professional emails. Format with a Subject line, greeting, body paragraphs, and a sign-off. Match the requested tone exactly. Output only the email — no preamble.`,
  notes: `You are an expert meeting notes summarizer. Given raw meeting notes or a transcript, produce a clean Markdown summary with these exact sections:
## Key Points
## Decisions Made
## Action Items
(use a table or bullets with **Owner** and task)
## Deadlines
Be concise and scannable.`,
  planner: `You are an expert productivity coach. Given a list of tasks, return a Markdown plan with:
## Prioritized Plan
Group tasks under **🔴 Urgent**, **🟠 Important**, **🟢 Low Priority**.
## Suggested Time Blocks
Provide a clear daily/weekly schedule with time ranges and the matched task.
Be realistic and motivating.`,
  research: `You are an expert research assistant. Given a topic or pasted content, produce a Markdown brief with:
## Summary
A clear simplified overview.
## Key Insights
Bulleted insights.
## Important Concepts
Definitions of key terms.
## Recommendations
Actionable next steps or further reading.`,
  chat: `You are a friendly, professional AI Productivity Assistant for working professionals. Help with emails, summaries, planning, research and general productivity. If a request is unclear, ask one clarifying question. Use Markdown formatting. Always remind users to review AI output when stakes are high.`,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mode, messages, input } = await req.json();
    const system = SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS.chat;

    const finalMessages =
      messages && Array.isArray(messages)
        ? [{ role: "system", content: system }, ...messages]
        : [
            { role: "system", content: system },
            { role: "user", content: String(input ?? "") },
          ];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: finalMessages,
        stream: true,
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await resp.text();
      console.error("AI gateway error:", resp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(resp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
