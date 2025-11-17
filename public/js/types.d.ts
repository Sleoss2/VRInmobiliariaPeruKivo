/**
 * VRInmobiliariaPeruKivo - Type Definitions
 * TypeScript type definitions for VR interaction system
 * 
 * Usage: Include in your IDE for type hints
 * @file types.d.ts
 */

/**
 * 3D Vector representation
 */
interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * 3D Bounding box
 */
interface BoundingBox {
  min: Vector3;
  max: Vector3;
}

/**
 * Hand interaction state
 */
type HandState = 
  | 'idle'
  | 'approaching'
  | 'hovering'
  | 'grabbing'
  | 'holding'
  | 'dragging'
  | 'releasing';

/**
 * Panel interaction state
 */
type PanelState = 
  | 'idle'
  | 'hovering'
  | 'selected'
  | 'holding'
  | 'dragging'
  | 'animating';

/**
 * Input source type
 */
type InputSource = 
  | 'mouse'
  | 'touch'
  | 'hand-tracking'
  | 'controller';

/**
 * Hand pose data from WebXR
 */
interface HandPose {
  position: Vector3;
  rotation: Vector4; // Quaternion
  isAvailable: boolean;
  timestamp: number;
  confidence: number; // 0-1
  jointPositions?: Map<string, Vector3>;
}

/**
 * Mouse/touch input event
 */
interface InputEvent {
  type: 'mousedown' | 'mouseup' | 'mousemove' | 'click';
  position: { x: number; y: number };
  timestamp: number;
  source: InputSource;
  button?: number;
}

/**
 * Panel interaction event
 */
interface PanelInteractionEvent {
  panelId: string;
  action: 'grab' | 'drag' | 'release' | 'hover' | 'unhover';
  handPosition: Vector3;
  panelPosition: Vector3;
  dragVector?: Vector3;
  velocity?: number;
  timestamp: number;
  confidence: number;
}

/**
 * 3D Model metadata
 */
interface Model3D {
  id: string;
  name: string;
  url: string;
  format: 'gltf' | 'glb' | 'obj' | 'fbx';
  boundingBox: BoundingBox;
  position: Vector3;
  rotation: Vector4;
  scale: number;
  isLoaded: boolean;
  loadTime?: number;
  fileSize?: number;
  texture?: string;
  metadata?: Record<string, any>;
}

/**
 * Property listing metadata
 */
interface Property {
  id: string;
  name: string;
  description: string;
  price: number;
  area: number; // Square meters
  rooms: number;
  bathrooms: number;
  location: string;
  coordinates: { lat: number; lng: number };
  images: string[];
  model3D?: Model3D;
  tags: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Scene configuration
 */
interface SceneConfig {
  backgroundColor: string;
  lighting: {
    ambient: { intensity: number; color: string };
    directional: { intensity: number; color: string; position: Vector3 };
    shadows: boolean;
  };
  camera: {
    position: Vector3;
    fov: number;
    near: number;
    far: number;
  };
  physics?: {
    enabled: boolean;
    gravity: number;
    groundPlane: boolean;
  };
}

/**
 * Interaction configuration
 */
interface InteractionConfig {
  grabDistance: number; // cm
  dragSensitivity: number; // 0-1
  dragThreshold: number; // pixels
  hoverDebounce: number; // ms
  hapticFeedback: boolean;
  soundEffects: boolean;
  debugMode: boolean;
}

/**
 * Performance metrics
 */
interface PerformanceMetrics {
  fps: number;
  frameTime: number; // ms
  memoryUsed: number; // MB
  modelLoadTime: number; // ms
  inputLatency: number; // ms
  renderTime: number; // ms
  physicsTime: number; // ms
}

/**
 * Event callback signature
 */
type EventCallback<T = any> = (data: T) => void;

/**
 * Panel object in VR scene
 */
interface VRPanel {
  id: string;
  element: HTMLElement | THREE.Object3D;
  state: PanelState;
  position: Vector3;
  scale: number;
  rotation: Vector4;
  isDragging: boolean;
  isHovering: boolean;
  content: Property;
  onGrab?: EventCallback<PanelInteractionEvent>;
  onDrag?: EventCallback<PanelInteractionEvent>;
  onRelease?: EventCallback<PanelInteractionEvent>;
}

/**
 * Hand interaction data
 */
interface HandInteractionData {
  handState: HandState;
  position: Vector3;
  velocity: Vector3;
  confidence: number;
  isOverPanel: boolean;
  nearestPanel?: VRPanel;
  distanceToPanel?: number;
  grabForce?: number; // 0-1 (grip strength simulation)
}

/**
 * Debug overlay display data
 */
interface DebugDisplayData {
  panelState: PanelState;
  handState: HandState;
  cursorOverPanel: boolean;
  handPosition: Vector3;
  panelPosition: Vector3;
  dragDistance: number;
  fps: number;
  inputLatency: number;
  memoryUsed: number;
}

/**
 * Quaternion representation
 */
interface Vector4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

/**
 * Gesture recognition result
 */
interface GestureRecognitionResult {
  type: 'grab' | 'pinch' | 'swipe' | 'point' | 'thumbs-up' | 'open-hand' | 'unknown';
  confidence: number; // 0-1
  duration: number; // ms
  trajectory?: Vector3[];
}

/**
 * Model loader options
 */
interface ModelLoaderOptions {
  autoScale?: boolean;
  autoCenter?: boolean;
  applyShadows?: boolean;
  animationsEnabled?: boolean;
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
}

/**
 * VR Session state
 */
interface VRSessionState {
  isActive: boolean;
  isSupported: boolean;
  sessionMode: 'immersive-vr' | 'immersive-ar' | 'inline';
  properties: Property[];
  currentProperty?: Property;
  selectedPanel?: VRPanel;
  userHandedness: 'left' | 'right';
  sessionStartTime: number;
  sessionDuration: number;
}

/**
 * User interaction statistics
 */
interface InteractionStats {
  totalGrabs: number;
  totalDrags: number;
  successfulInteractions: number;
  failedInteractions: number;
  averageGrabDuration: number; // ms
  averageDragDistance: number; // pixels
  userSatisfactionScore?: number; // 0-10
  mostInteractedProperty?: string;
}

/**
 * Export types for external use
 */
export {
  Vector3,
  Vector4,
  BoundingBox,
  HandState,
  PanelState,
  InputSource,
  HandPose,
  InputEvent,
  PanelInteractionEvent,
  Model3D,
  Property,
  SceneConfig,
  InteractionConfig,
  PerformanceMetrics,
  EventCallback,
  VRPanel,
  HandInteractionData,
  DebugDisplayData,
  GestureRecognitionResult,
  ModelLoaderOptions,
  VRSessionState,
  InteractionStats
};
