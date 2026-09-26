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

    const ordenes = ordenesTotal.filter(o => o.fecha && o.fecha >= fechaCorte);
    const gastos = gastosTotal.filter(g => g.Fecha && g.Fecha >= fechaCorte);

    const ordenesPagadas = ordenes.filter(o => o.estado_nombre === 'pagado');
    const totalIngresos  = ordenesPagadas.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalGastos    = gastos.reduce((sum, g) => sum + (g.Costo || 0), 0);
    const balance        = totalIngresos - totalGastos;

    // --- Agregar ventas por plato en vez de mandar cada orden completa ---
    const ventasPorPlato = {};
    for (const orden of ordenesPagadas) {
        for (const p of (orden.platos || [])) {
            const key = p.Descripcion || p.plato_id;
            if (!ventasPorPlato[key]) ventasPorPlato[key] = { cantidad: 0, ingresos: 0 };
            ventasPorPlato[key].cantidad += p.cantidad || 0;
            ventasPorPlato[key].ingresos += p.subtotal || 0;
        }
    }
    const topPlatos = Object.entries(ventasPorPlato)
        .map(([nombre, datos]) => ({ nombre, ...datos }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10);

    // --- Gastos: solo campos esenciales, agrupados por tipo también ---
    const gastosPorTipo = {};
    for (const g of gastos) {
        const tipo = g.Tipo || 'otro';
        gastosPorTipo[tipo] = (gastosPorTipo[tipo] || 0) + (g.Costo || 0);
    }
    const gastosResumen = gastos
        .slice(0, 15)
        .map(g => ({ Fecha: g.Fecha, Descripcion: g.Descripcion, Costo: g.Costo }));

    // --- Catálogos: solo campos relevantes, sin ids ---
    const insumosResumen = insumos.map(i => ({
        Descripcion: i.Descripcion, Cantidad: i.Cantidad, Medida: i.Medida
    }));
    const platosResumen = platos.map(p => ({
        Descripcion: p.Descripcion, Precio: p.Precio
    }));

    const contexto = `
${prompts[modo] || prompts.general}

=== DATOS DEL RESTAURANTE (ÚLTIMOS 30 DÍAS) ===

RESUMEN FINANCIERO:
- Órdenes pagadas: ${ordenesPagadas.length} de ${ordenes.length} en el período
- Total ingresos: $${totalIngresos}
- Total gastos: $${totalGastos}
- Balance del período: $${balance}

GASTOS POR TIPO:
${JSON.stringify(gastosPorTipo)}

TOP 10 PLATOS MÁS VENDIDOS:
${JSON.stringify(topPlatos)}

GASTOS RECIENTES (máx. 15):
${JSON.stringify(gastosResumen)}

INSUMOS EN INVENTARIO:
${JSON.stringify(insumosResumen)}

PLATOS DEL MENÚ:
${JSON.stringify(platosResumen)}

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