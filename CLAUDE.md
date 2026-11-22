# Josi Ford — instrucciones permanentes
- App existente (no reescribir): `index.html` único (JS puro, Canvas/SVG) + contenedor Capacitor en `app/` (voz Vosk nativa).
- Estado y plan: `docs/PROJECT_STATE.md`, `docs/ROADMAP.md`, `docs/DECISIONS.md`, `docs/TEST_STATUS.md`. Leerlos antes de explorar el código.
- Ahorro: Sonnet por defecto; Opus solo con autorización (plugin Bluetooth nativo, arquitectura). Búsquedas dirigidas con grep/lecturas parciales; `index.html` pesa 1 MB (base64 en líneas ~911 y ~1406: no imprimirlas).
- OBD2: solo consulta (`ELM327.isReadOnly`). Borrado de DTC desactivado por defecto (`S.allowClearDtc`). Nada de escritura a ECU.
- Trabajar en la rama de la sesión; no fusionar a main ni desplegar sin permiso. No exponer claves.
- Pruebas: `node tests/run.mjs` (Chromium/Playwright).
