# ⚡ CONFIGURACIÓN ESPECÍFICA CLOUDFLARE WORKERS & PAGES

## 🎯 Build Settings en Cloudflare Dashboard

### Framework preset: 
```
Create React App
```

### Build command:
```
cd frontend && yarn install && DISABLE_ESLINT_PLUGIN=true yarn build
```

### Build output directory:
```
frontend/build
```

### Root directory:
```
(dejar vacío)
```

### Environment variables:
```
DISABLE_ESLINT_PLUGIN = true
NODE_VERSION = 18
```

## 📧 Configuración Email MailChannels

### 1. DNS Records (Opcional pero recomendado)
Agregar en Cloudflare DNS:

```
Tipo: TXT
Nombre: @
Valor: v=spf1 a mx include:relay.mailchannels.net ~all

Tipo: TXT  
Nombre: _dmarc
Valor: v=DMARC1; p=none; rua=mailto:dmarc-reports@tu-dominio.com
```

### 2. DKIM (Opcional)
```
Tipo: TXT
Nombre: mailchannels._domainkey
Valor: v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
```

## 🔧 URLs después del deploy

### Development/Testing:
- **Frontend**: `https://efficiency24-roi-calculator.pages.dev`
- **API Submit**: `https://efficiency24-roi-calculator.pages.dev/api/submit-roi`
- **API Calculate**: `https://efficiency24-roi-calculator.pages.dev/api/calculate-roi`

### Production (con dominio personalizado):
- **Frontend**: `https://calculadora.efficiency24.com`
- **API Submit**: `https://calculadora.efficiency24.com/api/submit-roi`

## 🚨 Cosas importantes a verificar

### ✅ Antes del deploy:
- [ ] Repositorio en GitHub actualizado
- [ ] Todas las funciones en carpeta `functions/api/`
- [ ] Logo SVG en `frontend/public/`
- [ ] Build command correcto
- [ ] Output directory correcto

### ✅ Después del deploy:
- [ ] Frontend carga correctamente
- [ ] Logo Efficiency24 visible
- [ ] Formulario funciona
- [ ] API functions responden
- [ ] Email llega a hola@efficiency24.io
- [ ] Página de confirmación se muestra

## 🔄 Testing Post-Deploy

### 1. Test Frontend
```
https://tu-dominio.pages.dev
```
- Verificar carga
- Verificar responsive
- Verificar logo

### 2. Test API
```bash
curl -X POST https://tu-dominio.pages.dev/api/submit-roi \
  -H "Content-Type: application/json" \
  -d '{
    "calculation_input": {...},
    "calculation_output": {...},
    "contact_info": {
      "nombre_completo": "Test",
      "empresa": "Test Co",
      "email": "test@test.com"
    }
  }'
```

### 3. Test Email
- Completar formulario completo
- Verificar email en hola@efficiency24.io
- Verificar página confirmación

## 🎯 Optimizaciones Post-Deploy

### Performance:
- Cloudflare CDN automático ✅
- Compresión Gzip automática ✅
- SSL automático ✅

### Analytics:
- Activar Web Analytics en Cloudflare
- Monitorear Workers Analytics
- Configurar alertas

### Custom Domain:
- Configurar en Pages settings
- Actualizar DNS CNAME
- SSL automático

---

## 📞 Soporte

Si hay problemas durante el deploy:
1. Verificar logs en Cloudflare Pages
2. Revisar Functions logs en Workers
3. Contactar: hola@efficiency24.io

**🎉 ¡Tu calculadora ROI estará disponible globalmente en minutos!**