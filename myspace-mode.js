(function () {
  var STORAGE_KEY = "mg-myspace-mode";
  var STYLESHEET_ID = "myspace-profile-stylesheet";
  var STYLESHEET_HREF = "/myspace-profile.css";

  var TOP8 = [
    { name: "Tom", photo: "/assets/myspace/tom.jpg", url: null },
    { name: "Friend 2", initials: "?", url: null },
    { name: "Friend 3", initials: "?", url: null },
    { name: "Friend 4", initials: "?", url: null },
    { name: "Friend 5", initials: "?", url: null },
    { name: "Friend 6", initials: "?", url: null },
    { name: "Friend 7", initials: "?", url: null },
    { name: "Friend 8", initials: "?", url: null }
  ];

  var COMMENTS = [
    {
      initials: "??", name: "[someone]",
      text: "[waiting on a comment to put here]",
      date: "[date]"
    }
  ];

  var STATUS_UPDATES = [
    "[no status yet — what should this say?]"
  ];

  function el(html) {
    var wrap = document.createElement("div");
    wrap.innerHTML = html.trim();
    return wrap.firstChild;
  }

  function loadStylesheet(cb) {
    if (document.getElementById(STYLESHEET_ID)) { cb(); return; }
    var link = document.createElement("link");
    link.id = STYLESHEET_ID;
    link.rel = "stylesheet";
    link.href = STYLESHEET_HREF;
    link.onload = cb;
    document.head.appendChild(link);
  }

  function unloadStylesheet() {
    var link = document.getElementById(STYLESHEET_ID);
    if (link) link.remove();
  }

  function friendTile(f) {
    var inner = f.photo
      ? '<img src="' + f.photo + '" alt="' + f.name + '">'
      : '<div class="ms-friend-avatar">' + f.initials + "</div>";
    var body = f.url
      ? '<a href="' + f.url + '" target="_blank" rel="noopener">' + inner + f.name + "</a>"
      : inner + "<span>" + f.name + "</span>";
    return '<div class="ms-friend">' + body + "</div>";
  }

  function commentRow(c) {
    return (
      '<div class="ms-comment">' +
      '<div class="ms-comment-avatar">' + c.initials + "</div>" +
      '<div class="ms-comment-body">' +
      '<span class="ms-comment-name">' + c.name + "</span>" +
      '<span class="ms-comment-date">' + c.date + "</span><br>" +
      c.text +
      "</div></div>"
    );
  }

  function statusRow(s, i) {
    var times = ["11:47pm", "9:03pm", "4:20pm", "1:14am", "10:58pm", "2:11am", "12:32am"];
    return (
      "<li>Malcolm Gordon " + s +
      '<span class="ms-status-date">posted ' + (times[i] || "just now") + "</span></li>"
    );
  }

  function buildProfile() {
    var friendsHtml = TOP8.map(friendTile).join("");
    var commentsHtml = COMMENTS.map(commentRow).join("");
    var statusHtml = STATUS_UPDATES.map(statusRow).join("");

    var html =
      '<div id="ms-root">' +
      '<div class="ms-topbar">' +
      '<div class="ms-logo">mal<span>space</span></div>' +
      '<div class="ms-topnav">' +
      '<a href="#">Home</a><a href="#">Browse</a><a href="#">Search</a>' +
      '<a href="#">Mail</a><a href="#">Blog</a><a href="#">Favorites</a>' +
      "</div>" +
      '<button type="button" class="ms-exit" id="ms-exit-btn">Exit MySpace Mode</button>' +
      "</div>" +

      '<div class="ms-marquee"><marquee behavior="scroll" direction="left" scrollamount="6">' +
      "✨ WELCOME TO MY PAGE ✨ &nbsp;&nbsp; thanks for stopping by!! &nbsp;&nbsp; add me as a friend 👯 &nbsp;&nbsp; " +
      "startup mentor · growth marketer · perth wa &nbsp;&nbsp;" +
      "</marquee></div>" +

      '<div class="ms-shell">' +
      '<div class="ms-headline">' +
      "<h1>Malcolm Gordon</h1>" +
      '<div class="ms-viewpics"><a href="#ms-pics">View My: Pics</a></div>' +
      "</div>" +

      '<div class="ms-body">' +

      '<div class="ms-left">' +
      '<img class="ms-photo" src="/assets/myspace/photo2.jpg" alt="Malcolm Gordon">' +

      '<div class="ms-module">' +
      '<div class="ms-module-title">Contacting Malcolm Gordon</div>' +
      '<div class="ms-module-body">' +
      '<ul class="ms-contact-list">' +
      '<li><a href="mailto:mal@malgordon.com">Send Message</a></li>' +
      '<li><a href="/contact.html">Add to Friends</a></li>' +
      '<li class="disabled">Instant Message (offline)</li>' +
      '<li class="disabled">Add to Group</li>' +
      "</ul></div></div>" +

      '<div class="ms-module">' +
      '<div class="ms-module-title">Malcolm Gordon\'s Interests</div>' +
      '<div class="ms-module-body">' +
      '<dl class="ms-interests">' +
      "<dt>General</dt><dd>???</dd>" +
      "<dt>Music</dt><dd>???</dd>" +
      "<dt>Movies</dt><dd>???</dd>" +
      "<dt>Heroes</dt><dd>???</dd>" +
      "</dl></div></div>" +

      '<div class="ms-counter">Page Views<br><span class="ms-count-digits" id="ms-count-digits">0000000</span></div>' +
      "</div>" +

      '<div class="ms-right">' +

      '<div class="ms-module">' +
      '<div class="ms-module-title">Malcolm Gordon\'s Profile Song</div>' +
      '<div class="ms-module-body ms-song">' +
      "<p>♫ Malgordon Glow ♫</p>" +
      '<audio id="ms-audio" src="/assets/myspace-track.mp3" controls loop></audio>' +
      "</div></div>" +

      '<div class="ms-module">' +
      '<div class="ms-module-title">General Info</div>' +
      '<div class="ms-module-body">' +
      '<table class="ms-info-table"><tbody>' +
      '<tr><td class="ms-info-key">Status:</td><td>???</td></tr>' +
      '<tr><td class="ms-info-key">Here for:</td><td>???</td></tr>' +
      '<tr><td class="ms-info-key">Orientation:</td><td>???</td></tr>' +
      '<tr><td class="ms-info-key">Hometown:</td><td>???</td></tr>' +
      '<tr><td class="ms-info-key">Occupation:</td><td>???</td></tr>' +
      '<tr><td class="ms-info-key">Member Since:</td><td>???</td></tr>' +
      "</tbody></table></div></div>" +

      '<div class="ms-module">' +
      '<div class="ms-module-body">' +
      '<p class="ms-blurb-heading">About Me</p>' +
      '<p class="ms-blurb-body">[write something here]</p>' +
      '<p class="ms-blurb-heading">Who I\'d Like to Meet</p>' +
      '<p class="ms-blurb-body">[write something here]</p>' +
      "</div></div>" +

      '<div class="ms-module">' +
      '<div class="ms-module-title">Malcolm Gordon\'s Friend Space (has 8 friends)</div>' +
      '<div class="ms-module-body"><div class="ms-friend-grid">' + friendsHtml + "</div></div></div>" +

      '<div class="ms-module" id="ms-pics">' +
      '<div class="ms-module-title">Malcolm Gordon\'s Pics</div>' +
      '<div class="ms-module-body"><div class="ms-pics-grid">' +
      '<img src="/assets/myspace/photo1.jpg" alt="Malcolm at the beach">' +
      '<img src="/assets/myspace/photo2.jpg" alt="Malcolm profile pic">' +
      '<img src="/assets/myspace/photo3.jpg" alt="Malcolm at a BBQ">' +
      "</div></div></div>" +

      '<div class="ms-module">' +
      '<div class="ms-module-title">Status Updates</div>' +
      '<div class="ms-module-body"><ul class="ms-status-list">' + statusHtml + "</ul></div></div>" +

      '<div class="ms-module">' +
      '<div class="ms-module-title">Comments</div>' +
      '<div class="ms-module-body">' + commentsHtml + "</div></div>" +

      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";

    return el(html);
  }

  function updateCounter(root) {
    var digitsEl = root.querySelector("#ms-count-digits");
    if (!digitsEl) return;
    var count;
    try {
      count = parseInt(localStorage.getItem("mg-myspace-visits") || "133742", 10) + 1;
      localStorage.setItem("mg-myspace-visits", String(count));
    } catch (e) {
      count = 133742;
    }
    digitsEl.textContent = String(count).padStart(7, "0");
  }

  function playSong(root) {
    var audio = root.querySelector("#ms-audio");
    if (!audio) return;
    var p = audio.play();
    if (p && typeof p.catch === "function") p.catch(function () {});
  }

  function apply(on) {
    var btn = document.getElementById("myspace-toggle");

    if (on) {
      loadStylesheet(function () {
        var existing = document.getElementById("ms-root");
        if (existing) return;
        var root = buildProfile();
        document.body.appendChild(root);
        document.body.style.overflow = "hidden";
        updateCounter(root);
        playSong(root);

        root.querySelector("#ms-exit-btn").addEventListener("click", function () {
          try { localStorage.setItem(STORAGE_KEY, "false"); } catch (e) {}
          apply(false);
        });
      });
      if (btn) btn.setAttribute("aria-pressed", "true");
    } else {
      var existingRoot = document.getElementById("ms-root");
      if (existingRoot) {
        var audio = existingRoot.querySelector("#ms-audio");
        if (audio) audio.pause();
        existingRoot.remove();
      }
      document.body.style.overflow = "";
      unloadStylesheet();
      if (btn) btn.setAttribute("aria-pressed", "false");
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
      var next = !(document.getElementById("ms-root"));
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch (e) {}
      apply(next);
    });
  });
})();
