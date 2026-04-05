# AGENTS

## Project Design Context

This project is a multi-user personal wardrobe product, not a single-user demo.

Core product tone:
- warm
- elevated
- silky

The interface should feel like a personal wardrobe studio and archive.

It must not feel like:
- an AI-generated template
- an ecommerce promo page
- a tech dashboard
- a streetwear brand site
- an overly girly visual system

Dark mode should be supported in the future.

## Non-Negotiable UI Rules

1. Every page must occupy the full available screen.
2. Layouts must remain stable across viewport changes, zoom changes, and different screen sizes.
3. Each module must use the presentation model that best matches its content:
   - fixed or toolbar-like for short, high-frequency controls
   - local vertical scroll for long lists and histories
   - horizontal rails or grids for image-heavy collections
   - split panels for studio-like workspaces
   - segmented or step-based flows for long forms
4. Do not default to whole-page scrolling. Choose scrolling behavior based on content responsibility.
5. Same-role typography, buttons, spacing rhythm, and motion language must stay consistent across the site.
6. Layout stability and readability take priority over decoration.

## Impeccable Workflow

Start with `.impeccable.md` before major UI work.

Project-specific page workflows:
- Home: `critique -> arrange -> typeset -> polish -> audit`
- Wardrobe: `critique -> arrange -> clarify -> adapt -> polish`
- Add garment: `clarify -> harden -> adapt -> polish`
- Outfit: `critique -> arrange -> adapt -> polish`
- Pre-release: `audit -> harden -> polish`

## Execution Standard

For any UI optimization task:
1. Confirm user, tone, and anti-references from `.impeccable.md`.
2. Break the page into modules before changing styles.
3. Decide the right presentation model for each module before visual refinement.
4. Run the page workflow in order.
5. Verify full-screen occupation, responsive stability, and content-fit rendering before considering the task complete.
