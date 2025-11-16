/**
 * Input Handler
 * Manages keyboard, mouse, and controller input
 */

class InputHandler {
  constructor(camera, eventEmitter) {
    this.camera = camera;
    this.eventEmitter = eventEmitter;
    this.keys = {};
    this.mouseState = { down: false, x: 0, y: 0, startX: 0, startY: 0 };
    this.isDragging = false;
    this.dragThreshold = 5; // pixels

    this.init();
  }

  init() {
    // Keyboard
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      this.eventEmitter.emit('input:keydown', { key: e.key });
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
      this.eventEmitter.emit('input:keyup', { key: e.key });
    });

    // Mouse
    document.addEventListener('mousedown', (e) => {
      this.mouseState.down = true;
      this.mouseState.startX = e.clientX;
      this.mouseState.startY = e.clientY;
      this.isDragging = false; // Reset drag flag
      this.eventEmitter.emit('input:mousedown', { x: e.clientX, y: e.clientY });
    });

    document.addEventListener('mousemove', (e) => {
      this.mouseState.x = e.clientX;
      this.mouseState.y = e.clientY;

      // Check if mouse move exceeds drag threshold
      if (this.mouseState.down && !this.isDragging) {
        const dx = Math.abs(e.clientX - this.mouseState.startX);
        const dy = Math.abs(e.clientY - this.mouseState.startY);
        if (dx > this.dragThreshold || dy > this.dragThreshold) {
          this.isDragging = true;
          this.eventEmitter.emit('input:dragstart', {
            x: e.clientX,
            y: e.clientY,
            startX: this.mouseState.startX,
            startY: this.mouseState.startY,
          });
        }
      }

      if (this.isDragging) {
        this.eventEmitter.emit('input:drag', {
          x: e.clientX,
          y: e.clientY,
          dx: e.clientX - this.mouseState.startX,
          dy: e.clientY - this.mouseState.startY,
        });
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (this.isDragging) {
        this.eventEmitter.emit('input:dragend', {
          x: e.clientX,
          y: e.clientY,
        });
      }
      this.mouseState.down = false;
      this.isDragging = false;
      this.eventEmitter.emit('input:mouseup', { x: e.clientX, y: e.clientY });
    });
  }

  isKeyPressed(key) {
    return this.keys[key] || false;
  }
}

export default InputHandler;
