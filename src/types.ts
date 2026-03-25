// ============================================================================
// Document Template Editor - Core Types
// Canvas: Letter size 8.5" x 11" = 816px x 1056px (at 96 DPI)
// ============================================================================

export const LETTER_WIDTH_PX = 816;
export const LETTER_HEIGHT_PX = 1056;
export const LETTER_PADDING_PX = 48; // 0.5" margins

export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;
export const A4_PADDING_PX = 48;

// ============================================================================
// Paper Size
// ============================================================================

export type PaperSize = "letter" | "a4";

export function getPaperDimensions(size: PaperSize) {
  if (size === "a4") {
    return { width: A4_WIDTH_PX, height: A4_HEIGHT_PX, padding: A4_PADDING_PX };
  }
  return { width: LETTER_WIDTH_PX, height: LETTER_HEIGHT_PX, padding: LETTER_PADDING_PX };
}

// ============================================================================
// Widget Types
// ============================================================================

export type WidgetType =
  | "logo"
  | "heading"
  | "senderInfo"
  | "recipientInfo"
  | "dataTable"
  | "summarySection"
  | "dateBlock"
  | "detailsBlock"
  | "note"
  | "divider"
  | "text";

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BaseWidget {
  id: string;
  type: WidgetType;
  position: WidgetPosition;
  visible: boolean;
}

// --- Logo Widget ---
export interface LogoWidget extends BaseWidget {
  type: "logo";
  logoUrl?: string;
  objectFit: "contain" | "cover" | "fill";
  borderRadius: number;
}

// --- Heading Widget ---
export interface HeadingWidget extends BaseWidget {
  type: "heading";
  text: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  color: string;
  align: "left" | "center" | "right";
}

// --- Sender Info Widget ---
export interface SenderInfoWidget extends BaseWidget {
  type: "senderInfo";
  showName: boolean;
  showPhone: boolean;
  showEmail?: boolean;
  showField1: boolean;
  showField2: boolean;
  showField3: boolean;
  showAddress: boolean;
  // Template-level default values
  name?: string;
  field1?: string;
  field2?: string;
  phone?: string;
  email?: string;
  fontSize: number;
  color: string;
  fontWeight: "normal" | "bold";
}

// --- Recipient Info Widget ---
export interface RecipientInfoWidget extends BaseWidget {
  type: "recipientInfo";
  label: string;
  showName: boolean;
  showAddress: boolean;
  fontSize: number;
  color: string;
  labelColor: string;
  fontWeight: "normal" | "bold";
}

// --- Data Table Column ---
export interface DataTableColumn {
  id: string;
  label: string;
  align: "left" | "right";
}

// --- Data Table Row ---
export interface DataTableRow {
  id: string;
  kind?: "row" | "header";
  cells: Record<string, string>;
  description?: string;
}

// --- Data Table Section ---
export interface DataTableSection {
  id: string;
  title: string;
  columns: DataTableColumn[];
  rows: DataTableRow[];
}

// --- Data Table Widget ---
export interface DataTableWidget extends BaseWidget {
  type: "dataTable";
  columns: DataTableColumn[];
  customRows: DataTableRow[];
  // Section mode (takes precedence when present)
  sections?: DataTableSection[];
  showSubtotals?: boolean;
  // Styling
  headerBgColor: string;
  headerTextColor: string;
  rowTextColor: string;
  totalBgColor: string;
  totalTextColor: string;
  borderColor: string;
  fontSize: number;
}

// --- Summary Section Widget ---
export interface SummarySectionWidget extends BaseWidget {
  type: "summarySection";
  fontSize: number;
  textColor: string;
  totalTextColor: string;
  borderColor: string;
}

// --- Date Block Widget ---
export interface DateBlockWidget extends BaseWidget {
  type: "dateBlock";
  label: string;
  showLabel: boolean;
  format: "long" | "short" | "iso";
  fontSize: number;
  color: string;
  fontWeight: "normal" | "bold";
  align: "left" | "center" | "right";
}

// --- Details Block Widget ---
export interface DetailsBlockWidget extends BaseWidget {
  type: "detailsBlock";
  label: string;
  showField1: boolean;
  showField2: boolean;
  showField3?: boolean;
  showField4: boolean;
  showField5: boolean;
  fontSize: number;
  color: string;
  labelColor: string;
}

// --- Note Widget ---
export interface NoteWidget extends BaseWidget {
  type: "note";
  label: string;
  showLabel: boolean;
  fontSize: number;
  color: string;
  bgColor: string;
  showBg: boolean;
  borderRadius: number;
}

// --- Divider Widget ---
export interface DividerWidget extends BaseWidget {
  type: "divider";
  color: string;
  thickness: number;
  style: "solid" | "dashed" | "dotted";
}

// --- Text Widget ---
export interface TextWidget extends BaseWidget {
  type: "text";
  content: string;
  fontSize: number;
  color: string;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  align: "left" | "center" | "right";
  lineHeight: number;
  backgroundColor: string;
  padding: number;
}

// Union type
export type DocumentWidget =
  | LogoWidget
  | HeadingWidget
  | SenderInfoWidget
  | RecipientInfoWidget
  | DataTableWidget
  | SummarySectionWidget
  | DateBlockWidget
  | DetailsBlockWidget
  | NoteWidget
  | DividerWidget
  | TextWidget;

// ============================================================================
// Template Theme
// ============================================================================

export interface DocumentTheme {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  baseFontSize: number;
}

// ============================================================================
// Full Document Template
// ============================================================================

export interface DocumentTemplate {
  version: 1;
  paperSize?: PaperSize;
  theme: DocumentTheme;
  widgets: DocumentWidget[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Document Data (for populating widgets with real data)
// ============================================================================

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unitCostCents: number;
  totalCents: number;
}

export interface TotalItem {
  id: string;
  label: string;
  amountCents: number;
}

export interface DocumentData {
  // Sender (company/from) info
  sender?: {
    name?: string;
    phone?: string;
    email?: string;
    field1?: string; // e.g. trade, department
    field2?: string; // e.g. license number
    field3?: string; // e.g. insured status
    address?: string;
  };
  // Recipient (customer/to) info
  recipient?: {
    name?: string;
    address?: string;
  };
  // Details block data
  details?: {
    field1?: string; // e.g. job title
    field2?: string; // e.g. address
    field3?: string; // e.g. description
    field4?: string; // e.g. status
    field5?: string; // e.g. scheduled time
  };
  // Financial data
  lineItems?: LineItem[];
  totalItems?: TotalItem[];
  subtotalCents?: number;
  totalCents?: number;
  // Other
  logoUrl?: string;
  title?: string;
  date?: string;
  notes?: string;
}

// ============================================================================
// Editor callbacks
// ============================================================================

export interface DocumentDataCallbacks {
  updateLineItem?: (id: string, updates: Partial<LineItem>) => void;
  updateTotalItem?: (id: string, updates: Partial<TotalItem>) => void;
  updateData?: (updates: Partial<DocumentData>) => void;
  addLineItem?: (initialData?: { name: string; quantity: number; unitCostCents: number }) => void;
  removeLineItem?: (id: string) => void;
  addTotalItem?: (label: string, amountCents?: number) => void;
  removeTotalItem?: (id: string) => void;
}

// ============================================================================
// Singleton vs multi-instance widget types
// ============================================================================

export const SINGLETON_TYPES = new Set<WidgetType>([
  "logo", "heading", "senderInfo", "recipientInfo",
  "dataTable", "summarySection", "dateBlock", "detailsBlock",
]);

export const MULTI_TYPES = new Set<WidgetType>(["note", "divider", "text"]);
