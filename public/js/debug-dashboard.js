/**
 * VRInmobiliariaPeruKivo - Debug Dashboard
 * Real-time monitoring dashboard for analytics and performance
 * 
 * @file debug-dashboard.js
 */

import { analytics } from './analytics.js';
import { profiler } from './performance-profiler.js';
import { config } from './config.js';
import { addEventListener } from './vr-event-emitter.js';

/**
 * Debug Dashboard for monitoring analytics and performance
 */
class DebugDashboard {
  constructor(containerId = 'debug') {
    this.container = document.getElementById(containerId);
    this.updateInterval = null;
    this.isExpanded = true;
    this.tabs = ['overview', 'analytics', 'performance', 'settings'];
    this.currentTab = 'overview';

    this.init();
  }

  /**
   * Initialize dashboard
   */
  init() {
    if (!this.container) {
      console.warn('[DebugDashboard] Container not found');
      return;
    }

    this.createTabButtons();
    this.startUpdating();

    // Listen to events
    addEventListener('onFpsUpdate', () => this.update());
  }

  /**
   * Create tab buttons
   */
  createTabButtons() {
    const tabBar = document.createElement('div');
    tabBar.style.cssText = `
      display: flex;
      gap: 4px;
      margin-bottom: 8px;
      border-bottom: 1px solid #00ff00;
      padding-bottom: 4px;
    `;

    this.tabs.forEach(tab => {
      const btn = document.createElement('button');
      btn.textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
      btn.style.cssText = `
        background: ${this.currentTab === tab ? '#00ff00' : 'transparent'};
        color: ${this.currentTab === tab ? '#000' : '#00ff00'};
        border: 1px solid #00ff00;
        padding: 2px 8px;
        cursor: pointer;
        font-family: 'Courier New', monospace;
        font-size: 10px;
        border-radius: 2px;
      `;
      btn.onclick = () => this.switchTab(tab);
      tabBar.appendChild(btn);
    });

    this.tabBar = tabBar;
    this.container.insertBefore(tabBar, this.container.firstChild);
  }

  /**
   * Switch to tab
   * @param {string} tab - Tab name
   */
  switchTab(tab) {
    if (!this.tabs.includes(tab)) return;

    this.currentTab = tab;
    this.update();

    // Update tab button styles
    Array.from(this.tabBar.children).forEach((btn, i) => {
      const tabName = this.tabs[i];
      btn.style.background = tabName === tab ? '#00ff00' : 'transparent';
      btn.style.color = tabName === tab ? '#000' : '#00ff00';
    });
  }

  /**
   * Update dashboard display
   */
  update() {
    const content = this.generateContent();
    
    // Find or create content container
    let contentDiv = this.container.querySelector('#dashboard-content');
    if (!contentDiv) {
      contentDiv = document.createElement('div');
      contentDiv.id = 'dashboard-content';
      this.container.appendChild(contentDiv);
    }

    contentDiv.innerHTML = content;
  }

  /**
   * Generate content for current tab
   * @returns {string} HTML content
   */
  generateContent() {
    switch (this.currentTab) {
      case 'analytics':
        return this.generateAnalyticsContent();
      case 'performance':
        return this.generatePerformanceContent();
      case 'settings':
        return this.generateSettingsContent();
      case 'overview':
      default:
        return this.generateOverviewContent();
    }
  }

  /**
   * Generate overview tab content
   * @returns {string} HTML
   */
  generateOverviewContent() {
    const metrics = profiler.getMetrics();
    const analyticsData = analytics.getMetrics();

    return `
      <div class="debug-line"><strong>⚡ SYSTEM OVERVIEW</strong></div>
      <div class="debug-line">---</div>
      
      <div class="debug-line">FPS: <span class="debug-value">${metrics.fps}</span></div>
      <div class="debug-line">Frame: <span class="debug-value">${metrics.frameTime.toFixed(1)}ms</span></div>
      <div class="debug-line">Memory: <span class="debug-value">${metrics.memoryUsed.toFixed(1)}MB</span></div>
      <div class="debug-line">Latency: <span class="debug-value">${metrics.inputLatency.toFixed(1)}ms</span></div>
      
      <div class="debug-line">---</div>
      
      <div class="debug-line"><strong>📊 INTERACTIONS</strong></div>
      <div class="debug-line">Grabs: <span class="debug-value">${analyticsData.grabCount || 0}</span></div>
      <div class="debug-line">Drags: <span class="debug-value">${analyticsData.dragCount || 0}</span></div>
      <div class="debug-line">Views: <span class="debug-value">${analyticsData.viewCount || 0}</span></div>
      
      <div class="debug-line">---</div>
      
      <div class="debug-line"><strong>🎯 HEALTH</strong></div>
      ${this.generateHealthStatus()}
    `;
  }

  /**
   * Generate health status
   * @returns {string} HTML
   */
  generateHealthStatus() {
    const health = profiler.getHealthStatus();
    const statusColor = health.healthy ? '#00ff00' : '#ffaa00';
    const status = health.healthy ? '✓ HEALTHY' : '⚠ ISSUES';

    let html = `<div class="debug-line"><span style="color: ${statusColor}">${status}</span></div>`;

    if (health.issues.length > 0) {
      health.issues.forEach(issue => {
        html += `<div class="debug-line" style="color: #ffaa00; font-size: 9px;">• ${issue}</div>`;
      });
    }

    return html;
  }

  /**
   * Generate analytics tab content
   * @returns {string} HTML
   */
  generateAnalyticsContent() {
    const data = analytics.getMetrics();
    const stats = analytics.getPropertyStats();

    return `
      <div class="debug-line"><strong>📊 ANALYTICS DATA</strong></div>
      <div class="debug-line">---</div>
      
      <div class="debug-line">Session ID: <span class="debug-value">${data.sessionId?.substring(0, 8) || 'N/A'}...</span></div>
      <div class="debug-line">Duration: <span class="debug-value">${Math.round((Date.now() - (data.startTime || 0)) / 1000)}s</span></div>
      
      <div class="debug-line">---</div>
      
      <div class="debug-line"><strong>INTERACTIONS</strong></div>
      <div class="debug-line">Grabs: <span class="debug-value">${data.grabCount || 0}</span></div>
      <div class="debug-line">Drag Success: <span class="debug-value">${data.dragCount || 0}</span></div>
      <div class="debug-line">Properties Viewed: <span class="debug-value">${data.viewCount || 0}</span></div>
      
      <div class="debug-line">---</div>
      
      <div class="debug-line"><strong>GRAB STATS</strong></div>
      <div class="debug-line">Success Rate: <span class="debug-value">${stats.avgGrabSuccess?.toFixed(1) || 'N/A'}%</span></div>
      <div class="debug-line">Avg Duration: <span class="debug-value">${stats.avgGrabDuration?.toFixed(0) || 'N/A'}ms</span></div>
      
      <div class="debug-line">---</div>
      <div class="debug-line"><small style="color: #666">Batch: ${data.batchCount || 0} | Ready: ${data.readyForUpload ? '✓' : '✗'}</small></div>
    `;
  }

  /**
   * Generate performance tab content
   * @returns {string} HTML
   */
  generatePerformanceContent() {
    const summary = profiler.getSummary();
    const current = summary.current;
    const averages = summary.averages;
    const peaks = summary.peaks;

    return `
      <div class="debug-line"><strong>⚡ PERFORMANCE METRICS</strong></div>
      <div class="debug-line">---</div>
      
      <div class="debug-line"><strong>CURRENT</strong></div>
      <div class="debug-line">FPS: <span class="debug-value">${current.fps}</span></div>
      <div class="debug-line">Frame Time: <span class="debug-value">${current.frameTime.toFixed(2)}ms</span></div>
      <div class="debug-line">Memory: <span class="debug-value">${current.memoryUsed.toFixed(1)}MB</span></div>
      <div class="debug-line">Input Latency: <span class="debug-value">${current.inputLatency.toFixed(1)}ms</span></div>
      
      <div class="debug-line">---</div>
      
      <div class="debug-line"><strong>AVERAGES</strong></div>
      <div class="debug-line">FPS Avg: <span class="debug-value">${averages.fps.toFixed(1)}</span></div>
      <div class="debug-line">Frame Avg: <span class="debug-value">${averages.frameTime.toFixed(2)}ms</span></div>
      <div class="debug-line">Memory Avg: <span class="debug-value">${averages.memoryUsed.toFixed(1)}MB</span></div>
      
      <div class="debug-line">---</div>
      
      <div class="debug-line"><strong>PEAKS</strong></div>
      <div class="debug-line">Max Frame Time: <span class="debug-value">${peaks.frameTimeMax.toFixed(2)}ms</span></div>
      <div class="debug-line">Max Memory: <span class="debug-value">${peaks.memoryMax.toFixed(1)}MB</span></div>
      <div class="debug-line">Max Latency: <span class="debug-value">${peaks.latencyMax.toFixed(1)}ms</span></div>
    `;
  }

  /**
   * Generate settings tab content
   * @returns {string} HTML
   */
  generateSettingsContent() {
    return `
      <div class="debug-line"><strong>⚙️ SETTINGS</strong></div>
      <div class="debug-line">---</div>
      
      <div class="debug-line"><strong>PROFILING</strong></div>
      <div class="debug-line">
        Frame Time: 
        <span class="debug-value" style="cursor: pointer" onclick="config.DEBUG_CONFIG.PROFILE_FRAME_TIME = !config.DEBUG_CONFIG.PROFILE_FRAME_TIME; this.textContent = config.DEBUG_CONFIG.PROFILE_FRAME_TIME ? 'ON' : 'OFF'">
          ${config.DEBUG_CONFIG.PROFILE_FRAME_TIME ? 'ON' : 'OFF'}
        </span>
      </div>
      <div class="debug-line">
        Input Latency: 
        <span class="debug-value" style="cursor: pointer" onclick="config.DEBUG_CONFIG.PROFILE_INPUT_LATENCY = !config.DEBUG_CONFIG.PROFILE_INPUT_LATENCY; this.textContent = config.DEBUG_CONFIG.PROFILE_INPUT_LATENCY ? 'ON' : 'OFF'">
          ${config.DEBUG_CONFIG.PROFILE_INPUT_LATENCY ? 'ON' : 'OFF'}
        </span>
      </div>
      
      <div class="debug-line">---</div>
      
      <div class="debug-line"><strong>ANALYTICS</strong></div>
      <div class="debug-line">
        Enabled: 
        <span class="debug-value" style="cursor: pointer" onclick="config.ANALYTICS_CONFIG.ENABLED = !config.ANALYTICS_CONFIG.ENABLED; this.textContent = config.ANALYTICS_CONFIG.ENABLED ? 'ON' : 'OFF'">
          ${config.ANALYTICS_CONFIG.ENABLED ? 'ON' : 'OFF'}
        </span>
      </div>
      <div class="debug-line">
        Auto Upload: 
        <span class="debug-value" style="cursor: pointer" onclick="config.ANALYTICS_CONFIG.AUTO_UPLOAD = !config.ANALYTICS_CONFIG.AUTO_UPLOAD; this.textContent = config.ANALYTICS_CONFIG.AUTO_UPLOAD ? 'ON' : 'OFF'">
          ${config.ANALYTICS_CONFIG.AUTO_UPLOAD ? 'ON' : 'OFF'}
        </span>
      </div>
      
      <div class="debug-line">---</div>
      
      <div class="debug-line"><small style="color: #666">v1.0.0 Debug Dashboard</small></div>
    `;
  }

  /**
   * Start updating dashboard
   */
  startUpdating() {
    this.updateInterval = setInterval(() => {
      this.update();
    }, 500); // Update every 500ms
  }

  /**
   * Stop updating dashboard
   */
  stopUpdating() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  /**
   * Export all data
   * @returns {Object} Combined analytics and performance data
   */
  exportData() {
    return {
      timestamp: Date.now(),
      analytics: analytics.exportData(),
      performance: profiler.exportData()
    };
  }

  /**
   * Download export as JSON
   */
  downloadExport() {
    const data = this.exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vr-debug-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export const dashboard = new DebugDashboard('debug');

// Expose globally for console access
if (typeof window !== 'undefined') {
  window.dashboard = dashboard;
}

export default dashboard;
