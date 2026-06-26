/* =============================================
   Save Our Wildlife — script.js
   Video toggle: hide/show + play/pause logic
   ============================================= */

(function () {
  "use strict";

  // Wait for the DOM to be fully loaded before running
  document.addEventListener("DOMContentLoaded", function () {

    const toggleBtn   = document.getElementById("toggleBtn");
    const videoEl     = document.getElementById("wildlifeVideo");
    const videoWrapper = document.getElementById("videoWrapper");
    const btnIcon     = document.getElementById("btnIcon");
    const btnLabel    = document.getElementById("btnLabel");

    // Guard: if any element is missing, exit silently
    if (!toggleBtn || !videoEl || !videoWrapper) return;

    /**
     * State:
     *   isHidden  — whether the video wrapper is currently hidden from view
     *   isPlaying — whether the video is currently playing
     */
    let isHidden  = false;
    let isPlaying = false;

    /**
     * updateButton()
     * Syncs the button label, icon, and ARIA attributes with the current state.
     */
    function updateButton() {
      if (isHidden) {
        btnIcon.textContent  = "▶";
        btnLabel.textContent = "Show & Play";
        toggleBtn.setAttribute("aria-label", "Show and play the wildlife video");
        toggleBtn.setAttribute("aria-pressed", "false");
      } else if (isPlaying) {
        btnIcon.textContent  = "⏸";
        btnLabel.textContent = "Pause video";
        toggleBtn.setAttribute("aria-label", "Pause the wildlife video");
        toggleBtn.setAttribute("aria-pressed", "true");
      } else {
        btnIcon.textContent  = "▶";
        btnLabel.textContent = "Play video";
        toggleBtn.setAttribute("aria-label", "Play the wildlife video");
        toggleBtn.setAttribute("aria-pressed", "false");
      }
    }

    /**
     * handleToggle()
     * Core toggle logic:
     *   - If video is hidden → show it and play it.
     *   - If video is visible and playing → pause it and hide it.
     *   - If video is visible but paused → play it.
     */
    function handleToggle() {
      if (isHidden) {
        // Show and play
        videoWrapper.classList.remove("hidden-video");
        videoWrapper.removeAttribute("hidden");
        isHidden = false;
        videoEl.play().then(function () {
          isPlaying = true;
          updateButton();
        }).catch(function (err) {
          // Autoplay blocked by browser — still show the video
          console.warn("Autoplay prevented:", err);
          isPlaying = false;
          updateButton();
        });
      } else if (isPlaying) {
        // Pause and hide
        videoEl.pause();
        isPlaying = false;
        isHidden  = true;
        videoWrapper.classList.add("hidden-video");
        videoWrapper.setAttribute("hidden", "");
        updateButton();
      } else {
        // Visible but paused → play it
        videoEl.play().then(function () {
          isPlaying = true;
          updateButton();
        }).catch(function (err) {
          console.warn("Play prevented:", err);
        });
      }
    }

    // Keep internal state in sync with native video events
    videoEl.addEventListener("play", function () {
      isPlaying = true;
      updateButton();
    });

    videoEl.addEventListener("pause", function () {
      isPlaying = false;
      updateButton();
    });

    videoEl.addEventListener("ended", function () {
      isPlaying = false;
      updateButton();
    });

    // Attach the main click handler
    toggleBtn.addEventListener("click", handleToggle);

    // Keyboard: allow Space and Enter explicitly (button already handles this,
    // but being explicit aids screen-reader testing)
    toggleBtn.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleToggle();
      }
    });

    // Set initial button state
    updateButton();
  });

})();
