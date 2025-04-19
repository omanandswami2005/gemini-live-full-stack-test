// Example of using the server with a custom tool and Google API key
// Uncomment the following lines to test the server with a custom tool and Google API key
import { GeminiLiveWsServer } from "gemini-live-ws-server";
import dotenv from "dotenv";
dotenv.config();
const server = new GeminiLiveWsServer({
  googleApiKey: process.env.GOOGLE_API_KEY,
  tools: [
    "translateText",
    "summarizeText",
    "generateCode",
    "searchWeb",
    "codeExecution",
    // Custom tool example
    { functionDeclarations: [{ name: "custom_tool", description: "Custom tool", parameters: { type: "OBJECT", properties: {} } }] },
  ],
  googleSetup: {
    system_instruction: { parts: [{ text: "You are a helpful assistant named Soham." }] },
    generation_config: {
      response_modalities: ["audio"],
      speech_config: { voice_config: { prebuilt_voice_config: { voice_name: "Puck" } } },
    },
  },
  enableMetrics: true,
  debug: true,
  hooks: {
    onMessage: (data, socket) => {
      if (data.toolCall) console.log("Tool call:", data.toolCall);
      else if (data.serverContent) console.log("Server content:", data.serverContent);
      else if (data.setupComplete) console.log("Setup complete:", data.setupComplete);
      
    },
  },
});

server.start();

server.metrics().subscribe(
  (metrics) => console.log("Metrics:", { ...metrics, timestamp: new Date().toISOString() }),
  20000
);

setTimeout(() => console.log("Snapshot:", server.metrics().get()), 22000);