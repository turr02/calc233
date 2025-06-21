// Cloudflare Workers function para calcular ROI
export default {
  async fetch(request, env) {
    // Solo permitir POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const inputData = await request.json();
      
      // Validar datos de entrada
      if (!inputData.consultas_mensuales || !inputData.costo_horario_empleado) {
        return new Response('Missing required calculation data', { status: 400 });
      }

      // Cálculos para chatbot
      const consultasAutomatizables = inputData.consultas_mensuales * (inputData.porcentaje_automatizable_chatbot / 100);
      const tiempoAhorradoMensualChatbot = (consultasAutomatizables * inputData.tiempo_respuesta_manual) / 60;
      const ahorroEconomicoAnualChatbot = tiempoAhorradoMensualChatbot * 12 * inputData.costo_horario_empleado;
      
      // Cálculos para CRM
      const tiempoAhorradoAnualCrm = (inputData.horas_mensuales_crm * 12 * inputData.porcentaje_automatizable_crm / 100) * inputData.personas_involucradas;
      const ahorroEconomicoAnualCrm = tiempoAhorradoAnualCrm * inputData.costo_horario_empleado;
      
      // Totales
      const ahorroTotalAnual = ahorroEconomicoAnualChatbot + ahorroEconomicoAnualCrm;
      const inversionTotal = inputData.costo_licencia_anual + inputData.costo_implementacion;
      const roiPorcentaje = ((ahorroTotalAnual - inversionTotal) / inversionTotal) * 100;
      
      // Ingresos adicionales (opcional)
      let ingresosAdicionales = null;
      if (inputData.valor_ticket_promedio && inputData.tasa_conversion_actual && inputData.tasa_conversion_esperada) {
        const consultasAnuales = inputData.consultas_mensuales * 12;
        const ventasActuales = consultasAnuales * (inputData.tasa_conversion_actual / 100);
        const ventasEsperadas = consultasAnuales * (inputData.tasa_conversion_esperada / 100);
        const ventasAdicionales = ventasEsperadas - ventasActuales;
        ingresosAdicionales = ventasAdicionales * inputData.valor_ticket_promedio;
      }

      const result = {
        ahorro_tiempo_mensual_chatbot: tiempoAhorradoMensualChatbot,
        ahorro_economico_anual_chatbot: ahorroEconomicoAnualChatbot,
        ahorro_tiempo_anual_crm: tiempoAhorradoAnualCrm,
        ahorro_economico_anual_crm: ahorroEconomicoAnualCrm,
        ahorro_total_anual: ahorroTotalAnual,
        inversion_total: inversionTotal,
        roi_porcentaje: roiPorcentaje,
        ingresos_adicionales_estimados: ingresosAdicionales
      };

      return new Response(JSON.stringify({
        status: 'success',
        message: 'Cálculo realizado correctamente',
        // No devolvemos los resultados por seguridad
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });

    } catch (error) {
      console.error('Error calculating ROI:', error);
      return new Response('Internal server error', { status: 500 });
    }
  }
};