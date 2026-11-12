/* ==========================================================================
   STACKLY Travels — Custom 404 Page GSAP Animations & Navigation Actions
   ========================================================================== */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initBackAction() {
    const backBtn = document.getElementById("goBackBtn");
    if (!backBtn) return;

    backBtn.addEventListener("click", () => {
      if (window.history.length > 1 && document.referrer) {
        window.history.back();
      } else {
        window.location.href = "index.html";
      }
    });
  }

  function init404Animations() {
    if (typeof gsap === "undefined" || prefersReducedMotion) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".error-eyebrow", { y: 18, opacity: 0, duration: 0.55 })
      .from(".error-digit", { y: 44, opacity: 0, stagger: 0.12, duration: 0.75 }, "-=0.3")
      .from(".error-title", { y: 24, opacity: 0, duration: 0.65 }, "-=0.4")
      .from(".error-desc", { y: 18, opacity: 0, duration: 0.6 }, "-=0.4")
      .from(".error-actions .btn", { y: 16, opacity: 0, stagger: 0.12, duration: 0.5 }, "-=0.35")
      .from(".error-quick-links", { y: 14, opacity: 0, duration: 0.5 }, "-=0.3")
      .from(".compass-stage", { scale: 0.94, opacity: 0, duration: 0.85 }, "-=0.75");

    // Rotate compass needle smoothly
    gsap.to("#compassNeedle", {
      rotation: 360,
      transformOrigin: "50% 50%",
      duration: 24,
      repeat: -1,
      ease: "none",
    });

    // Subtle flight route dash flow
    gsap.to("#compassRoute", {
      strokeDashoffset: -60,
      duration: 3.5,
      repeat: -1,
      ease: "none",
    });

    // Ambient floating coordinate badges
    gsap.to(".coord-top", {
      y: -7,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(".coord-bottom", {
      y: 7,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initBackAction();
    init404Animations();
  });
})();

