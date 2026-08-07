(function () {
  var STORAGE_KEY = "mg-disco-mode";
  var originalTitle = document.title;

  var LASER_COLORS = ["#ff0044", "#00e5ff", "#39ff14", "#ff00ea", "#ffee00"];

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

  function buildLasers() {
    if (document.getElementById("disco-lasers-el")) return;
    var wrap = document.createElement("div");
    wrap.className = "disco-lasers";
    wrap.id = "disco-lasers-el";

    LASER_COLORS.forEach(function (color, i) {
      var beam = document.createElement("div");
      beam.className = "disco-laser disco-laser-" + (i + 1);
      beam.style.setProperty("--laser-color", color);
      wrap.appendChild(beam);
    });

    document.body.appendChild(wrap);
  }

  function buildScan() {
    if (document.getElementById("disco-scan-el")) return;
    var scan = document.createElement("div");
    scan.className = "disco-scan";
    scan.id = "disco-scan-el";
    document.body.appendChild(scan);
  }

  function buildAudio() {
    if (document.getElementById("disco-audio")) return;
    var audio = document.createElement("audio");
    audio.id = "disco-audio";
    audio.src = "/assets/myspace-track.mp3";
    audio.loop = true;
    audio.style.display = "none";
    document.body.appendChild(audio);
    var p = audio.play();
    if (p && typeof p.catch === "function") p.catch(function () {});
  }

  function teardown() {
    ["disco-ball-el", "disco-spot-el", "disco-lasers-el", "disco-scan-el"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    });
    var audio = document.getElementById("disco-audio");
    if (audio) {
      audio.pause();
      audio.remove();
    }
  }

  function apply(on) {
    document.body.classList.toggle("disco-mode", on);
    var btn = document.getElementById("disco-toggle");
    if (btn) btn.setAttribute("aria-pressed", on ? "true" : "false");

    document.title = on ? "🪩 " + originalTitle : originalTitle;

    if (on) {
      buildBall();
      buildLasers();
      buildScan();
      buildAudio();
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
