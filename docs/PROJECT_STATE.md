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
- NO hecho aún: reorganización del cockpit (jerarquía/distribución), tipografías por tema, fondo/iluminación ambiental configurable, mapas Leaflet y colores semánticos (verde/ámbar/rojo) sin tema.
