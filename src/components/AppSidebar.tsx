import { NavLink, useLocation } from "react-router-dom";
import { Mail, FileText, CalendarCheck, Sparkles, MessageCircle } from "lucide-react";
import { NataLogo } from "./NataLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Notes Summarizer", url: "/notes", icon: FileText },
  { title: "Task Planner", url: "/planner", icon: CalendarCheck },
  { title: "Research Assistant", url: "/research", icon: Sparkles },
  { title: "Chat Assistant", url: "/chat", icon: MessageCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-4 py-5">
        <NavLink to="/" className="flex items-center gap-2.5">
          <NataLogo size={38} className="shrink-0 shadow-glow rounded-xl" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold leading-tight tracking-wide bg-gradient-nata bg-clip-text text-transparent">NATA</span>
              <span className="text-[10px] text-muted-foreground leading-tight uppercase tracking-[0.14em]">Neural AI Task Assistant</span>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">Workspace</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="data-[active=true]:bg-gradient-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-soft hover:bg-sidebar-accent rounded-xl h-11"
                    >
                      <NavLink to={item.url} className="flex items-center gap-3 px-3">
                        <item.icon className="h-[18px] w-[18px] shrink-0" />
                        {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <div className="m-3 rounded-2xl bg-gradient-soft border border-border/60 p-4 space-y-2">
          <p className="text-xs italic font-display text-rose leading-snug">
            "Work Smarter. Create More. Achieve Beyond."
          </p>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            ✨ AI-generated content may not always be accurate. Please review before use.
          </p>
          <div className="pt-2 border-t border-border/50 text-[10px] text-muted-foreground/80 leading-relaxed">
            © 2026 Natasha Njili. All Rights Reserved.<br />
            <span className="italic">Built with AI-powered productivity in mind.</span>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
