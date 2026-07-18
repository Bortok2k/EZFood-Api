const Groq = require('groq-sdk');
const firebase = require('../database/connection');
const firestore = firebase.firestore();

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

    const [ordenesSnap, gastosSnap, insumosSnap, platosSnap] = await Promise.all([
        firestore.collection('Orden').get(),
        firestore.collection('Gasto').get(),
        firestore.collection('Insumo').get(),
        firestore.collection('Plato').get()
    ]);

    const todasOrdenes = ordenesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const todosGastos  = gastosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const insumos      = insumosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const platos       = platosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Última semana
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);
    const fechaLimite = hace7Dias.toISOString().split('T')[0];

    const ordenesSemana = todasOrdenes.filter(o => o.fecha && o.fecha >= fechaLimite);
    const gastosSemana  = todosGastos.filter(g => g.Fecha && g.Fecha >= fechaLimite);

    // Métricas históricas — solo números
    const ordenesPagadas = todasOrdenes.filter(o => o.estado_nombre?.toLowerCase() === 'pagado');
    const totalIngresos  = ordenesPagadas.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalGastos    = todosGastos.reduce((sum, g) => sum + (g.Costo || 0), 0);

    // Métricas semanales — solo números
    const ordenesPagadasSemana  = ordenesSemana.filter(o => o.estado_nombre?.toLowerCase() === 'pagado');
    const ingresosSemana        = ordenesPagadasSemana.reduce((sum, o) => sum + (o.total || 0), 0);
    const gastosSemanaTotal     = gastosSemana.reduce((sum, g) => sum + (g.Costo || 0), 0);

    // ← Resumir datos antes de enviar al modelo
    const ordenesSemanaResumen = ordenesSemana.map(o => ({
        mesa: o.mesa,
        fecha: o.fecha,
        total: o.total,
        estado: o.estado_nombre,
        platos: o.platos?.map(p => `${p.cantidad}x ${p.Descripcion}`)
    }));

    const gastosSemanaResumen = gastosSemana.map(g => ({
        descripcion: g.Descripcion,
        costo: g.Costo,
        fecha: g.Fecha
    }));

    const insumosResumen = insumos.map(i => ({
        nombre: i.Descripcion,
        cantidad: i.Cantidad,
        medida: i.Medida
    }));

    const platosResumen = platos.map(p => ({
        nombre: p.Descripcion,
        precio: p.Precio
    }));

    const contexto = `
${prompts[modo] || prompts.general}

=== DATOS DEL RESTAURANTE ===

RESUMEN HISTÓRICO:
- Ingresos totales: $${totalIngresos}
- Gastos totales: $${totalGastos}
- Balance general: $${totalIngresos - totalGastos}

ÚLTIMA SEMANA (desde ${fechaLimite}):
- Ingresos: $${ingresosSemana}
- Gastos: $${gastosSemanaTotal}
- Balance semana: $${ingresosSemana - gastosSemanaTotal}
- Órdenes: ${ordenesSemana.length}

ÓRDENES SEMANA:
${JSON.stringify(ordenesSemanaResumen)}

GASTOS SEMANA:
${JSON.stringify(gastosSemanaResumen)}

INVENTARIO:
${JSON.stringify(insumosResumen)}

MENÚ:
${JSON.stringify(platosResumen)}

PREGUNTA: ${pregunta}`;

    const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: contexto }],
        model: 'llama-3.1-8b-instant', // ← modelo con más tokens gratis
        max_tokens: 1024
    });

    return completion.choices[0]?.message?.content ?? 'No pude obtener respuesta.';
};

module.exports = { consultarEZBot };
