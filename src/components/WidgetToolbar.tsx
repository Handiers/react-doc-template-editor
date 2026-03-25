import { useLabels } from "../i18n";
import type { DocumentWidget, WidgetType } from "../types";
import { MULTI_TYPES } from "../types";

interface Props {
  widgets: DocumentWidget[];
  addableTypes: WidgetType[];
  onToggleVisible: (id: string) => void;
  onAddWidget: (type: WidgetType) => void;
  selectedWidgetId?: string | null;
  onSelectWidget?: (id: string) => void;
  onDeleteWidget?: (id: string) => void;
}

const WIDGET_LABEL_KEYS: Record<WidgetType, string> = {
  logo: "widgets.logo",
  heading: "widgets.heading",
  senderInfo: "widgets.senderInfo",
  recipientInfo: "widgets.recipientInfo",
  dataTable: "widgets.dataTable",
  summarySection: "widgets.summarySection",
  dateBlock: "widgets.dateBlock",
  detailsBlock: "widgets.detailsBlock",
  note: "widgets.note",
  divider: "widgets.divider",
  text: "widgets.text",
};

export function WidgetToolbar({ widgets, addableTypes, onToggleVisible, onAddWidget, selectedWidgetId, onSelectWidget, onDeleteWidget }: Props) {
  const labels = useLabels();
  const getWidgetLabel = (type: WidgetType) => labels[WIDGET_LABEL_KEYS[type] as keyof typeof labels] ?? type;

  const restoreTypes = addableTypes.filter((type) => !MULTI_TYPES.has(type));
  const newTypes = addableTypes.filter((type) => MULTI_TYPES.has(type));

  return (
    <aside className="rdte-w-56 rdte-flex-shrink-0 rdte-bg-white rdte-border-r rdte-border-gray-200 rdte-overflow-y-auto">
      <div className="rdte-p-4 rdte-border-b rdte-border-gray-100">
        <h2 className="rdte-text-xs rdte-font-semibold rdte-text-gray-500 rdte-uppercase rdte-tracking-wider">
          {labels["toolbar.widgets"]}
        </h2>
      </div>

      <div className="rdte-p-2 rdte-space-y-1">
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className={`rdte-flex rdte-items-center rdte-justify-between rdte-px-3 rdte-py-2 rdte-rounded-lg hover:rdte-bg-gray-50 rdte-group ${onSelectWidget ? "rdte-cursor-pointer" : ""} ${selectedWidgetId === widget.id ? "rdte-bg-blue-50 rdte-ring-1 rdte-ring-inset rdte-ring-blue-300" : ""}`}
            onClick={() => onSelectWidget?.(widget.id)}
          >
            <span className="rdte-text-sm rdte-text-gray-700 rdte-truncate rdte-flex-1">{getWidgetLabel(widget.type)}</span>
            <div className="rdte-flex rdte-items-center rdte-gap-1 rdte-shrink-0">
              {onDeleteWidget && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteWidget(widget.id); }}
                  className="rdte-text-gray-300 hover:rdte-text-red-500 rdte-transition-colors rdte-opacity-0 group-hover:rdte-opacity-100"
                  title="Delete widget"
                >
                  <svg className="rdte-w-3.5 rdte-h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onToggleVisible(widget.id); }}
                className="rdte-text-gray-400 hover:rdte-text-gray-600 rdte-transition-colors rdte-ml-1"
                title={widget.visible ? labels["toolbar.hide"] : labels["toolbar.show"]}
              >
                {widget.visible ? (
                  <svg className="rdte-w-4 rdte-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="rdte-w-4 rdte-h-4 rdte-opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {restoreTypes.length > 0 && (
        <div className="rdte-p-4 rdte-border-t rdte-border-gray-100">
          <h3 className="rdte-text-xs rdte-font-semibold rdte-text-gray-500 rdte-uppercase rdte-tracking-wider rdte-mb-2">{labels["toolbar.restore"]}</h3>
          <div className="rdte-space-y-1">
            {restoreTypes.map((type) => (
              <button key={type} onClick={() => onAddWidget(type)} className="rdte-w-full rdte-text-left rdte-px-3 rdte-py-2 rdte-text-sm rdte-text-gray-700 rdte-rounded-lg hover:rdte-bg-amber-50 hover:rdte-text-amber-800 rdte-transition-colors rdte-flex rdte-items-center rdte-gap-2">
                <svg className="rdte-w-3 rdte-h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                {getWidgetLabel(type)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rdte-p-4 rdte-border-t rdte-border-gray-100">
        <h3 className="rdte-text-xs rdte-font-semibold rdte-text-gray-500 rdte-uppercase rdte-tracking-wider rdte-mb-2">{labels["toolbar.add"]}</h3>
        <div className="rdte-space-y-1">
          {newTypes.map((type) => (
            <button key={type} onClick={() => onAddWidget(type)} className="rdte-w-full rdte-text-left rdte-px-3 rdte-py-2 rdte-text-sm rdte-text-gray-700 rdte-rounded-lg hover:rdte-bg-blue-50 hover:rdte-text-blue-800 rdte-transition-colors rdte-flex rdte-items-center rdte-gap-2">
              <svg className="rdte-w-3 rdte-h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              {getWidgetLabel(type)}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
