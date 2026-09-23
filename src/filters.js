// src/filters.js
//
// Funnel-style filtering: no weights, no scores. Each filter step just
// narrows the current pool down further. A listing survives a step only
// if it matches that step's rule; it's then handed to the next step (or
// the final results if the user is done).

function splitKeywords(input) {
  return (input || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function matchesAll(text, keywords) {
  // Empty keyword list = no restriction from this side of the filter.
  return keywords.length === 0 || keywords.every((kw) => text.includes(kw));
}

function matchesNone(text, keywords) {
  return !keywords.some((kw) => text.includes(kw));
}

/**
 * Generic include/exclude keyword filter over one field of the listing.
 * field: "title" (title + company text) or "location"
 */
export function applyKeywordFilter(pool, { include = [], exclude = [], field = "tags" }) {
  const inc = include.map((s) => s.toLowerCase().trim()).filter(Boolean);
  console.log(inc)
  const exc = exclude.map((s) => s.toLowerCase().trim()).filter(Boolean);
  return pool.filter((listing) => {
    const text = (listing[field] || "").toLowerCase();
    return matchesAll(text, inc) && matchesNone(text, exc);
  });
}

// Major/field: comma-separated keywords, must match at least one, searched
// against title + company text (there's no separate "field of study" tag
// in the underlying data, so this is a best-effort text match).
export function applyMajorFilter(pool, majorInput) {
  return applyKeywordFilter(pool, { include: splitKeywords(majorInput), field: "tags" });
}

// Company type / industry: same mechanics as major, different intent.
export function applyCompanyTypeFilter(pool, input) {
  return applyKeywordFilter(pool, { include: splitKeywords(input), field: "tags" });
}

// Location: matched against the listing's location field specifically.
export function applyLocationFilter(pool, input) {
  return applyKeywordFilter(pool, { include: splitKeywords(input), field: "location" });
}

// Free-form +include/-exclude keywords, searched against title + company text.
export function applyPlusMinusFilter(pool, plusInput, minusInput) {
  return applyKeywordFilter(pool, {
    include: splitKeywords(plusInput),
    exclude: splitKeywords(minusInput),
    field: "tags",
  });
}