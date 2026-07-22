import type { Conversation as Convo, Message as Msg, User } from "../types.js";
import { Composer } from "./Composer.js";
import { Message } from "./Message.js";
import { CanvasIcon, FilesIcon, MembersIcon, MessagesIcon, PlusIcon, StarIcon } from "./icons.js";

type ConversationProps = {
  conversation: Convo | null;
  messages: Msg[];
  usersById: Record<string, User>;
  me: User | null;
  loading: boolean;
  onSend: (body: string) => Promise<void>;
};

export function Conversation({
  conversation,
  messages,
  usersById,
  me,
  loading,
  onSend,
}: ConversationProps) {
  if (!conversation) {
    return <section className="convo" aria-label="Conversation" />;
  }

  return (
    <section className="convo" aria-label={`Conversation: ${conversation.title}`}>
      <div className="convo-head">
        <button className="iconbtn" aria-label="Star channel"><StarIcon /></button>
        <h2>
          <span className="channel-hash-inline">#</span>
          {conversation.title}
        </h2>
        <span className="members">
          <MembersIcon /> {conversation.memberIds.length}
        </span>
      </div>

      <div className="tabs" role="tablist">
        <button className="tab" role="tab" aria-selected="true"><MessagesIcon /> Messages</button>
        <button className="tab" role="tab" aria-selected="false"><CanvasIcon /> Add canvas</button>
        <button className="tab" role="tab" aria-selected="false"><FilesIcon /> Files &amp; links</button>
        <button className="tab" role="tab" aria-selected="false" aria-label="Add tab"><PlusIcon /></button>
      </div>

      <div className="stream">
        {loading ? (
          <div className="stream-status">Loading messages…</div>
        ) : messages.length === 0 ? (
          <div className="stream-status">No messages yet. Say something.</div>
        ) : (
          messages.map((m) => {
            const author = usersById[m.authorId];
            return author ? (
              <Message key={m.id} message={m} author={author} me={me} />
            ) : null;
          })
        )}
      </div>

      <Composer conversationTitle={`#${conversation.title}`} onSend={onSend} />
    </section>
  );
}
