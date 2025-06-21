# Calculadora ROI Efficiency24

Una calculadora de ROI profesional diseñada para PYMEs argentinas que evalúan la implementación de Bitrix24 CRM + chatbot para automatizar procesos de atención al cliente, soporte y calificación de ventas.

## 🎯 Características

- **Cálculo de ROI automatizado** basado en datos reales de la empresa
- **Estadísticas educativas** basadas en estudios públicos (IBM, Intercom, Nucleus Research)
- **Diseño responsive** optimizado para dispositivos móviles
- **Envío automático de resultados** vía email a Efficiency24
- **Interfaz profesional** dirigida a gerentes y directores de PYMEs
- **Privacidad de datos** - resultados no mostrados al usuario

## 🧮 Funcionalidades de Cálculo

### Automatización con Chatbot
- Consultas de clientes por mes
- Porcentaje de consultas automatizables
- Tiempo promedio de respuesta manual
- Cálculo de ahorro de tiempo y costos

### Automatización CRM
- Horas mensuales en tareas manuales
- Porcentaje de tareas automatizables
- Número de personas involucradas
- Optimización de procesos

### Análisis Financiero
- Costo horario por empleado
- Costo de licencia anual Bitrix24
- Costo de implementación
- Cálculo de ROI y tiempo de recuperación

### Proyección de Ingresos (Opcional)
- Valor promedio de ticket de venta
- Tasa de conversión actual vs esperada
- Estimación de ingresos adicionales

## 🛠️ Tecnologías

### Frontend
- **React 19** - Framework de interfaz de usuario
- **Tailwind CSS** - Framework de diseño utilitario
- **Axios** - Cliente HTTP para comunicación con API
- **React Hook Form** - Manejo de formularios

### Backend
- **FastAPI** - Framework web de Python
- **MongoDB** - Base de datos NoSQL
- **Gmail SMTP** - Servicio de email
- **Pydantic** - Validación de datos

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js 18+
- Python 3.10+
- MongoDB
- Cuenta Gmail con contraseña de aplicación

### Frontend
```bash
cd frontend
yarn install
yarn start
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

### Variables de Entorno

**Backend (.env)**
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="efficiency24_roi"
GMAIL_EMAIL=tu-email@gmail.com
GMAIL_PASSWORD=tu-contraseña-aplicacion
```

**Frontend (.env)**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 📊 Flujo de Usuario

1. **Visualización de estadísticas** - Datos educativos sobre automatización
2. **Ingreso de datos** - Formulario con valores por defecto
3. **Cálculo automático** - Procesamiento de ROI en tiempo real
4. **Formulario de contacto** - Datos obligatorios del usuario
5. **Envío automático** - Email a hola@efficiency24.io
6. **Confirmación** - Página de confirmación sin mostrar resultados

## 🎨 Diseño

- **Paleta de colores**: Azul Efficiency24 (#007bff), blanco, gris claro
- **Tipografía**: Inter, system fonts
- **Responsive**: Adaptable a móviles y tablets
- **Accesibilidad**: Contraste y navegación optimizados

## 📧 Sistema de Email

Los resultados se envían automáticamente a `hola@efficiency24.io` incluyendo:
- Información completa del contacto
- Todos los datos ingresados por el usuario
- Resultados calculados del ROI
- Timestamp de la consulta

## 🔒 Privacidad

- Los resultados NO se muestran al usuario final
- Datos almacenados de forma segura
- Comunicación encriptada
- Cumplimiento con normativas de privacidad

## 📱 Deploy

### Cloudflare Pages
1. Conectar repositorio de GitHub
2. Configurar build settings:
   - Build command: `cd frontend && yarn build`
   - Build output directory: `frontend/build`
3. Configurar variables de entorno de producción

### Backend Deploy
- Puede desplegarse en Railway, Render, o similar
- Configurar variables de entorno de producción
- Actualizar CORS origins para dominio de producción

## 🤝 Contribución

Este proyecto es propiedad de Efficiency24. Para contribuciones o consultas, contactar a hola@efficiency24.io

## 📄 Licencia

© 2025 Efficiency24. Todos los derechos reservados.

---

**Desarrollado para PYMEs argentinas con la misión de optimizar procesos empresariales a través de la tecnología.**