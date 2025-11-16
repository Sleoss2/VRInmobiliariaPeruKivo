/**
 * Panel Controller
 * Manages panel grab, drag, and interaction logic
 * Prevents conflict between grab and drag events
 */

class PanelController {
  constructor(panel, inputHandler, eventEmitter, scene) {
    this.panel = panel;
    this.inputHandler = inputHandler;
    this.eventEmitter = eventEmitter;
    this.scene = scene;

    this.state = {
      isGrabbed: false,
      isDragging: false,
      currentHand: null,
      originalParent: scene,
      startPos: new THREE.Vector3(),
    };

    this.init();
  }

  init() {
    // A-Frame super-hands events
    this.panel.addEventListener('grab-start', (evt) => this.onGrabStart(evt));
    this.panel.addEventListener('grab-end', (evt) => this.onGrabEnd(evt));

    // Custom input events from InputHandler
    this.inputHandler.eventEmitter.addEventListener('input:dragstart', (e) => {
      // Only trigger drag if not grabbed by controller
      if (!this.state.isGrabbed) {
        this.onDragStart(e.detail);
      }
    });

    this.inputHandler.eventEmitter.addEventListener('input:drag', (e) => {
      if (this.state.isDragging) {
        this.onDrag(e.detail);
      }
    });

    this.inputHandler.eventEmitter.addEventListener('input:dragend', (e) => {
      if (this.state.isDragging) {
        this.onDragEnd(e.detail);
      }
    });

    // A-Frame native grab events (VR controllers)
    this.panel.addEventListener('grab-start', () => {
      // Prevent mouse drag while grabbed by controller
      this.state.isGrabbed = true;
      this.state.isDragging = false;
    });

    this.panel.addEventListener('grab-end', () => {
      this.state.isGrabbed = false;
    });
  }

  onGrabStart(evt) {
    this.state.isGrabbed = true;
    this.state.isDragging = false; // Cancel any ongoing drag
    this.state.currentHand = evt.detail?.hand || null;
    this.state.startPos.copy(this.panel.object3D.position);

    console.log('[PanelController] Grab started');
    this.eventEmitter.emit('panel:grabbed', { hand: this.state.currentHand });

    if (this.state.currentHand) {
      // Parent panel to hand
      this.state.originalParent = this.panel.parentNode;
      this.state.currentHand.appendChild(this.panel);
      this.panel.setAttribute('position', '0 -0.2 -0.35');
    }
  }

  onGrabEnd(evt) {
    this.state.isGrabbed = false;
    console.log('[PanelController] Grab ended');
    this.eventEmitter.emit('panel:released', {});

    if (this.state.currentHand) {
      try {
        // Save world position
        const worldPos = new THREE.Vector3();
        this.panel.object3D.getWorldPosition(worldPos);

        // Re-parent to scene
        this.scene.appendChild(this.panel);

        // Convert world to local coordinates
        const localPos = this.scene.object3D.worldToLocal(worldPos);
        this.panel.object3D.position.copy(localPos);

        console.log('[PanelController] Panel released at:', localPos);
      } catch (e) {
        console.error('[PanelController] Error on grab end:', e);
        // Fallback
        this.scene.appendChild(this.panel);
        this.panel.setAttribute('position', '0 1.5 -2.5');
      }
      this.state.currentHand = null;
    }
  }

  onDragStart(data) {
    if (this.state.isGrabbed) return; // Ignore if grabbed by controller

    this.state.isDragging = true;
    this.state.startPos.copy(this.panel.object3D.position);

    console.log('[PanelController] Mouse drag started');
    this.eventEmitter.emit('panel:dragstart', data);
  }

  onDrag(data) {
    if (!this.state.isDragging || this.state.isGrabbed) return;

    // Move panel slightly based on mouse drag
    const speed = 0.005;
    const dx = data.dx * speed;
    const dy = -data.dy * speed; // Invert Y for natural feel

    this.panel.object3D.position.x = this.state.startPos.x + dx;
    this.panel.object3D.position.y = this.state.startPos.y + dy;

    this.eventEmitter.emit('panel:dragging', data);
  }

  onDragEnd(data) {
    if (!this.state.isDragging) return;

    this.state.isDragging = false;
    console.log('[PanelController] Mouse drag ended');
    this.eventEmitter.emit('panel:dragend', data);
  }

  /**
   * Get panel state
   */
  getState() {
    return { ...this.state };
  }
}

export default PanelController;
