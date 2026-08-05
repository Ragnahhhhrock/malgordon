(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var bar = document.querySelector(".filter-bar");
    if (!bar) return;

    var buttons = Array.prototype.slice.call(bar.querySelectorAll(".filter-btn"));
    var entries = Array.prototype.slice.call(document.querySelectorAll(".ledger .entry"));
    var active = new Set(); // active category filters, excluding "all"

    function render() {
      var showAll = active.size === 0;
      buttons.forEach(function (btn) {
        var f = btn.getAttribute("data-filter");
        var isActive = f === "all" ? showAll : active.has(f);
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
      entries.forEach(function (entry) {
        var tags = (entry.getAttribute("data-tags") || "").split(" ");
        var visible = showAll || tags.some(function (t) { return active.has(t); });
        entry.classList.toggle("is-hidden", !visible);
      });

      if (typeof gtag === "function") {
        gtag("event", "ledger_filter", {
          filters: showAll ? "all" : Array.from(active).join(",")
        });
      }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        if (f === "all") {
          active.clear();
        } else if (active.has(f)) {
          active.delete(f);
        } else {
          active.add(f);
        }
        render();
      });
    });

    render();
  });
})();
