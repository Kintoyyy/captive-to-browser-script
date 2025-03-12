(function () {
    const isCaptivePortal = (function () {
        const uaHasCaptiveTerms = /CaptiveNetworkSupport|CAPTIVE|ConnectivityCheck|NetworkCheck|CaptiveNetwork/i.test(navigator.userAgent);
        const hasLimitedStorage = (typeof localStorage !== 'undefined' && localStorage === null);
        const missingServiceWorker = (typeof navigator.serviceWorker === 'undefined');
        const isAppleCaptive = (window.navigator.vendor === "Apple Computer, Inc." &&
            window.navigator.appVersion.indexOf("CaptiveNetworkSupport") > -1);
        return uaHasCaptiveTerms || hasLimitedStorage || missingServiceWorker || isAppleCaptive;
    })();

    const currentURL = window.location.href;

    function attemptAllRedirects() {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            window.location.href = currentURL;

            setTimeout(function () {
                window.location.replace(currentURL);
            }, 100);

            setTimeout(function () {
                try {
                    iframe.contentWindow.location.href = currentURL;
                } catch (e) { }
            }, 200);

        } else if (/Android/i.test(navigator.userAgent)) {
            const chromeIntent = 'intent://' + window.location.host + window.location.pathname +
                window.location.search + '#Intent;scheme=' + window.location.protocol.replace(':', '') +
                ';package=com.android.chrome;end';
            window.location.href = chromeIntent;

            setTimeout(function () {
                const browserIntent = 'intent://' + window.location.host + window.location.pathname +
                    window.location.search + '#Intent;scheme=' + window.location.protocol.replace(':', '') +
                    ';S.browser_fallback_url=' + encodeURIComponent(currentURL) + ';end';
                window.location.href = browserIntent;
            }, 100);

            setTimeout(function () {
                window.location.replace(currentURL);
            }, 200);

        } else {
            window.location.href = currentURL;

            setTimeout(function () {
                window.location.replace(currentURL);
            }, 100);
        }

        setTimeout(function () {
            try {
                document.body.removeChild(iframe);
            } catch (e) { }
        }, 1000);
    }

    function showCountdownPopup() {
        if (!document.body) {
            setTimeout(showCountdownPopup, 50);
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'captive-portal-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modal.style.zIndex = '2147483647';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        const content = document.createElement('div');
        content.style.backgroundColor = 'white';
        content.style.padding = '20px';
        content.style.borderRadius = '8px';
        content.style.maxWidth = '85%';
        content.style.textAlign = 'center';

        content.innerHTML = `
            <h2 style="margin-top: 0; font-family: sans-serif; color: #333;">Opening in Default Browser</h2>
            <p style="font-family: sans-serif; color: #555; font-size: 16px;">For optimal performance and accurate voucher code storage, please open this portal in your default browser.</p>
            <div id="countdown" style="font-size: 36px; font-weight: bold; margin: 20px 0; font-family: sans-serif; color: red;">10</div>
            <div style="margin-top: 20px;">
                <button id="dismiss-btn" style="background-color: #f44336; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-family: sans-serif; font-size: 14px;">Cancel</button>
                <button id="redirect-now-btn" style="background-color: #2196F3; color: white; border: none; padding: 12px 24px; margin-right: 10px; margin-bottom: 10px; border-radius: 4px; cursor: pointer; font-family: sans-serif; font-size: 14px;">Continue</button>
            </div>
        `;

        modal.appendChild(content);

        try {
            document.body.appendChild(modal);
        } catch (e) {
            return;
        }

        let secondsLeft = 10;
        const countdownElement = document.getElementById('countdown');
        const countdownInterval = setInterval(function () {
            secondsLeft--;
            if (countdownElement) {
                countdownElement.textContent = secondsLeft;
            }
            if (secondsLeft <= 0) {
                clearInterval(countdownInterval);
                try {
                    document.body.removeChild(modal);
                } catch (e) { }
                attemptAllRedirects();
            }
        }, 1000);

        try {
            const redirectNowBtn = document.getElementById('redirect-now-btn');
            if (redirectNowBtn) {
                redirectNowBtn.addEventListener('click', function () {
                    clearInterval(countdownInterval);
                    try {
                        document.body.removeChild(modal);
                    } catch (e) { }
                    attemptAllRedirects();
                });
            }

            const dismissBtn = document.getElementById('dismiss-btn');
            if (dismissBtn) {
                dismissBtn.addEventListener('click', function () {
                    clearInterval(countdownInterval);
                    try {
                        document.body.removeChild(modal);
                    } catch (e) { }
                });
            }
        } catch (e) { }
    }

    function ensureUIReady() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            showCountdownPopup();
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                showCountdownPopup();
            });

            setTimeout(function () {
                const modalExists = document.getElementById('captive-portal-modal');
                if (!modalExists) {
                    showCountdownPopup();
                }
            }, 1000);
        }
    }

    if (isCaptivePortal) {
        ensureUIReady();
    }
})();