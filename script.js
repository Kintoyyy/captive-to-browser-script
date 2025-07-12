(function () {
    const isCaptivePortal = (() => {
        const ua = navigator.userAgent;
        const isLikelyCaptiveUA = /CaptiveNetworkSupport|CAPTIVE|ConnectivityCheck|NetworkCheck|CaptiveNetwork|portal|miniport/i.test(ua);
        const isAppleCaptive = navigator.vendor === "Apple Computer, Inc." && /CaptiveNetworkSupport/.test(navigator.appVersion);

        let hasLimitedStorage = false;
        try {
            localStorage.setItem('__test__', '__test__');
            localStorage.removeItem('__test__');
        } catch (e) {
            hasLimitedStorage = true;
        }

        const serviceWorkerUnavailable = !(navigator.serviceWorker && 'register' in navigator.serviceWorker);

        return isLikelyCaptiveUA || hasLimitedStorage || serviceWorkerUnavailable || isAppleCaptive;
    })();

    const currentURL = window.location.href;

    function attemptAllRedirects() {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isChrome = /Chrome/i.test(navigator.userAgent);

        if (isIOS) {
            window.location.href = currentURL;
            setTimeout(() => window.location.replace(currentURL), 200);
            setTimeout(() => {
                try {
                    iframe.contentWindow.location.href = currentURL;
                } catch (e) { }
            }, 400);
        } else if (isAndroid && isChrome) {
            const scheme = window.location.protocol.replace(':', '');
            const chromeIntent = `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=${scheme};package=com.android.chrome;end`;
            const fallbackIntent = `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=${scheme};S.browser_fallback_url=${encodeURIComponent(currentURL)};end`;

            window.location.href = chromeIntent;
            setTimeout(() => window.location.href = fallbackIntent, 300);
            setTimeout(() => window.location.replace(currentURL), 600);
        } else {
            window.location.href = currentURL;
            setTimeout(() => window.location.replace(currentURL), 300);
        }

        setTimeout(() => {
            try {
                document.body.removeChild(iframe);
            } catch (e) { }
        }, 1500);
    }

    function showCountdownPopup() {
        if (!document.body) {
            setTimeout(showCountdownPopup, 50);
            return;
        }

        if (document.getElementById('captive-portal-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'captive-portal-modal';
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        });

        const content = document.createElement('div');
        Object.assign(content.style, {
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '360px',
            width: '90%',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        });

        content.innerHTML = `
        <h3 style="margin: 0 0 10px; font-size: 18px; color: #222;">Captive Portal Detected</h3>
        <p style="font-size: 14px; color: #444; margin-bottom: 20px;">
            To continue, please open this page in your device's default browser.
        </p>
        <div id="countdown" style="font-size: 32px; font-weight: 500; margin-bottom: 20px; color: #555;">10</div>
        <div style="display: flex; justify-content: space-between; gap: 10px;">
            <button id="redirect-now-btn" style="
                flex: 1;
                padding: 10px;
                background-color: #007bff;
                color: #fff;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
            ">Open Now</button>
            <button id="dismiss-btn" style="
                flex: 1;
                padding: 10px;
                background-color: #e0e0e0;
                color: #333;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
            ">Cancel</button>
        </div>
    `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        let secondsLeft = 10;
        const countdownElement = document.getElementById('countdown');
        const interval = setInterval(() => {
            secondsLeft--;
            if (countdownElement) countdownElement.textContent = secondsLeft;
            if (secondsLeft <= 0) {
                clearInterval(interval);
                modal.remove();
                attemptAllRedirects();
            }
        }, 1000);

        document.getElementById('redirect-now-btn')?.addEventListener('click', () => {
            clearInterval(interval);
            modal.remove();
            attemptAllRedirects();
        });

        document.getElementById('dismiss-btn')?.addEventListener('click', () => {
            clearInterval(interval);
            modal.remove();
        });
    }


    function ensureUIReady() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            showCountdownPopup();
        } else {
            document.addEventListener('DOMContentLoaded', showCountdownPopup);
            setTimeout(() => {
                if (!document.getElementById('captive-portal-modal')) {
                    showCountdownPopup();
                }
            }, 1000);
        }
    }

    if (isCaptivePortal) {
        ensureUIReady();
    }
})();