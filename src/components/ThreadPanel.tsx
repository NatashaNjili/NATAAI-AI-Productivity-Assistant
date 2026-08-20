import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, RefreshCw, Download, Sparkles, Send, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Turn } from "@/hooks/useAIThread";

interface Props {
  turns: Turn[];
  loading: boolean;
  onSend: (text: string) => void;
  onRegenerate: (id: number) => void;
  onReset: () => void;
  filename?: string;
  emptyHint?: string;
  placeholder?: string;
}

export function ThreadPanel({
  turns,
  loading,
  onSend,
  onRegenerate,
  onReset,
  filename = "output.md",
  emptyHint = "Fill the form and click generate.",
  placeholder = "Refine it — e.g. make it shorter, friendlier, add a deadline…",
}: Props) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, loading]);

  const copy = async (t: Turn) => {
    await navigator.clipboard.writeText(t.output);
    setCopiedId(t.id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 1800);
  };

  const download = (t: Turn) => {
    const blob = new Blob([t.output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const send = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    onSend(text);
  };

  return (
    <Card className="rounded-2xl border-border/60 shadow-card flex flex-col overflow-hidden h-[calc(100vh-12rem)] lg:h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between border-b border-border/60 bg-gradient-soft px-5 py-3">
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full bg-primary animate-pulse"
            style={{ animationPlayState: loading ? "running" : "paused", opacity: loading ? 1 : 0.4 }}
          />
          <span className="text-sm font-medium text-foreground/80">
            {loading ? "Generating…" : turns.length ? `Conversation · ${turns.length}` : "Result"}
          </span>
        </div>
        {turns.length > 0 && (
          <Button size="sm" variant="ghost" onClick={onReset} disabled={loading} className="h-8 gap-1.5 rounded-lg">
            <Trash2 className="h-3.5 w-3.5" /> New thread
          </Button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {turns.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <p className="mt-4 font-display text-lg text-foreground">Your result will appear here</p>
            <p className="mt-1 text-sm text-muted-foreground">{emptyHint}</p>
          </div>
        )}

        {turns.map((t) => (
          <div key={t.id} className="space-y-3 animate-fade-in-up">
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-gradient-primary px-4 py-2.5 text-primary-foreground shadow-soft">
                <p className="text-[14px] whitespace-pre-wrap leading-relaxed">{t.prompt}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card">
              <div className="px-5 py-4">
                <div className="prose-output">
                  <ReactMarkdown>{t.output || " "}</ReactMarkdown>
                  {loading && !t.output && (
                    <span className="inline-block w-2 h-4 align-middle bg-primary animate-pulse ml-0.5" />
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 border-t border-border/60 px-3 py-2">
                <Button size="sm" variant="ghost" onClick={() => onRegenerate(t.id)} disabled={loading} className="h-8 gap-1.5 rounded-lg">
                  <RefreshCw className="h-3.5 w-3.5" /> Try again
                </Button>
                <Button size="sm" variant="ghost" onClick={() => download(t)} disabled={loading || !t.output} className="h-8 gap-1.5 rounded-lg">
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
                <Button size="sm" variant="ghost" onClick={() => copy(t)} disabled={loading || !t.output} className="h-8 gap-1.5 rounded-lg">
                  {copiedId === t.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedId === t.id ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {turns.length > 0 && (
        <div className="border-t border-border/60 bg-background/60 backdrop-blur p-3">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={placeholder}
              rows={1}
              className="rounded-2xl resize-none min-h-[46px] max-h-32 px-4 py-3"
            />
            <Button onClick={send} disabled={loading || !input.trim()} size="icon"
              className="h-11 w-11 rounded-2xl bg-gradient-primary hover:opacity-95 shadow-soft shrink-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 text-center">
            Keep refining — earlier results stay in the thread.
          </p>
        </div>
      )}
    </Card>
  );
}
