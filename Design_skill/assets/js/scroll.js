/**
 * Horizontal scroll enhancer (Apple-like)
 * - When the pointer is over the horizontal scroller, mouse wheel scrolls horizontally.
 * - Trackpad horizontal gestures still work naturally.
 * - Only activates when horizontal scroll is actually possible.
 */

(function () {
  const scrollers = document.querySelectorAll("[data-horizontal-scroll]");
  if (!scrollers.length) return;

  // Prefer smooth behavior when snapping
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  scrollers.forEach((el) => {
    // Ensure element can be focused for accessibility (optional)
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");

    el.addEventListener(
      "wheel",
      (e) => {
        // If user holds Shift, browsers often interpret vertical wheel as horizontal;
        // let that default happen.
        if (e.shiftKey) return;

        const maxScrollLeft = el.scrollWidth - el.clientWidth;
        if (maxScrollLeft <= 0) return; // no horizontal overflow => do nothing

        // If the gesture is already horizontal-dominant, let the browser handle it.
        const absX = Math.abs(e.deltaX);
        const absY = Math.abs(e.deltaY);
        if (absX > absY) return;

        // Convert vertical wheel to horizontal
        // deltaMode: 0=pixel, 1=line, 2=page
        let delta = e.deltaY;

        // Normalize "line" mode a bit
        if (e.deltaMode === 1) delta *= 16;

        // Avoid hijacking when user is trying to scroll the page
        // If we're at the start and scrolling "up" or at end and scrolling "down",
        // allow page scroll by not preventing default.
        const atStart = el.scrollLeft <= 0;
        const atEnd = el.scrollLeft >= maxScrollLeft - 1;

        if ((atStart && delta < 0) || (atEnd && delta > 0)) {
          return;
        }

        e.preventDefault();

        // Scroll horizontally
        const nextLeft = el.scrollLeft + delta;

        if (prefersReducedMotion) {
          el.scrollLeft = nextLeft;
        } else {
          el.scrollTo({ left: nextLeft, behavior: "auto" });
        }
      },
      { passive: false }
    );
  });
})();
