---
name: GitHub empty-repository publishing
description: Reliable connector-based publishing pattern for an empty GitHub repository.
---

When publishing a complete project through the GitHub connector to an empty repository, create a first file commit through the Contents API before using the Git Database API for blobs, trees, and commits.

**Why:** GitHub returns HTTP 409 (“Git Repository is empty”) for Git Database blob creation until the repository has an initial commit.

**How to apply:** Seed a harmless tracked file on the intended default branch, then construct the complete tree as a commit whose parent is the seed commit and update that branch ref.