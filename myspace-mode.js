(function () {
  var STORAGE_KEY = "mg-myspace-mode";

  var SOCIAL_LINKS = [
    { name: "X / Twitter", url: "https://x.com/malgordon/" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/malcolmgordon/" },
    { name: "Facebook", url: "https://www.facebook.com/malcolm.gordon" },
    { name: "Instagram", url: "https://www.instagram.com/malgordon/" },
    { name: "TikTok", url: "https://www.tiktok.com/@mal_gordon" },
    { name: "YouTube", url: "https://www.youtube.com/@MalcolmGordonliveshere" }
  ];

  function buildMarquee() {
    var wrap = document.createElement("div");
    wrap.className = "myspace-marquee";
    wrap.id = "myspace-marquee-el";
    wrap.innerHTML =
      '<marquee behavior="scroll" direction="left" scrollamount="6">' +
      "✨💫 WELCOME TO MY PAGE 💫✨ &nbsp;&nbsp; THANKS FOR STOPPING BY!! &nbsp;&nbsp; " +
      "🌟 startup mentor · growth marketer · perth wa 🌟 &nbsp;&nbsp; " +
      "add me as a friend!! 👯 &nbsp;&nbsp; " +
      "</marquee>";
    document.body.insertBefore(wrap, document.body.firstChild);
  }

  function buildCounter() {
    var el = document.createElement("div");
    el.className = "myspace-counter";
    el.id = "myspace-counter-el";
    var count;
    try {
      count = parseInt(localStorage.getItem("mg-myspace-visits") || "133742", 10) + 1;
      localStorage.setItem("mg-myspace-visits", String(count));
    } catch (e) {
      count = 133742;
    }
    var digits = String(count).padStart(7, "0");
    el.innerHTML = "PAGE VIEWS<span class=\"count-digits\">" + digits + "</span>";
    document.body.appendChild(el);
  }

  function buildTopFriends() {
    var el = document.createElement("div");
    el.className = "myspace-topfriends";
    el.id = "myspace-topfriends-el";
    var items = SOCIAL_LINKS.map(function (s) {
      return '<li><a href="' + s.url + '" target="_blank" rel="noopener">' + s.name + "</a></li>";
    }).join("");
    el.innerHTML = "<h4>★ Malcolm's Top Friends ★</h4><ul>" + items + "</ul>";
    document.body.appendChild(el);
  }

  function buildPlayer() {
    var el = document.createElement("div");
    el.className = "myspace-player";
    el.id = "myspace-player-el";

    var viz = '<div class="viz"><span></span><span></span><span></span><span></span><span></span></div>';
    var nowPlaying = '<div class="now-playing"><marquee behavior="scroll" direction="left" scrollamount="4">' +
      "♫ NOW PLAYING: profile song ♫" + "</marquee></div>";

    el.innerHTML = viz + nowPlaying +
      '<audio id="myspace-audio" src="/assets/myspace-track.mp3" controls loop></audio>' +
      '<p class="track-missing" id="myspace-track-missing" hidden>' +
      "Drop an mp3 at <code>/assets/myspace-track.mp3</code> and it'll autoplay here." +
      "</p>";

    document.body.appendChild(el);

    var audio = document.getElementById("myspace-audio");
    var missingNote = document.getElementById("myspace-track-missing");

    audio.addEventListener("error", function () {
      missingNote.hidden = false;
      audio.style.display = "none";
    });

    var playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        // autoplay blocked or file missing — controls remain visible so
        // the person can hit play manually once a track is in place
      });
    }
  }

  function teardown() {
    ["myspace-marquee-el", "myspace-counter-el", "myspace-topfriends-el", "myspace-player-el"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        var audio = el.querySelector("audio");
        if (audio) audio.pause();
        el.remove();
      }
    });
  }

  function apply(on) {
    document.body.classList.toggle("myspace-mode", on);
    var btn = document.getElementById("myspace-toggle");
    if (btn) btn.setAttribute("aria-pressed", on ? "true" : "false");

    if (on) {
      buildMarquee();
      buildCounter();
      buildTopFriends();
      buildPlayer();
    } else {
      teardown();
    }

    if (typeof gtag === "function") {
      gtag("event", "myspace_mode_toggle", { enabled: on });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("myspace-toggle");
    if (!btn) return;

    var on = false;
    try { on = localStorage.getItem(STORAGE_KEY) === "true"; } catch (e) {}
    if (on) apply(true);

    btn.addEventListener("click", function () {
      var next = !document.body.classList.contains("myspace-mode");
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch (e) {}
      apply(next);
    });
  });
})();
