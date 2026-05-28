const Groq = require('groq-sdk');
const firebase = require('../database/connection');
const firestore = firebase.firestore();

const groq = new Groq({ apiKey: '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' });

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

    const ordenes = ordenesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const gastos  = gastosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const insumos = insumosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const platos  = platosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
${JSON.stringify(gastos, null, 2)}

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
