// assets/js/modal.js
(() => {
  "use strict";

  /**
   * Usage (example)
   *  - Open button:  <button data-modal-open="contact">詳細</button>
   *  - Modal root:   <div class="modal" data-modal="contact"> ... </div>
   *  - Close button: <button data-modal-close>閉じる</button>
   *
   * Recommended modal structure (minimal):
   * <div class="modal" data-modal="contact" aria-hidden="true">
   *   <div class="modal__overlay" data-modal-overlay></div>
   *   <div class="modal__panel" role="dialog" aria-modal="true" aria-label="Contact">
   *     ...
   *     <button data-modal-close>閉じる</button>
   *   </div>
   * </div>
   */

  const state = {
    activeModalRoot: null,
    lastFocusedEl: null,
    unlockScroll: null,
  };

  const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(",");

  function $(sel, root = document) {
    return root.querySelector(sel);
  }
  function $all(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function lockBodyScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const body = document.body;

    // Prevent layout shift due to scrollbar disappearance
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      const y = Math.abs(parseInt(body.style.top || "0", 10)) || 0;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.paddingRight = "";
      window.scrollTo(0, y);
    };
  }

  function setAriaHiddenExcept(modalRoot) {
    // Hide main content from screen readers while modal is open
    // You can mark your main container with <main id="app"> ... </main>
    // This function will set aria-hidden on siblings of modalRoot.
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach((el) => {
      if (el === modalRoot) return;
      // Don't mess with script tags etc.
      if (el.tagName === "SCRIPT") return;
      el.setAttribute("aria-hidden", "true");
    });

    return () => {
      bodyChildren.forEach((el) => {
        if (el === modalRoot) return;
        if (el.tagName === "SCRIPT") return;
        el.removeAttribute("aria-hidden");
      });
    };
  }

  let restoreAria = null;

  function getFirstFocusable(modalRoot) {
    const panel = $(".modal__panel", modalRoot) || modalRoot;
    const focusables = $all(FOCUSABLE_SELECTOR, panel)
      .filter(el => el.offsetParent !== null); // visible-ish
    return focusables[0] || panel;
  }

  function trapFocus(e) {
    if (!state.activeModalRoot) return;

    if (e.key !== "Tab") return;

    const panel = $(".modal__panel", state.activeModalRoot) || state.activeModalRoot;
    const focusables = $all(FOCUSABLE_SELECTOR, panel)
      .filter(el => el.offsetParent !== null);

    if (focusables.length === 0) {
      e.preventDefault();
      panel.focus?.();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey) {
      if (active === first || !panel.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function openModalById(modalId, openerEl = null) {
    const modalRoot = document.querySelector(`[data-modal="${CSS.escape(modalId)}"]`);
    if (!modalRoot) return;

    // Close currently open modal (single modal policy)
    if (state.activeModalRoot) closeModal();

    state.activeModalRoot = modalRoot;
    state.lastFocusedEl = openerEl || document.activeElement;

    modalRoot.classList.add("is-open");
    modalRoot.setAttribute("aria-hidden", "false");

    // Scroll lock
    state.unlockScroll = lockBodyScroll();

    // aria-hidden background
    restoreAria = setAriaHiddenExcept(modalRoot);

    // Focus handling
    const panel = $(".modal__panel", modalRoot) || modalRoot;
    // Ensure panel can be focused
    if (!panel.hasAttribute("tabindex")) panel.setAttribute("tabindex", "-1");

    const focusTarget = getFirstFocusable(modalRoot);
    // Delay focus until after paint
    requestAnimationFrame(() => {
      focusTarget.focus?.();
    });

    // Listeners
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("keydown", trapFocus, true);
  }

  function closeModal() {
    const modalRoot = state.activeModalRoot;
    if (!modalRoot) return;

    modalRoot.classList.remove("is-open");
    modalRoot.setAttribute("aria-hidden", "true");

    // restore aria-hidden
    if (typeof restoreAria === "function") {
      restoreAria();
      restoreAria = null;
    }

    // unlock scroll
    if (typeof state.unlockScroll === "function") {
      state.unlockScroll();
      state.unlockScroll = null;
    }

    // remove listeners
    document.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("keydown", trapFocus, true);

    // restore focus
    const backTo = state.lastFocusedEl;
    state.activeModalRoot = null;
    state.lastFocusedEl = null;

    requestAnimationFrame(() => {
      backTo?.focus?.();
    });
  }

  function onKeyDown(e) {
    if (!state.activeModalRoot) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
    }
  }

  function onClick(e) {
    const openBtn = e.target.closest("[data-modal-open]");
    if (openBtn) {
      const id = openBtn.getAttribute("data-modal-open");
      if (id) openModalById(id, openBtn);
      return;
    }

    if (!state.activeModalRoot) return;

    const closeBtn = e.target.closest("[data-modal-close]");
    if (closeBtn) {
      closeModal();
      return;
    }

    // overlay click to close
    const overlay = e.target.closest("[data-modal-overlay]");
    if (overlay && state.activeModalRoot.contains(overlay)) {
      closeModal();
      return;
    }
  }

  // Init: global event delegation
  document.addEventListener("click", onClick, false);

  // Optional: allow programmatic API
  window.PoyonModal = {
    open: openModalById,
    close: closeModal,
  };
})();