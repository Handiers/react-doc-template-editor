import { useState } from "react";
import { useLabels, type EditorLabels } from "../i18n";
import type {
  DocumentWidget,
  WidgetPosition,
  LogoWidget,
  HeadingWidget,
  SenderInfoWidget,
  RecipientInfoWidget,
  DataTableWidget,
  DateBlockWidget,
  DetailsBlockWidget,
  NoteWidget,
  DividerWidget,
  TextWidget,
} from "../types";

// =============================================================================
// Props
// =============================================================================

interface Props {
  widget: DocumentWidget;
  onChange: (changes: Record<string, unknown>) => void;
  onPositionChange: (position: WidgetPosition) => void;
  onOpenTableEditor: () => void;
}

// =============================================================================
// Shared sub-components
// =============================================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rdte-p-4 rdte-border-b rdte-border-gray-100">
      <h3 className="rdte-text-xs rdte-font-semibold rdte-text-gray-500 rdte-uppercase rdte-tracking-wider rdte-mb-3">{title}</h3>
      <div className="rdte-space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rdte-flex rdte-items-center rdte-justify-between rdte-gap-2">
      <label className="rdte-text-xs rdte-text-gray-600 rdte-flex-1">{label}</label>
      {children}
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="rdte-flex rdte-items-center rdte-justify-between rdte-gap-2">
      <label className="rdte-text-xs rdte-text-gray-600 rdte-flex-1">{label}</label>
      <div className="rdte-flex rdte-items-center rdte-gap-1.5">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="rdte-w-7 rdte-h-7 rdte-rounded rdte-cursor-pointer rdte-border rdte-border-gray-200" />
        <input type="text" value={value} onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value); }} className="rdte-w-20 rdte-text-xs rdte-px-2 rdte-py-1 rdte-border rdte-border-gray-200 rdte-rounded rdte-font-mono" maxLength={7} />
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, step = 1, suffix = "px", onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (v: number) => void }) {
  return (
    <div className="rdte-space-y-1">
      <div className="rdte-flex rdte-items-center rdte-justify-between">
        <label className="rdte-text-xs rdte-text-gray-600">{label}</label>
        <span className="rdte-text-xs rdte-text-gray-500">{step < 1 ? value.toFixed(1) : value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="rdte-w-full" />
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="rdte-flex rdte-items-center rdte-justify-between rdte-gap-2">
      <label className="rdte-text-xs rdte-text-gray-600 rdte-flex-1">{label}</label>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="rdte-relative rdte-inline-flex rdte-h-5 rdte-w-9 rdte-items-center rdte-rounded-full rdte-transition-colors"
        style={{ backgroundColor: checked ? "#3b82f6" : "#d1d5db" }}
      >
        <span className="rdte-inline-block rdte-h-3.5 rdte-w-3.5 rdte-rounded-full rdte-bg-white rdte-transition-transform" style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }} />
      </button>
    </div>
  );
}

function AlignRow({ label, value, onChange }: { label: string; value: "left" | "center" | "right"; onChange: (v: "left" | "center" | "right") => void }) {
  const opts: Array<{ key: "left" | "center" | "right"; icon: string }> = [{ key: "left", icon: "L" }, { key: "center", icon: "C" }, { key: "right", icon: "R" }];
  return (
    <div className="rdte-flex rdte-items-center rdte-justify-between rdte-gap-2">
      <label className="rdte-text-xs rdte-text-gray-600 rdte-flex-1">{label}</label>
      <div className="rdte-flex rdte-rounded rdte-border rdte-border-gray-200 rdte-overflow-hidden">
        {opts.map((o) => (
          <button key={o.key} type="button" onClick={() => onChange(o.key)} className={`rdte-px-2.5 rdte-py-1 rdte-text-xs rdte-font-medium rdte-transition-colors ${value === o.key ? "rdte-bg-blue-500 rdte-text-white" : "rdte-text-gray-600 hover:rdte-bg-gray-50"}`}>
            {o.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

function FontWeightRow({ label, value, onChange }: { label: string; value: "normal" | "bold"; onChange: (v: "normal" | "bold") => void }) {
  return (
    <div className="rdte-flex rdte-items-center rdte-justify-between rdte-gap-2">
      <label className="rdte-text-xs rdte-text-gray-600 rdte-flex-1">{label}</label>
      <div className="rdte-flex rdte-rounded rdte-border rdte-border-gray-200 rdte-overflow-hidden">
        <button type="button" onClick={() => onChange("normal")} className={`rdte-px-2.5 rdte-py-1 rdte-text-xs rdte-transition-colors ${value === "normal" ? "rdte-bg-blue-500 rdte-text-white" : "rdte-text-gray-600 hover:rdte-bg-gray-50"}`}>N</button>
        <button type="button" onClick={() => onChange("bold")} className={`rdte-px-2.5 rdte-py-1 rdte-text-xs rdte-font-bold rdte-transition-colors ${value === "bold" ? "rdte-bg-blue-500 rdte-text-white" : "rdte-text-gray-600 hover:rdte-bg-gray-50"}`}>B</button>
      </div>
    </div>
  );
}

function SelectRow<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="rdte-flex rdte-items-center rdte-justify-between rdte-gap-2">
      <label className="rdte-text-xs rdte-text-gray-600 rdte-flex-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className="rdte-text-xs rdte-px-2 rdte-py-1 rdte-border rdte-border-gray-200 rdte-rounded rdte-bg-white">
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}

// =============================================================================
// Per-widget property editors
// =============================================================================

function LogoProperties({ widget, onChange, l }: { widget: LogoWidget; onChange: (c: Record<string, unknown>) => void; l: EditorLabels }) {
  return (
    <Section title={l["properties.objectFit"]}>
      <SelectRow label={l["properties.objectFit"]} value={widget.objectFit} options={[{ value: "contain", label: l["properties.contain"] }, { value: "cover", label: l["properties.cover"] }, { value: "fill", label: l["properties.fill"] }]} onChange={(v) => onChange({ objectFit: v })} />
      <SliderRow label={l["properties.borderRadius"]} value={widget.borderRadius} min={0} max={20} onChange={(v) => onChange({ borderRadius: v })} />
    </Section>
  );
}

function HeadingProperties({ widget, onChange, l }: { widget: HeadingWidget; onChange: (c: Record<string, unknown>) => void; l: EditorLabels }) {
  const [localText, setLocalText] = useState(widget.text);
  return (
    <Section title={l["properties.text"]}>
      <Row label={l["properties.text"]}><input type="text" value={localText} onChange={(e) => setLocalText(e.target.value)} onBlur={() => onChange({ text: localText })} className="rdte-w-28 rdte-text-xs rdte-px-2 rdte-py-1 rdte-border rdte-border-gray-200 rdte-rounded" /></Row>
      <SliderRow label={l["properties.fontSize"]} value={widget.fontSize} min={10} max={72} onChange={(v) => onChange({ fontSize: v })} />
      <FontWeightRow label={l["properties.fontWeight"]} value={widget.fontWeight} onChange={(v) => onChange({ fontWeight: v })} />
      <ColorRow label={l["properties.color"]} value={widget.color} onChange={(v) => onChange({ color: v })} />
      <AlignRow label={l["properties.align"]} value={widget.align} onChange={(v) => onChange({ align: v })} />
    </Section>
  );
}

function SenderInfoProperties({ widget, onChange, l }: { widget: SenderInfoWidget; onChange: (c: Record<string, unknown>) => void; l: EditorLabels }) {
  const [localName, setLocalName] = useState(widget.name ?? "");
  const [localField1, setLocalField1] = useState(widget.field1 ?? "");
  const [localField2, setLocalField2] = useState(widget.field2 ?? "");
  const [localPhone, setLocalPhone] = useState(widget.phone ?? "");
  const [localEmail, setLocalEmail] = useState(widget.email ?? "");
  return (
    <>
      <Section title={l["properties.visibility"]}>
        <ToggleRow label={l["properties.showName"]} checked={widget.showName} onChange={(v) => onChange({ showName: v })} />
        <ToggleRow label={l["properties.showPhone"]} checked={widget.showPhone} onChange={(v) => onChange({ showPhone: v })} />
        <ToggleRow label={l["properties.showEmail"]} checked={widget.showEmail ?? false} onChange={(v) => onChange({ showEmail: v })} />
        <ToggleRow label={l["properties.showField1"]} checked={widget.showField1} onChange={(v) => onChange({ showField1: v })} />
        <ToggleRow label={l["properties.showField2"]} checked={widget.showField2} onChange={(v) => onChange({ showField2: v })} />
        <ToggleRow label={l["properties.showField3"]} checked={widget.showField3} onChange={(v) => onChange({ showField3: v })} />
        <ToggleRow label={l["properties.showAddress"]} checked={widget.showAddress} onChange={(v) => onChange({ showAddress: v })} />
      </Section>
      <Section title={l["properties.values"]}>
        <Row label={l["properties.senderName"]}><input type="text" value={localName} onChange={(e) => setLocalName(e.target.value)} onBlur={() => onChange({ name: localName || undefined })} className="rdte-w-28 rdte-text-xs rdte-px-2 rdte-py-1 rdte-border rdte-border-gray-200 rdte-rounded" /></Row>
        <Row label={l["properties.field1"]}><input type="text" value={localField1} onChange={(e) => setLocalField1(e.target.value)} onBlur={() => onChange({ field1: localField1 || undefined })} className="rdte-w-28 rdte-text-xs rdte-px-2 rdte-py-1 rdte-border rdte-border-gray-200 rdte-rounded" /></Row>
        <Row label={l["properties.field2"]}><input type="text" value={localField2} onChange={(e) => setLocalField2(e.target.value)} onBlur={() => onChange({ field2: localField2 || undefined })} className="rdte-w-28 rdte-text-xs rdte-px-2 rdte-py-1 rdte-border rdte-border-gray-200 rdte-rounded" /></Row>
        <Row label={l["properties.phone"]}><input type="text" value={localPhone} onChange={(e) => setLocalPhone(e.target.value)} onBlur={() => onChange({ phone: localPhone || undefined })} className="rdte-w-28 rdte-text-xs rdte-px-2 rdte-py-1 rdte-border rdte-border-gray-200 rdte-rounded" /></Row>
        <Row label={l["properties.email"]}><input type="text" value={localEmail} onChange={(e) => setLocalEmail(e.target.value)} onBlur={() => onChange({ email: localEmail || undefined })} className="rdte-w-28 rdte-text-xs rdte-px-2 rdte-py-1 rdte-border rdte-border-gray-200 rdte-rounded" /></Row>
      </Section>
      <Section title={l["properties.fontSize"]}>
        <SliderRow label={l["properties.fontSize"]} value={widget.fontSize} min={8} max={18} onChange={(v) => onChange({ fontSize: v })} />
        <ColorRow label={l["properties.color"]} value={widget.color} onChange={(v) => onChange({ color: v })} />
        <FontWeightRow label={l["properties.fontWeight"]} value={widget.fontWeight} onChange={(v) => onChange({ fontWeight: v })} />
      </Section>
    </>
  );
}

function RecipientInfoProperties({ widget, onChange, l }: { widget: RecipientInfoWidget; onChange: (c: Record<string, unknown>) => void; l: EditorLabels }) {
  const [localLabel, setLocalLabel] = useState(widget.label);
  return (
    <>
      <Section title={l["properties.label"]}>
        <Row label={l["properties.label"]}><input type="text" value={localLabel} onChange={(e) => setLocalLabel(e.target.value)} onBlur={() => onChange({ label: localLabel })} className="rdte-w-28 rdte-text-xs rdte-px-2 rdte-py-1 rdte-border rdte-border-gray-200 rdte-rounded" /></Row>
        <ToggleRow label={l["properties.showName"]} checked={widget.showName} onChange={(v) => onChange({ showName: v })} />
        <ToggleRow label={l["properties.showAddress"]} checked={widget.showAddress} onChange={(v) => onChange({ showAddress: v })} />
      </Section>
      <Section title={l["properties.fontSize"]}>
        <SliderRow label={l["properties.fontSize"]} value={widget.fontSize} min={8} max={18} onChange={(v) => onChange({ fontSize: v })} />
        <ColorRow label={l["properties.color"]} value={widget.color} onChange={(v) => onChange({ color: v })} />
        <ColorRow label={l["properties.labelColor"]} value={widget.labelColor} onChange={(v) => onChange({ labelColor: v })} />
        <FontWeightRow label={l["properties.fontWeight"]} value={widget.fontWeight} onChange={(v) => onChange({ fontWeight: v })} />
      </Section>
    </>
  );
}

function DataTableProperties({ widget, onChange, onOpenTableEditor, l }: { widget: DataTableWidget; onChange: (c: Record<string, unknown>) => void; onOpenTableEditor: () => void; l: EditorLabels }) {
  return (
    <>
      <Section title={l["properties.editTable"]}>
        <button type="button" onClick={onOpenTableEditor} className="rdte-w-full rdte-text-left rdte-px-3 rdte-py-2 rdte-text-sm rdte-rounded-lg rdte-bg-blue-500 rdte-text-white hover:rdte-bg-blue-600">{l["properties.editTable"]}</button>
      </Section>
      <Section title={l["properties.color"]}>
        <ColorRow label={l["properties.headerBgColor"]} value={widget.headerBgColor} onChange={(v) => onChange({ headerBgColor: v })} />
        <ColorRow label={l["properties.headerTextColor"]} value={widget.headerTextColor} onChange={(v) => onChange({ headerTextColor: v })} />
        <ColorRow label={l["properties.rowTextColor"]} value={widget.rowTextColor} onChange={(v) => onChange({ rowTextColor: v })} />
        <ColorRow label={l["properties.totalBgColor"]} value={widget.totalBgColor} onChange={(v) => onChange({ totalBgColor: v })} />
        <ColorRow label={l["properties.totalTextColor"]} value={widget.totalTextColor} onChange={(v) => onChange({ totalTextColor: v })} />
        <ColorRow label={l["properties.borderColor"]} value={widget.borderColor} onChange={(v) => onChange({ borderColor: v })} />
        <SliderRow label={l["properties.fontSize"]} value={widget.fontSize} min={8} max={18} onChange={(v) => onChange({ fontSize: v })} />
      </Section>
    </>
  );
}

function DateBlockProperties({ widget, onChange, l }: { widget: DateBlockWidget; onChange: (c: Record<string, unknown>) => void; l: EditorLabels }) {
  const [localLabel, setLocalLabel] = useState(widget.label);
  return (
    <Section title={l["properties.label"]}>
      <ToggleRow label={l["properties.showLabel"]} checked={widget.showLabel} onChange={(v) => onChange({ showLabel: v })} />
      {widget.showLabel && <Row label={l["properties.label"]}><input type="text" value={localLabel} onChange={(e) => setLocalLabel(e.target.value)} onBlur={() => onChange({ label: localLabel })} className="rdte-w-28 rdte-text-xs rdte-px-2 rdte-py-1 rdte-border rdte-border-gray-200 rdte-rounded" /></Row>}
      <SelectRow label={l["properties.format"]} value={widget.format} options={[{ value: "long", label: l["properties.long"] }, { value: "short", label: l["properties.short"] }, { value: "iso", label: l["properties.iso"] }]} onChange={(v) => onChange({ format: v })} />
      <SliderRow label={l["properties.fontSize"]} value={widget.fontSize} min={8} max={18} onChange={(v) => onChange({ fontSize: v })} />
      <ColorRow label={l["properties.color"]} value={widget.color} onChange={(v) => onChange({ color: v })} />
      <FontWeightRow label={l["properties.fontWeight"]} value={widget.fontWeight} onChange={(v) => onChange({ fontWeight: v })} />
      <AlignRow label={l["properties.align"]} value={widget.align} onChange={(v) => onChange({ align: v })} />
    </Section>
  );
}

function DetailsBlockProperties({ widget, onChange, l }: { widget: DetailsBlockWidget; onChange: (c: Record<string, unknown>) => void; l: EditorLabels }) {
  const [localLabel, setLocalLabel] = useState(widget.label);
  return (
    <>
      <Section title={l["properties.label"]}>
        <Row label={l["properties.label"]}><input type="text" value={localLabel} onChange={(e) => setLocalLabel(e.target.value)} onBlur={() => onChange({ label: localLabel })} className="rdte-w-28 rdte-text-xs rdte-px-2 rdte-py-1 rdte-border rdte-border-gray-200 rdte-rounded" /></Row>
        <ToggleRow label={l["properties.showField1"]} checked={widget.showField1} onChange={(v) => onChange({ showField1: v })} />
        <ToggleRow label={l["properties.showField2"]} checked={widget.showField2} onChange={(v) => onChange({ showField2: v })} />
        <ToggleRow label={l["properties.showField3"]} checked={widget.showField3 ?? false} onChange={(v) => onChange({ showField3: v })} />
        <ToggleRow label={l["properties.showField4"]} checked={widget.showField4} onChange={(v) => onChange({ showField4: v })} />
        <ToggleRow label={l["properties.showField5"]} checked={widget.showField5} onChange={(v) => onChange({ showField5: v })} />
      </Section>
      <Section title={l["properties.fontSize"]}>
        <SliderRow label={l["properties.fontSize"]} value={widget.fontSize} min={8} max={18} onChange={(v) => onChange({ fontSize: v })} />
        <ColorRow label={l["properties.color"]} value={widget.color} onChange={(v) => onChange({ color: v })} />
        <ColorRow label={l["properties.labelColor"]} value={widget.labelColor} onChange={(v) => onChange({ labelColor: v })} />
      </Section>
    </>
  );
}

function NoteProperties({ widget, onChange, l }: { widget: NoteWidget; onChange: (c: Record<string, unknown>) => void; l: EditorLabels }) {
  const [localLabel, setLocalLabel] = useState(widget.label);
  return (
    <Section title={l["properties.label"]}>
      <Row label={l["properties.label"]}><input type="text" value={localLabel} onChange={(e) => setLocalLabel(e.target.value)} onBlur={() => onChange({ label: localLabel })} className="rdte-w-28 rdte-text-xs rdte-px-2 rdte-py-1 rdte-border rdte-border-gray-200 rdte-rounded" /></Row>
      <ToggleRow label={l["properties.showLabel"]} checked={widget.showLabel} onChange={(v) => onChange({ showLabel: v })} />
      <SliderRow label={l["properties.fontSize"]} value={widget.fontSize} min={8} max={18} onChange={(v) => onChange({ fontSize: v })} />
      <ColorRow label={l["properties.color"]} value={widget.color} onChange={(v) => onChange({ color: v })} />
      <ToggleRow label={l["properties.showBg"]} checked={widget.showBg} onChange={(v) => onChange({ showBg: v })} />
      {widget.showBg && <ColorRow label={l["properties.bgColor"]} value={widget.bgColor} onChange={(v) => onChange({ bgColor: v })} />}
      <SliderRow label={l["properties.borderRadius"]} value={widget.borderRadius} min={0} max={20} onChange={(v) => onChange({ borderRadius: v })} />
    </Section>
  );
}

function DividerProperties({ widget, onChange, l }: { widget: DividerWidget; onChange: (c: Record<string, unknown>) => void; l: EditorLabels }) {
  return (
    <Section title={l["properties.style"]}>
      <ColorRow label={l["properties.color"]} value={widget.color} onChange={(v) => onChange({ color: v })} />
      <SliderRow label={l["properties.thickness"]} value={widget.thickness} min={1} max={8} onChange={(v) => onChange({ thickness: v })} />
      <SelectRow label={l["properties.style"]} value={widget.style} options={[{ value: "solid", label: l["properties.solid"] }, { value: "dashed", label: l["properties.dashed"] }, { value: "dotted", label: l["properties.dotted"] }]} onChange={(v) => onChange({ style: v })} />
    </Section>
  );
}

function TextProperties({ widget, onChange, l }: { widget: TextWidget; onChange: (c: Record<string, unknown>) => void; l: EditorLabels }) {
  const [localContent, setLocalContent] = useState(widget.content);
  return (
    <>
      <Section title={l["properties.content"]}>
        <textarea value={localContent} onChange={(e) => setLocalContent(e.target.value)} onBlur={() => onChange({ content: localContent })} className="rdte-w-full rdte-h-24 rdte-resize-none rdte-text-xs rdte-px-2 rdte-py-1.5 rdte-border rdte-border-gray-200 rdte-rounded" />
      </Section>
      <Section title={l["properties.fontSize"]}>
        <SliderRow label={l["properties.fontSize"]} value={widget.fontSize} min={8} max={24} onChange={(v) => onChange({ fontSize: v })} />
        <ColorRow label={l["properties.color"]} value={widget.color} onChange={(v) => onChange({ color: v })} />
        <FontWeightRow label={l["properties.fontWeight"]} value={widget.fontWeight} onChange={(v) => onChange({ fontWeight: v })} />
        <Row label={l["properties.fontStyle"]}>
          <div className="rdte-flex rdte-rounded rdte-border rdte-border-gray-200 rdte-overflow-hidden">
            <button type="button" onClick={() => onChange({ fontStyle: "normal" })} className={`rdte-px-2.5 rdte-py-1 rdte-text-xs rdte-transition-colors ${widget.fontStyle === "normal" ? "rdte-bg-blue-500 rdte-text-white" : "rdte-text-gray-600 hover:rdte-bg-gray-50"}`}>{l["properties.normal"]}</button>
            <button type="button" onClick={() => onChange({ fontStyle: "italic" })} className={`rdte-px-2.5 rdte-py-1 rdte-text-xs rdte-italic rdte-transition-colors ${widget.fontStyle === "italic" ? "rdte-bg-blue-500 rdte-text-white" : "rdte-text-gray-600 hover:rdte-bg-gray-50"}`}>{l["properties.italic"]}</button>
          </div>
        </Row>
        <AlignRow label={l["properties.align"]} value={widget.align} onChange={(v) => onChange({ align: v })} />
        <SliderRow label={l["properties.lineHeight"]} value={widget.lineHeight} min={1.0} max={2.5} step={0.1} suffix="" onChange={(v) => onChange({ lineHeight: v })} />
        <ColorRow label={l["properties.bgColor"]} value={widget.backgroundColor} onChange={(v) => onChange({ backgroundColor: v })} />
        <SliderRow label={l["properties.padding"]} value={widget.padding} min={0} max={20} onChange={(v) => onChange({ padding: v })} />
      </Section>
    </>
  );
}

// =============================================================================
// Dispatcher
// =============================================================================

function WidgetSpecificControls({ widget, onChange, onOpenTableEditor, l }: { widget: DocumentWidget; onChange: (c: Record<string, unknown>) => void; onOpenTableEditor: () => void; l: EditorLabels }) {
  switch (widget.type) {
    case "logo": return <LogoProperties widget={widget} onChange={onChange} l={l} />;
    case "heading": return <HeadingProperties widget={widget} onChange={onChange} l={l} />;
    case "senderInfo": return <SenderInfoProperties widget={widget} onChange={onChange} l={l} />;
    case "recipientInfo": return <RecipientInfoProperties widget={widget} onChange={onChange} l={l} />;
    case "dataTable": return <DataTableProperties widget={widget} onChange={onChange} onOpenTableEditor={onOpenTableEditor} l={l} />;
    case "dateBlock": return <DateBlockProperties widget={widget} onChange={onChange} l={l} />;
    case "detailsBlock": return <DetailsBlockProperties widget={widget} onChange={onChange} l={l} />;
    case "note": return <NoteProperties widget={widget} onChange={onChange} l={l} />;
    case "divider": return <DividerProperties widget={widget} onChange={onChange} l={l} />;
    case "text": return <TextProperties widget={widget} onChange={onChange} l={l} />;
    case "summarySection": return null;
    default: return null;
  }
}

// =============================================================================
// Main component
// =============================================================================

export function WidgetPropertiesPanel({ widget, onChange, onPositionChange, onOpenTableEditor }: Props) {
  const l = useLabels();

  const handlePositionField = (field: keyof WidgetPosition, raw: string) => {
    const parsed = Math.round(Number(raw));
    if (!Number.isNaN(parsed)) onPositionChange({ ...widget.position, [field]: parsed });
  };

  return (
    <aside className="rdte-w-64 rdte-flex-shrink-0 rdte-bg-white rdte-border-l rdte-border-gray-200 rdte-overflow-y-auto">
      <div className="rdte-p-4 rdte-border-b rdte-border-gray-100">
        <h2 className="rdte-text-xs rdte-font-semibold rdte-text-gray-500 rdte-uppercase rdte-tracking-wider">{l["properties.title"]}</h2>
      </div>
      <Section title={l["properties.position"]}>
        <div className="rdte-grid rdte-grid-cols-2 rdte-gap-2">
          {(["x", "y", "width", "height"] as const).map((field) => (
            <div key={field}>
              <label className="rdte-text-xs rdte-text-gray-500 rdte-mb-0.5 rdte-block">{l[`properties.${field === "x" ? "posX" : field === "y" ? "posY" : field}` as keyof EditorLabels]}</label>
              <input
                type="number"
                defaultValue={widget.position[field]}
                key={`${widget.id}-${field}-${widget.position[field]}`}
                onBlur={(e) => handlePositionField(field, e.target.value)}
                className="rdte-w-full rdte-rounded rdte-border rdte-border-gray-200 rdte-px-2 rdte-py-1 rdte-text-xs rdte-font-mono"
              />
            </div>
          ))}
        </div>
      </Section>
      <WidgetSpecificControls widget={widget} onChange={onChange} onOpenTableEditor={onOpenTableEditor} l={l} />
    </aside>
  );
}
