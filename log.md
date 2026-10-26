# Country Book — log

15 words a sentence. Living doc. Next holds open features, in build order, numbered by the round each would be. Bugs live in `bug.md`. Rounds holds every round, newest first.

## Next

- 2. Fact-check the authored countries. About 110 records were never checked against sources. — found, 2026-10-26
- 3. Photo check with vision. An AI compares each photo to its caption, then fixes the misses. Known weak shots include the Vanuatu coconut crab. — found, 2026-10-26
- 4. Shrink the print PDF. The print-grade PDF is about 188 MB. A smaller version is easier to share. — found, 2026-10-26

## Rounds

### Round 1 — small fixes: drop French, open pictures, zoom where you point

Status: building
Branch: round-1-small-fixes, from main
Try: desktop wheel-zoom over a corner photo keeps that spot under the cursor; tap any photo, flag, or cover to open it full-screen; tablet pinch zooms where the fingers are; the bottom bar shows EN / VI only
Bugs: none
Risk: none

### Round 0 — everything built before autoloop

Status: kept
Branch: main
Try: open https://anhtrinh919.github.io/country-book/; flip to Vietnamese; open /country-book/fr/
Built: 201 country spreads in five layouts; cover, passport, world map, 17 quizzes, back pages; Vietnamese toggle and French young-reader edition; A3 PDF builder; overflow checks
Bugs: none
Risk: none

Result: Live on GitHub Pages in English, Vietnamese, and French, as of 2026-06-12.
Learned: Fix overflow in the shared page code, not per country. Check photos by eye or vision, never by filename.
