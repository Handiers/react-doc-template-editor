import type { LogoWidget as LogoWidgetType } from "../../types";

interface Props {
  widget: LogoWidgetType;
  onLogoUpload?: (file: File) => void;
  isEditing?: boolean;
}

export function LogoWidget({ widget, onLogoUpload, isEditing = false }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onLogoUpload) onLogoUpload(file);
  };

  if (!widget.logoUrl) {
    return (
      <div className="rdte-w-full rdte-h-full rdte-flex rdte-flex-col rdte-items-center rdte-justify-center rdte-border-2 rdte-border-dashed rdte-border-gray-300 rdte-rounded-md rdte-bg-gray-50">
        {isEditing ? (
          <label className="rdte-cursor-pointer rdte-flex rdte-flex-col rdte-items-center rdte-gap-1">
            <svg className="rdte-w-6 rdte-h-6 rdte-text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="rdte-text-xs rdte-text-gray-500">Upload Logo</span>
            <input type="file" accept="image/*" className="rdte-hidden" onChange={handleFileChange} />
          </label>
        ) : (
          <span className="rdte-text-xs rdte-text-gray-400">Logo</span>
        )}
      </div>
    );
  }

  return (
    <div className="rdte-w-full rdte-h-full rdte-relative rdte-overflow-hidden" style={{ borderRadius: widget.borderRadius }}>
      <img
        src={widget.logoUrl}
        alt="Logo"
        className="rdte-w-full rdte-h-full"
        style={{ objectFit: widget.objectFit }}
      />
      {isEditing && (
        <label className="rdte-absolute rdte-inset-0 rdte-flex rdte-items-center rdte-justify-center rdte-bg-black/40 rdte-opacity-0 hover:rdte-opacity-100 rdte-transition-opacity rdte-cursor-pointer rdte-rounded">
          <span className="rdte-text-white rdte-text-xs rdte-font-medium">Change</span>
          <input type="file" accept="image/*" className="rdte-hidden" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
}
