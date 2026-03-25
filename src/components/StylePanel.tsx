import { useLabels } from "../i18n";
import type { DocumentTheme } from "../types";

interface Props {
  theme: DocumentTheme;
  onChange: (theme: DocumentTheme) => void;
  fontOptions?: string[];
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="rdte-flex rdte-items-center rdte-justify-between rdte-gap-2">
      <label className="rdte-text-sm rdte-text-gray-600 rdte-flex-1">{label}</label>
      <div className="rdte-flex rdte-items-center rdte-gap-1.5">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="rdte-w-7 rdte-h-7 rdte-rounded rdte-cursor-pointer rdte-border rdte-border-gray-200" />
        <input
          type="text"
          value={value}
          onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value); }}
          className="rdte-w-20 rdte-text-xs rdte-px-2 rdte-py-1 rdte-border rdte-border-gray-200 rdte-rounded rdte-font-mono"
          maxLength={7}
        />
      </div>
    </div>
  );
}

const DEFAULT_FONTS = ["Inter", "Roboto", "Georgia", "Courier"];

export function StylePanel({ theme, onChange, fontOptions }: Props) {
  const labels = useLabels();
  const fonts = fontOptions ?? DEFAULT_FONTS;
  const update = (partial: Partial<DocumentTheme>) => onChange({ ...theme, ...partial });

  return (
    <aside className="rdte-w-56 rdte-flex-shrink-0 rdte-bg-white rdte-border-l rdte-border-gray-200 rdte-overflow-y-auto">
      <div className="rdte-p-4 rdte-border-b rdte-border-gray-100">
        <h2 className="rdte-text-xs rdte-font-semibold rdte-text-gray-500 rdte-uppercase rdte-tracking-wider">{labels["style.title"]}</h2>
      </div>
      <div className="rdte-p-4 rdte-space-y-4">
        <div className="rdte-space-y-3">
          <h3 className="rdte-text-xs rdte-font-medium rdte-text-gray-500">{labels["style.colors"]}</h3>
          <ColorInput label={labels["style.primaryColor"]} value={theme.primaryColor} onChange={(v) => update({ primaryColor: v })} />
          <ColorInput label={labels["style.accentColor"]} value={theme.accentColor} onChange={(v) => update({ accentColor: v })} />
          <ColorInput label={labels["style.backgroundColor"]} value={theme.backgroundColor} onChange={(v) => update({ backgroundColor: v })} />
        </div>
        <div className="rdte-space-y-2">
          <h3 className="rdte-text-xs rdte-font-medium rdte-text-gray-500">{labels["style.font"]}</h3>
          <div className="rdte-space-y-1">
            {fonts.map((font) => (
              <button
                key={font}
                onClick={() => update({ fontFamily: font })}
                className={`rdte-w-full rdte-text-left rdte-px-3 rdte-py-2 rdte-text-sm rdte-rounded-lg rdte-transition-colors ${theme.fontFamily === font ? "rdte-bg-blue-50 rdte-text-blue-800 rdte-font-medium" : "rdte-text-gray-700 hover:rdte-bg-gray-50"}`}
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>
        <div className="rdte-space-y-2">
          <div className="rdte-flex rdte-items-center rdte-justify-between">
            <h3 className="rdte-text-xs rdte-font-medium rdte-text-gray-500">{labels["style.fontSize"]}</h3>
            <span className="rdte-text-xs rdte-text-gray-500">{theme.baseFontSize}px</span>
          </div>
          <input type="range" min={9} max={16} step={1} value={theme.baseFontSize} onChange={(e) => update({ baseFontSize: Number(e.target.value) })} className="rdte-w-full" />
        </div>
      </div>
    </aside>
  );
}
