<<<<<<< HEAD
# Skynet — Internship Finder (CLI)

A command-line tool that pulls internship listings and ranks them against
**weighted (1–10) keyword filters** — major/field, specialization, company
type, and location — instead of the binary yes/no filters most job boards
give you.

## Why not scrape LinkedIn directly?

LinkedIn actively blocks scrapers and it's against their Terms of Service —
building on top of it would break quickly and isn't something worth
building a class project around. Instead, this pulls from
[SimplifyJobs/Summer2027-Internships](https://github.com/SimplifyJobs/Summer2027-Internships),
a public JSON dataset that's community-maintained, updated daily, and
*meant* to be fetched programmatically (no login, no scraping, no ToS
issue). Right now it's strongest for software/data/quant/hardware roles —
it likely won't have great mining-engineering coverage yet. The fix is to
add more sources (see below), not to scrape LinkedIn.

## Setup

```bash
npm install
npm start
```

You'll be prompted for each filter category: enter comma-separated
keywords (or leave blank to skip a category), then rate 1–10 how much it
should matter. Example for the blasting-vs-plant-design problem you
described:

- **Major/field:** `mining engineering, geological engineering` → weight `8`
- **Specialization:** `blasting, drill and blast` → weight `10`
- **Company type:** `mining, metals, coal` → weight `6`
- **Location:** `Nevada, Arizona` → weight `4`

Results print as a ranked table with score, title, company, location, which
keywords matched, and the direct apply link.

## How the scoring works (`src/filters.js`)

Each listing's score is:

```
score = Σ (category_weight × fraction_of_that_category's_keywords_matched)
```

So a listing doesn't need to match *every* keyword in a category to rank —
partial matches count, but full matches count more. Categories left blank
are skipped entirely. Listings matching nothing across all categories are
dropped by default.

## Project structure

```
src/
  index.js            CLI entry point — prompts, orchestration
  filters.js           scoring/ranking logic (source-agnostic)
  display.js           table rendering
  sources/
    simplify.js         SimplifyJobs dataset adapter
```

## Adding a new source (this is the important part for your mining-engineering use case)

Every source module just needs one `async fetchInternships()` function
that returns objects shaped like:

```js
{
  title: "...",
  company: "...",
  location: "...",
  url: "...",
  datePosted: Date | null,
  tags: "lowercase text used for keyword matching",
  source: "human-readable source name",
}
```

Then in `src/index.js`, fetch from multiple sources and merge the arrays
before calling `rankInternships()`. Good next sources to add for
mining-specific coverage:

- **Company career-page APIs** for major mining employers (Rio Tinto,
  Freeport-McMoRan, Barrick, Newmont, etc.) — most large companies run on
  Workday, Greenhouse, or SmartRecruiters, all of which expose JSON
  endpoints you can hit directly (no scraping needed).
- **[Adzuna's job search API](https://developer.adzuna.com/)** — free tier,
  supports keyword + category search, good general-purpose fallback.
- **University career center feeds**, if your school's Handshake or
  similar system exposes an export/API.

## Known limitations to mention in your writeup

- Matching is currently keyword-based (`tags.includes(keyword)`), not
  semantic — "blasting" won't match "blast design" unless you list both.
  A logical next step is fuzzy matching or embedding-based similarity.
- Coverage depends entirely on the underlying dataset(s); the "internships
  never respond" and "hard to find niche roles" problems you described are
  really data-coverage problems, which is why multi-source support is
  built into the architecture from the start.
=======
# Skynet
>>>>>>> 5b481f39c47e1073eec5b40df691c1fed30bac13
