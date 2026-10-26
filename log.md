# Country Book — log

15 words a sentence. Living doc. Next holds open features, in build order, numbered by the round each would be. Bugs live in `bug.md`. Rounds holds every round, newest first.

## Next

- 3. Photo fit and caption check. Each photo shows its main subject in the frame. Frames may grow taller. An AI also checks each photo matches its caption. Known weak shots include the Vanuatu coconut crab. — found, 2026-10-26
- 4. Shrink the print PDF. The print-grade PDF is about 188 MB. A smaller version is easier to share. — found, 2026-10-26

## Rounds

### Round 2 — rewrite the book for a 7-year-old

Status: kept
Branch: round-2-rewrite, from main
Try: open 5 country pages on a computer; read them in English, then Vietnamese; read each myth box; open How to Read, Glossary, and World Records; read one country page on a phone
Built: all 201 English country pages rewritten in short, plain sentences, about a fifth fewer words; hard words explained where they appear; every myth box teaches something new; How to Read, Glossary, and World Records rewritten in English and Vietnamese; Lexend font, left-aligned text
Bugs: old fact errors fixed (China population, Colombia bird, Cuba literacy, South Africa 12 languages, Nigeria economy, Darius post, Germany, Greenland, Africa desert, and about 40 more the rewrite corrected)
Risk: none

Result: Merged at the user's call, without the final checks. Tests pass. Screen fit: 183 of 201 pages pass, none overflow, 18 timed out unchecked. Print fit not checked. No browser walk or screenshots. Vietnamese country text unchanged, except Myanmar, Kenya, Brazil and a few fact fixes.
Learned: Agents trade facts and hard words for length caps; a blind judge caught 6 of 15 pages with unexplained words. Test output must print full failure lists, or agents report clean when they are not. Give each parallel agent its own scratch folder.

### Round 1 — small fixes: drop French, open pictures, zoom where you point

Status: kept
Branch: round-1-small-fixes, from main
Try: open the book on a computer; scroll the mouse wheel over a photo near a corner, and that spot stays under the cursor; scroll back out, and the page re-centres; click any photo, flag, cover, or quiz picture, and it fills the screen; click anywhere or press Esc to close it; on a tablet, pinch on a spot, and that spot stays under your fingers; the bottom bar now offers EN and VI only
Built: pictures open full-screen with one tap or click; mouse-wheel and pinch zoom grow from where you point; French edition removed (files, build, and deploy); myth lines no longer show doubled quote marks
Bugs: doubled quote marks around 120 myth lines (found and fixed this round)
Risk: none

Result: Shipped. Pictures open full-screen, zoom follows the pointer, French is gone.
Learned: Full-bleed photos under shading layers need pointer-events none to be tappable. The page checkers time out about 1 in 14 loads; re-run the failures alone.

### Round 0 — everything built before autoloop

Status: kept
Branch: main
Try: open https://anhtrinh919.github.io/country-book/; flip to Vietnamese; open /country-book/fr/
Built: 201 country spreads in five layouts; cover, passport, world map, 17 quizzes, back pages; Vietnamese toggle and French young-reader edition; A3 PDF builder; overflow checks
Bugs: none
Risk: none

Result: Live on GitHub Pages in English, Vietnamese, and French, as of 2026-06-12.
Learned: Fix overflow in the shared page code, not per country. Check photos by eye or vision, never by filename.
