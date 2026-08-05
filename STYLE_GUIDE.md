# Malcolm Gordon — Site Style Guide
_Reference this document for all future pages, collateral, and brand assets on malgordon.com._

## Concept
**"The Ledger."** Malcolm's career reads like a trading register — a former derivatives
trader and corporate actions officer turned growth marketer and startup builder. The
site's visual language borrows from trading terminals and financial ledgers: monospace
numerals, tick-mark dots, dark ink backgrounds, and a restrained gold/teal accent pair
standing in for "up" and "operating" signals.

Every asset — page, image, icon — should feel like it belongs in the same ledger.

---

## Color palette

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0F141B` | Primary background (dark mode) |
| `--bg-alt` | `#141B24` | Secondary background / rings |
| `--card` | `#19212B` | Card surfaces |
| `--card-hi` | `#1F2833` | Card hover state |
| `--rule` | `#2A3441` | Borders, dividers |
| `--ink` | `#ECE7D8` | Primary text (dark mode) |
| `--ink-dim` | `#B7BCC4` | Secondary text |
| `--muted` | `#7C8494` | Tertiary / meta text |
| `--gold` | `#C9A227` | Primary accent — ventures, links, CTAs |
| `--gold-dim` | `#8A7220` | Gold borders / low-emphasis gold |
| `--teal` | `#3E8C7C` | Secondary accent — roles, operating positions |
| `--teal-dim` | `#2A5F54` | Teal borders |
| `--rust` | `#B5502F` | Reserved — warnings / rare emphasis only |

**Light mode** swaps to a parchment palette (`--bg:#F4F0E4`, `--ink:#211F19`, `--gold:#9C7811`,
`--teal:#2B6D5E`) — never pure white/black. See `style.css` `[data-theme="light"]`.

Gold = something built (ventures). Teal = a role held. Muted grey = mentoring/facilitation.
Keep this mapping consistent everywhere a tick or tag appears.

---

## Typography

| Role | Font | Notes |
|---|---|---|
| Display / headlines | **Fraunces** (serif, wght 400–600) | Headlines, names, section titles |
| Body | **IBM Plex Sans** | Paragraphs, nav, UI copy |
| Numerals / meta / ticker | **IBM Plex Mono** | Dates, tags, labels, eyebrows — always uppercase + letter-spaced for labels |

Loaded via Google Fonts in `style.css`. For raster assets where webfonts aren't available
(OG images, favicons), the closest system fallback is **DejaVu Serif Bold** for display
and **DejaVu Sans Mono** for meta text — used in `/assets` generation scripts.

Headline sizing uses `clamp()` for fluid scaling; body stays 16px base, 1.6 line-height.

---

## The ledger motif (signature element)
- Vertical rule + tick-dot per entry, exactly as used in the homepage timeline.
- Dot color = gold (venture) / teal (role) / outline-only muted (mentor).
- Dates in monospace, small caps labels (`VENTURE`, `ROLE`, `MENTOR`) in a bordered pill.
- Reuse this dot-and-rule idea in any future timeline, roadmap, or changelog content.

## Tags / buttons
- Pill-shaped, monospace, 13px, border + text in one accent color, transparent-ish fill.
- Skills → teal. Outcomes/highlights → gold. Neutral/status → muted grey.
- Never mix more than the three tag colors above.

## Cards
- `--card` background, 1px `--rule` border, 3px radius (not fully rounded — this is a
  ledger, not a bubbly consumer app).
- Hover: border shifts to `--gold-dim`, background lifts to `--card-hi`, `translateY(-2px)`.

## Buttons / links
- Primary CTA: outlined in gold, gold text, fills solid gold with dark text on hover.
- Never use filled gold as a resting state — gold is an accent, not a background color.

## Spacing & shape
- Base radius: **3px** for cards/buttons, **50%** only for avatars/dots — no in-between
  "rounded corners" softness. Sharp ledger, soft only where it's literally a human face.
- Section rhythm: 60px vertical padding, 1px `--rule` dividers between sections.
- Max content width: 880px, centered.

## Imagery
- Headshots: circular, full head with clear headroom, neutral background, minimal color
  grading (avoid heavy filters — the DejaVu/Fraunces pairing already carries the tone).
- No stock photography, no gradients-as-hero-images. If a section needs a visual and
  there's no real photo, use the ledger/tick motif instead of decorative imagery.

## Voice
- Direct, factual, outcome-first. Bullet points over paragraphs where possible.
- No superlatives without a number backing them up ("grew to ~100k views", not "huge growth").

---

## Asset inventory (generated from this guide)
- `/favicon.svg`, `/favicon-32.png`, `/favicon-16.png`, `/apple-touch-icon.png`, `/favicon.ico`
- `/assets/social-share.png` — 1200×630, used for both Open Graph and Twitter Card
- Meta title / description / keywords — set per-page in each HTML `<head>`, homepage is
  the canonical version others should match in tone

**Any new page, image, or social asset should pull its colors, type, and motif straight
from this document — don't introduce new accent colors, fonts, or corner-radius values.**
