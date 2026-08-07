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
      ring.style.transition = "stroke-dashoffset 1.1s cubic-bezier(.22,.8,.28,1)";
      ring.style.strokeDashoffset = offset;
    });
    document.querySelectorAll(".skill-bar-fill").forEach(function (bar) {
      var width = bar.getAttribute("data-width") || "0";
      bar.style.transition = "width 1.1s cubic-bezier(.22,.8,.28,1)";
      bar.style.width = width + "%";
    });
  }

  window.animateSkillsChart = function () {
    reset();
    // force a reflow so the browser registers the reset state before
    // the transitioned target state is applied
    void document.body.offsetHeight;
    setTimeout(fill, 30);
  };
})();
