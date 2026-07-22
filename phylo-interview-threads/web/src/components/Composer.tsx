import { useState } from "react";
import { PlusIcon, SendIcon, SmileIcon } from "./icons.js";

type ComposerProps = {
  conversationTitle: string;
  onSend: (body: string) => Promise<void>;
};

export function Composer({ conversationTitle, onSend }: ComposerProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const ready = text.trim().length > 0 && !sending;

  async function submit() {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      await onSend(body);
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="composer">
      <div className="composer-box">
        <textarea
          className="entry"
          rows={1}
          value={text}
          placeholder={`Message ${conversationTitle}`}
          aria-label={`Message ${conversationTitle}`}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void submit();
            }
          }}
        />
        <div className="actrow">
          <button className="iconbtn" aria-label="Attach"><PlusIcon size={16} /></button>
          <button className="iconbtn" aria-label="Emoji"><SmileIcon /></button>
          <button
            className={`send${ready ? " ready" : ""}`}
            aria-label="Send message"
            disabled={!ready}
            onClick={() => void submit()}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
