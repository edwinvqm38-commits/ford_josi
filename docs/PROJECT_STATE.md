# Estado del proyecto (v4.2)
- Web: `index.html` (~6000 líneas). Clases: `ELM327`, `FusionModel`/`SimTransport` (simulador), `UsbTransport`, `BleTransport`, `Trip`/`GpsTrip`, `Analyzer`. Vistas: viewLive/viewLiveGps, viewTrips, viewRoutes, viewDiag, viewSettings. Persistencia en localStorage (`ecodrive.*`); sync Drive opcional.
- Android: Capacitor 6 (`app/`), plugin `JosiVoicePlugin` + `VoiceService`. CI en `.github/workflows/apk.yml`.
- Sin verificar en dispositivo: OBD2 real, GPS real, APK. OBD2 por BLE/USB solo en Chrome; en el APK falta plugin Bluetooth nativo.
- No existen: temas, editor de tableros, 3D, niveles de animación, i18n.
## Bloque 1 (hecho)
- `allowClearDtc` (defecto false): oculta «Borrar códigos» y `clearDTCs()` devuelve false; interruptor en Ajustes. No se sincroniza con Drive.
- Consola de diagnóstico limitada a comandos de consulta.
- `app/package.json` 4.2.0. Pruebas `tests/run.mjs`.
## Bloque 2 (hecho, parcial)
- Motor de temas por variables CSS (`body[data-theme]`): Estándar, Luxury (grafito/dorado), Sport (negro/rojo). Selector en Ajustes; `applyTheme()` no toca GPS/BT/OBD2. `theme` se sincroniza con Drive.
- Colores azules fijos del CSS pasaron a `--acc`/`--accent`; JS usa `C.accent` y `ACC_RGB`.
- Vistas previas: `docs/preview-*.png` (simulador, 1024×600).
- NO hecho aún: fondo/iluminación ambiental configurable, mapas Leaflet y colores semánticos sin tema.
## Bloque 3 (hecho)
- (Reemplazado en Bloque 6) Jerarquía del cockpit: Velocidad y RPM de ancho completo. Con simulación activa se conserva la distribución anterior (falta espacio).
- Tipografía por tema (Luxury ligera/espaciada; Sport pesada/mayúsculas).
- Animaciones: ajuste `anim` (off/standard/premium) vía `body[data-anim]`; `Fx.reduced()` respeta «off» y movimiento reducido; clase `body.driving` (>5 km/h) apaga animaciones decorativas. Los valores reales no se animan desde cero ni se retrasan.
- Pendiente: count-up/barras/líneas animadas en gráficas, skeletons, Spring; vertical y 4:3 sin revisar.
## Bloque 4 (hecho)
- Matriz de tamaños `node tests/layout.mjs [carpeta] [sim]`: 960×540, 1024×600, 1280×720, 1280×800, 1024×768, 1366×768, 1920×1200, 2560×1080, 800×1280, 600×1024, 768×1024. Detecta scroll horizontal, elementos fuera de pantalla y texto de tarjetas desbordado. Estado: sin hallazgos en modo real ni simulación.
- Correcciones: tarjetas pequeñas del cockpit (≥1001 px) sin recorte; vertical 641–1000 px: tarjetas en 3×2, auto de Josi sin recortar, más alto para instrumentos; en simulación a 1280×720 sin recorte.
- Pendiente: pestañas en alturas ≤560 px (960×540) se ven poco pulidas; pestañas Viajes/Rutas/Diagnóstico/Ajustes solo revisadas por el detector automático en el cockpit, no visualmente; modo GPS (`viewLiveGps`) no revisado a otros tamaños.
## Bloque 5 (hecho)
- Gráficas Chart.js con `chartAnim()`: off = sin animar; estándar = 450 ms; premium = 900 ms y línea que se dibuja punto a punto. Sin animar al conducir ni con movimiento reducido.
- Ya existía: dígitos animados (number-flow) en lecturas, barras con transición.
- Medición `node tests/perf.mjs` (Chromium headless de escritorio; CPU 1× y 4× emulada; 1024×600, simulador).
- Pendiente: skeleton/shimmer, spring, count-up en tarjetas de estadísticas, plugin Bluetooth nativo, i18n, pestañas distintas de En vivo.
## Bloque 6 (hecho)
- Cuadro digital (≥1001 px, sin panel de simulación): Velocidad y RPM son diales circulares de 270° (`::before` con conic-gradient y propiedad registrada `--f`, animada con transición; `--tone` da el color por umbral). Columnas 27/33/40.
- Iluminación ambiental (`S.ambient`: off/soft/strong, defecto soft): `#ambient` con luz de borde del color del tema; se pone roja si la velocidad supera `S.speedLimit`.
- <1001 px (horizontal pequeño y vertical) conserva tarjetas con barra.
## Bloque 7 (hecho)
- Escala en los diales (`dialSVG`): marcas cada 10 km/h y 500 rpm, números cada 40 km/h y 2000 rpm (solo si alto ≥740 px), zona roja de RPM desde 5500. Velocidad convertida a la unidad elegida.
- El panel del simulador ahora flota (≥1001 px y alto ≥561): el cockpit se ve igual con y sin simulación.
- Pendiente: diales en <1001 px y vertical; auto 3D; fondo configurable; editor.
