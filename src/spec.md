# Specification

## Summary
**Goal:** Make the web app accessible only via an unlisted (link-only) URL hash secret, enforce the same gate on backend APIs, add a share-link UI, and add a minimal Chrome Extension wrapper package.

**Planned changes:**
- Add a frontend access gate that reads a secret from the URL hash, stores it in sessionStorage for the session, clears it from the visible URL, and shows a locked screen when missing/invalid.
- Require the access secret on all backend methods used by the app workflow (upload/metadata/status and storage blob methods reachable from the frontend) and reject requests when missing/invalid, surfacing a clear English error in the UI.
- Add a small “Share access link” UI that lets an unlocked user copy a link containing the required hash secret, and guides the user if no valid secret is available.
- Add a minimal Manifest V3 Chrome Extension package (manifest, icons, action to open the deployed app URL) plus a short README describing how to load unpacked, zip, and publish later.

**User-visible outcome:** Visiting the app without a valid access link shows a locked screen; opening a valid unlisted link unlocks the normal workflow, users can copy a shareable access link, and a basic Chrome Extension package is available in-repo to open the app.
