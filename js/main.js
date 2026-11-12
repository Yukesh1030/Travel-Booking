/* ==========================================================================
   STACKLY Travels — Main Interactive & Motion Script
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

    // Smooth anchor navigation via Lenis
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

    // Hero entrance timeline
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl
      .from(".floating-dest-label", { y: -18, opacity: 0, duration: 0.7 })
      .from(".hero .eyebrow", { y: 18, opacity: 0, duration: 0.6 }, "-=0.35")
      .from(".hero-title span", { y: 36, opacity: 0, stagger: 0.14, duration: 0.85 }, "-=0.35")
      .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.7 }, "-=0.45")
      .from(".hero-ctas .btn", { y: 16, opacity: 0, stagger: 0.12, duration: 0.55 }, "-=0.4")
      .from(".booking-panel", { y: 34, opacity: 0, duration: 0.8 }, "-=0.35");

    // Ambient float on destination label
    gsap.to(".floating-dest-label", {
      y: -6,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Subtle Hero parallax
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

  /* ---------- 3. Shared Catalog Data for Booking & Modals ---------- */
  const CATALOG = {
    destinations: {
      bali: {
        kicker: "Bali · Indonesia",
        title: "Bali Highlands & Coastal Sanctuaries",
        description:
          "Wake above emerald Tegallalang rice terraces, enjoy private temple blessings at sunrise, and unwind in cliffside infinity pools overlooking the Indian Ocean.",
        highlights: [
          "Best season: April to October (dry sunlit breezes)",
          "Signature stays: Ubud rainforest pool villas & Uluwatu clifftop suites",
          "Curated experiences: Private water purification ceremony & catamaran day sail",
        ],
        price: "From $1,890 per guest",
      },
      maldives: {
        kicker: "Maldives · Indian Ocean",
        title: "Overwater Lagoon Retreats & Coral Atolls",
        description:
          "Touch down by private seaplane onto powdery sandbars surrounded by crystalline reef lagoons, private sunset dining pavilions, and resident marine biologists.",
        highlights: [
          "Best season: November to April (calm lagoon visibility)",
          "Signature stays: Finolhu-style sandbank villas & sunset overwater residences",
          "Curated experiences: Manta ray snorkelling & candlelit beach pavilion dinner",
        ],
        price: "From $3,450 per guest",
      },
      switzerland: {
        kicker: "Switzerland · Swiss Alps",
        title: "Panoramic Alpine Rails & Peak Chalets",
        description:
          "Glide across stone viaducts aboard first-class panoramic rail cars, sip espresso beneath snow-crowned Matterhorn ridges, and restore in timber thermal spas.",
        highlights: [
          "Best season: June–September (meadows) & December–March (snow)",
          "Signature stays: Private Zermatt & St. Moritz boutique alpine chalets",
          "Curated experiences: Glacier Express Excellence Class & private ridge trek",
        ],
        price: "From $2,980 per guest",
      },
      paris: {
        kicker: "Paris · France",
        title: "Golden-Hour Boulevards & Private Ateliers",
        description:
          "Stay in discreet limestone townhouses near the Seine with terrace views of the Eiffel Tower, after-hours gallery access, and Michelin-starred tasting menus.",
        highlights: [
          "Best season: April–June & September–October",
          "Signature stays: Left Bank boutique residences & Eiffel-view suites",
          "Curated experiences: Private twilight Seine river yacht & Louvre curator walk",
        ],
        price: "From $2,540 per guest",
      },
      dubai: {
        kicker: "Dubai · United Arab Emirates",
        title: "Skyline Yachts & Golden Desert Camps",
        description:
          "Pair sleek superyacht charters off Dubai Marina and private helicopter skyline flights with serene candlelit dining deep inside protected desert dunes.",
        highlights: [
          "Best season: October to April (golden sunlit evenings)",
          "Signature stays: Palm beachfront resorts & luxury desert dune pavilions",
          "Curated experiences: VIP yacht charter, helicopter tour & private dune safari",
        ],
        price: "From $2,290 per guest",
      },
      thailand: {
        kicker: "Thailand · Andaman & North",
        title: "Emerald Limestone Bays & Heritage Lanterns",
        description:
          "Drift at sunrise on a private wooden longtail boat past dramatic Krabi karst cliffs before exploring candlelit northern heritage courtyards and wellness spas.",
        highlights: [
          "Best season: November to March (calm Andaman Sea)",
          "Signature stays: Krabi cliffside hideaways & Chiang Mai heritage estates",
          "Curated experiences: Sunrise island-hopping longtail & private Thai chef table",
        ],
        price: "From $1,640 per guest",
      },
    },
    guides: {
      alpine: {
        kicker: "7-Day Itinerary · Scenic Road & Rail",
        title: "7-Day Alpine & Scenic Mountain Journal",
        description:
          "Map out high-pass hairpin vistas, lakeside lunch stops, and golden-hour photography windows across the Alps with zero rushed check-ins.",
        highlights: [
          "Days 1–2: Zurich & Lake Lucerne private wooden boat transfer",
          "Days 3–5: Landwasser Viaduct panoramic rail to Engadin & Zermatt",
          "Days 6–7: Thermal spa recovery & summit sunrise picnic",
        ],
        price: "Complimentary Editorial Guide",
      },
      atolls: {
        kicker: "Destination Comparison",
        title: "Maldives Atolls vs. Bali Highlands: Choosing Your Pace",
        description:
          "Whether you crave barefoot marine stillness on a single coral sandbar or lush hillside rituals, here is how our specialists match your travel rhythm.",
        highlights: [
          "Choose Maldives for effortless overwater seclusion and house-reef diving",
          "Choose Bali for spiritual architecture, terraced landscapes, and culinary depth",
          "Combine both via Singapore or Kuala Lumpur for a 12-night dual sanctuary",
        ],
        price: "Concierge Planning Brief",
      },
      packing: {
        kicker: "Packing Edit",
        title: "The Capsule Wardrobe for Resort & Alpine Climates",
        description:
          "Pack lighter without sacrificing evening polish across tropical seaplane weight limits and crisp mountain terraces.",
        highlights: [
          "Linen layers & neutral Pearl Ivory tailoring fit both beach dining and city walks",
          "Seaplane allowance tip: soft-sided weekender duffels up to 20 kg",
          "Universal polarized optics, reef-safe SPF, and compact merino mid-layers",
        ],
        price: "Seasonal Checklist",
      },
      etiquette: {
        kicker: "Local Experiences",
        title: "Hidden Courtyards, Etiquette & Private Dining Windows",
        description:
          "Insider timing tips that turn busy landmarks into quiet personal moments—from sunrise temple openings to late-evening gallery entries.",
        highlights: [
          "Book sunrise boat departures at 06:00 for serene Andaman bays",
          "Reserve private after-hours museum slots 30 days prior in Paris",
          "Ask our concierge for chef-table dietary cards in local scripts",
        ],
        price: "Local Insider Notes",
      },
    },
  };

  const SEARCH_INVENTORY = [
    {
      dest: "maldives",
      type: "honeymoon",
      title: "Maldives Sandbar & Overwater Sanctuary",
      duration: "6 Nights · 7 Days",
      basePerGuest: 3450,
      inclusions: "Seaplane transfer, sunset pavilion dinner & reef snorkel",
    },
    {
      dest: "bali",
      type: "luxury",
      title: "Ubud Canopy Villa & Coastal Retreat",
      duration: "7 Nights · 8 Days",
      basePerGuest: 2150,
      inclusions: "Private pool villa, chauffeur & Balinese spa ritual",
    },
    {
      dest: "switzerland",
      type: "alpine",
      title: "Swiss Panoramic Rail & Alpine Chalet",
      duration: "6 Nights · 7 Days",
      basePerGuest: 2980,
      inclusions: "Excellence Class rail, boutique chalet & glacier excursion",
    },
    {
      dest: "paris",
      type: "honeymoon",
      title: "Parisian Seine Terrace & Champagne Escape",
      duration: "5 Nights · 6 Days",
      basePerGuest: 2540,
      inclusions: "Boutique Eiffel suite, river yacht & private gallery tour",
    },
    {
      dest: "dubai",
      type: "adventure",
      title: "Dubai Skyline Yacht & Desert Dunes Safari",
      duration: "5 Nights · 6 Days",
      basePerGuest: 2290,
      inclusions: "Marina yacht cruise, helicopter flight & desert camp",
    },
    {
      dest: "thailand",
      type: "family",
      title: "Krabi Emerald Lagoon & Cultural Family Hideaway",
      duration: "8 Nights · 9 Days",
      basePerGuest: 1840,
      inclusions: "Two-bedroom cliffside suite, longtail charter & transfers",
    },
  ];

  /* ---------- 4. Interactive Modal System ---------- */
  const modal = {
    backdrop: null,
    kicker: null,
    title: null,
    desc: null,
    list: null,
    actions: null,
    feedback: null,
    init() {
      this.backdrop = document.getElementById("detailModal");
      if (!this.backdrop) return;
      this.kicker = document.getElementById("modalKicker");
      this.title = document.getElementById("modalTitle");
      this.desc = document.getElementById("modalDesc");
      this.list = document.getElementById("modalHighlights");
      this.actions = document.getElementById("modalActions");
      this.feedback = document.getElementById("modalFeedback");

      const closeBtn = document.getElementById("modalCloseBtn");
      if (closeBtn) closeBtn.addEventListener("click", () => this.close());
      this.backdrop.addEventListener("click", (e) => {
        if (e.target === this.backdrop) this.close();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.backdrop.classList.contains("is-open")) {
          this.close();
        }
      });
    },
    open({ kicker, title, description, highlights, price, primaryLabel = "Request Concierge Hold", secondaryHref = "404.html", secondaryLabel = "View Full Page" }) {
      if (!this.backdrop) return;
      this.kicker.textContent = kicker || "STACKLY Curated";
      this.title.textContent = title || "";
      this.desc.textContent = description || "";
      this.list.innerHTML = "";
      (highlights || []).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        this.list.appendChild(li);
      });
      if (price) {
        const priceLi = document.createElement("li");
        priceLi.innerHTML = `<strong>Estimated Investment:</strong> ${price}`;
        this.list.appendChild(priceLi);
      }

      this.feedback.textContent = "";
      this.actions.innerHTML = "";

      const confirmBtn = document.createElement("button");
      confirmBtn.type = "button";
      confirmBtn.className = "btn btn-gold";
      confirmBtn.textContent = primaryLabel;
      confirmBtn.addEventListener("click", () => {
        this.feedback.textContent =
          "Concierge hold prepared in your browser session. Our travel specialists respond within 2 hours for bespoke bookings.";
      });

      const fullLink = document.createElement("a");
      fullLink.href = secondaryHref;
      fullLink.className = "btn btn-outline-ocean";
      fullLink.textContent = secondaryLabel;

      this.actions.appendChild(confirmBtn);
      this.actions.appendChild(fullLink);

      this.backdrop.classList.add("is-open");
      this.backdrop.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      if (lenisInstance) lenisInstance.stop();
    },
    close() {
      if (!this.backdrop) return;
      this.backdrop.classList.remove("is-open");
      this.backdrop.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (lenisInstance) lenisInstance.start();
    },
  };

  /* ---------- 5. Hero Booking Search Panel ---------- */
  function initBookingPanel() {
    const form = document.getElementById("bookingSearchForm");
    const checkIn = document.getElementById("searchCheckIn");
    const checkOut = document.getElementById("searchCheckOut");
    const destSelect = document.getElementById("searchDestination");
    const typeSelect = document.getElementById("searchTravelType");
    const guestMinus = document.getElementById("guestMinusBtn");
    const guestPlus = document.getElementById("guestPlusBtn");
    const guestDisplay = document.getElementById("guestCountDisplay");
    const resultsBox = document.getElementById("searchResults");
    const resultsGrid = document.getElementById("searchResultsGrid");
    const resultsSummary = document.getElementById("searchResultsSummary");
    const clearBtn = document.getElementById("clearSearchBtn");

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

    // Set clean default dates
    if (checkIn && checkOut) {
      const today = new Date();
      const fmt = (d) => d.toISOString().split("T")[0];
      const dep = new Date(today.getTime() + 14 * 86400000);
      const ret = new Date(today.getTime() + 21 * 86400000);
      checkIn.min = fmt(today);
      checkIn.value = fmt(dep);
      checkOut.min = fmt(dep);
      checkOut.value = fmt(ret);

      checkIn.addEventListener("change", () => {
        if (checkIn.value) {
          checkOut.min = checkIn.value;
          if (checkOut.value < checkIn.value) {
            checkOut.value = checkIn.value;
          }
        }
      });
    }

    if (clearBtn && resultsBox) {
      clearBtn.addEventListener("click", () => {
        resultsBox.classList.remove("is-visible");
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const chosenDest = destSelect ? destSelect.value : "all";
      const chosenType = typeSelect ? typeSelect.value : "all";
      const depVal = checkIn ? checkIn.value : "";
      const retVal = checkOut ? checkOut.value : "";

      let matches = SEARCH_INVENTORY.filter((item) => {
        const destMatch = chosenDest === "all" || item.dest === chosenDest;
        const typeMatch = chosenType === "all" || item.type === chosenType;
        return destMatch && typeMatch;
      });

      if (matches.length === 0) {
        matches = SEARCH_INVENTORY.filter(
          (item) => chosenDest === "all" || item.dest === chosenDest
        );
      }
      if (matches.length === 0) {
        matches = SEARCH_INVENTORY.slice(0, 3);
      }

      if (resultsSummary) {
        const destLabel =
          chosenDest === "all"
            ? "All Iconic Destinations"
            : destSelect.options[destSelect.selectedIndex].text;
        resultsSummary.textContent = `Showing ${matches.length} curated escape${matches.length > 1 ? "s" : ""} for ${destLabel} · ${guests} ${guests === 1 ? "Traveller" : "Travellers"}${depVal && retVal ? ` (${depVal} → ${retVal})` : ""}`;
      }

      if (resultsGrid) {
        resultsGrid.innerHTML = "";
        matches.slice(0, 3).forEach((item) => {
          const total = item.basePerGuest * guests;
          const card = document.createElement("article");
          card.className = "search-result-card";
          card.innerHTML = `
            <div>
              <div class="search-result-meta">${item.duration} · ${item.type}</div>
              <h3 class="search-result-title">${item.title}</h3>
              <p style="font-size:0.86rem;margin-top:0.35rem;opacity:0.82;">${item.inclusions}</p>
            </div>
            <div class="search-result-footer">
              <div class="search-result-price">$${total.toLocaleString()} <span style="font-size:0.75rem;font-weight:400;">total est.</span></div>
              <button type="button" class="btn btn-ocean btn-sm">Reserve Hold</button>
            </div>
          `;
          const btn = card.querySelector("button");
          btn.addEventListener("click", () => {
            modal.open({
              kicker: `Escapes Search · ${item.duration}`,
              title: item.title,
              description: `Tailored for ${guests} ${guests === 1 ? "traveller" : "travellers"}${depVal ? ` departing ${depVal}` : ""}.`,
              highlights: [
                `Inclusions: ${item.inclusions}`,
                "24/7 private STACKLY destination concierge included",
                "Flexible date modification up to 21 days prior",
              ],
              price: `$${total.toLocaleString()} total (${guests} × $${item.basePerGuest.toLocaleString()})`,
              secondaryHref: "404.html",
              secondaryLabel: "Full Package Details",
            });
          });
          resultsGrid.appendChild(card);
        });
      }

      if (resultsBox) {
        resultsBox.classList.add("is-visible");
        if (lenisInstance) {
          lenisInstance.scrollTo(resultsBox, { offset: -100, duration: 0.9 });
        }
      }
    });
  }

  /* ---------- 6. Shared Filter Pills (Hotels & Packages) ---------- */
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

  /* ---------- 7. Interactive Triggers (Destinations, Hotels, Packages, Offers, Guides) ---------- */
  function initInteractiveTriggers() {
    // Destinations Explore buttons
    document.querySelectorAll("[data-destination]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.destination;
        const info = CATALOG.destinations[key];
        if (info) {
          modal.open({
            ...info,
            secondaryHref: "404.html",
            secondaryLabel: "Open Destination Page",
          });
        }
      });
    });

    // Hotels & Packages & Offers generic detail triggers
    document.querySelectorAll("[data-modal-title]").forEach((btn) => {
      btn.addEventListener("click", () => {
        modal.open({
          kicker: btn.dataset.modalKicker || "STACKLY Concierge",
          title: btn.dataset.modalTitle,
          description: btn.dataset.modalDesc || "",
          highlights: (btn.dataset.modalHighlights || "").split("|").filter(Boolean),
          price: btn.dataset.modalPrice || "",
          secondaryHref: "404.html",
          secondaryLabel: "Full Property & Package Page",
        });
      });
    });

    // Travel Guides Reader
    document.querySelectorAll("[data-guide]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const info = CATALOG.guides[btn.dataset.guide];
        if (info) {
          modal.open({
            ...info,
            primaryLabel: "Save Itinerary to Concierge",
            secondaryHref: "404.html",
            secondaryLabel: "All Editorial Guides",
          });
        }
      });
    });

    // Flight & Transfer Finder (Section 04)
    const flightForm = document.getElementById("flightSearchForm");
    const flightOutput = document.getElementById("flightSearchOutput");
    if (flightForm && flightOutput) {
      flightForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const route = document.getElementById("flightRoute").value;
        const cabin = document.getElementById("flightCabin").value;
        const fares = {
          "Business Class": "$2,890",
          "First Class Suite": "$5,420",
          "Scenic Rail + Flight": "$2,190",
        };
        flightOutput.innerHTML = `<strong>${route}</strong> · ${cabin}: Curated fares from <strong>${fares[cabin] || "$2,490"}</strong> return including private chauffeur airport transfer & fast-track lounge pass.`;
        flightOutput.classList.add("is-visible");
      });
    }

    // Newsletter subscription (Section 10)
    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");
    const newsletterFeedback = document.getElementById("newsletterFeedback");
    if (newsletterForm && newsletterEmail && newsletterFeedback) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const val = newsletterEmail.value.trim();
        if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          newsletterFeedback.textContent = "Please enter a valid email address to receive our seasonal travel dispatches.";
          return;
        }
        newsletterFeedback.textContent = `Welcome aboard, ${val}. Your private seasonal edition & insider offers are confirmed.`;
        newsletterForm.reset();
      });
    }
  }

  /* ---------- Bootstrap ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    modal.init();
    initNavigation();
    initMotion();
    initBookingPanel();
    initFilterGroup("hotelFilters", ".hotel-card");
    initFilterGroup("packageFilters", ".package-card");
    initInteractiveTriggers();
  });
})();

