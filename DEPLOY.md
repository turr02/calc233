# Configuración para Producción

## Variables de Entorno Requeridas

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://tu-backend-url.com
```

### Backend (.env)
```
MONGO_URL=mongodb://tu-mongo-url/efficiency24_roi
DB_NAME=efficiency24_roi
GMAIL_EMAIL=hola@efficiency24.io
GMAIL_PASSWORD=tu-contraseña-aplicacion-gmail
```

## Deploy en Cloudflare Pages

1. **Conectar GitHub:**
   - Ve a Cloudflare Pages
   - Conecta tu repositorio de GitHub
   - Selecciona este proyecto

2. **Configuración de Build:**
   - Framework preset: `Create React App`
   - Build command: `cd frontend && yarn install && yarn build`
   - Build output directory: `frontend/build`
   - Root directory: `/` (dejar vacío)

3. **Variables de Entorno:**
   - `REACT_APP_BACKEND_URL`: URL de tu backend en producción

## Deploy del Backend

### Opción 1: Railway
1. Conecta tu repositorio
2. Selecciona la carpeta `backend`
3. Configura las variables de entorno
4. Deploy automático

### Opción 2: Render
1. Crear nuevo Web Service
2. Conectar repositorio
3. Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

### Opción 3: Heroku
```bash
# En la carpeta backend
heroku create tu-app-name
heroku config:set MONGO_URL=tu-mongo-url
heroku config:set DB_NAME=efficiency24_roi
heroku config:set GMAIL_EMAIL=hola@efficiency24.io
heroku config:set GMAIL_PASSWORD=tu-contraseña
git push heroku main
```

## Configuración CORS para Producción

Actualizar en `backend/server.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "https://tu-dominio.pages.dev",
        "https://tu-dominio-custom.com"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Base de Datos MongoDB

### MongoDB Atlas (Recomendado)
1. Crear cluster gratuito en MongoDB Atlas
2. Configurar IP whitelist (0.0.0.0/0 para desarrollo)
3. Crear usuario de base de datos
4. Obtener connection string
5. Actualizar MONGO_URL en variables de entorno

## SSL y Dominio Personalizado

1. **Cloudflare Pages:**
   - Configurar dominio personalizado
   - SSL automático incluido

2. **Backend:**
   - Configurar SSL en el servicio de hosting
   - Actualizar REACT_APP_BACKEND_URL con HTTPS