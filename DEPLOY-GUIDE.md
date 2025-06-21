# 🚀 GUÍA COMPLETA DE DEPLOY - Efficiency24 ROI Calculator

## 📋 Checklist Pre-Deploy

- ✅ Logo de Efficiency24 implementado
- ✅ Sistema de email configurado con Gmail SMTP
- ✅ Build de producción funcionando
- ✅ Variables de entorno configuradas
- ✅ Archivos de configuración creados

## 🔧 Configuración Actual

### Frontend
- **Framework**: React 19 + Tailwind CSS
- **Build output**: `frontend/build/`
- **Puerto desarrollo**: 3000
- **Logo**: `/public/efficiency24-logo.svg`

### Backend
- **Framework**: FastAPI + Python
- **Puerto**: 8001
- **Base de datos**: MongoDB
- **Email**: Gmail SMTP configurado

## 🌐 Deploy en Cloudflare Pages

### Paso 1: Subir a GitHub
```bash
# Inicializar Git (si no está inicializado)
git init
git add .
git commit -m "feat: calculadora ROI Efficiency24 completa"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/efficiency24-roi-calculator.git
git branch -M main
git push -u origin main
```

### Paso 2: Configurar Cloudflare Pages
1. **Ir a Cloudflare Pages** → "Create a project"
2. **Conectar GitHub** → Seleccionar repositorio
3. **Build settings**:
   - Build command: `cd frontend && yarn install && DISABLE_ESLINT_PLUGIN=true yarn build`
   - Build output directory: `frontend/build`
   - Root directory: (dejar vacío)
   - Environment variables:
     - `DISABLE_ESLINT_PLUGIN` = `true`

### Paso 3: Configurar Variables de Entorno
Una vez que tengas el backend deployado, agregar:
- `REACT_APP_BACKEND_URL` = `https://tu-backend-url.com`

## 🖥️ Deploy del Backend

### Opción Recomendada: Railway
1. **Crear cuenta en Railway.app**
2. **New Project** → "Deploy from GitHub repo"
3. **Seleccionar repositorio** y configurar:
   - Root Directory: `/backend`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
4. **Variables de entorno**:
   ```
   MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/efficiency24_roi
   DB_NAME=efficiency24_roi
   GMAIL_EMAIL=turr0stream@gmail.com
   GMAIL_PASSWORD=vjyk oeeq gsmf ldah
   ```

### Alternativa: Render
1. **Crear Web Service** en Render.com
2. **Configuración**:
   - Repository: Tu repositorio GitHub
   - Root Directory: `backend`
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

## 💾 Base de Datos MongoDB

### MongoDB Atlas (Gratuito)
1. **Crear cluster gratuito** en MongoDB Atlas
2. **Configurar acceso**:
   - Database Access: crear usuario
   - Network Access: permitir todas las IPs (0.0.0.0/0)
3. **Obtener connection string**:
   ```
   mongodb+srv://usuario:password@cluster.mongodb.net/efficiency24_roi
   ```

## 🔄 Proceso de Deploy Completo

### 1. Preparar el código
```bash
# Verificar que todo funciona localmente
cd frontend && yarn build
cd ../backend && python -c "import server; print('Backend OK')"
```

### 2. Subir a GitHub
```bash
git add .
git commit -m "chore: preparado para deploy"
git push origin main
```

### 3. Deploy Backend (Railway)
- Crear proyecto en Railway
- Configurar variables de entorno
- Deploy automático al hacer push

### 4. Deploy Frontend (Cloudflare Pages)
- Conectar repositorio en Cloudflare
- Configurar build settings
- Actualizar `REACT_APP_BACKEND_URL` con URL del backend

### 5. Configurar Dominio (Opcional)
- En Cloudflare Pages: Custom domains
- Configurar DNS si usas dominio propio

## 🧪 Testing Post-Deploy

### Verificar Frontend
- Cargar la página web
- Verificar que el logo se muestra correctamente
- Probar el formulario de cálculo
- Verificar formulario de contacto

### Verificar Backend
- API health check: `GET https://tu-backend-url.com/api/`
- Test de email: enviar formulario completo
- Verificar que el email llega a hola@efficiency24.io

### Verificar Integración
- Completar flujo completo: cálculo → contacto → confirmación
- Verificar que el email contiene todos los datos
- Probar responsive en móvil

## 🔐 Seguridad Post-Deploy

1. **CORS**: Actualizar origins en backend con dominio de producción
2. **Environment Variables**: Verificar que no están expuestas
3. **SSL**: Confirmar HTTPS en ambos servicios
4. **Email**: Verificar que los emails no van a spam

## 📊 Monitoreo

- **Cloudflare Analytics**: Tráfico del frontend
- **Railway/Render Logs**: Monitoreo del backend
- **Gmail**: Verificar recepción de emails
- **MongoDB Atlas**: Monitoring de base de datos

## 🆘 Troubleshooting

### Build Error en Cloudflare
- Verificar build command incluye `DISABLE_ESLINT_PLUGIN=true`
- Verificar Node.js version (18+)

### CORS Error
- Verificar que backend permite el dominio de frontend
- Actualizar origins en `server.py`

### Email no llega
- Verificar credenciales Gmail en variables de entorno
- Revisar spam folder
- Verificar logs del backend

### MongoDB Connection Error
- Verificar connection string
- Confirmar IP whitelist en MongoDB Atlas
- Verificar credenciales de usuario

---

## 📞 Contacto

Para soporte técnico: hola@efficiency24.io

**¡Tu calculadora ROI está lista para producción! 🚀**