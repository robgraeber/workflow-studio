import type { Conversation, User } from "../types.js";
import { UserSwitcher } from "./UserSwitcher.js";
import { ChevronDownIcon, EditIcon } from "./icons.js";

type SidebarProps = {
  conversations: Conversation[];
  users: User[];
  me: User | null;
  activeId: string;
  onSelect: (id: string) => void;
  onImpersonate: (userId: string) => void;
};

export function Sidebar({
  conversations,
  users,
  me,
  activeId,
  onSelect,
  onImpersonate,
}: SidebarProps) {
  return (
    <aside className="dmlist" aria-label="Channels">
      <div className="dmlist-head">
        <h1>
          Channels <ChevronDownIcon />
        </h1>
        <button className="iconbtn" aria-label="New channel"><EditIcon /></button>
      </div>

      <div className="finddm">
        <input type="text" placeholder="Find a channel…" aria-label="Find a channel" />
      </div>

      <div className="dmrows">
        {conversations.map((c) => (
          <button
            key={c.id}
            className="dmrow channel-row"
            aria-current={c.id === activeId ? "true" : undefined}
            onClick={() => onSelect(c.id)}
          >
            <span className="channel-hash">#</span>
            <span className="dmrow-text">
              <span className="who">
                <span className="nm">{c.title}</span>
              </span>
              <span className="preview">{c.memberIds.length} members</span>
            </span>
          </button>
        ))}
      </div>

      <UserSwitcher users={users} me={me} onSelect={onImpersonate} />
    </aside>
  );
}
