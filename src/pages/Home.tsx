import { Link } from "react-router-dom";
import { Mail, FileText, CalendarCheck, Sparkles, MessageCircle, ArrowRight, Sparkle, Image, Code2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import nataBrand from "@/assets/nata-brand.png";

const tools = [
  { url: "/email", icon: Mail, title: "Smart Email Generator", desc: "Polished emails matched to your tone and audience.", color: "from-rose-200/60 to-orange-200/60" },
  { url: "/notes", icon: FileText, title: "Meeting Notes Summarizer", desc: "Turn long transcripts into action items and decisions.", color: "from-pink-200/60 to-rose-200/60" },
  { url: "/planner", icon: CalendarCheck, title: "AI Task Planner", desc: "Prioritize tasks and time-block your day or week.", color: "from-orange-200/60 to-amber-200/60" },
  { url: "/research", icon: Sparkles, title: "Research Assistant", desc: "Distill any topic into clear, useful insights.", color: "from-rose-200/60 to-pink-200/60" },
  { url: "/image", icon: Image, title: "Image Studio", desc: "Generate on-brand visuals from a simple description.", color: "from-violet-200/60 to-pink-200/60" },
  { url: "/code", icon: Code2, title: "Code Generator", desc: "Write, explain, debug and optimize code fast.", color: "from-cyan-200/60 to-violet-200/60" },
  { url: "/chat", icon: MessageCircle, title: "Chat Assistant", desc: "An always-on partner for any productivity task.", color: "from-pink-200/60 to-orange-200/60" },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 px-6 sm:px-10 py-12 sm:py-14 shadow-glow bg-[hsl(255_50%_8%)]">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[hsl(265_85%_62%)]/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[hsl(188_90%_55%)]/30 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-56 w-56 rounded-full bg-[hsl(325_85%_65%)]/25 blur-3xl" />
        <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto">
          <img
            src={nataBrand}
            alt="NATA — Neural AI Task Assistant"
            className="w-full max-w-lg sm:max-w-xl drop-shadow-[0_8px_40px_rgba(168,85,247,0.45)]"
          />
          <p className="mt-8 text-base sm:text-lg text-white/75 leading-relaxed max-w-xl">
            NATA automates the everyday — emails, meeting notes, planning, research — so you can spend your energy on the work that truly matters.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Link to="/chat" className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-gradient-nata text-white font-medium shadow-soft hover:shadow-glow transition">
              Start a conversation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/email" className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition backdrop-blur">
              Draft an email
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold mb-5">Your toolkit</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.url} to={t.url} className="group">
              <Card className="rounded-2xl border-border/60 p-6 h-full shadow-card hover:shadow-glow transition-all hover:-translate-y-1 bg-card">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-4`}>
                  <t.icon className="h-5 w-5 text-rose" strokeWidth={2.2} />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1.5">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-cream/60 p-6 text-sm text-muted-foreground leading-relaxed">
        <strong className="text-foreground">A gentle reminder:</strong> AI-generated content may not always be accurate. Please review and adjust before sharing externally.
      </section>
    </div>
  );
}
