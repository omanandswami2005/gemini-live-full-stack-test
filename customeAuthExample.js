// Custom Authentication Middleware
import { GeminiLiveWsServer } from "gemini-live-ws-server";
import dotenv from "dotenv";
dotenv.config();
const server = new GeminiLiveWsServer({
  port: process.env.PORT || 8080,
  tools: [
    "googleSearch",
    "codeExecution",
  ],
  googleApiKey: process.env.GOOGLE_API_KEY,
  cors: { origin: "*", methods: ["GET", "POST"] },
  authMiddleware: (socket, next) => {
    const apiKey = socket.handshake.auth.token;
    console.log(`Authentication attempt with API key: ${apiKey}`);
    if (apiKey === process.env.MY_API_KEY) {
      socket.user = { id: "omiii-2005" };
      next();
    } else {
      next(new Error("Invalid API key"));
    }
  },
  hooks: {
    onClientConnect: (socket) => console.log(`Custom connect: ${socket.id}`),
    onError: (err, socket) => console.error(`Error for ${socket.id}: ${err.message}`),
  },
  systemInstruction: "You are a helpful assistant named omii. You have the following tools available to you:  - googlesearch: Search the web and - code_execution: Execute code",
  enableMetrics: true,
});
server.start();
server.metrics().subscribe(
    (metrics) => console.log("Metrics:", { ...metrics, timestamp: new Date().toISOString() }),
    20000
  );