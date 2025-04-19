// JWT Authentication:
import { GeminiLiveWsServer } from "gemini-live-ws-server";
const server = new GeminiLiveWsServer({
  port: 8080,
  googleApiKey: "my-google-api-key",
  jwtSecret: "my-secret-key",
  retryConfig: { maxAttempts: 5, retryDelay: 3000 },
});
server.start();