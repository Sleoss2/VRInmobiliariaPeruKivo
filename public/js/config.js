/**
 * VRInmobiliariaPeruKivo - Configuration
 * Central configuration for VR scene interaction
 * 
 * @file config.js
 */

// ============================================================================
// INTERACTION CONFIGURATION
// ============================================================================

export const INTERACTION_CONFIG = {
  // Grab detection
  GRAB_DISTANCE: 15, // cm - how close hand needs to be to grab
  GRAB_THRESHOLD: 10, // cm - distance threshold for grab confirmation
  GRAB_FORCE_THRESHOLD: 0.6, // 0-1 scale for grip strength
  
  // Drag settings
  DRAG_SENSITIVITY: 0.8, // 0-1 scale
  DRAG_THRESHOLD: 5, // pixels before drag is recognized
  DRAG_MOMENTUM_DECAY: 0.95, // velocity retention per frame (0-1)
  MAX_DRAG_VELOCITY: 100, // pixels/second cap
  
  // Hover & selection
  HOVER_DEBOUNCE: 50, // ms - throttle hover detection
  HOVER_COLOR: '#4A90E2', // Hex color when hovering
  SELECTED_COLOR: '#2ECC71', // Hex color when selected
  IDLE_COLOR: '#95A5A6', // Hex color when idle
  
  // Panel interaction
  PANEL_SCALE_MIN: 0.5, // Minimum panel scale
  PANEL_SCALE_MAX: 2.0, // Maximum panel scale
  PANEL_ANIMATION_DURATION: 300, // ms
  
  // Input handling
  MOUSE_SENSITIVITY: 1.0,
  TOUCH_SENSITIVITY: 1.2,
  HAND_TRACKING_SENSITIVITY: 1.0,
  
  // Performance
  INPUT_LATENCY_TARGET: 50, // ms
  FPS_TARGET: 90, // VR standard
  FRAME_TIME_BUDGET: 16.67 / 90, // ms per frame
  
  // Haptics & feedback
  HAPTIC_ENABLED: true,
  HAPTIC_GRAB_INTENSITY: 0.7,
  HAPTIC_DRAG_INTENSITY: 0.3,
  HAPTIC_RELEASE_INTENSITY: 0.5,
  
  // Sound effects
  SOUND_EFFECTS_ENABLED: true,
  SOUND_GRAB: '/sounds/grab.mp3',
  SOUND_DRAG: '/sounds/drag.mp3',
  SOUND_RELEASE: '/sounds/release.mp3',
  SOUND_HOVER: '/sounds/hover.mp3'
};

// ============================================================================
// SCENE CONFIGURATION
// ============================================================================

export const SCENE_CONFIG = {
  // Background
  BACKGROUND_COLOR: '#1a1a2e',
  FOG_COLOR: '#1a1a2e',
  FOG_NEAR: 1,
  FOG_FAR: 1000,
  
  // Lighting
  AMBIENT_LIGHT_INTENSITY: 0.6,
  AMBIENT_LIGHT_COLOR: '#ffffff',
  
  DIRECTIONAL_LIGHT_INTENSITY: 0.8,
  DIRECTIONAL_LIGHT_COLOR: '#ffffff',
  DIRECTIONAL_LIGHT_POSITION: { x: 10, y: 20, z: 10 },
  
  DIRECTIONAL_LIGHT_SHADOW_MAP_SIZE: 2048,
  DIRECTIONAL_LIGHT_SHADOW_CAMERA_FAR: 100,
  
  // Camera
  CAMERA_FOV: 75,
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 1000,
  CAMERA_POSITION: { x: 0, y: 1.6, z: 3 }, // VR eye level (~1.6m)
  
  // Physics (if enabled)
  PHYSICS_GRAVITY: -9.8,
  PHYSICS_TIMESTEP: 1 / 60, // 60 Hz physics
  
  // Panel positioning
  PANEL_POSITION_DEFAULT: { x: 0, y: 0, z: -1 },
  PANEL_SCALE_DEFAULT: 1.0,
  PANEL_DEPTH: 0.1, // z thickness
  
  // Shadows
  SHADOWS_ENABLED: true,
  SHADOW_MAP_TYPE: 'PCFShadowMap' // 'BasicShadowMap', 'PCFShadowMap', 'PCFShadowMapSoftShadows'
};

// ============================================================================
// MODEL LOADING CONFIGURATION
// ============================================================================

export const MODEL_CONFIG = {
  // Paths
  MODELS_PATH: '/models/',
  DEFAULT_MODEL: 'placeholder',
  
  // Loading options
  AUTO_SCALE: true,
  AUTO_CENTER: true,
  APPLY_SHADOWS: true,
  ENABLE_ANIMATIONS: true,
  
  // Performance
  MAX_CONCURRENT_LOADS: 2,
  MODEL_LOAD_TIMEOUT: 30000, // ms
  TEXTURE_COMPRESSION: true,
  
  // Fallbacks
  FALLBACK_MODEL: '/models/placeholder.glb',
  ERROR_MODEL: '/models/error.glb',
  
  // Cache
  ENABLE_CACHE: true,
  CACHE_EXPIRY: 3600000, // 1 hour in ms
};

// ============================================================================
// DEBUG CONFIGURATION
// ============================================================================

export const DEBUG_CONFIG = {
  // Debug mode
  DEBUG_MODE: true,
  SHOW_DEBUG_OVERLAY: true,
  DEBUG_OVERLAY_POSITION: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  
  // Logging
  LOG_LEVEL: 'debug', // 'error', 'warn', 'info', 'debug', 'trace'
  LOG_INPUT_EVENTS: true,
  LOG_PANEL_EVENTS: true,
  LOG_MODEL_EVENTS: true,
  LOG_PERFORMANCE: true,
  
  // Visualizations
  SHOW_HAND_POSITION: true,
  SHOW_GRAB_ZONES: true,
  SHOW_BOUNDING_BOXES: true,
  SHOW_FPS_COUNTER: true,
  SHOW_MEMORY_USAGE: true,
  SHOW_INPUT_LATENCY: true,
  
  // Performance monitoring
  ENABLE_PERFORMANCE_PROFILING: true,
  PROFILE_FRAME_TIME: true,
  PROFILE_INPUT_LATENCY: true,
  PROFILE_RENDER_TIME: true,
  
  // Test data
  TEST_MODE: false,
  MOCK_HAND_TRACKING: false,
  MOCK_PROPERTIES: true, // Generate test properties
};

// ============================================================================
// PROPERTY CONFIGURATION
// ============================================================================

export const PROPERTY_CONFIG = {
  // Sample properties (mock data)
  SAMPLE_PROPERTIES: [
    {
      id: 'prop-001',
      name: 'Modern Penthouse Lima',
      price: 850000,
      area: 250,
      rooms: 3,
      bathrooms: 2.5,
      location: 'San Isidro, Lima',
      description: 'Luxury penthouse with ocean views'
    },
    {
      id: 'prop-002',
      name: 'Beach House Miraflores',
      price: 650000,
      area: 200,
      rooms: 3,
      bathrooms: 2,
      location: 'Miraflores, Lima',
      description: 'Modern beachfront property'
    },
    {
      id: 'prop-003',
      name: 'Executive Apartment Cusco',
      price: 350000,
      area: 150,
      rooms: 2,
      bathrooms: 2,
      location: 'Cusco Historic Center',
      description: 'Colonial-inspired luxury apartment'
    }
  ],
  
  // Panel sizing for properties
  PANEL_WIDTH: 3,
  PANEL_HEIGHT: 4,
  PANEL_ASPECT_RATIO: 3 / 4,
};

// ============================================================================
// HAND TRACKING CONFIGURATION
// ============================================================================

export const HAND_CONFIG = {
  // Hand models
  SHOW_HAND_MODELS: true,
  HAND_MODEL_TYPE: 'mesh', // 'mesh', 'cube', 'sphere', 'capsule'
  HAND_MODEL_COLOR_LEFT: '#FF6B6B',
  HAND_MODEL_COLOR_RIGHT: '#4ECDC4',
  
  // Hand joint tracking
  TRACK_FINGER_JOINTS: true,
  SHOW_FINGER_JOINTS: false,
  JOINT_VISUALIZATION_SIZE: 0.01, // meters
  
  // Grab gesture zones
  GRAB_ZONE_VISUALIZATION: true,
  GRAB_ZONE_COLOR: '#2ECC71',
  GRAB_ZONE_OPACITY: 0.2,
  
  // Hand velocity tracking
  TRACK_HAND_VELOCITY: true,
  VELOCITY_SMOOTHING: 0.8, // 0-1 exponential smoothing
  
  // Handedness
  DETECT_HANDEDNESS: true,
  DEFAULT_HANDEDNESS: 'right' // 'left' or 'right'
};

// ============================================================================
// GESTURE CONFIGURATION
// ============================================================================

export const GESTURE_CONFIG = {
  // Gesture recognition
  ENABLE_GESTURE_RECOGNITION: true,
  
  // Pinch gesture
  PINCH_THRESHOLD: 2, // cm - distance between thumb and index finger
  PINCH_MIN_DURATION: 100, // ms
  
  // Swipe gesture
  SWIPE_MIN_DISTANCE: 20, // cm
  SWIPE_MAX_DURATION: 500, // ms
  SWIPE_MIN_VELOCITY: 50, // cm/s
  
  // Palm detection
  PALM_FACING_THRESHOLD: 0.7, // 0-1 confidence
  OPEN_HAND_FINGER_SPREAD: 15, // degrees
};

// ============================================================================
// ANALYTICS CONFIGURATION
// ============================================================================

export const ANALYTICS_CONFIG = {
  // Analytics tracking
  ENABLE_ANALYTICS: true,
  TRACK_USER_INTERACTIONS: true,
  TRACK_PROPERTY_VIEWS: true,
  TRACK_SESSION_DURATION: true,
  TRACK_HAND_MOVEMENT: true,
  
  // Data collection
  COLLECT_HAND_POSITION_HISTORY: true,
  POSITION_HISTORY_SAMPLE_RATE: 100, // ms between samples
  MAX_HISTORY_SIZE: 10000, // max data points to keep
  
  // Analytics endpoint
  ANALYTICS_ENDPOINT: '/api/analytics',
  BATCH_UPLOAD_INTERVAL: 60000, // ms
  BATCH_SIZE: 100, // events per batch
};

// ============================================================================
// ACCESSIBILITY CONFIGURATION
// ============================================================================

export const ACCESSIBILITY_CONFIG = {
  // Voice control
  ENABLE_VOICE_CONTROL: false, // Requires microphone permission
  VOICE_COMMAND_TIMEOUT: 5000, // ms
  
  // Text to speech
  ENABLE_TEXT_TO_SPEECH: false,
  TTS_RATE: 1.0,
  TTS_PITCH: 1.0,
  
  // Keyboard shortcuts
  ENABLE_KEYBOARD_CONTROL: true,
  KEYBOARD_SHORTCUTS: {
    'Space': 'toggle-grab',
    'ArrowRight': 'next-property',
    'ArrowLeft': 'previous-property',
    'Escape': 'close-current',
    'D': 'toggle-debug-overlay'
  },
  
  // Color blind modes
  ENABLE_COLORBLIND_MODE: false,
  COLORBLIND_TYPE: 'deuteranopia', // 'protanopia', 'deuteranopia', 'tritanopia'
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get configuration value with fallback
 * @param {string} key - Configuration key (e.g., 'INTERACTION_CONFIG.GRAB_DISTANCE')
 * @param {*} fallback - Fallback value if not found
 * @returns {*} Configuration value
 */
export function getConfig(key, fallback = null) {
  const keys = key.split('.');
  let value = window;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return fallback;
  }
  
  return value;
}

/**
 * Update configuration value
 * @param {string} key - Configuration key
 * @param {*} value - New value
 */
export function setConfig(key, value) {
  const keys = key.split('.');
  let obj = window;
  
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
  }
  
  obj[keys[keys.length - 1]] = value;
  console.log(`Config updated: ${key} = ${value}`);
}

/**
 * Log configuration summary
 */
export function logConfigSummary() {
  console.group('VR Configuration Summary');
  console.log('Interaction:', INTERACTION_CONFIG);
  console.log('Scene:', SCENE_CONFIG);
  console.log('Model:', MODEL_CONFIG);
  console.log('Debug:', DEBUG_CONFIG);
  console.log('Hand:', HAND_CONFIG);
  console.log('Gesture:', GESTURE_CONFIG);
  console.groupEnd();
}

export default {
  INTERACTION_CONFIG,
  SCENE_CONFIG,
  MODEL_CONFIG,
  DEBUG_CONFIG,
  PROPERTY_CONFIG,
  HAND_CONFIG,
  GESTURE_CONFIG,
  ANALYTICS_CONFIG,
  ACCESSIBILITY_CONFIG,
  getConfig,
  setConfig,
  logConfigSummary
};
