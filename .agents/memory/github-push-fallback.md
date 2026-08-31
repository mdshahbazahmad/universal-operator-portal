---
name: GitHub push fallback
description: Repository push behavior when the shell HTTPS remote cannot authenticate.
---

When the shell Git remote rejects credentials, an attached GitHub integration can update repository refs through the authenticated GitHub API instead.

**Why:** The workspace's HTTPS remote may not receive or accept the credentials used by the connected GitHub account, while the connector remains authenticated.

**How to apply:** Confirm the working tree and target commit locally, then use the connected GitHub API for the requested repository operation rather than asking the user to paste a token.