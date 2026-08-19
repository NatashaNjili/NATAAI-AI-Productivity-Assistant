import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Loader2, Download, Sparkles } from "lucide-react";
import { streamImage } from "@/lib/image";

const STYLES = [
  { value: "none", label: "No preset" },
  { value: "clean minimal 3D render, soft studio lighting", label: "Minimal 3D" },
  { value: "elegant editorial photography, soft natural light", label: "Editorial photo" },
  { value: "flat vector illustration, pastel palette", label: "Flat illustration" },
  { value: "futuristic neon gradient digital art", label: "Futuristic neon" },
  { value: "hand-drawn watercolour, soft blush tones", label: "Watercolour" },
];

export default function ImageStudio() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(STYLES[1].value);
  const [image, setImage] = useState("");
  const [isFinal, setIsFinal] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true); setImage(""); setIsFinal(false);
    try {
      await streamImage(prompt, style, (dataUrl, final) => {
        setImage(dataUrl);
        setIsFinal(final);
      });
    } catch {
      /* toast handled in streamImage */
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = image;
    a.download = "nata-image.png";
    a.click();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-2xl border-border/60 shadow-card p-6 space-y-5 h-fit">
        <div>
          <Label htmlFor="prompt">Describe your image</Label>
          <Textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={9}
            placeholder="e.g. A calm workspace with a laptop, blush peonies and morning light, soft shadows"
            className="mt-1.5 rounded-xl resize-none" />
        </div>
        <div>
          <Label>Style preset</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STYLES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={generate} disabled={loading || !prompt.trim()}
          className="w-full h-11 rounded-xl bg-gradient-primary hover:opacity-95 shadow-soft text-base font-medium">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {loading ? "Creating…" : "Generate Image"}
        </Button>
        <p className="text-[11px] text-muted-foreground">
          Images are AI-generated and may contain inaccuracies. Please review before use.
        </p>
      </Card>

      {image ? (
        <Card className="rounded-2xl border-border/60 shadow-card overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between border-b border-border/60 bg-gradient-soft px-5 py-3">
            <span className="text-sm font-medium text-foreground/80">{isFinal ? "Result" : "Rendering…"}</span>
            <Button size="sm" variant="ghost" onClick={download} disabled={!isFinal}
              className="h-8 gap-1.5 rounded-lg">
              <Download className="h-3.5 w-3.5" /> Download
            </Button>
          </div>
          <div className="p-5">
            <img
              src={image}
              alt={prompt || "AI generated image"}
              className={`w-full rounded-xl transition-all duration-500 ${isFinal ? "" : "blur-xl scale-[1.01]"}`}
            />
          </div>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-border/60 bg-cream/40 p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary/10">
            <ImageIcon className="h-6 w-6 text-primary" />
          </div>
          <p className="mt-4 font-display text-lg text-foreground">Your image will appear here</p>
          <p className="mt-1 text-sm text-muted-foreground">Describe a scene and click generate.</p>
        </Card>
      )}
    </div>
  );
}
