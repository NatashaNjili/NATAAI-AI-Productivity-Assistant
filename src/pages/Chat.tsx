import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkle, Loader2 } from "lucide-react";
import { streamAI, ChatMsg } from "@/lib/ai";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: "Hi! I'm NATA — your Neural AI Task Assistant. ✨\n\nI can help you draft emails, summarize meetings, plan your day, or research a topic. What's on your plate today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(next); setInput(""); setLoading(true);

    let acc = "";
    setMessages([...next, { role: "assistant", content: "" }]);
    try {
      await streamAI({
        mode: "chat",
        messages: next,
        onDelta: (chunk) => {
          acc += chunk;
          setMessages((prev) => prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: acc } : m)));
        },
      });
    } finally { setLoading(false); }
  };

  return (
    <Card className="rounded-2xl border-border/60 shadow-card flex flex-col h-[calc(100vh-10rem)] overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 animate-fade-in-up ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && (
              <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft">
                <Sparkle className="h-4 w-4 text-white" />
              </div>
            )}
            <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-gradient-primary text-primary-foreground rounded-br-md shadow-soft" : "bg-secondary text-secondary-foreground rounded-bl-md"}`}>
              {m.role === "assistant" ? (
                <div className="prose-output text-[15px]">
                  <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-[15px] whitespace-pre-wrap leading-relaxed">{m.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60 bg-background/60 backdrop-blur p-3 sm:p-4">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask anything — draft an email, summarize notes, plan a week…"
            rows={1}
            className="rounded-2xl resize-none min-h-[48px] max-h-32 px-4 py-3"
          />
          <Button onClick={send} disabled={loading || !input.trim()} size="icon"
            className="h-12 w-12 rounded-2xl bg-gradient-primary hover:opacity-95 shadow-soft shrink-0">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 text-center">
          AI-generated content may not always be accurate. Please review before use.
        </p>
      </div>
    </Card>
  );
}
