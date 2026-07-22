// Domain types for the Phylo DM app (client copy).
//
// Kept in sync by hand with server/src/types.ts. The two interview features —
// emoji reactions and threaded replies — are intentionally NOT modeled here.
// Designing them is the exercise.

export type Presence = "active" | "away";

export interface User {
  id: string;
  name: string;
  initial: string;
  color: string;
  presence: Presence;
  ooo?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  memberIds: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  authorId: string;
  body: string;
  createdAt: string;

  // TODO(candidate): reactions — unmodeled; the shape is yours to design.
  // TODO(candidate): threaded replies — unmodeled; the shape is yours to design.
}
