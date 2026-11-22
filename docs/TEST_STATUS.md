# Pruebas
`node tests/run.mjs` (Chromium headless, 1024×600): 15/15 OK, sin errores de consola. Cubre decodeDTC, lista de comandos de solo consulta, bloqueo/permiso de clearDTCs, valor por defecto, aplicación de los 3 temas y que el cambio de tema no reemplaza el transporte, niveles de animación y modo conducción. Capturas visuales revisadas a mano en 1024×600 y 1280×800 (simulador).
Pendiente en tablet real: Bluetooth/USB ELM327, GPS, APK, rendimiento (FPS/RAM no medidos).

`node tests/layout.mjs`: 11 tamaños × (real, simulación) sin hallazgos (solo pestaña En vivo, Chromium de escritorio, sin dispositivo físico). El detector no sustituye una revisión visual en tablet.
