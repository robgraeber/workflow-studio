import { useEffect, useRef, useState } from "react";
import type { User } from "../types.js";
import { Avatar } from "./Avatar.js";
import { ChevronDownIcon } from "./icons.js";

type UserSwitcherProps = {
  users: User[];
  me: User | null;
  onSelect: (userId: string) => void;
};

/**
 * Dev-only identity switcher. Pins to the bottom of the sidebar and lets you
 * act as any seeded user, so a single browser can play all sides of a
 * conversation (messages, and later reactions and replies).
 */
export function UserSwitcher({ users, me, onSelect }: UserSwitcherProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close the menu on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="switcher" ref={rootRef}>
      {open && (
        <div className="switcher-menu" role="menu">
          {users.map((u) => (
            <button
              key={u.id}
              className="switcher-item"
              role="menuitemradio"
              aria-checked={u.id === me?.id}
              onClick={() => {
                onSelect(u.id);
                setOpen(false);
              }}
            >
              <Avatar user={u} size="sm" />
              <span className="nm">{u.name}</span>
              {u.id === me?.id && <span className="switcher-check">✓</span>}
            </button>
          ))}
        </div>
      )}

      <button
        className="switcher-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {me ? <Avatar user={me} size="sm" presence /> : <span className="av sm" />}
        <span className="switcher-label">
          <span className="switcher-caption">Acting as</span>
          <span className="nm">{me?.name ?? "…"}</span>
        </span>
        <ChevronDownIcon />
      </button>
    </div>
  );
}
