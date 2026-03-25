import { useState, useCallback } from "react";
import type {
  DocumentTemplate,
  DocumentWidget,
  DocumentData,
  WidgetType,
  DataTableWidget as DataTableWidgetType,
} from "../types";
import { SINGLETON_TYPES, MULTI_TYPES, LETTER_PADDING_PX } from "../types";
import { LabelsContext, defaultLabels, type EditorLabels } from "../i18n";
import { DocumentCanvas } from "./DocumentCanvas";
import { WidgetToolbar } from "./WidgetToolbar";
import { WidgetPropertiesPanel } from "./WidgetPropertiesPanel";
import { StylePanel } from "./StylePanel";

// =============================================================================
// Default widget factory
// =============================================================================

function createWidget(type: WidgetType): DocumentWidget {
  const id = `w_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const base = { id, visible: true, position: { x: LETTER_PADDING_PX, y: LETTER_PADDING_PX, width: 200, height: 60 } };

  switch (type) {
    case "logo": return { ...base, type: "logo", objectFit: "contain" as const, borderRadius: 4, position: { ...base.position, width: 120, height: 60 } };
    case "heading": return { ...base, type: "heading", text: "HEADING", fontSize: 28, fontWeight: "bold" as const, color: "#1a1a2e", align: "left" as const };
    case "senderInfo": return { ...base, type: "senderInfo", showName: true, showPhone: true, showEmail: true, showField1: false, showField2: false, showField3: false, showAddress: false, fontSize: 10, color: "#333333", fontWeight: "normal" as const, position: { ...base.position, width: 260, height: 120 } };
    case "recipientInfo": return { ...base, type: "recipientInfo", label: "To:", showName: true, showAddress: true, fontSize: 10, color: "#333333", labelColor: "#1a1a2e", fontWeight: "normal" as const, position: { ...base.position, width: 260, height: 100 } };
    case "dataTable": return { ...base, type: "dataTable", columns: [{ id: "desc", label: "Description", align: "left" as const }, { id: "amount", label: "Amount", align: "right" as const }], customRows: [], headerBgColor: "#f7f5f2", headerTextColor: "#1a1a2e", rowTextColor: "#333333", totalBgColor: "#f5f5f5", totalTextColor: "#1a1a2e", borderColor: "#e5e5e5", fontSize: 11, position: { ...base.position, width: 720, height: 200 } };
    case "summarySection": return { ...base, type: "summarySection", fontSize: 11, textColor: "#1a1a2e", totalTextColor: "#1a1a2e", borderColor: "#1a1a2e", position: { ...base.position, width: 300, height: 100 } };
    case "dateBlock": return { ...base, type: "dateBlock", label: "Date:", showLabel: true, format: "long" as const, fontSize: 11, color: "#666666", fontWeight: "normal" as const, align: "left" as const, position: { ...base.position, width: 280, height: 24 } };
    case "detailsBlock": return { ...base, type: "detailsBlock", label: "Details", showField1: true, showField2: true, showField3: false, showField4: false, showField5: false, fontSize: 10, color: "#333333", labelColor: "#1a1a2e", position: { ...base.position, width: 300, height: 100 } };
    case "note": return { ...base, type: "note", label: "Note", showLabel: true, fontSize: 10, color: "#555555", bgColor: "transparent", showBg: false, borderRadius: 0, position: { ...base.position, width: 300, height: 80 } };
    case "divider": return { ...base, type: "divider", color: "#e5e5e5", thickness: 1, style: "solid" as const, position: { ...base.position, width: 720, height: 2 } };
    case "text": return { ...base, type: "text", content: "Text", fontSize: 12, color: "#333333", fontWeight: "normal" as const, fontStyle: "normal" as const, align: "left" as const, lineHeight: 1.4, backgroundColor: "transparent", padding: 0 };
    default: return { ...base, type: "text", content: "Text", fontSize: 12, color: "#333333", fontWeight: "normal" as const, fontStyle: "normal" as const, align: "left" as const, lineHeight: 1.4, backgroundColor: "transparent", padding: 0 };
  }
}

// =============================================================================
// Props
// =============================================================================

export interface DocumentEditorProps {
  /** The template to edit */
  template: DocumentTemplate;
  /** Called when template changes */
  onChange: (template: DocumentTemplate) => void;
  /** Optional data to populate widgets */
  data?: DocumentData;
  /** Called when a logo file is uploaded */
  onLogoUpload?: (file: File) => void;
  /** Custom labels for i18n */
  labels?: Partial<EditorLabels>;
  /** Zoom level (default: 1) */
  zoom?: number;
  /** Available font options for the style panel */
  fontOptions?: string[];
  /** Read-only mode (no editing, just preview) */
  isReadOnly?: boolean;
  /** Additional className for the root element */
  className?: string;
  /** Called when data table is double-clicked for editing */
  onTableEdit?: (widget: DataTableWidgetType) => void;
}

// =============================================================================
// DocumentEditor Component
// =============================================================================

export function DocumentEditor({
  template,
  onChange,
  data,
  onLogoUpload,
  labels: customLabels,
  zoom = 1,
  fontOptions,
  isReadOnly = false,
  className = "",
  onTableEdit,
}: DocumentEditorProps) {
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  const mergedLabels: EditorLabels = customLabels
    ? { ...defaultLabels, ...customLabels }
    : defaultLabels;

  const selectedWidget = selectedWidgetId
    ? template.widgets.find((w) => w.id === selectedWidgetId)
    : undefined;

  // Compute addable widget types (singletons that are deleted + all multi-types)
  const existingTypes = new Set(template.widgets.map((w) => w.type));
  const addableTypes: WidgetType[] = [
    ...[...SINGLETON_TYPES].filter((t) => !existingTypes.has(t)),
    ...MULTI_TYPES,
  ];

  const handleToggleVisible = useCallback((id: string) => {
    const updated = template.widgets.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w));
    onChange({ ...template, widgets: updated, updatedAt: new Date().toISOString() });
  }, [template, onChange]);

  const handleAddWidget = useCallback((type: WidgetType) => {
    const widget = createWidget(type);
    onChange({ ...template, widgets: [...template.widgets, widget], updatedAt: new Date().toISOString() });
    setSelectedWidgetId(widget.id);
  }, [template, onChange]);

  const handleDeleteWidget = useCallback((id: string) => {
    const updated = template.widgets.filter((w) => w.id !== id);
    onChange({ ...template, widgets: updated, updatedAt: new Date().toISOString() });
    if (selectedWidgetId === id) setSelectedWidgetId(null);
  }, [template, onChange, selectedWidgetId]);

  const handleWidgetChange = useCallback((changes: Record<string, unknown>) => {
    if (!selectedWidgetId) return;
    const updated = template.widgets.map((w) => (w.id === selectedWidgetId ? { ...w, ...changes } : w));
    onChange({ ...template, widgets: updated, updatedAt: new Date().toISOString() });
  }, [template, onChange, selectedWidgetId]);

  const handlePositionChange = useCallback((position: { x: number; y: number; width: number; height: number }) => {
    if (!selectedWidgetId) return;
    const updated = template.widgets.map((w) => (w.id === selectedWidgetId ? { ...w, position } : w));
    onChange({ ...template, widgets: updated, updatedAt: new Date().toISOString() });
  }, [template, onChange, selectedWidgetId]);

  const handleThemeChange = useCallback((theme: DocumentTemplate["theme"]) => {
    onChange({ ...template, theme, updatedAt: new Date().toISOString() });
  }, [template, onChange]);

  if (isReadOnly) {
    return (
      <LabelsContext.Provider value={mergedLabels}>
        <div className={`rdte-flex rdte-h-full ${className}`}>
          <DocumentCanvas
            template={template}
            onChange={onChange}
            data={data}
            zoom={zoom}
            isReadOnly
          />
        </div>
      </LabelsContext.Provider>
    );
  }

  return (
    <LabelsContext.Provider value={mergedLabels}>
      <div className={`rdte-flex rdte-h-full rdte-bg-gray-50 ${className}`}>
        {/* Left: Widget Toolbar */}
        <WidgetToolbar
          widgets={template.widgets}
          addableTypes={addableTypes}
          onToggleVisible={handleToggleVisible}
          onAddWidget={handleAddWidget}
          selectedWidgetId={selectedWidgetId}
          onSelectWidget={setSelectedWidgetId}
          onDeleteWidget={handleDeleteWidget}
        />

        {/* Center: Canvas */}
        <div className="rdte-flex-1 rdte-overflow-auto">
          <DocumentCanvas
            template={template}
            onChange={onChange}
            data={data}
            onLogoUpload={onLogoUpload}
            selectedWidgetId={selectedWidgetId}
            onSelectWidget={setSelectedWidgetId}
            zoom={zoom}
            onTableEdit={onTableEdit}
          />
        </div>

        {/* Right: Properties or Style Panel */}
        {selectedWidget ? (
          <WidgetPropertiesPanel
            widget={selectedWidget}
            onChange={handleWidgetChange}
            onPositionChange={handlePositionChange}
            onOpenTableEditor={() => {
              if (selectedWidget.type === "dataTable" && onTableEdit) {
                onTableEdit(selectedWidget as DataTableWidgetType);
              }
            }}
          />
        ) : (
          <StylePanel
            theme={template.theme}
            onChange={handleThemeChange}
            fontOptions={fontOptions}
          />
        )}
      </div>
    </LabelsContext.Provider>
  );
}
