import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, RefreshCw, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Props {
  output: string;
  loading: boolean;
  onRegenerate?: () => void;
  filename?: string;
}

export function OutputCard({ output, loading, onRegenerate, filename = "output.md" }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  if (!output && !loading) {
    return (
      <Card className="border-dashed border-2 border-border/60 bg-cream/40 p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <p className="mt-4 font-display text-lg text-foreground">Your result will appear here</p>
        <p className="mt-1 text-sm text-muted-foreground">Fill the form and click generate.</p>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-border/60 bg-card shadow-card overflow-hidden animate-fade-in-up">
      <div className="flex items-center justify-between border-b border-border/60 bg-gradient-soft px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-coral animate-pulse" style={{ animationPlayState: loading ? "running" : "paused", opacity: loading ? 1 : 0.4 }} />
          <span className="text-sm font-medium text-foreground/80">{loading ? "Generating…" : "Result"}</span>
        </div>
        <div className="flex gap-1.5">
          {onRegenerate && (
            <Button size="sm" variant="ghost" onClick={onRegenerate} disabled={loading} className="h-8 gap-1.5 rounded-lg">
              <RefreshCw className="h-3.5 w-3.5" /> Regenerate
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={download} disabled={loading || !output} className="h-8 gap-1.5 rounded-lg">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button size="sm" variant="ghost" onClick={copy} disabled={loading || !output} className="h-8 gap-1.5 rounded-lg">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <div className="px-6 py-5">
        <div className="prose-output">
          <ReactMarkdown>{output || " "}</ReactMarkdown>
          {loading && <span className="inline-block w-2 h-4 align-middle bg-primary animate-pulse ml-0.5" />}
        </div>
      </div>
    </Card>
  );
}
