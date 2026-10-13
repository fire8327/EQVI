/**
 * EQVI Cookie Consent Banner & Settings Modal
 * Modern ES6+ implementation adhering to the EQVI dark-theme design system.
 */
(() => {
  'use strict';

  const CONSENT_KEY = 'eqvi_cookie_consent';

  const getConsent = () => {
    try {
      const val = localStorage.getItem(CONSENT_KEY);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  };

  const saveConsent = (consent) => {
    try {
      consent.timestamp = new Date().toISOString();
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
      window.dispatchEvent(new CustomEvent('eqviCookieConsentChange', { detail: consent }));
    } catch {
      // ignore storage access errors
    }
  };

  const injectStyles = () => {
    if (document.getElementById('eqvi-cookie-styles')) return;
    const style = document.createElement('style');
    style.id = 'eqvi-cookie-styles';
    style.textContent = `
      .eqvi-cookie-banner {
        position: fixed;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 32px);
        max-width: 640px;
        background: rgba(18, 22, 26, 0.96);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(32, 169, 255, 0.12);
        border-radius: 18px;
        padding: 20px 24px;
        z-index: 9998;
        font-family: inherit;
        color: #FFFFFF;
        box-sizing: border-box;
        transition: opacity 0.25s ease, transform 0.25s ease;
      }
      .eqvi-cookie-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(5, 5, 5, 0.75);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        box-sizing: border-box;
      }
      .eqvi-cookie-modal {
        background: #161B22;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 20px;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
        width: 100%;
        max-width: 580px;
        max-height: 90vh;
        overflow-y: auto;
        color: #FFFFFF;
        box-sizing: border-box;
        padding: 28px;
      }
      .eqvi-toggle-switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
        flex-shrink: 0;
      }
      .eqvi-toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .eqvi-toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #374151;
        transition: 0.25s;
        border-radius: 24px;
      }
      .eqvi-toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.25s;
        border-radius: 50%;
      }
      .eqvi-toggle-switch input:checked + .eqvi-toggle-slider {
        background-color: #20A9FF;
      }
      .eqvi-toggle-switch input:checked + .eqvi-toggle-slider:before {
        transform: translateX(20px);
      }
      .eqvi-toggle-switch input:disabled + .eqvi-toggle-slider {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  };

  const createBanner = () => {
    if (document.getElementById('eqvi-cookie-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'eqvi-cookie-banner';
    banner.className = 'eqvi-cookie-banner';
    banner.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:14px;">
        <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#20A9FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
              <path d="M8.5 8.5v.01"></path>
              <path d="M7.5 15.5v.01"></path>
              <path d="M15.5 15.5v.01"></path>
            </svg>
            <span style="font-size:15px; font-weight:700; letter-spacing:0.3px;">Cookie Preferences</span>
          </div>
          <button id="eqvi-cookie-close-banner" type="button" aria-label="Close" style="background:transparent; border:none; color:#8B949E; cursor:pointer; padding:2px; display:flex; align-items:center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <p style="margin:0; font-size:13px; line-height:150%; color:#CBD5E1;">
          We use cookies and similar technologies to ensure site functionality, analyze performance, and provide personalization. You can accept all cookies, reject optional ones, or adjust your settings. Learn more in our <a href="cookie-policy.html" style="color:#20A9FF; text-decoration:underline;">Cookie Policy</a>.
        </p>
        <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; margin-top:4px;">
          <button id="eqvi-cookie-open-settings" type="button" style="background:none; border:none; color:#94A3B8; text-decoration:underline; font-size:13px; cursor:pointer; padding:4px 0;">Cookie Settings</button>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button id="eqvi-cookie-reject-opt" type="button" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.16); color:#F1F5F9; font-weight:600; font-size:13px; border-radius:100px; padding:8px 16px; cursor:pointer;">Reject Optional</button>
            <button id="eqvi-cookie-accept-all" type="button" style="background:#20A9FF; border:none; color:#FFFFFF; font-weight:600; font-size:13px; border-radius:100px; padding:8px 18px; cursor:pointer;">Accept All</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('eqvi-cookie-accept-all').addEventListener('click', () => {
      saveConsent({ necessary: true, analytics: true, marketing: true });
      banner.remove();
    });

    document.getElementById('eqvi-cookie-reject-opt').addEventListener('click', () => {
      saveConsent({ necessary: true, analytics: false, marketing: false });
      banner.remove();
    });

    document.getElementById('eqvi-cookie-close-banner').addEventListener('click', () => {
      banner.remove();
    });

    document.getElementById('eqvi-cookie-open-settings').addEventListener('click', () => {
      openModal();
    });
  };

  const openModal = () => {
    const existingModal = document.getElementById('eqvi-cookie-modal-overlay');
    if (existingModal) existingModal.remove();

    const current = getConsent() || { necessary: true, analytics: false, marketing: false };

    const overlay = document.createElement('div');
    overlay.id = 'eqvi-cookie-modal-overlay';
    overlay.className = 'eqvi-cookie-modal-overlay';
    overlay.innerHTML = `
      <div class="eqvi-cookie-modal">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
          <h2 style="margin:0; font-size:20px; font-weight:700;">Cookie Settings</h2>
          <button id="eqvi-modal-close-btn" type="button" aria-label="Close" style="background:transparent; border:none; color:#8B949E; cursor:pointer; padding:4px; display:flex;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <p style="margin:0 0 20px 0; font-size:13px; line-height:150%; color:#94A3B8;">
          Manage your cookie preferences below. Essential cookies are required for the website to operate and cannot be switched off. Detailed information is available in our <a href="cookie-policy.html" style="color:#20A9FF; text-decoration:underline;">Cookie Policy</a>.
        </p>

        <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:24px;">
          <!-- Necessary -->
          <div style="background:#0D1117; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:16px;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
              <div>
                <p style="margin:0; font-size:15px; font-weight:600; color:#FFFFFF;">Strictly Necessary Cookies</p>
                <p style="margin:4px 0 0 0; font-size:12px; color:#94A3B8; line-height:140%;">Essential for core functionality, security, and session management.</p>
              </div>
              <span style="font-size:12px; font-weight:600; color:#20A9FF; background:rgba(32,169,255,0.12); padding:4px 10px; border-radius:100px; white-space:nowrap;">Always Active</span>
            </div>
          </div>

          <!-- Analytics -->
          <div style="background:#0D1117; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:16px;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
              <div>
                <p style="margin:0; font-size:15px; font-weight:600; color:#FFFFFF;">Analytics & Performance Cookies</p>
                <p style="margin:4px 0 0 0; font-size:12px; color:#94A3B8; line-height:140%;">Allow us to measure traffic, popular pages, and performance to improve user experience.</p>
              </div>
              <label class="eqvi-toggle-switch">
                <input type="checkbox" id="eqvi-toggle-analytics" ${current.analytics ? 'checked' : ''}>
                <span class="eqvi-toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- Marketing -->
          <div style="background:#0D1117; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:16px;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
              <div>
                <p style="margin:0; font-size:15px; font-weight:600; color:#FFFFFF;">Marketing & Personalisation Cookies</p>
                <p style="margin:4px 0 0 0; font-size:12px; color:#94A3B8; line-height:140%;">Used to tailor content and evaluate the reach of our partnerships and initiatives.</p>
              </div>
              <label class="eqvi-toggle-switch">
                <input type="checkbox" id="eqvi-toggle-marketing" ${current.marketing ? 'checked' : ''}>
                <span class="eqvi-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; border-top:1px solid rgba(255,255,255,0.08); padding-top:20px;">
          <button id="eqvi-modal-reject-opt" type="button" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.16); color:#F1F5F9; font-weight:600; font-size:13px; border-radius:100px; padding:9px 18px; cursor:pointer;">Reject Optional</button>
          <div style="display:flex; gap:8px;">
            <button id="eqvi-modal-save" type="button" style="background:transparent; border:1px solid #20A9FF; color:#20A9FF; font-weight:600; font-size:13px; border-radius:100px; padding:9px 18px; cursor:pointer;">Save Preferences</button>
            <button id="eqvi-modal-accept-all" type="button" style="background:#20A9FF; border:none; color:#FFFFFF; font-weight:600; font-size:13px; border-radius:100px; padding:9px 20px; cursor:pointer;">Accept All</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const closeModal = () => {
      overlay.remove();
    };

    document.getElementById('eqvi-modal-close-btn').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    document.getElementById('eqvi-modal-accept-all').addEventListener('click', () => {
      saveConsent({ necessary: true, analytics: true, marketing: true });
      const banner = document.getElementById('eqvi-cookie-banner');
      if (banner) banner.remove();
      closeModal();
    });

    document.getElementById('eqvi-modal-reject-opt').addEventListener('click', () => {
      saveConsent({ necessary: true, analytics: false, marketing: false });
      const banner = document.getElementById('eqvi-cookie-banner');
      if (banner) banner.remove();
      closeModal();
    });

    document.getElementById('eqvi-modal-save').addEventListener('click', () => {
      const aChecked = document.getElementById('eqvi-toggle-analytics').checked;
      const mChecked = document.getElementById('eqvi-toggle-marketing').checked;
      saveConsent({ necessary: true, analytics: aChecked, marketing: mChecked });
      const banner = document.getElementById('eqvi-cookie-banner');
      if (banner) banner.remove();
      closeModal();
    });
  };

  // Attach global click listener for any button/link that opens cookie settings
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-cookie-settings], .cookie-settings-trigger, #cookieSettingsBtn');
    if (trigger) {
      e.preventDefault();
      openModal();
    }
  });

  // Expose API on window
  window.EQVICookieConsent = {
    openSettings: openModal,
    getConsent: getConsent
  };

  // Initialize on DOM ready
  const init = () => {
    injectStyles();
    const consent = getConsent();
    if (!consent) {
      createBanner();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
