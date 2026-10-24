# THC Order Tracker — Development acceptance tests

This branch is isolated from the GitHub Pages production branch `main`.

## Existing data
- Preserve localStorage key `thc-phase1-v3` and version 3 backup compatibility unless a tested migration is added.
- Never include customer backup files in the public repository.
- Test on a separate browser profile or with a saved backup; do not use live orders as test fixtures.

## Fulfillment regression cases
1. Add an order with two lines `Basilisk, 1, 1` each; with stock 1M/1F the complete order must NOT be available.
2. With stock 2M/2F, allocate the order. No other order can allocate that stock.
3. Complete the allocated order. Stock becomes 0M/0F and its allocation is cleared.
4. Cancel an allocated order. Its reservation is released but stock remains unchanged.
5. Export a backup, reload, and restore. Orders, allocations, and stock must match.

## Discord import acceptance cases (not yet implemented)
- Two separate posts by ZOUFRIYA948 remain two orders.
- Recognize nine separate posts from the supplied Discord Markdown batch.
- Resolve common aliases using the ASA creature registry plus THC overrides.
- Handle `Paire +1F`, `all pair alpha`, and conditional `+1F if available`.
- Keep post date, customer, trader, payment, notes, and original source text.
- Flag unresolved names; do not silently invent creatures.
- Do not merge distinct posts merely because customer and quantities match.

## External data provenance (pending integration)
- Creature names, reproduction, and variants: cadon/ARKStatsExtractor, `ARKBreedingStats/json/values/ASA-values.json`.
- Aliases: cadon/ARKStatsExtractor, `ARKBreedingStats/json/aliases.json`.
- Artwork: arkutils/species-images, `images/`.
- Both upstream repositories advertise MIT licensing; retain their applicable license notices when redistributing data/artwork.
- Record the source commit SHA when generating registry artifacts.

## Release gate
Do not merge into `main` until parser and stock tests pass and a local-storage backup/restore round-trip has been verified.
