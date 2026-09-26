const Groq = require('groq-sdk');
const OrdenService = require('./Orden.service');
const GastoService = require('./Gasto.service');
const InsumoService = require('./insumo.service');
const PlatoService = require('./Plato.service');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const prompts = {
    administrador: `
Eres EZBot en modo ADMINISTRADOR para el restaurante EZFood (Santa Clara Gourmet).
Tu enfoque es la gestión operativa y administrativa del restaurante.
Responde en español de forma concisa y útil.
Analiza y da recomendaciones sobre:
- Gestión de órdenes y mesas
- Gestión de clientes (frecuencia, fidelización)
- Platos más solicitados
- Eficiencia operativa del restaurante
Evita hablar de finanzas detalladas, enfócate en la operación diaria.
    `,
    financiero: `
Eres EZBot en modo FINANCIERO para el restaurante EZFood (Santa Clara Gourmet).
Tu enfoque es el análisis financiero y contable del restaurante.
Responde en español de forma concisa y útil.
Analiza y da recomendaciones sobre:
- Balance de ingresos vs gastos
- Rentabilidad por plato
- Control de gastos operativos
- Tendencias de ventas
- Optimización de costos
- Proyecciones financieras basadas en los datos actuales
Sé preciso con los números y da recomendaciones financieras concretas.
    `,
    general: `
Eres EZBot, asistente de inteligencia de negocio para el restaurante EZFood (Santa Clara Gourmet).
Responde en español de forma concisa y útil.
Puedes responder sobre cualquier aspecto del restaurante:
administración, finanzas, inventario, clientes y operación general.
    `
};

// Fecha de corte: hoy - 30 días, en formato 'YYYY-MM-DD' (mismo formato
// que usan Orden.service y Gasto.service al guardar fecha/Fecha).
const getFechaCorte = () => {
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    return hace30Dias.toISOString().split('T')[0];
};

const consultarEZBot = async (pregunta, modo = 'general') => {
    console.log("GROQ KEY:", process.env.GROQ_API_KEY ? "OK" : "UNDEFINED");

    const [ordenesTotal, gastosTotal, insumos, platos] = await Promise.all([
        OrdenService.getOrdenes(),
        GastoService.GetGasto(),
        InsumoService.getInsumos(),
        PlatoService.getPlatos()
    ]);

    const fechaCorte = getFechaCorte();

    // Filtrar solo el último mes (comparación de strings 'YYYY-MM-DD' funciona
    // porque el formato ISO es lexicográficamente ordenable).
    const ordenes = ordenesTotal.filter(o => o.fecha && o.fecha >= fechaCorte);
    const gastos = gastosTotal.filter(g => g.Fecha && g.Fecha >= fechaCorte);

    const ordenesPagadas = ordenes.filter(o => o.estado_nombre === 'pagado');
    const totalIngresos  = ordenesPagadas.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalGastos    = gastos.reduce((sum, g) => sum + (g.Costo || 0), 0);
    const balance        = totalIngresos - totalGastos;

    const contexto = `
${prompts[modo] || prompts.general}

=== DATOS DEL RESTAURANTE (ÚLTIMOS 30 DÍAS) ===

RESUMEN FINANCIERO (último mes):
- Total ingresos (órdenes pagadas): $${totalIngresos}
- Total gastos: $${totalGastos}
- Balance del período: $${balance}

ÓRDENES DEL ÚLTIMO MES (${ordenes.length} de ${ordenesTotal.length} totales):
${JSON.stringify(ordenes.slice(0, 20), null, 2)}

GASTOS DEL ÚLTIMO MES (${gastos.length} de ${gastosTotal.length} totales):
${JSON.stringify(gastos.slice(0, 20), null, 2)}

INSUMOS EN INVENTARIO:
${JSON.stringify(insumos, null, 2)}

PLATOS DEL MENÚ:
${JSON.stringify(platos, null, 2)}

=== PREGUNTA DEL USUARIO ===
${pregunta}
    `;

    const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: contexto }],
        model: 'openai/gpt-oss-120b',
        max_tokens: 2048,
        reasoning_effort: 'low'
    });

    return completion.choices[0]?.message?.content ?? 'No pude obtener respuesta.';
};

module.exports = { consultarEZBot };