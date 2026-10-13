
(function(){
  var popup = null;
  var gpTriggerHref = "https://play.google.com/store/apps/details?id=com.tnm.rider";

  var stores = {
    gp: {
      title: "Get the TMO apps on Google Play Store",
      accent: "#FBC02D",
      icon: '<svg width="28" height="28" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;flex:none;"><path d="M2.8 2.35c-.49.52-.8 1.33-.8 2.39v28.52c0 1.03.29 1.82.75 2.34l.12.11L19.3 19.31v-.62L2.91 2.24l-.11.11Z" fill="#00D26A"></path><path d="M24.76 24.79 19.3 19.31v-.62l5.52-5.52.12.07 6.47 3.7c1.85 1.05 1.85 2.77 0 3.84l-6.53 3.73-.12.28Z" fill="#FFD84D"></path><path d="M24.88 24.51 19.3 18.93 2.8 35.43c.77.82 2.05.93 3.5.12l18.58-10.59Z" fill="#FF5252"></path><path d="M24.88 13.49 6.3 2.9C4.84 2.08 3.56 2.2 2.8 3.02l16.5 16.51 5.58-5.58Z" fill="#3B82F6"></path></svg>',
      rider: "https://play.google.com/store/apps/details?id=com.tnm.rider",
      driver: "https://play.google.com/store/apps/details?id=com.tnm.driver",
      riderLabel: "Get TMO Rider",
      driverLabel: "Get TMO Driver",
    },
    as: {
      title: "Get the TMO apps on Apple App Store",
      accent: "#FFFFFF",
      icon: '<svg width="28" height="28" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;flex:none;"><path d="M25.3 15.5c.03-2.8 2.3-4.15 2.4-4.21-1.3-1.9-3.34-2.16-4.07-2.19-1.73-.18-3.37 1.02-4.25 1.02-.88 0-2.23-1-3.66-.97-1.88.03-3.61 1.09-4.58 2.77-1.95 3.38-.5 8.37 1.4 11.11.94 1.36 2.05 2.88 3.51 2.82 1.42-.06 1.96-.92 3.68-.92 1.72 0 2.21.92 3.72.88 1.55-.04 2.47-1.37 3.39-2.74 1.07-1.6 1.51-3.15 1.54-3.23-.03-.02-2.97-1.14-2.99-4.34ZM22.04 5.94c.78-.94 1.3-2.25 1.16-3.55-1.12.04-2.49.75-3.3 1.69-.71.83-1.36 2.16-1.19 3.42 1.25.1 2.55-.61 3.33-1.56Z" fill="#FFFFFF"></path></svg>',
      rider: "https://apps.apple.com/app/tmo-rider/id6800592329",
      driver: "#",
      riderLabel: "Get TMO Rider",
      driverLabel: "Get TMO Driver (coming soon)"
    }
  };

  function closePopup(){
    if(!popup) return;
    popup.style.display = "none";
    popup.style.opacity = "0";
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  function ensurePopup(){
    if(popup) return;
    popup = document.createElement("div");
    popup.id = "tmo-app-popup";
    popup.setAttribute("role","dialog");
    popup.setAttribute("aria-modal","true");
    popup.style.cssText = "position:fixed;inset:0;z-index:9999;display:none;opacity:0;align-items:center;justify-content:center;padding:22px;background:rgba(10,31,24,0.74);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);transition:opacity .22s ease;";
    popup.innerHTML =
      '<div id="tmo-popup-inner" style="width:100%;max-width:440px;border-radius:22px;background:linear-gradient(180deg,#0F4C3A 0%,#0A1F18 100%);border:1px solid rgba(255,255,255,0.12);box-shadow:0 40px 90px -40px rgba(0,0,0,0.8),0 0 0 1px rgba(251,192,45,0.08) inset;padding:22px 20px 20px;">' +
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:6px;">' +
          '<div style="display:flex;align-items:center;gap:12px;">' +
            '<div id="tmo-popup-icon" style="width:44px;height:44px;border-radius:14px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,0.12);"></div>' +
            '<div id="tmo-popup-title" style="font-family:Urbanist,system-ui,sans-serif;font-weight:800;font-size:17px;line-height:1.2;color:#FFFFFF;letter-spacing:-0.02em;"></div>' +
          '</div>' +
          '<button type="button" data-close="1" aria-label="Close" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);color:#FFFFFF;width:38px;height:38px;border-radius:12px;cursor:pointer;font-size:20px;line-height:36px;padding:0;flex:none;transition:background .15s ease;">×</button>' +
        '</div>' +
        '<div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);margin:16px 0 18px;"></div>' +
        '<div style="display:flex;flex-direction:column;gap:12px;">' +
          '<a id="tmo-popup-rider" href="#" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:15px 18px;border-radius:16px;background:#FBC02D;color:#0A1F18;font-family:Urbanist,system-ui,sans-serif;font-weight:800;font-size:15.5px;text-decoration:none;box-shadow:0 14px 30px -14px rgba(251,192,45,0.55);transition:transform .18s ease,box-shadow .18s ease;">' +
            '<span style="display:flex;align-items:center;gap:10px;">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 1 0 9.5 9.5h-4.5a5 5 0 1 1-5-5V2.5Z" fill="#0A1F18"></path></svg>' +
              '<span id="tmo-popup-rider-label">Get TMO Rider</span>' +
            '</span>' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="#0A1F18" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</a>' +
          '<a id="tmo-popup-driver" href="#" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:15px 18px;border-radius:16px;background:transparent;color:#FFFFFF;font-family:Urbanist,system-ui,sans-serif;font-weight:700;font-size:15.5px;text-decoration:none;border:1.5px solid rgba(255,255,255,0.22);transition:border-color .18s ease,background .18s ease;">' +
            '<span style="display:flex;align-items:center;gap:10px;">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 13V7a2 2 0 0 1 2-2h11l5 5v3a1 1 0 0 1-1 1h-1v5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2H8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5H3Z" stroke="#FFFFFF" stroke-width="1.8" stroke-linejoin="round"/><circle cx="7" cy="15" r="1.2" fill="#FFFFFF"/><circle cx="16" cy="15" r="1.2" fill="#FFFFFF"/></svg>' +
              '<span id="tmo-popup-driver-label">Get TMO Driver</span>' +
            '</span>' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</a>' +
        '</div>' +
        '<div id="tmo-popup-foot" style="font-family:Urbanist,system-ui,sans-serif;font-size:12px;color:rgba(255,255,255,0.42);margin-top:16px;text-align:center;"></div>' +
      '</div>';

    popup.addEventListener("click", function(e){ if(e.target === popup) closePopup(); });
    popup.querySelector("[data-close]").addEventListener("click", closePopup);
    document.addEventListener("keydown", function(e){ if(e.key === "Escape") closePopup(); });
    document.body.appendChild(popup);
  }

  function openPopup(storeKey){
    ensurePopup();
    var s = stores[storeKey] || stores.gp;
    popup.querySelector("#tmo-popup-icon").innerHTML = s.icon;
    popup.querySelector("#tmo-popup-title").textContent = s.title;
    var riderBtn = popup.querySelector("#tmo-popup-rider");
    var driverBtn = popup.querySelector("#tmo-popup-driver");
    riderBtn.href = s.rider;
    driverBtn.href = s.driver;
    popup.querySelector("#tmo-popup-rider-label").textContent = s.riderLabel;
    popup.querySelector("#tmo-popup-driver-label").textContent = s.driverLabel;
    if(storeKey === "as"){
      riderBtn.style.background = "#FFFFFF";
      riderBtn.style.color = "#0A1F18";
      riderBtn.style.boxShadow = "0 14px 30px -14px rgba(255,255,255,0.35)";
      riderBtn.style.pointerEvents = "";
      riderBtn.style.opacity = "";
      riderBtn.setAttribute("target","_blank");
      riderBtn.setAttribute("rel","noopener noreferrer");
      driverBtn.style.background = "rgba(255,255,255,0.04)";
      driverBtn.style.color = "rgba(255,255,255,0.45)";
      driverBtn.style.borderColor = "rgba(255,255,255,0.10)";
      driverBtn.style.cursor = "not-allowed";
      driverBtn.style.pointerEvents = "none";
      driverBtn.style.opacity = "0.75";
      driverBtn.removeAttribute("target");
      popup.querySelector("#tmo-popup-foot").textContent = "You will be redirected to the Apple Store";
    } else {
      riderBtn.style.background = "#FBC02D";
      riderBtn.style.color = "#0A1F18";
      riderBtn.style.boxShadow = "0 14px 30px -14px rgba(251,192,45,0.55)";
      riderBtn.style.pointerEvents = "";
      riderBtn.style.opacity = "";
      riderBtn.setAttribute("target","_blank");
      riderBtn.setAttribute("rel","noopener noreferrer");
      driverBtn.style.background = "transparent";
      driverBtn.style.color = "#FFFFFF";
      driverBtn.style.borderColor = "rgba(255,255,255,0.22)";
      driverBtn.style.cursor = "";
      driverBtn.style.pointerEvents = "";
      driverBtn.style.opacity = "";
      driverBtn.setAttribute("target","_blank");
      driverBtn.setAttribute("rel","noopener noreferrer");
      popup.querySelector("#tmo-popup-foot").textContent = "You will be redirected to the Google Play Store";
    }
    popup.style.display = "flex";
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ popup.style.opacity = "1"; }); });
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  document.addEventListener("click", function(e){
    if(!e.target || !e.target.closest) return;
    var a = e.target.closest("a");
    if(!a) return;
    var text = (a.textContent || "").replace(/\s+/g," ").trim();
    if(text.indexOf("Google Play") !== -1 && a.href.indexOf(gpTriggerHref) !== -1){
      e.preventDefault();
      openPopup("gp");
      return;
    }
    if(text.indexOf("Apple Store") !== -1){
      e.preventDefault();
      openPopup("as");
      return;
    }
  }, true);
})();
