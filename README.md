# Josi · EcoDrive Fusion

App web para tablet Android que lee el auto (Ford Fusion SE 2018 2.0 EcoBoost) por OBD2 con un adaptador ELM327 USB o BLE, y ayuda a manejar gastando menos gasolina. Incluye a Josi, copiloto de voz.

Abrir en Chrome: https://edwinvqm38-commits.github.io/ford_josi/

Los viajes, lugares y claves se guardan solo en la tablet; este repositorio contiene únicamente la app.

## App Android (APK)
`app/` contiene el contenedor Capacitor + plugin nativo de voz (Vosk, sin conexión) y servicio en primer plano.
GitHub Actions (`.github/workflows/apk.yml`) compila y publica `josi.apk` en *Releases* en cada cambio.
Instalación: descargar el APK en la tablet y permitir "instalar apps desconocidas".
Aviso: Web Bluetooth/USB (ELM327) no existe en el WebView de Android; para OBD2 real en el APK falta un plugin Bluetooth nativo.
