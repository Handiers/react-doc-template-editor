import type { RecipientInfoWidget as RecipientInfoWidgetType, DocumentData } from "../../types";

interface Props {
  widget: RecipientInfoWidgetType;
  data?: DocumentData;
  scale?: number;
}

export function RecipientInfoWidget({ widget, data, scale = 1 }: Props) {
  const fontSize = widget.fontSize * scale;
  const recipient = data?.recipient;

  return (
    <div
      className="rdte-w-full rdte-h-full rdte-overflow-hidden"
      style={{ fontSize, color: widget.color, fontWeight: widget.fontWeight === "bold" ? 700 : 400 }}
    >
      <div className="rdte-font-semibold rdte-mb-1" style={{ color: widget.labelColor }}>
        {widget.label}
      </div>
      {widget.showName && (
        <div>{recipient?.name || "Customer Name"}</div>
      )}
      {widget.showAddress && (
        <div className="rdte-text-gray-600">{recipient?.address || "123 Main St"}</div>
      )}
    </div>
  );
}
