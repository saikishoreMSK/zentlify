// One-time migration: rewrite product image URLs from http:// to https://.
//
// WHY: existing products were saved with http:// Cloudinary URLs, which browsers
// block as "mixed content" on the live https site. Cloudinary serves the same
// asset over https, so we just upgrade the protocol.
//
// USAGE (from the project root):
//   Dry run (shows changes, writes nothing):
//     node scripts/migrate-image-urls.mjs
//   Apply the changes:
//     node scripts/migrate-image-urls.mjs --apply
//
// Requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY
// in .env.local (this script loads that file itself).

import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// --- Minimal .env.local loader (no external deps) -------------------------
function loadEnvLocal() {
  let raw;
  try {
    raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  } catch {
    console.error("Could not read .env.local in the project root.");
    process.exit(1);
  }
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let value = m[2].trim();
    // Strip a single layer of surrounding quotes.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(m[1] in process.env)) process.env[m[1]] = value;
  }
}

loadEnvLocal();

const apply = process.argv.includes("--apply");

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error(
    "Missing Firebase Admin credentials. Add FIREBASE_PROJECT_ID, " +
      "FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to .env.local."
  );
  process.exit(1);
}

initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore();

async function run() {
  console.log(
    apply ? "APPLYING changes...\n" : "DRY RUN (no writes). Use --apply to save.\n"
  );

  const snapshot = await db.collection("products").get();
  let toFix = 0;
  let batch = db.batch();
  let batchCount = 0;

  for (const doc of snapshot.docs) {
    const image = doc.data().image;
    if (typeof image === "string" && image.startsWith("http://")) {
      const next = "https://" + image.slice("http://".length);
      toFix++;
      console.log(`  ${doc.id}\n    - ${image}\n    + ${next}`);
      if (apply) {
        batch.update(doc.ref, { image: next });
        batchCount++;
        // Firestore batches are capped at 500 writes.
        if (batchCount === 450) {
          await batch.commit();
          batch = db.batch();
          batchCount = 0;
        }
      }
    }
  }

  if (apply && batchCount > 0) await batch.commit();

  console.log(
    `\nDone. ${toFix} product(s) ${apply ? "updated" : "would be updated"} ` +
      `out of ${snapshot.size} total.`
  );
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
