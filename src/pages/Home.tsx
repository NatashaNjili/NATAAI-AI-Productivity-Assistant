import { Link } from "react-router-dom";
import { Mail, FileText, CalendarCheck, Sparkles, MessageCircle, ArrowRight, Sparkle } from "lucide-react";
import { Card } from "@/components/ui/card";

const tools = [
  { url: "/email", icon: Mail, title: "Smart Email Generator", desc: "Polished emails matched to your tone and audience.", color: "from-rose-200/60 to-orange-200/60" },
  { url: "/notes", icon: FileText, title: "Meeting Notes Summarizer", desc: "Turn long transcripts into action items and decisions.", color: "from-pink-200/60 to-rose-200/60" },
  { url: "/planner", icon: CalendarCheck, title: "AI Task Planner", desc: "Prioritize tasks and time-block your day or week.", color: "from-orange-200/60 to-amber-200/60" },
  { url: "/research", icon: Sparkles, title: "Research Assistant", desc: "Distill any topic into clear, useful insights.", color: "from-rose-200/60 to-pink-200/60" },
  { url: "/chat", icon: MessageCircle, title: "Chat Assistant", desc: "An always-on partner for any productivity task.", color: "from-pink-200/60 to-orange-200/60" },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-soft border border-border/60 px-6 sm:px-10 py-12 sm:py-16 shadow-card">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-coral/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-background/70 backdrop-blur px-3 py-1 text-xs font-medium border border-border/60">
            <Sparkle className="h-3 w-3 text-primary" /> <span className="bg-gradient-nata bg-clip-text text-transparent font-semibold tracking-wide">NATA</span> · Neural AI Task Assistant
          </div>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-foreground">
            Work <span className="italic bg-gradient-nata bg-clip-text text-transparent">Smarter.</span><br />
            Create More. <span className="bg-gradient-primary bg-clip-text text-transparent">Achieve Beyond.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
            NATA automates the everyday — emails, meeting notes, planning, research — so you can spend your energy on the work that matters.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/chat" className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-gradient-primary text-primary-foreground font-medium shadow-soft hover:shadow-glow transition">
              Start a conversation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/email" className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-background border border-border font-medium hover:bg-secondary transition">
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
