# THC Order Tracker — Phase 1 (GitHub Pages)

A **local-first** order-management website for ARK: Survival Ascended traders. No server, account, database, or bot required.

## Publish to GitHub Pages

1. Extract the ZIP.
2. In GitHub, create a repository (e.g. `thc-order-tracker`).
3. Upload **`index.html`, `style.css`, `app.js`, `README.md`** to the repository root. Commit changes.
4. Go to **Settings → Pages → Build and deployment**.
5. Select **Deploy from a branch**, branch **main**, folder **/(root)**, then Save.
6. Open the published `https://USERNAME.github.io/thc-order-tracker/` URL after deployment finishes.

**Do not upload any JSON backups** to a public GitHub repository. They may contain customer details.

## How to use

- **Orders:** Manually add/edit customer, payment, date, status and creatures. Creature line format: `Name, male count, female count, optional female count`.
- **Import:** Paste a Discord order, parse it, review/edit the result, and import. Also supports screenshot upload or clipboard image using browser-based OCR.
- **Production:** Assign a creature to Egg, Embryo, or Unverified (the site never guesses); track collected male/female quantities or use Collected all.
- **Fulfillment:** Allocate complete orders using available collected stock, release allocation, and update statuses. Inventory cannot be reserved twice.
- **Backup:** Export a JSON backup or restore one. Each browser/device has its own workspace.

## Privacy and limitations

- New installations start **empty**. No customer data is included in the site package.
- Data is stored in **localStorage**, not a central database. It normally survives closing the browser but not clearing site data. It does **not** sync between devices. Back up regularly.
- Existing v1 prototype localStorage data from the **same website origin** is migrated on first use. If moving to a different GitHub Pages URL, export/import a backup.
- Screenshot OCR uses **Tesseract.js 5** downloaded from jsDelivr. It requires internet on first use and is less accurate with crowded Discord screenshots; verify all results. OCR recognition runs in the browser, not through a hosted image-reading API.
- The parser supports common `Pair`, `Paire`, `Pair +1F`, `Name`, `Payment`, and `Name, M, F` formats. It does **not** reliably interpret every free-form order or complex multi-post screenshot; review imported text.
- Creature reproduction categories are **not verified** against ARK Wiki; set them manually.
- This is a static, publicly accessible website, **not** a Discord OAuth app. Browser-local data is not public by default, but anyone with access to the same unlocked device/browser profile can see it.
- Order allocation represents reservation, not delivery. Marking an order completed archives it from active totals; physical stock consumption is not modeled separately.

## Suggested acceptance test

1. Add an order with `Basilisk, 1, 2` and `Snow Owl, 1, 1`.
2. Assign creature categories in Production → Unverified.
3. Use Collected all for both creatures.
4. Allocate the order under Fulfillment and verify it says Fully allocated.
5. Export a backup, reload the page, and verify data persists.
6. Import the backup into a different browser and verify its independent workspace.
