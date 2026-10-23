# 🎮 GanaJuegos

App de juegos para Android donde los usuarios ganan monedas cada vez que ganan una partida y pueden pedir el retiro de su dinero por Nequi, Daviplata o Bancolombia.

**Juegos incluidos:** Triqui, Memoria, Adivina el número y Piedra-Papel-Tijera.

**Inicio de sesión:** cada jugador crea su cuenta (nombre, celular, usuario y contraseña) y la app recuerda su sesión. Cada cuenta tiene su propio saldo.

*Creada por Bexy Otálora.*

---

## ✏️ Paso 1 — Pon tu número de WhatsApp

Abre el archivo `www/js/config.js` y cambia `573000000000` por tu número (con el 57 adelante, sin espacios ni +).
Ahí también puedes cambiar cuántas monedas da cada juego, el valor de cada moneda, el mínimo de retiro y el límite diario.

## 📤 Paso 2 — Sube la carpeta a GitHub

1. Entra a https://github.com e inicia sesión (o crea una cuenta gratis).
2. Arriba a la derecha toca **+** → **New repository**.
3. Nombre: `GanaJuegos`. Déjalo **Public** (las cuentas gratis tienen minutos ilimitados así). Toca **Create repository**.
4. Toca el enlace **uploading an existing file**.
5. Abre la carpeta `GanaJuegos` en tu computador, **selecciona todo lo que hay adentro** y arrástralo a la página.
6. Abajo toca **Commit changes**.

> ⚠️ **Importante:** la carpeta `.github` a veces no se sube porque está oculta.
> Revisa en tu repositorio si aparece la carpeta `.github`. Si **no** aparece:
> 1. Toca **Add file** → **Create new file**.
> 2. En el nombre escribe exactamente: `.github/workflows/generar-apk.yml`
> 3. Copia y pega el contenido del archivo `generar-apk.yml` que viene en esta carpeta.
> 4. Toca **Commit changes**.

## 📱 Paso 3 — Descarga tu APK

1. En tu repositorio entra a la pestaña **Actions**.
2. Verás "Generar APK" ejecutándose (círculo amarillo). Espera unos 5–8 minutos hasta que salga ✅ verde.
3. Toca esa ejecución, baja hasta **Artifacts** y descarga **GanaJuegos-APK**.
4. Descomprime el .zip: adentro está `GanaJuegos.apk`.
5. Pásalo a tu celular e instálalo (Android te pedirá permitir "instalar apps de origen desconocido").

Cada vez que cambies algo en GitHub (por ejemplo `config.js`), se genera un APK nuevo automáticamente.
Si quieres generarlo a mano: **Actions** → **Generar APK** → **Run workflow**.

---

## 💰 Cómo funcionan los pagos

1. El usuario gana partidas y junta monedas.
2. Cuando llega al mínimo, toca **Solicitar retiro** en la Billetera.
3. Se abre WhatsApp con un mensaje para ti con su nombre, monto, método y cuenta.
4. Tú le haces la transferencia manualmente.

### Antes de lanzarla al público, ten en cuenta:

- **Las cuentas y las monedas se guardan en el celular del usuario** (no en internet): si desinstala la app o cambia de celular, pierde su cuenta. Una persona con conocimientos técnicos podría modificarlas. Por eso los retiros son manuales: revisa antes de pagar y empieza con montos pequeños. Para algo más seguro se necesita un servidor (por ejemplo Firebase) que guarde los saldos.
- **¿De dónde sale el dinero?** Normalmente estas apps se financian con anuncios (Google AdMob). Si pagas más de lo que ganas con anuncios, pierdes dinero. Ajusta `valorMonedaPesos` y `limiteDiario` en `config.js` para controlarlo.
- **Legal:** en Colombia, los juegos que entregan premios en dinero pueden requerir autorización de **Coljuegos**. Consulta con un abogado antes de publicarla. Para la Play Store, Google también tiene reglas especiales para apps con premios en dinero real.
- El APK que se genera es de **prueba (debug)**: sirve para instalar y compartir, pero para subirlo a Play Store se necesita una versión firmada.
