import cors from "cors";
import express from "express";
import {
  conversations,
  getCurrentUserId,
  messages,
  nextId,
  setCurrentUserId,
  threads,
  users,
} from "./db.js";
import type { Message } from "./types.js";

const app = express();
app.use(cors());
app.use(express.json());

// Small artificial latency so loading states are visible and the network tab
// tells the truth. Tune or remove during the interview if it gets in the way.
const LATENCY_MS = 250;
app.use((_req, _res, next) => setTimeout(next, LATENCY_MS));

// --- Reads ------------------------------------------------------------------

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

/** The signed-in user (whoever we're currently impersonating). */
app.get("/api/me", (_req, res) => {
  const me = users.find((u) => u.id === getCurrentUserId());
  res.json(me);
});

/** Switch which user we're acting as. No real auth — this is a dev switcher. */
app.post("/api/impersonate", (req, res) => {
  const userId = String(req.body?.userId ?? "");
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: "user not found" });
  setCurrentUserId(user.id);
  res.json(user);
});

app.get("/api/users", (_req, res) => {
  res.json(users);
});

app.get("/api/conversations", (_req, res) => {
  res.json(conversations);
});

app.get("/api/conversations/:id", (req, res) => {
  const convo = conversations.find((c) => c.id === req.params.id);
  if (!convo) return res.status(404).json({ error: "conversation not found" });
  res.json(convo);
});

/** Messages in a conversation, oldest first. */
app.get("/api/conversations/:id/messages", (req, res) => {
  const convo = conversations.find((c) => c.id === req.params.id);
  if (!convo) return res.status(404).json({ error: "conversation not found" });
  const items = messages
    .filter((m) => m.conversationId === convo.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  res.json(items);
});

// --- Writes -----------------------------------------------------------------

/** Post a new message. Authored by the signed-in user. */
app.post("/api/conversations/:id/messages", (req, res) => {
  const convo = conversations.find((c) => c.id === req.params.id);
  if (!convo) return res.status(404).json({ error: "conversation not found" });

  const body = String(req.body?.body ?? "").trim();
  if (!body) return res.status(400).json({ error: "body is required" });

  const message: Message = {
    id: nextId("m"),
    conversationId: convo.id,
    authorId: getCurrentUserId(),
    body,
    createdAt: new Date().toISOString(),
  };
  messages.push(message);
  res.status(201).json(message);
});

app.get("/api/conversations/:id/messages/:messageId/threadMessages", (req, res) => {
  const convo = conversations.find((c) => c.id === req.params.id);
  if (!convo) return res.status(404).json({ error: "conversation not found" });

  const parentMessage = messages.find(
    (m) => m.id === req.params.messageId && m.conversationId === convo.id,
  );
  if (!parentMessage) return res.status(404).json({ error: "message not found" });

  const thread = threads.find(
    (t) =>
      t.parentMessageId === parentMessage.id && t.conversationId === convo.id,
  );

  const items = [...(thread?.messages ?? [])].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
  res.json(items);
});

app.post("/api/conversations/:id/messages/:messageId/threadMessages", (req, res) => {
  const convo = conversations.find((c) => c.id === req.params.id);
  if (!convo) return res.status(404).json({ error: "conversation not found" });

  const parentMessage = messages.find(
    (m) => m.id === req.params.messageId && m.conversationId === convo.id,
  );
  if (!parentMessage) return res.status(404).json({ error: "message not found" });

  const body = String(req.body?.body ?? "").trim();
  if (!body) return res.status(400).json({ error: "body is required" });

  let thread = threads.find(
    (t) =>
      t.parentMessageId === parentMessage.id && t.conversationId === convo.id,
  );
  if (!thread) {
    thread = {
      id: nextId("t"),
      parentMessageId: parentMessage.id,
      conversationId: convo.id,
      messages: [],
    };
    threads.push(thread);
  }

  const message: Message = {
    id: nextId("m"),
    threadId: thread.id,
    authorId: getCurrentUserId(),
    body,
    createdAt: new Date().toISOString(),
  };
  thread.messages.push(message);
  res.status(201).json(message);
});

// ============================================================================
// CANDIDATE WORK STARTS HERE
// ============================================================================
//
// The two features live below. Nothing is wired up yet — the API shape and
// the data model are yours to design. Add your routes here, and keep the
// in-memory arrays in db.ts as the source of truth.
//
//   Reactions — let a user react to a message with an emoji, and show it.
//   Replies   — let a message have a thread of replies.

// --- Boot -------------------------------------------------------------------

const PORT = Number(process.env.PORT ?? 8787);
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
