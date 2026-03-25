import type { DocumentTemplate, DocumentTheme } from "./types";

export function serializeTemplate(template: DocumentTemplate): string {
  return JSON.stringify(template);
}

export function deserializeTemplate(json: string): DocumentTemplate | null {
  try {
    const parsed = JSON.parse(json) as DocumentTemplate;
    if (!parsed.version || !parsed.widgets || !parsed.theme) return null;

    // Migration: backfill missing fields on detailsBlock widgets
    parsed.widgets = parsed.widgets.map((w) => {
      if (w.type === "detailsBlock" && !("showField3" in w)) {
        return { ...w, showField3: false };
      }
      return w;
    });

    // Migration: add summarySection widget if missing
    const hasSummary = parsed.widgets.some((w) => w.type === "summarySection");
    if (!hasSummary) {
      const primaryColor = parsed.theme.primaryColor || "#1a1a2e";
      parsed.widgets.push({
        id: "summarySection",
        type: "summarySection",
        position: { x: 300, y: 680, width: 468, height: 100 },
        visible: true,
        fontSize: 11,
        textColor: primaryColor,
        totalTextColor: primaryColor,
        borderColor: primaryColor,
      });
    }

    return parsed;
  } catch {
    return null;
  }
}

const DEFAULT_PRIMARY = "#1a1a2e";

/** Encode theme as URL-safe base64 */
export function encodeThemeForUrl(theme: DocumentTheme): string {
  const json = JSON.stringify(theme);
  const bytes = new TextEncoder().encode(json);
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Decode theme from URL-safe base64 */
export function decodeThemeFromUrl(encoded: string): DocumentTheme | null {
  try {
    const padded = encoded + "=".repeat((4 - (encoded.length % 4)) % 4);
    const binary = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as DocumentTheme;
    if (!parsed.primaryColor) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Create a template from default layout with a custom theme applied */
export function applyThemeToTemplate(
  template: DocumentTemplate,
  theme: DocumentTheme,
): DocumentTemplate {
  const result = { ...template, theme: { ...theme } };
  result.widgets = result.widgets.map((w) => {
    const updates: Record<string, string> = {};
    const wa = w as unknown as Record<string, unknown>;
    if ("color" in w && wa.color === DEFAULT_PRIMARY) updates.color = theme.primaryColor;
    if ("labelColor" in w && wa.labelColor === DEFAULT_PRIMARY) updates.labelColor = theme.primaryColor;
    if ("headerBgColor" in w && wa.headerBgColor === DEFAULT_PRIMARY) updates.headerBgColor = theme.primaryColor;
    if ("headerTextColor" in w && wa.headerTextColor === DEFAULT_PRIMARY) updates.headerTextColor = theme.primaryColor;
    if ("totalTextColor" in w && wa.totalTextColor === DEFAULT_PRIMARY) updates.totalTextColor = theme.primaryColor;
    if ("borderColor" in w && wa.borderColor === DEFAULT_PRIMARY) updates.borderColor = theme.primaryColor;
    if ("textColor" in w && wa.textColor === DEFAULT_PRIMARY) updates.textColor = theme.primaryColor;
    return Object.keys(updates).length ? { ...w, ...updates } : w;
  });
  return result;
}

// ============================================================================
// Line Item Helpers
// ============================================================================

let _idCounter = 0;

export function generateItemId(): string {
  _idCounter += 1;
  return `item_${Date.now()}_${_idCounter}_${Math.random().toString(36).slice(2, 6)}`;
}

export function formatCents(cents?: number): string {
  return `$${((cents ?? 0) / 100).toFixed(2)}`;
}

export function parseCurrencyToCents(value?: string): number {
  if (!value) return 0;
  const normalized = value.replace(/[^\d.-]/g, "");
  const amount = Number.parseFloat(normalized);
  if (Number.isNaN(amount)) return 0;
  return Math.round(amount * 100);
}

export function recalculateTotals(
  lineItems: { totalCents: number }[],
  totalItems: { amountCents: number }[],
): { subtotalCents: number; totalCents: number } {
  const subtotalCents = lineItems.reduce((sum, item) => sum + item.totalCents, 0);
  const totalAdjustments = totalItems.reduce((sum, item) => sum + item.amountCents, 0);
  return { subtotalCents, totalCents: subtotalCents + totalAdjustments };
}
