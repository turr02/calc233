from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Email configuration
GMAIL_EMAIL = os.environ['GMAIL_EMAIL']
GMAIL_PASSWORD = os.environ['GMAIL_PASSWORD']

# Define Models
class ROICalculationInput(BaseModel):
    # Inputs para chatbot
    consultas_mensuales: int = Field(default=500, description="Consultas de clientes por mes")
    porcentaje_automatizable_chatbot: int = Field(default=70, description="% de consultas automatizables con chatbot")
    tiempo_respuesta_manual: int = Field(default=4, description="Tiempo promedio respuesta manual (minutos)")
    
    # Inputs para CRM
    horas_mensuales_crm: int = Field(default=120, description="Horas mensuales en tareas manuales de CRM")
    porcentaje_automatizable_crm: int = Field(default=40, description="% de tareas CRM automatizables")
    personas_involucradas: int = Field(default=3, description="Número de personas en estas tareas")
    
    # Costos
    costo_horario_empleado: int = Field(default=2000, description="Costo horario promedio por empleado (ARS)")
    costo_licencia_anual: int = Field(default=400000, description="Costo licencia anual Bitrix24 (ARS)")
    costo_implementacion: int = Field(default=1000000, description="Costo implementación (ARS)")
    
    # Opcionales para ingresos
    valor_ticket_promedio: Optional[int] = Field(default=None, description="Valor promedio ticket venta (ARS)")
    tasa_conversion_actual: Optional[float] = Field(default=None, description="Tasa conversión actual (%)")
    tasa_conversion_esperada: Optional[float] = Field(default=None, description="Tasa conversión esperada con chatbot (%)")

class ROICalculationOutput(BaseModel):
    # Resultados chatbot
    ahorro_tiempo_mensual_chatbot: float
    ahorro_economico_anual_chatbot: float
    
    # Resultados CRM
    ahorro_tiempo_anual_crm: float
    ahorro_economico_anual_crm: float
    
    # Totales
    ahorro_total_anual: float
    inversion_total: float
    roi_porcentaje: float
    
    # Opcional
    ingresos_adicionales_estimados: Optional[float] = None

class ContactForm(BaseModel):
    nombre_completo: str = Field(..., description="Nombre completo")
    empresa: str = Field(..., description="Empresa")
    telefono: Optional[str] = Field(default=None, description="Teléfono")
    email: EmailStr = Field(..., description="Email")

class ROISubmission(BaseModel):
    calculation_input: ROICalculationInput
    calculation_output: ROICalculationOutput
    contact_info: ContactForm

def calculate_roi(input_data: ROICalculationInput) -> ROICalculationOutput:
    """Calcula todos los valores del ROI"""
    
    # Cálculos para chatbot
    consultas_automatizables = input_data.consultas_mensuales * (input_data.porcentaje_automatizable_chatbot / 100)
    tiempo_ahorrado_mensual_chatbot = (consultas_automatizables * input_data.tiempo_respuesta_manual) / 60  # horas
    ahorro_economico_anual_chatbot = tiempo_ahorrado_mensual_chatbot * 12 * input_data.costo_horario_empleado
    
    # Cálculos para CRM
    tiempo_ahorrado_anual_crm = (input_data.horas_mensuales_crm * 12 * input_data.porcentaje_automatizable_crm / 100) * input_data.personas_involucradas
    ahorro_economico_anual_crm = tiempo_ahorrado_anual_crm * input_data.costo_horario_empleado
    
    # Totales
    ahorro_total_anual = ahorro_economico_anual_chatbot + ahorro_economico_anual_crm
    inversion_total = input_data.costo_licencia_anual + input_data.costo_implementacion
    roi_porcentaje = ((ahorro_total_anual - inversion_total) / inversion_total) * 100
    
    # Ingresos adicionales (opcional)
    ingresos_adicionales = None
    if all([input_data.valor_ticket_promedio, input_data.tasa_conversion_actual, input_data.tasa_conversion_esperada]):
        consultas_anuales = input_data.consultas_mensuales * 12
        ventas_actuales = consultas_anuales * (input_data.tasa_conversion_actual / 100)
        ventas_esperadas = consultas_anuales * (input_data.tasa_conversion_esperada / 100)
        ventas_adicionales = ventas_esperadas - ventas_actuales
        ingresos_adicionales = ventas_adicionales * input_data.valor_ticket_promedio
    
    return ROICalculationOutput(
        ahorro_tiempo_mensual_chatbot=tiempo_ahorrado_mensual_chatbot,
        ahorro_economico_anual_chatbot=ahorro_economico_anual_chatbot,
        ahorro_tiempo_anual_crm=tiempo_ahorrado_anual_crm,
        ahorro_economico_anual_crm=ahorro_economico_anual_crm,
        ahorro_total_anual=ahorro_total_anual,
        inversion_total=inversion_total,
        roi_porcentaje=roi_porcentaje,
        ingresos_adicionales_estimados=ingresos_adicionales
    )

def send_roi_email(submission: ROISubmission):
    """Envía email con los resultados del ROI a hola@efficiency24.io"""
    try:
        # Configurar el servidor SMTP
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(GMAIL_EMAIL, GMAIL_PASSWORD)
        
        # Crear el mensaje
        msg = MIMEMultipart()
        msg['From'] = GMAIL_EMAIL
        msg['To'] = 'hola@efficiency24.io'
        msg['Subject'] = f'Nuevo Cálculo ROI - {submission.contact_info.empresa}'
        
        # Crear el cuerpo del email
        email_body = f"""
Nuevo cálculo de ROI realizado:

=== INFORMACIÓN DE CONTACTO ===
Nombre: {submission.contact_info.nombre_completo}
Empresa: {submission.contact_info.empresa}
Email: {submission.contact_info.email}
Teléfono: {submission.contact_info.telefono or 'No proporcionado'}

=== DATOS INGRESADOS ===
Consultas mensuales: {submission.calculation_input.consultas_mensuales:,}
% Consultas automatizables (chatbot): {submission.calculation_input.porcentaje_automatizable_chatbot}%
Tiempo respuesta manual: {submission.calculation_input.tiempo_respuesta_manual} minutos
Horas mensuales CRM: {submission.calculation_input.horas_mensuales_crm}
% Tareas CRM automatizables: {submission.calculation_input.porcentaje_automatizable_crm}%
Personas involucradas: {submission.calculation_input.personas_involucradas}
Costo horario empleado: ${submission.calculation_input.costo_horario_empleado:,} ARS
Costo licencia anual: ${submission.calculation_input.costo_licencia_anual:,} ARS
Costo implementación: ${submission.calculation_input.costo_implementacion:,} ARS

=== RESULTADOS CALCULADOS ===
Ahorro tiempo mensual (chatbot): {submission.calculation_output.ahorro_tiempo_mensual_chatbot:.1f} horas
Ahorro económico anual (chatbot): ${submission.calculation_output.ahorro_economico_anual_chatbot:,.0f} ARS
Ahorro tiempo anual (CRM): {submission.calculation_output.ahorro_tiempo_anual_crm:.1f} horas
Ahorro económico anual (CRM): ${submission.calculation_output.ahorro_economico_anual_crm:,.0f} ARS

AHORRO TOTAL ANUAL: ${submission.calculation_output.ahorro_total_anual:,.0f} ARS
INVERSIÓN TOTAL: ${submission.calculation_output.inversion_total:,.0f} ARS
ROI ESTIMADO: {submission.calculation_output.roi_porcentaje:.1f}%
"""
        
        if submission.calculation_output.ingresos_adicionales_estimados:
            email_body += f"\nIngresos adicionales estimados: ${submission.calculation_output.ingresos_adicionales_estimados:,.0f} ARS"
        
        msg.attach(MIMEText(email_body, 'plain'))
        
        # Enviar el email
        server.send_message(msg)
        server.quit()
        
        return True
    except Exception as e:
        logging.error(f"Error enviando email: {str(e)}")
        return False

# Rutas de la API
@api_router.post("/calculate-roi")
async def calculate_roi_endpoint(input_data: ROICalculationInput):
    """Calcula el ROI pero no lo devuelve al usuario"""
    try:
        result = calculate_roi(input_data)
        return {"status": "success", "message": "Cálculo realizado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error en el cálculo")

@api_router.post("/submit-roi")
async def submit_roi_calculation(submission: ROISubmission):
    """Recibe la información completa y envía el email"""
    try:
        # Enviar email
        email_sent = send_roi_email(submission)
        
        if not email_sent:
            raise HTTPException(status_code=500, detail="Error enviando el email")
        
        # Guardar en base de datos (opcional)
        submission_dict = submission.dict()
        submission_dict['timestamp'] = datetime.utcnow()
        submission_dict['id'] = str(uuid.uuid4())
        await db.roi_submissions.insert_one(submission_dict)
        
        return {"status": "success", "message": "Información enviada correctamente"}
    
    except Exception as e:
        logging.error(f"Error en submit_roi_calculation: {str(e)}")
        raise HTTPException(status_code=500, detail="Error procesando la solicitud")

# Rutas existentes
@api_router.get("/")
async def root():
    return {"message": "Efficiency24 ROI Calculator API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()