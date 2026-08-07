(function () {
  var STORAGE_KEY = "mg-disco-mode";
  var originalTitle = document.title;

  function buildBall() {
    if (document.getElementById("disco-ball-el")) return;
    var ball = document.createElement("div");
    ball.className = "disco-ball";
    ball.id = "disco-ball-el";
    document.body.appendChild(ball);

    var spot = document.createElement("div");
    spot.className = "disco-spot";
    spot.id = "disco-spot-el";
    document.body.appendChild(spot);
  }

  function teardown() {
    ["disco-ball-el", "disco-spot-el"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  function apply(on) {
    document.body.classList.toggle("disco-mode", on);
    var btn = document.getElementById("disco-toggle");
    if (btn) btn.setAttribute("aria-pressed", on ? "true" : "false");

    document.title = on ? "🪩 " + originalTitle : originalTitle;

    if (on) {
      buildBall();
    } else {
      teardown();
    }

    if (typeof gtag === "function") {
      gtag("event", "disco_mode_toggle", { enabled: on });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("disco-toggle");
    if (!btn) return;

    var on = false;
    try { on = localStorage.getItem(STORAGE_KEY) === "true"; } catch (e) {}
    if (on) apply(true);

    btn.addEventListener("click", function () {
      var next = !document.body.classList.contains("disco-mode");
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch (e) {}
      apply(next);
    });
  });
})();
