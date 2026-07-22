import type { User } from "../types.js";

type AvatarProps = {
  user: User;
  size?: "sm" | "md";
  /** Show the presence dot (active/away). */
  presence?: boolean;
};

/** A single square avatar tile with an optional presence dot. */
export function Avatar({ user, size = "md", presence = false }: AvatarProps) {
  return (
    <span className={`av av-${user.color}${size === "sm" ? " sm" : ""}`}>
      <span className="tile">{user.initial}</span>
      {presence && <span className={`dot${user.presence === "away" ? " away" : ""}`} />}
    </span>
  );
}

/** Two overlapping tiles for a group conversation. */
export function AvatarPair({ users }: { users: User[] }) {
  const [a, b] = users;
  return (
    <span className="av-pair">
      {a && <Avatar user={a} size="sm" />}
      {b && <Avatar user={b} size="sm" />}
    </span>
  );
}
