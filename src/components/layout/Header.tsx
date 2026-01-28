import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Gamepad2 } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50 animate-fade-in shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-xl font-bold hover-glow group transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-gradient-primary text-primary-foreground group-hover:shadow-glow transition-all duration-300">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground">Z-Craft</span>
              <span className="text-xs text-muted-foreground font-normal">Appeal Hub</span>
            </div>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
