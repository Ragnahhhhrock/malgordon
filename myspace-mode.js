(function () {
  var STORAGE_KEY = "mg-myspace-mode";
  var STYLESHEET_ID = "myspace-profile-stylesheet";
  var STYLESHEET_HREF = "/myspace-profile.css";

  var TOP8 = [
    { name: "Tom", photo: "/assets/myspace/tom.jpg", url: null },
    { name: "WouldPietEat", initials: "WP", url: "https://www.wouldpieteat.com" },
    { name: "Hornet Bay", initials: "HB", url: "https://www.hornetbay.com" },
    { name: "PropCheq", initials: "PC", url: "https://www.propcheq.com" },
    { name: "Startup Weekend", initials: "SW", url: null },
    { name: "Spacecubed", initials: "SC", url: null },
    { name: "eGroup WA", initials: "EG", url: null },
    { name: "Blingvaders", initials: "BV", url: null }
  ];

  var COMMENTS = [
    {
      initials: "MB", name: "Miles Burke",
      text: "mal is such a legend mentoring at Startup Weekend again lol. dude just gives away all his marketing knowledge for free, absolute icon",
      date: "Nov 29, 2018"
    },
    {
      initials: "CG", name: "Charlie Gunningham",
      text: "you're literally a fixture of the Perth startup scene at this point mal, always first to like a post or buy a ticket. never change",
      date: "Nov 27, 2018"
    },
    {
      initials: "NS", name: "Nate Sturcke",
      text: "the energy you bring to Startup Weekend every single year is unmatched fr. most in demand mentor, no cap",
      date: "Nov 25, 2018"
    }
  ];

  var STATUS_UPDATES = [
    "is... starting ANOTHER startup nobody asked for (WouldPietEat, Hornet Bay, PropCheq). story of my life tbh. -__-",
    "is feeling unstoppable rn. 1,000+ founders mentored and still nobody claps when i walk into a room :'(",
    "is $10M+ in ad spend deep and still counting down the days till friday. adulthood is a SCAM",
    "is done pretending Online Marketing (97/100) doesn't run through his veins. this is who i am now. no takebacks.",
    "is... mentoring startup founders since 2014 and yet NOBODY mentors ME. who's gonna hold ME when i cry",
    "is thinking about AdShirts again. it flopped. some of us just weren't meant to be understood in our time.",
    "is remembering when Blingvaders went viral in 3 countries and still feeling alone in this town. numbers don't fix everything guys"
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
      "<dt>General</dt><dd>Startups, Lean Canvas, PPC campaigns that actually convert</dd>" +
      "<dt>Music</dt><dd>Whatever's playing at the Startup Weekend afterparty</dd>" +
      "<dt>Movies</dt><dd>The Social Network (for the laughs)</dd>" +
      "<dt>Heroes</dt><dd>Anyone who hits 1,000 visitors in hour one</dd>" +
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
      '<tr><td class="ms-info-key">Status:</td><td>Married to the hustle</td></tr>' +
      '<tr><td class="ms-info-key">Here for:</td><td>Networking, Startups, Making Friends</td></tr>' +
      '<tr><td class="ms-info-key">Orientation:</td><td>Bootstrapped</td></tr>' +
      '<tr><td class="ms-info-key">Hometown:</td><td>Perth, Western Australia</td></tr>' +
      '<tr><td class="ms-info-key">Occupation:</td><td>Digital Marketing Analyst @ ECU / Startup Mentor</td></tr>' +
      '<tr><td class="ms-info-key">Member Since:</td><td>1998</td></tr>' +
      "</tbody></table></div></div>" +

      '<div class="ms-module">' +
      '<div class="ms-module-body">' +
      '<p class="ms-blurb-heading">About Me</p>' +
      '<p class="ms-blurb-body">Perth-based growth marketer and startup community builder. Been mentoring founders at Startup Weekend since 2012, running digital marketing for ECU since 2014, and shipping my own ventures on the side since 2005. Currently building WouldPietEat, Hornet Bay, and PropCheq.</p>' +
      '<p class="ms-blurb-heading">Who I\'d Like to Meet</p>' +
      '<p class="ms-blurb-body">Founders building something real, marketers who test before they guess, and anyone who wants to talk startups over coffee.</p>' +
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
