# DreamHome Real Estate — Bun Project

A minimal Bun-powered landing page for a real estate business.

## Features
- Modern hero section
- Property cards for featured listings
- Contact info and a simple contact form
- Responsive, clean design
- Easy to customize: edit `public/index.html`

## Requirements
- Bun installed ([https://bun.sh](https://bun.sh))

## Run (PowerShell):

```powershell
# check bun
bun --version

# run the server
bun run start
# or directly
bun index.js
```

## View the landing page
Open your browser and go to:

```
http://localhost:3000
```

## Test the server (optional)
```powershell
curl http://localhost:3000
# or
Invoke-WebRequest http://localhost:3000 -UseBasicParsing | Select-Object -ExpandProperty Content
```

## Customizing
- Edit `public/index.html` to change listings, colors, or add more sections.
- Update styles in the `<style>` block for branding.

## Next steps
- Add TypeScript, tests, or Dockerfile as needed.
- Deploy to Vercel, Netlify, or your own server.

## VR: Holdable Showpage (A-Frame)

You can view and hold the landing page inside a WebVR scene. A sample scene is included at `public/vr.html` which:

- Creates a big green environment (sky + ground).
- Places your landing page on a plane that is grabbable with VR controllers or the mouse.
- Uses A-Frame with `aframe-iframe-component` and `aframe-super-hands-component` for interaction.

How to run:

```powershell
cd d:\Bun1
bun run start
# Open in a WebXR-capable browser (Chrome/Edge with WebXR) or a normal browser at:
http://localhost:3000/vr.html
```

Controls and notes:
- On desktop, you can click and drag the panel to move it; use the mouse cursor to click links inside the panel.
- In VR (headset + controllers), point your controller at the panel and press the trigger to grab and hold it.
- Because the landing page is served from the same origin, full interaction should work (links, forms). If you deploy the site cross-origin, embed as an `iframe` may require CORS/embedding headers.

Quality tips for VR:
- Increase the panel resolution (`iframe` width/height attributes) for sharper text.
- Limit heavy animations in the page — they may be expensive to render as a texture.
- Consider a simplified, VR-optimized variant of the page (larger fonts, simplified layout) to improve readability and performance.

## Advanced VR Architecture (v1.0)

### Event-Oriented Design & Conflict Resolution ✓
The VR scene uses a centralized **event emitter** pattern with proper **drag vs. grab conflict resolution**:

**Key Features:**
- `VREventEmitter` — Custom event bus for all VR events
- `InputHandler` — Manages keyboard, mouse, and controller input
- `PanelController` — Panel interaction (grab, drag, release) with state machine
- `SceneManager` — Scene initialization and lifecycle
- `ModelLoader` — Dynamic glTF/GLB model loading

**Conflict Resolution Logic:**
- **Grab** (Priority): VR controller trigger or `super-hands` grab
- **Drag**: Mouse click+drag only when **NOT grabbed by controller**
- When grabbed, mouse drag is automatically suspended (no conflict)
- Drag threshold: 5px (prevents accidental drags from clicks)

### Model Loading (glTF/GLB) ✓

Load 3D models dynamically into the VR scene:

1. Open `http://localhost:3000/vr.html`
2. Look at **bottom-right** for the "Model Loader" panel
3. Paste a glTF/GLB model URL (must be CORS-enabled)
4. Click **"Load Model"** to add it to the scene

**Example Models:**
```
https://cdn.jsdelivr.net/npm/three@r128/examples/models/gltf/Duck/glTF-Binary/Duck.glb
https://cdn.jsdelivr.net/npm/three@r128/examples/models/gltf/Flamingo/glTF-Binary/Flamingo.glb
```

### Features Implemented
- ✅ Hand models with visual feedback (built-in lowPoly hands)
- ✅ Proper state tracking (isGrabbed, isDragging, currentHand)
- ✅ Event-driven architecture (no prop drilling)
- ✅ Grab/drag conflict resolution
- ✅ Dynamic model loading with progress feedback
- ✅ Real-time debug overlay (grab status, drag status, position, model count)
- ✅ Graceful error handling

### Debug Overlay
The green panel in the **top-left** shows:
- Scene status (INIT → READY)
- Grab/Drag state
- Panel position (X, Y, Z)
- Loaded model count

Would you like me to:
- Add hand gesture recognition (pinch, point, etc.)?
- Implement panel resizing/rotation with controllers?
- Add particle effects on grab/release?
 - Add a hand-model (GLTF) and attach the panel to it so the panel appears to be "held" by a virtual hand? (implemented)
 - Create a VR-optimized version of `index.html` with larger text and touch-friendly elements?

Hand behavior details

- The VR scene (`public/vr.html`) now attaches the panel to the grabber (controller/hand) when you grab it and restores its world position on release. This creates the visual effect of holding the page in your hand.
- On desktop you can still click-and-drag to move the panel; on a headset use the controller trigger to grab and release.

If you want a custom glTF hand model instead of the built-in `hand-controls`, I can add one and hide the default model while using the custom GLTF for higher visual fidelity.
