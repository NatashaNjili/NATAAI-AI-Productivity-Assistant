import { useEffect, useState } from "react";
import { streamAI, ChatMsg } from "@/lib/ai";
import { clearThread, loadThread, saveThread } from "@/lib/threadStore";

export type Turn = { id: number; prompt: string; output: string };

export function useAIThread(mode: "email" | "notes" | "planner" | "research" | "code") {
  const [turns, setTurns] = useState<Turn[]>(() => loadThread<Turn[]>(mode, []));
  const [loading, setLoading] = useState(false);

  // Persist the thread so navigating between pages keeps the history.
  useEffect(() => {
    saveThread(mode, turns);
  }, [mode, turns]);

  const stream = async (prompt: string, history: Turn[], id: number) => {
    const messages: ChatMsg[] = [];
    history.forEach((t) => {
      messages.push({ role: "user", content: t.prompt });
      messages.push({ role: "assistant", content: t.output });
    });
    messages.push({ role: "user", content: prompt });

    setLoading(true);
    let acc = "";
    try {
      await streamAI({
        mode,
        messages,
        onDelta: (c) => {
          acc += c;
          setTurns((p) => p.map((t) => (t.id === id ? { ...t, output: acc } : t)));
        },
      });
    } finally {
      setLoading(false);
    }
  };

  /** Start a new message in the thread (keeps all previous turns as context). */
  const send = async (prompt: string) => {
    if (!prompt.trim() || loading) return;
    const id = Date.now();
    const history = turns;
    setTurns([...history, { id, prompt, output: "" }]);
    await stream(prompt, history, id);
  };

  /** Re-run one turn's prompt, replacing its output. */
  const regenerate = async (id: number) => {
    if (loading) return;
    const idx = turns.findIndex((t) => t.id === id);
    if (idx === -1) return;
    const turn = turns[idx];
    setTurns((p) => p.map((t) => (t.id === id ? { ...t, output: "" } : t)));
    await stream(turn.prompt, turns.slice(0, idx), id);
  };

  const reset = () => {
    clearThread(mode);
    setTurns([]);
  };

  return { turns, loading, send, regenerate, reset };
}
