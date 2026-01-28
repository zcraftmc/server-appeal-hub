import { Layout } from "@/components/layout/Layout";
import { AppealForm } from "@/components/appeal/AppealForm";
import { Helmet } from "react-helmet-async";

const Appeal = () => {
  return (
    <>
      <Helmet>
        <title>Ban Appeal - Z-Craft</title>
        <meta 
          name="description" 
          content="Submit a ban appeal for Z-Craft Minecraft server. If you believe your ban was unjust, we'll review your case." 
        />
        <meta name="keywords" content="ban appeal, unban, Z-Craft, Minecraft server" />
        <link rel="canonical" href="https://appeal.z-craft.xyz" />
        
        <meta property="og:title" content="Ban Appeal - Z-Craft" />
        <meta property="og:description" content="Submit a ban appeal for Z-Craft Minecraft server." />
        <meta property="og:type" content="website" />
      </Helmet>

      <Layout>
        <div className="min-h-[calc(100vh-8rem)] bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            {/* Banner */}
            <div className="mb-12">
              <img 
                src="/banner.png" 
                alt="Z-Craft Ban Appeal Banner" 
                className="w-full max-h-[250px] object-contain rounded-xl"
              />
            </div>

            {/* Form Section */}
            <div className="max-w-3xl mx-auto">
              <AppealForm />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Appeal;
