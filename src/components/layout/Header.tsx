import { Link } from "react-router-dom";
import { Gamepad2, Home } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-emerald-500/30">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 text-white group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">Z-Craft</span>
              <span className="text-xs text-emerald-400/80">Appeal Hub</span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            
            <a 
              href="https://z-craft.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 font-medium transition-colors relative group"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all"></span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
