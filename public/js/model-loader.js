/**
 * Model Loader
 * Dynamically loads glTF/GLB models into the VR scene
 */

class ModelLoader {
  constructor(scene, eventEmitter) {
    this.scene = scene;
    this.eventEmitter = eventEmitter;
    this.models = new Map(); // Cache loaded models
  }

  /**
   * Load a glTF model
   * @param {string} url - Model URL (glTF or GLB)
   * @param {Object} options - Options: { position, scale, rotation, name }
   * @returns {Promise<THREE.Object3D>}
   */
  async loadModel(url, options = {}) {
    const { position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], name = 'model' } = options;

    try {
      // Use A-Frame's asset management (if available) or THREE.GLTFLoader
      const loader = new THREE.GLTFLoader();
      
      const gltf = await new Promise((resolve, reject) => {
        loader.load(
          url,
          (gltf) => resolve(gltf),
          (progress) => {
            this.eventEmitter.emit('model:loading', {
              url,
              progress: progress.loaded / progress.total,
            });
          },
          (err) => reject(err)
        );
      });

      const model = gltf.scene;
      model.name = name;
      model.position.set(...position);
      model.scale.set(scale, scale, scale);
      model.rotation.set(...rotation);

      this.scene.appendChild(model);
      this.models.set(name, model);

      console.log('[ModelLoader] Model loaded:', name);
      this.eventEmitter.emit('model:loaded', { name, url, model });

      return model;
    } catch (err) {
      console.error('[ModelLoader] Failed to load model:', err);
      this.eventEmitter.emit('model:error', { url, error: err.message });
      throw err;
    }
  }

  /**
   * Get a loaded model by name
   * @param {string} name 
   * @returns {THREE.Object3D|null}
   */
  getModel(name) {
    return this.models.get(name) || null;
  }

  /**
   * Remove a model
   * @param {string} name 
   */
  removeModel(name) {
    const model = this.models.get(name);
    if (model) {
      this.scene.remove(model);
      this.models.delete(name);
      console.log('[ModelLoader] Model removed:', name);
    }
  }

  /**
   * List all loaded models
   */
  listModels() {
    return Array.from(this.models.keys());
  }
}

export default ModelLoader;
