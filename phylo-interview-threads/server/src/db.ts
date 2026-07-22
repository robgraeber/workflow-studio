// In-memory "database".
//
// Everything lives in these arrays and resets when the server restarts. That
// is deliberate: this is an interview surface, not a product. Mutate these
// directly from the route handlers.

import type { Conversation, Message, Thread, User } from "./types.js";

/**
 * The "signed-in" user. Everything you create (messages, and later reactions
 * and replies) is authored by this id. It's mutable so the impersonation
 * switcher can act as any of the seeded users — there's no real auth here.
 */
const DEFAULT_USER_ID = "u_eddie";
let currentUserId = DEFAULT_USER_ID;

export function getCurrentUserId(): string {
  return currentUserId;
}

export function setCurrentUserId(id: string): void {
  currentUserId = id;
}

export const users: User[] = [
  { id: "u_eddie", name: "eddie", initial: "E", color: "e", presence: "away" },
  { id: "u_serena", name: "Serena", initial: "S", color: "s", presence: "active" },
  { id: "u_tianwei", name: "Tianwei", initial: "T", color: "t", presence: "away" },
];

// A single shared channel that all three users belong to. Keeping it to one
// channel (rather than per-user DMs) means the title is stable no matter who
// you're acting as — only the per-message author changes when you switch.
export const conversations: Conversation[] = [
  { id: "c_group", title: "on-call", memberIds: ["u_eddie", "u_serena", "u_tianwei"] },
];

// Seeded conversation. Times are baked as ISO strings so the UI is stable
// across restarts (no "now"-relative timestamps in the seed).
export const messages: Message[] = [
  {
    id: "m_1",
    conversationId: "c_group",
    authorId: "u_serena",
    body: "Did the on-call alert ever fire for you two? 😁",
    createdAt: "2026-07-15T15:14:00.000Z",
  },
  {
    id: "m_2",
    conversationId: "c_group",
    authorId: "u_eddie",
    body: "Haha add it if you want to be woken up",
    createdAt: "2026-07-15T15:16:00.000Z",
  },
  {
    id: "m_3",
    conversationId: "c_group",
    authorId: "u_tianwei",
    body: "I received a notification!",
    createdAt: "2026-07-15T15:19:00.000Z",
  },
  {
    id: "m_4",
    conversationId: "c_group",
    authorId: "u_serena",
    body: "Nice. Let's fold the runbook link into the alert body so nobody has to go digging at 3am.",
    createdAt: "2026-07-15T15:21:00.000Z",
  },
];

/** Reply threads, created lazily when a message receives its first reply. */
export const threads: Thread[] = [];

let seq = messages.length;
/** Monotonic id generator for new messages/entities. */
export function nextId(prefix = "m"): string {
  seq += 1;
  return `${prefix}_${seq}`;
}
