---
title: Pantalla negra tras iniciar sesión
date: 2026-10-20
lang: es
description: Solución a la pantalla negra tras iniciar sesión, CachyOS y Plasma KDE
tags:
  - teknologi
translationOf: svart-skarm-efter-login-keychain
sourceHash: 1a8437ec016185a1d1e9e154b40132ce9b064940e9e95244c4240a0075c0f95e
aiTranslated: true
translationModel: gemini-3.1-flash-lite
translatedAt: 2026-10-20T19:13:27.155Z
---
Durante un par de meses he tenido un problema en el que la pantalla se queda negra después de introducir mi contraseña. Al cabo de un tiempo, descubrí que pulsar Enter soluciona el problema y el escritorio se carga. Busqué durante mucho tiempo una solución permanente, pero ni Google ni las búsquedas con IA encontraron el fallo.

Resulta que era Keychain el que enviaba un aviso invisible para pulsar Enter. No tenía ni idea de que eso pudiera ser un problema.

Fue el agente CLI de Cursor el que finalmente resolvió el error. Gracias por ello. A continuación, una breve explicación de Cursor.

## Causa

Plasma ejecuta fish como shell de inicio de sesión antes de que el compositor esté activo. En `~/.config/fish/config.fish` tenía:

```fish
if status is-login
    keychain --eval id_ed25519 | source
end
```

Keychain 3 espera entonces con el aviso *"Press Enter to run ssh-add in this terminal"* (Pulsa Enter para ejecutar ssh-add en este terminal), invisible en una VT negra. Por eso parecía que se quedaba colgado hasta que pulsabas Enter.

## Solución

Deja de ejecutar keychain durante el inicio de la sesión/DM. Cambia a `ssh-agent` de usuario de systemd y carga la clave después:

1. Activa `ssh-agent.socket` (usuario).
2. Añade `SSH_AUTH_SOCK=${XDG_RUNTIME_DIR}/ssh-agent.socket` en `~/.config/environment.d/`.
3. Un servicio oneshot `ssh-add-id.service` que ejecute `ssh-add` en `~/.ssh/id_ed25519` (la mía no tenía frase de contraseña).
4. Elimina el bloque de keychain de `config.fish`.

La clave SSH se sigue cargando, pero ya no bloquea la sesión de Wayland.

**Versión corta:** no ejecutes avisos interactivos en shells de inicio de sesión que Plasma arranca antes de que la pantalla esté disponible.
