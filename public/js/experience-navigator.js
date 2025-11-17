/**
 * VRInmobiliariaPeruKivo - Shared Navigation Module
 * Connects VR and AR experiences with unified analytics
 * 
 * @file experience-navigator.js
 * Simple standalone navigator that works with global objects
 */

class ExperienceNavigator {
  constructor() {
    this.currentExperience = this.detectExperience();
    this.sessionData = this.loadSessionData();
    this.init();
  }

  /**
   * Detect current experience
   * @returns {string} 'vr' | 'ar' | 'home'
   */
  detectExperience() {
    const pathname = window.location.pathname;
    if (pathname.includes('vr.html')) return 'vr';
    if (pathname.includes('va.html')) return 'ar';
    if (pathname.includes('integration-test')) return 'test';
    return 'home';
  }

  /**
   * Initialize navigator
   */
  init() {
    this.logExperienceStart();
    this.setupNavigationLinks();
    this.setupExperienceSwitcher();
    this.syncAnalytics();
  }

  /**
   * Log experience start to analytics
   */
  logExperienceStart() {
    console.log(`[Navigator] Started experience: ${this.currentExperience.toUpperCase()}`);

    const experienceData = {
      timestamp: Date.now(),
      experience: this.currentExperience,
      sessionId: this.getOrCreateSessionId(),
      url: window.location.pathname,
      referrer: document.referrer || 'direct'
    };

    // Record in session data
    this.sessionData.experiences = this.sessionData.experiences || [];
    this.sessionData.experiences.push(experienceData);
    this.saveSessionData();

    // Track in analytics (if available globally)
    if (window.analytics) {
      try {
        window.analytics.recordPropertyView({
          timestamp: Date.now(),
          property: { 
            id: `experience-${this.currentExperience}`,
            title: `Experience: ${this.currentExperience.toUpperCase()}` 
          },
          duration: 0,
          experienceType: this.currentExperience
        });
      } catch (e) {
        console.log('[Navigator] Analytics not ready yet');
      }
    }
  }

  /**
   * Setup navigation links
   */
  setupNavigationLinks() {
    // Add navigation handler for back buttons
    const backButtons = document.querySelectorAll('[id*="back-btn"], [href="/"]');
    backButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Don't prevent default for href="/", just track
        if (btn.id === 'back-btn' || !btn.href) {
          e.preventDefault();
          this.navigateToHome();
        } else {
          this.trackNavigation('home');
        }
      });
    });
  }

  /**
   * Setup experience switcher UI
   */
  setupExperienceSwitcher() {
    // Only show if not already on home page
    if (this.currentExperience === 'home') return;

    const switcher = document.createElement('div');
    switcher.id = 'experience-switcher';
    switcher.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      display: flex;
      gap: 10px;
      z-index: 1000;
      flex-direction: column;
    `;

    // Create nav buttons
    const navData = [
      { label: '🏠 Home', path: '/', icon: '🏠' },
      { label: '🥽 VR', path: '/vr.html', icon: '🥽' },
      { label: '📱 AR', path: '/va.html', icon: '📱' },
      { label: '🧪 Test', path: '/integration-test.html', icon: '🧪' }
    ];

    navData.forEach(nav => {
      const btn = document.createElement('button');
      btn.textContent = nav.label;
      btn.dataset.path = nav.path;
      btn.style.cssText = `
        padding: 8px 12px;
        background: ${nav.path.includes('vr') ? '#667eea' : nav.path.includes('va') ? '#f5576c' : '#4facfe'};
        color: #fff;
        border: 1px solid #fff;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        font-weight: bold;
        text-decoration: none;
        transition: 0.2s;
        text-align: center;
      `;
      btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
      btn.onmouseout = () => btn.style.transform = 'scale(1)';

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (nav.path === '/') {
          this.navigateToHome();
        } else {
          this.trackNavigation(nav.path);
          window.location.href = nav.path;
        }
      });

      switcher.appendChild(btn);
    });

    document.body.appendChild(switcher);
  }

  /**
   * Navigate to home page
   */
  navigateToHome() {
    this.trackNavigation('home');
    window.location.href = '/';
  }

  /**
   * Track navigation between experiences
   * @param {string} destination - Destination experience or path
   */
  trackNavigation(destination) {
    console.log(`[Navigator] Navigating from ${this.currentExperience} to ${destination}`);

    if (window.analytics) {
      try {
        window.analytics.recordGrab({
          timestamp: Date.now(),
          position: { x: 0, y: 0, z: 0 },
          hand: 'navigation',
          panelId: `nav-${this.currentExperience}-to-${destination}`,
          navigation: true
        });
      } catch (e) {
        console.log('[Navigator] Analytics not ready');
      }
    }

    // Update session data
    this.sessionData.lastNavigation = {
      from: this.currentExperience,
      to: destination,
      timestamp: Date.now()
    };
    this.saveSessionData();
  }

  /**
   * Sync analytics between experiences
   */
  syncAnalytics() {
    if (!window.analytics) return;

    // Periodically sync analytics to server
    setInterval(async () => {
      try {
        const sessionData = this.sessionData;
        const analyticsData = window.analytics ? window.analytics.getMetrics?.() : null;

        await fetch('/api/analytics/interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: this.getOrCreateSessionId(),
            timestamp: Date.now(),
            experience: this.currentExperience,
            sessionData,
            analyticsData
          })
        });

        console.log('[Navigator] Analytics synced');
      } catch (err) {
        console.warn('[Navigator] Sync failed:', err.message);
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Get or create session ID
   * @returns {string} Session ID
   */
  getOrCreateSessionId() {
    if (!this.sessionData.sessionId) {
      this.sessionData.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.saveSessionData();
    }
    return this.sessionData.sessionId;
  }

  /**
   * Load session data from storage
   * @returns {Object} Session data
   */
  loadSessionData() {
    try {
      const stored = sessionStorage.getItem('dreamhome-session');
      return stored ? JSON.parse(stored) : {};
    } catch (err) {
      return {};
    }
  }

  /**
   * Save session data to storage
   */
  saveSessionData() {
    try {
      sessionStorage.setItem('dreamhome-session', JSON.stringify(this.sessionData));
    } catch (err) {
      console.warn('[Navigator] Could not save session data:', err.message);
    }
  }

  /**
   * Get experience statistics
   * @returns {Object} Stats
   */
  getStats() {
    return {
      currentExperience: this.currentExperience,
      sessionId: this.getOrCreateSessionId(),
      experiencesVisited: this.sessionData.experiences || [],
      lastNavigation: this.sessionData.lastNavigation,
      sessionDuration: Date.now() - (this.sessionData.startTime || Date.now())
    };
  }

  /**
   * Export session for analytics
   * @returns {Object} Complete session data
   */
  exportSession() {
    return {
      ...this.sessionData,
      navigator: this.getStats(),
      analytics: window.analytics ? window.analytics.getMetrics?.() : null,
      performance: window.profiler ? window.profiler.getSummary?.() : null,
      timestamp: Date.now()
    };
  }
}

// Initialize navigator when all scripts are loaded
function initializeNavigator() {
  // Wait a moment for A-Frame and other scripts to initialize
  setTimeout(() => {
    const nav = new ExperienceNavigator();
    window.experienceNavigator = nav;
    console.log('[Navigator] ✓ Experience Navigator initialized');
  }, 500);
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeNavigator);
} else {
  initializeNavigator();
}

// Also make it globally accessible
window.ExperienceNavigator = ExperienceNavigator;
