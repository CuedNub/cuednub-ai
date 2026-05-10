/*
  File    : hint.js
  Fungsi  : Mode System, Hint Mode, Scroll Keyboard, Mode Indicator,
            CSS Injection tema Cyan Outline (text + border only)
  Target  : Halaman arena.ai dan gemini.google.com di popup
  Lokasi  : js/hint.js
  Versi   : 0.9

  Tema Cyan Outline:
  - Background    : tidak diubah (ikut website asli)
  - Teks Utama    : #C4F1F9
  - Teks Sekunder : #97D9E1
  - Border        : #2D9CDB
  - Aksen         : #0BC5EA
*/

(() => {
  // ========================================
  // CSS INJECTION — CYAN OUTLINE
  // ========================================

  function injectTheme() {
    if (document.getElementById("cuednub-cyan-outline")) return;

    const style = document.createElement("style");
    style.id = "cuednub-cyan-outline";
    style.textContent = [
      "/* === TEXT === */",
      "html, body,",
      "div, section, article, aside, nav, main,",
      "header, footer, form, fieldset, details,",
      "summary, dialog, pre, code {",
      "  color: #C4F1F9 !important;",
      "}",
      "",
      "p, span, li, td, th, dt, dd, label, legend {",
      "  color: #C4F1F9 !important;",
      "}",
      "",
      "h1, h2, h3, h4, h5, h6 {",
      "  color: #C4F1F9 !important;",
      "}",
      "",
      "/* === SECONDARY TEXT === */",
      "[class*='secondary'],",
      "[class*='sub'],",
      "[class*='meta'],",
      "[class*='caption'],",
      "[class*='description'],",
      "[class*='label'],",
      "[class*='placeholder'],",
      "[class*='muted'] {",
      "  color: #97D9E1 !important;",
      "}",
      "",
      "/* === LINKS === */",
      "a, a:visited {",
      "  color: #0BC5EA !important;",
      "}",
      "",
      "a:hover {",
      "  color: #63E5FF !important;",
      "}",
      "",
      "/* === BORDERS === */",
      "div, section, article, aside, nav, main,",
      "header, footer, form, fieldset, details,",
      "summary, dialog, pre, code, table, tr, td, th, hr,",
      "input, textarea, select, button,",
      "[role='button'] {",
      "  border-color: #2D9CDB !important;",
      "}",
      "",
      "/* === BUTTONS === */",
      "button, [role='button'],",
      "input[type='button'],",
      "input[type='submit'],",
      "input[type='reset'] {",
      "  color: #0BC5EA !important;",
      "  border-color: #2D9CDB !important;",
      "}",
      "",
      "button:hover, [role='button']:hover {",
      "  color: #63E5FF !important;",
      "}",
      "",
      "/* === INPUTS === */",
      "input, textarea, select {",
      "  color: #C4F1F9 !important;",
      "  border-color: #2D9CDB !important;",
      "}",
      "",
      "input::placeholder, textarea::placeholder {",
      "  color: #97D9E1 !important;",
      "}",
      "",
      "input:focus, textarea:focus, select:focus {",
      "  border-color: #0BC5EA !important;",
      "  outline-color: #0BC5EA !important;",
      "}",
      "",
      "/* === SCROLLBAR === */",
      "::-webkit-scrollbar {",
      "  width: 8px !important;",
      "  height: 8px !important;",
      "}",
      "",
      "::-webkit-scrollbar-thumb {",
      "  background: #2D9CDB !important;",
      "  border-radius: 4px !important;",
      "}",
      "",
      "::-webkit-scrollbar-thumb:hover {",
      "  background: #0BC5EA !important;",
      "}",
      "",
      "/* === CUEDNUB UI PROTECTION === */",
      "#cuednub-mode-indicator {",
      "  z-index: 2147483646 !important;",
      "}",
      "",
      "#cuednub-hint-root {",
      "  z-index: 2147483647 !important;",
      "}",
      "",
      ".cuednub-hint-marker {",
      "  background: #facc15 !important;",
      "  color: #111827 !important;",
      "  border: 1px solid #111827 !important;",
      "  border-radius: 6px !important;",
      "  font: bold 12px/1 Arial, sans-serif !important;",
      "  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25) !important;",
      "  pointer-events: none !important;",
      "}",
      "",
      "#cuednub-hint-status {",
      "  background: rgba(17, 24, 39, 0.95) !important;",
      "  color: #ffffff !important;",
      "  border: 1px solid rgba(255, 255, 255, 0.15) !important;",
      "  border-radius: 8px !important;",
      "  font: 12px/1.4 Arial, sans-serif !important;",
      "  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25) !important;",
      "}"
    ].join("\n");

    document.documentElement.appendChild(style);
  }

  injectTheme();

  const themeObserver = new MutationObserver(() => {
    if (!document.getElementById("cuednub-cyan-outline")) {
      injectTheme();
    }
  });

  themeObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // ========================================
  // KONSTANTA
  // ========================================

  const HINT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const CLICKABLE_SELECTOR = [
    "a[href]",
    "button",
    "[role='button']",
    "[role='link']",
    "[role='menuitem']",
    "[role='tab']",
    "[role='option']",
    "input[type='button']",
    "input[type='submit']",
    "input[type='reset']",
    "input[type='checkbox']",
    "input[type='radio']",
    "input[type='text']",
    "input[type='email']",
    "input[type='password']",
    "input[type='search']",
    "input[type='url']",
    "input[type='number']",
    "input[type='tel']",
    "input:not([type])",
    "textarea",
    "select",
    "[contenteditable='true']",
    "[contenteditable='']",
    "[onclick]",
    "[tabindex]",
    "summary"
  ].join(",");

  const SCROLL_STEP = 80;

  const MODE = {
    NORMAL: "NORMAL",
    INSERT: "INSERT",
    HINT: "HINT"
  };

  const MODE_COLORS = {
    NORMAL: { bg: "#22c55e", text: "#ffffff" },
    INSERT: { bg: "#eab308", text: "#111827" },
    HINT: { bg: "#3b82f6", text: "#ffffff" }
  };

  // ========================================
  // STATE
  // ========================================

  let currentMode = MODE.NORMAL;
  let hintBuffer = "";
  let hints = [];
  let overlayRoot = null;
  let indicatorBox = null;
  let statusBox = null;
  let gPending = false;
  let gTimer = null;
  let cachedScrollTarget = null;

  // ========================================
  // UTILITAS
  // ========================================

  function isTypingTarget(el) {
    if (!el) return false;

    const tag = el.tagName ? el.tagName.toLowerCase() : "";
    if (tag === "input") {
      const type = (el.type || "").toLowerCase();
      const nonTyping = ["button", "submit", "reset", "checkbox", "radio", "range", "file", "image"];
      return !nonTyping.includes(type);
    }
    if (tag === "textarea" || tag === "select") return true;
    if (el.isContentEditable) return true;

    const editableParent = el.closest && el.closest("[contenteditable='true'], [contenteditable='']");
    return Boolean(editableParent);
  }

  function isVisibleElement(el) {
    if (!(el instanceof HTMLElement)) return false;

    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    if (parseFloat(style.opacity) === 0) return false;

    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    if (rect.bottom < 0 || rect.right < 0) return false;
    if (rect.top > window.innerHeight || rect.left > window.innerWidth) return false;

    return true;
  }

  // ========================================
  // SCROLL TARGET DETECTION
  // ========================================

  function isScrollable(el) {
    if (!el || el === document.documentElement || el === document.body) return false;

    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    const hasOverflow = overflowY === "auto" || overflowY === "scroll";

    if (!hasOverflow) return false;

    return el.scrollHeight > el.clientHeight;
  }

  function findScrollTarget() {
    if (cachedScrollTarget && document.contains(cachedScrollTarget) && isScrollable(cachedScrollTarget)) {
      return cachedScrollTarget;
    }

    const candidates = document.querySelectorAll("main, [role='main'], .main, #main, [class*='chat'], [class*='scroll'], [class*='content'], [class*='message'], [class*='conversation']");

    for (const el of candidates) {
      if (isScrollable(el)) {
        cachedScrollTarget = el;
        return el;
      }
    }

    const allElements = document.querySelectorAll("div, section, article, aside, nav");
    let bestTarget = null;
    let bestArea = 0;

    for (const el of allElements) {
      if (!isScrollable(el)) continue;

      const rect = el.getBoundingClientRect();
      const area = rect.width * rect.height;

      if (area > bestArea) {
        bestArea = area;
        bestTarget = el;
      }
    }

    if (bestTarget) {
      cachedScrollTarget = bestTarget;
      return bestTarget;
    }

    const fallback = document.scrollingElement || document.documentElement;
    if (fallback.scrollHeight > fallback.clientHeight) {
      return fallback;
    }

    return fallback;
  }

  function getScrollPage() {
    const target = findScrollTarget();
    return Math.floor((target.clientHeight || window.innerHeight) / 2);
  }

  // ========================================
  // MODE INDICATOR
  // ========================================

  function ensureIndicator() {
    if (indicatorBox) return;

    indicatorBox = document.createElement("div");
    indicatorBox.id = "cuednub-mode-indicator";
    indicatorBox.style.position = "fixed";
    indicatorBox.style.bottom = "12px";
    indicatorBox.style.right = "12px";
    indicatorBox.style.padding = "6px 14px";
    indicatorBox.style.borderRadius = "8px";
    indicatorBox.style.font = "bold 13px/1.4 Arial, sans-serif";
    indicatorBox.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.25)";
    indicatorBox.style.zIndex = "2147483646";
    indicatorBox.style.pointerEvents = "none";
    indicatorBox.style.transition = "background 0.2s, color 0.2s";
    document.documentElement.appendChild(indicatorBox);
  }

  function updateIndicator() {
    ensureIndicator();

    const colors = MODE_COLORS[currentMode];
    indicatorBox.textContent = "[ " + currentMode + " ]";
    indicatorBox.style.background = colors.bg;
    indicatorBox.style.color = colors.text;
  }

  // ========================================
  // MODE SWITCHING
  // ========================================

  function switchMode(newMode) {
    if (currentMode === MODE.HINT && newMode !== MODE.HINT) {
      clearHints();
    }

    currentMode = newMode;
    hintBuffer = "";
    gPending = false;

    if (gTimer) {
      clearTimeout(gTimer);
      gTimer = null;
    }

    updateIndicator();
  }

  // ========================================
  // SCROLL
  // ========================================

  function scrollBy(amount) {
    const target = findScrollTarget();
    target.scrollBy({ top: amount, behavior: "smooth" });
  }

  function scrollToTop() {
    const target = findScrollTarget();
    target.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToBottom() {
    const target = findScrollTarget();
    target.scrollTo({ top: target.scrollHeight, behavior: "smooth" });
  }

  // ========================================
  // HINT OVERLAY
  // ========================================

  function ensureOverlay() {
    if (!overlayRoot) {
      overlayRoot = document.createElement("div");
      overlayRoot.id = "cuednub-hint-root";
      overlayRoot.style.position = "fixed";
      overlayRoot.style.inset = "0";
      overlayRoot.style.pointerEvents = "none";
      overlayRoot.style.zIndex = "2147483647";
      document.documentElement.appendChild(overlayRoot);
    }

    if (!statusBox) {
      statusBox = document.createElement("div");
      statusBox.id = "cuednub-hint-status";
      statusBox.style.position = "fixed";
      statusBox.style.top = "12px";
      statusBox.style.right = "12px";
      statusBox.style.padding = "8px 10px";
      statusBox.style.background = "rgba(17, 24, 39, 0.95)";
      statusBox.style.color = "#ffffff";
      statusBox.style.border = "1px solid rgba(255, 255, 255, 0.15)";
      statusBox.style.borderRadius = "8px";
      statusBox.style.font = "12px/1.4 Arial, sans-serif";
      statusBox.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.25)";
      statusBox.style.whiteSpace = "nowrap";
      overlayRoot.appendChild(statusBox);
    }
  }

  function clearHints() {
    hintBuffer = "";
    hints = [];

    if (overlayRoot) {
      overlayRoot.remove();
      overlayRoot = null;
      statusBox = null;
    }
  }

  function updateHintStatus(message) {
    ensureOverlay();
    if (statusBox) {
      statusBox.textContent = message;
    }
  }

  function createMarker(label, rect) {
    const marker = document.createElement("div");
    marker.className = "cuednub-hint-marker";
    marker.textContent = label;
    marker.style.position = "fixed";
    marker.style.left = Math.max(4, rect.left) + "px";
    marker.style.top = Math.max(4, rect.top - 10) + "px";
    marker.style.padding = "2px 6px";
    marker.style.background = "#facc15";
    marker.style.color = "#111827";
    marker.style.border = "1px solid #111827";
    marker.style.borderRadius = "6px";
    marker.style.font = "bold 12px/1 Arial, sans-serif";
    marker.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.25)";
    marker.style.pointerEvents = "none";
    return marker;
  }

  // ========================================
  // HINT MODE
  // ========================================

  function getClickableElements() {
    const nodes = Array.from(document.querySelectorAll(CLICKABLE_SELECTOR));
    const filtered = [];
    const seen = new Set();

    for (const el of nodes) {
      if (!(el instanceof HTMLElement)) continue;
      if (seen.has(el)) continue;
      if (!isVisibleElement(el)) continue;
      seen.add(el);
      filtered.push(el);
    }

    filtered.sort((a, b) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      if (Math.abs(ra.top - rb.top) > 8) return ra.top - rb.top;
      return ra.left - rb.left;
    });

    return filtered;
  }

  function makeHintLabel(index) {
    let value = index + 1;
    let label = "";

    while (value > 0) {
      value--;
      label = HINT_CHARS[value % HINT_CHARS.length] + label;
      value = Math.floor(value / HINT_CHARS.length);
    }

    return label;
  }

  function renderHints() {
    ensureOverlay();

    overlayRoot.querySelectorAll(".cuednub-hint-marker").forEach((n) => n.remove());

    let visibleCount = 0;

    for (const hint of hints) {
      const isMatch = !hintBuffer || hint.label.startsWith(hintBuffer);
      hint.visible = isMatch;
      if (!isMatch) continue;

      const rect = hint.element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) continue;

      hint.marker = createMarker(hint.label, rect);
      overlayRoot.appendChild(hint.marker);
      visibleCount++;
    }

    const statusText = hintBuffer
      ? "HINT: " + hintBuffer + " (" + visibleCount + " cocok) | Esc batal"
      : "HINT aktif (" + visibleCount + " target) | ketik label | Esc batal";

    updateHintStatus(statusText);
  }

  function activateHintMode() {
    const elements = getClickableElements();

    hints = elements.map((element, index) => ({
      label: makeHintLabel(index),
      element,
      marker: null,
      visible: true
    }));

    hintBuffer = "";

    if (hints.length === 0) {
      ensureOverlay();
      updateHintStatus("HINT: tidak ada target terlihat");
      window.setTimeout(() => {
        clearHints();
        switchMode(MODE.NORMAL);
      }, 1200);
      return;
    }

    switchMode(MODE.HINT);
    renderHints();
  }

  function clickHint(targetHint) {
    if (!targetHint || !(targetHint.element instanceof HTMLElement)) return;

    const element = targetHint.element;
    switchMode(MODE.NORMAL);

    try {
      element.focus({ preventScroll: true });
    } catch (_) {}

    try {
      element.click();
    } catch (_) {
      element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    }

    if (isTypingTarget(element)) {
      switchMode(MODE.INSERT);
    }
  }

  function handleHintKey(key) {
    hintBuffer += key;

    const exactMatch = hints.find((hint) => hint.label === hintBuffer);
    if (exactMatch) {
      clickHint(exactMatch);
      return;
    }

    const partialMatches = hints.filter((hint) => hint.label.startsWith(hintBuffer));

    if (partialMatches.length === 0) {
      hintBuffer = hintBuffer.slice(0, -1);
      updateHintStatus("HINT: \"" + (hintBuffer || "-") + "\" tidak cocok | Esc batal");
      renderHints();
      return;
    }

    renderHints();
  }

  // ========================================
  // INSERT MODE DETECTION
  // ========================================

  function setupInsertDetection() {
    document.addEventListener("focusin", (event) => {
      if (currentMode === MODE.HINT) return;

      if (isTypingTarget(event.target)) {
        switchMode(MODE.INSERT);
      }
    }, true);

    document.addEventListener("focusout", (event) => {
      if (currentMode !== MODE.INSERT) return;

      window.setTimeout(() => {
        const active = document.activeElement;
        if (!isTypingTarget(active)) {
          switchMode(MODE.NORMAL);
        }
      }, 50);
    }, true);
  }

  // ========================================
  // KEYBOARD HANDLER
  // ========================================

  function onKeyDown(event) {
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    if (event.key === "Escape") {
      if (currentMode === MODE.HINT) {
        event.preventDefault();
        event.stopPropagation();
        switchMode(MODE.NORMAL);
        return;
      }

      if (currentMode === MODE.INSERT) {
        event.preventDefault();
        event.stopPropagation();

        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }

        switchMode(MODE.NORMAL);
        return;
      }

      return;
    }

    if (currentMode === MODE.INSERT) return;

    if (currentMode === MODE.HINT) {
      if (event.key === "Backspace") {
        event.preventDefault();
        event.stopPropagation();

        if (hintBuffer.length > 0) {
          hintBuffer = hintBuffer.slice(0, -1);
          renderHints();
        } else {
          switchMode(MODE.NORMAL);
        }
        return;
      }

      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        handleHintKey(event.key.toUpperCase());
      }
      return;
    }

    if (currentMode === MODE.NORMAL) {
      const key = event.key;

      if (key.toLowerCase() === "f") {
        event.preventDefault();
        event.stopPropagation();
        activateHintMode();
        return;
      }

      if (key === "j") {
        event.preventDefault();
        event.stopPropagation();
        scrollBy(SCROLL_STEP);
        return;
      }

      if (key === "k") {
        event.preventDefault();
        event.stopPropagation();
        scrollBy(-SCROLL_STEP);
        return;
      }

      if (key === "d") {
        event.preventDefault();
        event.stopPropagation();
        scrollBy(getScrollPage());
        return;
      }

      if (key === "u") {
        event.preventDefault();
        event.stopPropagation();
        scrollBy(-getScrollPage());
        return;
      }

      if (key === "G") {
        event.preventDefault();
        event.stopPropagation();
        scrollToBottom();
        return;
      }

      if (key === "g") {
        event.preventDefault();
        event.stopPropagation();

        if (gPending) {
          clearTimeout(gTimer);
          gPending = false;
          gTimer = null;
          scrollToTop();
        } else {
          gPending = true;
          gTimer = setTimeout(() => {
            gPending = false;
            gTimer = null;
          }, 500);
        }
        return;
      }
    }
  }

  // ========================================
  // REFRESH HINT POSITIONS
  // ========================================

  function refreshHintPositions() {
    if (currentMode !== MODE.HINT) return;
    renderHints();
  }

  // ========================================
  // CACHE INVALIDATION
  // ========================================

  function setupCacheInvalidation() {
    const observer = new MutationObserver(() => {
      cachedScrollTarget = null;
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // ========================================
  // INIT
  // ========================================

  function init() {
    switchMode(MODE.NORMAL);
    setupInsertDetection();
    setupCacheInvalidation();

    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("resize", refreshHintPositions, true);
    window.addEventListener("scroll", refreshHintPositions, true);
  }

  init();
})();
