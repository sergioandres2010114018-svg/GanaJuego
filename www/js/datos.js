// Cuentas de usuario y datos de cada jugador (se guardan en el teléfono).
const Datos = (() => {
  const CUENTAS = "ganajuegos_cuentas";
  const SESION = "ganajuegos_sesion";
  let usuario = null;
  let d = null;

  function hoy() { return new Date().toISOString().slice(0, 10); }
  function leer(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  // Convierte la contraseña en un código para no guardarla tal cual
  function cifrar(texto) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < texto.length; i++) {
      const c = texto.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16) + (h1 >>> 0).toString(16);
  }

  function abrir(u) {
    usuario = u;
    const cuenta = (leer(CUENTAS) || {})[u];
    d = leer("ganajuegos_datos_" + u) || {
      monedas: 0, historial: [], dia: hoy(), ganadoHoy: 0, victorias: 0,
      perfil: { nombre: cuenta ? cuenta.nombre : "", telefono: cuenta ? cuenta.telefono : "" }
    };
    escribir(SESION, u);
  }

  function guardar() { if (usuario) escribir("ganajuegos_datos_" + usuario, d); }

  function revisarDia() {
    if (d.dia !== hoy()) { d.dia = hoy(); d.ganadoHoy = 0; guardar(); }
  }

  return {
    // ---------- Cuentas ----------
    registrar(nombre, telefono, usuarioNuevo, clave) {
      const u = usuarioNuevo.toLowerCase();
      const cuentas = leer(CUENTAS) || {};
      if (cuentas[u]) return "Ese usuario ya existe";
      cuentas[u] = { nombre, telefono, clave: cifrar(u + clave) };
      escribir(CUENTAS, cuentas);
      abrir(u);
      return null;
    },
    entrar(usuarioIn, clave) {
      const u = usuarioIn.toLowerCase();
      const c = (leer(CUENTAS) || {})[u];
      if (!c || c.clave !== cifrar(u + clave)) return "Usuario o contraseña incorrectos";
      abrir(u);
      return null;
    },
    restaurarSesion() {
      const u = leer(SESION);
      if (u && (leer(CUENTAS) || {})[u]) { abrir(u); return true; }
      return false;
    },
    salir() { usuario = null; d = null; try { localStorage.removeItem(SESION); } catch (e) {} },
    get usuario() { return usuario; },

    // ---------- Datos del jugador ----------
    get monedas() { return d.monedas; },
    get historial() { return d.historial; },
    get perfil() { return d.perfil; },
    get victorias() { return d.victorias; },
    get ganadoHoy() { revisarDia(); return d.ganadoHoy; },

    // Suma monedas respetando el límite diario. Devuelve cuántas sumó.
    ganar(cantidad, motivo) {
      revisarDia();
      const disponible = Math.max(0, CONFIG.limiteDiario - d.ganadoHoy);
      const real = Math.min(cantidad, disponible);
      d.victorias++;
      if (real > 0) {
        d.monedas += real;
        d.ganadoHoy += real;
        d.historial.unshift({ t: Date.now(), m: real, txt: motivo });
        d.historial = d.historial.slice(0, 50);
      }
      guardar();
      return real;
    },

    retirar(cantidad, txt) {
      if (cantidad > d.monedas) return false;
      d.monedas -= cantidad;
      d.historial.unshift({ t: Date.now(), m: -cantidad, txt });
      guardar();
      return true;
    },

    guardarPerfil(nombre, telefono) {
      d.perfil = { nombre, telefono };
      guardar();
    }
  };
})();
