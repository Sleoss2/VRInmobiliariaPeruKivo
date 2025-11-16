/**
 * VR Event Emitter
 * Decoupled event handling for VR scene events
 * @typedef {Object} VREvent
 * @property {string} type - Event type (e.g., 'panel:grabbed', 'panel:released')
 * @property {any} data - Event data
 * @property {number} timestamp - Event timestamp
 */

class VREventEmitter extends EventTarget {
  constructor() {
    super();
    this.listeners = new Map();
  }

  /**
   * Emit a custom VR event
   * @param {string} type 
   * @param {any} data 
   */
  emit(type, data = {}) {
    const event = new CustomEvent(type, {
      detail: {
        type,
        data,
        timestamp: Date.now(),
      },
    });
    this.dispatchEvent(event);
  }

  /**
   * Listen for VR events
   * @param {string} type 
   * @param {Function} callback 
   */
  on(type, callback) {
    this.addEventListener(type, (e) => callback(e.detail));
  }

  /**
   * Listen once
   * @param {string} type 
   * @param {Function} callback 
   */
  once(type, callback) {
    const listener = (e) => {
      callback(e.detail);
      this.removeEventListener(type, listener);
    };
    this.addEventListener(type, listener);
  }

  /**
   * Remove listener
   * @param {string} type 
   * @param {Function} callback 
   */
  off(type, callback) {
    this.removeEventListener(type, callback);
  }
}

export default VREventEmitter;
