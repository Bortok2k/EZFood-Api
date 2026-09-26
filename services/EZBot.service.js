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

const consultarEZBot = async (pregunta, modo = 'general') => {
    console.log("GROQ KEY:", process.env.GROQ_API_KEY ? "OK" : "UNDEFINED");

    // Antes: 4 firestore.collection(...).get() completos en CADA pregunta.
    // Ahora: se reutilizan los mismos servicios (y su caché TTL) que usan
    // Balance, Caja e Inventario, así que si esos datos ya se cargaron
    // recientemente, esto no genera lecturas nuevas a Firestore.
    const [ordenes, gastos, insumos, platos] = await Promise.all([
        OrdenService.getOrdenes(),
        GastoService.GetGasto(),
        InsumoService.getInsumos(),
        PlatoService.getPlatos()
    ]);

    const ordenesPagadas = ordenes.filter(o => o.estado_nombre === 'pagado');
    const totalIngresos  = ordenesPagadas.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalGastos    = gastos.reduce((sum, g) => sum + (g.Costo || 0), 0);
    const balance        = totalIngresos - totalGastos;

    const contexto = `
${prompts[modo] || prompts.general}

=== DATOS DEL RESTAURANTE ===

RESUMEN FINANCIERO:
- Total ingresos (órdenes pagadas): $${totalIngresos}
- Total gastos: $${totalGastos}
- Balance actual: $${balance}

ÓRDENES (${ordenes.length} total):
${JSON.stringify(ordenes.slice(0, 20), null, 2)}

GASTOS (${gastos.length} total):
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
