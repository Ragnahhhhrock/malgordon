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

  var STATUS_UPDATES = [
    {
      text: "malcolm is... starting ANOTHER startup nobody asked for (WouldPietEat, Hornet Bay, PropCheq). story of my life tbh. -__-",
      meta: "posted 11:47pm &middot; mood: overwhelmed"
    },
    {
      text: "malcolm is feeling unstoppable rn. 1,000+ founders mentored and still nobody claps when i walk into a room :'(",
      meta: "posted 9:03pm &middot; mood: misunderstood"
    },
    {
      text: "malcolm is $10M+ in ad spend deep and still counting down the days till friday. adulthood is a SCAM",
      meta: "posted 4:20pm &middot; mood: exhausted"
    },
    {
      text: "malcolm is done pretending Online Marketing (97/100) doesn't run through his veins. this is who i am now. no takebacks.",
      meta: "posted 1:14am &middot; mood: reflective"
    },
    {
      text: "malcolm is... mentoring startup founders since 2014 and yet NOBODY mentors ME. who's gonna hold ME when i cry",
      meta: "posted 10:58pm &middot; listening to: something depressing probably"
    },
    {
      text: "malcolm is organizing ANOTHER Somersoft &amp; PropertyChat meetup. 20+ events deep, hundreds of strangers know my face and still nobody really KNOWS me",
      meta: "posted 7:32pm &middot; mood: lonely but productive"
    },
    {
      text: "malcolm is thinking about AdShirts again. it flopped. some of us just weren't meant to be understood in our time.",
      meta: "posted 2:11am &middot; mood: misunderstood genius"
    },
    {
      text: "malcolm's stats: Entrepreneurship 96/100. Social Life: currently loading... please wait...",
      meta: "posted 6:45pm &middot; mood: it is what it is"
    },
    {
      text: "malcolm is remembering when Blingvaders went viral in 3 countries and still feeling alone in this town. numbers don't fix everything guys",
      meta: "posted 12:32am &middot; mood: nostalgic"
    },
    {
      text: "malcolm is facilitating ANOTHER Plus Eight workshop bc apparently that's what i do now instead of having feelings about things",
      meta: "posted 8:17pm &middot; mood: coping through productivity"
    }
  ];

  function buildStatuses() {
    var el = document.createElement("div");
    el.className = "myspace-statuses";
    el.id = "myspace-statuses-el";
    var items = STATUS_UPDATES.map(function (s) {
      return '<li><b>malcolm gordon</b> ' + s.text.replace(/^malcolm/, "") +
        '<span class="status-date">' + s.meta + "</span></li>";
    }).join("");
    // the replace above strips a leading "malcolm" so we don't double it after <b>
    el.innerHTML = "<h4>☆ status updates ☆</h4><ul>" + items + "</ul>";
    return el;
  }

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
    ["myspace-marquee-el", "myspace-statuses-el", "myspace-counter-el", "myspace-topfriends-el", "myspace-player-el"].forEach(function (id) {
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
      var marqueeEl = document.getElementById("myspace-marquee-el");
      var statusesEl = buildStatuses();
      if (marqueeEl) marqueeEl.insertAdjacentElement("afterend", statusesEl);
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
