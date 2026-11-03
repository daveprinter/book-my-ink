import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Bell, CalendarPlus, Grid3x3, Home, LayoutGrid, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import logo from "@/assets/logo.png";
import { heartbeat } from "@/lib/bookings.functions";
import { DISCOUNT_PCT } from "@/lib/catalog";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/tattoos", label: "Tattoo Gallery", icon: Grid3x3 },
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/book", label: "Book Appointment", icon: CalendarPlus },
  { to: "/my-bookings", label: "My Bookings", icon: Ticket },
  { to: "/notifications", label: "Notifications", icon: Bell },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    let id = localStorage.getItem("bmi_vid");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("bmi_vid", id);
    }
    const beat = () => heartbeat({ data: { id: id!, path: window.location.pathname } }).catch(() => {});
    beat();
    const t = setInterval(beat, 45000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r border-sidebar-border bg-sidebar md:w-64">
        <Link to="/" className="flex items-center gap-3 border-b border-sidebar-border p-3 md:p-4">
          <img src={logo} alt="BookMyInk logo" width={44} height={44} className="h-10 w-10 rounded-full md:h-11 md:w-11" />
          <span className="hidden font-display text-xl text-gold md:block">BookMyInk</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1 p-2 md:p-3">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? path === "/" : path.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                title={label}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                  active ? "bg-sidebar-accent text-primary" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="hidden md:inline">{label}</span>
              </Link>
            );
          })}
          <div className="mt-4 hidden rounded-md border border-primary/30 bg-primary/5 p-3 text-xs md:block">
            <Sparkles className="mb-1 h-4 w-4 text-primary" />
            <p className="font-semibold text-primary">{DISCOUNT_PCT}% OFF every tattoo</p>
            <p className="text-muted-foreground">Ongoing studio discount — applied automatically.</p>
          </div>
        </nav>
        <div className="border-t border-sidebar-border p-2 md:p-3">
          <Link
            to="/admin"
            title="Admin Panel"
            className="flex items-center gap-3 rounded-md border border-primary/40 px-3 py-2.5 text-sm text-primary hover:bg-primary/10"
          >
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span className="hidden md:inline">Admin Panel</span>
          </Link>
        </div>
      </aside>
      <div className="ml-16 flex min-w-0 flex-1 flex-col md:ml-64">
        <div className="bg-accent px-4 py-1.5 text-center text-xs font-medium text-accent-foreground">
          Limited-time offer, always on: {DISCOUNT_PCT}% off all designs · Only a deposit today, pay the rest on the day
        </div>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border px-6 py-8 text-sm text-muted-foreground">
          <p className="font-display text-gold">BookMyInk</p>
          <p>Your art, your artist, your appointment. Your next tattoo starts here.</p>
          <p className="mt-2">All prices in US dollars (USD). © {new Date().getFullYear()} BookMyInk</p>
        </footer>
      </div>
    </div>
  );
}
