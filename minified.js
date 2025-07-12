!function () {
    const a = navigator.userAgent, e = window.innerWidth, t = window.innerHeight, d = /iPhone|iPad|iPod/.test(a), r = /Android/.test(a), o = 1 === history.length, n = null === window.opener; var i, c, l, s; function p() { const e = window.location.href, t = document.createElement("iframe"); if (t.style.display = "none", document.body.appendChild(t), d) window.location.href = e, setTimeout(() => window.location.replace(e), 200), setTimeout(() => { try { t.contentWindow.location.href = e } catch (e) { } }, 400); else if (r && /Chrome/.test(a)) { var o = location.protocol.replace(":", ""), n = `intent://${location.host}${location.pathname}${location.search}#Intent;scheme=${o};package=com.android.chrome;end`; const i = `intent://${location.host}${location.pathname}${location.search}#Intent;scheme=${o};S.browser_fallback_url=${encodeURIComponent(location.href)};end`; window.location.href = n, setTimeout(() => window.location.href = i, 300), setTimeout(() => window.location.replace(e), 600) } else window.location.href = e, setTimeout(() => window.location.replace(e), 300); setTimeout(() => { try { document.body.removeChild(t) } catch (e) { } }, 1500) } function m() {
        if (!document.getElementById("redirect-modal")) {
            const o = document.createElement("div"); o.id = "redirect-modal", Object.assign(o.style, { position: "fixed", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: "9999", display: "flex", alignItems: "center", justifyContent: "center" }); var t = document.createElement("div"); Object.assign(t.style, { backgroundColor: "#fff", padding: "24px", borderRadius: "8px", maxWidth: "360px", width: "90%", fontFamily: "system-ui, sans-serif", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }), t.innerHTML = `
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
    `, o.appendChild(t), document.body.appendChild(o); let e = 10; const n = document.getElementById("countdown"), i = setInterval(() => { e--, n && (n.textContent = e), e <= 0 && (clearInterval(i), o.remove(), p()) }, 1e3); document.getElementById("open-now")?.addEventListener("click", () => { clearInterval(i), o.remove(), p() })
        }
    } i = /CaptiveNetworkSupport|ConnectivityCheck|NetworkCheck|portal|miniport|wv/i.test(a), c = e < 480 && t < 480, l = d && o && n && void 0 === navigator.standalone, s = r && /wv/.test(a), (i || c || l || s) && ("complete" === document.readyState || "interactive" === document.readyState ? m() : window.addEventListener("DOMContentLoaded", m))
}();