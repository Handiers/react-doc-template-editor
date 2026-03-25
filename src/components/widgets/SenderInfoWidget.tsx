import type { SenderInfoWidget as SenderInfoWidgetType, DocumentData } from "../../types";

interface Props {
  widget: SenderInfoWidgetType;
  data?: DocumentData;
  scale?: number;
}

export function SenderInfoWidget({ widget, data, scale = 1 }: Props) {
  const fontSize = widget.fontSize * scale;
  const sender = data?.sender;

  const name = widget.name || sender?.name || "Company Name";
  const phone = widget.phone || sender?.phone || "(555) 000-0000";
  const email = widget.email || sender?.email || "email@example.com";
  const field1 = widget.field1 || sender?.field1 || "";
  const field2 = widget.field2 || sender?.field2 || "";
  const field3 = sender?.field3 || "";
  const address = sender?.address || "";

  return (
    <div
      className="rdte-w-full rdte-h-full rdte-overflow-hidden rdte-space-y-0.5"
      style={{ fontSize, color: widget.color, fontWeight: widget.fontWeight === "bold" ? 700 : 400 }}
    >
      {widget.showName && <div className="rdte-font-semibold" style={{ fontSize: fontSize + 2 }}>{name}</div>}
      {widget.showField1 && field1 && <div>{field1}</div>}
      {widget.showField2 && field2 && <div>{field2}</div>}
      {widget.showField3 && field3 && <div>{field3}</div>}
      {widget.showPhone && <div>{phone}</div>}
      {widget.showEmail !== false && email && <div>{email}</div>}
      {widget.showAddress && address && <div>{address}</div>}
    </div>
  );
}
