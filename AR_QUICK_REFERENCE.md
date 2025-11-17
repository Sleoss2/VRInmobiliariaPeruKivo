#!/usr/bin/env bash
# AR Inmobiliaria - Quick Reference Guide
# Este archivo contiene comandos y snippets útiles

# ============================================================================
# 🚀 INICIO RÁPIDO
# ============================================================================

# Iniciar servidor de desarrollo
bun run start

# Acceder desde desktop
# http://localhost:3000/ar.html

# Acceder desde móvil (reemplazar IP)
# http://192.168.1.100:3000/ar.html

# ============================================================================
# 📱 ENLACES PRINCIPALES
# ============================================================================

# Landing Page (Inicio)
http://localhost:3000/

# Experiencia VR
http://localhost:3000/vr.html

# Experiencia AR Inmobiliaria ⭐ (NUEVA)
http://localhost:3000/ar.html

# Test Dashboard
http://localhost:3000/integration-test.html

# ============================================================================
# 📁 ARCHIVOS PRINCIPALES (Tour AR)
# ============================================================================

# Entrada principal
public/ar.html

# Configuración de propiedades ⭐ EDITAR AQUÍ
public/js/ar-config.js

# Lógica de interacción
public/js/ar-controller.js

# Modelos 3D
public/models/
  ├── casa.glb      (150 KB)
  ├── depa.glb      (140 KB)
  └── oficina.glb   (160 KB)

# ============================================================================
# 🔧 TAREAS COMUNES
# ============================================================================

# 1. AGREGAR NUEVA PROPIEDAD
# ─────────────────────────────
# a) Editar public/js/ar-config.js
# b) Agregar objeto en array 'properties'
# c) Crear/obtener modelo GLB
# d) Colocar en public/models/
# e) Opcional: Optimizar con gltf-transform

# Ejemplo:
# {
#   id: 'nuevo-proyecto',
#   name: '🏗️ Nuevo Proyecto',
#   modelPath: 'models/nuevo.glb',
#   price: 'S/ 500,000',
#   // ... otros campos
# }

# 2. CAMBIAR PROPIEDAD POR DEFECTO
# ─────────────────────────────────
# En ar-controller.js, línea ~49:
# this.loadProperty(this.properties[0]); // Index de propiedad
#                                       // 0=Casa, 1=Depa, 2=Oficina

# 3. PERSONALIZAR COLORES
# ───────────────────────
# En ar.html, buscar:
# .control-btn { background: linear-gradient(...) }
# .info-header.vr/ar/test { background: ... }

# 4. CAMBIAR TEXTOS/ETIQUETAS
# ───────────────────────────
# En ar-config.js, sección 'ui':
# AR_CONFIG.ui.title = 'Nuevo título'
# AR_CONFIG.ui.instructionText = 'Nuevo texto'

# ============================================================================
# 📊 ESTRUCTURA JSON - PROPIEDADES
# ============================================================================

# Plantilla completa:
{
  "id": "identificador-unico",
  "name": "🏠 Nombre Propiedad",
  "type": "Residencial|Comercial|Departamento",
  "modelPath": "models/archivo.glb",
  "scale": { "x": 0.8, "y": 0.8, "z": 0.8 },
  "position": { "x": 0, "y": 0, "z": 0 },
  "price": "S/ 450,000",
  "area": "120 m²",
  "bedrooms": 3,
  "bathrooms": 2,
  "features": ["Característica 1", "Característica 2"],
  "contact": "+51 987 654 321",
  "description": "Descripción de la propiedad",
  "color": "#667eea"
}

# ============================================================================
# 🎮 API DE ARController
# ============================================================================

# Métodos principales (accesibles en consola):

arController.loadProperty(property)
# Carga una propiedad específica

arController.nextProperty()
# Cambia a siguiente propiedad

arController.previousProperty()
# Cambia a propiedad anterior

arController.showPropertyInfo(property)
# Muestra panel de información

arController.closePropertyInfo()
# Cierra panel de información

arController.toggleRotation()
# Alterna rotación automática

arController.shareProperty('Nombre Propiedad')
# Abre WhatsApp con mensaje preformulado

arController.callProperty('+51 987 654 321')
# Abre marcador telefónico

arController.trackEvent('EventName', { customData })
# Registra evento de analítica

# ============================================================================
# 🌐 JAVASCRIPT EN CONSOLA (F12)
# ============================================================================

# Ver configuración
AR_CONFIG

# Ver propiedades disponibles
AR_CONFIG.properties

# Cargar propiedad específica
arController.loadProperty(AR_CONFIG.properties[2])

# Ver propiedad actual
arController.currentProperty

# Ver índice actual
arController.currentPropertyIndex

# Cambiar escala del modelo
document.querySelector('.ar-model').setAttribute('scale', '1.5 1.5 1.5')

# Cambiar posición
document.querySelector('.ar-model').setAttribute('position', '0 0.5 0')

# Aplicar animación personalizada
document.querySelector('.ar-model').setAttribute('animation', 
  'property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear')

# Remover animación
document.querySelector('.ar-model').removeAttribute('animation')

# ============================================================================
# 🐛 DEBUGGING
# ============================================================================

# Ver logs en consola
console.log('Mensaje de debug')

# Activar AR.js debug (en ar.html)
# arjs="... debugUIEnabled: true;"

# Ver performance (FPS)
# Instalar stats.js y agregar a ar.html
<script src="https://cdnjs.cloudflare.com/ajax/libs/stats.js/r10/Stats.min.js"></script>

# Ver estado de cámara
arController.scene.systems.arjs

# ============================================================================
# 📦 MODELOS 3D
# ============================================================================

# Fuentes de modelos gratis:
# - Sketchfab: https://sketchfab.com
# - TurboSquid: https://www.turbosquid.com/search/3d-models/free
# - CGTrader Free: https://www.cgtrader.com
# - Free3D: https://free3d.com

# Crear desde Blender:
# 1. Crear modelo en Blender
# 2. File > Export > glTF 2.0 (.glb)
# 3. Copiar a public/models/

# Optimizar modelo:
npm install -g gltf-transform
gltf-transform compress model.glb model-optimized.glb

# Validar GLB:
# Usar https://gltf.report
# O validar localmente con gltf-transform

# ============================================================================
# 🚀 DEPLOYMENT
# ============================================================================

# Opción 1: Netlify (Recomendado)
# 1. Conectar repo a Netlify
# 2. Build command: (dejar vacío - es SPA estática)
# 3. Publish directory: public/
# 4. Deploy automático en cada push

# Opción 2: Vercel
# 1. vercel --prod
# 2. Seguir asistente

# Opción 3: GitHub Pages
git add .
git commit -m "Agregar Tour AR Inmobiliaria"
git push origin main

# ============================================================================
# 📱 TESTING EN DISPOSITIVOS REALES
# ============================================================================

# Obtener IP local (Windows - PowerShell)
ipconfig | Select-String "IPv4"

# Obtener IP local (Mac/Linux)
ifconfig | grep "inet "

# Acceder desde móvil
# http://<IP-LOCAL>:3000/ar.html

# Permitir permisos de cámara cuando lo pida el navegador

# ============================================================================
# 📊 ANALÍTICA
# ============================================================================

# Los eventos se registran automáticamente en:
# /api/analytics/event

# Ver eventos en backend (Bun)
# Revisar analyticsStore en index.js

# Eventos disponibles:
# - AR_Started
# - Property_Viewed
# - Contact_Initiated
# - etc.

# ============================================================================
# 🎯 REQUISITOS FUNCIONALES CUBIERTOS
# ============================================================================

# ✅ RF-01: Escaneo AR          → AR.js + cámara webcam
# ✅ RF-02: Visualización 3D    → gltf-model A-Frame
# ✅ RF-03: Interacción táctil  → click + panels
# ✅ RF-04: Rotación y zoom     → animaciones + gestos
# ✅ RF-05: Múltiples propiedades → botones next/prev
# ✅ RF-06: Accesible sin app   → navegador puro

# ============================================================================
# 💡 TIPS & TRICKS
# ============================================================================

# 1. Probar con modelo sin conexión:
#    Usar browser DevTools → Network → Offline
#    Los modelos en caché seguirán funcionando

# 2. Tomar screenshot:
#    En consola: arController.scene.screenshot()

# 3. Medir performance:
#    F12 → Performance tab → Record → Interactuar → Stop

# 4. Simular dispositivo móvil:
#    F12 → Ctrl+Shift+M → Seleccionar dispositivo

# 5. Cambiar velocidad de rotación:
#    Editar 'dur' en AR_CONFIG.animations.rotation
#    dur: 20000 = 20 segundos por vuelta

# ============================================================================
# 🔗 LINKS ÚTILES
# ============================================================================

# Documentación
A-Frame Docs:         https://aframe.io/docs
AR.js Docs:           https://ar-js-org.github.io/AR.js/
Three.js Docs:        https://threejs.org/docs
glTF 2.0 Spec:        https://khronos.org/gltf/

# Herramientas
Blender 3D:           https://www.blender.org
gltf-transform:       https://gltf-transform.donmccurdy.com
glTF Validator:       https://gltf.report

# Recursos
Sketchfab Models:     https://sketchfab.com
Poly Haven:           https://polyhaven.com

# Comunidades
A-Frame Slack:        https://aframe.io/community/
Three.js Discourse:   https://discourse.threejs.org

# ============================================================================
# 📝 VERSIONING
# ============================================================================

# Versión actual: 1.0.0
# Release date: Noviembre 2024
# Status: Completo y funcional

# Cambios recientes:
# - Implementación completa de Tour AR Inmobiliario
# - Soporte para 3 propiedades de prueba
# - Interfaz móvil optimizada
# - Integración con WhatsApp, Email, Teléfono
# - Analítica de eventos

# ============================================================================

# Last updated: 2024-11-16
# Maintained by: Sleoss2
