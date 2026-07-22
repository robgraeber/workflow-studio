// Inline SVG icons, ported from the design. Each takes an optional size.
import type { CSSProperties } from "react";

type IconProps = { size?: number; style?: CSSProperties };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const BackIcon = ({ size = 17, style }: IconProps) => (
  <svg {...base(size)} style={style}><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
);
export const ForwardIcon = ({ size = 17, style }: IconProps) => (
  <svg {...base(size)} style={style}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);
export const ClockIcon = ({ size = 17, style }: IconProps) => (
  <svg {...base(size)} style={style}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
);
export const SearchIcon = ({ size = 15, style }: IconProps) => (
  <svg {...base(size)} style={style}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);
export const HelpIcon = ({ size = 17, style }: IconProps) => (
  <svg {...base(size)} style={style}><circle cx="12" cy="12" r="9" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4" /><path d="M12 17.5h.01" /></svg>
);
export const ChevronDownIcon = ({ size = 14, style }: IconProps) => (
  <svg {...base(size)} style={style}><path d="m6 9 6 6 6-6" /></svg>
);
export const EditIcon = ({ size = 17, style }: IconProps) => (
  <svg {...base(size)} style={style}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
);
export const StarIcon = ({ size = 17, style }: IconProps) => (
  <svg {...base(size)} style={style}><path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9Z" /></svg>
);
export const MembersIcon = ({ size = 14, style }: IconProps) => (
  <svg {...base(size)} style={style}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" /><circle cx="17" cy="9" r="2.6" /><path d="M21.5 19.5c-.5-2.2-2-3.7-4.2-4.1" /></svg>
);
export const MessagesIcon = ({ size = 15, style }: IconProps) => (
  <svg {...base(size)} style={style}><path d="M21 12a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1L3 21l1.5-5.3a8.5 8.5 0 1 1 16.5-3.7Z" /></svg>
);
export const CanvasIcon = ({ size = 15, style }: IconProps) => (
  <svg {...base(size)} style={style}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h5" /></svg>
);
export const FilesIcon = ({ size = 15, style }: IconProps) => (
  <svg {...base(size)} style={style}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5" /></svg>
);
export const PlusIcon = ({ size = 15, style }: IconProps) => (
  <svg {...base(size)} style={style}><path d="M12 5v14M5 12h14" /></svg>
);
export const SmileIcon = ({ size = 16, style }: IconProps) => (
  <svg {...base(size)} style={style}><circle cx="12" cy="12" r="9" /><path d="M8.5 14a4.5 4.5 0 0 0 7 0" /><path d="M9 9.5h.01M15 9.5h.01" /></svg>
);
/** The "add reaction" glyph — a smiley with a small plus. */
export const AddReactionIcon = ({ size = 14, style }: IconProps) => (
  <svg {...base(size)} style={style}><circle cx="10" cy="11" r="7" /><path d="M7.5 12.5a3.5 3.5 0 0 0 5 0" /><path d="M8 9h.01M12 9h.01" /><path d="M18 3v6M15 6h6" /></svg>
);
export const ReplyIcon = ({ size = 15, style }: IconProps) => (
  <svg {...base(size)} style={style}><path d="M9 17H7a4 4 0 0 1 0-8h11" /><path d="m13 5-4 4 4 4" /></svg>
);
export const SendIcon = ({ size = 15, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M3.4 20.4 21.8 12 3.4 3.6l-.01 6.6L15 12 3.39 13.8Z" />
  </svg>
);
