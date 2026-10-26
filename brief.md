# Country Book — brief

15 words a sentence. Living doc: it states the product as it is today. Rewrite in place.

## What it is

A personal world atlas for Momo, age 7, from Vietnam. It covers 201 countries on six continents. The trip starts in Vietnam. Each country gets its own two-page spread. Each spread has a flag, facts, field notes, WOW facts, a phrasebook, and photos. Around the countries sit a cover, a personal passport, a map, quizzes, and back pages. One codebase makes two outputs: a web book and a printable A3 PDF. The web book works in English and Vietnamese. A simpler French edition serves young readers. The book is a gift that teaches a child the world.

## What good looks like

- "Momo opens the book and wants to read the next country."
- "Every page looks finished, like a real printed book."
- "The Vietnamese and French versions read as well as the English one."
- "I can print the PDF at a print shop with no fixes."

## Hard rules

Things that must be exact, or must never happen. Each one is code, with a test.

- No page ever clips its content (overflow = 0) — a cut-off page looks broken in print.
- Every photo matches its caption, and no image is offensive — one wrong image once showed a Nazi symbol.
- Every country file follows the shared format — the layouts assume it.
- Quiz answers in the Answer Key always match the quiz pages — a wrong key teaches wrong facts.
- The French link always shows French — the English app once took it over.
- All pictures load under the /country-book/ web address — broken images look broken.

## Not doing

- No user accounts or server — progress lives in each browser.
- No printed book ordering — the PDF goes to a print shop by hand.

## Settled choices

- Five rotating page layouts, with a colour palette per country — no region looks the same, round 0
- Real Wikimedia photos, stored in the repo — no image keys needed, round 0
- Pages are A3 spreads, 1588×1123 px — one size for web and print, round 0
- Hash links on the web — refresh never breaks on GitHub Pages, round 0
- The PDF is made from page images — half the size of Chrome's own PDF, round 0
- Vietnamese is a live switch; French is a separate young-reader build, round 0

## How to run

`npm run dev`, then open http://localhost:5173/country-book/.
French: `VITE_LANG=fr VITE_YOUNG=1 npx vite --port 5174`.
Page checks: `npm run check:overflow` and `npm run check:print`, with the dev server on.
PDF: `npm run build:pdf:all`, with the dev server on.

## How to ship

Push: origin (github.com/anhtrinh919/country-book), branch main
Deploy: a push to main runs GitHub Actions, which builds English and French
Live: https://anhtrinh919.github.io/country-book/ and https://anhtrinh919.github.io/country-book/fr/
