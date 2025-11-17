/**
 * VRInmobiliariaPeruKivo - Analytics & Metrics Tracker
 * Tracks hand interactions, property engagement, and performance metrics
 * 
 * @file analytics.js
 */

import { addEventListener, emitEvent } from './vr-event-emitter.js';
import { ANALYTICS_CONFIG } from './config.js';

/**
 * Analytics system for tracking user interactions
 */
class Analytics {
  constructor() {
    this.sessionStartTime = Date.now();
    this.interactionLog = [];
    this.propertyViews = {};
    this.handPositionHistory = [];
    this.metrics = {
      totalGrabs: 0,
      totalDrags: 0,
      successfulInteractions: 0,
      failedInteractions: 0,
      averageGrabDuration: 0,
      averageDragDistance: 0,
      mostInteractedProperty: null,
      userSatisfactionScore: 0
    };
    
    this.init();
  }

  /**
   * Initialize analytics listeners
   */
  init() {
    if (!ANALYTICS_CONFIG.ENABLE_ANALYTICS) return;

    // Track grab events
    addEventListener('onPanelGrab', (data) => {
      this.recordGrab(data);
    });

    // Track drag events
    addEventListener('onPanelDrag', (data) => {
      this.recordDrag(data);
    });

    // Track property views
    addEventListener('onPropertyViewed', (data) => {
      this.recordPropertyView(data);
    });

    // Track hand movement
    if (ANALYTICS_CONFIG.COLLECT_HAND_POSITION_HISTORY) {
      addEventListener('onHandPositionUpdate', (data) => {
        this.recordHandPosition(data);
      });
    }

    // Batch upload events periodically
    if (ANALYTICS_CONFIG.BATCH_UPLOAD_INTERVAL > 0) {
      setInterval(() => this.uploadBatch(), ANALYTICS_CONFIG.BATCH_UPLOAD_INTERVAL);
    }
  }

  /**
   * Record a grab interaction
   * @param {Object} data - Grab event data
   */
  recordGrab(data) {
    this.metrics.totalGrabs++;
    
    const record = {
      type: 'grab',
      timestamp: Date.now(),
      panelId: data.panelId,
      handPosition: data.handPosition,
      success: data.success !== false
    };

    if (record.success) {
      this.metrics.successfulInteractions++;
    } else {
      this.metrics.failedInteractions++;
    }

    this.interactionLog.push(record);

    console.log(`[Analytics] Grab recorded: ${data.panelId} (Success: ${record.success})`);
  }

  /**
   * Record a drag interaction
   * @param {Object} data - Drag event data
   */
  recordDrag(data) {
    this.metrics.totalDrags++;

    const record = {
      type: 'drag',
      timestamp: Date.now(),
      panelId: data.panelId,
      distance: data.dragDistance || 0,
      velocity: data.velocity || 0,
      duration: data.duration || 0
    };

    this.interactionLog.push(record);

    // Update average drag distance
    const dragRecords = this.interactionLog.filter(r => r.type === 'drag');
    this.metrics.averageDragDistance = 
      dragRecords.reduce((sum, r) => sum + r.distance, 0) / dragRecords.length;

    console.log(`[Analytics] Drag recorded: ${data.panelId} (Distance: ${data.dragDistance}px)`);
  }

  /**
   * Record property view
   * @param {Object} data - Property view data
   */
  recordPropertyView(data) {
    const propertyId = data.propertyId;

    if (!this.propertyViews[propertyId]) {
      this.propertyViews[propertyId] = {
        viewCount: 0,
        totalViewTime: 0,
        firstViewTime: Date.now(),
        interactions: []
      };
    }

    this.propertyViews[propertyId].viewCount++;
    this.propertyViews[propertyId].interactions.push({
      type: data.interactionType,
      timestamp: Date.now()
    });

    // Update most interacted property
    const maxViews = Math.max(...Object.values(this.propertyViews).map(v => v.viewCount));
    this.metrics.mostInteractedProperty = Object.keys(this.propertyViews).find(
      id => this.propertyViews[id].viewCount === maxViews
    );

    console.log(`[Analytics] Property viewed: ${propertyId} (View count: ${this.propertyViews[propertyId].viewCount})`);
  }

  /**
   * Record hand position for heatmap analysis
   * @param {Object} data - Hand position data
   */
  recordHandPosition(data) {
    if (this.handPositionHistory.length > ANALYTICS_CONFIG.MAX_HISTORY_SIZE) {
      this.handPositionHistory.shift(); // Remove oldest entry
    }

    this.handPositionHistory.push({
      timestamp: Date.now(),
      position: data.position,
      zone: data.zone // 'approach', 'grab', 'collision', etc.
    });
  }

  /**
   * Get session metrics
   * @returns {Object} Current metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      sessionDuration: Date.now() - this.sessionStartTime,
      totalEvents: this.interactionLog.length,
      propertyViewCount: Object.keys(this.propertyViews).length
    };
  }

  /**
   * Get property statistics
   * @returns {Object} Property view statistics
   */
  getPropertyStats() {
    return Object.entries(this.propertyViews).map(([propertyId, data]) => ({
      propertyId,
      viewCount: data.viewCount,
      totalViewTime: data.totalViewTime,
      interactionCount: data.interactions.length
    }));
  }

  /**
   * Get hand position heatmap data
   * @returns {Array} Hand position history
   */
  getHandHeatmap() {
    return this.handPositionHistory;
  }

  /**
   * Upload batch of analytics events
   */
  async uploadBatch() {
    if (this.interactionLog.length === 0) return;

    const batch = this.interactionLog.splice(0, ANALYTICS_CONFIG.BATCH_SIZE);

    try {
      // Upload to new API endpoints
      const endpoints = {
        'grab': '/api/analytics/interactions',
        'drag': '/api/analytics/interactions',
        'property_view': '/api/analytics/interactions',
        'gesture': '/api/analytics/gestures'
      };

      // Group by type
      const byType = {};
      batch.forEach(event => {
        if (!byType[event.type]) byType[event.type] = [];
        byType[event.type].push(event);
      });

      // Upload each type to appropriate endpoint
      for (const [type, events] of Object.entries(byType)) {
        const endpoint = endpoints[type] || '/api/analytics/interactions';
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: this.getSessionId(),
            timestamp: Date.now(),
            events: events
          })
        });

        if (response.ok) {
          console.log(`[Analytics] Uploaded ${events.length} ${type} events`);
        } else {
          console.warn(`[Analytics] Upload to ${endpoint} returned ${response.status}`);
          // Re-add events if failed
          this.interactionLog.unshift(...events);
        }
      }
    } catch (error) {
      console.error('[Analytics] Upload failed:', error);
      // Re-add events to queue if upload failed
      this.interactionLog.unshift(...batch);
    }
  }

  /**
   * Start session on server
   */
  async startSession() {
    try {
      const response = await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.getSessionId(),
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          startTime: Date.now()
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[Analytics] Session started on server:', data.sessionId);
      }
    } catch (error) {
      console.error('[Analytics] Failed to start session:', error);
    }
  }

  /**
   * Get or create session ID
   * @returns {string} Session ID
   */
  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return this.sessionId;
  }

  /**
   * Export analytics data
   * @returns {Object} Complete analytics export
   */
  exportData() {
    return {
      sessionId: this.getSessionId(),
      sessionStartTime: this.sessionStartTime,
      sessionDuration: Date.now() - this.sessionStartTime,
      metrics: this.getMetrics(),
      propertyStats: this.getPropertyStats(),
      handHeatmap: this.getHandHeatmap(),
      interactionLog: this.interactionLog
    };
  }

  /**
   * Log event to console
   * @param {string} message - Message to log
   * @param {Object} data - Data to log
   */
  log(message, data = null) {
    if (ANALYTICS_CONFIG.LOG_LEVEL === 'debug') {
      console.log(`[Analytics] ${message}`, data);
    }
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Expose globally for debugging
if (typeof window !== 'undefined') {
  window.analytics = analytics;
}

export default analytics;
