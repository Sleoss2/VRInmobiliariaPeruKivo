/**
 * Scene Manager
 * Manages VR scene lifecycle, setup, and state
 */

class SceneManager {
  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.initialized = false;
  }

  /**
   * Initialize the scene
   */
  async init() {
    // Wait for A-Frame to load
    const aframeScene = document.querySelector('a-scene');
    
    if (!aframeScene) {
      console.error('[SceneManager] A-Frame scene not found');
      this.eventEmitter.emit('scene:error', { message: 'A-Frame scene not found' });
      return false;
    }

    // Wait for scene to be ready
    await new Promise((resolve) => {
      if (aframeScene.hasLoaded) {
        resolve();
      } else {
        aframeScene.addEventListener('loaded', resolve, { once: true });
      }
    });

    this.scene = aframeScene;
    this.renderer = aframeScene.renderer;
    this.camera = aframeScene.camera;

    console.log('[SceneManager] Scene initialized');
    this.eventEmitter.emit('scene:ready', {});
    this.initialized = true;

    return true;
  }

  /**
   * Get scene object
   */
  getScene() {
    return this.scene;
  }

  /**
   * Get THREE.js scene for direct manipulation
   */
  getThreeScene() {
    return this.scene?.object3D || null;
  }
}

export default SceneManager;
