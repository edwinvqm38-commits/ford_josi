# Pruebas
`node tests/run.mjs` (Chromium headless, 1024×600): 23/23 OK, sin errores de consola. Cubre decodeDTC, lista de comandos de solo consulta, bloqueo/permiso de clearDTCs, valor por defecto, aplicación de los 3 temas y que el cambio de tema no reemplaza el transporte, niveles de animación y modo conducción. Capturas visuales revisadas a mano en 1024×600 y 1280×800 (simulador).
Pendiente en tablet real: Bluetooth/USB ELM327, GPS, APK, rendimiento (FPS/RAM no medidos).

`node tests/layout.mjs`: 11 tamaños × (real, simulación) sin hallazgos (solo pestaña En vivo, Chromium de escritorio, sin dispositivo físico). El detector no sustituye una revisión visual en tablet.

## Rendimiento (tests/perf.mjs, una sola corrida, Chromium headless de escritorio, 1024×600, cockpit con simulador)
| CPU | Anim. | Carga (ms) | FPS | Peor frame (ms) |
|---|---|---|---|---|
| 1× | off / estándar / premium | 190 / 145 / 134 | 60.3 / 60.3 / 60.5 | 17 / 17 / 17 |
| 4× emulado | off / estándar / premium | 616 / 693 / 640 | 59.9 / 55.1 / 58.2 | 33 / 50 / 34 |
Montón JS ≈ 9.5 MB (valor aproximado del navegador). `index.html` = 1.01 MB. Variación entre corridas no medida; la emulación de CPU no representa la GPU ni el WebView de una tablet. Falta medir en tu tablet.

Bloque 7: `node tests/layout.mjs` 11 tamaños en modo real y en simulación (panel flotante): sin hallazgos del detector.
