import { useCallback, useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  getPaperDimensions,
  type DocumentTemplate,
  type DocumentWidget,
  type DocumentTheme,
  type DocumentData,
  type WidgetPosition,
  type WidgetType,
  type DataTableWidget as DataTableWidgetType,
} from "../types";
import { ResizableWidget } from "./ResizableWidget";
import { SnapGuides, type SnapGuide } from "./SnapGuides";
import { WidgetContextMenu, type ContextMenuPosition } from "./WidgetContextMenu";

// Widget renderers
import { LogoWidget } from "./widgets/LogoWidget";
import { HeadingWidget } from "./widgets/HeadingWidget";
import { SenderInfoWidget } from "./widgets/SenderInfoWidget";
import { RecipientInfoWidget } from "./widgets/RecipientInfoWidget";
import { DataTableWidget } from "./widgets/DataTableWidget";
import { SummarySectionWidget } from "./widgets/SummarySectionWidget";
import { DateBlockWidget } from "./widgets/DateBlockWidget";
import { DetailsBlockWidget } from "./widgets/DetailsBlockWidget";
import { NoteWidget } from "./widgets/NoteWidget";
import { DividerWidget } from "./widgets/DividerWidget";
import { TextWidget } from "./widgets/TextWidget";

const SNAP_THRESHOLD = 7;
const DEFAULT_BASE_FONT_SIZE = 12;

// =============================================================================
// Snap computation
// =============================================================================

function computeSnap(
  activeId: string,
  delta: { x: number; y: number },
  widgets: DocumentWidget[],
  canvasW: number,
  canvasH: number,
): { snappedDelta: { x: number; y: number }; guides: SnapGuide[] } {
  const source = widgets.find((w) => w.id === activeId);
  if (!source) return { snappedDelta: delta, guides: [] };

  const dLeft = source.position.x + delta.x;
  const dTop = source.position.y + delta.y;
  const dRight = dLeft + source.position.width;
  const dBottom = dTop + source.position.height;
  const dCX = dLeft + source.position.width / 2;
  const dCY = dTop + source.position.height / 2;

  const guides: SnapGuide[] = [];
  let sx = delta.x;
  let sy = delta.y;

  const cavCX = canvasW / 2;
  const cavCY = canvasH / 2;
  if (Math.abs(dCX - cavCX) < SNAP_THRESHOLD) { sx = cavCX - source.position.width / 2 - source.position.x; guides.push({ type: "vertical", position: cavCX }); }
  if (Math.abs(dCY - cavCY) < SNAP_THRESHOLD) { sy = cavCY - source.position.height / 2 - source.position.y; guides.push({ type: "horizontal", position: cavCY }); }
  if (Math.abs(dLeft - 0) < SNAP_THRESHOLD) { sx = -source.position.x; guides.push({ type: "vertical", position: 0 }); }
  if (Math.abs(dRight - canvasW) < SNAP_THRESHOLD) { sx = canvasW - source.position.width - source.position.x; guides.push({ type: "vertical", position: canvasW }); }

  for (const other of widgets) {
    if (other.id === activeId || !other.visible) continue;
    const oL = other.position.x;
    const oR = other.position.x + other.position.width;
    const oT = other.position.y;
    const oB = other.position.y + other.position.height;
    const oCX = oL + other.position.width / 2;
    const oCY = oT + other.position.height / 2;

    for (const [dv, tv] of [[dLeft, oL], [dLeft, oR], [dRight, oL], [dRight, oR], [dCX, oCX]] as [number, number][]) {
      if (Math.abs(dv - tv) < SNAP_THRESHOLD) { sx = delta.x + (tv - dv); guides.push({ type: "vertical", position: tv }); break; }
    }
    for (const [dv, tv] of [[dTop, oT], [dTop, oB], [dBottom, oT], [dBottom, oB], [dCY, oCY]] as [number, number][]) {
      if (Math.abs(dv - tv) < SNAP_THRESHOLD) { sy = delta.y + (tv - dv); guides.push({ type: "horizontal", position: tv }); break; }
    }
  }

  return { snappedDelta: { x: sx, y: sy }, guides };
}

function computeSnapForResize(
  activeId: string,
  proposed: WidgetPosition,
  handle: string,
  widgets: DocumentWidget[],
  canvasW: number,
  canvasH: number,
): { position: WidgetPosition; guides: SnapGuide[] } {
  const guides: SnapGuide[] = [];
  let { x, y, width, height } = proposed;

  const snapEdge = (val: number, target: number, setter: (s: number) => void, guide: SnapGuide) => {
    if (Math.abs(val - target) < SNAP_THRESHOLD) { setter(target); guides.push(guide); }
  };

  const movesLeft = handle.includes("w");
  const movesRight = handle.includes("e");
  const movesTop = handle.includes("n");
  const movesBottom = handle.includes("s");

  if (movesLeft) { snapEdge(x, 0, (s) => { width += x - s; x = s; }, { type: "vertical", position: 0 }); snapEdge(x, canvasW, (s) => { width += x - s; x = s; }, { type: "vertical", position: canvasW }); }
  if (movesRight) { const right = x + width; snapEdge(right, 0, (s) => { width = s - x; }, { type: "vertical", position: 0 }); snapEdge(right, canvasW, (s) => { width = s - x; }, { type: "vertical", position: canvasW }); }
  if (movesTop) { snapEdge(y, 0, (s) => { height += y - s; y = s; }, { type: "horizontal", position: 0 }); snapEdge(y, canvasH, (s) => { height += y - s; y = s; }, { type: "horizontal", position: canvasH }); }
  if (movesBottom) { const bottom = y + height; snapEdge(bottom, 0, (s) => { height = s - y; }, { type: "horizontal", position: 0 }); snapEdge(bottom, canvasH, (s) => { height = s - y; }, { type: "horizontal", position: canvasH }); }

  for (const other of widgets) {
    if (other.id === activeId || !other.visible) continue;
    const oL = other.position.x; const oR = oL + other.position.width; const oCX = oL + other.position.width / 2;
    const oT = other.position.y; const oB = oT + other.position.height; const oCY = oT + other.position.height / 2;

    if (movesLeft) { for (const tv of [oL, oR, oCX]) snapEdge(x, tv, (s) => { width += x - s; x = s; }, { type: "vertical", position: tv }); }
    if (movesRight) { const right = x + width; for (const tv of [oL, oR, oCX]) snapEdge(right, tv, (s) => { width = s - x; }, { type: "vertical", position: tv }); }
    if (movesTop) { for (const tv of [oT, oB, oCY]) snapEdge(y, tv, (s) => { height += y - s; y = s; }, { type: "horizontal", position: tv }); }
    if (movesBottom) { const bottom = y + height; for (const tv of [oT, oB, oCY]) snapEdge(bottom, tv, (s) => { height = s - y; }, { type: "horizontal", position: tv }); }
  }

  return { position: { x: Math.max(0, x), y: Math.max(0, y), width: Math.max(20, width), height: Math.max(20, height) }, guides };
}

// =============================================================================
// Widget Content Renderer
// =============================================================================

function renderWidgetContent(
  widget: DocumentWidget,
  theme: DocumentTheme,
  data?: DocumentData,
  onLogoUpload?: (file: File) => void,
  isEditing?: boolean,
  onEditComplete?: (changes: Record<string, unknown>) => void,
) {
  const scale = theme.baseFontSize / DEFAULT_BASE_FONT_SIZE;

  switch (widget.type) {
    case "logo":
      return <LogoWidget widget={widget} onLogoUpload={onLogoUpload} isEditing={Boolean(onLogoUpload) && isEditing} />;
    case "heading":
      return <HeadingWidget widget={data?.title ? { ...widget, text: data.title } : widget} scale={scale} isEditing={isEditing} onEditComplete={onEditComplete} />;
    case "senderInfo":
      return <SenderInfoWidget widget={widget} data={data} scale={scale} />;
    case "recipientInfo":
      return <RecipientInfoWidget widget={widget} data={data} scale={scale} />;
    case "dataTable":
      return <DataTableWidget widget={widget} data={data} scale={scale} />;
    case "summarySection":
      return <SummarySectionWidget widget={widget} data={data} scale={scale} />;
    case "dateBlock":
      return <DateBlockWidget widget={widget} date={data?.date} scale={scale} isEditing={isEditing} onEditComplete={onEditComplete} />;
    case "detailsBlock":
      return <DetailsBlockWidget widget={widget} data={data} scale={scale} />;
    case "note":
      return <NoteWidget widget={widget} data={data} noteText={data?.notes} scale={scale} isEditing={isEditing} onEditComplete={onEditComplete} />;
    case "divider":
      return <DividerWidget widget={widget} />;
    case "text":
      return <TextWidget widget={widget} scale={scale} isEditing={isEditing} onEditComplete={onEditComplete} />;
    default:
      return null;
  }
}

// =============================================================================
// Props
// =============================================================================

interface Props {
  template: DocumentTemplate;
  onChange: (template: DocumentTemplate) => void;
  data?: DocumentData;
  onLogoUpload?: (file: File) => void;
  selectedWidgetId?: string | null;
  onSelectWidget?: (id: string | null) => void;
  zoom?: number;
  isReadOnly?: boolean;
  onTableEdit?: (widget: DataTableWidgetType) => void;
}

// =============================================================================
// Canvas Component
// =============================================================================

export function DocumentCanvas({
  template,
  onChange,
  data,
  onLogoUpload,
  selectedWidgetId,
  onSelectWidget,
  zoom = 1,
  isReadOnly = false,
  onTableEdit,
}: Props) {
  const paper = getPaperDimensions(template.paperSize ?? "letter");
  const CANVAS_W = paper.width;
  const CANVAS_H = paper.height;
  const PADDING = paper.padding;

  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 4 } }));

  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);
  const snappedDeltaRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);
  const [activeDelta, setActiveDelta] = useState<{ x: number; y: number } | null>(null);
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ widgetId: string; widgetType: WidgetType; position: ContextMenuPosition } | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (!isReadOnly) e.preventDefault(); };
    const el = document.querySelector("[data-rdte-paper]");
    el?.addEventListener("contextmenu", handler as EventListener);
    return () => el?.removeEventListener("contextmenu", handler as EventListener);
  }, [isReadOnly]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    if (isReadOnly) return;
    setActiveWidgetId(String(event.active.id));
    setEditingWidgetId(null);
    setContextMenu(null);
  }, [isReadOnly]);

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    if (isReadOnly) return;
    const id = String(event.active.id);
    const { snappedDelta, guides } = computeSnap(id, event.delta, template.widgets, CANVAS_W, CANVAS_H);
    snappedDeltaRef.current = snappedDelta;
    setSnapGuides(guides);
    setActiveDelta(snappedDelta);
  }, [template.widgets, isReadOnly, CANVAS_W, CANVAS_H]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (isReadOnly) return;
    const widgetId = String(event.active.id);
    const sd = snappedDeltaRef.current;
    const updated = template.widgets.map((w) => {
      if (w.id !== widgetId) return w;
      return { ...w, position: { ...w.position, x: Math.max(0, Math.min(CANVAS_W - w.position.width, w.position.x + sd.x)), y: Math.max(0, Math.min(CANVAS_H - w.position.height, w.position.y + sd.y)) } };
    });
    onChange({ ...template, widgets: updated, updatedAt: new Date().toISOString() });
    setActiveWidgetId(null);
    setActiveDelta(null);
    setSnapGuides([]);
    snappedDeltaRef.current = { x: 0, y: 0 };
  }, [template, onChange, isReadOnly, CANVAS_W, CANVAS_H]);

  const handleDragCancel = useCallback(() => {
    setActiveWidgetId(null);
    setActiveDelta(null);
    setSnapGuides([]);
    snappedDeltaRef.current = { x: 0, y: 0 };
  }, []);

  const handlePositionChange = useCallback((id: string, position: WidgetPosition) => {
    const updated = template.widgets.map((w) => (w.id === id ? { ...w, position } : w));
    onChange({ ...template, widgets: updated, updatedAt: new Date().toISOString() });
  }, [template, onChange]);

  const handleResizeMove = useCallback((id: string, proposed: WidgetPosition, handle: string) => {
    const result = computeSnapForResize(id, proposed, handle, template.widgets, CANVAS_W, CANVAS_H);
    setSnapGuides(result.guides);
    return result;
  }, [template.widgets, CANVAS_W, CANVAS_H]);

  const handleResizeEnd = useCallback(() => setSnapGuides([]), []);

  const handleEditComplete = useCallback((id: string, changes: Record<string, unknown>) => {
    const updated = template.widgets.map((w) => (w.id === id ? { ...w, ...changes } : w));
    onChange({ ...template, widgets: updated, updatedAt: new Date().toISOString() });
    setEditingWidgetId(null);
  }, [template, onChange]);

  const handleContextMenuOpen = useCallback((widgetId: string, widgetType: WidgetType, e: React.MouseEvent) => {
    if (isReadOnly) return;
    setContextMenu({ widgetId, widgetType, position: { x: e.clientX, y: e.clientY } });
    onSelectWidget?.(widgetId);
  }, [onSelectWidget, isReadOnly]);

  const handleDeleteWidget = useCallback(() => {
    if (!contextMenu) return;
    const updated = template.widgets.filter((w) => w.id !== contextMenu.widgetId);
    onChange({ ...template, widgets: updated, updatedAt: new Date().toISOString() });
    setContextMenu(null);
  }, [contextMenu, template, onChange]);

  const handleDuplicateWidget = useCallback(() => {
    if (!contextMenu) return;
    const source = template.widgets.find((w) => w.id === contextMenu.widgetId);
    if (!source) return;
    const clone: DocumentWidget = { ...source, id: `w_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, position: { ...source.position, x: source.position.x + 16, y: source.position.y + 16 } };
    onChange({ ...template, widgets: [...template.widgets, clone], updatedAt: new Date().toISOString() });
    setContextMenu(null);
  }, [contextMenu, template, onChange]);

  const handleMoveToFront = useCallback(() => {
    if (!contextMenu) return;
    const rest = template.widgets.filter((w) => w.id !== contextMenu.widgetId);
    const target = template.widgets.find((w) => w.id === contextMenu.widgetId)!;
    onChange({ ...template, widgets: [...rest, target], updatedAt: new Date().toISOString() });
    setContextMenu(null);
  }, [contextMenu, template, onChange]);

  const handleMoveToBack = useCallback(() => {
    if (!contextMenu) return;
    const rest = template.widgets.filter((w) => w.id !== contextMenu.widgetId);
    const target = template.widgets.find((w) => w.id === contextMenu.widgetId)!;
    onChange({ ...template, widgets: [target, ...rest], updatedAt: new Date().toISOString() });
    setContextMenu(null);
  }, [contextMenu, template, onChange]);

  const visibleWidgets = template.widgets.filter((w) => {
    if (!w.visible) return false;
    if (isReadOnly && w.type === "logo") return Boolean((w as { logoUrl?: string }).logoUrl);
    return true;
  });

  return (
    <div className="rdte-flex rdte-items-start rdte-justify-center rdte-overflow-auto rdte-bg-gray-100 rdte-p-6 rdte-min-h-full">
      <div style={{ width: CANVAS_W * zoom, height: CANVAS_H * zoom, flexShrink: 0, transition: "width 0.35s cubic-bezier(0.4,0,0.2,1), height 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${zoom})`, transformOrigin: "top left", transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
            <div
              data-rdte-paper
              className="rdte-relative rdte-shadow-2xl rdte-select-none"
              style={{ width: CANVAS_W, height: CANVAS_H, backgroundColor: template.theme.backgroundColor, fontFamily: template.theme.fontFamily, fontSize: template.theme.baseFontSize }}
            >
              {!isReadOnly && <SnapGuides guides={snapGuides} canvasWidth={CANVAS_W} canvasHeight={CANVAS_H} />}

              <div
                className="rdte-absolute rdte-pointer-events-none"
                style={{ top: PADDING, left: PADDING, right: PADDING, bottom: PADDING, border: "1px dashed rgba(0,0,0,0.12)", borderRadius: 2, zIndex: 0 }}
              />

              {visibleWidgets.map((widget) => {
                const content = renderWidgetContent(
                  widget,
                  template.theme,
                  data,
                  onLogoUpload,
                  editingWidgetId === widget.id,
                  (changes) => handleEditComplete(widget.id, changes),
                );

                if (isReadOnly) {
                  return (
                    <div key={widget.id} className="rdte-absolute" style={{ left: widget.position.x, top: widget.position.y, width: widget.position.width, height: widget.position.height }}>
                      <div className="rdte-w-full rdte-h-full rdte-overflow-hidden">{content}</div>
                    </div>
                  );
                }

                return (
                  <ResizableWidget
                    key={widget.id}
                    id={widget.id}
                    position={widget.position}
                    onPositionChange={handlePositionChange}
                    isSelected={selectedWidgetId === widget.id}
                    onSelect={() => { onSelectWidget?.(widget.id); setEditingWidgetId(null); }}
                    onDoubleClick={() => {
                      if (widget.type === "dataTable" && onTableEdit) {
                        onTableEdit(widget as DataTableWidgetType);
                      } else {
                        setEditingWidgetId(widget.id);
                      }
                    }}
                    onContextMenu={(e) => handleContextMenuOpen(widget.id, widget.type, e)}
                    snappedDelta={activeWidgetId === widget.id ? activeDelta : null}
                    onResizeMove={handleResizeMove}
                    onResizeEnd={handleResizeEnd}
                  >
                    {content}
                  </ResizableWidget>
                );
              })}
            </div>

            {!isReadOnly && (
              <DragOverlay dropAnimation={null}>
                {activeWidgetId ? (() => {
                  const w = template.widgets.find((x) => x.id === activeWidgetId);
                  if (!w) return null;
                  return (
                    <div style={{ width: w.position.width, height: w.position.height, backgroundColor: template.theme.backgroundColor, fontFamily: template.theme.fontFamily, border: "2px solid #3b82f6", borderRadius: 2, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.18)", opacity: 0.92 }}>
                      {renderWidgetContent(w, template.theme, data)}
                    </div>
                  );
                })() : null}
              </DragOverlay>
            )}
          </DndContext>
        </div>
      </div>

      {!isReadOnly && contextMenu && (
        <WidgetContextMenu
          position={contextMenu.position}
          widgetId={contextMenu.widgetId}
          onDelete={handleDeleteWidget}
          onDuplicate={handleDuplicateWidget}
          onMoveToFront={handleMoveToFront}
          onMoveToBack={handleMoveToBack}
          onClose={() => setContextMenu(null)}
          onEditTable={contextMenu.widgetType === "dataTable" && onTableEdit ? () => {
            const w = template.widgets.find((x) => x.id === contextMenu.widgetId);
            if (w?.type === "dataTable") onTableEdit(w);
            setContextMenu(null);
          } : undefined}
        />
      )}
    </div>
  );
}
