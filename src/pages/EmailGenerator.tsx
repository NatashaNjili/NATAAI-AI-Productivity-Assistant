import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";
import { ThreadPanel } from "@/components/ThreadPanel";
import { useAIThread } from "@/hooks/useAIThread";

export default function EmailGenerator() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("client");
  const [tone, setTone] = useState("formal");
  const [points, setPoints] = useState("");
  const { turns, loading, send, regenerate, reset } = useAIThread("email");

  const generate = () => {
    if (!purpose.trim()) return;
    send(`Purpose: ${purpose}\nRecipient: ${recipient}\nTone: ${tone}\nKey points:\n${points}`);
  };


  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-2xl border-border/60 shadow-card p-6 space-y-5 h-fit">
        <div>
          <Label htmlFor="purpose">Purpose</Label>
          <Input id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Follow up on yesterday's product demo" className="mt-1.5 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Recipient</Label>
            <Select value={recipient} onValueChange={setRecipient}>
              <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="points">Key points</Label>
          <Textarea id="points" value={points} onChange={(e) => setPoints(e.target.value)} rows={6}
            placeholder="• Thank them for their time&#10;• Recap the 3 features they liked&#10;• Propose a follow-up call next week"
            className="mt-1.5 rounded-xl resize-none" />
        </div>
        <Button onClick={generate} disabled={loading || !purpose.trim()}
          className="w-full h-11 rounded-xl bg-gradient-primary hover:opacity-95 shadow-soft text-base font-medium">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {loading ? "Crafting…" : "Generate Email"}
        </Button>
      </Card>
      <OutputCard output={output} loading={loading} onRegenerate={generate} filename="email.md" />
    </div>
  );
}
