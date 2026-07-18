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

    // Calcular fecha de hace 7 días
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);
    const fechaLimite = hace7Dias.toISOString().split('T')[0];

    // Filtrar solo última semana para el detalle
    const ordenesSemana = todasOrdenes.filter(o => 
        o.fecha && o.fecha >= fechaLimite);
    const gastosSemana = todosGastos.filter(g => 
        g.Fecha && g.Fecha >= fechaLimite);

    // Métricas generales con todos los datos históricos
    const ordenesPagadas = todasOrdenes.filter(o => 
        o.estado_nombre?.toLowerCase() === 'pagado');
    const totalIngresos = ordenesPagadas.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalGastos   = todosGastos.reduce((sum, g) => sum + (g.Costo || 0), 0);
    const balance       = totalIngresos - totalGastos;

    // Métricas de la semana
    const ordenesPagadasSemana = ordenesSemana.filter(o => 
        o.estado_nombre?.toLowerCase() === 'pagado');
    const ingresosSemana = ordenesPagadasSemana.reduce((sum, o) => sum + (o.total || 0), 0);
    const gastosSemanaTotal = gastosSemana.reduce((sum, g) => sum + (g.Costo || 0), 0);

    const contexto = `
${prompts[modo] || prompts.general}

=== DATOS DEL RESTAURANTE ===

RESUMEN FINANCIERO HISTÓRICO:
- Total ingresos históricos: $${totalIngresos}
- Total gastos históricos: $${totalGastos}
- Balance general: $${balance}

RESUMEN FINANCIERO ÚLTIMA SEMANA (desde ${fechaLimite}):
- Ingresos semana: $${ingresosSemana}
- Gastos semana: $${gastosSemanaTotal}
- Balance semana: $${ingresosSemana - gastosSemanaTotal}
- Órdenes esta semana: ${ordenesSemana.length}

DETALLE ÓRDENES ÚLTIMA SEMANA:
${JSON.stringify(ordenesSemana, null, 2)}

DETALLE GASTOS ÚLTIMA SEMANA:
${JSON.stringify(gastosSemana, null, 2)}

INSUMOS EN INVENTARIO:
${JSON.stringify(insumos, null, 2)}

PLATOS DEL MENÚ:
${JSON.stringify(platos, null, 2)}

=== PREGUNTA DEL USUARIO ===
${pregunta}
    `;

    const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: contexto }],
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024
    });

    return completion.choices[0]?.message?.content ?? 'No pude obtener respuesta.';
};

module.exports = { consultarEZBot };
