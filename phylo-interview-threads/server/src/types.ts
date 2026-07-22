// Domain types for the Phylo DM app.
//
// These are intentionally minimal. The two features — emoji reactions and
// threaded replies — are NOT modeled here yet; designing how they should be
// represented is part of the task.
//
// NOTE: this file is duplicated in web/src/types.ts. If you change a shared
// shape, change it in both places (kept in sync by hand to avoid a
// build-tooling detour).

export type Presence = "active" | "away";

export interface User {
  id: string;
  name: string;
  /** Single letter shown in the avatar tile. */
  initial: string;
  /** Avatar color key: maps to a CSS class (av-s, av-t, av-e, ...). */
  color: string;
  presence: Presence;
  /** Out of office — renders an "OOO" chip next to the name. */
  ooo?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  memberIds: string[];
}

export interface Message {
  id: string;
  conversationId?: string;
  threadId?: string;
  authorId: string;
  body: string;
  /** ISO 8601 timestamp. */
  createdAt: string;

  // ---------------------------------------------------------------------------
  // TODO(candidate): reactions — let users react to a message with an emoji.
  // TODO(candidate): threaded replies — let a message have a thread of replies.
  // (Both are unmodeled on purpose — the data model is yours to design.)
  // ---------------------------------------------------------------------------
}



export interface Thread {
  id: string;
  parentMessageId: string;
  conversationId: string;
  messages: Message[];
}
