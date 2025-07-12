(function () {
    const ua = navigator.userAgent;
    const w = window.innerWidth, h = window.innerHeight;
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    const noHistory = history.length === 1;
    const noOpener = window.opener === null;

    const isLikelyCaptive = (() => {
        const uaHint = /CaptiveNetworkSupport|ConnectivityCheck|NetworkCheck|portal|miniport|wv/i.test(ua);
        const smallView = w < 480 && h < 480;
        const iOSWebSheet = isIOS && noHistory && noOpener && typeof navigator.standalone === "undefined";
        const androidWebView = isAndroid && /wv/.test(ua);
        return uaHint || smallView || iOSWebSheet || androidWebView;
    })();

    function attemptRedirect() {
        const currentURL = window.location.href;
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        if (isIOS) {
            window.location.href = currentURL;
            setTimeout(() => window.location.replace(currentURL), 200);
            setTimeout(() => {
                try {
                    iframe.contentWindow.location.href = currentURL;
                } catch (e) { }
            }, 400);
        } else if (isAndroid && /Chrome/.test(ua)) {
            const scheme = location.protocol.replace(':', '');
            const intent = `intent://${location.host}${location.pathname}${location.search}#Intent;scheme=${scheme};package=com.android.chrome;end`;
            const fallback = `intent://${location.host}${location.pathname}${location.search}#Intent;scheme=${scheme};S.browser_fallback_url=${encodeURIComponent(location.href)};end`;
            window.location.href = intent;
            setTimeout(() => window.location.href = fallback, 300);
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

    function showRedirectModal() {
        if (document.getElementById('redirect-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'redirect-modal';
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });

        const box = document.createElement('div');
        Object.assign(box.style, {
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '360px',
            width: '90%',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        });

        box.innerHTML = `
      <h3 style="margin: 0 0 12px; color: #333;">Captive Portal Detected</h3>
      <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
        Please open this page in your device's default browser to continue.
      </p>
      <div id="countdown" style="font-size: 32px; font-weight: 600; margin-bottom: 16px;">10</div>
      <button id="open-now" style="
        padding: 10px 16px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
      ">Open Now</button>
    `;

        modal.appendChild(box);
        document.body.appendChild(modal);

        let seconds = 10;
        const countdown = document.getElementById('countdown');
        const interval = setInterval(() => {
            seconds--;
            if (countdown) countdown.textContent = seconds;
            if (seconds <= 0) {
                clearInterval(interval);
                modal.remove();
                attemptRedirect();
            }
        }, 1000);

        document.getElementById('open-now')?.addEventListener('click', () => {
            clearInterval(interval);
            modal.remove();
            attemptRedirect();
        });
    }

    if (isLikelyCaptive) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            showRedirectModal();
        } else {
            window.addEventListener('DOMContentLoaded', showRedirectModal);
        }
    }
})();
