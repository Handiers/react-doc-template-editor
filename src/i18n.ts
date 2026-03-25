import { createContext, useContext } from "react";

// ============================================================================
// Labels type - all translatable strings used in the editor
// ============================================================================

export interface EditorLabels {
  // Toolbar
  "toolbar.widgets": string;
  "toolbar.hide": string;
  "toolbar.show": string;
  "toolbar.restore": string;
  "toolbar.add": string;

  // Widget names
  "widgets.logo": string;
  "widgets.heading": string;
  "widgets.senderInfo": string;
  "widgets.recipientInfo": string;
  "widgets.dataTable": string;
  "widgets.summarySection": string;
  "widgets.dateBlock": string;
  "widgets.detailsBlock": string;
  "widgets.note": string;
  "widgets.divider": string;
  "widgets.text": string;

  // Context menu
  "contextMenu.editTable": string;
  "contextMenu.bringToFront": string;
  "contextMenu.sendToBack": string;
  "contextMenu.duplicate": string;
  "contextMenu.delete": string;

  // Style panel
  "style.title": string;
  "style.colors": string;
  "style.primaryColor": string;
  "style.accentColor": string;
  "style.backgroundColor": string;
  "style.font": string;
  "style.fontSize": string;

  // Properties panel
  "properties.title": string;
  "properties.position": string;
  "properties.posX": string;
  "properties.posY": string;
  "properties.width": string;
  "properties.height": string;
  "properties.text": string;
  "properties.content": string;
  "properties.label": string;
  "properties.visibility": string;
  "properties.style": string;
  "properties.fontSize": string;
  "properties.fontWeight": string;
  "properties.fontStyle": string;
  "properties.color": string;
  "properties.labelColor": string;
  "properties.bgColor": string;
  "properties.align": string;
  "properties.objectFit": string;
  "properties.contain": string;
  "properties.cover": string;
  "properties.fill": string;
  "properties.borderRadius": string;
  "properties.thickness": string;
  "properties.solid": string;
  "properties.dashed": string;
  "properties.dotted": string;
  "properties.normal": string;
  "properties.italic": string;
  "properties.lineHeight": string;
  "properties.padding": string;
  "properties.format": string;
  "properties.long": string;
  "properties.short": string;
  "properties.iso": string;
  "properties.showLabel": string;
  "properties.showName": string;
  "properties.showPhone": string;
  "properties.showEmail": string;
  "properties.showField1": string;
  "properties.showField2": string;
  "properties.showField3": string;
  "properties.showAddress": string;
  "properties.showField4": string;
  "properties.showField5": string;
  "properties.editTable": string;
  "properties.headerBgColor": string;
  "properties.headerTextColor": string;
  "properties.rowTextColor": string;
  "properties.totalBgColor": string;
  "properties.totalTextColor": string;
  "properties.borderColor": string;
  "properties.showBg": string;
  "properties.values": string;
  "properties.senderName": string;
  "properties.field1": string;
  "properties.field2": string;
  "properties.phone": string;
  "properties.email": string;

  // Data editing
  "data.lineItems": string;
  "data.addLineItem": string;
  "data.productsServices": string;
  "data.qty": string;
  "data.unitPrice": string;
  "data.total": string;
  "data.save": string;
  "data.cancel": string;
  "data.editItem": string;
  "data.deleteItem": string;
  "data.enterValidNumber": string;
  "data.subtotal": string;
  "data.uploadLogo": string;
  "data.changeLogo": string;

  // Financial table editor modal
  "tableEditor.title": string;
  "tableEditor.close": string;
  "tableEditor.columns": string;
  "tableEditor.addColumn": string;
  "tableEditor.removeColumn": string;
  "tableEditor.columnLabel": string;
  "tableEditor.columnAlign": string;
  "tableEditor.rows": string;
  "tableEditor.addRow": string;
  "tableEditor.addHeader": string;
  "tableEditor.removeRow": string;
  "tableEditor.sections": string;
  "tableEditor.addSection": string;
  "tableEditor.removeSection": string;
  "tableEditor.sectionTitle": string;
  "tableEditor.save": string;
}

// ============================================================================
// Default English labels
// ============================================================================

export const defaultLabels: EditorLabels = {
  "toolbar.widgets": "Widgets",
  "toolbar.hide": "Hide",
  "toolbar.show": "Show",
  "toolbar.restore": "Restore",
  "toolbar.add": "Add New",

  "widgets.logo": "Logo",
  "widgets.heading": "Heading",
  "widgets.senderInfo": "Sender Info",
  "widgets.recipientInfo": "Recipient Info",
  "widgets.dataTable": "Data Table",
  "widgets.summarySection": "Summary",
  "widgets.dateBlock": "Date",
  "widgets.detailsBlock": "Details",
  "widgets.note": "Note",
  "widgets.divider": "Divider",
  "widgets.text": "Text",

  "contextMenu.editTable": "Edit Table",
  "contextMenu.bringToFront": "Bring to Front",
  "contextMenu.sendToBack": "Send to Back",
  "contextMenu.duplicate": "Duplicate",
  "contextMenu.delete": "Delete",

  "style.title": "Style",
  "style.colors": "Colors",
  "style.primaryColor": "Primary",
  "style.accentColor": "Accent",
  "style.backgroundColor": "Background",
  "style.font": "Font",
  "style.fontSize": "Base Font Size",

  "properties.title": "Properties",
  "properties.position": "Position & Size",
  "properties.posX": "X",
  "properties.posY": "Y",
  "properties.width": "W",
  "properties.height": "H",
  "properties.text": "Text",
  "properties.content": "Content",
  "properties.label": "Label",
  "properties.visibility": "Visibility",
  "properties.style": "Style",
  "properties.fontSize": "Font Size",
  "properties.fontWeight": "Weight",
  "properties.fontStyle": "Style",
  "properties.color": "Color",
  "properties.labelColor": "Label Color",
  "properties.bgColor": "Background",
  "properties.align": "Align",
  "properties.objectFit": "Object Fit",
  "properties.contain": "Contain",
  "properties.cover": "Cover",
  "properties.fill": "Fill",
  "properties.borderRadius": "Radius",
  "properties.thickness": "Thickness",
  "properties.solid": "Solid",
  "properties.dashed": "Dashed",
  "properties.dotted": "Dotted",
  "properties.normal": "Normal",
  "properties.italic": "Italic",
  "properties.lineHeight": "Line Height",
  "properties.padding": "Padding",
  "properties.format": "Format",
  "properties.long": "Long",
  "properties.short": "Short",
  "properties.iso": "ISO",
  "properties.showLabel": "Show Label",
  "properties.showName": "Show Name",
  "properties.showPhone": "Show Phone",
  "properties.showEmail": "Show Email",
  "properties.showField1": "Show Field 1",
  "properties.showField2": "Show Field 2",
  "properties.showField3": "Show Field 3",
  "properties.showAddress": "Show Address",
  "properties.showField4": "Show Field 4",
  "properties.showField5": "Show Field 5",
  "properties.editTable": "Edit Table Structure",
  "properties.headerBgColor": "Header BG",
  "properties.headerTextColor": "Header Text",
  "properties.rowTextColor": "Row Text",
  "properties.totalBgColor": "Total BG",
  "properties.totalTextColor": "Total Text",
  "properties.borderColor": "Border",
  "properties.showBg": "Background",
  "properties.values": "Default Values",
  "properties.senderName": "Name",
  "properties.field1": "Field 1",
  "properties.field2": "Field 2",
  "properties.phone": "Phone",
  "properties.email": "Email",

  "data.lineItems": "Line Items",
  "data.addLineItem": "+ Add Line Item",
  "data.productsServices": "Products/Services",
  "data.qty": "Qty",
  "data.unitPrice": "Unit Price",
  "data.total": "Total",
  "data.save": "Save",
  "data.cancel": "Cancel",
  "data.editItem": "Edit item",
  "data.deleteItem": "Delete item",
  "data.enterValidNumber": "Enter valid number",
  "data.subtotal": "Subtotal",
  "data.uploadLogo": "Upload Logo",
  "data.changeLogo": "Change",

  "tableEditor.title": "Table Structure",
  "tableEditor.close": "Close",
  "tableEditor.columns": "Columns",
  "tableEditor.addColumn": "Add Column",
  "tableEditor.removeColumn": "Remove",
  "tableEditor.columnLabel": "Label",
  "tableEditor.columnAlign": "Align",
  "tableEditor.rows": "Rows",
  "tableEditor.addRow": "Add Row",
  "tableEditor.addHeader": "Add Header",
  "tableEditor.removeRow": "Remove",
  "tableEditor.sections": "Sections",
  "tableEditor.addSection": "Add Section",
  "tableEditor.removeSection": "Remove Section",
  "tableEditor.sectionTitle": "Section Title",
  "tableEditor.save": "Save Changes",
};

// ============================================================================
// React Context
// ============================================================================

export const LabelsContext = createContext<EditorLabels>(defaultLabels);

export function useLabels(): EditorLabels {
  return useContext(LabelsContext);
}

export function t(labels: EditorLabels, key: keyof EditorLabels): string {
  return labels[key] ?? key;
}
