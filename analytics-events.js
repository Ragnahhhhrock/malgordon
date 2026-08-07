(function () {
  function gaEvent(name, params) {
    if (typeof gtag === "function") {
      gtag("event", name, params || {});
    }
  }

  function platformFromHref(href) {
    if (!href) return "unknown";
    if (href.indexOf("mailto:") === 0) return "email";
    if (href.indexOf("x.com") !== -1 || href.indexOf("twitter.com") !== -1) return "twitter";
    if (href.indexOf("linkedin.com") !== -1) return "linkedin";
    if (href.indexOf("facebook.com") !== -1) return "facebook";
    if (href.indexOf("instagram.com") !== -1) return "instagram";
    if (href.indexOf("tiktok.com") !== -1) return "tiktok";
    if (href.indexOf("youtube.com") !== -1) return "youtube";
    return "other";
  }

  document.addEventListener("DOMContentLoaded", function () {
    // 1. Social / YouTube / email link clicks (header hero + footer)
    document.querySelectorAll(".social-row a").forEach(function (a) {
      a.addEventListener("click", function () {
        var loc = a.closest(".hero") ? "hero" : (a.closest("footer") ? "footer" : "other");
        gaEvent("social_click", {
          platform: platformFromHref(a.getAttribute("href")),
          link_location: loc
        });
      });
    });

    // 2. Project card clicks (homepage "Current projects" grid)
    document.querySelectorAll(".card-grid .card").forEach(function (card) {
      card.addEventListener("click", function () {
        var nameEl = card.querySelector("h3");
        gaEvent("project_card_click", {
          project_name: nameEl ? nameEl.textContent.trim() : "unknown"
        });
      });
    });

    // 3. Outbound clicks to live project sites (project detail pages)
    document.querySelectorAll(".project-hero .site-link").forEach(function (a) {
      a.addEventListener("click", function () {
        var titleEl = document.querySelector(".project-hero h1");
        gaEvent("outbound_project_click", {
          project_name: titleEl ? titleEl.textContent.trim() : document.title,
          destination_url: a.getAttribute("href")
        });
      });
    });

    // 4. MalSpace nav link click (navigates to /malspace/)
    var malspaceLink = document.getElementById("myspace-toggle");
    if (malspaceLink) {
      malspaceLink.addEventListener("click", function () {
        gaEvent("malspace_nav_click", {
          from_page: window.location.pathname
        });
      });
    }

    // 5. Theme toggle (dark/light)
    var themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        setTimeout(function () {
          var theme = document.documentElement.getAttribute("data-theme") || "unknown";
          gaEvent("theme_toggle_click", { switched_to: theme });
        }, 0);
      });
    }
  });
})();
