import { useRef, useEffect } from "react";
import type { HeadingWidget as HeadingWidgetType } from "../../types";

interface Props {
  widget: HeadingWidgetType;
  scale?: number;
  isEditing?: boolean;
  onEditComplete?: (changes: Record<string, unknown>) => void;
}

export function HeadingWidget({ widget, scale = 1, isEditing, onEditComplete }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const fontSize = widget.fontSize * scale;

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        defaultValue={widget.text}
        onBlur={(e) => onEditComplete?.({ text: e.currentTarget.value })}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") e.currentTarget.blur();
        }}
        className="rdte-w-full rdte-h-full rdte-border-none rdte-outline-none rdte-bg-transparent"
        style={{
          fontSize,
          color: widget.color,
          fontWeight: widget.fontWeight === "bold" ? 700 : 400,
          textAlign: widget.align,
          fontFamily: "inherit",
        }}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <div
      className="rdte-w-full rdte-h-full rdte-flex rdte-items-center rdte-overflow-hidden"
      style={{
        fontSize,
        color: widget.color,
        fontWeight: widget.fontWeight === "bold" ? 700 : 400,
        textAlign: widget.align,
      }}
    >
      <div className="rdte-w-full" style={{ textAlign: widget.align }}>{widget.text}</div>
    </div>
  );
}
