import { Link } from "react-router-dom";
import { Gamepad2, Github, MessageCircle, Twitter } from "lucide-react";

const footerLinks = {
  server: [
    { name: "Home", href: "/" },
    { name: "Appeal", href: "/appeal" },
    { name: "Rules", href: "/rules" },
    { name: "Support", href: "/support" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
  social: [
    { name: "Discord", href: "https://discord.gg/zcraft", icon: MessageCircle },
    { name: "Twitter", href: "https://twitter.com/ZCraftMC", icon: Twitter },
    { name: "GitHub", href: "https://github.com/ZCraftMC", icon: Github },
  ],
};

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1 animate-fade-in">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="p-2 rounded-lg bg-gradient-primary text-primary-foreground group-hover:shadow-glow transition-all duration-300">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-foreground">Z-Craft</span>
                <span className="text-xs text-muted-foreground">Premium Experience</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The ultimate Minecraft survival experience. Fair, transparent, and community-driven.
            </p>
          </div>

          {/* Server Links */}
          <div className="animate-fade-in stagger-1">
            <h4 className="font-bold text-base mb-5 text-foreground">Server</h4>
            <ul className="space-y-3">
              {footerLinks.server.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="animate-fade-in stagger-2">
            <h4 className="font-bold text-base mb-5 text-foreground">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="animate-fade-in stagger-3">
            <h4 className="font-bold text-base mb-5 text-foreground">Community</h4>
            <div className="flex gap-3">
              {footerLinks.social.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-300 hover-glow"
                    aria-label={link.name}
                    title={link.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-muted-foreground text-sm font-medium">
              © {new Date().getFullYear()} Z-Craft. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">📍 play.z-craft.xyz</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground text-sm">🌍 Global Community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
