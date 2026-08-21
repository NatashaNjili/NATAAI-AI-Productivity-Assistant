import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { ThreadPanel } from "@/components/ThreadPanel";
import { useAIThread } from "@/hooks/useAIThread";

export default function Research() {
  const [topic, setTopic] = useState("");
  const { turns, loading, send, regenerate, reset } = useAIThread("research");

  const run = () => {
    if (!topic.trim()) return;
    send(topic);
  };


  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-2xl border-border/60 shadow-card p-6 space-y-5 h-fit">
        <div>
          <Label htmlFor="topic">Topic or pasted content</Label>
          <Textarea id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} rows={14}
            placeholder="e.g. Explain agentic AI for product managers — or paste an article to digest…"
            className="mt-1.5 rounded-xl resize-none" />
        </div>
        <Button onClick={run} disabled={loading || !topic.trim()}
          className="w-full h-11 rounded-xl bg-gradient-primary hover:opacity-95 shadow-soft text-base font-medium">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {loading ? "Researching…" : "Research Topic"}
        </Button>
      </Card>
      <ThreadPanel turns={turns} loading={loading} onSend={send} onRegenerate={regenerate} onReset={reset}
        filename="research-brief.md" emptyHint="Enter a topic and click Research Topic."
        placeholder="Refine it — e.g. go deeper on risks, add examples…" />

    </div>
  );
}
