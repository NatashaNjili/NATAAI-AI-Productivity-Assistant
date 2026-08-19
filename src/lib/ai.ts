import { toast } from "sonner";

const URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export type ChatMsg = { role: "user" | "assistant"; content: string };

export async function streamAI(opts: {
  mode: "email" | "notes" | "planner" | "research" | "chat" | "code";
  input?: string;
  messages?: ChatMsg[];
  onDelta: (chunk: string) => void;
  signal?: AbortSignal;
}) {
  const resp = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({ mode: opts.mode, input: opts.input, messages: opts.messages }),
    signal: opts.signal,
  });

  if (!resp.ok) {
    if (resp.status === 429) toast.error("Rate limit reached. Try again in a moment.");
    else if (resp.status === 402) toast.error("AI credits exhausted. Please add credits.");
    else toast.error("Something went wrong. Please try again.");
    throw new Error(`HTTP ${resp.status}`);
  }
  if (!resp.body) throw new Error("No stream");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let done = false;

  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buffer += decoder.decode(value, { stream: true });
    let i: number;
    while ((i = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, i);
      buffer = buffer.slice(i + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line || line.startsWith(":")) continue;
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") { done = true; break; }
      try {
        const j = JSON.parse(data);
        const c = j.choices?.[0]?.delta?.content;
        if (c) opts.onDelta(c);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
}
