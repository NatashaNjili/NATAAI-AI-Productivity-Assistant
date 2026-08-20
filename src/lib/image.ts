import { toast } from "sonner";
import { flushSync } from "react-dom";

const BASE = import.meta.env.VITE_SUPABASE_URL as string;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const URL_ENDPOINT = `${BASE}/functions/v1/generate-image`;

type Frame = (dataUrl: string, isFinal: boolean) => void;

async function post(body: unknown) {
  return fetch(URL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify(body),
  });
}

function handleError(status: number) {
  if (status === 429) toast.error("Rate limit reached. Try again in a moment.");
  else if (status === 402) toast.error("AI credits exhausted. Please add credits.");
  else toast.error("Image generation failed. Please try again.");
}

export async function streamImage(prompt: string, style: string, onFrame: Frame, baseImage?: string) {
  const resp = await post({ prompt, style, baseImage, stream: true });
  if (!resp.ok || !resp.body) {
    handleError(resp.status);
    throw new Error(`HTTP ${resp.status}`);
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let event = "";
  let sawAny = false;
  let sawCompleted = false;
  let streamError: string | undefined;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let i: number;
    while ((i = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, i);
      buffer = buffer.slice(i + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line) { event = ""; continue; }
      if (line.startsWith(":")) continue;
      if (line.startsWith("event: ")) { event = line.slice(7).trim(); continue; }
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") continue;
      let payload: any;
      try { payload = JSON.parse(data); } catch { continue; }

      if (event === "error" || payload?.type === "error") {
        sawAny = true;
        streamError = payload?.error?.message ?? "Image generation failed";
        continue;
      }
      const type = event || payload?.type;
      const isFinal = type === "image_generation.completed" || type === "image_edit.completed";
      const isPartial = type === "image_generation.partial_image" || type === "image_edit.partial_image";
      if ((isFinal || isPartial) && payload?.b64_json) {
        sawAny = true;
        if (isFinal) sawCompleted = true;
        flushSync(() => onFrame(`data:image/png;base64,${payload.b64_json}`, isFinal));
      }
    }
  }

  if (streamError) { toast.error(streamError); throw new Error(streamError); }

  if (!sawAny) {
    const replay = await post({ prompt, style, stream: false });
    if (!replay.ok) { handleError(replay.status); throw new Error(`HTTP ${replay.status}`); }
    const json = await replay.json();
    const b64 = json?.data?.[0]?.b64_json;
    if (!b64) { toast.error("No image returned. Try a different prompt."); throw new Error("No image"); }
    onFrame(`data:image/png;base64,${b64}`, true);
    return;
  }

  if (!sawCompleted) {
    toast.error("Image generation ended early. Please try again.");
    throw new Error("Incomplete stream");
  }
}
