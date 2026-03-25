import { useRef, useEffect } from "react";
import type { TextWidget as TextWidgetType } from "../../types";

interface Props {
  widget: TextWidgetType;
  scale?: number;
  isEditing?: boolean;
  onEditComplete?: (changes: Record<string, unknown>) => void;
}

export function TextWidget({ widget, scale = 1, isEditing, onEditComplete }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const fontSize = widget.fontSize * scale;

  const baseStyle: React.CSSProperties = {
    fontSize,
    color: widget.color,
    fontWeight: widget.fontWeight === "bold" ? 700 : 400,
    fontStyle: widget.fontStyle,
    textAlign: widget.align,
    lineHeight: widget.lineHeight,
    backgroundColor: widget.backgroundColor,
    padding: widget.padding,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        defaultValue={widget.content}
        onBlur={(e) => onEditComplete?.({ content: e.currentTarget.value })}
        onKeyDown={(e) => { if (e.key === "Escape") e.currentTarget.blur(); }}
        style={{
          ...baseStyle,
          width: "100%",
          height: "100%",
          border: "none",
          outline: "none",
          resize: "none",
          background: widget.backgroundColor || "transparent",
          fontFamily: "inherit",
        }}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <div className="rdte-w-full rdte-h-full rdte-overflow-hidden" style={baseStyle}>
      {widget.content}
    </div>
  );
}
