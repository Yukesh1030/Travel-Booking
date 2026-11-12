/* ==========================================================================
   STACKLY Travels — Main Interactive, Validation & Motion Script
   Technologies: Vanilla JS + Lenis + GSAP + ScrollTrigger + AOS
   ========================================================================== */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lenisInstance = null;

  /* ---------- 1. Header Scroll Behaviour & Mobile Hamburger ---------- */
  function initNavigation() {
    const header = document.getElementById("siteHeader");
    const hamburger = document.getElementById("hamburgerBtn");
    const drawer = document.getElementById("mobileDrawer");
    const backdrop = document.getElementById("mobileBackdrop");
    const closeBtn = document.getElementById("drawerCloseBtn");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link, .mobile-drawer .btn");

    const updateHeaderState = () => {
      if (!header) return;
      if (header.classList.contains("header-solid")) {
        header.classList.add("is-scrolled");
        return;
      }
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    const setDrawerState = (open) => {
      if (!hamburger || !drawer || !backdrop) return;
      hamburger.classList.toggle("is-open", open);
      hamburger.setAttribute("aria-expanded", String(open));
      drawer.classList.toggle("is-open", open);
      drawer.setAttribute("aria-hidden", String(!open));
      backdrop.classList.toggle("is-open", open);
      document.body.classList.toggle("drawer-open", open);

      if (lenisInstance) {
        if (open) lenisInstance.stop();
        else lenisInstance.start();
      }

      if (open && closeBtn) {
        closeBtn.focus();
      } else if (!open && hamburger) {
        hamburger.focus();
      }
    };

    if (hamburger) {
      hamburger.addEventListener("click", () => {
        const isOpen = drawer && drawer.classList.contains("is-open");
        setDrawerState(!isOpen);
      });
    }

    if (closeBtn) closeBtn.addEventListener("click", () => setDrawerState(false));
    if (backdrop) backdrop.addEventListener("click", () => setDrawerState(false));

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => setDrawerState(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer && drawer.classList.contains("is-open")) {
        setDrawerState(false);
      }
    });
  }

  /* ---------- 2. Lenis Smooth Scroll, GSAP, ScrollTrigger & AOS ---------- */
  function initMotion() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 750,
        easing: "ease-out-cubic",
        once: true,
        offset: 50,
        disable: prefersReducedMotion,
      });
    }

    if (typeof Lenis !== "undefined" && !prefersReducedMotion) {
      lenisInstance = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
        lenisInstance.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenisInstance.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (time) => {
          lenisInstance.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      }
    } else if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Smooth anchor navigation (header & footer anchors)
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;
        e.preventDefault();
        if (lenisInstance) {
          lenisInstance.scrollTo(targetEl, { offset: -76, duration: 1.1 });
        } else {
          targetEl.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
        }
      });
    });

    if (typeof gsap === "undefined" || prefersReducedMotion) return;

    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl
      .from(".floating-dest-label", { y: -18, opacity: 0, duration: 0.7 })
      .from(".hero .eyebrow", { y: 18, opacity: 0, duration: 0.6 }, "-=0.35")
      .from(".hero-title span", { y: 36, opacity: 0, stagger: 0.14, duration: 0.85 }, "-=0.35")
      .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.7 }, "-=0.45")
      .from(".hero-ctas .btn", { y: 16, opacity: 0, stagger: 0.12, duration: 0.55 }, "-=0.4")
      .from(".booking-panel", { y: 34, opacity: 0, duration: 0.8 }, "-=0.35");

    gsap.to(".floating-dest-label", {
      y: -6,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    if (typeof ScrollTrigger !== "undefined") {
      gsap.to(".hero-bg", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }

  /* ---------- 3. Shared Form Validation Helpers ---------- */
  function clearInvalidOnEdit(fields, feedbackEl) {
    fields.forEach((field) => {
      if (!field) return;
      const clear = () => {
        field.classList.remove("is-invalid");
        field.removeAttribute("aria-invalid");
        if (feedbackEl) feedbackEl.textContent = "";
      };
      field.addEventListener("input", clear);
      field.addEventListener("change", clear);
    });
  }

  function showValidationError(field, feedbackEl, message) {
    if (field) {
      field.classList.add("is-invalid");
      field.setAttribute("aria-invalid", "true");
      field.focus();
    }
    if (feedbackEl) {
      feedbackEl.textContent = message;
    }
  }

  /* ---------- 4. Booking Search Form Validation -> 404.html ---------- */
  function initBookingPanel() {
    const form = document.getElementById("bookingSearchForm");
    const checkIn = document.getElementById("searchCheckIn");
    const checkOut = document.getElementById("searchCheckOut");
    const destSelect = document.getElementById("searchDestination");
    const typeSelect = document.getElementById("searchTravelType");
    const guestMinus = document.getElementById("guestMinusBtn");
    const guestPlus = document.getElementById("guestPlusBtn");
    const guestDisplay = document.getElementById("guestCountDisplay");
    const feedback = document.getElementById("bookingFormFeedback");

    if (!form) return;

    let guests = 2;
    const syncGuests = () => {
      if (guestDisplay) {
        guestDisplay.textContent = `${guests} ${guests === 1 ? "Traveller" : "Travellers"}`;
      }
    };

    if (guestMinus) {
      guestMinus.addEventListener("click", () => {
        if (guests > 1) {
          guests -= 1;
          syncGuests();
        }
      });
    }
    if (guestPlus) {
      guestPlus.addEventListener("click", () => {
        if (guests < 10) {
          guests += 1;
          syncGuests();
        }
      });
    }

    const todayStr = new Date().toISOString().split("T")[0];
    if (checkIn && checkOut) {
      const today = new Date();
      const dep = new Date(today.getTime() + 14 * 86400000);
      const ret = new Date(today.getTime() + 21 * 86400000);
      checkIn.min = todayStr;
      checkIn.value = dep.toISOString().split("T")[0];
      checkOut.min = checkIn.value;
      checkOut.value = ret.toISOString().split("T")[0];

      checkIn.addEventListener("change", () => {
        if (checkIn.value) {
          checkOut.min = checkIn.value;
          if (checkOut.value && checkOut.value <= checkIn.value) {
            const nextDay = new Date(new Date(checkIn.value).getTime() + 86400000);
            checkOut.value = nextDay.toISOString().split("T")[0];
          }
        }
      });
    }

    clearInvalidOnEdit([destSelect, checkIn, checkOut, typeSelect], feedback);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      [destSelect, checkIn, checkOut, typeSelect].forEach((el) => {
        if (el) {
          el.classList.remove("is-invalid");
          el.removeAttribute("aria-invalid");
        }
      });

      if (!destSelect || !destSelect.value.trim()) {
        showValidationError(destSelect, feedback, "Please select a destination to search your journey.");
        return;
      }

      if (!checkIn || !checkIn.value || checkIn.value < todayStr) {
        showValidationError(checkIn, feedback, "Please select a valid departure date from today onward.");
        return;
      }

      if (!checkOut || !checkOut.value || checkOut.value <= checkIn.value) {
        showValidationError(checkOut, feedback, "Return date must be at least one night after your departure date.");
        return;
      }

      if (guests < 1 || guests > 10) {
        if (feedback) feedback.textContent = "Please choose between 1 and 10 travellers.";
        return;
      }

      if (!typeSelect || !typeSelect.value.trim()) {
        showValidationError(typeSelect, feedback, "Please select a travel experience type.");
        return;
      }

      if (feedback) feedback.textContent = "";
      window.location.href = "404.html";
    });
  }

  /* ---------- 5. Flight & Newsletter Form Validations -> 404.html ---------- */
  function initSecondaryForms() {
    const flightForm = document.getElementById("flightSearchForm");
    const flightRoute = document.getElementById("flightRoute");
    const flightCabin = document.getElementById("flightCabin");
    const flightFeedback = document.getElementById("flightFormFeedback");

    if (flightForm) {
      clearInvalidOnEdit([flightRoute, flightCabin], flightFeedback);
      flightForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!flightRoute || !flightRoute.value.trim()) {
          showValidationError(flightRoute, flightFeedback, "Please choose a flight route before searching.");
          return;
        }
        if (!flightCabin || !flightCabin.value.trim()) {
          showValidationError(flightCabin, flightFeedback, "Please select a cabin or rail experience.");
          return;
        }
        if (flightFeedback) flightFeedback.textContent = "";
        window.location.href = "404.html";
      });
    }

    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");
    const newsletterFeedback = document.getElementById("newsletterFeedback");

    if (newsletterForm && newsletterEmail) {
      clearInvalidOnEdit([newsletterEmail], newsletterFeedback);
      newsletterEmail.addEventListener("input", () => {
        newsletterForm.classList.remove("is-invalid");
      });

      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const val = newsletterEmail.value.trim();
        if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          newsletterForm.classList.add("is-invalid");
          showValidationError(
            newsletterEmail,
            newsletterFeedback,
            "Please enter a valid email address to subscribe."
          );
          return;
        }
        newsletterForm.classList.remove("is-invalid");
        if (newsletterFeedback) newsletterFeedback.textContent = "";
        window.location.href = "404.html";
      });
    }
  }

  /* ---------- 6. Shared Category Filter Pills (Hotels & Packages) ---------- */
  function initFilterGroup(pillContainerId, cardSelector) {
    const container = document.getElementById(pillContainerId);
    if (!container) return;
    const pills = container.querySelectorAll(".filter-pill");
    const cards = document.querySelectorAll(cardSelector);

    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        const filter = pill.dataset.filter;
        pills.forEach((p) => p.classList.remove("is-active"));
        pill.classList.add("is-active");

        cards.forEach((card) => {
          const cats = (card.dataset.category || "").split(" ");
          const show = filter === "all" || cats.includes(filter);
          card.classList.toggle("is-hidden", !show);
        });

        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
      });
    });
  }

  /* ---------- Bootstrap ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initMotion();
    initBookingPanel();
    initSecondaryForms();
    initFilterGroup("hotelFilters", ".hotel-card");
    initFilterGroup("packageFilters", ".package-card");
  });
})();
