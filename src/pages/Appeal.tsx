import { Layout } from "@/components/layout/Layout";
import { AppealForm } from "@/components/appeal/AppealForm";
import { Helmet } from "react-helmet-async";
import { AlertCircle, Shield } from "lucide-react";

const Appeal = () => {
  return (
    <>
      <Helmet>
        <title>Ban Appeal - Z-Craft Minecraft Server</title>
        <meta 
          name="description" 
          content="Submit a ban appeal for Z-Craft Premium Minecraft server. Our experienced staff team will fairly review your case and provide a timely response." 
        />
        <meta name="keywords" content="ban appeal, unban, Z-Craft, Minecraft server, appeal form, fair review" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://appeal.z-craft.xyz" />
        
        <meta property="og:title" content="Ban Appeal - Z-Craft Minecraft Server" />
        <meta property="og:description" content="Submit a professional ban appeal for Z-Craft. Fair review process with expert staff." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://appeal.z-craft.xyz" />
        <meta property="og:image" content="https://appeal.z-craft.xyz/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ban Appeal - Z-Craft Minecraft Server" />
        <meta name="twitter:description" content="Submit your ban appeal for Z-Craft" />
        <meta name="theme-color" content="hsl(120, 60%, 42%)" />

        {/* JSON-LD structured data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Z-Craft Ban Appeal System",
            "description": "Official ban appeal system for Z-Craft Minecraft server",
            "url": "https://appeal.z-craft.xyz",
            "applicationCategory": "GameApplication",
            "inLanguage": "en-US"
          })}
        </script>
      </Helmet>

      <Layout>
        {/* Banner Section */}
        <div className="relative w-full overflow-hidden bg-gradient-primary text-primary-foreground">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-accent rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative container mx-auto px-4 py-16 md:py-24">
            <div className="flex items-start gap-4 mb-6 animate-slide-up">
              <div className="p-3 rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
                <Shield className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 animate-slide-up stagger-1">
                  Ban Appeal Form
                </h1>
                <p className="text-lg md:text-xl opacity-90 max-w-2xl animate-slide-up stagger-2">
                  We believe in fair judgment. If you believe your ban was unjust, submit your appeal below for our expert staff to review.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 animate-slide-up stagger-3">
              <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">48-72 hour response time</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Fair & transparent review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="min-h-[calc(100vh-400px)] flex items-center py-12">
          <div className="container mx-auto px-4">
            <div className="animate-slide-up">
              <AppealForm />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Appeal;
