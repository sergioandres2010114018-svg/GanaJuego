// =============================================================
//  CONFIGURACIÓN — lo único que necesitas cambiar
//  (en GitHub: abre este archivo, toca el lápiz ✏️, edita y guarda)
// =============================================================
const CONFIG = {
  nombreApp: "GanaJuegos",
  creador: "Bexy Otálora",

  // Tu número de WhatsApp con indicativo de país, sin + ni espacios.
  // Aquí te llegan las solicitudes de retiro de los usuarios.
  whatsappDueno: "573000000000",

  // Cuántas monedas gana el usuario por cada victoria
  premios: {
    triqui: 10,
    memoria: 15,
    adivina: 8,
    ppt: 5
  },

  // Cuánto vale cada moneda en pesos (100 monedas = 100 * 1 = $100)
  valorMonedaPesos: 1,

  // Mínimo de monedas para poder pedir un retiro
  retiroMinimo: 5000,

  // Máximo de monedas que se pueden ganar por día (protege tu bolsillo)
  limiteDiario: 300
};
