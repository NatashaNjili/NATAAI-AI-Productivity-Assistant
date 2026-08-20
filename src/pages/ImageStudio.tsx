import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Loader2, Download, Send, Wand2, RefreshCw } from "lucide-react";
import { streamImage } from "@/lib/image";

const STYLES = [
  { value: "none", label: "No preset" },
  { value: "clean minimal 3D render, soft studio lighting", label: "Minimal 3D" },
  { value: "elegant editorial photography, soft natural light", label: "Editorial photo" },
  { value: "flat vector illustration, pastel palette", label: "Flat illustration" },
  { value: "futuristic neon gradient digital art", label: "Futuristic neon" },
  { value: "hand-drawn watercolour, soft blush tones", label: "Watercolour" },
];

type Turn = {
  id: number;
  prompt: string;
  style: string;
  image: string;
  isFinal: boolean;
  failed?: boolean;
  refined: boolean;
};

export default function ImageStudio() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(STYLES[1].value);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, loading]);

  const lastFinal = [...turns].reverse().find((t) => t.isFinal && !t.failed);

  const run = async (text: string, useBase: boolean) => {
    const id = Date.now();
    const base = useBase ? lastFinal?.image : undefined;
    setTurns((p) => [...p, { id, prompt: text, style, image: "", isFinal: false, refined: !!base }]);
    setLoading(true);
    try {
      await streamImage(
        text,
        style,
        (dataUrl, final) =>
          setTurns((p) => p.map((t) => (t.id === id ? { ...t, image: dataUrl, isFinal: final } : t))),
        base,
      );
    } catch {
      setTurns((p) => p.map((t) => (t.id === id ? { ...t, failed: true, isFinal: true } : t)));
    } finally {
      setLoading(false);
    }
  };

  const send = () => {
    const text = prompt.trim();
    if (!text || loading) return;
    setPrompt("");
    run(text, true);
  };

  const download = (t: Turn) => {
    const a = document.createElement("a");
    a.href = t.image;
    a.download = "nata-image.png";
    a.click();
  };

  return (
    <Card className="rounded-2xl border-border/60 shadow-card flex flex-col h-[calc(100vh-10rem)] overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
        {turns.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary/10">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <p className="mt-4 font-display text-lg text-foreground">Let's create something</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Describe an image, then keep refining — "make it warmer", "add a plant" — every version stays here.
            </p>
          </div>
        )}

        {turns.map((t) => (
          <div key={t.id} className="space-y-3 animate-fade-in-up">
            <div className="flex justify-end">
              <div className="max-w-[78%] rounded-2xl rounded-br-md bg-gradient-primary px-4 py-3 text-primary-foreground shadow-soft">
                {t.refined && (
                  <span className="mb-1 flex items-center gap-1 text-[11px] opacity-80">
                    <Wand2 className="h-3 w-3" /> Refining previous image
                  </span>
                )}
                <p className="text-[15px] whitespace-pre-wrap leading-relaxed">{t.prompt}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft">
                <ImageIcon className="h-4 w-4 text-white" />
              </div>
              <div className="max-w-[78%] rounded-2xl rounded-bl-md bg-secondary p-3">
                {t.failed && !t.image ? (
                  <p className="px-1 py-2 text-sm text-muted-foreground">
                    That one didn't come through. Try rewording your prompt.
                  </p>
                ) : t.image ? (
                  <>
                    <img
                      src={t.image}
                      alt={t.prompt}
                      className={`w-full max-w-md rounded-xl transition-all duration-500 ${t.isFinal ? "" : "blur-xl scale-[1.01]"}`}
                    />
                    {t.isFinal && !t.failed && (
                      <div className="mt-2 flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 gap-1.5 rounded-lg" onClick={() => download(t)}>
                          <Download className="h-3.5 w-3.5" /> Download
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 gap-1.5 rounded-lg"
                          disabled={loading}
                          onClick={() => run(t.prompt, false)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Try again
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 px-2 py-6 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Rendering…
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border/60 bg-background/60 backdrop-blur p-3 sm:p-4">
        <div className="flex gap-2 items-end">
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="w-[150px] shrink-0 rounded-2xl h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STYLES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={lastFinal ? "Refine it — e.g. make the light warmer, add a plant…" : "Describe your image…"}
            rows={1}
            className="rounded-2xl resize-none min-h-[48px] max-h-32 px-4 py-3"
          />
          <Button onClick={send} disabled={loading || !prompt.trim()} size="icon"
            className="h-12 w-12 rounded-2xl bg-gradient-primary hover:opacity-95 shadow-soft shrink-0">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 text-center">
          Each message builds on your last image. Images are AI-generated — review before use.
        </p>
      </div>
    </Card>
  );
}
