
'use client'
import { useEffect } from "react";
import AnemiaTester from "~/components/AnemiaTester";
import AnemiaDetectionHomepage from "~/components/Home";

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
    <AnemiaDetectionHomepage />
  )
}

