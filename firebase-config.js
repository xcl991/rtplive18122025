// ============================================
// 🔥 FIREBASE CONFIGURATION - UPDATE HERE!
// ============================================
// File ini untuk konfigurasi Firebase Push Notifications
//
// CARA SETUP:
// 1. Buka Firebase Console: https://console.firebase.google.com/
// 2. Create project baru atau pilih existing project
// 3. Go to Project Settings > General
// 4. Scroll ke "Your apps" > pilih Web app (</>) atau create new
// 5. Copy semua config values ke bawah ini
// 6. Go to Project Settings > Cloud Messaging
// 7. Copy "Server key" untuk backend API (optional)
// 8. Enable Cloud Messaging API di Google Cloud Console
//
// PENTING: Setelah update config, hard refresh browser (Ctrl+F5)

const FIREBASE_CONFIG = {
    // ============================================
    // 🔑 FIREBASE PROJECT CREDENTIALS
    // ============================================
    // REQUIRED: Firebase project configuration
    // Get from: Firebase Console > Project Settings > General > Your apps > SDK setup and configuration

    apiKey: "AIzaSyDRPSexI-mYvcGP2LcNPQs-xowvmhqRJR4",              // ✅ FILLED
    authDomain: "xcl991.firebaseapp.com",                           // ✅ FILLED
    projectId: "xcl991",                                            // ✅ FILLED
    storageBucket: "xcl991.firebasestorage.app",                    // ✅ FILLED
    messagingSenderId: "456793576740",                              // ✅ FILLED
    appId: "1:456793576740:web:0a25d02833abff31204fb1",            // ✅ FILLED
    measurementId: "G-R1Z1HD2DWE",                                  // ✅ FILLED

    // ============================================
    // 📢 VAPID KEY (Web Push Certificate)
    // ============================================
    // REQUIRED for push notifications
    // Get from: Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
    // Click "Generate key pair" if you don't have one

    vapidKey: "BK1mZZ0YtK7EHHE-SLMTk8vVeSbMRC_5KcOdTv9p3l6GRt1GtJWMGvn7HIHFDdxaCay_jaRc1KC_VnsxWiMpzeE",    // ✅ FILLED

    // ============================================
    // ⚙️ NOTIFICATION SETTINGS
    // ============================================

    // Enable/disable push notifications globally
    enabled: true,                          // true = active, false = disabled

    // Auto-request permission on page load
    autoRequestPermission: true,            // true = auto ask, false = manual

    // Notification default settings
    defaultNotification: {
        icon: "https://i.ibb.co/FLSpqT3Q/3-SULTANPLAY.png",         // Notification icon URL
        badge: "https://i.ibb.co/FLSpqT3Q/3-SULTANPLAY.png",        // Notification badge URL
        vibrate: [200, 100, 200],                                    // Vibration pattern
        requireInteraction: false,                                   // Keep notification until user interacts
        sound: "default",                                            // Notification sound
    },

    // ============================================
    // 🎯 NOTIFICATION TEMPLATES
    // ============================================
    // Pre-defined notification templates for quick sending

    templates: {
        // Welcome notification
        welcome: {
            title: "🎉 Selamat Datang di SULTANPLAY77!",
            body: "Terima kasih sudah mengaktifkan notifikasi. Dapatkan info RTP & promo terbaru!",
            icon: "https://i.ibb.co/FLSpqT3Q/3-SULTANPLAY.png",
            link: "/",
            tag: "welcome"
        },

        // RTP Update notification
        rtpUpdate: {
            title: "🔥 RTP GACOR Update!",
            body: "Ada game dengan RTP 90%+! Cek sekarang juga!",
            icon: "https://i.ibb.co/FLSpqT3Q/3-SULTANPLAY.png",
            link: "/",
            tag: "rtp-update"
        },

        // Promo notification
        promo: {
            title: "💰 PROMO SPESIAL HARI INI!",
            body: "Bonus New Member 200%! Deposit 10rb dapat 20rb!",
            icon: "https://i.ibb.co/FLSpqT3Q/3-SULTANPLAY.png",
            link: "/",
            tag: "promo"
        },

        // Jackpot notification
        jackpot: {
            title: "🎰 JACKPOT ALERT!",
            body: "Seseorang baru saja menang jackpot 50 JUTA! Giliran Anda selanjutnya!",
            icon: "https://i.ibb.co/FLSpqT3Q/3-SULTANPLAY.png",
            link: "/",
            tag: "jackpot"
        },

        // Prediksi Togel notification
        prediksiTogel: {
            title: "🎲 Prediksi Togel Update!",
            body: "Prediksi togel terbaru sudah tersedia! Cek sekarang!",
            icon: "https://i.ibb.co/FLSpqT3Q/3-SULTANPLAY.png",
            link: "/prediksi_togel/",
            tag: "prediksi-togel"
        },

        // Maintenance notification
        maintenance: {
            title: "⚠️ Maintenance Notice",
            body: "Website akan maintenance 10 menit. Mohon tunggu sebentar.",
            icon: "https://i.ibb.co/FLSpqT3Q/3-SULTANPLAY.png",
            link: "/",
            tag: "maintenance"
        }
    },

    // ============================================
    // 🔔 NOTIFICATION BEHAVIOR
    // ============================================

    behavior: {
        // Show console logs for debugging
        debug: true,

        // Maximum notifications to show per session
        maxNotificationsPerSession: 10,

        // Delay between auto-notifications (milliseconds)
        autoNotificationDelay: 300000,      // 5 minutes

        // Topics to subscribe (for topic-based messaging)
        subscribeToTopics: [
            "all-users",
            "rtp-updates",
            "promo-alerts",
            "jackpot-alerts"
        ],

        // Action buttons in notification (optional)
        enableActionButtons: true,
        actionButtons: [
            {
                action: "open",
                title: "Buka Website",
                icon: "https://i.ibb.co/FLSpqT3Q/3-SULTANPLAY.png"
            },
            {
                action: "close",
                title: "Tutup",
                icon: "https://i.ibb.co/FLSpqT3Q/3-SULTANPLAY.png"
            }
        ]
    },

    // ============================================
    // 📊 ANALYTICS & TRACKING
    // ============================================

    analytics: {
        // Track notification impressions
        trackImpressions: true,

        // Track notification clicks
        trackClicks: true,

        // Send analytics to custom endpoint
        analyticsEndpoint: null,            // Set your analytics endpoint URL here
    }
};

// ============================================
// 🔒 VALIDATION
// ============================================
// Auto-validate configuration on load

function validateFirebaseConfig() {
    const requiredFields = [
        'apiKey', 'authDomain', 'projectId', 'storageBucket',
        'messagingSenderId', 'appId', 'vapidKey'
    ];

    const missingFields = requiredFields.filter(field => {
        const value = FIREBASE_CONFIG[field];
        return !value ||
               value.includes('XXXX') ||
               value.includes('your-project') ||
               value.includes('123456');
    });

    if (missingFields.length > 0) {
        console.warn('⚠️ Firebase Config Incomplete!');
        console.warn('Missing or invalid fields:', missingFields);
        console.warn('Please update firebase-config.js with your Firebase credentials');
        console.warn('Visit: https://console.firebase.google.com/');
        return false;
    }

    console.log('✅ Firebase configuration valid');
    return true;
}

// ============================================
// 📊 EXPORT & INITIALIZATION
// ============================================

// Validate on load
const isConfigValid = validateFirebaseConfig();

// Log configuration status
console.log('🔥 Firebase Configuration Loaded');
console.log(`   ✅ Enabled: ${FIREBASE_CONFIG.enabled ? 'YES' : 'NO'}`);
console.log(`   🔑 Config Valid: ${isConfigValid ? 'YES' : 'NO'}`);
console.log(`   📢 Auto Request: ${FIREBASE_CONFIG.autoRequestPermission ? 'YES' : 'NO'}`);
console.log(`   🐛 Debug Mode: ${FIREBASE_CONFIG.behavior.debug ? 'ON' : 'OFF'}`);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FIREBASE_CONFIG, isConfigValid };
}
