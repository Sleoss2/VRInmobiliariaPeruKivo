# Developer Guide - VRInmobiliariaPeruKivo

Complete development guidelines for the VR real estate platform.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Architecture](#project-architecture)
3. [Code Organization](#code-organization)
4. [Key Modules](#key-modules)
5. [Interaction State Machine](#interaction-state-machine)
6. [Adding Features](#adding-features)
7. [Performance Optimization](#performance-optimization)
8. [Testing & Debugging](#testing--debugging)
9. [Common Patterns](#common-patterns)
10. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites
- Bun v1.0+
- VS Code with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Prettier
  - ESLint
  - WebGL GLSL Editor (optional)

### Initial Setup

```powershell
# 1. Clone/Navigate to project
cd d:\Bun1

# 2. Install dependencies
bun install

# 3. Start development server
bun run dev

# 4. Open in browser
# Landing: http://localhost:3000
# VR Scene: http://localhost:3000/vr.html
```

### Development Workflow

```
Edit Code → Save → Browser Auto-Refresh → Test → Inspect DevTools
```

**Tips**:
- Use Firefox DevTools (Shift+F12) for better performance profiling
- Enable "Pause on Exceptions" in debugger
- Use breakpoints in event handlers for debugging interactions

---

## Project Architecture

### High-Level Overview

```
┌─────────────────────────────────────────┐
│         User (Hand/Mouse/Touch)          │
└──────────────────┬──────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │   Input Handler     │
         │  (Normalize Input)  │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │ VR Event Emitter    │
         │  (Pub/Sub System)   │
         └──────────┬──────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     ▼
    ┌─────────────┐    ┌──────────────┐
    │   Panel     │    │    Scene     │
    │ Controller  │    │   Manager    │
    │(State Mgmt) │    │ (Render Loop)│
    └──────┬──────┘    └──────┬───────┘
           │                  │
           └──────────┬───────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │  Three.js / A-Frame    │
         │   (WebGL Rendering)     │
         └─────────────────────────┘
```

### Design Principles

1. **Event-Driven Architecture**
   - Modules communicate via events, not direct function calls
   - Reduces coupling, improves testability

2. **Separation of Concerns**
   - Input handling separate from business logic
   - Scene rendering separate from state management

3. **Single Responsibility**
   - Each module does ONE thing well
   - Easy to test, debug, and maintain

4. **Observable & Measurable**
   - All interactions emit events with metrics
   - Performance data tracked in real-time

---

## Code Organization

### Module Responsibilities

#### `vr-event-emitter.js` - Event Bus
```
Purpose: Central pub/sub event system
Size: ~100 LOC
Exports:
  - emitEvent(eventName, data)
  - addEventListener(eventName, callback)
  - removeEventListener(eventName, callback)
  - clearEventListeners()
```

#### `input-handler.js` - Input Normalization
```
Purpose: Capture mouse/hand/touch input and normalize
Size: ~120 LOC
Exports:
  - initializeInputHandlers()
  - getHandPosition()
  - isHandOverPanel()
  - getInputSource()
```

#### `panel-controller.js` - State Machine
```
Purpose: Manage panel interaction state & transitions
Size: ~150 LOC
Exports:
  - initializePanelController()
  - updatePanelState(newState)
  - transitionState(targetState)
  - getPanelState()
  - updatePanelPosition(x, y)
```

#### `scene-manager.js` - Scene Setup & Rendering
```
Purpose: Initialize Three.js scene, cameras, lighting
Size: ~130 LOC
Exports:
  - initializeScene()
  - addObjectToScene(object)
  - removeObjectFromScene(object)
  - getRenderer()
  - getScene()
```

#### `model-loader.js` - 3D Model Loading
```
Purpose: Load glTF/GLB models with error handling
Size: ~140 LOC
Exports:
  - loadModel(url, options)
  - unloadModel(modelId)
  - getLoadedModels()
  - getModelLoadProgress()
```

#### `config.js` - Configuration
```
Purpose: Centralized configuration for all modules
Size: ~400 LOC (configuration, not logic)
Exports:
  - INTERACTION_CONFIG
  - SCENE_CONFIG
  - MODEL_CONFIG
  - ... + helper functions
```

---

## Key Modules

### 1. Event Emitter Pattern

```javascript
// Usage in any module
import { emitEvent, addEventListener } from './vr-event-emitter.js';

// Listen for panel grab
addEventListener('onPanelGrab', (data) => {
  console.log('Panel grabbed:', data.panelId);
  console.log('Hand position:', data.handPosition);
});

// Emit custom event
emitEvent('myCustomEvent', {
  timestamp: Date.now(),
  data: { /* ... */ }
});
```

**Benefits**:
- No circular dependencies
- Easy to add/remove listeners
- Decoupled components
- Trackable event flow

---

### 2. Input Handler Pattern

```javascript
// Normalize different input types
const inputEvent = {
  type: 'mousemove',          // Event type
  position: { x: 100, y: 200 },
  source: 'mouse',            // 'mouse', 'hand', 'touch'
  timestamp: Date.now(),
  confidence: 1.0
};

// Use unified interface
if (isHandOverPanel(inputEvent)) {
  // Panel is hovered
  updatePanelVisuals('hovering');
}
```

---

### 3. State Machine Pattern

```javascript
// Panel state transitions
const states = {
  idle: {
    canTransitionTo: ['hovering'],
    onEnter: () => updatePanelColor('#95A5A6')
  },
  hovering: {
    canTransitionTo: ['holding', 'idle'],
    onEnter: () => updatePanelColor('#4A90E2')
  },
  holding: {
    canTransitionTo: ['dragging', 'idle'],
    onEnter: () => updatePanelColor('#2ECC71')
  },
  dragging: {
    canTransitionTo: ['holding', 'idle'],
    onEnter: () => enableDragPhysics()
  }
};

// Transition safely
if (canTransitionTo(currentState, nextState)) {
  transitionState(nextState);
} else {
  console.warn(`Cannot transition from ${currentState} to ${nextState}`);
}
```

---

## Interaction State Machine

### State Diagram

```
                    ┌─────────────┐
                    │    IDLE     │
                    │(gray panel) │
                    └──────┬──────┘
                           │
            ┌──────────────┐│
            │              ││
            │ Hand enters  ││
            │ approach zone││
            │              ▼
            │     ┌─────────────┐
            │     │ APPROACHING │
            │     │(faint glow) │
            │     └──────┬──────┘
            │            │
            │ Hand leaves┌│
            │ zone       ││
            │            ││ Hand close to panel
            │            │└─────────────────┐
            │            │                  ▼
            │            │          ┌─────────────┐
            │            │     ┌───→│  HOVERING   │
            │            │     │    │(blue glow) │
            │            │     │    └──────┬──────┘
            │            └─────┘           │
            │                          │   │ Click/Grab
            │                          │   ▼
            │         ┌────────────────┴┐┌────────────┐
            │         │   GRABBING      ││ RELEASING  │
            │         │(transitional)   │└────────────┘
            │         └────────┬────────┘      ▲
            │                  │               │
            │ Hand leaves zone │               │
            │                  ▼               │
            │         ┌────────────────┐       │
            └────────→│    HOLDING     │───────┘
                      │(green glow)    │
                      │ Can drag now   │
                      └────────┬───────┘
                               │
                               │ Mouse move while holding
                               ▼
                      ┌──────────────────┐
                      │    DRAGGING      │
                      │(green, physics)  │
                      └────────┬─────────┘
                               │
                               │ Release
                               ▼
                      ┌──────────────────┐
                      │  (back to holding│
                      │   or idle)       │
                      └──────────────────┘
```

### State Transition Code

```javascript
// panel-controller.js - State transitions

function updatePanelState(cursorOverPanel, mouseDown, dragDistance) {
  const currentState = panelState.current;
  
  // State machine logic
  switch (currentState) {
    case 'idle':
      if (cursorOverPanel) {
        transitionState('hovering');
      }
      break;
    
    case 'hovering':
      if (!cursorOverPanel) {
        transitionState('idle');
      } else if (mouseDown) {
        transitionState('holding');
      }
      break;
    
    case 'holding':
      if (!mouseDown) {
        transitionState('idle');
      } else if (dragDistance > DRAG_THRESHOLD) {
        transitionState('dragging');
      }
      break;
    
    case 'dragging':
      if (!mouseDown) {
        transitionState('idle');
      }
      break;
  }
}
```

---

## Adding Features

### Example 1: Add New Panel Property

**Goal**: Add a "favorite" button to property panels

**Steps**:

1. **Update Config**
```javascript
// config.js
export const PROPERTY_CONFIG = {
  SHOW_FAVORITE_BUTTON: true,
  FAVORITE_COLOR: '#FFD700', // Gold
  FAVORITE_ANIMATION_DURATION: 300, // ms
};
```

2. **Update Types**
```javascript
// types.d.ts
interface VRPanel {
  // ... existing properties
  isFavorited: boolean;
  onFavorite?: EventCallback;
}
```

3. **Update Panel Controller**
```javascript
// panel-controller.js
addEventListener('onPanelGrab', (event) => {
  // Check if click on favorite button
  const isFavoriteClick = checkFavoriteButtonClick(event);
  if (isFavoriteClick) {
    toggleFavorite(event.panelId);
    emitEvent('onFavoritedChanged', { panelId, isFavorited: true });
  }
});
```

4. **Update Scene Manager**
```javascript
// scene-manager.js
addEventListener('onFavoritedChanged', (event) => {
  const panel = getPanelById(event.panelId);
  if (event.isFavorited) {
    addFavoriteIndicator(panel);
    playFavoriteAnimation(panel);
  } else {
    removeFavoriteIndicator(panel);
  }
});
```

5. **Test**
```javascript
// Verify new event is emitted
console.log('Test: Toggle favorite');
toggleFavorite('prop-001');
// Check DevTools → Events → onFavoritedChanged
```

---

### Example 2: Add Hand Gesture Recognition

**Goal**: Detect "pinch" gesture (thumb + index finger close together)

**Steps**:

1. **Update Hand Config**
```javascript
// config.js
export const HAND_CONFIG = {
  // ... existing
  TRACK_FINGER_JOINTS: true,
  PINCH_THRESHOLD: 2, // cm
};
```

2. **Create Gesture Module** (new file)
```javascript
// gesture-recognizer.js
export function detectPinch(handPose) {
  const thumbPos = handPose.jointPositions.get('thumb-tip');
  const indexPos = handPose.jointPositions.get('index-tip');
  
  const distance = Math.hypot(
    thumbPos.x - indexPos.x,
    thumbPos.y - indexPos.y,
    thumbPos.z - indexPos.z
  );
  
  return distance < PINCH_THRESHOLD;
}
```

3. **Integrate with Input Handler**
```javascript
// input-handler.js
addEventListener('onHandPoseUpdate', (pose) => {
  const isPinching = detectPinch(pose);
  
  if (isPinching) {
    emitEvent('onPinchGesture', {
      handedness: pose.handedness,
      intensity: calculatePinchIntensity(pose)
    });
  }
});
```

4. **Handle Pinch in Panel Controller**
```javascript
// panel-controller.js
addEventListener('onPinchGesture', (event) => {
  if (event.intensity > 0.8) {
    // Strong pinch = quick select
    selectNearestPanel();
    playHapticFeedback('pinch');
  }
});
```

---

## Performance Optimization

### Key Metrics to Monitor

```javascript
// Check performance dashboard (press D in VR scene)
const metrics = {
  fps: 87,              // Target: 90
  frameTime: 11.2,      // Target: <16.67ms
  inputLatency: 23,     // Target: <50ms
  renderTime: 8.5,      // Keep <14ms
  memoryUsed: 125,      // Target: <150MB
};
```

### Optimization Checklist

- ✅ **Throttle Event Listeners**
  ```javascript
  // Debounce mouse move (50ms)
  const throttledMouseMove = throttle(handleMouseMove, 50);
  window.addEventListener('mousemove', throttledMouseMove);
  ```

- ✅ **Lazy Load Models**
  ```javascript
  // Load model only when panel is hovered
  addEventListener('onPanelHover', async (event) => {
    if (!event.model.isLoaded) {
      await loadModel(event.model.url);
    }
  });
  ```

- ✅ **Optimize Rendering**
  ```javascript
  // Use LOD (Level of Detail) for distant objects
  if (distanceToCamera > 10) {
    useLODModel(object, 'low');  // Lower poly count
  }
  ```

- ✅ **Cache Computations**
  ```javascript
  const handToPanel = new Map(); // Cache distances
  if (handToPanel.has(handId + panelId)) {
    const cached = handToPanel.get(handId + panelId);
    if (isCacheValid(cached)) return cached.distance;
  }
  ```

- ✅ **Profile with DevTools**
  ```javascript
  console.time('panelUpdate');
  updatePanelState();
  console.timeEnd('panelUpdate');  // Logs: panelUpdate: 2.5ms
  ```

---

## Testing & Debugging

### Debug Mode

Enable in `config.js`:
```javascript
export const DEBUG_CONFIG = {
  DEBUG_MODE: true,
  SHOW_DEBUG_OVERLAY: true,
  LOG_LEVEL: 'debug',
};
```

### Manual Testing Scenarios

#### Scenario 1: Test Grab Interaction
```javascript
// 1. Open VR scene
// 2. Move hand above panel
// 3. Verify panel turns blue (hovering)
// 4. Close hand to grab
// 5. Verify panel turns green (holding)
// 6. Open hand to release
// 7. Verify panel turns gray (idle)
```

#### Scenario 2: Test Drag Interaction
```javascript
// 1. Grab panel (hold hand closed)
// 2. Move hand left/right
// 3. Verify panel moves smoothly
// 4. Check drag velocity in debug overlay
// 5. Release panel
// 6. Verify motion decays (momentum)
```

### Browser DevTools Commands

```javascript
// Log all events for 10 seconds
addEventListener('*', (e) => console.log('Event:', e));
setTimeout(() => removeEventListener('*'), 10000);

// Profile frame rendering
console.profile('renderFrame');
// ...perform action...
console.profileEnd('renderFrame');
// Check Performance tab

// Monitor memory
console.log(performance.memory);
// { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit }

// Check network requests
fetch('/models/test.glb')
  .then(r => console.log(`Status: ${r.status}, Size: ${r.headers.get('content-length')}`));
```

---

## Common Patterns

### Pattern 1: Event-Based Update

```javascript
// BAD: Direct function call
function updateUI() {
  updatePanelColor();
  updateCursor();
  playSound();
}

// GOOD: Event-based
addEventListener('onStateChange', () => {
  emitEvent('onUpdateUI', { state: newState });
});

addEventListener('onUpdateUI', (data) => updatePanelColor(data.state));
addEventListener('onUpdateUI', (data) => updateCursor(data.state));
addEventListener('onUpdateUI', (data) => playSound(data.state));
```

**Benefits**: Decoupled, testable, easy to add/remove features

### Pattern 2: Error Handling with Events

```javascript
// BAD: Silent failure
async function loadModel(url) {
  return THREE.GLTFLoader.load(url);
}

// GOOD: Event-based error handling
async function loadModel(url) {
  try {
    const model = await THREE.GLTFLoader.load(url);
    emitEvent('onModelLoaded', { url, model });
    return model;
  } catch (error) {
    emitEvent('onModelLoadError', { url, error: error.message });
    loadPlaceholderModel();
  }
}

// Handle errors gracefully
addEventListener('onModelLoadError', (event) => {
  console.error(`Failed to load ${event.url}: ${event.error}`);
  showErrorNotification(`Could not load model`);
});
```

### Pattern 3: State Validation

```javascript
// GOOD: Validate state transitions
function canTransitionTo(currentState, nextState) {
  const validTransitions = {
    idle: ['hovering'],
    hovering: ['holding', 'idle'],
    holding: ['dragging', 'idle'],
    dragging: ['holding', 'idle']
  };
  
  return validTransitions[currentState]?.includes(nextState) ?? false;
}

// Use in state machine
if (canTransitionTo(currentState, 'dragging')) {
  transitionState('dragging');
} else {
  console.warn(`Invalid transition: ${currentState} → dragging`);
}
```

---

## Troubleshooting

### Issue: Panel not responding to hand input

**Diagnosis**:
1. Check hand position in debug overlay
2. Verify `cursorOverPanel` is true when hovering
3. Check event listeners are registered

**Solution**:
```javascript
// Verify input is being captured
addEventListener('onInputUpdate', (data) => {
  console.log('Hand position:', data.handPosition);
  console.log('Over panel:', data.cursorOverPanel);
});

// Verify panel state is updating
addEventListener('onStateChanged', (data) => {
  console.log('New state:', data.state);
});
```

---

### Issue: High input latency (>50ms)

**Diagnosis**:
1. Check FPS - if <60, rendering is bottleneck
2. Check event throttling - if <50ms debounce, events are flooding
3. Check model complexity - complex models slow rendering

**Solution**:
```javascript
// Increase throttle
const throttledMouseMove = throttle(handleMouseMove, 100); // Was 50ms

// Reduce model complexity
loadModel(modelUrl, { autoScale: true, autoCenter: true, lod: 'low' });

// Profile render time
console.profile();
renderer.render(scene, camera);
console.profileEnd();
```

---

### Issue: Models not loading

**Diagnosis**:
1. Check Network tab - is file 404?
2. Check console - are there parser errors?
3. Check file format - is it valid glTF/GLB?

**Solution**:
```javascript
// Debug model loading
addEventListener('onModelLoading', (event) => {
  console.log(`Loading: ${event.url}`);
});

addEventListener('onModelLoadError', (event) => {
  console.error(`Failed: ${event.error}`);
  console.log(`Try: curl -I ${event.url}`);  // Check if file exists
});

// Validate file
fetch('/models/test.glb')
  .then(r => {
    console.log(`Status: ${r.status}`);
    return r.arrayBuffer();
  })
  .then(data => {
    const magic = new Uint8Array(data.slice(0, 4));
    console.log('Magic:', String.fromCharCode(...magic));  // Should be 'glTF'
  });
```

---

### Issue: Memory leak (keeps growing)

**Diagnosis**:
1. Check DevTools Memory tab
2. Take heap snapshot, check for growing object counts
3. Look for un-removed event listeners

**Solution**:
```javascript
// Always remove listeners when done
function cleanup() {
  removeEventListener('onStateChanged', myCallback);
  removeEventListener('onModelLoaded', myCallback);
  // ... remove all listeners
}

// Use lifecycle hooks
addEventListener('onSceneUnload', cleanup);

// Or use WeakMap for automatic cleanup
const listeners = new WeakMap();
// Objects will be GC'd when no other references exist
```

---

## Next Steps

1. **Read**: [ISO25010_COMPLIANCE.md](../ISO25010_COMPLIANCE.md) - Understand quality standards
2. **Explore**: [VALUE_ANALYSIS.md](../VALUE_ANALYSIS.md) - See interaction metrics
3. **Implement**: Add a new feature using the patterns above
4. **Test**: Run through manual test scenarios
5. **Optimize**: Profile and improve performance

---

**Happy coding! 🚀**
