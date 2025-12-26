/* ========================================================================
   MODERN UI ENHANCEMENTS - JavaScript
   Version 2.0
   ======================================================================== */

// ============================================
// RIPPLE EFFECT
// ============================================
function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    button.style.setProperty('--ripple-x', `${x}px`);
    button.style.setProperty('--ripple-y', `${y}px`);
    button.classList.remove('ripple-active');
    void button.offsetWidth;
    button.classList.add('ripple-active');

    button.addEventListener('animationend', function handleAnimationEnd() {
        button.classList.remove('ripple-active');
        button.removeEventListener('animationend', handleAnimationEnd);
    });
}

function initRippleEffect() {
    document.querySelectorAll('.btn-ripple').forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

// ============================================
// STAGGERED ANIMATION ON SCROLL
// ============================================
function initStaggeredAnimation() {
    const staggerItems = document.querySelectorAll('.stagger-item');
    if (staggerItems.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    staggerItems.forEach(item => observer.observe(item));
}

// ============================================
// 3D TILT EFFECT
// ============================================
function initTiltEffect() {
    document.querySelectorAll('.card-tilt').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = ((y - centerY) / centerY) * -8;
            const tiltY = ((x - centerX) / centerX) * 8;
            card.style.setProperty('--tilt-x', `${tiltX}deg`);
            card.style.setProperty('--tilt-y', `${tiltY}deg`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--tilt-x', '0deg');
            card.style.setProperty('--tilt-y', '0deg');
        });
    });
}

// ============================================
// ANIMATE NUMBER VALUE
// ============================================
function animateValue(element, start, end, duration, options = {}) {
    if (!element) return;
    const { prefix = '', suffix = '', decimals = 0 } = options;

    function formatNumber(value) {
        return prefix + value.toFixed(decimals) + suffix;
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    let startTimestamp = null;
    const range = end - start;

    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentValue = start + (range * easedProgress);
        element.textContent = formatNumber(currentValue);
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// ============================================
// RTP GAUGE
// ============================================
function getRtpLevel(value) {
    if (value >= 85) return 'high';
    if (value >= 70) return 'medium';
    return 'low';
}

function createRtpGauge(container, value, animate = true) {
    const clampedValue = Math.max(0, Math.min(100, value));
    const level = getRtpLevel(clampedValue);

    const gauge = document.createElement('div');
    gauge.className = `rtp-gauge rtp-${level}`;
    gauge.style.setProperty('--gauge-value', animate ? 0 : clampedValue);

    const inner = document.createElement('div');
    inner.className = 'rtp-gauge-inner';

    const valueEl = document.createElement('span');
    valueEl.className = 'rtp-gauge-value';
    valueEl.textContent = animate ? '0' : `${clampedValue}`;

    inner.appendChild(valueEl);
    gauge.appendChild(inner);
    container.innerHTML = '';
    container.appendChild(gauge);

    if (animate) {
        setTimeout(() => {
            gauge.style.setProperty('--gauge-value', clampedValue);
            animateValue(valueEl, 0, clampedValue, 1000, { decimals: 0 });
        }, 50);
    }

    return gauge;
}

// ============================================
// ANIMATED RTP BAR
// ============================================
function animateRtpBar(element, value) {
    const clampedValue = Math.max(0, Math.min(100, value));
    const level = getRtpLevel(clampedValue);

    let fill = element.querySelector('.rtp-bar-animated-fill');
    if (!fill) {
        fill = document.createElement('div');
        fill.className = 'rtp-bar-animated-fill';
        element.appendChild(fill);
    }

    fill.style.width = '0%';
    fill.style.transition = 'none';
    fill.className = `rtp-bar-animated-fill rtp-${level}`;
    void fill.offsetWidth;

    setTimeout(() => {
        fill.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
        fill.style.width = `${clampedValue}%`;
    }, 50);

    return fill;
}

// ============================================
// SKELETON LOADING
// ============================================
function showSkeleton(container, count = 6) {
    const containerEl = typeof container === 'string' ? document.querySelector(container) : container;
    if (!containerEl) return;

    if (!containerEl.dataset.originalContent) {
        containerEl.dataset.originalContent = containerEl.innerHTML;
    }

    let skeletonHTML = '';
    for (let i = 0; i < count; i++) {
        skeletonHTML += `
            <div class="skeleton-card stagger-item" data-skeleton="true">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-text skeleton-text-medium"></div>
                <div class="skeleton skeleton-text skeleton-text-short"></div>
            </div>
        `;
    }
    containerEl.innerHTML = skeletonHTML;

    // Trigger stagger animation
    setTimeout(() => {
        containerEl.querySelectorAll('.stagger-item').forEach((item, i) => {
            setTimeout(() => item.classList.add('is-visible'), i * 50);
        });
    }, 10);
}

function hideSkeleton(container) {
    const containerEl = typeof container === 'string' ? document.querySelector(container) : container;
    if (!containerEl) return;

    if (containerEl.dataset.originalContent) {
        containerEl.innerHTML = containerEl.dataset.originalContent;
        delete containerEl.dataset.originalContent;
    } else {
        const skeletons = containerEl.querySelectorAll('[data-skeleton="true"]');
        skeletons.forEach(skeleton => skeleton.remove());
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function ensureToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

function showToast(message, type = 'info', duration = 3000) {
    const container = ensureToastContainer();

    const icons = {
        success: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
        error: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
        info: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-show'));

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => dismissToast(toast));

    const timeoutId = setTimeout(() => dismissToast(toast), duration);
    toast.dataset.timeoutId = timeoutId;

    return toast;
}

function dismissToast(toast) {
    if (!toast || toast.classList.contains('toast-hide')) return;
    if (toast.dataset.timeoutId) clearTimeout(parseInt(toast.dataset.timeoutId));
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 400);
}

// ============================================
// FAVORITES SYSTEM
// ============================================
const FAVORITES_STORAGE_KEY = 'rtp_favorites';

function getFavorites() {
    try {
        const favorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        return [];
    }
}

function saveFavorites(favorites) {
    try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.warn('saveFavorites error:', error);
    }
}

function isFavorite(gameId) {
    return getFavorites().includes(String(gameId));
}

function toggleFavorite(gameId) {
    const gameIdStr = String(gameId);
    let favorites = getFavorites();
    const index = favorites.indexOf(gameIdStr);
    let isFavorited = false;

    if (index === -1) {
        favorites.push(gameIdStr);
        isFavorited = true;
        showToast('Ditambahkan ke Favorit', 'success', 2000);
    } else {
        favorites.splice(index, 1);
        isFavorited = false;
        showToast('Dihapus dari Favorit', 'info', 2000);
    }

    saveFavorites(favorites);
    updateFavoriteButtons(gameIdStr, isFavorited);

    window.dispatchEvent(new CustomEvent('favoriteChanged', {
        detail: { gameId: gameIdStr, isFavorited }
    }));

    return isFavorited;
}

function updateFavoriteButtons(gameId, isFavorited) {
    document.querySelectorAll(`[data-favorite-id="${gameId}"]`).forEach(btn => {
        if (isFavorited) {
            btn.classList.add('active', 'animate');
            setTimeout(() => btn.classList.remove('animate'), 600);
        } else {
            btn.classList.remove('active');
        }
    });
}

function initFavoriteButtons() {
    const favorites = getFavorites();
    document.querySelectorAll('[data-favorite-id]').forEach(btn => {
        const gameId = btn.dataset.favoriteId;
        if (favorites.includes(gameId)) btn.classList.add('active');

        if (!btn.dataset.favoriteInit) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(gameId);
            });
            btn.dataset.favoriteInit = 'true';
        }
    });
}

// ============================================
// SEARCH WITH DEBOUNCE
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function initLiveSearch(inputSelector, callback) {
    const input = document.querySelector(inputSelector);
    if (!input) return;

    const debouncedSearch = debounce((value) => {
        callback(value);
    }, 300);

    input.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
function initScrollToTop() {
    const btn = document.createElement('button');
    btn.className = 'fab-scroll-top';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
    btn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// LAZY LOAD IMAGES
// ============================================
function initLazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    if (images.length === 0) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('img-lazy');
                img.classList.add('img-loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.classList.add('img-lazy');
        imageObserver.observe(img);
    });
}

// ============================================
// PAGE TRANSITION
// ============================================
function initPageTransition() {
    document.body.classList.add('page-transition');
}

// ============================================
// INITIALIZE ALL
// ============================================
function initModernUI() {
    initRippleEffect();
    initStaggeredAnimation();
    initTiltEffect();
    initFavoriteButtons();
    initScrollToTop();
    initSmoothScroll();
    initLazyLoadImages();
    initPageTransition();

    console.log('✨ Modern UI initialized');
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModernUI);
} else {
    initModernUI();
}

// Export functions for external use
window.ModernUI = {
    showToast,
    dismissToast,
    showSkeleton,
    hideSkeleton,
    animateValue,
    createRtpGauge,
    animateRtpBar,
    toggleFavorite,
    isFavorite,
    getFavorites,
    initFavoriteButtons,
    initLiveSearch,
    debounce
};
