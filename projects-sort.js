(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var bar = document.querySelector(".sort-bar");
    var grid = document.querySelector(".card-grid");
    if (!bar || !grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll(":scope > .card"));
    cards.forEach(function (c, i) { c.setAttribute("data-order", i); });
    var buttons = Array.prototype.slice.call(bar.querySelectorAll("[data-sort]"));

    function key(card) {
      var d = card.getAttribute("data-registered");
      return d ? d : "9999-99-99"; // no registered domain: sort last
    }

    function apply(mode) {
      var sorted = cards.slice().sort(function (a, b) {
        if (mode === "registered-asc") {
          var ka = key(a), kb = key(b);
          if (ka !== kb) return ka < kb ? -1 : 1;
        }
        return a.getAttribute("data-order") - b.getAttribute("data-order");
      });
      sorted.forEach(function (c) { grid.appendChild(c); });
      buttons.forEach(function (btn) {
        var on = btn.getAttribute("data-sort") === mode;
        btn.classList.toggle("active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
      if (typeof gtag === "function") {
        gtag("event", "project_sort", { sort: mode });
      }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () { apply(btn.getAttribute("data-sort")); });
    });
  });
})();
