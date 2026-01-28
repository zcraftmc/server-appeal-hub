import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

const footerLinks = {
  server: [
    { name: "Home", href: "https://z-craft.xyz", external: true },
    { name: "Appeal", href: "/" },
  ],
  legal: [
    { name: "Privacy Policy", href: "https://z-craft.xyz/privacy", external: true },
    { name: "Terms of Service", href: "https://z-craft.xyz/terms", external: true },
  ],
};

export const Footer = () => {
  return (
    <footer className="border-t border-emerald-500/20 bg-gradient-to-b from-slate-950 to-slate-900 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 text-white group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all">
                <Gamepad2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white">Z-Craft</span>
                <span className="text-xs text-emerald-400/80">Appeal Hub</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Fair appeals, quick responses, community first. Transparent and user-friendly appeal system.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-bold text-base mb-4 text-white">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.server.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-emerald-400 text-sm font-medium transition-colors inline-flex items-center gap-1"
                    >
                      {link.name} →
                    </a>
                  ) : (
                    <Link 
                      to={link.href}
                      className="text-gray-400 hover:text-emerald-400 text-sm font-medium transition-colors inline-flex items-center gap-1"
                    >
                      {link.name} →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold text-base mb-4 text-white">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-emerald-400 text-sm font-medium transition-colors inline-flex items-center gap-1"
                  >
                    {link.name} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-emerald-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm font-medium">
              © {new Date().getFullYear()} Z-Craft. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">📍 <span>play.zcraftmc.xyz</span></span>
              <span>•</span>
              <span className="flex items-center gap-1">🌍 <span>Global Community</span></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
