
(function(){
  var triggerHref = "https://play.google.com/store/apps/details?id=com.tnm.rider";
  var popup = null;

  function closePopup(){
    if(!popup) return;
    popup.style.display = "none";
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  function ensurePopup(){
    if(popup) return;
    popup = document.createElement("div");
    popup.id = "tmo-app-popup";
    popup.setAttribute("role","dialog");
    popup.setAttribute("aria-modal","true");
    popup.style.cssText = "position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:22px;background:rgba(10,31,24,0.74);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);";
    popup.innerHTML = "" +
      "<div style=\"width:100%;max-width:420px;border-radius:18px;background:#0A1F18;border:1px solid rgba(255,255,255,0.12);box-shadow:0 40px 90px -40px rgba(0,0,0,0.8);padding:20px 18px;\">" +
        "<div style=\"display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;\">" +
          "<div style=\"font-family:Urbanist,system-ui,sans-serif;font-weight:800;font-size:16px;color:#FFFFFF;letter-spacing:-0.02em;\">Get the TMO apps on Google Play Store</div>" +
          "<button type=\"button\" data-close=\"1\" aria-label=\"Close\" style=\"background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);color:#FFFFFF;width:36px;height:36px;border-radius:12px;cursor:pointer;font-size:18px;line-height:34px;padding:0;\">×</button>" +
        "</div>" +
        "<div style=\"display:flex;flex-direction:column;gap:10px;\">" +
          "<a href=\"https://play.google.com/store/apps/details?id=com.tnm.rider\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"display:flex;align-items:center;justify-content:center;gap:10px;padding:14px 16px;border-radius:14px;background:#FBC02D;color:#0A1F18;font-family:Urbanist,system-ui,sans-serif;font-weight:800;font-size:15px;text-decoration:none;\">Get TMO Rider</a>" +
        "</div>" +
        "<div style=\"display:flex;flex-direction:column;gap:10px;margin-top:12px;\">" +
          "<a href=\"https://play.google.com/store/apps/details?id=com.tnm.driver\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"display:flex;align-items:center;justify-content:center;gap:10px;padding:14px 16px;border-radius:14px;background:#FBC02D;color:#0A1F18;font-family:Urbanist,system-ui,sans-serif;font-weight:800;font-size:15px;text-decoration:none;\">Get TMO Driver</a>" +
        "</div>" +
      "</div>";

    popup.addEventListener("click", function(e){ if(e.target === popup) closePopup(); });
    popup.querySelector("[data-close]").addEventListener("click", closePopup);
    document.addEventListener("keydown", function(e){ if(e.key === "Escape") closePopup(); });
    document.body.appendChild(popup);
  }

  function openPopup(){
    ensurePopup();
    popup.style.display = "flex";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  document.addEventListener("click", function(e){
    if(!e.target || !e.target.closest) return;
    var a = e.target.closest('a[href="' + triggerHref + '"]');
    if(!a) return;
    if((a.textContent || '').indexOf('Google Play') === -1) return;
    e.preventDefault();
    openPopup();
  }, true);
})();
