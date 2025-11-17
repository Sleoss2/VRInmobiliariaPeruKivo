/**
 * VRInmobiliariaPeruKivo - Hand Pose Tracker
 * Advanced hand tracking and pose estimation
 * 
 * @file hand-pose-tracker.js
 */

import { emitEvent, addEventListener } from './vr-event-emitter.js';
import { config } from './config.js';
import { analytics } from './analytics.js';

/**
 * Hand Pose Tracker for tracking and analyzing hand positions
 */
class HandPoseTracker {
  constructor() {
    this.hands = {
      left: {
        tracked: false,
        joints: {},
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        confidence: 0,
        lastUpdate: 0
      },
      right: {
        tracked: false,
        joints: {},
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        confidence: 0,
        lastUpdate: 0
      }
    };

    this.poseHistory = {
      left: [],
      right: []
    };

    this.maxHistorySize = 30; // Keep ~0.5 seconds at 60 FPS
    this.trackingThreshold = config.HAND_CONFIG.TRACKING_CONFIDENCE_THRESHOLD;

    this.init();
  }

  /**
   * Initialize tracker
   */
  init() {
    // Listen to hand updates from input handler or WebXR
    addEventListener('onHandUpdate', (evt) => {
      const { hand, joints, position, rotation, confidence } = evt.detail;
      this.updateHandPose(hand, joints, position, rotation, confidence);
    });

    // Periodically analyze poses
    setInterval(() => {
      this.analyzePoses();
    }, 50); // 20 Hz analysis
  }

  /**
   * Update hand pose
   * @param {string} hand - 'left' or 'right'
   * @param {Object} joints - Joint positions
   * @param {Object} position - Hand position
   * @param {Object} rotation - Hand rotation
   * @param {number} confidence - Confidence 0-1
   */
  updateHandPose(hand, joints, position, rotation, confidence) {
    if (!this.hands[hand]) return;

    this.hands[hand].joints = joints;
    this.hands[hand].position = position;
    this.hands[hand].rotation = rotation;
    this.hands[hand].confidence = confidence;
    this.hands[hand].tracked = confidence > this.trackingThreshold;
    this.hands[hand].lastUpdate = Date.now();

    // Record to history
    this.recordPoseHistory(hand, { joints, position, rotation, confidence });

    // Emit update event
    emitEvent('onHandPoseUpdated', {
      hand,
      tracked: this.hands[hand].tracked,
      position,
      confidence
    });
  }

  /**
   * Record pose to history
   * @param {string} hand - 'left' or 'right'
   * @param {Object} pose - Pose data
   */
  recordPoseHistory(hand, pose) {
    if (!this.poseHistory[hand]) return;

    this.poseHistory[hand].push({
      timestamp: Date.now(),
      ...pose
    });

    // Trim history to max size
    if (this.poseHistory[hand].length > this.maxHistorySize) {
      this.poseHistory[hand].shift();
    }
  }

  /**
   * Analyze hand poses
   */
  analyzePoses() {
    for (const hand of ['left', 'right']) {
      if (!this.hands[hand].tracked) continue;

      const pose = this.hands[hand];

      // Calculate hand velocity
      const velocity = this.calculateHandVelocity(hand);

      // Check for gestures
      this.detectPoseGestures(hand, pose, velocity);

      // Record hand position for analytics
      if (config.ANALYTICS_CONFIG.ENABLED) {
        analytics.recordHandPosition({
          timestamp: Date.now(),
          hand,
          position: pose.position,
          confidence: pose.confidence,
          velocity
        });
      }
    }
  }

  /**
   * Calculate hand velocity
   * @param {string} hand - 'left' or 'right'
   * @returns {number} Velocity magnitude
   */
  calculateHandVelocity(hand) {
    const history = this.poseHistory[hand];
    if (history.length < 2) return 0;

    const current = history[history.length - 1];
    const previous = history[history.length - 2];

    const dx = current.position.x - previous.position.x;
    const dy = current.position.y - previous.position.y;
    const dz = current.position.z - previous.position.z;

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const timeElapsed = (current.timestamp - previous.timestamp) / 1000; // Convert to seconds

    return timeElapsed > 0 ? distance / timeElapsed : 0;
  }

  /**
   * Detect pose-based gestures
   * @param {string} hand - 'left' or 'right'
   * @param {Object} pose - Current pose
   * @param {number} velocity - Hand velocity
   */
  detectPoseGestures(hand, pose, velocity) {
    const joints = pose.joints;
    if (!joints || Object.keys(joints).length === 0) return;

    // Detect raised hand (thumb pointing up)
    if (this.detectRaisedHand(joints)) {
      emitEvent('onRaisedHand', { hand, position: pose.position });
    }

    // Detect fist
    if (this.detectFist(joints)) {
      emitEvent('onFistGesture', { hand, position: pose.position });
    }

    // Detect flat hand (open palm facing camera)
    if (this.detectFlatHand(joints)) {
      emitEvent('onFlatHandGesture', { hand, position: pose.position });
    }

    // Detect rapid movement (swing/throw)
    if (velocity > config.GESTURE_CONFIG.SWING_VELOCITY_THRESHOLD) {
      emitEvent('onSwingGesture', { hand, velocity, position: pose.position });
    }

    // Detect slow movement (precise placement)
    if (velocity > 0 && velocity < 0.1) {
      emitEvent('onPreciseMovement', { hand, velocity, position: pose.position });
    }
  }

  /**
   * Detect raised hand pose (thumb up)
   * @param {Object} joints - Joint positions
   * @returns {boolean} True if raised hand detected
   */
  detectRaisedHand(joints) {
    if (!joints.thumb_tip || !joints.wrist) return false;

    // Thumb should be above wrist (higher Y value)
    const thumbAboveWrist = joints.thumb_tip.y > joints.wrist.y + 0.1;
    const palmUpward = joints.middle_finger_mcp?.z > joints.wrist?.z;

    return thumbAboveWrist && palmUpward;
  }

  /**
   * Detect fist pose
   * @param {Object} joints - Joint positions
   * @returns {boolean} True if fist detected
   */
  detectFist(joints) {
    if (!joints.index_finger_tip || !joints.middle_finger_tip) return false;

    // All finger tips should be close to palm/wrist
    const fingersClose = this.pointsClose(
      joints.index_finger_tip,
      joints.wrist,
      0.15
    ) &&
      this.pointsClose(joints.middle_finger_tip, joints.wrist, 0.15) &&
      this.pointsClose(joints.ring_finger_tip, joints.wrist, 0.15) &&
      this.pointsClose(joints.pinky_tip, joints.wrist, 0.15);

    return fingersClose;
  }

  /**
   * Detect flat hand pose (open palm)
   * @param {Object} joints - Joint positions
   * @returns {boolean} True if flat hand detected
   */
  detectFlatHand(joints) {
    if (!joints.index_finger_tip || !joints.middle_finger_tip) return false;

    // Finger tips should be far from wrist (hand open)
    const fingersOpen = this.pointsDistance(
      joints.index_finger_tip,
      joints.middle_finger_tip
    ) > 0.1;

    // Fingers should be spread apart
    const spreadApart =
      this.pointsDistance(joints.index_finger_tip, joints.pinky_tip) > 0.15;

    return fingersOpen && spreadApart;
  }

  /**
   * Calculate distance between two 3D points
   * @param {Object} p1 - Point 1 {x, y, z}
   * @param {Object} p2 - Point 2 {x, y, z}
   * @returns {number} Distance
   */
  pointsDistance(p1, p2) {
    if (!p1 || !p2) return 0;
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Check if two points are close
   * @param {Object} p1 - Point 1
   * @param {Object} p2 - Point 2
   * @param {number} threshold - Distance threshold
   * @returns {boolean} True if close
   */
  pointsClose(p1, p2, threshold = 0.1) {
    return this.pointsDistance(p1, p2) < threshold;
  }

  /**
   * Get hand data
   * @param {string} hand - 'left' or 'right'
   * @returns {Object} Hand data
   */
  getHandData(hand) {
    return this.hands[hand] || null;
  }

  /**
   * Get pose history
   * @param {string} hand - 'left' or 'right'
   * @returns {Array} Pose history
   */
  getPoseHistory(hand) {
    return this.poseHistory[hand] || [];
  }

  /**
   * Is hand being tracked
   * @param {string} hand - 'left' or 'right'
   * @returns {boolean} True if tracked
   */
  isTracked(hand) {
    return this.hands[hand]?.tracked || false;
  }

  /**
   * Get both hands status
   * @returns {Object} Status of both hands
   */
  getStatus() {
    return {
      left: {
        tracked: this.hands.left.tracked,
        confidence: this.hands.left.confidence,
        position: this.hands.left.position,
        lastUpdate: this.hands.left.lastUpdate
      },
      right: {
        tracked: this.hands.right.tracked,
        confidence: this.hands.right.confidence,
        position: this.hands.right.position,
        lastUpdate: this.hands.right.lastUpdate
      }
    };
  }

  /**
   * Reset all tracking
   */
  reset() {
    for (const hand of ['left', 'right']) {
      this.hands[hand].tracked = false;
      this.hands[hand].joints = {};
      this.hands[hand].confidence = 0;
      this.poseHistory[hand] = [];
    }
  }
}

// Export singleton instance
export const handPoseTracker = new HandPoseTracker();

// Expose globally for debugging
if (typeof window !== 'undefined') {
  window.handPoseTracker = handPoseTracker;
}

export default handPoseTracker;
