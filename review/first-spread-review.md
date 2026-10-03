# First Spread Review

Reviewer: First Spread Reviewer SubAgent
Scope: Cover.tsx + Article.tsx (Hero/Lead/Summary/colophon) + sections/01-opening.tsx
Checked against: cover.md 5-item self-check, tufte.md theme profile, plan.md
Build: `npm run build` PASS — `tsc --noEmit` clean, `vite build` ✓ 34 modules transformed, single-file `dist/index.html` produced.

Overall verdict: **PASS with 1 must-fix.** One hard-constraint violation (hardcoded pixel font-size in the cover SVG) plus a few minor issues. Everything else passes.

---

## Checklist results (by appearance order)

### 1. Cover — 5-item self-check

| # | Item | Verdict | Evidence |
|---|------|---------|----------|
| 1.1 | 图文并茂 | **PASS** | Text layer: kicker `SKILL · LFS + BLFS · 9 步构建` + `<h1>TTL</h1>` + subtitle `TimeToLinux · 为你的硬件量身定制的 Linux 发行版` (lines 44–75). Visual body: 6-node compile pipeline SVG (CPU→toolchain→kernel→desktop→AI→out-of-box) with grid pattern + diagonal pipe (lines 79–185). Removing either layer still leaves the other intact. |
| 1.2 | 主题忠实（只用 --ra-\* token） | **FAIL** | See must-fix M1. All colors/borders/radii/margins correctly use `var(--ra-*)` with sensible fallbacks, BUT three SVG `<text>` labels hardcode `fontSize="18"` and one hardcodes `fontSize="20"` — these are absolute px font sizes, not tokens. |
| 1.3 | 内容忠实 | **PASS** | Pipeline literally encodes the thesis: `CPU · -march` (chip icon) → 工具链 → 内核 → 桌面 → AI 助手 → `开箱即用`. Reading the cover 5 seconds tells you: "recompile everything from the CPU instruction set up to a ready-to-use desktop." Matches Lead + §01 exactly. |
| 1.4 | 比例自适应 | **PASS** | Shell uses `aspectRatio: "3 / 4"` + `maxWidth: min(100%, 48rem, calc((100vh - 8rem)*3/4))` (line 15) — the exact formula cover.md prescribes. Top block `height: "38%"`, SVG `height: "62%"` (percentages). SVG `viewBox="0 0 1200 988"` + `preserveAspectRatio="xMidYMid meet"` scales proportionally; internal coords are viewBox-relative, not viewport-px. PDF: `break-after` handled by pdf-print-overrides.css C-segment. No absolute-px element positions. |
| 1.5 | 不与 Hero 重复 | **PASS** | Cover: kicker + `TTL` + `TimeToLinux · 为你的硬件量身定制的 Linux 发行版`. Hero: `TTL — TimeToLinux` / `现在正是切换到 Linux 的好时候` / meta (来源·类型). The cover subtitle ("为你的硬件量身定制") differs from the Hero subtitle ("现在正是切换到 Linux 的好时候"); the kicker is unique to the cover. Complementary, not duplicated. |

#### Special checks requested

- **SVG 编译流水线只用 --ra-\* token?** Mostly yes — every `stroke`/`fill` is `var(--ra-color-fg/accent/muted, ...)`, fonts are `var(--ra-font-body, inherit)`, weight is `var(--ra-font-weight-bold, 700)`. **Exception:** the four `fontSize="18"`/`fontSize="20"` attributes are hardcoded px (see M1).
- **SVG 里的 ⚙ emoji 是否符合 tufte「禁止 emoji 当装饰」?** **FAIL (minor).** Line 137 renders `⚙` as the toolchain node glyph. tufte.md 禁止项: "emoji / 图标当装饰". Here the gear carries semantic meaning (it *is* the toolchain node), so it's borderline — but a single U+2699 emoji sitting in an otherwise pure vector diagram breaks the data-ink aesthetic and renders inconsistently across platforms/fonts. Replace with a drawn glyph (e.g. a small cog outline, or simply the text "GCC" / a circle-with-gears path) to stay consistent with the rest of the line-drawn nodes.
- **Summary 用 points 数组（已修复）?** Confirmed against `reacticle/dist/components/insight/Summary.d.ts`: `points?: string[]` is the correct prop. Article.tsx line 21 passes `points={[...]}`. ✅ Fixed correctly.
- **Quote 用 who prop（已修复）?** Confirmed against `reacticle/dist/components/insight/Quote.d.ts`: `who?: string` is the correct prop. 01-opening.tsx line 19 uses `<Quote who="TTL 核心理念">`. ✅ Fixed correctly.

### 2. 首屏像文章，不像 landing page

**PASS.** Structure is `Hero → Lead → Summary(TL;DR) → §01 prose`. No CTA buttons, no feature cards, no "Get Started" band, no marketing gradient. The Lead (Article.tsx 14–18) frames the problem in the first sentence: "TTL 不是一个现成的发行版，而是一套指导 AI agent 帮你从零构建专属 Linux 的方法论" — the reader knows immediately what the article solves (and what it is *not*). The TL;DR gives a 30-second digest for skimmers. This reads as a publication opening, not a product landing page.

Minor: Hero `subtitle="现在正是切换到 Linux 的好时候"` is slightly promotional in register versus the rest of the restrained technical tone. Acceptable, but if tightening the editorial voice, consider a more neutral subtitle (e.g. "从 CPU 指令集到桌面的全链路重新编译"). Not a blocker.

### 3. 第一节阅读节奏 / Raw 服务理解 / 移动端

**PASS.**
- **Prose-first**: §01 is dominated by flowing paragraphs (4 substantial `<p>` blocks + an ordered list + one Aside). Components (Quote, Aside, ol) serve the prose, not the reverse. Good density for a concept-introduction section; plan.md correctly marked "是否需要 Raw：否" and the section honors that.
- **Reading rhythm**: Opening contrast (off-the-shelf distros vs TTL) → definition of "专属于你" → pull-quote (core idea) → methodology grounding (LFS+BLFS) → 四条支柱 subsection → Aside (what it's *not*) → forward-looking close. Clear arc, no dead air.
- **Mobile**: No fixed-width containers, no horizontal-only layout; the section is standard stacked prose. The wide layout column is the only width concern and it's a deliberate plan decision (§4). On mobile the `Article` container collapses to single-column; nothing in §01 forces overflow.

### 4. 主题气质（tufte）+ 版式宽度

**PASS (with the M1 caveat).**
- **tufte fit**: Content is hard technical/engineering (LFS/BLFS, kernel compile, drivers, CI) — tufte's data-ink, restrained, low-decoration register is the right match (plan.md Theme section agrees). §01 and the cover are line-drawn, low-saturation, no cards/shadows/gradients. The one blemish is the ⚙ emoji (decorative break) and the hardcoded font sizes (M1).
- **Wide layout**: `Article width="wide"` (Article.tsx line 8). Justified by plan.md: "大量表格 + 代码块，需要更宽阅读列." Wide is appropriate here because the bulk of the article (Sections 02–09) is table/code-heavy. For the first spread specifically (prose + one SVG), wide is harmless. ✅

### 5. 代码可构建

**PASS.** Re-ran `npm run build`: `tsc --noEmit` clean, `vite build` ✓ 34 modules transformed, single-file `dist/index.html` (1,965 kB) emitted with inlined JS+CSS. No type errors, no build warnings beyond the benign Node undici proxy notice.

---

## Must-fix (必须修复项)

### M1 — Cover SVG 写死像素字号（违反封面硬约束 3 · 主题忠实）

**Location:** `article/Cover.tsx`
- Line 129: `<text ... fontSize="18" ...>` — "CPU · -march" label
- Line 138: `<text ... fontSize="18" ...>` — "工具链" label
- Line 148: `<text ... fontSize="18" ...>` — "内核" label
- Line 158: `<text ... fontSize="18" ...>` — "桌面" label
- Line 168: `<text ... fontSize="18" ...>` — "AI 助手" label
- Line 177: `<text ... fontSize="20" ...>` — "开箱即用" label

**Why it fails:** cover.md 硬约束 3 forbids "写死像素字号". These six `fontSize` attributes are absolute px values baked into the SVG. They don't respond to theme font-scale changes, and on a different theme with a different base font size the labels will be mis-proportioned relative to the node glyphs.

**Fix (rewrite suggestion):** Drive the label sizes from tokens. Two clean options:
1. **Preferred** — use `style={{ fontSize: "var(--ra-text-xs, 0.72rem)" }}` (or `--ra-text-sm`) on each `<text>` via a `style` attribute instead of the `fontSize` presentation attribute. SVG `<text>` respects CSS `font-size`.
2. Alternative — use `em` units relative to the SVG root font: set `style={{ fontSize: "1em" }}` on the `<svg>` (inheriting the theme body size) and use `fontSize="1em"` / `"1.1em"` on labels. This keeps everything proportional to the theme's base size.

Either way, remove the numeric `fontSize="18"` / `fontSize="20"` literals.

---

## Should-fix (建议修复 · 非阻塞)

### S1 — ⚙ emoji 违反 tufte「禁止 emoji 当装饰」
`article/Cover.tsx` line 137. The gear is semantically the toolchain node, but it's the only non-vector element in an otherwise pure line drawing and renders inconsistently cross-platform. **Suggestion:** draw a small cog outline (a circle + 6–8 short radial teeth as `<line>`/`<path>`), or replace with a minimal text glyph like "GCC" in the muted color, keeping the node visually consistent with the chip/kernel/desktop/AI neighbors.

### S2 — Hero 副标题语气略促销
`article/Article.tsx` line 11: `subtitle="现在正是切换到 Linux 的好时候"`. Slightly marketing-toned against the otherwise restrained technical register. **Suggestion (optional):** swap to a thesis-aligned subtitle such as "从 CPU 指令集到桌面的全链路重新编译" to tighten the editorial voice. Not a blocker.

### S3 — 封面 kicker 与 §01 信息轻微重叠
Cover kicker `SKILL · LFS + BLFS · 9 步构建` (line 53) echoes the "SKILL" framing repeated in §01. Minor; acceptable as a hook. No action required unless you want maximal separation between cover-hook and body.

---

## Verified-fixed (确认已修复)

- **Summary → `points` 数组**: matches `SummaryProps.points?: string[]`. ✅
- **Quote → `who` prop**: matches `QuoteProps.who?: string`. ✅
- **§01 prose-first**: sufficient body text, components serve the prose. ✅

---

## Bottom line

The first spread is structurally sound and on-theme. **One hard constraint is violated (M1: hardcoded px font sizes in the cover SVG)** — fix that before Checkpoint 2. The ⚙ emoji (S1) is the only other real tufte-register break; worth fixing for polish. Everything else passes.
