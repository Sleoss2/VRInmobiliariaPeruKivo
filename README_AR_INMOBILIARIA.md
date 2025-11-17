# 🏠 DreamHome Real Estate - VR/AR Inmobiliaria Perú

Plataforma completa de realidad virtual y realidad aumentada para visualización inmobiliaria sin aplicación.

## 🌟 Características Principales

### 🥽 Experiencia VR (Realidad Virtual)
- Tours inmersivos de propiedades 360°
- Controles gestuales con mano (hand tracking)
- Navegación intuitiva por habitaciones
- Interacción con objetos 3D
- Rastreo de performance y analítica

### 📱 Tour AR Inmobiliario ⭐ (NUEVO - Realidad Aumentada)
- **Visualización 3D en tiempo real** - Modelos superpuestos en el mundo real
- **Sin app requerida** - Funciona en navegador (Chrome, Safari, Firefox)
- **Múltiples propiedades** - Casa, departamento, oficina
- **Interacción táctil** - Toca para ver información
- **Integración social** - Compartir por WhatsApp, Email, Teléfono
- **Responsive** - Optimizado para todos los móviles

### 🧪 Dashboard de Testing
- Validación de módulos
- Testing de APIs
- Métricas de performance
- Exportación de datos

---

## 📋 Tablas de Rastreabilidad

### Requisitos Funcionales (RF)

| ID | Requisito | Descripción | Prioridad | Estado |
|----|-----------|-----------|-----------|-----------  |
| RF-01 | Escaneo AR | Usuario abre web y cámara detecta entorno | 🔴 Alta | ✅ Completo |
| RF-02 | Visualización 3D | Modelo 3D de propiedad en escala real | 🔴 Alta | ✅ Completo |
| RF-03 | Interacción táctil | Tocar habitación/mueble muestra info | 🔴 Alta | ✅ Completo |
| RF-04 | Rotación y zoom | Girar, acercar, caminar alrededor | 🟡 Media | ✅ Completo |
| RF-05 | Múltiples propiedades | Botón para cambiar 2-3 modelos | 🟡 Media | ✅ Completo |
| RF-06 | Accesible sin app | Funciona en celular sin app (iOS/Android) | 🔴 Alta | ✅ Completo |

### Requisitos No Funcionales (RNF)

| ID | Requisito | Target | Estado |
|----|-----------|--------|--------|
| RNF-01 | Compatibilidad | +90% dispositivos modernos | ✅ Cumple |
| RNF-02 | Rendimiento | <5s carga, 60 FPS | ✅ Cumple |
| RNF-03 | Tamaño modelo | GLB < 10 MB | ✅ Cumple (~450 KB total) |
| RNF-04 | Hosting | Gratuito (Netlify/Vercel) | ✅ Cumple |
| RNF-05 | Código abierto | GitHub con README | ✅ Cumple |

---

## 🗂️ Estructura del Proyecto

```
dreamhome-vr/
│
├── public/                           # Archivos estáticos
│   ├── index.html                    # Landing page principal ⭐
│   ├── ar.html                       # 🎯 Tour AR Inmobiliario (NUEVO)
│   ├── vr.html                       # Experiencia VR
│   ├── integration-test.html         # Test dashboard
│   ├── quick-test.html               # Test rápido
│   │
│   ├── js/                           # Scripts JavaScript
│   │   ├── ar-config.js              # 🔧 Configuración AR (EDITAR AQUÍ)
│   │   ├── ar-controller.js          # 🎮 Lógica AR
│   │   ├── experience-navigator.js   # Navegación VR
│   │   ├── gesture-recognizer.js     # Reconocimiento de gestos
│   │   ├── hand-pose-tracker.js      # Hand tracking
│   │   ├── input-handler.js          # Manejo de entrada
│   │   ├── model-loader.js           # Carga de modelos
│   │   ├── performance-profiler.js   # Profiling
│   │   ├── scene-manager.js          # Gestión de escena
│   │   └── types.d.ts                # Definiciones TypeScript
│   │
│   ├── models/                       # Modelos 3D (GLB)
│   │   ├── casa.glb                  # Modelo casa (150 KB)
│   │   ├── depa.glb                  # Modelo departamento (140 KB)
│   │   └── oficina.glb               # Modelo oficina (160 KB)
│   │
│   └── assets/                       # Recursos
│       └── marker.png                # Marcador AR (opcional)
│
├── docs/                             # Documentación
│   └── DEVELOPER_GUIDE.md            # Guía para desarrolladores
│
├── index.js                          # Servidor Bun
├── generate_models.py                # 🐍 Script para generar modelos GLB
│
├── AR_IMMOBILIARIA_GUIDE.md          # 📖 Documentación completa AR
├── AR_QUICK_REFERENCE.md             # ⚡ Referencia rápida
├── package.json                      # Dependencias
├── README.md                         # Este archivo
└── .gitignore
```

---

## 🚀 Inicio Rápido

### Opción 1: Instalación Local (Recomendado)

```bash
# 1. Clonar repositorio
git clone https://github.com/Sleoss2/VRInmobiliariaPeruKivo.git
cd VRInmobiliariaPeruKivo

# 2. Instalar dependencias (opcional, usar Bun)
bun install

# 3. Ejecutar servidor
bun run start
# o
bun index.js

# 4. Abrir en navegador
# Desktop: http://localhost:3000
# Móvil:   http://<tu-ip>:3000/ar.html
```

### Opción 2: Acceso en Línea
```
https://dreomehome.com         # Landing page
https://dreomehome.com/ar.html # Tour AR Inmobiliario ⭐
```

---

## 📱 Cómo Usar Tour AR Inmobiliario

### Pasos para Usuarios

1. **Abrir en móvil:**
   ```
   Navega a: https://dreomehome.com/ar.html
   ```

2. **Permitir cámara:**
   - El navegador solicitará permiso
   - Presiona "Permitir"

3. **Posicionar cámara:**
   - Apunta a una superficie plana (piso, mesa)
   - Espera a que AR.js detecte el plano

4. **Interactuar:**
   - 👆 **Tocar modelo** → Ver información
   - ⬅️ **Botón izquierda** → Propiedad anterior
   - ➡️ **Botón derecha** → Siguiente propiedad
   - ℹ️ **Botón info** → Detalles completos
   - 🔄 **Botón rotar** → Alternar rotación automática

5. **Contactar:**
   - 📞 **Llamar** → Abre marcador telefónico
   - 💬 **WhatsApp** → Mensaje preformulado
   - ✉️ **Email** → Cliente de correo

---

## 🔧 Configuración para Desarrolladores

### Agregar Nueva Propiedad

**Archivo:** `public/js/ar-config.js`

```javascript
// Agregar al array 'properties'
{
  id: 'casa-nueva',
  name: '🏠 Casa Nueva',
  type: 'Residencial',
  modelPath: 'models/casa-nueva.glb',
  scale: { x: 0.8, y: 0.8, z: 0.8 },
  price: 'S/ 550,000',
  area: '140 m²',
  bedrooms: 4,
  bathrooms: 2.5,
  features: ['Jardín', 'Piscina', 'Garaje', 'Cocina moderna'],
  contact: '+51 987 654 324',
  description: 'Casa moderna con diseño contemporáneo',
  color: '#667eea'
}
```

### Cambiar Colores

**Archivo:** `public/ar.html` (líneas 30-80)

```css
/* Botones primarios */
.control-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Panel de información */
.info-header {
  background: ${property.color};
}
```

### Crear Modelo GLB

```bash
# Opción 1: Usar Blender
# 1. Crear modelo en Blender
# 2. File > Export > glTF 2.0 (.glb)
# 3. Guardar en public/models/

# Opción 2: Descargar de Sketchfab
# https://sketchfab.com
# Buscar modelo → Download → Seleccionar glTF

# Opción 3: Generar automáticamente
python generate_models.py
```

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **A-Frame** - Framework para VR/AR (HTML + Three.js)
- **AR.js** - Realidad aumentada sin marcadores
- **Three.js** - Librería 3D JavaScript
- **WebGL** - Aceleración gráfica
- **HTML5/CSS3** - Interfaz responsiva

### Backend
- **Bun** - Runtime JavaScript/TypeScript rápido
- **Node.js APIs** - Servidor HTTP
- **Analytics Store** - Almacenamiento en memoria

### Formatos 3D
- **GLB/GLTF 2.0** - Modelos 3D optimizados
- **Tamaño:** < 500 KB por modelo

### Hosting
- **Netlify** - Despliegue CD/CI automático
- **Vercel** - Alternativa con optimizaciones
- **GitHub Pages** - Hosting estático

---

## 📊 Propiedades Disponibles

### 1. 🏠 Casa Moderna
```
💰 Precio: S/ 450,000
📐 Área: 120 m²
🛏️ Habitaciones: 3
🚿 Baños: 2
✨ Features: Jardín, Garaje, 3 pisos, Cocina moderna
```

### 2. 🏢 Departamento Ejecutivo
```
💰 Precio: S/ 280,000
📐 Área: 85 m²
🛏️ Habitaciones: 2
🚿 Baños: 2
✨ Features: Piscina, Gym, Seguridad 24/7, Terraza
```

### 3. 💼 Oficina Centro
```
💰 Precio: S/ 350,000
📐 Área: 95 m²
🛏️ Dedicada a comercio
🚿 Baños: 2
✨ Features: Centro comercial, Alto flujo, Aire acondicionado
```

---

## 📱 Compatibilidad de Dispositivos

### ✅ Soportados
- **Android 7+** - Chrome, Firefox, Edge
- **iOS 12+** - Safari (con permisos)
- **WebXR devices** - Headsets especializados

### 📋 Requisitos Mínimos
- Cámara trasera funcional
- WebGL soportado
- 100 MB RAM disponible
- Conexión a internet

### 🧪 Testing
```bash
# Probar en desktop (DevTools)
# F12 → Ctrl+Shift+M → Seleccionar dispositivo

# Probar en móvil real
# 1. Obtener IP local: ipconfig (Windows)
# 2. Acceder: http://<IP>:3000/ar.html
# 3. Permitir permisos de cámara
```

---

## 📊 Analítica y Tracking

### Eventos Capturados
- `AR_Started` - Cuando usuario inicia experiencia
- `Property_Viewed` - Cuando visualiza propiedad
- `Contact_Initiated` - Cuando intenta contactar
- `Model_Loaded` - Cuando modelo 3D carga

### Endpoint API
```
POST /api/analytics/event
```

### Consulta en Backend
```javascript
// En Bun server (index.js)
const analyticsStore = {
  sessions: [...],
  interactions: [...],
  gestures: [...],
  performance: [...]
};
```

---

## 🐛 Troubleshooting

### Problema: Modelo no carga
```bash
# Soluciones:
1. Verificar ruta en ar-config.js
2. Validar que archivo existe en public/models/
3. Revisar F12 → Console por errores
4. Verificar tamaño del archivo (< 10 MB)
```

### Problema: Cámara no funciona
```bash
# Soluciones:
1. Permitir permisos de cámara
2. Usar HTTPS (algunos navegadores lo requieren)
3. Probar en otro navegador
4. Revisar si otra app usa la cámara
```

### Problema: Bajo rendimiento
```bash
# Soluciones:
1. Cerrar otras pestañas
2. Reducir escala del modelo
3. Desactivar sombras
4. Usar modelo optimizado
5. Aumentar resolución mínima
```

---

## 📚 Documentación Completa

### Guías
- 📖 **AR_IMMOBILIARIA_GUIDE.md** - Documentación detallada
- ⚡ **AR_QUICK_REFERENCE.md** - Referencia rápida con snippets
- 🔧 **docs/DEVELOPER_GUIDE.md** - Guía para desarrolladores

### Recursos Externos
- [A-Frame Documentation](https://aframe.io/docs)
- [AR.js GitHub](https://github.com/AR-js-org/AR.js)
- [Three.js Manual](https://threejs.org/manual/)
- [glTF 2.0 Specification](https://www.khronos.org/gltf/)

---

## 🚀 Próximas Mejoras

### Corto Plazo
- [ ] Recorrido interactivo dentro de casa
- [ ] Voice commands (comandos por voz)
- [ ] Múltiples marcadores personalizados
- [ ] Modo noche/día

### Mediano Plazo
- [ ] Base de datos de propiedades dinámicas
- [ ] Portal de agentes inmobiliarios
- [ ] Sistema de citas/tours
- [ ] Integración CRM

### Largo Plazo
- [ ] IA para recomendación de propiedades
- [ ] Tour 360° con street view
- [ ] Visualización de barrio/entorno
- [ ] App nativa (React Native)

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/mi-feature`)
3. Commit cambios (`git commit -m 'Agregar feature'`)
4. Push a rama (`git push origin feature/mi-feature`)
5. Abre Pull Request

---

## 📜 Licencia

Este proyecto está bajo licencia **MIT**. Ver [LICENSE](LICENSE) para más detalles.

---

## 👤 Autor

**Sleoss2**  
- GitHub: [@Sleoss2](https://github.com/Sleoss2)
- Email: info@dreomehome.com
- Teléfono: +51 987 654 321

---

## 🔗 Enlaces Útiles

| Recurso | Link |
|---------|------|
| **Landing Page** | https://dreomehome.com |
| **Tour AR** | https://dreomehome.com/ar.html |
| **GitHub Repo** | https://github.com/Sleoss2/VRInmobiliariaPeruKivo |
| **Sketchfab Models** | https://sketchfab.com |
| **Blender** | https://www.blender.org |
| **A-Frame** | https://aframe.io |

---

## 📈 Estadísticas del Proyecto

```
📁 Archivos principales: 6
📦 Modelos 3D: 3
🎨 Propiedades: 3
📝 Líneas de código: ~3,500+
🐍 Scripts Python: 1
📚 Documentación: 4 archivos
⏱️ Tiempo de carga: ~2-3 segundos
📊 Performance: 60+ FPS
```

---

## ✅ Checklist de Verificación

Antes de usar en producción:

- [x] Todos los modelos GLB cargan
- [x] Testeado en dispositivos reales
- [x] Cámara funciona en HTTPS
- [x] Performance > 30 FPS
- [x] Botones de contacto funcionan
- [x] Analítica captura eventos
- [x] Responsive en todos tamaños
- [x] Sin crashes o errores críticos
- [x] Documentación actualizada
- [x] Código limpio y comentado

---

## 📞 Soporte

¿Problemas o preguntas?

- 📧 Email: info@dreomehome.com
- 📱 WhatsApp: +51 987 654 321
- 🐛 Issues: https://github.com/Sleoss2/VRInmobiliariaPeruKivo/issues
- 💬 Discussions: https://github.com/Sleoss2/VRInmobiliariaPeruKivo/discussions

---

**Última actualización:** Noviembre 16, 2024  
**Versión:** 1.0.0  
**Status:** ✅ Completo y Funcional

---

<div align="center">

### 🏠 DreamHome Real Estate
**Realidad Virtual + Realidad Aumentada para el Sector Inmobiliario**

Hecho con ❤️ por Sleoss2

</div>
