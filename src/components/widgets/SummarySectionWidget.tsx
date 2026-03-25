import type { SummarySectionWidget as SummarySectionWidgetType, DocumentData } from "../../types";

interface Props {
  widget: SummarySectionWidgetType;
  data?: DocumentData;
  scale?: number;
}

function formatCents(cents?: number): string {
  return `$${((cents ?? 0) / 100).toFixed(2)}`;
}

export function SummarySectionWidget({ widget, data, scale = 1 }: Props) {
  const fontSize = widget.fontSize * scale;
  const subtotalCents = data?.subtotalCents ?? 0;
  const totalCents = data?.totalCents ?? subtotalCents;
  const totalItems = data?.totalItems ?? [];
  const hasLineItems = data?.lineItems && data.lineItems.length > 0;

  return (
    <div className="rdte-w-full rdte-h-full rdte-overflow-hidden" style={{ fontSize }}>
      <div className="rdte-flex rdte-flex-col rdte-gap-1">
        {hasLineItems && (
          <div className="rdte-flex rdte-justify-between rdte-px-2 rdte-py-1" style={{ color: widget.textColor }}>
            <span>Subtotal</span>
            <span>{formatCents(subtotalCents)}</span>
          </div>
        )}
        {totalItems.map((item) => (
          <div key={item.id} className="rdte-flex rdte-justify-between rdte-px-2 rdte-py-1" style={{ color: widget.textColor }}>
            <span>{item.label}</span>
            <span>{formatCents(item.amountCents)}</span>
          </div>
        ))}
        <div
          className="rdte-flex rdte-justify-between rdte-px-2 rdte-py-2 rdte-font-bold rdte-mt-1"
          style={{ color: widget.totalTextColor, borderTop: `2px solid ${widget.borderColor}` }}
        >
          <span>Total</span>
          <span>{formatCents(totalCents)}</span>
        </div>
      </div>
    </div>
  );
}
