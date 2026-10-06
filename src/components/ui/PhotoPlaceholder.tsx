import type { CSSProperties } from "react";

export function PhotoPlaceholder({
  label,
  className = "",
  style,
}: {
  label: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`photo-placeholder ${className}`} style={style} aria-label={label}>
      <span>PHOTO PLACEHOLDER</span>
      <strong>{label}</strong>
      <small>Replace from /public/images</small>
    </div>
  );
}
