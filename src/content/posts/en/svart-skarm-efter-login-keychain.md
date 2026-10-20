---
title: Black screen after login
date: 2026-10-20
lang: en
description: Solution for black screen after login, CachyOS & Plasma KDE
tags:
  - teknologi
translationOf: svart-skarm-efter-login-keychain
sourceHash: 1a8437ec016185a1d1e9e154b40132ce9b064940e9e95244c4240a0075c0f95e
aiTranslated: true
translationModel: gemini-3.1-flash-lite
translatedAt: 2026-10-20T19:13:24.794Z
---
For a couple of months, I've had an issue where the screen goes black after I enter my password. After a while, I figured out that pressing Enter solves the problem, and the desktop loads. I searched for a long time for a permanent solution, but neither Google nor AI search found the error.

It turns out it was Keychain that was sending an invisible prompt to press Enter. Not something I even had a clue could be a problem.

It was the Cursor agent CLI that finally solved the bug. Thanks for that. Below is a write-up from Cursor.

## Cause

Plasma runs fish as a login shell before the compositor is up. In `~/.config/fish/config.fish` there was:

```fish
if status is-login
    keychain --eval id_ed25519 | source
end
```

Keychain 3 then waits with the prompt *"Press Enter to run ssh-add in this terminal"* — invisible on a black VT. That's why it felt like a hang until you pressed Enter.

## Solution

Stop running keychain during DM/session start. Switch to systemd user `ssh-agent` and load the key afterwards:

1. Enable `ssh-agent.socket` (user).
2. Add `SSH_AUTH_SOCK=${XDG_RUNTIME_DIR}/ssh-agent.socket` to `~/.config/environment.d/`.
3. A oneshot `ssh-add-id.service` that runs `ssh-add` on `~/.ssh/id_ed25519` (mine had no passphrase).
4. Remove the keychain block from `config.fish`.

The SSH key is still loaded, but no longer blocks the Wayland session.

**Short version:** do not run interactive prompts in login shells that Plasma starts before the screen exists.
