
// Mock function to handle translate_text
// This is just a placeholder. Replace with actual translation logic.
// For example, you can use a translation API to perform the translation.
// In this example, we'll just return a mock translation.
// You can replace this with your own translation logic or API call.

import { GeminiLiveWsServer } from "gemini-live-ws-server";
const handleTranslateText = ({ text, targetLanguage }) => {
  // Replace with actual translation logic (e.g., using a translation API)
  const mockTranslations = {
    en: { es: "Hola", fr: "Bonjour" },
  };
  return mockTranslations[text]?.[targetLanguage] || `Translated: hii to hola to bonjour`;
};


const server = new GeminiLiveWsServer({
  googleApiKey: "AIzaSyDJycbupGNFq9eeevTRWhqBbtb0gtcLPaA",
  tools: ["translateText",  "searchWeb", "codeExecution"],
  systemInstruction: "You are a helpful assistant named Soham.",
  enableMetrics: true,
  debug: true,
  hooks: {
    onToolCall: (toolCall, socket) => {
      console.log("Tool call received:", toolCall);
      if (toolCall.name === "translate_text") {
        const { text, targetLanguage } = toolCall.args;
        const translatedText = handleTranslateText({ text, targetLanguage });
        server.sendToolResponse(socket, {
          name: toolCall.name,
          response: { translatedText },
          id: toolCall.id,
        });
      }
    },
    onMessage: (data, socket) => {
      console.log("Message from Gemini:", data);
    },
  },
});

server.start();

server.metrics().subscribe(
  (metrics) => console.log("Metrics:", { ...metrics, timestamp: new Date().toISOString() }),
  20000
);

setTimeout(() => console.log("Snapshot:", server.metrics().get()), 22000);