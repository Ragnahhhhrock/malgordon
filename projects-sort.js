(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var sortBar = document.querySelector(".sort-bar");
    var catBar = document.querySelector(".category-bar");
    var grid = document.querySelector(".card-grid");
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll(":scope > .card"));
    cards.forEach(function (c, i) { c.setAttribute("data-order", i); });

    var sortButtons = sortBar ? Array.prototype.slice.call(sortBar.querySelectorAll("[data-sort]")) : [];
    var catButtons = catBar ? Array.prototype.slice.call(catBar.querySelectorAll("[data-category]")) : [];

    var state = { sort: "default", category: "all" };

    function categories(card) {
      return (card.getAttribute("data-category") || "").split(" ").filter(Boolean);
    }

    // Append a project count to each category button; hide categories with no projects.
    catButtons.forEach(function (btn) {
      var cat = btn.getAttribute("data-category");
      var count = cat === "all"
        ? cards.length
        : cards.filter(function (c) { return categories(c).indexOf(cat) !== -1; }).length;
      if (!count) { btn.hidden = true; return; }
      var span = document.createElement("span");
      span.className = "filter-count";
      span.textContent = count;
      btn.appendChild(document.createTextNode(" "));
      btn.appendChild(span);
    });

    function regKey(card) {
      var d = card.getAttribute("data-registered");
      return d ? d : "9999-99-99"; // no registered domain: sort last
    }

    function render() {
      var sorted = cards.slice().sort(function (a, b) {
        if (state.sort === "registered-asc") {
          var ka = regKey(a), kb = regKey(b);
          if (ka !== kb) return ka < kb ? -1 : 1;
        }
        return a.getAttribute("data-order") - b.getAttribute("data-order");
      });
      sorted.forEach(function (c) {
        var visible = state.category === "all" || categories(c).indexOf(state.category) !== -1;
        c.classList.toggle("is-hidden", !visible);
        grid.appendChild(c);
      });
      sortButtons.forEach(function (btn) {
        var on = btn.getAttribute("data-sort") === state.sort;
        btn.classList.toggle("active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
      catButtons.forEach(function (btn) {
        var on = btn.getAttribute("data-category") === state.category;
        btn.classList.toggle("active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }

    sortButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.sort = btn.getAttribute("data-sort");
        render();
        if (typeof gtag === "function") gtag("event", "project_sort", { sort: state.sort });
      });
    });

    catButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.category = btn.getAttribute("data-category");
        render();
        if (typeof gtag === "function") gtag("event", "project_category", { category: state.category });
      });
    });
  });
})();
