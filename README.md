
# 🚀 Gemini Live Full Stack Test Examples Repository

Welcome to the **Gemini Live Full Stack Test Examples** repo! 🎉 This collection showcases various ways to bootstrap, configure, and extend the `gemini-live-ws-server` package with JWT authentication, custom middleware, custom tools, mock handlers, and more. Each example lives in its own folder for easy exploration and copy-pasting.

---

## 📚 Table of Contents

* [📖 Overview]()
* [🗂️ Project Structure]()
* [⚙️ Setup &amp; Installation]()
* [🔑 Environment Variables]()
* [🚀 Usage Examples]()
  * [1. JWT Authentication]()
  * [2. Custom API Key Middleware]()
  * [3. Custom Tools &amp; Google API]()
  * [4. Basic Server with Debug &amp; Metrics]()
  * [5. Mock Translate Handler]()
* [📈 Metrics &amp; Monitoring]()
* [🤝 Contributing]()
* [📝 License]()

---

## 📖 Overview

This repository demonstrates several variants of setting up a WebSocket server using [`gemini-live-ws-server`](https://www.npmjs.com/package/gemini-live-ws-server). You can learn how to:

* Secure connections with **JWT** 🎟️
* Implement **custom authentication middleware** 🔐
* Register **custom tool functions** 🛠️
* Integrate with **Google APIs** 🌐
* Enable  **metrics** ,  **debug logs** , and **CORS** 🛡️
* Mock tool handlers (e.g., translate) for rapid prototyping 🤖

Each example includes fully annotated code and instructions to get you up and running in minutes.

---

## 🗂️ Project Structure

```bash
├── jwt-auth/                   # JWT authentication example
├── api-key-middleware/         # Custom API-key middleware
├── custom-tools/               # Custom tool registration + Google API
├── basic-server/               # Simplest server with debug & metrics
├── mock-translate/             # Mock translate_text handler example
└── index.html                  # Example client using CDN
```

---

## ⚙️ Setup & Installation

1. **Clone this repo**
   ```bash
   git clone https://github.com/omanandswami2005/gemini-live-full-stack-test.git
   cd gemini-live-full-stack-test
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Copy & modify**
   * Each example folder has its own `package.json`. Run `npm install` inside that folder and adjust `.env` as needed.
4. **Start the server**
   ```bash
   npm run start
   ```

---

## 🔑 Environment Variables

Create a `.env` file at the root of each example directory with the following:

```dotenv
PORT=8080              # Server listening port (default: 8080)
GOOGLE_API_KEY=xxx     # Your Google Cloud API key
MY_API_KEY=your-secret # For custom API-key middleware
JWT_SECRET=my-secret   # For JWT authentication
```

> 👉  **Tip** : Never commit your `.env` file to version control! Use `.gitignore`.

---

## 🚀 Usage Examples

### 1. JWT Authentication 🔐

* **Path:** `jwt-auth/index.ts`
* **Highlights:**
  * Uses `jwtSecret` option
  * Configures `retryConfig` for resilient startup

```ts
import { GeminiLiveWsServer } from "gemini-live-ws-server";

const server = new GeminiLiveWsServer({
  port: 8080,
  googleApiKey: process.env.GOOGLE_API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  retryConfig: { maxAttempts: 5, retryDelay: 3000 },
});

server.start();
```

### 2. Custom API Key Middleware 🔑

* **Path:** `api-key-middleware/index.ts`
* **Highlights:**
  * Reads token from `socket.handshake.auth.token`
  * Rejects connections on invalid key
  * Attaches `socket.user` on success

```ts
import dotenv from "dotenv";
import { GeminiLiveWsServer } from "gemini-live-ws-server";

dotenv.config();

const server = new GeminiLiveWsServer({
  tools: ["googleSearch", "codeExecution"],
  authMiddleware: (socket, next) => {
    const token = socket.handshake.auth.token;
    if (token === process.env.MY_API_KEY) {
      socket.user = { id: "omiii-2005" };
      next();
    } else {
      next(new Error("Invalid API key"));
    }
  },
  cors: { origin: "*" },
});

server.start();
```

### 3. Custom Tools & Google API 🛠️🌐

* **Path:** `custom-tools/index.ts`
* **Highlights:**
  * Registers built-in and custom tool definitions
  * Sets up `googleSetup` with TTS and audio modalities

```ts
import { GeminiLiveWsServer } from "gemini-live-ws-server";
import dotenv from "dotenv";

dotenv.config();

const server = new GeminiLiveWsServer({
  tools: [
    "translateText", "summarizeText", "generateCode", "searchWeb", "codeExecution",
    { functionDeclarations: [{ name: "custom_tool", description: "Custom tool", parameters: {} }]}
  ],
  googleSetup: {
    system_instruction: { parts:[{ text: "You are Soham, the helpful assistant." }] },
    generation_config: {
      response_modalities: ["audio"],
      speech_config: { voice_config: { prebuilt_voice_config: { voice_name: "Puck" }}}
    }
  },
  debug: true,
});

server.start();
```

### 4. Basic Server with Debug & Metrics 📊

* **Path:** `basic-server/index.ts`
* **Highlights:**
  * Enables CORS, metrics, and debug logging

```ts
import { GeminiLiveWsServer } from "gemini-live-ws-server";
import dotenv from "dotenv";

dotenv.config();

const server = new GeminiLiveWsServer({
  port: process.env.PORT || 8080,
  googleApiKey: process.env.GOOGLE_API_KEY,
  cors: { origin: "*", methods: ["GET","POST"] },
  enableMetrics: true,
  debug: true,
  tools: ["googleSearch","codeExecution"],
});

server.start();
```

### 5. Mock Translate Handler 🤖

* **Path:** `mock-translate/index.ts`
* **Highlights:**
  * Demonstrates responding to `translate_text` calls via `onToolCall`
  * Returns a simple mock mapping

```ts
import { GeminiLiveWsServer } from "gemini-live-ws-server";
const mockTranslate = ({ text, targetLanguage }) => ({ translatedText: `Translated '${text}' to ${targetLanguage}` });

const server = new GeminiLiveWsServer({
  googleApiKey: process.env.GOOGLE_API_KEY,
  tools: ["translateText","searchWeb","codeExecution"],
  hooks: {
    onToolCall: (toolCall, socket) => {
      if (toolCall.name === "translate_text") {
        const res = mockTranslate(toolCall.args);
        server.sendToolResponse(socket, { name: "translate_text", response: res, id: toolCall.id });
      }
    }
  },
  debug: true,
});

server.start();
```

---

## 📈 Metrics & Monitoring

All examples with **`enableMetrics: true`** log resource usage and activity every 20 seconds. Capture snapshots with:

```ts
server.metrics().subscribe(metrics => console.log(metrics), 20000);
```

---

## 🤝 Contributing

We welcome PRs! ✨ Please:

1. Fork this repo
2. Add your own example under a new folder
3. Submit a PR with a clear description

---

## 📝 License

This project is licensed under the Apache 2.0

---

Happy coding! 😎
