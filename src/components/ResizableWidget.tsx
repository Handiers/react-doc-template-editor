import React, { useState, useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { WidgetPosition } from "../types";
import type { SnapGuide } from "./SnapGuides";

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

interface ResizableWidgetProps {
  id: string;
  position: WidgetPosition;
  onPositionChange: (id: string, position: WidgetPosition) => void;
  children: React.ReactNode;
  isSelected?: boolean;
  onSelect?: () => void;
  onDoubleClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  snappedDelta?: { x: number; y: number } | null;
  onResizeMove?: (id: string, proposed: WidgetPosition, handle: ResizeHandle) => { position: WidgetPosition; guides: SnapGuide[] };
  onResizeEnd?: () => void;
}

export function ResizableWidget({
  id,
  position,
  onPositionChange,
  children,
  isSelected,
  onSelect,
  onDoubleClick,
  onContextMenu,
  snappedDelta,
  onResizeMove,
  onResizeEnd,
}: ResizableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id, data: { position } });

  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const resizeState = useRef<{
    handle: ResizeHandle;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeState.current) return;
      const { handle, startX, startY, startWidth, startHeight, startPosX, startPosY } = resizeState.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;
      if (handle.includes("e")) newWidth = Math.max(20, startWidth + deltaX);
      if (handle.includes("s")) newHeight = Math.max(20, startHeight + deltaY);
      if (handle.includes("w")) { newWidth = Math.max(20, startWidth - deltaX); if (newWidth > 20) newX = startPosX + deltaX; }
      if (handle.includes("n")) { newHeight = Math.max(20, startHeight - deltaY); if (newHeight > 20) newY = startPosY + deltaY; }
      const raw: WidgetPosition = { x: newX, y: newY, width: newWidth, height: newHeight };
      const snapped = onResizeMove ? onResizeMove(id, raw, handle) : { position: raw, guides: [] };
      onPositionChange(id, snapped.position);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        resizeState.current = null;
        onResizeEnd?.();
      }
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, id, onPositionChange, onResizeMove, onResizeEnd]);

  const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    resizeState.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: position.width,
      startHeight: position.height,
      startPosX: position.x,
      startPosY: position.y,
    };
    if (onSelect) onSelect();
  };

  const effectiveDx = isDragging ? (snappedDelta?.x ?? transform?.x ?? 0) : 0;
  const effectiveDy = isDragging ? (snappedDelta?.y ?? transform?.y ?? 0) : 0;

  const style: React.CSSProperties = {
    position: "absolute",
    left: position.x,
    top: position.y,
    width: position.width,
    height: position.height,
    transform: isDragging ? `translate3d(${effectiveDx}px, ${effectiveDy}px, 0)` : undefined,
    zIndex: isDragging || isResizing || isSelected ? 10 : 1,
    opacity: isDragging ? 0.55 : 1,
    cursor: isResizing ? "auto" : "grab",
    touchAction: "none",
  };

  const showHandles = (isHovered || isSelected || isResizing) && !isDragging;
  const handleClass = "rdte-absolute rdte-bg-white rdte-border-2 rdte-border-blue-500 rdte-rounded-sm rdte-shadow-sm";
  const handleSize = { width: 14, height: 14 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rdte-group rdte-absolute rdte-box-border ${showHandles ? "rdte-ring-2 rdte-ring-blue-500" : "rdte-ring-1 rdte-ring-transparent hover:rdte-ring-blue-200"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick?.(); }}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu?.(e); }}
      {...listeners}
      {...attributes}
    >
      <div className="rdte-w-full rdte-h-full rdte-overflow-hidden">{children}</div>

      {showHandles && (
        <>
          <div className={handleClass} style={{ ...handleSize, top: -7, left: -7, cursor: "nwse-resize" }} onMouseDown={(e) => handleResizeStart(e, "nw")} />
          <div className={handleClass} style={{ ...handleSize, top: -7, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" }} onMouseDown={(e) => handleResizeStart(e, "n")} />
          <div className={handleClass} style={{ ...handleSize, top: -7, right: -7, cursor: "nesw-resize" }} onMouseDown={(e) => handleResizeStart(e, "ne")} />
          <div className={handleClass} style={{ ...handleSize, top: "50%", right: -7, transform: "translateY(-50%)", cursor: "ew-resize" }} onMouseDown={(e) => handleResizeStart(e, "e")} />
          <div className={handleClass} style={{ ...handleSize, bottom: -7, right: -7, cursor: "nwse-resize" }} onMouseDown={(e) => handleResizeStart(e, "se")} />
          <div className={handleClass} style={{ ...handleSize, bottom: -7, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" }} onMouseDown={(e) => handleResizeStart(e, "s")} />
          <div className={handleClass} style={{ ...handleSize, bottom: -7, left: -7, cursor: "nesw-resize" }} onMouseDown={(e) => handleResizeStart(e, "sw")} />
          <div className={handleClass} style={{ ...handleSize, top: "50%", left: -7, transform: "translateY(-50%)", cursor: "ew-resize" }} onMouseDown={(e) => handleResizeStart(e, "w")} />
        </>
      )}
    </div>
  );
}
