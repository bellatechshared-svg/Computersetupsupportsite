import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-7ae92208/health", (c) => {
  return c.json({ status: "ok" });
});

app.post("/make-server-7ae92208/submit-contact", async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const key = `contact_${timestamp}_${id}`;
    
    await kv.set(key, { ...body, submittedAt: timestamp, status: 'new' });
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error("Error saving contact:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

Deno.serve(app.fetch);