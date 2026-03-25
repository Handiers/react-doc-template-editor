import type { DetailsBlockWidget as DetailsBlockWidgetType, DocumentData } from "../../types";

interface Props {
  widget: DetailsBlockWidgetType;
  data?: DocumentData;
  scale?: number;
}

export function DetailsBlockWidget({ widget, data, scale = 1 }: Props) {
  const fontSize = widget.fontSize * scale;
  const details = data?.details;

  return (
    <div className="rdte-w-full rdte-h-full rdte-overflow-hidden" style={{ fontSize, color: widget.color }}>
      <div className="rdte-font-semibold rdte-mb-1" style={{ color: widget.labelColor }}>
        {widget.label}
      </div>
      <div className="rdte-space-y-0.5">
        {widget.showField1 && (
          <div>{details?.field1 || "Title"}</div>
        )}
        {widget.showField2 && (
          <div>{details?.field2 || "Address"}</div>
        )}
        {widget.showField3 && (
          <div>{details?.field3 || ""}</div>
        )}
        {widget.showField4 && (
          <div>{details?.field4 || "Status"}</div>
        )}
        {widget.showField5 && (
          <div>{details?.field5 || ""}</div>
        )}
      </div>
    </div>
  );
}
