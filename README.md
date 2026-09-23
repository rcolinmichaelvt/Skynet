# Internship Finder

A command-line internship search tool that collects internship listings and filters them through a customizable **funnel-style filtering system**.

Instead of assigning scores or rankings, each filter progressively narrows the pool of internships. Results can then be browsed through paginated terminal output with clickable application links.

## Features

* 🔎 Search and collect internship listings
* 🎯 Funnel-style filtering
* ✅ Require **all** included keywords to match
* ❌ Exclude listings containing **any** excluded keyword
* 📍 Location-specific filtering
* 🏢 Company/industry keyword filtering
* 🎓 Major-related keyword filtering
* 🔤 Custom include/exclude keyword filtering
* 📄 Paginated results
* ⌨️ Keyboard navigation between result pages
* 🔗 Full clickable application URLs
* 🖥️ Clean terminal interface
* 🧹 Clears the terminal when switching pages

---

## Filtering System

Internships are processed through filters sequentially.

Each filter receives the results from the previous filter and removes listings that don't satisfy its rules.

```text
All Listings
     │
     ▼
 Major Filter
     │
     ▼
 Company Type Filter
     │
     ▼
 Location Filter
     │
     ▼
 Include / Exclude Filter
     │
     ▼
 Final Results
```

### Include Keywords

Include keywords use **AND logic**.

For example:

```text
the, walt, disney, company
```

A listing must contain **all four keywords** to survive the filter:

```text
the       ✓
walt      ✓
disney    ✓
company   ✓
```

A listing containing only:

```text
walt disney company
```

would not pass because it is missing `the`.

### Exclude Keywords

Exclude keywords use **OR logic**.

For example:

```text
senior, manager, director
```

A listing is removed if it contains **any one** of those keywords.

```text
"Software Engineer"           → ✓ Keep
"Senior Software Engineer"    → ✗ Remove
"Engineering Manager"         → ✗ Remove
"Director of Engineering"     → ✗ Remove
```

This allows you to require multiple characteristics while easily removing unwanted positions.

---

## Example

Suppose you enter:

```text
Include:
the, walt, disney, company

Exclude:
senior, manager
```

A listing such as:

```text
Software Engineering Intern
The Walt Disney Company
```

passes the filter.

A listing such as:

```text
Senior Software Engineering Intern
The Walt Disney Company
```

is removed because it contains `senior`.

---

## Pagination

Results are displayed in pages based on the supplied `limit`.

For example:

```js
await displayResults(pool, appliedFilterLabels, 10);
```

If there are 47 results, the program displays:

```text
Page 1 of 5

1. Software Engineering Intern
   Company — Location
   https://...

...

10. Software Engineering Intern
    Company — Location
    https://...
```

Use the keyboard to navigate:

```text
n = next page
p = previous page
q = quit
```

The terminal is cleared whenever the page changes.

---

## Application Links

Application URLs are displayed as complete URLs rather than being placed inside a fixed-width table.

Example:

```text
1. Software Engineering Intern
   Disney — Orlando, FL
   https://example.com/jobs/software-engineering-intern
```

This allows supported terminals to recognize the URL as a clickable link.

---

## Project Structure

```text
src/
├── display.js
├── filters.js
└── ...
```

### `display.js`

Responsible for:

* Displaying applied filters
* Displaying internship results
* Pagination
* Keyboard navigation
* Terminal clearing
* Application URLs

### `filters.js`

Contains the filtering logic:

* Keyword parsing
* Include matching
* Exclude matching
* Major filtering
* Company type filtering
* Location filtering
* Custom include/exclude filtering

---

## Filtering API

### `applyKeywordFilter()`

Generic keyword filter used by the other filter functions.

```js
applyKeywordFilter(pool, {
  include: [],
  exclude: [],
  field: "tags"
});
```

Positive keywords must **all** match:

```js
include.every(...)
```

Negative keywords require only **one** match to exclude a listing:

```js
exclude.some(...)
```

### `applyMajorFilter()`

Filters based on major-related keywords.

```js
applyMajorFilter(pool, "computer science, software engineering");
```

### `applyCompanyTypeFilter()`

Filters based on company or industry keywords.

```js
applyCompanyTypeFilter(pool, "technology, software");
```

### `applyLocationFilter()`

Filters against the listing's location.

```js
applyLocationFilter(pool, "remote, virginia");
```

### `applyPlusMinusFilter()`

Provides free-form include/exclude filtering.

```js
applyPlusMinusFilter(
  pool,
  "software, engineering, intern",
  "senior, manager"
);
```

The above requires **all three** positive keywords while excluding listings containing **either** `senior` or `manager`.

---

## Keyword Format

Multiple keywords are entered as comma-separated values:

```text
software, engineering, intern
```

Keywords are automatically:

* Trimmed
* Converted to lowercase
* Empty values removed

Matching is currently performed using substring matching.

For example:

```text
engineer
```

can match:

```text
software engineer
engineering
engineered
```

---

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Then run the application using the project's configured npm script.

For example:

```bash
npm start
```

or:

```bash
node src/index.js
```

depending on the project's entry point.

---

## Dependencies

The CLI display currently uses:

* [`cli-table3`](https://www.npmjs.com/package/cli-table3)
* [`chalk`](https://www.npmjs.com/package/chalk)
* Node.js `readline`

Install them with:

```bash
npm install cli-table3 chalk
```

`readline` is included with Node.js and does not need to be installed separately.

---

## Design Philosophy

The filtering system intentionally does **not** use:

* Scores
* Weights
* Ranking algorithms
* Arbitrary relevance values

Instead, it uses a funnel approach:

```text
Broad Search
     ↓
Major
     ↓
Company Type
     ↓
Location
     ↓
Custom Keywords
     ↓
Final Internship Pool
```

Each step simply removes listings that don't satisfy the selected criteria.

This makes the results predictable and allows filters to be added or removed without introducing a hidden scoring system.

---

## Future Improvements

Potential additions include:

* [ ] Interactive filter editing
* [ ] Save filter presets
* [ ] Search history
* [ ] Duplicate listing detection
* [ ] More internship sources
* [ ] Automatic application tracking
* [ ] Saved internships
* [ ] Configurable result limits