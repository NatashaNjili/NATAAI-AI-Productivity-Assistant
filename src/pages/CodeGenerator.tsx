import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2, Loader2 } from "lucide-react";
import { ThreadPanel } from "@/components/ThreadPanel";
import { useAIThread } from "@/hooks/useAIThread";

const LANGUAGES = ["TypeScript", "JavaScript", "Python", "SQL", "Java", "C#", "Go", "PHP", "Bash", "HTML/CSS"];
const TASKS = [
  { value: "write", label: "Write new code" },
  { value: "explain", label: "Explain code" },
  { value: "debug", label: "Find & fix bugs" },
  { value: "optimize", label: "Optimize / refactor" },
  { value: "tests", label: "Write tests" },
];

export default function CodeGenerator() {
  const [task, setTask] = useState("write");
  const [language, setLanguage] = useState("TypeScript");
  const [details, setDetails] = useState("");
  const { turns, loading, send, regenerate, reset } = useAIThread("code");

  const generate = () => {
    if (!details.trim()) return;
    send(`Task: ${TASKS.find((t) => t.value === task)?.label}\nLanguage: ${language}\n\nDetails / code:\n${details}`);
  };


  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-2xl border-border/60 shadow-card p-6 space-y-5 h-fit">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>What do you need?</Label>
            <Select value={task} onValueChange={setTask}>
              <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TASKS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="details">Describe the task or paste your code</Label>
          <Textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} rows={12}
            placeholder="e.g. A function that groups invoices by month and returns totals — or paste code to debug…"
            className="mt-1.5 rounded-xl resize-none font-mono text-[13px]" />
        </div>
        <Button onClick={generate} disabled={loading || !details.trim()}
          className="w-full h-11 rounded-xl bg-gradient-primary hover:opacity-95 shadow-soft text-base font-medium">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Code2 className="h-4 w-4 mr-2" />}
          {loading ? "Writing code…" : "Generate Code"}
        </Button>
      </Card>
      <ThreadPanel turns={turns} loading={loading} onSend={send} onRegenerate={regenerate} onReset={reset}
        filename="code.md" emptyHint="Describe the task and click Generate Code."
        placeholder="Refine it — e.g. add error handling, convert to async…" />

    </div>
  );
}
