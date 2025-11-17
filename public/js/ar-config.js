/**
 * AR-Config: Configuración de propiedades inmobiliarias
 * Define modelos 3D, precios, características y metadata
 */

const AR_CONFIG = {
  // Propiedades inmobiliarias disponibles
  properties: [
    {
      id: 'casa-moderna',
      name: '🏠 Casa Moderna',
      type: 'Residencial',
      modelPath: 'models/casa.glb',
      scale: { x: 0.8, y: 0.8, z: 0.8 },
      position: { x: 0, y: 0, z: 0 },
      price: 'S/ 450,000',
      area: '120 m²',
      bedrooms: 3,
      bathrooms: 2,
      features: ['Jardín', 'Garaje', '3 pisos', 'Cocina moderna'],
      contact: '+51 987 654 321',
      description: 'Casa de 3 habitaciones con acabados de lujo en zona residencial Premium',
      color: '#667eea'
    },
    {
      id: 'depa-ejecutivo',
      name: '🏢 Depa Ejecutivo',
      type: 'Departamento',
      modelPath: 'models/depa.glb',
      scale: { x: 0.7, y: 0.7, z: 0.7 },
      position: { x: 0, y: 0, z: 0 },
      price: 'S/ 280,000',
      area: '85 m²',
      bedrooms: 2,
      bathrooms: 2,
      features: ['Piscina', 'Gym', 'Seguridad 24/7', 'Terraza'],
      contact: '+51 987 654 322',
      description: 'Departamento ejecutivo en edificio moderno con amenities de lujo',
      color: '#f093fb'
    },
    {
      id: 'oficina-centro',
      name: '💼 Oficina Centro',
      type: 'Comercial',
      modelPath: 'models/oficina.glb',
      scale: { x: 0.9, y: 0.9, z: 0.9 },
      position: { x: 0, y: 0, z: 0 },
      price: 'S/ 350,000',
      area: '95 m²',
      bedrooms: 0,
      bathrooms: 2,
      features: ['Centro comercial', 'Alto flujo', 'Aire acondicionado', 'Escaleras'],
      contact: '+51 987 654 323',
      description: 'Oficina en ubicación céntrica con excelente acceso y visibilidad',
      color: '#4facfe'
    }
  ],

  // Configuración de marcadores AR
  markers: {
    enabled: true,
    type: 'image', // 'image' o 'location'
    imageUrl: 'assets/marker.png',
    size: '100x100'
  },

  // Configuración de interacción
  interaction: {
    allowRotation: true,
    allowZoom: true,
    allowDrag: true,
    doubleTapZoom: true,
    pinchZoom: true
  },

  // Animaciones disponibles
  animations: {
    rotation: {
      property: 'rotation',
      to: '0 360 0',
      loop: true,
      dur: 20000,
      easing: 'linear'
    },
    bobbing: {
      property: 'position',
      from: '0 0 0',
      to: '0 0.5 0',
      loop: true,
      dur: 3000,
      easing: 'easeInOutQuad'
    }
  },

  // Configuración de cámara y escena
  scene: {
    arjs: 'sourceType: webcam; trackingMethod: best; debugUIEnabled: false; patternRatio: 0.8;',
    renderer: 'logarithmicDepthBuffer: true; precision: mediump;',
    vr: false,
    ar: true,
    stats: false
  },

  // Textos y etiquetas
  ui: {
    title: 'Tour AR Inmobiliario',
    subtitle: 'Descubre propiedades en realidad aumentada',
    instructionText: '👆 Toca una propiedad para más información',
    loadingText: 'Cargando experiencia AR...',
    errorText: 'Error al cargar el modelo 3D',
    noWebGLText: 'Tu dispositivo no soporta WebGL'
  },

  // Colores de la interfaz
  colors: {
    primary: '#667eea',
    secondary: '#f093fb',
    accent: '#4facfe',
    background: 'rgba(0, 0, 0, 0.7)',
    text: '#ffffff'
  },

  // Dimensiones UI
  dimensions: {
    infoBoxWidth: 300,
    infoBoxHeight: 400,
    buttonHeight: 50,
    fontSize: 14
  },

  // Configuración de performance
  performance: {
    maxModels: 3,
    lodQuality: 'medium', // low, medium, high
    enableShadows: true,
    enableLighting: true,
    maxDrawCalls: 1000
  },

  // Integraciones
  integrations: {
    analytics: true,
    whatsapp: true,
    email: true,
    phone: true
  },

  // URLs de recursos por defecto
  resources: {
    defaultModel: 'models/casa.glb',
    skybox: null,
    ground: null
  }
};

// Función auxiliar para obtener propiedad por ID
function getPropertyById(propertyId) {
  return AR_CONFIG.properties.find(p => p.id === propertyId) || AR_CONFIG.properties[0];
}

// Función para obtener todas las propiedades
function getAllProperties() {
  return AR_CONFIG.properties;
}

// Función para cambiar propiedad
function setActiveProperty(propertyId) {
  const property = getPropertyById(propertyId);
  console.log('Cambiando a propiedad:', property.name);
  return property;
}

// Exportar para uso en otros scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AR_CONFIG, getPropertyById, getAllProperties, setActiveProperty };
}
