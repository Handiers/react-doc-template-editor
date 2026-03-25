// =============================================================================
// react-doc-template-editor
// A React component library for building drag-and-drop document template editors
// =============================================================================

// --- Main Component ---
export { DocumentEditor, type DocumentEditorProps } from "./components/DocumentEditor";

// --- Sub-components (for advanced usage) ---
export { DocumentCanvas } from "./components/DocumentCanvas";
export { WidgetToolbar } from "./components/WidgetToolbar";
export { WidgetPropertiesPanel } from "./components/WidgetPropertiesPanel";
export { StylePanel } from "./components/StylePanel";
export { ResizableWidget } from "./components/ResizableWidget";
export { SnapGuides, type SnapGuide } from "./components/SnapGuides";
export { WidgetContextMenu, type ContextMenuPosition } from "./components/WidgetContextMenu";

// --- Widget Components ---
export { LogoWidget } from "./components/widgets/LogoWidget";
export { HeadingWidget } from "./components/widgets/HeadingWidget";
export { SenderInfoWidget } from "./components/widgets/SenderInfoWidget";
export { RecipientInfoWidget } from "./components/widgets/RecipientInfoWidget";
export { DataTableWidget } from "./components/widgets/DataTableWidget";
export { SummarySectionWidget } from "./components/widgets/SummarySectionWidget";
export { DateBlockWidget } from "./components/widgets/DateBlockWidget";
export { DetailsBlockWidget } from "./components/widgets/DetailsBlockWidget";
export { NoteWidget } from "./components/widgets/NoteWidget";
export { DividerWidget } from "./components/widgets/DividerWidget";
export { TextWidget } from "./components/widgets/TextWidget";

// --- Types ---
export type {
  PaperSize,
  WidgetType,
  WidgetPosition,
  BaseWidget,
  LogoWidget as LogoWidgetType,
  HeadingWidget as HeadingWidgetType,
  SenderInfoWidget as SenderInfoWidgetType,
  RecipientInfoWidget as RecipientInfoWidgetType,
  DataTableColumn,
  DataTableRow,
  DataTableSection,
  DataTableWidget as DataTableWidgetType,
  SummarySectionWidget as SummarySectionWidgetType,
  DateBlockWidget as DateBlockWidgetType,
  DetailsBlockWidget as DetailsBlockWidgetType,
  NoteWidget as NoteWidgetType,
  DividerWidget as DividerWidgetType,
  TextWidget as TextWidgetType,
  DocumentWidget,
  DocumentTheme,
  DocumentTemplate,
  LineItem,
  TotalItem,
  DocumentData,
  DocumentDataCallbacks,
} from "./types";

export {
  LETTER_WIDTH_PX,
  LETTER_HEIGHT_PX,
  LETTER_PADDING_PX,
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  A4_PADDING_PX,
  getPaperDimensions,
  SINGLETON_TYPES,
  MULTI_TYPES,
} from "./types";

// --- Serialization ---
export {
  serializeTemplate,
  deserializeTemplate,
  encodeThemeForUrl,
  decodeThemeFromUrl,
  applyThemeToTemplate,
  generateItemId,
  formatCents,
  parseCurrencyToCents,
  recalculateTotals,
} from "./serialization";

// --- Presets ---
export {
  createInvoiceTemplate,
  createEstimateTemplate,
  createBlankTemplate,
} from "./presets";

// --- i18n ---
export {
  LabelsContext,
  useLabels,
  defaultLabels,
  type EditorLabels,
} from "./i18n";
