import { Fragment } from "react";
import type { DataTableWidget as DataTableWidgetType, DocumentData, DataTableSection } from "../../types";

interface Props {
  widget: DataTableWidgetType;
  data?: DocumentData;
  scale?: number;
}

function formatCents(cents?: number): string {
  return `$${((cents ?? 0) / 100).toFixed(2)}`;
}

function parseCurrencyToCents(value?: string): number {
  if (!value) return 0;
  const normalized = value.replace(/[^\d.-]/g, "");
  const amount = Number.parseFloat(normalized);
  if (Number.isNaN(amount)) return 0;
  return Math.round(amount * 100);
}

function getSectionSubtotalCents(section: DataTableSection): number {
  const cols = section.columns ?? [];
  const lastId = cols[cols.length - 1]?.id;
  if (!lastId) return 0;
  return section.rows.reduce((sum, row) => sum + parseCurrencyToCents(row.cells?.[lastId]), 0);
}

export function DataTableWidget({ widget, data, scale = 1 }: Props) {
  const columns = widget.columns ?? [
    { id: "col_desc", label: "Description", align: "left" as const },
    { id: "col_amount", label: "Amount", align: "right" as const },
  ];
  const colCount = columns.length;
  const firstId = columns[0]?.id ?? "col_desc";
  const fontSize = widget.fontSize * scale;

  // Render line items from data if available
  if (data?.lineItems && data.lineItems.length > 0) {
    return (
      <div className="rdte-w-full rdte-h-full rdte-overflow-auto" style={{ fontSize }}>
        <div className="rdte-p-4 rdte-outline rdte-outline-1 rdte-outline-offset-[-1px] rdte-outline-gray-200 rdte-flex rdte-flex-col rdte-gap-3">
          <div className="rdte-flex rdte-flex-col rdte-gap-3">
            <div className="rdte-px-2 rdte-py-1"><span className="rdte-text-xs rdte-font-bold">Line Items</span></div>
            <div className="rdte-h-5 rdte-px-2 rdte-py-1 rdte-bg-stone-50 rdte-flex rdte-justify-between rdte-items-center">
              <div className="rdte-w-48 rdte-text-[10px] rdte-font-bold">Products/Services</div>
              <div className="rdte-w-24 rdte-text-[10px] rdte-font-bold">Qty</div>
              <div className="rdte-w-24 rdte-text-[10px] rdte-font-bold">Unit Price</div>
              <div className="rdte-w-24 rdte-text-[10px] rdte-font-bold">Total</div>
            </div>
            <div className="rdte-flex rdte-flex-col rdte-gap-3">
              {data.lineItems.map((item) => (
                <div key={item.id} className="rdte-px-2 rdte-flex rdte-justify-between rdte-items-center rdte-gap-2">
                  <div className="rdte-w-48 rdte-text-[9px]">{item.name}</div>
                  <div className="rdte-w-24 rdte-text-[9px]">{item.quantity}</div>
                  <div className="rdte-w-24 rdte-text-[9px]">{formatCents(item.unitCostCents)}</div>
                  <div className="rdte-w-24 rdte-text-[9px]">{formatCents(item.totalCents)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasSections = Boolean(widget.sections && widget.sections.length > 0);

  if (hasSections) {
    const sections = widget.sections ?? [];
    return (
      <div className="rdte-w-full rdte-h-full rdte-overflow-hidden" style={{ fontSize }}>
        <div className="rdte-outline rdte-outline-1 rdte-outline-offset-[-1px] rdte-outline-gray-200">
          {sections.map((section, sectionIndex) => {
            const sectionColumns = section.columns ?? [];
            const sectionColCount = sectionColumns.length;
            const subtotalCents = getSectionSubtotalCents(section);

            return (
              <div
                key={section.id}
                style={sectionIndex < sections.length - 1 ? { borderBottom: `1px solid ${widget.borderColor}` } : undefined}
              >
                <div
                  className="rdte-px-3 rdte-py-1.5 rdte-text-sm rdte-font-bold"
                  style={{ backgroundColor: widget.headerBgColor, color: widget.headerTextColor }}
                >
                  {section.title}
                </div>
                <table className="rdte-w-full rdte-border-collapse" style={{ tableLayout: "fixed" }}>
                  <colgroup>
                    {sectionColumns.map((col, i) => (
                      <col key={col.id} style={i > 0 ? { width: `${Math.floor(100 / (sectionColCount + 1))}%` } : undefined} />
                    ))}
                  </colgroup>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${widget.borderColor}` }}>
                      {sectionColumns.map((col) => (
                        <th
                          key={col.id}
                          className={`rdte-px-3 rdte-py-2 rdte-text-sm rdte-font-semibold rdte-truncate ${col.align === "right" ? "rdte-text-right" : "rdte-text-left"}`}
                          style={{ color: widget.headerTextColor }}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row) => (
                      <Fragment key={row.id}>
                        <tr style={{ borderBottom: `1px solid ${widget.borderColor}` }}>
                          {sectionColumns.map((col) => (
                            <td
                              key={col.id}
                              className={`rdte-px-3 rdte-py-2 ${col.align === "right" ? "rdte-text-right" : "rdte-text-left"}`}
                              style={{ color: widget.rowTextColor }}
                            >
                              {row.cells?.[col.id] ?? ""}
                            </td>
                          ))}
                        </tr>
                        {row.description && (
                          <tr style={{ borderBottom: `1px solid ${widget.borderColor}` }}>
                            <td colSpan={sectionColCount} className="rdte-px-3 rdte-pb-2 rdte-text-xs" style={{ color: widget.rowTextColor, opacity: 0.65 }}>
                              {row.description}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                    {widget.showSubtotals && sectionColCount > 0 && (
                      <tr style={{ borderTop: `1px solid ${widget.borderColor}` }}>
                        {sectionColumns.map((col, index) => (
                          <td
                            key={col.id}
                            className={`rdte-px-3 rdte-py-2 rdte-text-sm rdte-font-semibold ${col.align === "right" ? "rdte-text-right" : "rdte-text-left"}`}
                            style={{ color: widget.rowTextColor, opacity: 0.85 }}
                          >
                            {index === 0 ? "Subtotal" : index === sectionColCount - 1 ? formatCents(subtotalCents) : ""}
                          </td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Flat mode (legacy)
  return (
    <div className="rdte-w-full rdte-h-full rdte-overflow-hidden" style={{ fontSize }}>
      <table className="rdte-w-full rdte-border-collapse">
        <thead>
          <tr style={{ backgroundColor: widget.headerBgColor }}>
            {columns.map((col) => (
              <th
                key={col.id}
                className={`rdte-px-3 rdte-py-2 rdte-text-sm rdte-font-semibold ${col.align === "right" ? "rdte-text-right" : "rdte-text-left"}`}
                style={{ color: widget.headerTextColor }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(widget.customRows ?? []).map((row) => {
            if (row.kind === "header") {
              return (
                <tr key={row.id}>
                  <td colSpan={colCount} className="rdte-px-3 rdte-pt-3 rdte-pb-1 rdte-text-left rdte-text-xs rdte-font-semibold rdte-uppercase rdte-tracking-wide" style={{ color: widget.rowTextColor, opacity: 0.6 }}>
                    {row.cells?.[firstId] ?? ""}
                  </td>
                </tr>
              );
            }
            return (
              <tr key={row.id} style={{ borderBottom: `1px solid ${widget.borderColor}` }}>
                {columns.map((col) => (
                  <td key={col.id} className={`rdte-px-3 rdte-py-2 ${col.align === "right" ? "rdte-text-right" : "rdte-text-left"}`} style={{ color: widget.rowTextColor }}>
                    {row.cells?.[col.id] ?? ""}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
