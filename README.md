# react-doc-template-editor

A React component library for building **drag-and-drop document template editors** — perfect for invoices, estimates, quotes, and other business documents.

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![React](https://img.shields.io/badge/React-18%2B-61dafb)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Drag & Drop Canvas** — Move and resize widgets on a letter/A4 sized canvas
- **Snap Alignment** — Smart snapping to canvas edges, centers, and other widgets
- **11 Built-in Widgets** — Logo, heading, sender/recipient info, data table, summary, date, details, note, divider, text
- **Theme System** — Customize colors, fonts, and base font size
- **Properties Panel** — Per-widget property editors with live preview
- **JSON Serialization** — Templates are plain JSON, easy to persist anywhere
- **i18n Ready** — All UI strings are customizable via a labels object
- **Preset Templates** — Invoice, estimate, and blank templates out of the box
- **Paper Sizes** — Letter (8.5" × 11") and A4 support
- **Zero Lock-in** — No backend, no auth, no framework-specific dependencies beyond React

## Installation

```bash
npm install react-doc-template-editor @dnd-kit/core
```

### Peer Dependencies

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `@dnd-kit/core` >= 6.0.0

### Tailwind CSS Setup

This library uses Tailwind CSS with an `rdte-` prefix. Add the package to your Tailwind content paths:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-doc-template-editor/dist/**/*.{js,cjs}",
  ],
  // ...
};
```

If you're using Tailwind v4, add to your CSS:

```css
@source "../node_modules/react-doc-template-editor/dist";
```

## Quick Start

```tsx
import { useState } from "react";
import { DocumentEditor, createInvoiceTemplate } from "react-doc-template-editor";

function App() {
  const [template, setTemplate] = useState(createInvoiceTemplate());

  return (
    <div style={{ height: "100vh" }}>
      <DocumentEditor
        template={template}
        onChange={setTemplate}
      />
    </div>
  );
}
```

## Usage

### Basic Editor

```tsx
import { DocumentEditor, createInvoiceTemplate } from "react-doc-template-editor";

function TemplateEditor() {
  const [template, setTemplate] = useState(createInvoiceTemplate());

  const handleSave = () => {
    // Template is plain JSON — save it anywhere
    const json = JSON.stringify(template);
    localStorage.setItem("my-template", json);
  };

  return (
    <DocumentEditor
      template={template}
      onChange={setTemplate}
      onLogoUpload={(file) => {
        // Upload file to your storage, then update template
        const url = URL.createObjectURL(file);
        const updated = { ...template };
        const logo = updated.widgets.find((w) => w.type === "logo");
        if (logo && "logoUrl" in logo) logo.logoUrl = url;
        setTemplate(updated);
      }}
    />
  );
}
```

### Read-Only Preview

```tsx
<DocumentEditor
  template={template}
  onChange={() => {}}
  data={{
    sender: { name: "Acme Corp", phone: "(555) 123-4567", email: "billing@acme.com" },
    recipient: { name: "John Doe", address: "123 Main St, City, ST 12345" },
    lineItems: [
      { id: "1", name: "Web Development", quantity: 40, unitCostCents: 15000, totalCents: 600000 },
      { id: "2", name: "Design", quantity: 10, unitCostCents: 12000, totalCents: 120000 },
    ],
    subtotalCents: 720000,
    totalCents: 720000,
  }}
  isReadOnly
/>
```

### Custom Labels (i18n)

```tsx
<DocumentEditor
  template={template}
  onChange={setTemplate}
  labels={{
    "toolbar.widgets": "위젯",
    "toolbar.add": "추가",
    "style.title": "스타일",
    "properties.title": "속성",
    // ... override any label
  }}
/>
```

### Using Sub-components

For full control, use the individual components:

```tsx
import {
  DocumentCanvas,
  WidgetToolbar,
  WidgetPropertiesPanel,
  StylePanel,
  LabelsContext,
  defaultLabels,
} from "react-doc-template-editor";

function CustomEditor() {
  // Build your own layout with the sub-components
  return (
    <LabelsContext.Provider value={defaultLabels}>
      <div className="flex h-full">
        <WidgetToolbar {...toolbarProps} />
        <DocumentCanvas {...canvasProps} />
        <StylePanel {...stylePanelProps} />
      </div>
    </LabelsContext.Provider>
  );
}
```

## API Reference

### `<DocumentEditor>`

The main component that assembles the full editor.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `template` | `DocumentTemplate` | required | The template to edit |
| `onChange` | `(template: DocumentTemplate) => void` | required | Called when template changes |
| `data` | `DocumentData` | `undefined` | Data to populate widgets |
| `onLogoUpload` | `(file: File) => void` | `undefined` | Called when logo file is uploaded |
| `labels` | `Partial<EditorLabels>` | `undefined` | Custom labels for i18n |
| `zoom` | `number` | `1` | Canvas zoom level |
| `fontOptions` | `string[]` | `["Inter", "Roboto", "Georgia", "Courier"]` | Available fonts |
| `isReadOnly` | `boolean` | `false` | Read-only preview mode |
| `className` | `string` | `""` | Additional CSS class |
| `onTableEdit` | `(widget: DataTableWidgetType) => void` | `undefined` | Data table edit callback |

### `DocumentTemplate`

```typescript
interface DocumentTemplate {
  version: 1;
  paperSize?: "letter" | "a4";
  theme: DocumentTheme;
  widgets: DocumentWidget[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### `DocumentTheme`

```typescript
interface DocumentTheme {
  primaryColor: string;   // hex
  accentColor: string;    // hex
  backgroundColor: string; // hex
  fontFamily: string;
  baseFontSize: number;   // px
}
```

### Widget Types

| Type | Description | Singleton |
|------|-------------|-----------|
| `logo` | Image display with upload | Yes |
| `heading` | Document title/heading | Yes |
| `senderInfo` | Company/sender details | Yes |
| `recipientInfo` | Customer/recipient details | Yes |
| `dataTable` | Financial/data table with sections | Yes |
| `summarySection` | Subtotal/total display | Yes |
| `dateBlock` | Date display with format options | Yes |
| `detailsBlock` | Key-value details block | Yes |
| `note` | Notes section | No |
| `divider` | Horizontal line | No |
| `text` | Free text block | No |

### `DocumentData`

```typescript
interface DocumentData {
  sender?: { name?: string; phone?: string; email?: string; field1?: string; field2?: string; field3?: string; address?: string; };
  recipient?: { name?: string; address?: string; };
  details?: { field1?: string; field2?: string; field3?: string; field4?: string; field5?: string; };
  lineItems?: LineItem[];
  totalItems?: TotalItem[];
  subtotalCents?: number;
  totalCents?: number;
  logoUrl?: string;
  title?: string;
  date?: string;
  notes?: string;
}
```

### Preset Functions

```typescript
createInvoiceTemplate()  // Professional invoice layout
createEstimateTemplate() // Clean estimate layout
createBlankTemplate()    // Minimal starting point
```

### Serialization Helpers

```typescript
serializeTemplate(template)          // → JSON string
deserializeTemplate(json)            // → DocumentTemplate | null
encodeThemeForUrl(theme)             // → URL-safe base64
decodeThemeFromUrl(encoded)          // → DocumentTheme | null
applyThemeToTemplate(template, theme) // → new template with theme applied
```

## License

MIT
