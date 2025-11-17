/**
 * VRInmobiliariaPeruKivo - Performance Profiler
 * Real-time performance monitoring and profiling system
 * 
 * @file performance-profiler.js
 */

import { emitEvent, addEventListener } from './vr-event-emitter.js';
import { DEBUG_CONFIG } from './config.js';

/**
 * Performance profiler for monitoring and optimizing
 */
class PerformanceProfiler {
  constructor() {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      memoryUsed: 0,
      modelLoadTime: 0,
      inputLatency: 0,
      renderTime: 0,
      physicsTime: 0
    };

    this.history = {
      fps: [],
      frameTime: [],
      memoryUsed: [],
      inputLatency: []
    };

    this.marks = new Map();
    this.measures = new Map();
    this.maxHistorySize = 300; // Keep 5 seconds at 60 FPS

    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.fpsCheckInterval = 1000; // ms
    this.lastFpsCheck = Date.now();

    this.init();
  }

  /**
   * Initialize profiler
   */
  init() {
    if (!DEBUG_CONFIG.ENABLE_PERFORMANCE_PROFILING) return;

    // Profile frame time if enabled
    if (DEBUG_CONFIG.PROFILE_FRAME_TIME) {
      addEventListener('onFrameStart', () => {
        this.markFrameStart();
      });

      addEventListener('onFrameEnd', () => {
        this.markFrameEnd();
      });
    }

    // Profile input latency if enabled
    if (DEBUG_CONFIG.PROFILE_INPUT_LATENCY) {
      addEventListener('onInputStart', () => {
        this.markInputStart();
      });

      addEventListener('onInputEnd', () => {
        this.markInputEnd();
      });
    }

    // Profile render time if enabled
    if (DEBUG_CONFIG.PROFILE_RENDER_TIME) {
      addEventListener('onRenderStart', () => {
        this.markRenderStart();
      });

      addEventListener('onRenderEnd', () => {
        this.markRenderEnd();
      });
    }

    // Monitor memory usage every 500ms
    if (performance.memory) {
      setInterval(() => {
        this.updateMemoryMetrics();
      }, 500);
    }
  }

  /**
   * Mark start of frame
   */
  markFrameStart() {
    this.marks.set('frameStart', performance.now());
  }

  /**
   * Mark end of frame and calculate frame time
   */
  markFrameEnd() {
    const now = performance.now();
    const frameStart = this.marks.get('frameStart') || now;
    const frameTime = now - frameStart;

    this.metrics.frameTime = frameTime;
    this.recordMetricHistory('frameTime', frameTime);

    this.frameCount++;
    const now_date = Date.now();
    const elapsed = now_date - this.lastFpsCheck;

    // Update FPS every second
    if (elapsed >= this.fpsCheckInterval) {
      this.metrics.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.recordMetricHistory('fps', this.metrics.fps);
      this.frameCount = 0;
      this.lastFpsCheck = now_date;

      emitEvent('onFpsUpdate', { fps: this.metrics.fps, frameTime });
    }
  }

  /**
   * Mark input start
   */
  markInputStart() {
    this.marks.set('inputStart', performance.now());
  }

  /**
   * Mark input end and calculate latency
   */
  markInputEnd() {
    const now = performance.now();
    const inputStart = this.marks.get('inputStart') || now;
    const latency = now - inputStart;

    this.metrics.inputLatency = latency;
    this.recordMetricHistory('inputLatency', latency);

    if (latency > 50) {
      console.warn(`[Profiler] High input latency detected: ${latency.toFixed(2)}ms`);
    }
  }

  /**
   * Mark render start
   */
  markRenderStart() {
    this.marks.set('renderStart', performance.now());
  }

  /**
   * Mark render end and calculate render time
   */
  markRenderEnd() {
    const now = performance.now();
    const renderStart = this.marks.get('renderStart') || now;
    const renderTime = now - renderStart;

    this.metrics.renderTime = renderTime;

    if (renderTime > 14) {
      console.warn(`[Profiler] High render time: ${renderTime.toFixed(2)}ms`);
    }
  }

  /**
   * Update memory metrics
   */
  updateMemoryMetrics() {
    if (!performance.memory) return;

    const memUsed = performance.memory.usedJSHeapSize / 1048576; // Convert to MB
    this.metrics.memoryUsed = memUsed;
    this.recordMetricHistory('memoryUsed', memUsed);

    if (memUsed > 140) {
      console.warn(`[Profiler] High memory usage: ${memUsed.toFixed(1)}MB`);
    }
  }

  /**
   * Record metric to history
   * @param {string} metricName - Name of metric
   * @param {number} value - Value to record
   */
  recordMetricHistory(metricName, value) {
    if (!this.history[metricName]) {
      this.history[metricName] = [];
    }

    this.history[metricName].push({
      timestamp: Date.now(),
      value
    });

    // Trim history to max size
    if (this.history[metricName].length > this.maxHistorySize) {
      this.history[metricName].shift();
    }
  }

  /**
   * Start a named performance mark
   * @param {string} name - Mark name
   */
  startMark(name) {
    this.marks.set(name, performance.now());
  }

  /**
   * End a named performance mark and record measure
   * @param {string} name - Mark name
   * @returns {number} Measured time in ms
   */
  endMark(name) {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`[Profiler] No start mark found for: ${name}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.measures.set(name, duration);
    this.marks.delete(name);

    return duration;
  }

  /**
   * Get measure value
   * @param {string} name - Measure name
   * @returns {number} Duration in ms
   */
  getMeasure(name) {
    return this.measures.get(name) || 0;
  }

  /**
   * Get all current metrics
   * @returns {Object} Current metrics snapshot
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Get metric history
   * @param {string} metricName - Name of metric
   * @param {number} limit - Number of recent entries (optional)
   * @returns {Array} Metric history
   */
  getHistory(metricName, limit = null) {
    const history = this.history[metricName] || [];
    if (limit) {
      return history.slice(-limit);
    }
    return history;
  }

  /**
   * Calculate average for metric
   * @param {string} metricName - Name of metric
   * @returns {number} Average value
   */
  getAverage(metricName) {
    const history = this.history[metricName] || [];
    if (history.length === 0) return 0;

    const sum = history.reduce((acc, entry) => acc + entry.value, 0);
    return sum / history.length;
  }

  /**
   * Calculate min value for metric
   * @param {string} metricName - Name of metric
   * @returns {number} Minimum value
   */
  getMin(metricName) {
    const history = this.history[metricName] || [];
    if (history.length === 0) return 0;

    return Math.min(...history.map(e => e.value));
  }

  /**
   * Calculate max value for metric
   * @param {string} metricName - Name of metric
   * @returns {number} Maximum value
   */
  getMax(metricName) {
    const history = this.history[metricName] || [];
    if (history.length === 0) return 0;

    return Math.max(...history.map(e => e.value));
  }

  /**
   * Get performance summary
   * @returns {Object} Performance summary
   */
  getSummary() {
    return {
      current: this.getMetrics(),
      averages: {
        fps: this.getAverage('fps'),
        frameTime: this.getAverage('frameTime'),
        memoryUsed: this.getAverage('memoryUsed'),
        inputLatency: this.getAverage('inputLatency')
      },
      peaks: {
        fpsMax: this.getMax('fps'),
        frameTimeMax: this.getMax('frameTime'),
        memoryMax: this.getMax('memoryUsed'),
        latencyMax: this.getMax('inputLatency')
      },
      minimums: {
        fpsMin: this.getMin('fps'),
        frameTimeMin: this.getMin('frameTime'),
        memoryMin: this.getMin('memoryUsed'),
        latencyMin: this.getMin('inputLatency')
      }
    };
  }

  /**
   * Get performance health status
   * @returns {Object} Health check results
   */
  getHealthStatus() {
    const metrics = this.getMetrics();
    const status = {
      healthy: true,
      issues: []
    };

    if (metrics.fps < 80) {
      status.healthy = false;
      status.issues.push(`Low FPS: ${metrics.fps} (target: 90)`);
    }

    if (metrics.inputLatency > 50) {
      status.healthy = false;
      status.issues.push(`High input latency: ${metrics.inputLatency.toFixed(1)}ms`);
    }

    if (metrics.memoryUsed > 140) {
      status.healthy = false;
      status.issues.push(`High memory usage: ${metrics.memoryUsed.toFixed(1)}MB`);
    }

    if (metrics.frameTime > 16.67) {
      status.healthy = false;
      status.issues.push(`High frame time: ${metrics.frameTime.toFixed(2)}ms`);
    }

    return status;
  }

  /**
   * Clear all history
   */
  clearHistory() {
    this.history = {
      fps: [],
      frameTime: [],
      memoryUsed: [],
      inputLatency: []
    };
  }

  /**
   * Export performance data
   * @returns {Object} Complete performance data
   */
  exportData() {
    return {
      timestamp: Date.now(),
      metrics: this.getMetrics(),
      summary: this.getSummary(),
      health: this.getHealthStatus(),
      history: this.history
    };
  }
}

// Export singleton instance
export const profiler = new PerformanceProfiler();

// Expose globally for debugging
if (typeof window !== 'undefined') {
  window.profiler = profiler;
}

export default profiler;
