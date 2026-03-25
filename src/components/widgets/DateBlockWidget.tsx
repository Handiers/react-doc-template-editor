import { useRef, useEffect } from "react";
import type { DateBlockWidget as DateBlockWidgetType } from "../../types";

interface Props {
  widget: DateBlockWidgetType;
  date?: string;
  scale?: number;
  isEditing?: boolean;
  onEditComplete?: (changes: Record<string, unknown>) => void;
}

function formatDate(date: Date, format: "long" | "short" | "iso"): string {
  switch (format) {
    case "long":
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    case "short":
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    case "iso":
      return date.toISOString().slice(0, 10);
    default:
      return date.toLocaleDateString();
  }
}

export function DateBlockWidget({ widget, date, scale = 1, isEditing, onEditComplete }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fontSize = widget.fontSize * scale;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const dateObj = date ? new Date(date) : new Date();
  const formattedDate = formatDate(dateObj, widget.format);

  if (isEditing) {
    return (
      <div className="rdte-w-full rdte-h-full rdte-flex rdte-items-center" style={{ fontSize, color: widget.color, fontWeight: widget.fontWeight === "bold" ? 700 : 400, textAlign: widget.align }}>
        {widget.showLabel && <span className="rdte-mr-1">{widget.label}</span>}
        <input
          ref={inputRef}
          defaultValue={widget.label}
          onBlur={(e) => onEditComplete?.({ label: e.currentTarget.value })}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") e.currentTarget.blur(); }}
          className="rdte-flex-1 rdte-border-none rdte-outline-none rdte-bg-transparent"
          style={{ fontSize, color: widget.color, fontFamily: "inherit" }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  return (
    <div
      className="rdte-w-full rdte-h-full rdte-flex rdte-items-center rdte-overflow-hidden"
      style={{ fontSize, color: widget.color, fontWeight: widget.fontWeight === "bold" ? 700 : 400, textAlign: widget.align }}
    >
      <div className="rdte-w-full" style={{ textAlign: widget.align }}>
        {widget.showLabel && <span className="rdte-mr-1">{widget.label}</span>}
        {formattedDate}
      </div>
    </div>
  );
}
