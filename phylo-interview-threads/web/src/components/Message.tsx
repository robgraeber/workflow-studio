import type { Message as Msg, User } from "../types.js";
import { Avatar } from "./Avatar.js";
import { AddReactionIcon, ReplyIcon } from "./icons.js";

type MessageProps = {
  message: Msg;
  author: User;
  me: User | null;
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

export function Message({ message, author }: MessageProps) {
  return (
    <div className="msg">
      <Avatar user={author} />
      <div className="msg-main">
        <div className="meta">
          <span className="name">
            <strong>{author.name}</strong>
            {author.ooo && <span className="ooo-chip">OOO</span>}
          </span>
          <time>{formatTime(message.createdAt)}</time>
        </div>

        <p className="body">{message.body}</p>

        {/* ------------------------------------------------------------------ */}
        {/* TODO(candidate): REACTIONS                                          */}
        {/*   Render the reaction pills here (emoji + count), plus the          */}
        {/*   "add reaction" button. The <AddReactionIcon /> is imported and    */}
        {/*   ready, and pill styling already exists in styles.css.             */}
        {/* ------------------------------------------------------------------ */}

        {/* Hover actions. "Reply in thread" is the entry point for the         */}
        {/* threaded-replies feature — wire it up when you get there.           */}
        <div className="msg-actions">
          <button className="msg-action" aria-label="Add reaction">
            <AddReactionIcon />
          </button>
          <button className="msg-action" aria-label="Reply in thread">
            <ReplyIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
