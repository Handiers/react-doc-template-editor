import { useRef, useEffect } from "react";
import type { NoteWidget as NoteWidgetType, DocumentData } from "../../types";

interface Props {
  widget: NoteWidgetType;
  data?: DocumentData;
  noteText?: string;
  scale?: number;
  isEditing?: boolean;
  onEditComplete?: (changes: Record<string, unknown>) => void;
  onNoteChange?: (notes: string) => void;
}

export function NoteWidget({ widget, data, noteText, scale = 1, isEditing, onEditComplete, onNoteChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fontSize = widget.fontSize * scale;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const displayText = noteText ?? data?.notes ?? "";
  const bgStyle = widget.showBg ? { backgroundColor: widget.bgColor, borderRadius: widget.borderRadius } : {};

  if (isEditing) {
    return (
      <div className="rdte-w-full rdte-h-full rdte-overflow-hidden" style={{ ...bgStyle, fontSize, color: widget.color }}>
        {widget.showLabel && (
          <div className="rdte-font-semibold rdte-mb-1">{widget.label}</div>
        )}
        <textarea
          ref={textareaRef}
          defaultValue={displayText}
          onBlur={(e) => {
            if (onNoteChange) {
              onNoteChange(e.currentTarget.value);
            } else {
              onEditComplete?.({ label: e.currentTarget.value });
            }
          }}
          className="rdte-w-full rdte-flex-1 rdte-border-none rdte-outline-none rdte-bg-transparent rdte-resize-none"
          style={{ fontSize, color: widget.color, fontFamily: "inherit", minHeight: "3em" }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  return (
    <div className="rdte-w-full rdte-h-full rdte-overflow-hidden rdte-p-2" style={{ ...bgStyle, fontSize, color: widget.color }}>
      {widget.showLabel && (
        <div className="rdte-font-semibold rdte-mb-1">{widget.label}</div>
      )}
      <div style={{ whiteSpace: "pre-wrap" }}>{displayText}</div>
    </div>
  );
}
