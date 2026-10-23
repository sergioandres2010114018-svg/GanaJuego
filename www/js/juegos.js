// Los 4 juegos. Cada uno dibuja dentro de "contenedor" y llama a alGanar() cuando el usuario gana.
const Juegos = {

  // ---------------- TRIQUI (Tres en raya) ----------------
  triqui: {
    nombre: "Triqui", icono: "⭕",
    iniciar(contenedor, alGanar) {
      let tablero, fin;
      const lineas = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      const ganador = t => {
        for (const [a,b,c] of lineas) if (t[a] && t[a] === t[b] && t[a] === t[c]) return t[a];
        return t.every(x => x) ? "empate" : null;
      };
      // La máquina: gana si puede, bloquea si debe, si no juega al azar (a veces se equivoca)
      const jugadaMaquina = () => {
        const libres = tablero.map((v,i) => v ? null : i).filter(v => v !== null);
        const prueba = (s) => libres.find(i => { const t = [...tablero]; t[i] = s; return ganador(t) === s; });
        let i = prueba("O");
        if (i === undefined && Math.random() < 0.8) i = prueba("X");
        if (i === undefined && !tablero[4] && Math.random() < 0.6) i = 4;
        if (i === undefined) i = libres[Math.floor(Math.random() * libres.length)];
        return i;
      };
      const dibujar = (msg) => {
        contenedor.innerHTML = `
          <div class="estado">${msg}</div>
          <div class="tablero">${tablero.map((v,i) => `<button class="celda ${v ? v.toLowerCase() : ""}" data-i="${i}">${v === "X" ? "✕" : v === "O" ? "◯" : ""}</button>`).join("")}</div>
          ${fin ? `<button class="btn sec" id="otra">Jugar otra vez</button>` : ""}`;
        contenedor.querySelectorAll(".celda").forEach(b => b.onclick = () => tocar(+b.dataset.i));
        const o = contenedor.querySelector("#otra"); if (o) o.onclick = nueva;
      };
      const revisar = () => {
        const g = ganador(tablero);
        if (!g) return false;
        fin = true;
        if (g === "X") { dibujar("¡Ganaste! 🎉"); alGanar(); }
        else if (g === "O") dibujar("Perdiste 😢");
        else dibujar("Empate 🤝");
        return true;
      };
      const tocar = (i) => {
        if (fin || tablero[i]) return;
        tablero[i] = "X";
        if (revisar()) return;
        tablero[jugadaMaquina()] = "O";
        if (revisar()) return;
        dibujar("Tu turno (✕)");
      };
      const nueva = () => { tablero = Array(9).fill(null); fin = false; dibujar("Tu turno (✕)"); };
      nueva();
    }
  },

  // ---------------- MEMORIA ----------------
  memoria: {
    nombre: "Memoria", icono: "🧠",
    iniciar(contenedor, alGanar) {
      const figuras = ["🍒","🍋","🍇","🍉","⭐","💎","🔔","🍀"];
      let cartas, abiertas, intentos, bloqueado, limite = 20;
      const dibujar = (msg) => {
        contenedor.innerHTML = `
          <div class="estado">${msg}</div>
          <div class="tablero memoria">${cartas.map((c,i) => `<button class="carta ${c.vista ? "vuelta" : ""} ${c.lista ? "lista" : ""}" data-i="${i}">${c.vista || c.lista ? c.f : "❔"}</button>`).join("")}</div>
          <button class="btn sec" id="otra">Nueva partida</button>`;
        contenedor.querySelectorAll(".carta").forEach(b => b.onclick = () => tocar(+b.dataset.i));
        contenedor.querySelector("#otra").onclick = nueva;
      };
      const restantes = () => `Intentos: ${intentos}/${limite}`;
      const tocar = (i) => {
        const c = cartas[i];
        if (bloqueado || c.vista || c.lista || intentos >= limite) return;
        c.vista = true; abiertas.push(c);
        if (abiertas.length === 2) {
          intentos++;
          const [a, b] = abiertas;
          if (a.f === b.f) {
            a.lista = b.lista = true; a.vista = b.vista = false; abiertas = [];
            if (cartas.every(x => x.lista)) { dibujar("¡Ganaste! 🎉"); alGanar(); return; }
          } else {
            bloqueado = true;
            setTimeout(() => {
              a.vista = b.vista = false; abiertas = []; bloqueado = false;
              dibujar(intentos >= limite ? "Se acabaron los intentos 😢" : restantes());
            }, 700);
          }
        }
        dibujar(intentos >= limite && !bloqueado ? "Se acabaron los intentos 😢" : restantes());
      };
      const nueva = () => {
        cartas = [...figuras, ...figuras].sort(() => Math.random() - .5).map(f => ({ f, vista: false, lista: false }));
        abiertas = []; intentos = 0; bloqueado = false;
        dibujar(restantes());
      };
      nueva();
    }
  },

  // ---------------- ADIVINA EL NÚMERO ----------------
  adivina: {
    nombre: "Adivina", icono: "🔢",
    iniciar(contenedor, alGanar) {
      let secreto, vidas, fin;
      const dibujar = (msg) => {
        contenedor.innerHTML = `
          <div class="caja" style="text-align:center">
            <p class="gris">Adivina el número del 1 al 50</p>
            <div class="grande">${"❤️".repeat(vidas)}</div>
            <div class="estado">${msg}</div>
            ${fin ? `<button class="btn sec" id="otra">Jugar otra vez</button>`
                  : `<input id="num" type="number" inputmode="numeric" min="1" max="50" placeholder="Escribe un número">
                     <button class="btn" id="probar">Probar</button>`}
          </div>`;
        const p = contenedor.querySelector("#probar");
        if (p) p.onclick = probar;
        const o = contenedor.querySelector("#otra"); if (o) o.onclick = nueva;
      };
      const probar = () => {
        const n = parseInt(contenedor.querySelector("#num").value, 10);
        if (!n || n < 1 || n > 50) return dibujar("Escribe un número del 1 al 50");
        if (n === secreto) { fin = true; dibujar(`¡Ganaste! Era ${secreto} 🎉`); alGanar(); return; }
        vidas--;
        if (vidas <= 0) { fin = true; return dibujar(`Perdiste. Era ${secreto} 😢`); }
        dibujar(n < secreto ? `${n} es muy bajo ⬆️` : `${n} es muy alto ⬇️`);
      };
      const nueva = () => { secreto = 1 + Math.floor(Math.random() * 50); vidas = 6; fin = false; dibujar("Tienes 6 vidas"); };
      nueva();
    }
  },

  // ---------------- PIEDRA, PAPEL O TIJERA ----------------
  ppt: {
    nombre: "Piedra Papel Tijera", icono: "✊",
    iniciar(contenedor, alGanar) {
      const op = { piedra: "✊", papel: "✋", tijera: "✌️" };
      const vence = { piedra: "tijera", papel: "piedra", tijera: "papel" };
      let tu = 0, ella = 0;
      const dibujar = (a, b, msg) => {
        contenedor.innerHTML = `
          <div class="estado">Al mejor de 3 — Tú ${tu} : ${ella} Máquina</div>
          <div class="vs"><span>${a || "❔"}</span><span>${b || "❔"}</span></div>
          <div class="estado">${msg}</div>
          <div class="opciones">${Object.keys(op).map(k => `<button data-k="${k}">${op[k]}</button>`).join("")}</div>`;
        contenedor.querySelectorAll(".opciones button").forEach(bt => bt.onclick = () => jugar(bt.dataset.k));
      };
      const jugar = (k) => {
        if (tu === 2 || ella === 2) { tu = ella = 0; }
        const m = Object.keys(op)[Math.floor(Math.random() * 3)];
        let msg = "Empate";
        if (vence[k] === m) { tu++; msg = "Ganaste la ronda"; }
        else if (k !== m) { ella++; msg = "Perdiste la ronda"; }
        if (tu === 2) { msg = "¡Ganaste la partida! 🎉 Toca para otra"; alGanar(); }
        if (ella === 2) msg = "Perdiste la partida 😢 Toca para otra";
        dibujar(op[k], op[m], msg);
      };
      dibujar(null, null, "Elige tu jugada");
    }
  }
};
