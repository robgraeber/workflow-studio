import { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";
import { Conversation } from "./components/Conversation.js";
import { Sidebar } from "./components/Sidebar.js";
import { Topbar } from "./components/Topbar.js";
import type { Conversation as Convo, Message, User } from "./types.js";

export default function App() {
  const [me, setMe] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Convo[]>([]);
  const [activeId, setActiveId] = useState<string>("c_group");

  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Load the static bits once.
  useEffect(() => {
    api.me().then(setMe).catch(console.error);
    api.users().then(setUsers).catch(console.error);
    api.conversations().then(setConversations).catch(console.error);
  }, []);

  // Reload messages whenever the active conversation changes.
  useEffect(() => {
    let cancelled = false;
    setLoadingMessages(true);
    api
      .messages(activeId)
      .then((items) => {
        if (!cancelled) setMessages(items);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  const usersById = useMemo(() => {
    const map: Record<string, User> = {};
    for (const u of users) map[u.id] = u;
    return map;
  }, [users]);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  async function handleSend(body: string) {
    const created = await api.sendMessage(activeId, body);
    setMessages((prev) => [...prev, created]);
  }

  async function handleImpersonate(userId: string) {
    const user = await api.impersonate(userId);
    setMe(user);
  }

  return (
    <div className="app">
      <Topbar />
      <div className="main">
        <Sidebar
          conversations={conversations}
          users={users}
          me={me}
          activeId={activeId}
          onSelect={setActiveId}
          onImpersonate={handleImpersonate}
        />
        <Conversation
          conversation={activeConversation}
          messages={messages}
          usersById={usersById}
          me={me}
          loading={loadingMessages}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
