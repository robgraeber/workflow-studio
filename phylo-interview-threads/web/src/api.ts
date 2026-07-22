// Thin API client. Every call goes to /api/* and is proxied to the Express
// server in dev (see vite.config.ts).

import type { Conversation, Message, User } from "./types.js";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  me: () => get<User>("/api/me"),
  users: () => get<User[]>("/api/users"),
  impersonate: (userId: string) => post<User>("/api/impersonate", { userId }),
  conversations: () => get<Conversation[]>("/api/conversations"),
  messages: (conversationId: string) =>
    get<Message[]>(`/api/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, body: string) =>
    post<Message>(`/api/conversations/${conversationId}/messages`, { body }),

  // TODO(candidate): reaction + reply calls go here, once you've decided on the
  // API shape.
};
