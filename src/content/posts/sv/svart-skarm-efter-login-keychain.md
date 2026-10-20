---
title: Svart skärm efter inloggning
date: 2026-10-20
description: Lösning på svart skärm efter inloggning, CachyOS & Plasma KDE
tags:
  - teknologi
---

Har ett par månader haft ett problem där skärmen blir svart efter att jag skrivit in mitt lösenord. Efter ett tag kom jag på att trycka på Enter löser problemet, och skrivbordet laddas. Letade länge efter en permanent lösning, men varke Google eller AI-sök hittade felet.

Visar sig dock vara Keychain som skickade fram en osynlig prompt att trcka på Enter. Inte något som jag hade ens en aning om skulle kunna vara ett problem.

Det var Cursor agent cli som löste buggen till slut. Tack för det. Nedan är en write-up av Cursor.

## Orsak

Plasma kör fish som login-shell innan kompositorn är uppe. I `~/.config/fish/config.fish` fanns:

```fish
if status is-login
    keychain --eval id_ed25519 | source
end
```

Keychain 3 väntar då med prompten *"Press Enter to run ssh-add in this terminal"* — osynlig på en svart VT. Därför kändes det som en hang tills man tryckte Enter.

## Lösning

Sluta köra keychain under DM/session-start. Byt till systemd user `ssh-agent` och ladda nyckeln efteråt:

1. Aktivera `ssh-agent.socket` (user).
2. Lägg `SSH_AUTH_SOCK=${XDG_RUNTIME_DIR}/ssh-agent.socket` i `~/.config/environment.d/`.
3. En oneshot `ssh-add-id.service` som kör `ssh-add` på `~/.ssh/id_ed25519` (min hade ingen lösenfras).
4. Ta bort keychain-blocket från `config.fish`.

SSH-nyckeln laddas fortfarande, men blockerar inte längre Wayland-sessionen.

**Kort version:** kör inte interaktiva prompts i login-shells som Plasma startar innan skärmen finns.
