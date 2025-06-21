#!/bin/bash

echo "🚀 Deploy Script - Efficiency24 ROI Calculator"
echo "=============================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Este script debe ejecutarse desde el directorio frontend"
    exit 1
fi

echo "📦 Instalando dependencias..."
yarn install

echo "🔧 Ejecutando build de producción..."
yarn build

echo "✅ Build completado exitosamente!"
echo "📁 Los archivos están listos en: ./build"
echo ""
echo "📋 Próximos pasos:"
echo "1. Subir el código a GitHub"
echo "2. Conectar repositorio en Cloudflare Pages"
echo "3. Configurar build settings:"
echo "   - Build command: cd frontend && yarn build"
echo "   - Build output: frontend/build"
echo "4. Configurar variables de entorno de producción"
echo ""
echo "🌐 Backend debe estar deployado en tu servicio preferido"
echo "🔗 Actualizar REACT_APP_BACKEND_URL con la URL de producción"