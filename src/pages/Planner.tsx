import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Loader2 } from "lucide-react";
import { ThreadPanel } from "@/components/ThreadPanel";
import { useAIThread } from "@/hooks/useAIThread";

export default function Planner() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("daily");
  const { turns, loading, send, regenerate, reset } = useAIThread("planner");

  const run = () => {
    if (!tasks.trim()) return;
    send(`Plan horizon: ${horizon}\nTasks (with optional deadlines):\n${tasks}`);
  };


  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-2xl border-border/60 shadow-card p-6 space-y-5 h-fit">
        <div>
          <Label htmlFor="tasks">Your tasks</Label>
          <Textarea id="tasks" value={tasks} onChange={(e) => setTasks(e.target.value)} rows={12}
            placeholder="- Send Q3 report to Sarah by Friday&#10;- Prep slides for Monday all-hands&#10;- Reply to vendor proposals&#10;- 30 min deep work on roadmap"
            className="mt-1.5 rounded-xl resize-none" />
        </div>
        <div>
          <Label className="mb-2 block">Plan for</Label>
          <RadioGroup value={horizon} onValueChange={setHorizon} className="flex gap-3">
            {["daily", "weekly"].map((v) => (
              <label key={v} className="flex-1 cursor-pointer">
                <div className={`rounded-xl border-2 px-4 py-3 text-center text-sm font-medium capitalize transition ${horizon === v ? "border-primary bg-accent text-accent-foreground" : "border-border hover:border-primary/40"}`}>
                  <RadioGroupItem value={v} className="sr-only" />{v}
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>
        <Button onClick={run} disabled={loading || !tasks.trim()}
          className="w-full h-11 rounded-xl bg-gradient-primary hover:opacity-95 shadow-soft text-base font-medium">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {loading ? "Planning…" : "Build My Plan"}
        </Button>
      </Card>
      <OutputCard output={output} loading={loading} onRegenerate={run} filename="plan.md" />
    </div>
  );
}
