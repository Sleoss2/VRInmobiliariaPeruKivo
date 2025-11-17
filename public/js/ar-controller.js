/**
 * AR-Controller: Gestión de experiencia AR inmobiliaria
 * Controla modelos 3D, interacciones, gestos y UI
 */

class ARController {
  constructor() {
    this.scene = null;
    this.currentProperty = null;
    this.activeModel = null;
    this.infoPanel = null;
    this.properties = AR_CONFIG.properties;
    this.currentPropertyIndex = 0;
    this.isAnimating = false;
    this.gestureHandler = new GestureHandler();
    
    console.log('🎯 ARController inicializado');
  }

  /**
   * Inicializa la escena AR con A-Frame
   */
  init() {
    this.scene = document.querySelector('a-scene');
    
    if (!this.scene) {
      console.error('❌ Escena A-Frame no encontrada');
      return;
    }

    console.log('✅ Escena AR cargada');
    
    // Esperar a que A-Frame esté listo
    this.scene.addEventListener('loaded', () => {
      this.setupScene();
      this.loadProperty(this.properties[0]);
      this.setupUI();
      this.setupEventListeners();
    });
  }

  /**
   * Configura la escena inicial
   */
  setupScene() {
    // Agregar luz ambiente
    const ambientLight = document.createElement('a-entity');
    ambientLight.setAttribute('light', {
      type: 'ambient',
      color: '#fff',
      intensity: 1.5
    });
    this.scene.appendChild(ambientLight);

    // Agregar luz direccional
    const directionalLight = document.createElement('a-entity');
    directionalLight.setAttribute('light', {
      type: 'directional',
      color: '#fff',
      intensity: 1,
      castShadow: true
    });
    directionalLight.setAttribute('position', '5 10 7');
    this.scene.appendChild(directionalLight);

    // Agregar entidad para el modelo 3D
    this.activeModel = document.createElement('a-entity');
    this.activeModel.setAttribute('id', 'active-model');
    this.activeModel.setAttribute('scale', '1 1 1');
    this.activeModel.setAttribute('position', '0 -0.3 0');
    this.scene.appendChild(this.activeModel);

    console.log('✅ Escena configurada');
  }

  /**
   * Carga una propiedad específica
   */
  loadProperty(property) {
    this.currentProperty = property;
    console.log(`📍 Cargando propiedad: ${property.name}`);

    // Limpiar modelo anterior
    if (this.activeModel) {
      this.activeModel.innerHTML = '';
    }

    // Crear elemento de modelo
    const model = document.createElement('a-gltf-model');
    model.setAttribute('src', property.modelPath);
    model.setAttribute('scale', `${property.scale.x} ${property.scale.y} ${property.scale.z}`);
    model.setAttribute('position', `${property.position.x} ${property.position.y} ${property.position.z}`);
    model.setAttribute('id', `model-${property.id}`);
    model.setAttribute('class', 'ar-model');
    model.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 30000; easing: linear');
    
    // Event listeners para el modelo
    model.addEventListener('model-loaded', () => {
      console.log('✅ Modelo cargado:', property.name);
      this.animateModelEntry();
    });

    model.addEventListener('model-error', () => {
      console.error('❌ Error al cargar modelo:', property.modelPath);
      this.showError('No se pudo cargar el modelo 3D');
    });

    model.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showPropertyInfo(property);
    });

    this.activeModel.appendChild(model);
  }

  /**
   * Anima la entrada del modelo
   */
  animateModelEntry() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.activeModel.setAttribute('animation__entry', {
      property: 'scale',
      from: '0 0 0',
      to: '1 1 1',
      dur: 800,
      easing: 'easeOutElastic'
    });

    setTimeout(() => {
      this.isAnimating = false;
    }, 800);
  }

  /**
   * Muestra información de la propiedad
   */
  showPropertyInfo(property) {
    console.log('📋 Mostrando info de:', property.name);

    // Remover panel anterior
    const existingPanel = document.getElementById('info-panel');
    if (existingPanel) existingPanel.remove();

    // Crear panel de información
    const infoPanel = document.createElement('div');
    infoPanel.id = 'info-panel';
    infoPanel.innerHTML = `
      <div class="info-header" style="background: ${property.color};">
        <h2>${property.name}</h2>
        <p class="property-type">${property.type}</p>
      </div>
      
      <div class="info-content">
        <div class="price-section">
          <span class="price">💰 ${property.price}</span>
          <span class="area">📐 ${property.area}</span>
        </div>

        <div class="details-section">
          <div class="detail-item">
            <span class="label">🛏️ Habitaciones:</span>
            <span class="value">${property.bedrooms || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="label">🚿 Baños:</span>
            <span class="value">${property.bathrooms || 'N/A'}</span>
          </div>
        </div>

        <div class="features-section">
          <p class="section-title">✨ Características:</p>
          <ul class="features-list">
            ${property.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>

        <div class="description-section">
          <p>${property.description}</p>
        </div>

        <div class="action-buttons">
          <button onclick="arController.callProperty('${property.contact}')" class="btn-contact btn-phone">
            📞 Llamar
          </button>
          <button onclick="arController.shareProperty('${property.name}')" class="btn-contact btn-whatsapp">
            💬 WhatsApp
          </button>
          <button onclick="arController.emailProperty('${property.name}')" class="btn-contact btn-email">
            ✉️ Email
          </button>
        </div>
      </div>

      <button onclick="arController.closePropertyInfo()" class="btn-close">✕</button>
    `;

    document.body.appendChild(infoPanel);
    this.infoPanel = infoPanel;

    // Animación de entrada
    infoPanel.style.animation = 'slideUp 0.4s ease-out';
  }

  /**
   * Cierra el panel de información
   */
  closePropertyInfo() {
    if (this.infoPanel) {
      this.infoPanel.style.animation = 'slideDown 0.3s ease-in forwards';
      setTimeout(() => this.infoPanel.remove(), 300);
      this.infoPanel = null;
    }
  }

  /**
   * Cambia a la siguiente propiedad
   */
  nextProperty() {
    this.currentPropertyIndex = (this.currentPropertyIndex + 1) % this.properties.length;
    this.loadProperty(this.properties[this.currentPropertyIndex]);
    this.closePropertyInfo();
  }

  /**
   * Cambia a la propiedad anterior
   */
  previousProperty() {
    this.currentPropertyIndex = (this.currentPropertyIndex - 1 + this.properties.length) % this.properties.length;
    this.loadProperty(this.properties[this.currentPropertyIndex]);
    this.closePropertyInfo();
  }

  /**
   * Configura la interfaz de usuario
   */
  setupUI() {
    // Crear controles flotantes
    const controls = document.createElement('div');
    controls.id = 'ar-controls';
    controls.innerHTML = `
      <div class="controls-container">
        <button id="btn-prev" class="control-btn" title="Propiedad anterior">
          ⬅️
        </button>
        <div class="property-indicator">
          <span id="property-name">${this.properties[0].name}</span>
          <span id="property-counter">${this.currentPropertyIndex + 1}/${this.properties.length}</span>
        </div>
        <button id="btn-next" class="control-btn" title="Siguiente propiedad">
          ➡️
        </button>
        <button id="btn-info" class="control-btn" title="Mostrar información">
          ℹ️
        </button>
        <button id="btn-rotate" class="control-btn" title="Alternar rotación">
          🔄
        </button>
      </div>
    `;
    document.body.appendChild(controls);

    // Agregar event listeners a botones
    document.getElementById('btn-prev').addEventListener('click', () => this.previousProperty());
    document.getElementById('btn-next').addEventListener('click', () => this.nextProperty());
    document.getElementById('btn-info').addEventListener('click', () => this.showPropertyInfo(this.currentProperty));
    document.getElementById('btn-rotate').addEventListener('click', () => this.toggleRotation());
  }

  /**
   * Alterna la rotación del modelo
   */
  toggleRotation() {
    const model = this.scene.querySelector('.ar-model');
    if (model) {
      if (model.getAttribute('animation')) {
        model.removeAttribute('animation');
        console.log('🛑 Rotación detenida');
      } else {
        model.setAttribute('animation', AR_CONFIG.animations.rotation);
        console.log('▶️ Rotación iniciada');
      }
    }
  }

  /**
   * Llamar al número de teléfono
   */
  callProperty(phone) {
    window.location.href = `tel:${phone}`;
  }

  /**
   * Compartir por WhatsApp
   */
  shareProperty(propertyName) {
    const message = `Hola! 👋 Me interesa la propiedad: ${propertyName}. ¿Podrías enviarme más información? 🏠`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  }

  /**
   * Enviar por email
   */
  emailProperty(propertyName) {
    const subject = encodeURIComponent(`Consulta: ${propertyName}`);
    const body = encodeURIComponent(`Hola,\n\nMe interesa conocer más sobre la propiedad: ${propertyName}\n\nQuedo atenta.\n\nSaludos`);
    window.location.href = `mailto:info@dreomehome.com?subject=${subject}&body=${body}`;
  }

  /**
   * Muestra mensaje de error
   */
  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = `❌ ${message}`;
    document.body.appendChild(errorDiv);

    setTimeout(() => errorDiv.remove(), 5000);
  }

  /**
   * Actualiza la información del panel de control
   */
  updateUI() {
    const property = this.currentProperty;
    document.getElementById('property-name').textContent = property.name;
    document.getElementById('property-counter').textContent = `${this.currentPropertyIndex + 1}/${this.properties.length}`;
  }

  /**
   * Registra evento de analítica
   */
  trackEvent(eventName, data = {}) {
    console.log(`📊 Evento: ${eventName}`, data);
    
    // Opcional: enviar a servidor
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        propertyId: this.currentProperty?.id,
        timestamp: Date.now(),
        ...data
      })
    }).catch(err => console.log('Analytics error:', err));
  }

  /**
   * Event listeners globales
   */
  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          this.previousProperty();
          break;
        case 'ArrowRight':
          this.nextProperty();
          break;
        case 'i':
        case 'I':
          this.showPropertyInfo(this.currentProperty);
          break;
        case 'Escape':
          this.closePropertyInfo();
          break;
      }
    });

    // Gesture handler para móviles
    this.gestureHandler.onSwipeLeft(() => this.nextProperty());
    this.gestureHandler.onSwipeRight(() => this.previousProperty());
  }
}

/**
 * Gestor de gestos táctiles para dispositivos móviles
 */
class GestureHandler {
  constructor() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 50;

    this.swipeLeftCallback = null;
    this.swipeRightCallback = null;
    this.pinchCallback = null;

    this.setupTouchListeners();
  }

  setupTouchListeners() {
    document.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.touchStartY = e.changedTouches[0].screenY;
    }, false);

    document.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe();
    }, false);
  }

  handleSwipe() {
    const diffX = this.touchStartX - this.touchEndX;
    const diffY = this.touchStartY - this.touchEndY;

    // Detectar swipe horizontal (ignorar movimientos verticales)
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > this.minSwipeDistance) {
        if (diffX > 0) {
          // Swipe izquierda
          if (this.swipeLeftCallback) this.swipeLeftCallback();
        } else {
          // Swipe derecha
          if (this.swipeRightCallback) this.swipeRightCallback();
        }
      }
    }
  }

  onSwipeLeft(callback) {
    this.swipeLeftCallback = callback;
  }

  onSwipeRight(callback) {
    this.swipeRightCallback = callback;
  }

  onPinch(callback) {
    this.pinchCallback = callback;
  }
}

// Instancia global del controlador
let arController = null;

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
  arController = new ARController();
  arController.init();
});
