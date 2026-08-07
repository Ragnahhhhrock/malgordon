(function () {
  var CIRCUMFERENCE = 2 * Math.PI * 52; // r=52 from the ring SVG

  function reset() {
    document.querySelectorAll(".ring-fill").forEach(function (ring) {
      ring.style.transition = "none";
      ring.style.strokeDashoffset = CIRCUMFERENCE;
    });
    document.querySelectorAll(".skill-bar-fill").forEach(function (bar) {
      bar.style.transition = "none";
      bar.style.width = "0%";
    });
  }

  function fill() {
    document.querySelectorAll(".ring-fill").forEach(function (ring) {
      var score = parseFloat(ring.getAttribute("data-score")) || 0;
      var offset = CIRCUMFERENCE * (1 - score / 100);
      ring.style.transition = "";
      // force reflow so the transition actually plays
      ring.getBoundingClientRect();
      ring.style.strokeDashoffset = offset;
    });
    document.querySelectorAll(".skill-bar-fill").forEach(function (bar) {
      var width = bar.getAttribute("data-width") || "0";
      bar.style.transition = "";
      bar.getBoundingClientRect();
      bar.style.width = width + "%";
    });
  }

  window.animateSkillsChart = function () {
    reset();
    requestAnimationFrame(function () {
      requestAnimationFrame(fill);
    });
  };
})();
