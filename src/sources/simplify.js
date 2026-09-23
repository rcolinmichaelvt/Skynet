// src/sources/simplify.js
//
// Pulls internship listings from SimplifyJobs' public, community-maintained
// dataset (used by their own README + tools like swelist). This is a JSON
// file on GitHub meant to be fetched programmatically -- no scraping,
// no ToS issues, no login walls.
//
// If you add more sources later (a company careers API, Adzuna, etc.),
// give each one a fetch() that returns objects in this same shape:
//   { title, company, location, url, datePosted, tags, source }
// and push them all into one array in index.js. That's the only contract
// filters.js and display.js care about.

const LISTINGS_URL =
  "https://raw.githubusercontent.com/SimplifyJobs/Summer2027-Internships/dev/.github/scripts/listings.json";

export const SOURCE_NAME = "SimplifyJobs (Summer2027-Internships)";

export async function fetchInternships() {
  const res = await fetch(LISTINGS_URL);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch listings from ${SOURCE_NAME}: HTTP ${res.status}`
    );
  }
  const raw = await res.json();

  return raw
    .filter((item) => item.is_visible !== false && item.active !== false)
    .map((item) => ({
      title: item.title || "Untitled role",
      company: item.company_name || "Unknown company",
      location: (item.locations.join(", ")) || "Unspecified",
      url: item.url || item.company_url || "",
      datePosted: item.date_posted ? new Date(item.date_posted * 1000) : null,
      terms: (item.terms && item.terms.join(", ")) || "Unspecified",
      // tags is a free-text bag we run keyword matching against --
      // title + company give us most of the signal we have available.
      tags: `${item.title} ${item.company_name}`.toLowerCase(),
      source: SOURCE_NAME,
    }));
}
