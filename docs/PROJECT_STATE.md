# Estado del proyecto (v4.2)
- Web: `index.html` (~6000 líneas). Clases: `ELM327`, `FusionModel`/`SimTransport` (simulador), `UsbTransport`, `BleTransport`, `Trip`/`GpsTrip`, `Analyzer`. Vistas: viewLive/viewLiveGps, viewTrips, viewRoutes, viewDiag, viewSettings. Persistencia en localStorage (`ecodrive.*`); sync Drive opcional.
- Android: Capacitor 6 (`app/`), plugin `JosiVoicePlugin` + `VoiceService`. CI en `.github/workflows/apk.yml`.
- Sin verificar en dispositivo: OBD2 real, GPS real, APK. OBD2 por BLE/USB solo en Chrome; en el APK falta plugin Bluetooth nativo.
- No existen: temas, editor de tableros, 3D, niveles de animación, i18n.
## Bloque 1 (hecho)
- `allowClearDtc` (defecto false): oculta «Borrar códigos» y `clearDTCs()` devuelve false; interruptor en Ajustes. No se sincroniza con Drive.
- Consola de diagnóstico limitada a comandos de consulta.
- `app/package.json` 4.2.0. Pruebas `tests/run.mjs`.
