import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // Estados para el formulario de cálculo
  const [calculationData, setCalculationData] = useState({
    consultas_mensuales: 500,
    porcentaje_automatizable_chatbot: 70,
    tiempo_respuesta_manual: 4,
    horas_mensuales_crm: 120,
    porcentaje_automatizable_crm: 40,
    personas_involucradas: 3,
    costo_horario_empleado: 2000,
    costo_licencia_anual: 400000,
    costo_implementacion: 1000000,
    valor_ticket_promedio: '',
    tasa_conversion_actual: '',
    tasa_conversion_esperada: ''
  });

  // Estados para el formulario de contacto
  const [contactData, setContactData] = useState({
    nombre_completo: '',
    empresa: '',
    telefono: '',
    email: ''
  });

  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);

  const handleCalculationChange = (e) => {
    const { name, value } = e.target;
    setCalculationData(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateROI = (data) => {
    // Cálculos para chatbot
    const consultasAutomatizables = data.consultas_mensuales * (data.porcentaje_automatizable_chatbot / 100);
    const tiempoAhorradoMensualChatbot = (consultasAutomatizables * data.tiempo_respuesta_manual) / 60;
    const ahorroEconomicoAnualChatbot = tiempoAhorradoMensualChatbot * 12 * data.costo_horario_empleado;
    
    // Cálculos para CRM
    const tiempoAhorradoAnualCrm = (data.horas_mensuales_crm * 12 * data.porcentaje_automatizable_crm / 100) * data.personas_involucradas;
    const ahorroEconomicoAnualCrm = tiempoAhorradoAnualCrm * data.costo_horario_empleado;
    
    // Totales
    const ahorroTotalAnual = ahorroEconomicoAnualChatbot + ahorroEconomicoAnualCrm;
    const inversionTotal = data.costo_licencia_anual + data.costo_implementacion;
    const roiPorcentaje = ((ahorroTotalAnual - inversionTotal) / inversionTotal) * 100;
    
    // Ingresos adicionales (opcional)
    let ingresosAdicionales = null;
    if (data.valor_ticket_promedio && data.tasa_conversion_actual && data.tasa_conversion_esperada) {
      const consultasAnuales = data.consultas_mensuales * 12;
      const ventasActuales = consultasAnuales * (data.tasa_conversion_actual / 100);
      const ventasEsperadas = consultasAnuales * (data.tasa_conversion_esperada / 100);
      const ventasAdicionales = ventasEsperadas - ventasActuales;
      ingresosAdicionales = ventasAdicionales * data.valor_ticket_promedio;
    }
    
    return {
      ahorro_tiempo_mensual_chatbot: tiempoAhorradoMensualChatbot,
      ahorro_economico_anual_chatbot: ahorroEconomicoAnualChatbot,
      ahorro_tiempo_anual_crm: tiempoAhorradoAnualCrm,
      ahorro_economico_anual_crm: ahorroEconomicoAnualCrm,
      ahorro_total_anual: ahorroTotalAnual,
      inversion_total: inversionTotal,
      roi_porcentaje: roiPorcentaje,
      ingresos_adicionales_estimados: ingresosAdicionales
    };
  };

  const handleCalculate = () => {
    const result = calculateROI(calculationData);
    setCalculationResult(result);
    setShowContactForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      
      const submissionData = {
        calculation_input: {
          ...calculationData,
          valor_ticket_promedio: calculationData.valor_ticket_promedio || null,
          tasa_conversion_actual: calculationData.tasa_conversion_actual || null,
          tasa_conversion_esperada: calculationData.tasa_conversion_esperada || null
        },
        calculation_output: calculationResult,
        contact_info: contactData
      };

      await axios.post(`${backendUrl}/api/submit-roi`, submissionData);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error enviando datos:', error);
      alert('Error enviando la información. Por favor, inténtelo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <img src="/api/placeholder/120/60" alt="Efficiency24" className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-blue-600 mb-4">¡Sus resultados están en camino!</h1>
            <p className="text-gray-600">En breve te contactaremos.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/api/placeholder/150/75" alt="Efficiency24" className="h-12" />
              <h1 className="text-2xl font-bold text-blue-600">Calculadora ROI</h1>
            </div>
            <p className="text-gray-600 text-sm">Bitrix24 CRM + Chatbot para PYMEs</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!showContactForm ? (
          <>
            {/* Estadísticas educativas */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-blue-800 mb-4">📊 Datos basados en estudios públicos</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500">•</span>
                  <p>Los chatbots suelen automatizar entre el <strong>60% y 80%</strong> de las consultas de clientes (IBM, Intercom)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500">•</span>
                  <p>El tiempo promedio de respuesta manual por consulta es de <strong>3 a 5 minutos</strong></p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500">•</span>
                  <p>La automatización de procesos CRM reduce la carga administrativa entre <strong>30% y 50%</strong> (Nucleus Research)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500">•</span>
                  <p>Bitrix24 optimiza tareas como asignación de tareas, seguimientos y generación de reportes</p>
                </div>
              </div>
            </div>

            {/* Formulario de cálculo */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ingrese sus datos</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Sección Chatbot */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">🤖 Automatización con Chatbot</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Consultas de clientes por mes</label>
                      <input
                        type="number"
                        name="consultas_mensuales"
                        value={calculationData.consultas_mensuales}
                        onChange={handleCalculationChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">% de consultas automatizables</label>
                      <input
                        type="number"
                        name="porcentaje_automatizable_chatbot"
                        value={calculationData.porcentaje_automatizable_chatbot}
                        onChange={handleCalculationChange}
                        min="0"
                        max="100"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo promedio respuesta manual (minutos)</label>
                      <input
                        type="number"
                        name="tiempo_respuesta_manual"
                        value={calculationData.tiempo_respuesta_manual}
                        onChange={handleCalculationChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Sección CRM */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">⚙️ Automatización CRM</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Horas mensuales en tareas manuales de CRM</label>
                      <input
                        type="number"
                        name="horas_mensuales_crm"
                        value={calculationData.horas_mensuales_crm}
                        onChange={handleCalculationChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">% de tareas CRM automatizables</label>
                      <input
                        type="number"
                        name="porcentaje_automatizable_crm"
                        value={calculationData.porcentaje_automatizable_crm}
                        onChange={handleCalculationChange}
                        min="0"
                        max="100"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número de personas involucradas</label>
                      <input
                        type="number"
                        name="personas_involucradas"
                        value={calculationData.personas_involucradas}
                        onChange={handleCalculationChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Sección Costos */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">💰 Costos</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Costo horario promedio por empleado (ARS)</label>
                      <input
                        type="number"
                        name="costo_horario_empleado"
                        value={calculationData.costo_horario_empleado}
                        onChange={handleCalculationChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Costo licencia anual Bitrix24 (ARS)</label>
                      <input
                        type="number"
                        name="costo_licencia_anual"
                        value={calculationData.costo_licencia_anual}
                        onChange={handleCalculationChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Costo implementación (ARS)</label>
                      <input
                        type="number"
                        name="costo_implementacion"
                        value={calculationData.costo_implementacion}
                        onChange={handleCalculationChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Sección Opcional */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">📈 Ingresos Adicionales (Opcional)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valor promedio ticket de venta (ARS)</label>
                      <input
                        type="number"
                        name="valor_ticket_promedio"
                        value={calculationData.valor_ticket_promedio}
                        onChange={handleCalculationChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Opcional"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tasa de conversión actual (%)</label>
                      <input
                        type="number"
                        name="tasa_conversion_actual"
                        value={calculationData.tasa_conversion_actual}
                        onChange={handleCalculationChange}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Opcional"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tasa de conversión esperada con chatbot (%)</label>
                      <input
                        type="number"
                        name="tasa_conversion_esperada"
                        value={calculationData.tasa_conversion_esperada}
                        onChange={handleCalculationChange}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Opcional"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleCalculate}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-200"
                >
                  Calcular ROI
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Formulario de contacto */
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete sus datos para recibir los resultados</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    name="nombre_completo"
                    value={contactData.nombre_completo}
                    onChange={handleContactChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empresa *</label>
                  <input
                    type="text"
                    name="empresa"
                    value={contactData.empresa}
                    onChange={handleContactChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={contactData.telefono}
                    onChange={handleContactChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={contactData.email}
                    onChange={handleContactChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2025 Efficiency24. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;