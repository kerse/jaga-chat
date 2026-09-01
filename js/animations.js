/* === Animation Helpers (Section 8) === */

/**
 * Animate channel list crossfade when switching spaces.
 * Section 8: "vertical crossfade, 150-200ms"
 */
function animateChannelSwitch(callback) {
  var scroll = document.getElementById('channelsListContainer');
  if (!scroll) { callback(); return; }

  scroll.classList.add('fade-out');

  setTimeout(function() {
    callback();
    scroll.classList.remove('fade-out');
  }, 180);
}

/**
 * Re-trigger badge pulse animation.
 * Section 8: "scale 0.8 → 1, 150ms"
 */
function pulseBadge(element) {
  if (!element) return;
  element.classList.remove('badge-pulse');
  // Force reflow to restart animation
  void element.offsetWidth;
  element.classList.add('badge-pulse');
}
