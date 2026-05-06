import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { OutputCard } from "@/components/OutputCard";
import { streamAI } from "@/lib/ai";

export default function Research() {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!topic.trim()) return;
    setLoading(true); setOutput("");
    try {
      await streamAI({ mode: "research", input: topic, onDelta: (c) => setOutput((p) => p + c) });
    } finally { setLoading(false); }
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
      <OutputCard output={output} loading={loading} onRegenerate={run} filename="research-brief.md" />
    </div>
  );
}
