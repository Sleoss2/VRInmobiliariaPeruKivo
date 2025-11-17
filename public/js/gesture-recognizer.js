/**
 * VRInmobiliariaPeruKivo - Gesture Recognition
 * Hand gesture detection and recognition system
 * 
 * @file gesture-recognizer.js
 */

import { emitEvent, addEventListener } from './vr-event-emitter.js';
import { GESTURE_CONFIG, HAND_CONFIG } from './config.js';

/**
 * Gesture recognizer for hand-based inputs
 */
class GestureRecognizer {
  constructor() {
    this.gestureHistory = [];
    this.activeGestures = new Map();
    this.lastGestureTime = 0;
    this.confidenceThreshold = 0.7;

    this.init();
  }

  /**
   * Initialize gesture recognition
   */
  init() {
    if (!GESTURE_CONFIG.ENABLE_GESTURE_RECOGNITION) return;

    // Listen for hand updates to detect gestures
    addEventListener('onHandPoseUpdate', (pose) => {
      this.analyzeHand(pose);
    });

    // Listen for hand joints if available
    if (HAND_CONFIG.TRACK_FINGER_JOINTS) {
      addEventListener('onHandJointsUpdate', (joints) => {
        this.analyzeJoints(joints);
      });
    }
  }

  /**
   * Analyze hand pose for gestures
   * @param {Object} pose - Hand pose data
   */
  analyzeHand(pose) {
    if (!pose.jointPositions) return;

    // Detect pinch gesture
    const pinch = this.detectPinch(pose.jointPositions);
    if (pinch.detected) {
      this.handlePinch(pinch, pose);
    }

    // Detect open palm gesture
    const palm = this.detectOpenPalm(pose.jointPositions);
    if (palm.detected) {
      this.handleOpenPalm(palm, pose);
    }

    // Detect point gesture
    const point = this.detectPoint(pose.jointPositions);
    if (point.detected) {
      this.handlePoint(point, pose);
    }
  }

  /**
   * Analyze individual hand joints
   * @param {Map} joints - Joint positions map
   */
  analyzeJoints(joints) {
    if (joints.size === 0) return;

    // Visualize joints if enabled
    if (HAND_CONFIG.SHOW_FINGER_JOINTS) {
      this.visualizeJoints(joints);
    }
  }

  /**
   * Detect pinch gesture (thumb + index finger close together)
   * @param {Map} joints - Joint positions
   * @returns {Object} Pinch detection result
   */
  detectPinch(joints) {
    const thumbTip = joints.get('thumb-tip');
    const indexTip = joints.get('index-tip');

    if (!thumbTip || !indexTip) {
      return { detected: false };
    }

    const distance = Math.hypot(
      thumbTip.x - indexTip.x,
      thumbTip.y - indexTip.y,
      thumbTip.z - indexTip.z
    );

    const detected = distance < GESTURE_CONFIG.PINCH_THRESHOLD;

    return {
      detected,
      distance,
      intensity: Math.max(0, 1 - (distance / GESTURE_CONFIG.PINCH_THRESHOLD)),
      thumbTip,
      indexTip
    };
  }

  /**
   * Detect open palm gesture
   * @param {Map} joints - Joint positions
   * @returns {Object} Palm detection result
   */
  detectOpenPalm(joints) {
    const palmCenter = joints.get('palm');
    const fingerTips = [
      joints.get('thumb-tip'),
      joints.get('index-tip'),
      joints.get('middle-tip'),
      joints.get('ring-tip'),
      joints.get('pinky-tip')
    ].filter(j => j);

    if (!palmCenter || fingerTips.length < 4) {
      return { detected: false };
    }

    // Check if fingers are spread apart
    const avgDistance = fingerTips.reduce((sum, tip) => {
      const dist = Math.hypot(
        tip.x - palmCenter.x,
        tip.y - palmCenter.y,
        tip.z - palmCenter.z
      );
      return sum + dist;
    }, 0) / fingerTips.length;

    const detected = avgDistance > GESTURE_CONFIG.OPEN_HAND_FINGER_SPREAD;

    return {
      detected,
      fingerCount: fingerTips.length,
      spread: avgDistance,
      palmCenter
    };
  }

  /**
   * Detect point gesture (index finger extended)
   * @param {Map} joints - Joint positions
   * @returns {Object} Point detection result
   */
  detectPoint(joints) {
    const indexTip = joints.get('index-tip');
    const middleTip = joints.get('middle-tip');
    const indexBase = joints.get('index-base');

    if (!indexTip || !indexBase) {
      return { detected: false };
    }

    // Calculate if index finger is extended relative to middle
    const indexExtension = Math.hypot(
      indexTip.x - indexBase.x,
      indexTip.y - indexBase.y,
      indexTip.z - indexBase.z
    );

    let middleExtension = 0;
    if (middleTip) {
      const middleBase = joints.get('middle-base');
      if (middleBase) {
        middleExtension = Math.hypot(
          middleTip.x - middleBase.x,
          middleTip.y - middleBase.y,
          middleTip.z - middleBase.z
        );
      }
    }

    const detected = indexExtension > middleExtension * 1.2;

    return {
      detected,
      indexTip,
      indexExtension
    };
  }

  /**
   * Handle pinch gesture
   * @param {Object} pinch - Pinch data
   * @param {Object} pose - Hand pose
   */
  handlePinch(pinch, pose) {
    const now = Date.now();
    const timeSinceLastGesture = now - this.lastGestureTime;

    // Debounce: prevent rapid successive pinch events
    if (timeSinceLastGesture < 200) return;

    this.lastGestureTime = now;

    const result = {
      type: 'pinch',
      confidence: Math.min(1, pinch.intensity),
      position: pinch.indexTip,
      intensity: pinch.intensity,
      handedness: pose.handedness
    };

    this.recordGesture(result);
    emitEvent('onPinchGesture', result);

    console.log(`[Gesture] Pinch detected (intensity: ${(pinch.intensity * 100).toFixed(0)}%)`);
  }

  /**
   * Handle open palm gesture
   * @param {Object} palm - Palm data
   * @param {Object} pose - Hand pose
   */
  handleOpenPalm(palm, pose) {
    const now = Date.now();
    const timeSinceLastGesture = now - this.lastGestureTime;

    if (timeSinceLastGesture < 200) return;

    this.lastGestureTime = now;

    const result = {
      type: 'open-hand',
      confidence: 0.9,
      fingerCount: palm.fingerCount,
      position: palm.palmCenter,
      handedness: pose.handedness
    };

    this.recordGesture(result);
    emitEvent('onOpenHandGesture', result);

    console.log(`[Gesture] Open palm detected (${palm.fingerCount} fingers)`);
  }

  /**
   * Handle point gesture
   * @param {Object} point - Point data
   * @param {Object} pose - Hand pose
   */
  handlePoint(point, pose) {
    const now = Date.now();
    const timeSinceLastGesture = now - this.lastGestureTime;

    if (timeSinceLastGesture < 200) return;

    this.lastGestureTime = now;

    const result = {
      type: 'point',
      confidence: 0.85,
      position: point.indexTip,
      handedness: pose.handedness
    };

    this.recordGesture(result);
    emitEvent('onPointGesture', result);

    console.log(`[Gesture] Point gesture detected`);
  }

  /**
   * Record gesture in history
   * @param {Object} result - Gesture result
   */
  recordGesture(result) {
    this.gestureHistory.push({
      ...result,
      timestamp: Date.now()
    });

    // Keep only recent history (last 100 gestures)
    if (this.gestureHistory.length > 100) {
      this.gestureHistory.shift();
    }

    // Track active gesture
    this.activeGestures.set(result.type, result);
  }

  /**
   * Visualize hand joints in scene
   * @param {Map} joints - Joint positions
   */
  visualizeJoints(joints) {
    // This would be implemented with Three.js to show joint positions
    // For now, just log for debugging
    if (joints.size > 0) {
      const jointNames = Array.from(joints.keys()).slice(0, 5);
      console.debug(`[Gesture] Tracking joints: ${jointNames.join(', ')}`);
    }
  }

  /**
   * Get gesture history
   * @returns {Array} Gesture history
   */
  getHistory() {
    return this.gestureHistory;
  }

  /**
   * Get active gestures
   * @returns {Map} Map of active gesture types
   */
  getActiveGestures() {
    return this.activeGestures;
  }

  /**
   * Check if specific gesture is active
   * @param {string} gestureType - Type of gesture
   * @returns {boolean} True if gesture is active
   */
  isGestureActive(gestureType) {
    return this.activeGestures.has(gestureType);
  }

  /**
   * Clear gesture history
   */
  clearHistory() {
    this.gestureHistory = [];
    this.activeGestures.clear();
  }
}

// Export singleton instance
export const gestureRecognizer = new GestureRecognizer();

// Expose globally for debugging
if (typeof window !== 'undefined') {
  window.gestureRecognizer = gestureRecognizer;
}

export default gestureRecognizer;
