// ── Smooth scroll on nav click + active highlight ───────────
const navbar = document.getElementById("navbar");
const navClose = document.getElementById("navClose");
const navLinks = document.querySelectorAll(".nav-link");
const sideLinks = document.querySelectorAll(".sidebar-link");
const scrollEl = document.getElementById("scrollWrapper");
// Only sections inside the scroll-wrapper (not #home overlay)
const sections = scrollEl.querySelectorAll(".scroll-section");

function setActive(id) {
  navLinks.forEach((l) =>
    l.classList.toggle("active", l.getAttribute("href") === "#" + id),
  );
  sideLinks.forEach((l) =>
    l.classList.toggle("active", l.getAttribute("href") === "#" + id),
  );
}

// ── Home overlay show/hide ───────────────────────────────
const homeOverlay = document.getElementById("home");

function showHome() {
  homeOverlay.classList.remove("hidden");
  scrollEl.style.visibility = "hidden";
  setActive("home");
}
function hideHome() {
  homeOverlay.classList.add("hidden");
  scrollEl.style.visibility = "visible";
}

// Show home on initial load
showHome();

// Scrolling down on home overlay → go to Service
homeOverlay.addEventListener(
  "wheel",
  (e) => {
    if (e.deltaY > 0) {
      goTo("service");
    }
  },
  { passive: true },
);

// ── Navigate to a section inside scroll-wrapper ──────────
function goTo(id) {
  hideHome();
  setActive(id);
  const target = document.getElementById(id);
  if (target) {
    scrollEl.scrollTo({ top: target.offsetTop, behavior: "smooth" });
  }
}

// Click — top nav
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const id = link.getAttribute("href").replace("#", "");
    if (id === "home") {
      showHome();
    } else {
      goTo(id);
    }
  });
  link.addEventListener(
    "mousedown",
    () => (link.style.transform = "translateY(3px)"),
  );
  link.addEventListener("mouseup", () => (link.style.transform = ""));
  link.addEventListener("mouseleave", () => (link.style.transform = ""));
});

// Click — sidebar
sideLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const id = link.getAttribute("href").replace("#", "");
    if (id === "home") {
      showHome();
    } else {
      goTo(id);
    }
  });
});

// Scroll spy — updates active link while scrolling (only when home is hidden)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && scrollEl.style.visibility !== "hidden") {
        setActive(entry.target.id);
      }
    });
  },
  { root: scrollEl, threshold: 0.4 },
);
sections.forEach((s) => observer.observe(s));

// ── Show Home when scrolling back to top ─────────────────
scrollEl.addEventListener("scroll", () => {
  if (scrollEl.scrollTop === 0) {
    showHome();
  }
});

// ── Sidebar close → show top nav ───────────────────────────
const sidebar = document.getElementById("sidebar");
const sidebarClose = document.getElementById("sidebarClose");
const sidebarReopen = document.getElementById("sidebarReopen");

sidebarClose.addEventListener("click", () => {
  sidebar.classList.add("collapsed");
  navbar.classList.add("visible");
  scrollEl.classList.add("top-nav-visible");
  sidebarReopen.classList.add("visible");
  fab.classList.add("nav-visible");
  if (homeOverlay) {
    homeOverlay.style.left = "0";
    homeOverlay.style.top = "64px";
  }
});

sidebarReopen.addEventListener("click", () => {
  sidebar.classList.remove("collapsed");
  navbar.classList.remove("visible");
  scrollEl.classList.remove("top-nav-visible");
  sidebarReopen.classList.remove("visible");
  fab.classList.remove("nav-visible");
  if (homeOverlay) {
    homeOverlay.style.left = "190px";
    homeOverlay.style.top = "0";
  }
});

// ── Top nav close → show sidebar ───────────────────────────
navClose.addEventListener("click", () => {
  navbar.classList.add("collapsed");
  navbar.classList.remove("visible");
  scrollEl.classList.remove("top-nav-visible");
  sidebar.classList.remove("collapsed");
  sidebarReopen.classList.remove("visible");
  fab.classList.remove("nav-visible");
  if (homeOverlay) {
    homeOverlay.style.left = "190px";
    homeOverlay.style.top = "0";
  }
});

// ── Settings Panel ──────────────────────────────────────────
const fab = document.getElementById("settingsFab");
const panel = document.getElementById("settingsPanel");
const spClose = document.getElementById("spClose");
const spReset = document.getElementById("spReset");
const overlay = document.querySelector(".overlay");

fab.addEventListener("click", () => {
  panel.classList.toggle("open");
  const isOpen = panel.classList.contains("open");
  fab.style.right = isOpen ? "344px" : "24px";
  if (homeOverlay) homeOverlay.style.right = isOpen ? "320px" : "0";
  scrollEl.classList.toggle("panel-open", isOpen);
});
spClose.addEventListener("click", () => {
  panel.classList.remove("open");
  fab.style.right = "24px";
  if (homeOverlay) homeOverlay.style.right = "0";
  scrollEl.classList.remove("panel-open");
});

function val(id, suffix, displayId) {
  const el = document.getElementById(id);
  const dEl = document.getElementById(displayId);
  el.addEventListener("input", () => {
    dEl.textContent = el.value + suffix;
    applySettings();
  });
}
val("brightness", "%", "brightnessVal");
val("overlayOp", "%", "overlayVal");
val("fontSize", "px", "fontSizeVal");
val("cardBlur", "px", "cardBlurVal");
val("cardRadius", "px", "cardRadiusVal");
val("glowIntensity", "%", "glowVal");

["textColor", "accentColor", "cardBg"].forEach((id) => {
  document.getElementById(id).addEventListener("input", (e) => {
    document.getElementById(id + "Val").textContent = e.target.value;
    applySettings();
  });
});
document.getElementById("fontFamily").addEventListener("change", applySettings);

const navThemes = {
  purple:
    "linear-gradient(180deg,rgba(72,52,160,0.97) 0%,rgba(88,64,185,0.97) 40%,rgba(110,80,200,0.95) 100%)",
  cyan: "linear-gradient(180deg,rgba(0,150,180,0.97) 0%,rgba(0,188,212,0.97) 40%,rgba(0,229,255,0.9) 100%)",
  rose: "linear-gradient(180deg,rgba(180,30,80,0.97) 0%,rgba(220,50,100,0.97) 40%,rgba(255,80,120,0.9) 100%)",
  dark: "linear-gradient(180deg,rgba(20,20,30,0.98) 0%,rgba(30,30,45,0.98) 40%,rgba(40,40,60,0.97) 100%)",
};
document.querySelectorAll(".theme-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".theme-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    // apply to both top navbar AND sidebar
    navbar.style.background = navThemes[btn.dataset.nav];
    sidebar.style.background = navThemes[btn.dataset.nav];
  });
});

function applySettings() {
  const brightness = document.getElementById("brightness").value;
  const overlayOp = document.getElementById("overlayOp").value;
  const textColor = document.getElementById("textColor").value;
  const accentColor = document.getElementById("accentColor").value;
  const cardBgColor = document.getElementById("cardBg").value;
  const fontSize = document.getElementById("fontSize").value;
  const fontFamily = document.getElementById("fontFamily").value;
  const cardBlur = document.getElementById("cardBlur").value;
  const cardRadius = document.getElementById("cardRadius").value;
  const glowIntensity = document.getElementById("glowIntensity").value;
  const glowAlpha = (glowIntensity / 100).toFixed(2);

  // ── Background brightness ──
  const bgCanvas = document.getElementById("bgCanvas");
  if (bgCanvas) bgCanvas.style.filter = `brightness(${brightness}%)`;

  // ── Overlay darkness ──
  overlay.style.background = `rgba(0,0,0,${overlayOp / 100})`;

  // ── Font family — whole page ──
  document.body.style.fontFamily = fontFamily;

  // ── Font size — all body text across every section ──
  document
    .querySelectorAll(
      ".profile-bio, .about-text p, .ab-bio, .ct-intro, .ct-info-value," +
        ".svc-desc, .pw-card-desc, .hc-bio, .page-subtitle, .services-subtitle",
    )
    .forEach((el) => {
      el.style.fontSize = fontSize + "px";
    });

  // ── Text color — all headings & titles ──
  document
    .querySelectorAll(
      ".profile-name, .page-title, .hc-name, .ab-name, .ct-greeting," +
        ".ct-form-title, .services-title, .pw-title, .ab-toolkit-title," +
        ".join-title, .customers-tagline",
    )
    .forEach((el) => {
      el.style.color = textColor;
      el.style.webkitTextFillColor = textColor;
      el.style.backgroundImage = "none";
    });

  // ── Card backgrounds — all card-like containers ──
  const cardShadow = `0 25px 80px rgba(0,0,0,0.55), 0 0 ${glowIntensity}px rgba(103,58,183,${glowAlpha})`;
  document
    .querySelectorAll(
      ".photo-card, .page-card, .home-card, .ct-wrap, .ab-toolkit," +
        ".svc-card, .pw-card, .worked-card, .hc-stat",
    )
    .forEach((card) => {
      card.style.background = cardBgColor;
      card.style.borderRadius = cardRadius + "px";
      card.style.backdropFilter = `blur(${cardBlur}px)`;
      card.style.boxShadow = cardShadow;
    });

  // ── Accent color — buttons, tags, icons ──
  document
    .querySelectorAll(
      ".skill-tag, .social-btn, .submit-btn, .ct-submit," +
        ".ab-connect-btn, .hc-tags span, .svc-tag, .pw-btn-primary",
    )
    .forEach((el) => {
      el.style.background = accentColor;
    });

  // ── Accent color — icon boxes ──
  document.querySelectorAll(".ct-info-icon, .svc-icon").forEach((el) => {
    el.style.background = accentColor + "22";
    el.style.borderColor = accentColor + "55";
    el.style.color = accentColor;
  });
}

spReset.addEventListener("click", () => {
  const defs = {
    brightness: 100,
    overlayOp: 62,
    fontSize: 15,
    cardBlur: 0,
    cardRadius: 30,
    glowIntensity: 45,
  };
  Object.entries(defs).forEach(
    ([id, v]) => (document.getElementById(id).value = v),
  );
  document.getElementById("brightnessVal").textContent = "100%";
  document.getElementById("overlayVal").textContent = "62%";
  document.getElementById("fontSizeVal").textContent = "15px";
  document.getElementById("cardBlurVal").textContent = "0px";
  document.getElementById("cardRadiusVal").textContent = "30px";
  document.getElementById("glowVal").textContent = "45%";
  document.getElementById("textColor").value = "#1a1a2e";
  document.getElementById("accentColor").value = "#673ab7";
  document.getElementById("cardBg").value = "#ffffff";
  document.getElementById("textColorVal").textContent = "#1a1a2e";
  document.getElementById("accentColorVal").textContent = "#673ab7";
  document.getElementById("cardBgVal").textContent = "#ffffff";
  document.getElementById("fontFamily").value = "'Inter',sans-serif";

  // reset canvas brightness
  const bgCanvas = document.getElementById("bgCanvas");
  if (bgCanvas) bgCanvas.style.filter = "";
  overlay.style.background = "";

  // reset all targeted elements
  document
    .querySelectorAll(
      ".photo-card, .page-card, .home-card, .ct-wrap, .ab-toolkit," +
        ".svc-card, .pw-card, .worked-card, .hc-stat",
    )
    .forEach((c) => {
      c.style.background = "";
      c.style.borderRadius = "";
      c.style.backdropFilter = "";
      c.style.boxShadow = "";
    });

  document
    .querySelectorAll(
      ".profile-name, .page-title, .hc-name, .ab-name, .ct-greeting," +
        ".ct-form-title, .services-title, .pw-title, .ab-toolkit-title," +
        ".join-title, .customers-tagline",
    )
    .forEach((el) => {
      el.style.color = "";
      el.style.webkitTextFillColor = "";
      el.style.backgroundImage = "";
    });

  document
    .querySelectorAll(
      ".profile-bio, .about-text p, .ab-bio, .ct-intro, .ct-info-value," +
        ".svc-desc, .pw-card-desc, .hc-bio, .page-subtitle, .services-subtitle",
    )
    .forEach((el) => {
      el.style.fontSize = "";
    });

  document
    .querySelectorAll(
      ".skill-tag, .social-btn, .submit-btn, .ct-submit," +
        ".ab-connect-btn, .hc-tags span, .svc-tag, .pw-btn-primary",
    )
    .forEach((el) => {
      el.style.background = "";
    });

  document.querySelectorAll(".ct-info-icon, .svc-icon").forEach((el) => {
    el.style.background = "";
    el.style.borderColor = "";
    el.style.color = "";
  });

  document.body.style.fontFamily = "";

  // reset nav themes
  document
    .querySelectorAll(".theme-btn")
    .forEach((b) => b.classList.remove("active"));
  document.querySelector('[data-nav="purple"]').classList.add("active");
  navbar.style.background = "";
  sidebar.style.background = "";
});

// ── Dark / Light mode toggle ─────────────────────────────
document.getElementById("modeDark").addEventListener("click", () => {
  document.body.classList.remove("light-mode");
  document.getElementById("modeDark").classList.add("active");
  document.getElementById("modeLight").classList.remove("active");
});
document.getElementById("modeLight").addEventListener("click", () => {
  document.body.classList.add("light-mode");
  document.getElementById("modeLight").classList.add("active");
  document.getElementById("modeDark").classList.remove("active");
});

// ── Portfolio Slider ─────────────────────────────────────
(function () {
  const pages = document.querySelectorAll(".pw-page");
  const dots = document.querySelectorAll(".pw-dot");
  const btnPrev = document.getElementById("pwPrev");
  const btnNext = document.getElementById("pwNext");
  if (!btnPrev || !btnNext) return;
  let current = 0;
  const total = pages.length;

  function goTo(idx) {
    pages[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (idx + total) % total;
    pages[current].classList.add("active");
    dots[current].classList.add("active");
  }

  btnNext.addEventListener("click", () => goTo(current + 1));
  btnPrev.addEventListener("click", () => goTo(current - 1));
  dots.forEach((dot) =>
    dot.addEventListener("click", () => goTo(+dot.dataset.page)),
  );
})();

// ── About page — Connect with Me button ─────────────────
const abConnectBtn = document.getElementById("abConnectBtn");
if (abConnectBtn) {
  abConnectBtn.addEventListener("click", (e) => {
    e.preventDefault();
    goTo("contact");
  });
}

// ── Home card buttons ────────────────────────────────────
const hcHireBtn = document.getElementById("hcHireBtn");
const hcWorkBtn = document.getElementById("hcWorkBtn");
if (hcHireBtn) hcHireBtn.addEventListener("click", () => goTo("contact"));
if (hcWorkBtn) hcWorkBtn.addEventListener("click", () => goTo("portfolio"));

// ── About page — skill bar animation on scroll into view ─
(function () {
  const skills = document.querySelectorAll(".ab-skill");
  if (!skills.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pct = entry.target.dataset.pct;
          const fill = entry.target.querySelector(".ab-skill-fill");
          if (fill) fill.style.width = pct + "%";
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );
  skills.forEach((s) => io.observe(s));
})();

// ── Join page — happy photo popup on social hover ────────
const happyPopup = document.getElementById("joinHappyPopup");
let hideTimer;
document.querySelectorAll(".join-item").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    clearTimeout(hideTimer);
    happyPopup.classList.add("show");
  });
  item.addEventListener("mouseleave", () => {
    hideTimer = setTimeout(() => happyPopup.classList.remove("show"), 400);
  });
});
// --- Image Switcher for the Right Panel ---
(function () {
  const sidePhoto = document.querySelector(".home-photo-panel img");

  // 1. List your images here
  const myImages = ["ph.jpg", "ph2.jpg", "ph3.jpg"];

  let currentImgIndex = 0;

  if (sidePhoto) {
    sidePhoto.addEventListener("click", function () {
      // Move to the next image index
      currentImgIndex = (currentImgIndex + 1) % myImages.length;

      // Apply a quick fade out effect
      sidePhoto.style.opacity = "0";

      // Wait for fade out, then change source and fade back in
      setTimeout(() => {
        sidePhoto.src = myImages[currentImgIndex];
        sidePhoto.style.opacity = "1";
      }, 200);
    });
  }
})();
