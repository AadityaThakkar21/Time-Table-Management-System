import { Link } from "wouter";
import { CalendarRange, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <CalendarRange className="h-6 w-6" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Faculty<span className="text-primary">Scheduler</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI-Powered Generation</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
