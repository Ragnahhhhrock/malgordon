(function () {
  // Share bar for project detail pages. Every share action fires the GA4
  // recommended "share" event: method, content_type, item_id.

  function gaEvent(name, params) {
    if (typeof gtag === "function") {
      gtag("event", name, params || {});
    }
  }

  var hero = document.querySelector(".project-hero .wrap");
  if (!hero) return;

  var titleEl = hero.querySelector("h1");
  var title = titleEl ? titleEl.textContent.trim() : document.title;
  var canonical = document.querySelector('link[rel="canonical"]');
  var url = canonical && canonical.href
    ? canonical.href
    : window.location.origin + window.location.pathname;
  var slug = window.location.pathname
    .replace(/\/index\.html$/, "")
    .split("/")
    .pop()
    .replace(/\.html$/, "") || "home";
  var text = title + " — by Malcolm Gordon";

  function enc(s) { return encodeURIComponent(s); }

  var targets = [
    { method: "x",        label: "X",        href: "https://twitter.com/intent/tweet?text=" + enc(text) + "&url=" + enc(url) },
    { method: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/sharing/share-offsite/?url=" + enc(url) },
    { method: "facebook", label: "Facebook", href: "https://www.facebook.com/sharer/sharer.php?u=" + enc(url) },
    { method: "whatsapp", label: "WhatsApp", href: "https://wa.me/?text=" + enc(text + " " + url) },
    { method: "reddit",   label: "Reddit",   href: "https://www.reddit.com/submit?url=" + enc(url) + "&title=" + enc(title) },
    { method: "email",    label: "Email",    href: "mailto:?subject=" + enc(title) + "&body=" + enc(text + "\n" + url) }
  ];

  function track(method) {
    gaEvent("share", {
      method: method,
      content_type: "project",
      item_id: slug
    });
  }

  var bar = document.createElement("div");
  bar.className = "share-bar";
  bar.setAttribute("role", "group");
  bar.setAttribute("aria-label", "Share this project");

  var label = document.createElement("span");
  label.className = "share-label";
  label.textContent = "Share";
  bar.appendChild(label);

  targets.forEach(function (t) {
    var a = document.createElement("a");
    a.className = "share-btn";
    a.href = t.href;
    a.textContent = t.label;
    if (t.method !== "email") {
      a.target = "_blank";
      a.rel = "noopener";
    }
    a.addEventListener("click", function () { track(t.method); });
    bar.appendChild(a);
  });

  // Copy link
  var copy = document.createElement("button");
  copy.type = "button";
  copy.className = "share-btn";
  copy.textContent = "Copy link";
  copy.addEventListener("click", function () {
    function done() {
      copy.textContent = "Copied";
      setTimeout(function () { copy.textContent = "Copy link"; }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, function () {});
    }
    track("copy_link");
  });
  bar.appendChild(copy);

  // Native share sheet (mobile browsers)
  if (navigator.share) {
    var native = document.createElement("button");
    native.type = "button";
    native.className = "share-btn";
    native.textContent = "More…";
    native.addEventListener("click", function () {
      navigator.share({ title: title, text: text, url: url })
        .then(function () { track("web_share"); })
        .catch(function () { /* dismissed by user */ });
    });
    bar.appendChild(native);
  }

  var anchor = hero.querySelector(".site-link");
  if (anchor && anchor.parentNode === hero) {
    anchor.insertAdjacentElement("afterend", bar);
  } else {
    var img = hero.querySelector(".featured-image");
    if (img) hero.insertBefore(bar, img); else hero.appendChild(bar);
  }
})();
