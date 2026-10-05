# Skynet Internship Finder

Authors: Colin Michael (rcolinmichael), Connor Williams (williamsconnor24), Stephen Hull (stephenhull)

The project is designed to help students in the search for internships. Currently Handshake is the main way for finding internships with Virginia Tech. The issue with Handshake is that it does not have search functions to help students find the exact internships they are looking for. Our group (Skynet) is setting out to make a website that will have greater features than what is currently available. We will find these features by surveying students on how they perceive the current system and what they would want to see added. Before this becomes a website we will be developing a prototype. This prototype will be a terminal based design that will emulate the options users will have with our potential service.  

## Features

* 🔎 Search and collect internship listings
* 🎯 Funnel-style filtering
* 📍 Location-specific filtering
* 🏢 Company/industry keyword filtering
* 🎓 Major-related keyword filtering
* 🔤 Custom include/exclude keyword filtering
* 📄 Paginated results
* 🔗 Full clickable application URLs

---

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
Page 1 of 3

1. Software Engineering Intern
   Company — Location
   https://...

...

20. Software Engineering Intern
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
