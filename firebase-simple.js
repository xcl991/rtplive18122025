// ============================================
// 🔥 SIMPLE FIREBASE PUSH NOTIFICATIONS
// ============================================
// This is the WORKING code from firebase-final-test.html
// Simplified, no complex manager, just direct implementation

(function() {
    'use strict';

    // Configuration from firebase-config.js
    const FIREBASE_CONFIG = window.FIREBASE_CONFIG || {
        apiKey: "AIzaSyDRPSexI-mYvcGP2LcNPQs-xowvmhqRJR4",
        authDomain: "xcl991.firebaseapp.com",
        projectId: "xcl991",
        storageBucket: "xcl991.firebasestorage.app",
        messagingSenderId: "456793576740",
        appId: "1:456793576740:web:0a25d02833abff31204fb1",
        measurementId: "G-R1Z1HD2DWE",
        vapidKey: "BK1mZZ0YtK7EHHE-SLMTk8vVeSbMRC_5KcOdTv9p3l6GRt1GtJWMGvn7HIHFDdxaCay_jaRc1KC_VnsxWiMpzeE"
    };

    let messaging = null;
    let currentToken = null;

    // Log helper
    function log(message, type = 'info') {
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warn' ? '⚠️' : 'ℹ️';
        console.log(`${prefix} [Firebase] ${message}`);
    }

    // Initialize Firebase
    async function initializeFirebase() {
        try {
            log('Initializing Firebase...');

            // Check if Firebase SDK is loaded
            if (typeof firebase === 'undefined') {
                log('Firebase SDK not loaded! Loading now...', 'warn');
                await loadFirebaseSDK();
            }

            // Initialize Firebase App
            if (firebase.apps.length === 0) {
                firebase.initializeApp({
                    apiKey: FIREBASE_CONFIG.apiKey,
                    authDomain: FIREBASE_CONFIG.authDomain,
                    projectId: FIREBASE_CONFIG.projectId,
                    storageBucket: FIREBASE_CONFIG.storageBucket,
                    messagingSenderId: FIREBASE_CONFIG.messagingSenderId,
                    appId: FIREBASE_CONFIG.appId,
                    measurementId: FIREBASE_CONFIG.measurementId
                });
                log('Firebase app initialized', 'success');
            } else {
                log('Firebase app already initialized', 'success');
            }

            return true;
        } catch (error) {
            log('Failed to initialize Firebase: ' + error.message, 'error');
            return false;
        }
    }

    // Load Firebase App SDK dynamically (if not already loaded from HTML)
    function loadFirebaseSDK() {
        return new Promise((resolve, reject) => {
            if (typeof firebase !== 'undefined') {
                log('Firebase App SDK already loaded from HTML', 'success');
                resolve();
                return;
            }

            log('Loading Firebase App SDK dynamically...');
            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js';
            script.onload = () => {
                log('Firebase App SDK loaded successfully', 'success');
                resolve();
            };
            script.onerror = () => reject(new Error('Failed to load Firebase App SDK'));
            document.head.appendChild(script);
        });
    }

    // Request notification permission
    async function requestPermission() {
        try {
            log('Requesting notification permission...');
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                log('Permission granted!', 'success');
                await getToken();
                return true;
            } else if (permission === 'denied') {
                log('Permission denied', 'error');
                return false;
            } else {
                log('Permission dismissed', 'warn');
                return false;
            }
        } catch (error) {
            log('Error requesting permission: ' + error.message, 'error');
            return false;
        }
    }

    // Load Firebase Messaging SDK dynamically (AFTER SW is ready)
    async function loadMessagingSDK() {
        return new Promise((resolve, reject) => {
            if (firebase.messaging) {
                log('Firebase Messaging SDK already loaded');
                resolve();
                return;
            }

            log('Loading Firebase Messaging SDK dynamically...');
            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js';
            script.onload = () => {
                log('Firebase Messaging SDK loaded successfully', 'success');
                resolve();
            };
            script.onerror = () => reject(new Error('Failed to load Firebase Messaging SDK'));
            document.head.appendChild(script);
        });
    }

    // Get FCM Token
    async function getToken() {
        try {
            log('Registering Service Worker...');

            // Register Service Worker
            const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            log('Service Worker registered');

            // Wait for Service Worker to be ready
            log('Waiting for Service Worker to activate...');
            await navigator.serviceWorker.ready;

            // Wait for Service Worker to be ACTIVE
            let retries = 0;
            while (!registration.active && retries < 10) {
                log(`Waiting for activation... (${retries + 1}/10)`);
                await new Promise(resolve => setTimeout(resolve, 500));
                retries++;
            }

            if (!registration.active) {
                throw new Error('Service Worker failed to activate');
            }

            log('Service Worker is ACTIVE', 'success');

            // Validate pushManager
            if (!registration.pushManager) {
                throw new Error('PushManager not available');
            }

            log('PushManager available', 'success');

            // NOW load Firebase Messaging SDK (AFTER SW is ready)
            log('Loading Firebase Messaging SDK (AFTER SW ready)...');
            await loadMessagingSDK();

            // Add extra delay to ensure Messaging SDK is fully initialized
            log('Waiting 500ms for Messaging SDK initialization...');
            await new Promise(resolve => setTimeout(resolve, 500));

            // Create messaging instance AFTER SW is ready AND Messaging SDK loaded
            log('Creating Firebase Messaging instance...');
            try {
                messaging = firebase.messaging();
                log('Messaging instance created', 'success');
            } catch (error) {
                log('Failed to create messaging instance: ' + error.message, 'error');
                throw error;
            }

            // Get token with fallback
            log('Requesting FCM token...');
            let token;

            try {
                // Method 1: Auto SW
                token = await messaging.getToken({
                    vapidKey: FIREBASE_CONFIG.vapidKey
                });
                log('Token generated (auto SW method)', 'success');
            } catch (error1) {
                log('Auto SW failed, trying explicit SW...', 'warn');
                // Method 2: Explicit SW
                token = await messaging.getToken({
                    vapidKey: FIREBASE_CONFIG.vapidKey,
                    serviceWorkerRegistration: registration
                });
                log('Token generated (explicit SW method)', 'success');
            }

            if (token) {
                currentToken = token;

                // Log full token (important for testing)
                log('FCM Token generated successfully!', 'success');
                console.log('%c=== FULL FCM TOKEN ===', 'color: #00ff00; font-size: 16px; font-weight: bold; background: #000; padding: 5px;');
                console.log('%c' + token, 'color: #00ff00; background: #000; padding: 10px; font-family: monospace; font-size: 12px;');
                console.log('%cToken length: ' + token.length + ' characters', 'color: #00aaff;');

                // Copy to clipboard
                try {
                    await navigator.clipboard.writeText(token);
                    log('Token copied to clipboard!', 'success');
                    console.log('%c✅ Token automatically copied to clipboard!', 'color: #00ff00; font-weight: bold; font-size: 14px;');
                } catch (clipError) {
                    log('Could not copy to clipboard: ' + clipError.message, 'warn');
                }

                // Save to localStorage
                localStorage.setItem('fcm_token', token);
                localStorage.setItem('fcm_token_time', Date.now());

                // Show success message with token info
                try {
                    const msg = `✅ Push Notification Berhasil Diaktifkan!

📱 FCM Token: ${token.substring(0, 30)}...

✅ Token disimpan dan di-copy ke clipboard
✅ Device terdaftar untuk menerima notifikasi
✅ Siap menerima push notification dari admin

Token length: ${token.length} characters`;

                    // Don't use alert as it might be annoying
                    console.log('%c' + msg, 'color: #00ff00; font-size: 13px;');
                } catch (e) {
                    // Ignore alert error
                }

                // Track in Firebase Analytics (if available)
                try {
                    if (firebase.analytics) {
                        const analytics = firebase.analytics();
                        analytics.logEvent('fcm_token_generated', {
                            token_length: token.length,
                            timestamp: Date.now(),
                            permission: Notification.permission
                        });
                        log('Analytics event logged: fcm_token_generated', 'success');
                    }
                } catch (analyticsError) {
                    // Analytics not critical, ignore error
                    log('Analytics not available (OK to ignore)', 'warn');
                }

                // Setup foreground message handler
                setupMessageHandler();

                return token;
            } else {
                log('No token received', 'error');
                return null;
            }
        } catch (error) {
            log('Error getting token: ' + error.message, 'error');
            log('Error code: ' + (error.code || 'N/A'), 'error');
            return null;
        }
    }

    // Setup message handler for foreground notifications
    function setupMessageHandler() {
        if (!messaging) return;

        messaging.onMessage((payload) => {
            log('Foreground message received');
            console.log('Payload:', payload);

            const title = payload.notification?.title || 'SULTANPLAY77';
            const options = {
                body: payload.notification?.body || 'Notifikasi baru',
                icon: payload.notification?.icon || 'https://cdn.databerjalan.com/assets/images/companies/sultanplay77/sultanplay77-favicon.png',
                badge: 'https://cdn.databerjalan.com/assets/images/companies/sultanplay77/sultanplay77-favicon.png',
                data: payload.data || {}
            };

            // Show notification
            if (Notification.permission === 'granted') {
                new Notification(title, options);
            }
        });

        log('Message handler setup complete', 'success');
    }

    // Show floating notification button
    function showFloatingButton() {
        // Check if permission already granted
        if (Notification.permission === 'granted') {
            log('Permission already granted, skipping floating button');
            return;
        }

        // Check if button already exists
        if (document.getElementById('firebase-notification-prompt')) {
            return;
        }

        log('Showing floating notification button (manual activation)');

        const permission = Notification.permission;
        const buttonText = permission === 'granted' ? 'Aktifkan Push Notif' :
                          permission === 'denied' ? 'Reset Notifikasi' :
                          'Aktifkan Notifikasi';

        const button = document.createElement('div');
        button.id = 'firebase-notification-prompt';
        button.innerHTML = `
            <div class="firebase-notif-container">
                <div class="firebase-notif-btn">
                    <span class="firebase-notif-icon">🔔</span>
                    <span class="firebase-notif-text">${buttonText}</span>
                    <button class="firebase-notif-close" aria-label="Close">&times;</button>
                </div>
            </div>
            <style>
                @keyframes slideInNotif {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .firebase-notif-container {
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    z-index: 9999;
                    animation: slideInNotif 0.5s ease forwards;
                }

                .firebase-notif-btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 14px 20px;
                    border-radius: 50px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    font-weight: bold;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                .firebase-notif-icon {
                    font-size: 22px;
                    flex-shrink: 0;
                }

                .firebase-notif-text {
                    flex: 1;
                }

                .firebase-notif-close {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 20px;
                    line-height: 1;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }

                .firebase-notif-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }

                .firebase-notif-btn:hover {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
                }

                .firebase-notif-btn:active {
                    transform: translateY(-1px) scale(0.98);
                }

                /* Mobile Responsive - LESS BLOCKING */
                @media (max-width: 768px) {
                    .firebase-notif-container {
                        bottom: 70px;
                        right: 10px;
                        left: 10px;
                        max-width: calc(100vw - 20px);
                    }

                    .firebase-notif-btn {
                        padding: 12px 16px;
                        font-size: 13px;
                        border-radius: 40px;
                        gap: 8px;
                    }

                    .firebase-notif-icon {
                        font-size: 20px;
                    }

                    .firebase-notif-text {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .firebase-notif-close {
                        width: 22px;
                        height: 22px;
                        font-size: 18px;
                    }
                }

                /* Extra small mobile - COMPACT */
                @media (max-width: 480px) {
                    .firebase-notif-container {
                        bottom: 60px;
                        right: 8px;
                        left: auto;
                        max-width: 200px;
                    }

                    .firebase-notif-btn {
                        padding: 10px 12px;
                        font-size: 12px;
                        gap: 6px;
                    }

                    .firebase-notif-icon {
                        font-size: 18px;
                    }

                    .firebase-notif-text {
                        max-width: 120px;
                    }

                    .firebase-notif-close {
                        width: 20px;
                        height: 20px;
                        font-size: 16px;
                    }
                }
            </style>
        `;

        // Main button click handler
        const mainBtn = button.querySelector('.firebase-notif-btn');
        mainBtn.addEventListener('click', async (e) => {
            // Check if close button was clicked
            if (e.target.classList.contains('firebase-notif-close')) {
                return; // Let close button handler handle it
            }

            log('Floating button clicked');
            button.style.display = 'none';

            const currentPermission = Notification.permission;

            if (currentPermission === 'granted') {
                // Permission already granted, go straight to token generation
                log('Permission already granted, generating token...');
                await getToken();
            } else if (currentPermission === 'denied') {
                // Permission denied, show instructions
                log('Permission denied - showing reset instructions', 'warn');
                alert('❌ Notifikasi Diblokir!\n\nCara reset:\n1. Klik ikon gembok 🔒 di URL bar\n2. Klik "Site settings"\n3. Ubah Notifications dari "Block" ke "Allow"\n4. Refresh halaman (Ctrl+R)');
            } else {
                // Permission not requested yet, request it
                await requestPermission();
            }
        });

        // Close button click handler
        const closeBtn = button.querySelector('.firebase-notif-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering main button
            log('Close button clicked - dismissing notification prompt');
            button.style.opacity = '0';
            button.style.transform = 'translateX(400px)';
            setTimeout(() => {
                button.remove();
            }, 300); // Wait for animation
        });

        document.body.appendChild(button);
    }

    // Auto-initialize (NO auto-token generation - ONLY show button)
    async function autoInitialize() {
        try {
            log('=== Firebase Simple Auto-Initialize ===');

            // Initialize Firebase App ONLY (NOT messaging instance yet!)
            const initialized = await initializeFirebase();
            if (!initialized) {
                log('Firebase initialization failed', 'error');
                return;
            }

            // Check permission status
            const permission = Notification.permission;
            log('Current permission: ' + permission);

            // ALWAYS show floating button regardless of permission
            // This prevents ANY auto-initialization that causes pushManager error
            if (permission === 'granted') {
                log('Permission already granted - click button to activate notifications');
            } else if (permission === 'default') {
                log('Permission not requested yet - click button to request');
            } else {
                log('Permission denied - reset in browser settings and click button');
            }

            // Show floating button after delay (manual activation only)
            setTimeout(() => {
                showFloatingButton();
            }, 3000);

            log('=== Initialization Complete (Manual activation mode) ===', 'success');
        } catch (error) {
            log('Auto-initialize error: ' + error.message, 'error');
        }
    }

    // Expose to window for manual control
    window.FirebaseSimple = {
        requestPermission,
        getToken,
        getCurrentToken: () => currentToken,
        initialize: autoInitialize
    };

    // Auto-initialize after page load with delay
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(autoInitialize, 1500);
        });
    } else {
        setTimeout(autoInitialize, 1500);
    }

    log('Firebase Simple loaded');
})();
