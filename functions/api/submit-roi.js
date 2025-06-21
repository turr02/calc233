// Cloudflare Workers function para enviar ROI
export default {
  async fetch(request, env) {
    // Solo permitir POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const data = await request.json();
      
      // Validar datos requeridos
      if (!data.calculation_input || !data.calculation_output || !data.contact_info) {
        return new Response('Missing required data', { status: 400 });
      }

      // Validar email de contacto
      if (!data.contact_info.email || !data.contact_info.nombre_completo || !data.contact_info.empresa) {
        return new Response('Missing required contact information', { status: 400 });
      }

      // Preparar email content
      const emailBody = `
Nuevo cálculo de ROI realizado:

=== INFORMACIÓN DE CONTACTO ===
Nombre: ${data.contact_info.nombre_completo}
Empresa: ${data.contact_info.empresa}
Email: ${data.contact_info.email}
Teléfono: ${data.contact_info.telefono || 'No proporcionado'}

=== DATOS INGRESADOS ===
Consultas mensuales: ${data.calculation_input.consultas_mensuales.toLocaleString()}
% Consultas automatizables (chatbot): ${data.calculation_input.porcentaje_automatizable_chatbot}%
Tiempo respuesta manual: ${data.calculation_input.tiempo_respuesta_manual} minutos
Horas mensuales CRM: ${data.calculation_input.horas_mensuales_crm}
% Tareas CRM automatizables: ${data.calculation_input.porcentaje_automatizable_crm}%
Personas involucradas: ${data.calculation_input.personas_involucradas}
Costo horario empleado: $${data.calculation_input.costo_horario_empleado.toLocaleString()} ARS
Costo licencia anual: $${data.calculation_input.costo_licencia_anual.toLocaleString()} ARS
Costo implementación: $${data.calculation_input.costo_implementacion.toLocaleString()} ARS

=== RESULTADOS CALCULADOS ===
Ahorro tiempo mensual (chatbot): ${data.calculation_output.ahorro_tiempo_mensual_chatbot.toFixed(1)} horas
Ahorro económico anual (chatbot): $${data.calculation_output.ahorro_economico_anual_chatbot.toLocaleString()} ARS
Ahorro tiempo anual (CRM): ${data.calculation_output.ahorro_tiempo_anual_crm.toFixed(1)} horas
Ahorro económico anual (CRM): $${data.calculation_output.ahorro_economico_anual_crm.toLocaleString()} ARS

AHORRO TOTAL ANUAL: $${data.calculation_output.ahorro_total_anual.toLocaleString()} ARS
INVERSIÓN TOTAL: $${data.calculation_output.inversion_total.toLocaleString()} ARS
ROI ESTIMADO: ${data.calculation_output.roi_porcentaje.toFixed(1)}%
${data.calculation_output.ingresos_adicionales_estimados ? `\nIngresos adicionales estimados: $${data.calculation_output.ingresos_adicionales_estimados.toLocaleString()} ARS` : ''}
`;

      // Enviar email usando MailChannels (servicio gratuito integrado con Cloudflare Workers)
      const emailRequest = {
        personalizations: [
          {
            to: [{ email: 'hola@efficiency24.io', name: 'Efficiency24' }]
          }
        ],
        from: {
          email: 'noreply@efficiency24.io',
          name: 'Calculadora ROI Efficiency24'
        },
        subject: `Nuevo Cálculo ROI - ${data.contact_info.empresa}`,
        content: [
          {
            type: 'text/plain',
            value: emailBody
          }
        ]
      };

      // Enviar con MailChannels
      const emailResponse = await fetch('https://api.mailchannels.net/tx/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailRequest)
      });

      if (!emailResponse.ok) {
        console.error('Error sending email:', await emailResponse.text());
        return new Response('Error sending email', { status: 500 });
      }

      // Guardar en KV storage si está disponible (opcional)
      if (env.ROI_CALCULATIONS) {
        const timestamp = new Date().toISOString();
        const key = `roi_${timestamp}_${data.contact_info.empresa.replace(/[^a-zA-Z0-9]/g, '_')}`;
        await env.ROI_CALCULATIONS.put(key, JSON.stringify({
          ...data,
          timestamp
        }));
      }

      return new Response(JSON.stringify({
        status: 'success',
        message: 'Información enviada correctamente'
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });

    } catch (error) {
      console.error('Error processing request:', error);
      return new Response('Internal server error', { status: 500 });
    }
  }
};