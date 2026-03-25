import type { DividerWidget as DividerWidgetType } from "../../types";

interface Props {
  widget: DividerWidgetType;
}

export function DividerWidget({ widget }: Props) {
  return (
    <div className="rdte-w-full rdte-h-full rdte-flex rdte-items-center">
      <hr
        className="rdte-w-full"
        style={{
          borderTopWidth: widget.thickness,
          borderTopStyle: widget.style,
          borderTopColor: widget.color,
          borderBottom: "none",
          borderLeft: "none",
          borderRight: "none",
          margin: 0,
        }}
      />
    </div>
  );
}
