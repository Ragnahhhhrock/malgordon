(function () {
  var STORAGE_KEY = "mg-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      var isLight = theme === "light";
      btn.querySelector(".icon").textContent = isLight ? "☀" : "☾";
      btn.querySelector(".label").textContent = isLight ? "Light" : "Dark";
      btn.setAttribute("aria-pressed", isLight ? "false" : "true");
    }
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(currentTheme());
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var next = currentTheme() === "light" ? "dark" : "light";
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
        applyTheme(next);
        if (typeof gtag === "function") {
          gtag("event", "theme_toggle", { theme: next });
        }
      });
    }
  });
})();
