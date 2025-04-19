import { GeminiLiveWsServer } from "gemini-live-ws-server";
import dotenv from "dotenv";
dotenv.config();


const server = new GeminiLiveWsServer({
  port: 8080,
  googleApiKey: process.env.GOOGLE_API_KEY,
  cors: { origin: "*", methods: ["GET", "POST"] },
  enableMetrics: true,
  tools: [
    "googleSearch",
    "codeExecution",
  ],
  systemInstruction: "You are a helpful assistant named omii. You have the following tools available to you:  - googlesearch: Search the web and - code_execution: Execute code",
  debug: true
});
server.start();
server.metrics().subscribe(
  (metrics) => console.log("Metrics:", { ...metrics, timestamp: new Date().toISOString() }),
  20000
);