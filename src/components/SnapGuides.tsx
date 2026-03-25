export interface SnapGuide {
  type: "vertical" | "horizontal";
  position: number;
}

interface Props {
  guides: SnapGuide[];
  canvasWidth: number;
  canvasHeight: number;
}

export function SnapGuides({ guides, canvasWidth, canvasHeight }: Props) {
  if (guides.length === 0) return null;

  return (
    <>
      {guides.map((guide, i) => {
        if (guide.type === "vertical") {
          return (
            <div
              key={`v-${i}-${guide.position}`}
              className="rdte-pointer-events-none rdte-absolute rdte-top-0"
              style={{ left: guide.position, width: 1, height: canvasHeight, backgroundColor: "#3b82f6", opacity: 0.8, zIndex: 50, transform: "translateX(-0.5px)" }}
            />
          );
        }
        return (
          <div
            key={`h-${i}-${guide.position}`}
            className="rdte-pointer-events-none rdte-absolute rdte-left-0"
            style={{ top: guide.position, height: 1, width: canvasWidth, backgroundColor: "#3b82f6", opacity: 0.8, zIndex: 50, transform: "translateY(-0.5px)" }}
          />
        );
      })}
    </>
  );
}
