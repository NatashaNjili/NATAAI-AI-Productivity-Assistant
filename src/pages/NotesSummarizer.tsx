import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { ThreadPanel } from "@/components/ThreadPanel";
import { useAIThread } from "@/hooks/useAIThread";

export default function NotesSummarizer() {
  const [notes, setNotes] = useState("");
  const { turns, loading, send, regenerate, reset } = useAIThread("notes");

  const run = () => {
    if (!notes.trim()) return;
    send(notes);
  };


  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-2xl border-border/60 shadow-card p-6 space-y-5 h-fit">
        <div>
          <Label htmlFor="notes">Meeting notes or transcript</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={16}
            placeholder="Paste your raw meeting notes or transcript here…"
            className="mt-1.5 rounded-xl resize-none" />
        </div>
        <Button onClick={run} disabled={loading || !notes.trim()}
          className="w-full h-11 rounded-xl bg-gradient-primary hover:opacity-95 shadow-soft text-base font-medium">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {loading ? "Summarizing…" : "Summarize Notes"}
        </Button>
      </Card>
      <ThreadPanel turns={turns} loading={loading} onSend={send} onRegenerate={regenerate} onReset={reset}
        filename="meeting-summary.md" emptyHint="Paste your notes and click Summarize Notes."
        placeholder="Refine it — e.g. add owners, shorten, list risks…" />

    </div>
  );
}
