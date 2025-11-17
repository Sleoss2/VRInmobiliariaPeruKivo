/**
 * EJEMPLOS DE USO - Tour AR Inmobiliaria
 * Casos de uso comunes y snippets de código
 */

// ============================================================================
// 📱 EJEMPLO 1: ACCESO BÁSICO
// ============================================================================

// Abrir navegador en móvil y navegar a:
// https://dreomehome.com/ar.html

// El sistema automáticamente:
// 1. Solicita permiso de cámara
// 2. Carga la escena AR
// 3. Muestra instrucciones iniciales
// 4. Carga el primer modelo (Casa Moderna)


// ============================================================================
// 🏠 EJEMPLO 2: AGREGAR NUEVA PROPIEDAD
// ============================================================================

// ARCHIVO: public/js/ar-config.js
// Buscar el array 'properties' y agregar:

{
  id: 'penthouse-lomas',
  name: '👑 Penthouse Lomas de San Isidro',
  type: 'Residencial Premium',
  modelPath: 'models/penthouse.glb',
  scale: { x: 0.9, y: 0.9, z: 0.9 },
  position: { x: 0, y: 0, z: 0 },
  price: 'S/ 1,200,000',
  area: '250 m²',
  bedrooms: 4,
  bathrooms: 3.5,
  features: [
    'Piscina privada',
    'Jacuzzi',
    'Terraza 360°',
    'Cine privado',
    'Vinería',
    'Spa'
  ],
  contact: '+51 987 654 999',
  description: 'Penthouse de lujo con vistas espectaculares a la ciudad. Acabados Premium con tecnología smart home.',
  color: '#FFD700' // Oro
}

// Luego crear el modelo GLB:
// 1. Usar Blender o SketchUp para crear
// 2. Exportar como GLB
// 3. Colocar en public/models/penthouse.glb
// 4. Optimizar si es necesario


// ============================================================================
// 🎮 EJEMPLO 3: CONTROLES DESDE CONSOLA
// ============================================================================

// Abierto F12 → Console, puedes ejecutar:

// Ver todas las propiedades
console.log(AR_CONFIG.properties);

// Cambiar a una propiedad específica
arController.loadProperty(AR_CONFIG.properties[1]); // Departamento

// Ver propiedad actual
console.log(arController.currentProperty);

// Mostrar información manualmente
arController.showPropertyInfo(arController.currentProperty);

// Cerrar panel de información
arController.closePropertyInfo();

// Cambiar escala del modelo (hacerlo más grande)
document.querySelector('.ar-model').setAttribute('scale', '2 2 2');

// Cambiar posición
document.querySelector('.ar-model').setAttribute('position', '0 1 0');

// Remover animación de rotación
document.querySelector('.ar-model').removeAttribute('animation');

// Ver información de escena
console.log(arController.scene);

// Rastrear evento personalizado
arController.trackEvent('Custom_Event', {
  propertyId: 'casa-moderna',
  customData: 'mi dato'
});


// ============================================================================
// 🌍 EJEMPLO 4: PERSONALIZAR COLORES
// ============================================================================

// ARCHIVO: public/ar.html (CSS)
// Cambiar gradiente de botones:

.control-btn {
  /* Cambiar de: */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  /* A: */
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); // Rojo-Naranja
  /* O */
  background: linear-gradient(135deg, #00D4FF 0%, #0099FF 100%); // Azul
  /* O */
  background: linear-gradient(135deg, #00FF87 0%, #60EFFF 100%); // Verde-Cyan
}

// Cambiar color del panel de información:
.info-header {
  /* Agregar color personalizado: */
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
}


// ============================================================================
// 📞 EJEMPLO 5: INTEGRACIONES SOCIALES
// ============================================================================

// Los botones de contacto ya están implementados:

// LLAMADA TELEFÓNICA
// Botón: 📞 Llamar
// Acción: window.location.href = `tel:${phone}`;
// Efecto: Abre la app telefónica del móvil

// WHATSAPP
// Botón: 💬 WhatsApp
// Acción: Abre WhatsApp con mensaje preformulado
const message = "Hola! 👋 Me interesa la propiedad: Casa Moderna. ¿Podrías enviarme más información? 🏠";
const encodedMessage = encodeURIComponent(message);
window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');

// EMAIL
// Botón: ✉️ Email
// Acción: Abre cliente de correo con asunto y cuerpo
const subject = encodeURIComponent('Consulta: Casa Moderna');
const body = encodeURIComponent('Hola,\n\nMe interesa conocer más sobre la propiedad: Casa Moderna\n\nQuedo atenta.\n\nSaludos');
window.location.href = `mailto:info@dreomehome.com?subject=${subject}&body=${body}`;


// ============================================================================
// 🎯 EJEMPLO 6: CASO DE USO - AGENTE INMOBILIARIO
// ============================================================================

/**
 * Escenario: Un agente inmobiliario muestra una propiedad a un cliente
 */

// PASO 1: Abrir ar.html en móvil
// https://dreomehome.com/ar.html

// PASO 2: Esperar que carga la escena (2-3 segundos)

// PASO 3: Posicionar la cámara en una superficie plana
// El cliente apunta el móvil al piso o mesa

// PASO 4: Interactuar
// - El cliente ve el modelo 3D de la casa
// - Puede rotarlo (toca y arrastra)
// - Puede acercarse/alejarse (pinch zoom)
// - Puede caminar alrededor (realidad aumentada)

// PASO 5: Ver detalles
// - Tocar el modelo muestra panel de información
// - Panel incluye: precio, área, habitaciones, características
// - Botones de contacto para seguimiento

// PASO 6: Contacto
// - Cliente toca "WhatsApp"
// - Se abre chat con mensaje preformulado
// - Agente recibe consulta


// ============================================================================
// 🏢 EJEMPLO 7: CASO DE USO - PORTAL INMOBILIARIO
// ============================================================================

/**
 * Escenario: Portal web de propiedades con enlace a AR
 */

// HTML en página de detalles de propiedad:
/*
<div class="property-details">
  <h1>Casa Moderna en La Molina</h1>
  <p>Descripción...</p>
  
  <!-- Botón de AR -->
  <a href="/ar.html?property=casa-moderna" class="btn-ar">
    📱 Ver en Realidad Aumentada
  </a>
  
  <!-- Otros botones -->
  <a href="/vr.html" class="btn-vr">🥽 Ver en Realidad Virtual</a>
</div>
*/

// JavaScript para manejar parámetros URL:
function getPropertyFromURL() {
  const params = new URLSearchParams(window.location.search);
  const propertyId = params.get('property');
  
  if (propertyId) {
    const property = getPropertyById(propertyId);
    arController.loadProperty(property);
  }
}


// ============================================================================
// 🎨 EJEMPLO 8: PERSONALIZAR ANIMACIONES
// ============================================================================

// ARCHIVO: public/js/ar-config.js

// Cambiar velocidad de rotación (en ms):
animations: {
  rotation: {
    property: 'rotation',
    to: '0 360 0',
    loop: true,
    dur: 10000,  // 10 segundos (más rápido)
    easing: 'linear'
  }
}

// Agregar animación de "bobbing" (oscilación):
animations: {
  bobbing: {
    property: 'position',
    from: '0 0 0',
    to: '0 0.5 0',
    loop: true,
    dur: 3000,
    easing: 'easeInOutQuad'
  }
}

// En ar-controller.js, aplicar:
const model = document.querySelector('.ar-model');
model.setAttribute('animation__bobbing', AR_CONFIG.animations.bobbing);


// ============================================================================
// 📊 EJEMPLO 9: ANALÍTICA PERSONALIZADA
// ============================================================================

// Rastrear cuando usuario toca modelo:
function trackPropertyInteraction(propertyId) {
  arController.trackEvent('Property_Interaction', {
    propertyId: propertyId,
    action: 'clicked',
    timestamp: Date.now(),
    deviceType: /Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
  });
}

// Rastrear tiempo de visualización:
const viewStartTime = Date.now();
arController.trackEvent('Property_View_End', {
  propertyId: arController.currentProperty.id,
  viewDuration: Date.now() - viewStartTime,
  propertyName: arController.currentProperty.name
});

// Rastrear flujo de usuario:
arController.trackEvent('User_Flow', {
  action: 'navigated_to_next_property',
  from: 'casa-moderna',
  to: 'depa-ejecutivo',
  sequence: arController.currentPropertyIndex
});


// ============================================================================
// 🔄 EJEMPLO 10: CREAR MÚLTIPLES MARCADORES
// ============================================================================

// Si quieres usar marcadores de imagen (en lugar de detección de plano):

// ARCHIVO: public/ar.html
/*
<a-scene
  arjs="sourceType: webcam; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960; trackingMethod: best;"
>
  <!-- Marcador 1: Casa -->
  <a-marker
    markerhandlerprofile="profile:image"
    reference-space="local"
    type="pattern"
    url="assets/marker-casa.patt"
  >
    <a-entity gltf-model="url(models/casa.glb)" scale="0.8 0.8 0.8"></a-entity>
  </a-marker>
  
  <!-- Marcador 2: Departamento -->
  <a-marker
    markerhandlerprofile="profile:image"
    reference-space="local"
    type="pattern"
    url="assets/marker-depa.patt"
  >
    <a-entity gltf-model="url(models/depa.glb)" scale="0.8 0.8 0.8"></a-entity>
  </a-marker>
</a-scene>
*/

// Generar marcadores en: https://ar-js-org.github.io/AR.js/three.js/examples/pattern-generator/


// ============================================================================
// 🌐 EJEMPLO 11: DESPLEGAR EN NETLIFY
// ============================================================================

/*
1. Crear archivo netlify.toml en raíz:

[build]
  command = "echo 'Static site - no build needed'"
  publish = "public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

2. Push a GitHub
3. Conectar repo a Netlify
4. Despliegue automático en cada push

El sitio estará en: https://tu-proyecto.netlify.app
*/


// ============================================================================
// 🔐 EJEMPLO 12: SEGURIDAD Y PERMISOS
// ============================================================================

// Verificar permisos de cámara:
async function checkCameraPermission() {
  try {
    const permission = await navigator.permissions.query({ name: 'camera' });
    if (permission.state === 'denied') {
      console.log('Cámara denegada');
    } else if (permission.state === 'granted') {
      console.log('Cámara permitida');
    }
  } catch (err) {
    console.log('Verificación de permisos no soportada');
  }
}

// Manejar error de cámara:
navigator.mediaDevices.getUserMedia({ video: true })
  .catch(err => {
    if (err.name === 'NotAllowedError') {
      console.log('Usuario negó acceso a cámara');
    } else if (err.name === 'NotFoundError') {
      console.log('No hay cámara disponible');
    }
  });


// ============================================================================
// 📦 EJEMPLO 13: CREAR MODELO DESDE BLENDER
// ============================================================================

/*
1. Abrir Blender
2. Crear objeto 3D (ej: cubo, casa, etc)
3. Agregar texturas y materiales
4. Optimizar:
   - Reducir polígonos
   - Bake texturas si es necesario
   - Remover objetos invisibles
5. File > Export As > glTF 2.0 (.glb)
6. Configurar opciones:
   - Format: glB Binary (.glb)
   - Include: All relevant options
7. Guardar en: public/models/
8. Validar en: https://gltf.report
9. Comprimir si es necesario:
   npx gltf-transform compress model.glb model-compressed.glb
*/


// ============================================================================
// 🧪 EJEMPLO 14: TESTING EN DISPOSITIVOS
// ============================================================================

/*
Testing en Desktop:
1. F12 para abrir DevTools
2. Ctrl+Shift+M para modo móvil
3. Seleccionar dispositivo (iPhone 12, Pixel 5, etc)
4. Probar interacciones

Testing en Móvil Real:
1. Abrir terminal: ipconfig (Windows) o ifconfig (Mac/Linux)
2. Obtener IP local (ej: 192.168.1.100)
3. En móvil: http://192.168.1.100:3000/ar.html
4. Permitir cámara cuando lo solicite
5. Probar en diferentes orientaciones (portrait/landscape)
6. Medir FPS: F12 → Performance tab

Dispositivos Recomendados:
- iPhone 11+
- Samsung Galaxy S10+
- Google Pixel 4+
*/


// ============================================================================
// 📈 EJEMPLO 15: MÉTRICAS DE PERFORMANCE
// ============================================================================

// Medir tiempo de carga:
const startTime = performance.now();
arController.init();
const endTime = performance.now();
console.log(`Tiempo de carga: ${(endTime - startTime) / 1000} segundos`);

// Medir FPS:
let frameCount = 0;
const fpsStartTime = performance.now();

function measureFPS() {
  frameCount++;
  const elapsed = performance.now() - fpsStartTime;
  
  if (elapsed >= 1000) {
    const fps = frameCount;
    console.log(`FPS: ${fps}`);
    frameCount = 0;
    fpsStartTime = performance.now();
  }
  requestAnimationFrame(measureFPS);
}
measureFPS();

// Tamaño de modelo:
fetch('models/casa.glb')
  .then(res => res.blob())
  .then(blob => {
    const sizeKB = blob.size / 1024;
    console.log(`Tamaño modelo: ${sizeKB.toFixed(2)} KB`);
  });


// ============================================================================
// 🎓 RESUMEN DE MEJORES PRÁCTICAS
// ============================================================================

/*
✅ DO's (Haz esto):
- Usar modelos GLB optimizados (< 500 KB)
- Probar en dispositivos reales
- Verificar permisos de cámara
- Usar HTTPS en producción
- Optimizar imágenes y assets
- Documentar cambios
- Hacer commit frecuentes
- Monitorear performance

❌ DON'Ts (Evita esto):
- No usar modelos muy pesados (> 10 MB)
- No depender de conexión rápida
- No omitir manejo de errores
- No usar HTTP en producción
- No modificar HTML sin probar
- No hacer commits sin descripción
- No ignorar warnings en consola
- No desplegar sin testing
*/


// ============================================================================
// 🎯 CONCLUSIÓN
// ============================================================================

/*
El Tour AR Inmobiliario es una herramienta poderosa para:

1. AGENTES INMOBILIARIOS
   - Mostrar propiedades en tiempo real
   - Impresionar a clientes
   - Facilitar decisiones de compra
   - Generar seguimiento

2. CLIENTES
   - Ver propiedades desde casa
   - Explorar en detalle
   - Compartir con familia
   - Contactar fácilmente

3. DESARROLLADORES
   - Código limpio y modular
   - Fácil de personalizar
   - Bien documentado
   - Extensible

¡Gracias por usar Tour AR Inmobiliaria! 🚀
*/
