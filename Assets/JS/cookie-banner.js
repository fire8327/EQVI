/**
 * EQVI Cookie Consent Banner & Settings Modal
 * Clean, modern white card design matching the requested specification.
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
      // Also set a standard 1-year cookie for server-side / compliance detection
      const d = new Date();
      d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
      document.cookie = `${CONSENT_KEY}=${encodeURIComponent(JSON.stringify(consent))}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
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
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 32px);
        max-width: 440px;
        background: #FFFFFF;
        border-radius: 24px;
        box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.22), 0 10px 25px -5px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(0, 0, 0, 0.06);
        padding: 24px;
        z-index: 9998;
        font-family: inherit;
        color: #111827;
        box-sizing: border-box;
        animation: eqviBannerSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        transition: opacity 0.25s ease, transform 0.25s ease;
      }
      @keyframes eqviBannerSlideUp {
        from {
          opacity: 0;
          transform: translate(-50%, 20px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translate(-50%, 0) scale(1);
        }
      }
      .eqvi-cookie-btn-settings {
        background: #FFFFFF;
        border: 1px solid #D1D5DB;
        color: #111827;
        font-size: 15px;
        font-weight: 600;
        border-radius: 16px;
        height: 48px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        text-decoration: none;
        outline: none;
      }
      .eqvi-cookie-btn-settings:hover {
        background: #F9FAFB;
        border-color: #9CA3AF;
      }
      .eqvi-cookie-btn-accept {
        background: #0075FF;
        border: none;
        color: #FFFFFF;
        font-size: 15px;
        font-weight: 600;
        border-radius: 16px;
        height: 48px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        outline: none;
      }
      .eqvi-cookie-btn-accept:hover {
        background: #0066E0;
      }
      .eqvi-cookie-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.55);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        box-sizing: border-box;
        animation: eqviModalFadeIn 0.2s ease;
      }
      @keyframes eqviModalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .eqvi-cookie-modal {
        background: #FFFFFF;
        border-radius: 24px;
        box-shadow: 0 30px 70px rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(0, 0, 0, 0.08);
        width: 100%;
        max-width: 540px;
        max-height: 90vh;
        overflow-y: auto;
        color: #111827;
        box-sizing: border-box;
        padding: 28px;
        font-family: inherit;
        animation: eqviModalScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes eqviModalScaleUp {
        from {
          opacity: 0;
          transform: scale(0.96);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .eqvi-toggle-switch {
        position: relative;
        display: inline-block;
        width: 46px;
        height: 26px;
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
        background-color: #E2E8F0;
        transition: 0.25s ease;
        border-radius: 24px;
      }
      .eqvi-toggle-slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.25s ease;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      }
      .eqvi-toggle-switch input:checked + .eqvi-toggle-slider {
        background-color: #0075FF;
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
      <div style="display:flex; flex-direction:column;">
        <!-- Header row -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0075FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
              <path stroke-width="3" d="M8.5 8.5h.01"></path>
              <path stroke-width="3" d="M7.5 15.5h.01"></path>
              <path stroke-width="3" d="M15.5 15.5h.01"></path>
            </svg>
            <h3 style="margin:0; font-size:20px; font-weight:700; color:#111827; letter-spacing:-0.2px;">Cookie Preferences</h3>
          </div>
          <button id="eqvi-cookie-close-banner" type="button" aria-label="Close" style="background:transparent; border:none; color:#4B5563; cursor:pointer; padding:4px; display:flex; align-items:center; justify-content:center; border-radius:8px; transition:color 0.2s;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Text body -->
        <p style="margin:0 0 20px 0; font-size:14px; line-height:1.55; color:#4B5563;">
          We use cookies to ensure the site works properly, understand how it is used, and improve your experience. 
          <a href="cookie-policy.html" style="color:#0075FF; text-decoration:underline;">Learn more in our Cookie Policy.</a>
        </p>

        <!-- Buttons row -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <button id="eqvi-cookie-open-settings" type="button" class="eqvi-cookie-btn-settings">Cookie Settings</button>
          <button id="eqvi-cookie-accept-all" type="button" class="eqvi-cookie-btn-accept">Accept All</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('eqvi-cookie-accept-all').addEventListener('click', () => {
      saveConsent({ necessary: true, analytics: true, marketing: true });
      banner.remove();
    });

    document.getElementById('eqvi-cookie-close-banner').addEventListener('click', () => {
      // Dismiss the banner for this session
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
          <div style="display:flex; align-items:center; gap:10px;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0075FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
              <path stroke-width="3" d="M8.5 8.5h.01"></path>
              <path stroke-width="3" d="M7.5 15.5h.01"></path>
              <path stroke-width="3" d="M15.5 15.5h.01"></path>
            </svg>
            <h2 style="margin:0; font-size:22px; font-weight:700; color:#111827;">Cookie Settings</h2>
          </div>
          <button id="eqvi-modal-close-btn" type="button" aria-label="Close" style="background:transparent; border:none; color:#6B7280; cursor:pointer; padding:6px; display:flex; align-items:center; justify-content:center; border-radius:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <p style="margin:0 0 20px 0; font-size:14px; line-height:150%; color:#4B5563;">
          Manage your cookie preferences below. Essential cookies are required for the website to operate and cannot be switched off. Detailed information is available in our <a href="cookie-policy.html" style="color:#0075FF; text-decoration:underline;">Cookie Policy</a>.
        </p>

        <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:24px;">
          <!-- Necessary -->
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:16px; padding:16px;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
              <div>
                <p style="margin:0; font-size:15px; font-weight:600; color:#111827;">Strictly Necessary Cookies</p>
                <p style="margin:4px 0 0 0; font-size:13px; color:#64748B; line-height:140%;">Essential for core functionality, security, and session management.</p>
              </div>
              <span style="font-size:12px; font-weight:600; color:#0075FF; background:#EFF6FF; border:1px solid #BFDBFE; padding:4px 10px; border-radius:100px; white-space:nowrap;">Always Active</span>
            </div>
          </div>

          <!-- Analytics -->
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:16px; padding:16px;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
              <div>
                <p style="margin:0; font-size:15px; font-weight:600; color:#111827;">Analytics & Performance Cookies</p>
                <p style="margin:4px 0 0 0; font-size:13px; color:#64748B; line-height:140%;">Allow us to measure traffic, popular pages, and performance to improve user experience.</p>
              </div>
              <label class="eqvi-toggle-switch">
                <input type="checkbox" id="eqvi-toggle-analytics" ${current.analytics ? 'checked' : ''}>
                <span class="eqvi-toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- Marketing -->
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:16px; padding:16px;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
              <div>
                <p style="margin:0; font-size:15px; font-weight:600; color:#111827;">Marketing & Personalisation Cookies</p>
                <p style="margin:4px 0 0 0; font-size:13px; color:#64748B; line-height:140%;">Used to tailor content and evaluate the reach of our partnerships and initiatives.</p>
              </div>
              <label class="eqvi-toggle-switch">
                <input type="checkbox" id="eqvi-toggle-marketing" ${current.marketing ? 'checked' : ''}>
                <span class="eqvi-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; border-top:1px solid #E2E8F0; padding-top:20px;">
          <button id="eqvi-modal-reject-opt" type="button" style="background:#FFFFFF; border:1px solid #D1D5DB; color:#374151; font-weight:600; font-size:14px; border-radius:14px; padding:10px 18px; cursor:pointer; transition:all 0.2s;">Reject Optional</button>
          <div style="display:flex; gap:10px;">
            <button id="eqvi-modal-save" type="button" style="background:#FFFFFF; border:1px solid #0075FF; color:#0075FF; font-weight:600; font-size:14px; border-radius:14px; padding:10px 18px; cursor:pointer; transition:all 0.2s;">Save Preferences</button>
            <button id="eqvi-modal-accept-all" type="button" style="background:#0075FF; border:none; color:#FFFFFF; font-weight:600; font-size:14px; border-radius:14px; padding:10px 22px; cursor:pointer; transition:all 0.2s;">Accept All</button>
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
