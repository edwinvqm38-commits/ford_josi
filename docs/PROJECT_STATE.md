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
- Jerarquía del cockpit (≥1001 px, sin panel simulación): Velocidad y RPM ocupan ancho completo y cifras grandes. Con simulación activa se conserva la distribución anterior (falta espacio).
- Tipografía por tema (Luxury ligera/espaciada; Sport pesada/mayúsculas).
- Animaciones: ajuste `anim` (off/standard/premium) vía `body[data-anim]`; `Fx.reduced()` respeta «off» y movimiento reducido; clase `body.driving` (>5 km/h) apaga animaciones decorativas. Los valores reales no se animan desde cero ni se retrasan.
- Pendiente: count-up/barras/líneas animadas en gráficas, skeletons, Spring; vertical y 4:3 sin revisar.
