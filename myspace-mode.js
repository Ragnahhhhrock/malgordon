(function () {
  var STORAGE_KEY = "mg-myspace-mode";
  var STYLESHEET_ID = "myspace-profile-stylesheet";
  var STYLESHEET_HREF = "/myspace-profile.css?v=2";

  var TOP8 = [
    { name: "Tom", photo: "/assets/myspace/tom.jpg", url: null },
    { name: "JurgMeister", photo: "/assets/myspace/friends/jurgen.jpg", url: null },
    { name: "Br1ttz_xo", photo: "/assets/myspace/friends/f3.png", url: null },
    { name: "T0xicKitten*", photo: "/assets/myspace/friends/f4.png", url: null },
    { name: "*StAy_GoLD*", photo: "/assets/myspace/friends/jack.jpg", url: null },
    { name: "Temple-Pilot", photo: "/assets/myspace/friends/todd.jpg", url: null },
    { name: "Ch4osQu33n_x", photo: "/assets/myspace/friends/f7.png", url: null },
    { name: "L1lRebel_Xx", photo: "/assets/myspace/friends/f8.png", url: null }
  ];

  var COMMENTS = [
    {
      initials: "TS", name: "$t4rBoy_87",
      text: "bro just KEEPS launching startups and somehow they keep working out?? teach me your ways man fr",
      date: "Mar 14, 2005"
    },
    {
      initials: "BX", name: "Br1ttz_xo",
      text: "ppl said blingvaders was a crazy idea and look who's laughing now!! so proud of you keep going!! xoxo",
      date: "Mar 12, 2005"
    },
    {
      initials: "CQ", name: "Ch4osQu33n_x",
      text: "not everyone gets the whole 'quit your job and just build stuff' thing but i do. you're gonna make it big i can feel it",
      date: "Mar 9, 2005"
    },
    {
      initials: "MC", name: "MC_Fr3sh2005",
      text: "the chain is SICK btw. entrepreneur AND drip?? unreal combo ngl 8-)",
      date: "Mar 8, 2005"
    }
  ];

  var STATUS_UPDATES = [
    "just launched Blingvaders!!! retro gaming jewellery, straight from my brain to your neck. LET'S GOOO",
    "got the space invader iced out neck chain in today and i am NEVER taking it off. this is who i am now",
    "is trying to explain to his mum what a 'startup' is for the fifth time this week. she still thinks i sell phones",
    "spent the whole night sketching new Blingvaders designs instead of sleeping. no regrets. this is the DREAM",
    "is... single, here for friendship, and extremely busy building things nobody asked for. balance!!",
    "just realised the chain jingles when i walk and honestly? i've never felt more powerful"
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
      "<dt>General</dt><dd>Startups, mischief, and my space invader iced out chain</dd>" +
      "<dt>Music</dt><dd>Radiohead, Armand Van Helden, DJ Rousa</dd>" +
      "<dt>Movies</dt><dd>Lord of the Rings, Star Wars</dd>" +
      "<dt>Heroes</dt><dd>Steve Jobs, Richard Branson, Barack Obama, Ben Cousins (Go Eagles!)</dd>" +
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
      '<tr><td class="ms-info-key">Status:</td><td>Single</td></tr>' +
      '<tr><td class="ms-info-key">Here for:</td><td>Friendship</td></tr>' +
      '<tr><td class="ms-info-key">Orientation:</td><td>Straight</td></tr>' +
      '<tr><td class="ms-info-key">Hometown:</td><td>Perth, Western Australia</td></tr>' +
      '<tr><td class="ms-info-key">Occupation:</td><td>Mischief maker, marketer, entrepreneur</td></tr>' +
      '<tr><td class="ms-info-key">Member Since:</td><td>March 2005</td></tr>' +
      "</tbody></table></div></div>" +

      '<div class="ms-module">' +
      '<div class="ms-module-body">' +
      '<p class="ms-blurb-heading">About Me</p>' +
      '<p class="ms-blurb-body">Here for a good time, not a long time.</p>' +
      '<p class="ms-blurb-heading">Who I\'d Like to Meet</p>' +
      '<p class="ms-blurb-body">Steve Jobs and Steve Coogan. The two Steves.</p>' +
      "</div></div>" +

      '<div class="ms-module">' +
      '<div class="ms-module-title">Top Friends (has 3,042 friends)</div>' +
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
