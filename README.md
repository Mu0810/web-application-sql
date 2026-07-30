# SQLi Lab

**An immersive, defensive-first learning experience for Advanced SQL Injection and Data Store Attacks.**

SQLi Lab transforms the supplied 93-page Hakin9 workshop into a searchable, interactive field guide. It combines the complete four-module learning path with a safe query-boundary simulator, persistent chapter tracking, bookmarks, Mission Control telemetry, and a 12-question defensive checkpoint.

> [!IMPORTANT]
> This project is for education and explicitly authorized testing only. Practice in isolated environments that you own or have permission to assess. Never test public or third-party systems without written authorization.

## Highlights

- Complete page map for the supplied pages 9–93
- Four modules and 23 trackable field chapters
- SQL, XML/XXE, JavaScript, XPath, LDAP, and NoSQL coverage
- Blind, second-order, time-based, encoding, automation, and file-boundary concepts
- Parameterization, canonicalization, least privilege, validation, and sensitive-data defenses
- Browser-only query-boundary simulator with no database connection
- Course-wide search with keyboard navigation
- Persistent chapter completion, bookmarks, checklist, quiz score, and resume location
- Mission Control readiness score and module telemetry
- Twelve-question defensive checkpoint with explanations and ranking
- Downloadable local progress record
- Responsive, accessible, reduced-motion-aware interface
- Zero third-party runtime dependencies and no external asset requests

## Quick start

### Requirements

- Node.js 18 or newer
- A modern browser

### Run locally

```bash
git clone https://github.com/Mu0810/web-application-sql.git
cd web-application-sql
git checkout kiro/interactive-course-site
npm start
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

No `npm install` step is required. The server uses only Node.js built-in modules. You can also run it directly:

```bash
node serve.js
```


### Why use the local server?

Opening `index.html` directly works for previewing, but a local HTTP origin gives browser storage a stable scope. Use `npm start` when you want completion, bookmarks, quiz state, and resume location to persist reliably.

Set a different port when needed:

```bash
PORT=4173 npm start
```

## Learning experience

### Mission Control

Mission Control converts the field guide into a self-paced learning record:

- Mark each chapter complete
- Bookmark chapters for later review
- See completion telemetry for each module
- Resume at the next incomplete chapter
- Track visited modules and defensive readiness
- Export a plain-text progress summary
- Reset all local learning data explicitly

The readiness score is derived from chapter completion, defensive-checkpoint performance, and the pre-release security checklist. It is a self-assessment, not a certification.

### Defensive checkpoint

The 12-question checkpoint covers:

- Interpreter boundaries and parameterized queries
- Second-order and blind injection behavior
- Canonicalization and XML parser safety
- XPath, LDAP, and NoSQL distinctions
- Least privilege and safe query structure
- Authorized automation and sensitive-data handling

Questions include answer explanations, persistent progress, best-score tracking, ranking, keyboard-accessible controls, and prevention of incomplete submission.

### Safe simulator

The simulator visualizes the difference between string concatenation and value binding. It runs entirely in the browser and does not connect to a database, execute SQL, scan a network, or transmit entered values.

## Course map

| Section | Supplied pages | Coverage |
| --- | ---: | --- |
| Pre-course | 9–13 | Web applications, SQL foundations, data stores, isolated DVWA lab guidance |
| Module 1 | 14–33 | SQL and data stores, injection types, statement contexts, `UNION`, fingerprinting |
| Module 2 | 34–55 | Extraction, filters, second order, blind and time-based behavior, file boundaries |
| Module 3 | 56–74 | Encoding, automation, XPath, blind XPath, and LDAP |
| Module 4 | 75–93 | NoSQL, validation, parameterization, least privilege, canonicalization, sensitive data |


## Navigation and keyboard controls

| Action | Control |
| --- | --- |
| Open course search | `Ctrl + K`, `Cmd + K`, or `/` |
| Navigate search results | `Arrow Up` / `Arrow Down` |
| Open selected result | `Enter` |
| Close search | `Esc` |
| Move between SQL statement tabs | `Arrow Left` / `Arrow Right` |
| Jump to first or last statement tab | `Home` / `End` |

Every chapter heading receives a stable deep link. The interface also includes a skip link, semantic landmarks, visible keyboard focus, ARIA tab relationships, labelled search results, and reduced-motion support.

## Local data and privacy

SQLi Lab has no account system and no analytics. Learning state is stored in the browser under keys prefixed with `sqli-`, including:

- Completed chapters and bookmarks
- Visited modules and resume location
- Defensive checklist selections
- Checkpoint answers, position, completion state, and best score
- Unlocked learning achievements

Mission Control reports whether storage is persistent for the current origin. If browser storage is unavailable, the app falls back to temporary in-memory state for the current tab. Use **Reset local data** to remove SQLi Lab state, or **Export progress** to download a plain-text self-assessment.

## Project structure

```text
.
├── index.html            # Complete course markup and semantic structure
├── package.json          # Project metadata and local-server commands
├── serve.js              # Zero-dependency static localhost server
├── css/
│   ├── style.css         # Base design system and responsive layout
│   ├── animations.css    # Reveal, typing, and reduced-motion rules
│   └── upgrade.css       # Immersive UI, Mission Control, and checkpoint
└── js/
    ├── main.js           # Navigation, search, simulator, tabs, and checklist
    └── learning.js       # Completion, bookmarks, readiness, quiz, and export
```

The project intentionally uses plain HTML, CSS, and JavaScript. There is no bundler, framework, runtime package, database, or remote API.

## Development

1. Start the site with `npm start`.
2. Edit the source files directly.
3. Reload the browser; server responses use `Cache-Control: no-store`.
4. Test both desktop and mobile widths.
5. Confirm keyboard navigation and reduced-motion behavior.


Useful verification commands:

```bash
node --check js/main.js
node --check js/learning.js
node --check serve.js
```

A practical browser review should confirm:

- All four modules and five page ranges are present
- No horizontal overflow at desktop and mobile widths
- Search, tabs, copy controls, simulator, bookmarks, and checklist work
- Completion and quiz state survive a reload on the same origin
- The checkpoint cannot finish until all 12 questions are answered
- Keyboard focus remains visible and meaningful
- No unexpected external network resources are requested

## Static deployment

The application can be deployed to any static host because all learning behavior runs in the browser. Publish `index.html`, `css/`, and `js/` together at the same path. `serve.js` is only a local development convenience.

Browser progress is scoped to the deployed origin. Moving the site to a different domain, protocol, or port creates a separate local learning record.

## Security model

- The simulator never executes submitted SQL.
- No database, authentication service, analytics service, or remote API is present.
- User-entered simulator values stay in the current page.
- Progress export is generated locally with a browser `Blob`.
- Course examples are explanatory and must be used only in authorized laboratories.

This educational interface is not a vulnerability scanner, penetration-testing framework, security certification, or substitute for current vendor documentation and professional review.

## Source acknowledgement

The curriculum is an independent interactive adaptation of the supplied publication **Web Application Hacking: Advanced SQL Injection and Data Store Attacks**, Hakin9 Workshops, Vol. 12, No. 03, credited in the source to Thomas Sermpinis.

The supplied publication states that some original videos and exercises are not included in the ebook. This project covers the supplied written material but does not claim to reproduce omitted course assets. The interface summarizes and reorganizes the material rather than serving as a verbatim replacement for the publication.

Several tools, links, defaults, APIs, and implementation examples in the historical source may now be outdated. Use maintained OWASP, datastore-vendor, language, and framework documentation when applying defensive guidance to current systems.

## Contributing

Contributions should preserve the project's core constraints:

1. Keep the experience defensive-first and authorization-aware.
2. Do not add real exploitation targets, telemetry, or hidden network calls.
3. Preserve the complete course map and accessible keyboard flow.
4. Use dependency-free browser APIs unless a dependency is clearly justified.
5. Test responsive behavior, persistence, and reduced-motion support.
6. Keep examples generic and avoid real credentials or personal information.

Current development is available on the `kiro/interactive-course-site` branch.
