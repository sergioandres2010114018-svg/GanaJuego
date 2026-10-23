// Navegación y pantallas de la app
(() => {
  const $ = s => document.querySelector(s);
  const pantalla = $("#pantalla");
  const pesos = n => "$" + Math.round(n * CONFIG.valorMonedaPesos).toLocaleString("es-CO");

  document.title = CONFIG.nombreApp;

  function actualizarSaldo() { $("#saldo").textContent = "🪙 " + Datos.monedas.toLocaleString("es-CO"); }

  function aviso(txt) {
    const a = $("#aviso");
    a.textContent = txt; a.classList.add("ver");
    clearTimeout(aviso.t); aviso.t = setTimeout(() => a.classList.remove("ver"), 2200);
  }

  function cabecera(titulo, atras) {
    $("#titulo").textContent = titulo;
    $("#btnAtras").classList.toggle("oculto", !atras);
  }

  function marcarMenu(nombre) {
    document.querySelectorAll(".menu button").forEach(b => b.classList.toggle("activo", b.dataset.ir === nombre));
  }

  const limpio = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const firma = () => `<p class="firma">Creada por <b>${limpio(CONFIG.creador)}</b></p>`;

  // ---------- Pantalla: iniciar sesión / registrarse ----------
  function login(modo = "entrar") {
    document.body.classList.add("sinSesion");
    const reg = modo === "registro";
    pantalla.innerHTML = `
      <div class="login">
        <div class="logo">🎮</div>
        <h2>${limpio(CONFIG.nombreApp)}</h2>
        <p class="gris">${reg ? "Crea tu cuenta y empieza a ganar" : "Juega, gana y cobra"}</p>
        <div class="caja">
          ${reg ? `
            <label>Nombre completo</label>
            <input id="lNombre" placeholder="Tu nombre" autocomplete="name">
            <label>Celular</label>
            <input id="lTel" inputmode="numeric" placeholder="3001234567">` : ""}
          <label>Usuario</label>
          <input id="lUser" placeholder="usuario" autocapitalize="none" autocomplete="username">
          <label>Contraseña</label>
          <input id="lPass" type="password" placeholder="••••••" autocomplete="${reg ? "new-password" : "current-password"}">
          ${reg ? `<label class="check"><input type="checkbox" id="lEdad"> Soy mayor de 18 años</label>` : ""}
          <button class="btn" id="lOk">${reg ? "Crear cuenta" : "Entrar"}</button>
          <button class="btn sec" id="lCambio">${reg ? "Ya tengo cuenta" : "Crear cuenta nueva"}</button>
        </div>
        ${firma()}
      </div>`;

    $("#lCambio").onclick = () => login(reg ? "entrar" : "registro");
    $("#lOk").onclick = () => {
      const u = $("#lUser").value.trim();
      const p = $("#lPass").value;
      let error;
      if (reg) {
        const nombre = $("#lNombre").value.trim();
        const tel = $("#lTel").value.trim();
        if (!nombre) return aviso("Escribe tu nombre");
        if (!/^[a-zA-Z0-9_.]{3,20}$/.test(u)) return aviso("Usuario: 3 a 20 letras o números");
        if (p.length < 4) return aviso("Contraseña de al menos 4 caracteres");
        if (!$("#lEdad").checked) return aviso("Debes ser mayor de 18 años");
        error = Datos.registrar(nombre, tel, u, p);
      } else {
        if (!u || !p) return aviso("Escribe usuario y contraseña");
        error = Datos.entrar(u, p);
      }
      if (error) return aviso(error);
      empezar();
      aviso(reg ? "¡Cuenta creada! 🎉" : "¡Bienvenido de nuevo! 👋");
    };
  }

  function empezar() {
    document.body.classList.remove("sinSesion");
    actualizarSaldo();
    inicio();
  }

  // ---------- Pantalla: lista de juegos ----------
  function inicio() {
    cabecera(CONFIG.nombreApp, false); marcarMenu("inicio");
    const pct = Math.min(100, Datos.ganadoHoy / CONFIG.limiteDiario * 100);
    pantalla.innerHTML = `
      <div class="banner">
        <h2>¡Gana y cobra! 🏆</h2>
        <p>Cada victoria te da monedas. Junta ${CONFIG.retiroMinimo.toLocaleString("es-CO")} y pide tu retiro.</p>
        <div class="barraProgreso"><div style="width:${pct}%"></div></div>
        <p style="margin-top:6px;font-size:12px">Hoy: ${Datos.ganadoHoy} / ${CONFIG.limiteDiario} monedas</p>
      </div>
      <div class="grilla">
        ${Object.entries(Juegos).map(([id, j]) => `
          <button class="juego" data-j="${id}">
            <span class="icono">${j.icono}</span>
            <b>${j.nombre}</b>
            <small>+${CONFIG.premios[id]} 🪙 por victoria</small>
          </button>`).join("")}
      </div>`;
    pantalla.querySelectorAll(".juego").forEach(b => b.onclick = () => abrirJuego(b.dataset.j));
  }

  // ---------- Pantalla: un juego ----------
  function abrirJuego(id) {
    const j = Juegos[id];
    cabecera(j.nombre, true);
    pantalla.innerHTML = `<div id="zona"></div>`;
    j.iniciar($("#zona"), () => {
      const g = Datos.ganar(CONFIG.premios[id], "Victoria en " + j.nombre);
      actualizarSaldo();
      aviso(g > 0 ? `+${g} 🪙 ¡Bien hecho!` : "Llegaste al límite de hoy 🕛");
    });
  }

  // ---------- Pantalla: billetera ----------
  function billetera() {
    cabecera("Billetera", false); marcarMenu("billetera");
    const puede = Datos.monedas >= CONFIG.retiroMinimo;
    const falta = Math.max(0, CONFIG.retiroMinimo - Datos.monedas);
    pantalla.innerHTML = `
      <div class="caja" style="text-align:center">
        <p class="gris">Tu saldo</p>
        <div class="grande">🪙 ${Datos.monedas.toLocaleString("es-CO")}</div>
        <p class="gris">Equivale a ${pesos(Datos.monedas)} COP</p>
      </div>
      <div class="caja">
        <h3>Retirar dinero</h3>
        <p class="gris">${puede ? "¡Ya puedes retirar!" : `Te faltan ${falta.toLocaleString("es-CO")} monedas para retirar.`}</p>
        <label>Método de pago</label>
        <select id="metodo"><option>Nequi</option><option>Daviplata</option><option>Bancolombia</option></select>
        <label>Número de cuenta o celular</label>
        <input id="cuenta" inputmode="numeric" placeholder="3001234567" value="${Datos.perfil.telefono || ""}">
        <button class="btn" id="retirar" ${puede ? "" : "disabled"}>Solicitar retiro de ${pesos(Datos.monedas)}</button>
      </div>
      <div class="caja historial">
        <h3>Movimientos</h3>
        ${Datos.historial.length ? Datos.historial.map(h => `
          <div><span>${h.txt}<br><span class="gris">${new Date(h.t).toLocaleString("es-CO")}</span></span>
          <span class="${h.m > 0 ? "mas" : "menos"}">${h.m > 0 ? "+" : ""}${h.m}</span></div>`).join("")
          : `<p class="gris">Aún no tienes movimientos. ¡Ve a jugar!</p>`}
      </div>`;

    $("#retirar").onclick = () => {
      const cuenta = $("#cuenta").value.trim();
      const metodo = $("#metodo").value;
      if (cuenta.length < 7) return aviso("Escribe tu número de cuenta");
      const cant = Datos.monedas;
      const nombre = (Datos.perfil.nombre || "Sin nombre") + " (@" + Datos.usuario + ")";
      const msg = `Hola, quiero retirar mis ganancias de ${CONFIG.nombreApp}.%0A` +
        `Nombre: ${encodeURIComponent(nombre)}%0A` +
        `Monedas: ${cant}%0AValor: ${encodeURIComponent(pesos(cant))} COP%0A` +
        `Método: ${encodeURIComponent(metodo)}%0ACuenta: ${encodeURIComponent(cuenta)}`;
      Datos.retirar(cant, `Retiro solicitado (${metodo})`);
      actualizarSaldo();
      billetera();
      aviso("Abriendo WhatsApp… ✅");
      // Abre WhatsApp con el mensaje listo para enviarte
      window.location.href = `https://wa.me/${CONFIG.whatsappDueno}?text=${msg}`;
    };
  }

  // ---------- Pantalla: perfil ----------
  function perfil() {
    cabecera("Perfil", false); marcarMenu("perfil");
    const p = Datos.perfil;
    pantalla.innerHTML = `
      <div class="caja" style="text-align:center">
        <div style="font-size:64px">👤</div>
        <h3>${limpio(p.nombre || "Jugador")}</h3>
        <p class="gris">@${limpio(Datos.usuario)} · 🏆 ${Datos.victorias} victorias</p>
      </div>
      <div class="caja">
        <label>Tu nombre</label>
        <input id="nombre" value="${limpio(p.nombre || "")}" placeholder="¿Cómo te llamas?">
        <label>Tu celular (Nequi / Daviplata)</label>
        <input id="tel" inputmode="numeric" value="${limpio(p.telefono || "")}" placeholder="3001234567">
        <button class="btn" id="guardar">Guardar</button>
      </div>
      <div class="caja">
        <h3>Reglas</h3>
        <p class="gris">• Ganas monedas solo cuando ganas una partida.<br>
        • Máximo ${CONFIG.limiteDiario} monedas por día.<br>
        • Retiro mínimo: ${CONFIG.retiroMinimo.toLocaleString("es-CO")} monedas (${pesos(CONFIG.retiroMinimo)} COP).<br>
        • Los retiros se revisan y pagan manualmente.<br>
        • Solo para mayores de 18 años.</p>
      </div>
      <button class="btn salir" id="salir">Cerrar sesión</button>
      ${firma()}`;
    $("#salir").onclick = () => { Datos.salir(); login(); };
    $("#guardar").onclick = () => {
      Datos.guardarPerfil($("#nombre").value.trim(), $("#tel").value.trim());
      aviso("Perfil guardado ✅"); perfil();
    };
  }

  const rutas = { inicio, billetera, perfil };
  document.querySelectorAll(".menu button").forEach(b => b.onclick = () => rutas[b.dataset.ir]());
  $("#btnAtras").onclick = inicio;

  // Botón "atrás" del celular Android
  document.addEventListener("backbutton", () => { if (Datos.usuario) inicio(); });

  // Si ya había iniciado sesión antes, entra directo; si no, muestra el login
  if (Datos.restaurarSesion()) empezar(); else login();
})();
