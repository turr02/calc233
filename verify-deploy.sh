#!/bin/bash

echo "🔍 VERIFICACIÓN PRE-DEPLOY - Efficiency24 ROI Calculator"
echo "======================================================="

# Verificar estructura de archivos
echo "📁 Verificando estructura de archivos..."

required_files=(
    "frontend/package.json"
    "frontend/src/App.js"
    "frontend/public/efficiency24-logo.svg"
    "functions/api/submit-roi.js"
    "functions/api/calculate-roi.js"
    "functions/_middleware.js"
    "cloudflare-pages.toml"
    "wrangler.toml"
    ".gitignore"
    "README.md"
    "CLOUDFLARE-DEPLOY.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - FALTA"
        exit 1
    fi
done

echo ""
echo "🏗️ Verificando build del frontend..."
cd frontend

# Verificar dependencias
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    yarn install
fi

# Verificar build
echo "🔨 Ejecutando build..."
if DISABLE_ESLINT_PLUGIN=true yarn build; then
    echo "✅ Build exitoso"
else
    echo "❌ Build falló"
    exit 1
fi

cd ..

echo ""
echo "🧪 Verificando configuración de Cloudflare..."

# Verificar cloudflare-pages.toml
if grep -q "cd frontend && yarn install && DISABLE_ESLINT_PLUGIN=true yarn build" cloudflare-pages.toml; then
    echo "✅ Build command correcto"
else
    echo "❌ Build command incorrecto"
    exit 1
fi

if grep -q "frontend/build" cloudflare-pages.toml; then
    echo "✅ Output directory correcto"
else
    echo "❌ Output directory incorrecto"
    exit 1
fi

echo ""
echo "📧 Verificando funciones de API..."

# Verificar que las funciones existen y tienen contenido
api_functions=("submit-roi.js" "calculate-roi.js")
for func in "${api_functions[@]}"; do
    if [ -s "functions/api/$func" ]; then
        echo "✅ functions/api/$func"
    else
        echo "❌ functions/api/$func - vacío o falta"
        exit 1
    fi
done

echo ""
echo "🎯 Verificando logo..."
if [ -f "frontend/public/efficiency24-logo.svg" ]; then
    if grep -q "Efficiency24" frontend/public/efficiency24-logo.svg; then
        echo "✅ Logo Efficiency24 presente"
    else
        echo "❌ Logo no contiene texto Efficiency24"
    fi
else
    echo "❌ Logo falta"
    exit 1
fi

echo ""
echo "📋 CHECKLIST FINAL:"
echo "✅ Archivos requeridos presentes"
echo "✅ Build de frontend funciona"
echo "✅ Configuración Cloudflare correcta"
echo "✅ Funciones API presentes"
echo "✅ Logo implementado"
echo ""
echo "🚀 ¡LISTO PARA DEPLOY EN CLOUDFLARE WORKERS & PAGES!"
echo ""
echo "📝 Próximos pasos:"
echo "1. git add . && git commit -m 'ready for deploy'"
echo "2. git push origin main"
echo "3. Configurar en Cloudflare Workers & Pages"
echo "4. Seguir guía en CLOUDFLARE-DEPLOY.md"
echo ""
echo "🌐 Una vez deployado, tu calculadora estará en:"
echo "   https://tu-repo.pages.dev"