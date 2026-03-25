import { useEffect, useRef, useState } from "react";
import { useLabels } from "../i18n";

export interface ContextMenuPosition {
  x: number;
  y: number;
}

interface Props {
  position: ContextMenuPosition;
  widgetId: string;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveToFront: () => void;
  onMoveToBack: () => void;
  onClose: () => void;
  onEditTable?: () => void;
}

interface MenuItem {
  label: string;
  icon: string;
  action: () => void;
  danger?: boolean;
  divider?: boolean;
}

export function WidgetContextMenu({ position, onDelete, onDuplicate, onMoveToFront, onMoveToBack, onClose, onEditTable }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const labels = useLabels();
  const [adjustedPos, setAdjustedPos] = useState(position);

  useEffect(() => {
    if (!menuRef.current) return;
    const { width, height } = menuRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setAdjustedPos({ x: Math.min(position.x, vw - width - 8), y: Math.min(position.y, vh - height - 8) });
  }, [position]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose(); };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("mousedown", handleClick); document.removeEventListener("keydown", handleKey); };
  }, [onClose]);

  const items: MenuItem[] = [
    ...(onEditTable ? [{ label: labels["contextMenu.editTable"], icon: "✎", action: () => { onEditTable(); onClose(); }, divider: true } as MenuItem] : []),
    { label: labels["contextMenu.bringToFront"], icon: "↑", action: () => { onMoveToFront(); onClose(); } },
    { label: labels["contextMenu.sendToBack"], icon: "↓", action: () => { onMoveToBack(); onClose(); }, divider: true },
    { label: labels["contextMenu.duplicate"], icon: "⧉", action: () => { onDuplicate(); onClose(); }, divider: true },
    { label: labels["contextMenu.delete"], icon: "✕", action: () => { onDelete(); onClose(); }, danger: true },
  ];

  return (
    <div
      ref={menuRef}
      style={{ position: "fixed", left: adjustedPos.x, top: adjustedPos.y, zIndex: 9999 }}
      className="rdte-min-w-[160px] rdte-rounded-lg rdte-border rdte-border-gray-200 rdte-bg-white rdte-py-1 rdte-shadow-xl"
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item) => (
        <div key={item.label}>
          <button
            onClick={(e) => { e.stopPropagation(); item.action(); }}
            className={`rdte-flex rdte-w-full rdte-items-center rdte-gap-2.5 rdte-px-3 rdte-py-2 rdte-text-left rdte-text-sm rdte-transition-colors ${
              item.danger ? "rdte-text-red-600 hover:rdte-bg-red-50" : "rdte-text-gray-700 hover:rdte-bg-gray-50"
            }`}
          >
            <span className="rdte-w-4 rdte-text-center rdte-text-xs rdte-opacity-60">{item.icon}</span>
            {item.label}
          </button>
          {item.divider && <div className="rdte-my-1 rdte-border-t rdte-border-gray-100" />}
        </div>
      ))}
    </div>
  );
}
