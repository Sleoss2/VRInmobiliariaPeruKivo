# 🚀 GUÍA DE DESPLIEGUE - Tour AR Inmobiliaria

**Versión:** 1.0.0  
**Último actualizado:** Noviembre 16, 2024

---

## 📋 Tabla de Contenidos

1. [Despliegue Rápido](#despliegue-rápido)
2. [Opciones de Hosting](#opciones-de-hosting)
3. [Configuración Pre-Despliegue](#configuración-pre-despliegue)
4. [Verificación Post-Despliegue](#verificación-post-despliegue)
5. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
6. [Troubleshooting](#troubleshooting)

---

## ⚡ Despliegue Rápido

### Opción 1: Netlify (RECOMENDADO ✅)

**Ventajas:**
- ✅ Despliegue automático desde GitHub
- ✅ CDN global gratuito
- ✅ HTTPS automático
- ✅ Preview URLs para testing
- ✅ Fácil de configurar

**Pasos:**

```bash
# 1. Asegurarse que código está en GitHub
git status
git add .
git commit -m "Tour AR Inmobiliaria v1.0.0"
git push origin main

# 2. Ir a https://netlify.com
# 3. Sign up con GitHub
# 4. Click "New site from Git"
# 5. Seleccionar: VRInmobiliariaPeruKivo
# 6. Configurar:
#    - Build command: (dejar vacío)
#    - Publish directory: public
#    - Environment variables: (ninguno necesario)
# 7. Click "Deploy site"

# 8. URL será: https://[nombre-aleatorio].netlify.app
```

**Resultado:**
```
URL: https://dreomehome.netlify.app (o personalizado)
SSL: ✅ HTTPS automático
Performance: ✅ CDN global
```

### Opción 2: Vercel (Alternativa Rápida)

**Ventajas:**
- ✅ Optimizado para Next.js (si lo usas después)
- ✅ Edge Functions (serverless)
- ✅ Analítica integrada

**Pasos:**

```bash
# 1. Instalar Vercel CLI
npm install -g vercel
# o
yarn global add vercel

# 2. Deployar
vercel --prod

# 3. Seguir prompts
# 4. Seleccionar: public como raíz

# Resultado: https://[nombre].vercel.app
```

### Opción 3: GitHub Pages (Gratis, Pero Limitado)

**Ventajas:**
- ✅ Completamente gratis
- ✅ Integrado con GitHub

**Desventajas:**
- ❌ Sin CI/CD automático
- ❌ No permite redirects dinámicas (importante para SPA)

```bash
# 1. Crear rama gh-pages
git checkout --orphan gh-pages

# 2. Copiar archivos
cp -r public/* .

# 3. Commit
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# 4. En GitHub → Settings → Pages
#    Source: gh-pages branch
#    Root: / (root)

# URL: https://sleoss2.github.io/VRInmobiliariaPeruKivo
```

---

## 🏢 Opciones de Hosting

### Comparativa

| Servicio | Costo | CDN | HTTPS | CI/CD | Recomendación |
|----------|-------|-----|-------|-------|--------------|
| **Netlify** | $0/mes | ✅ | ✅ | ✅ | ⭐ **MEJOR** |
| **Vercel** | $0/mes | ✅ | ✅ | ✅ | ✅ Bueno |
| **GitHub Pages** | $0/mes | ⚠️ | ✅ | ❌ | ⚠️ Limitado |
| **AWS S3+CF** | $1-10/mes | ✅ | ✅ | ❌ | Avanzado |
| **Servidor propio** | $5+/mes | ❌ | ⚠️ | ✅ | Complejo |

---

## 🔧 Configuración Pre-Despliegue

### Checklist Pre-Produción

- [ ] Código en GitHub
- [ ] Todos los modelos GLB en `public/models/`
- [ ] `public/ar.html` existe y funciona
- [ ] `public/js/ar-config.js` actualizado
- [ ] `public/js/ar-controller.js` sin errores
- [ ] `public/index.html` apunta a `/ar.html`
- [ ] No hay console.error() críticos
- [ ] FPS > 30 en móvil
- [ ] Probado en Chrome + Safari
- [ ] Modelos < 500 KB cada uno

### Validar Localmente

```bash
# 1. Ir a carpeta proyecto
cd d:\Bun1

# 2. Ejecutar servidor
bun run start

# 3. Probar en desktop
# Desktop: http://localhost:3000/ar.html

# 4. Probar en móvil
# Móvil: http://<tu-ip>:3000/ar.html
# (Reemplazar <tu-ip> con tu IP local)

# 5. Abrir Console (F12)
# Buscar errores rojo

# 6. Verificar modelos cargan
# Esperar 2-3 segundos
# Debe aparecer modelo 3D

# 7. Probar interacción
# - Tocar modelo
# - Cambiar propiedad
# - Ver información
# - Botones de contacto

# 8. Revisar performance
# F12 → Performance → Record → Interact → Stop
# Debe estar > 30 FPS constante
```

### Variables de Entorno (Si Aplica)

```bash
# .env (crear si no existe)
VITE_API_URL=https://api.dreomehome.com
VITE_ANALYTICS=true
VITE_GA_ID=UA-XXXXXXXXX-X
```

### Archivo de Configuración Netlify

**Crear: `netlify.toml`**

```toml
[build]
  command = "echo 'Static site - no build needed'"
  publish = "public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "bun run start"
  port = 3000

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    X-XSS-Protection = "1; mode=block"
```

### Archivo de Configuración Vercel

**Crear: `vercel.json`**

```json
{
  "buildCommand": "echo 'Static site'",
  "outputDirectory": "public",
  "framework": null,
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/models/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## ✅ Verificación Post-Despliegue

### Inmediato (Después de Deploy)

```bash
# 1. Verificar sitio está UP
curl -I https://dreomehome.netlify.app
# Debe retornar: HTTP 200 OK

# 2. Verificar HTTPS
# Debe mostrar candado verde

# 3. Verificar landing page
https://dreomehome.netlify.app/

# 4. Verificar página AR
https://dreomehome.netlify.app/ar.html

# 5. Revisar Console (F12)
# Sin errores rojo críticos

# 6. Probar en móvil real
# Abrir URL en móvil
# Permitir cámara
# Debe cargar en 2-3 segundos
```

### Testing en Móvil

```bash
# 1. Usar ngrok para exponer local
# (Útil para testing antes de publicar)
npm install -g ngrok
ngrok http 3000

# 2. Obtener URL pública
# https://abc123.ngrok.io

# 3. Compartir enlace
# QR: ngrok.com/ngrok-links
# o copiar URL y enviar

# 4. Probar en múltiples dispositivos:
# - iPhone (Safari)
# - Android (Chrome)
# - Tablet
# - Diferentes conexiones (WiFi, 4G)
```

### Métrica de Performance

```bash
# Usar Google PageSpeed Insights
# https://pagespeed.web.dev/

# Ingresar: https://dreomehome.netlify.app/ar.html

# Debe mostrar:
# - Performance: > 80
# - Accessibility: > 80
# - Best Practices: > 80
# - SEO: > 80

# Si está bajo, optimizar:
# - Comprimir imágenes
# - Minificar CSS/JS
# - Cache mejor
```

---

## 📊 Monitoreo y Mantenimiento

### Monitoreo Continuo

```bash
# 1. Configurar uptime monitoring
# Usar: Uptime Robot (gratis)
# https://uptimerobot.com
# - Monitor: https://dreomehome.netlify.app
# - Frecuencia: cada 5 minutos
# - Alertas: por email

# 2. Configurar alertas de error
# Usar: Sentry (gratis para proyectos pequeños)
# https://sentry.io
# Agregar a ar.html:

<script src="https://browser.sentry-cdn.com/7.84.0/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: "https://your@sentry.io/..." });
</script>

# 3. Ver logs de despliegue
# Netlify: Dashboard → Deploys
# Vercel: Dashboard → Deployments
```

### Actualizar Código

```bash
# 1. Hacer cambios locales
# Editar archivos

# 2. Verificar localmente
bun run start
# Probar en http://localhost:3000/ar.html

# 3. Commit cambios
git add .
git commit -m "Describe changes"

# 4. Push a GitHub
git push origin main

# 5. Automático: Netlify detecta cambios
# - Ejecuta build
# - Despliega nueva versión
# - URL: https://dreomehome.netlify.app

# 6. Ver estado
# Netlify Dashboard → Deploys
# Estado: Publishing → Published ✅
```

### Versioning

```bash
# Mantener versiones en Git
git tag v1.0.0
git push origin v1.0.0

# Ver historial
git tag

# Revertir si es necesario
git checkout v1.0.0
git push -f origin HEAD:main
```

---

## 🐛 Troubleshooting

### Problema: 404 Error en ar.html

**Síntomas:**
```
GET /ar.html → 404 Not Found
```

**Soluciones:**
```bash
# 1. Verificar archivo existe
ls -la public/ar.html

# 2. Verificar configuración Netlify
# Debe tener redirect en netlify.toml:
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# 3. Redeploy forzado
# Netlify Dashboard → Deploys → Trigger deploy
```

### Problema: Modelos No Cargan

**Síntomas:**
```
Console: Error loading model
Red sphere o modelo genérico
```

**Soluciones:**
```bash
# 1. Verificar ruta en ar-config.js
# Debe ser: 'models/casa.glb'
# NO: '/models/casa.glb' (sin barra inicial)
# NO: 'public/models/casa.glb'

# 2. Verificar archivo existe
ls -la public/models/

# 3. Verificar tamaño
du -h public/models/casa.glb
# Debe ser < 1 MB

# 4. Validar GLB
# https://gltf.report
# Upload: casa.glb
# Debe mostrar: ✓ Valid

# 5. Redeploy
# Netlify Dashboard → Trigger deploy
```

### Problema: Cámara No Funciona

**Síntomas:**
```
Pantalla negra
Console: getUserMedia error
```

**Soluciones:**
```bash
# 1. Usar HTTPS
# Local: http://localhost OK
# Remoto: HTTPS requerido

# 2. Verificar permisos
# Móvil: Settings → App → Camera → Allow

# 3. Validar navegador
# Safari: Settings → Website → Camera

# 4. Probar otro navegador
# Safari + Chrome

# 5. Reiniciar navegador
# Cerrar y abrir
```

### Problema: Bajo Rendimiento

**Síntomas:**
```
FPS < 15
Stuttering/lag
```

**Soluciones:**
```bash
# 1. Reducir escala modelo
# ar-config.js:
scale: { x: 0.5, y: 0.5, z: 0.5 } // Reducir

# 2. Desactivar sombras
# ar.html:
castShadow: false

# 3. Comprimir modelo
npm install -g gltf-transform
gltf-transform compress casa.glb casa-compressed.glb

# 4. Usar DevTools
# F12 → Performance → Profile
# Identificar bottleneck
```

### Problema: CORS Error

**Síntomas:**
```
Console: CORS policy error
Models not loading
```

**Soluciones:**
```bash
# 1. Verificar headers en servidor
# Netlify: Automático (OK)
# Vercel: Automático (OK)

# 2. Si servidor propio:
# Agregar header:
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type

# 3. Usar HTTPS en ambos lados
# Seguridad: https → https
```

---

## 📈 Post-Despliegue

### Marketing

```bash
# 1. Crear QR del sitio
# https://qr-code-generator.com
# Input: https://dreomehome.netlify.app/ar.html

# 2. Compartir en redes
# Instagram: "Ver propiedades en AR 📱🏠"
# LinkedIn: "Realidad Aumentada inmobiliaria"
# WhatsApp: Compartir link

# 3. Enviar a clientes
# Email: Link corto + instrucciones

# 4. Crear link corto
# https://bitly.com
# https://bit.ly/dreomehome-ar
```

### Análisis

```bash
# 1. Ver eventos de analytics
# Bun Server: http://localhost:3000/api/analytics/session
# Ver sesiones, interacciones, gestos

# 2. Usar Google Analytics (opcional)
# Agregar a ar.html:

<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## 📝 Checklist Final

Pre-Despliegue:
- [ ] Código en GitHub
- [ ] README actualizado
- [ ] Documentación completa
- [ ] Testeado en móvil real
- [ ] Sin errores críticos
- [ ] Performance OK (> 30 FPS)

Post-Despliegue:
- [ ] Sitio UP y accesible
- [ ] HTTPS funcionando
- [ ] Modelos cargan
- [ ] AR funciona en móvil
- [ ] Contactos funcionan
- [ ] Analytics registra
- [ ] Monitoreo activado
- [ ] Backup realizado

---

## 🔗 Enlaces Útiles

```
Hosting
├── Netlify: https://netlify.com
├── Vercel: https://vercel.com
└── GitHub Pages: https://pages.github.com

Herramientas
├── ngrok: https://ngrok.com
├── Sentry: https://sentry.io
├── Uptime Robot: https://uptimerobot.com
└── GLTF Report: https://gltf.report

Performance
├── PageSpeed Insights: https://pagespeed.web.dev
├── Lighthouse: Chrome DevTools
└── WebPageTest: https://webpagetest.org
```

---

## 🎉 ¡Listo!

Tu Tour AR Inmobiliaria está en línea y funcionando. 🚀

**Próximos pasos:**
1. Compartir link con clientes
2. Monitorear performance
3. Recopilar feedback
4. Iterar y mejorar

---

**Última actualización:** Noviembre 16, 2024  
**Versión:** 1.0.0

