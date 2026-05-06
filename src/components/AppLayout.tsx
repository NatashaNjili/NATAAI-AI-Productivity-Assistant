import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/email": { title: "Smart Email Generator", subtitle: "Craft polished emails in seconds" },
  "/notes": { title: "Meeting Notes Summarizer", subtitle: "Turn long notes into clear action items" },
  "/planner": { title: "AI Task Planner", subtitle: "Prioritize and time-block your day" },
  "/research": { title: "Research Assistant", subtitle: "Distill any topic into insights" },
  "/chat": { title: "Chat Assistant", subtitle: "Your all-purpose productivity companion" },
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const meta = titles[pathname] ?? { title: "Welcome", subtitle: "Choose a tool to get started" };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-hero">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center gap-3 border-b border-border/60 bg-background/60 backdrop-blur-xl px-4 sm:px-6 sticky top-0 z-10">
            <SidebarTrigger className="rounded-lg" />
            <div className="flex flex-col min-w-0">
              <h1 className="font-display text-lg sm:text-xl font-semibold leading-tight truncate">{meta.title}</h1>
              <p className="text-xs text-muted-foreground truncate">{meta.subtitle}</p>
            </div>
          </header>
          <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-[1400px] w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
