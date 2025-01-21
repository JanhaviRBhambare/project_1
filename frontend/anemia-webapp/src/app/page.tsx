
'use client'
import { useEffect } from "react";
import AnemiaTester from "~/components/AnemiaTester";

export default function Home() {


  useEffect(() => {
    // Watson Assistant Chat Options
    window.watsonAssistantChatOptions = {
      integrationID: "19a98b34-2ce7-4f26-9cd9-ea6d105ca4c6", // Replace with your integration ID
      region: "us-south", // Replace with your region
      serviceInstanceID: "0abbafa9-0e8d-420e-9b84-595919dfbeca", // Replace with your service instance ID
      onLoad: async (instance: any) => {
        await instance.render();
      },
    };

    // Inject Watson Assistant Script
    const script = document.createElement('script');
    script.src =
      "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" +
      (window.watsonAssistantChatOptions.clientVersion || 'latest') +
      "/WatsonAssistantChatEntry.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      document.head.removeChild(script);
    };
  }, []);

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-700 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">AnemoTech</h1>
          <p className="text-sm">Advanced Anemia Detection Technology</p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <center><h2 className="text-2xl font-semibold mb-4 text-gray-800">Anemia Detection Test</h2>
          <p className="mb-8 text-gray-600">
            Capture images of your eye, nail, and palm to assess your risk of anemia.
            Our AI-powered technology provides quick and non-invasive screening.
          </p></center>
        <AnemiaTester />
      </main>
      <footer className="bg-gray-200 py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          © {year} AnemoTech. For informational purposes only. Consult a healthcare professional for medical advice.
        </div>
      </footer>

    </div>
  )
}

