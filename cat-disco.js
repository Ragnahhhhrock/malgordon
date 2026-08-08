(function () {
  var STORAGE_KEY = "mg-catdisco-mode";
  var CATS = ["🐱", "😸", "😹", "😻", "🙀", "😼", "🐈", "🐈‍⬛"];
  var LASER_COLORS = ["#ff0044", "#00e5ff", "#39ff14", "#ff00ea", "#ffee00"];

  var sprites = [];
  var rafId = null;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function spawnCats() {
    var count = 7;
    for (var i = 0; i < count; i++) {
      var el = document.createElement("span");
      el.className = "cat-sprite";
      el.textContent = CATS[i % CATS.length];
      el.setAttribute("aria-hidden", "true");
      document.body.appendChild(el);

      var startX = rand(0, window.innerWidth - 40);
      var startY = rand(0, window.innerHeight - 40);

      sprites.push({
        el: el,
        x: startX,
        y: startY,
        vx: rand(1.5, 3.5) * (Math.random() < 0.5 ? -1 : 1),
        vy: rand(1.5, 3.5) * (Math.random() < 0.5 ? -1 : 1),
        rot: rand(0, 360),
        vr: rand(-2, 2)
      });
    }
  }

  function tick() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    sprites.forEach(function (s) {
      s.x += s.vx;
      s.y += s.vy;
      s.rot += s.vr;

      if (s.x <= 0 || s.x >= w - 40) { s.vx *= -1; s.x = Math.max(0, Math.min(s.x, w - 40)); }
      if (s.y <= 0 || s.y >= h - 40) { s.vy *= -1; s.y = Math.max(0, Math.min(s.y, h - 40)); }

      s.el.style.transform =
        "translate(" + s.x + "px, " + s.y + "px) rotate(" + s.rot + "deg)";
    });

    rafId = requestAnimationFrame(tick);
  }

  function teardownCats() {
    sprites.forEach(function (s) { s.el.remove(); });
    sprites = [];
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function buildLasers() {
    if (document.getElementById("catdisco-lasers-el")) return;
    var wrap = document.createElement("div");
    wrap.className = "catdisco-lasers";
    wrap.id = "catdisco-lasers-el";
    LASER_COLORS.forEach(function (color, i) {
      var beam = document.createElement("div");
      beam.className = "catdisco-laser catdisco-laser-" + (i + 1);
      beam.style.setProperty("--laser-color", color);
      wrap.appendChild(beam);
    });
    document.body.appendChild(wrap);
  }

  function buildScan() {
    if (document.getElementById("catdisco-scan-el")) return;
    var scan = document.createElement("div");
    scan.className = "catdisco-scan";
    scan.id = "catdisco-scan-el";
    document.body.appendChild(scan);
  }

  function buildPlayer() {
    if (document.getElementById("catdisco-player-el")) return;
    var el = document.createElement("div");
    el.className = "catdisco-player";
    el.id = "catdisco-player-el";
    el.innerHTML =
      '<div class="now-playing"><span>&#9835; Malgordon Glow &#9835;</span>' +
      '<button type="button" class="close-player" id="catdisco-player-close">hide</button></div>' +
      '<audio id="catdisco-audio" src="/assets/myspace-track.mp3" controls loop></audio>';
    document.body.appendChild(el);

    var audio = document.getElementById("catdisco-audio");
    var p = audio.play();
    if (p && typeof p.catch === "function") p.catch(function () {});

    document.getElementById("catdisco-player-close").addEventListener("click", function () {
      el.remove();
    });
  }

  function teardownChrome() {
    ["catdisco-lasers-el", "catdisco-scan-el"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    });
    var playerEl = document.getElementById("catdisco-player-el");
    if (playerEl) {
      var audio = playerEl.querySelector("audio");
      if (audio) audio.pause();
      playerEl.remove();
    }
  }

  function apply(on) {
    document.body.classList.toggle("cat-disco-mode", on);
    var btn = document.getElementById("catdisco-toggle");
    if (btn) btn.setAttribute("aria-pressed", on ? "true" : "false");

    if (on) {
      spawnCats();
      tick();
      buildLasers();
      buildScan();
      buildPlayer();
    } else {
      teardownCats();
      teardownChrome();
    }

    if (typeof gtag === "function") {
      gtag("event", "cat_disco_mode_toggle", { enabled: on });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("catdisco-toggle");
    if (!btn) return;

    var on = false;
    try { on = localStorage.getItem(STORAGE_KEY) === "true"; } catch (e) {}
    if (on) apply(true);

    btn.addEventListener("click", function () {
      var next = !document.body.classList.contains("cat-disco-mode");
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch (e) {}
      apply(next);
    });
  });
})();
