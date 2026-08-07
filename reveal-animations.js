(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var targets = Array.prototype.slice.call(
      document.querySelectorAll(".entry, .rec-card")
    );
    if (!targets.length) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      targets.forEach(function (t) { t.classList.add("in-view"); });
      return;
    }

    // stagger delay based on position within its own parent container,
    // capped so long lists (the 20-entry career ledger) don't take forever
    function staggerDelay(el) {
      var siblings = Array.prototype.slice.call(el.parentElement.children)
        .filter(function (c) { return c.classList.contains(el.classList[0]) || c.matches(".entry, .rec-card"); });
      var index = siblings.indexOf(el);
      return Math.min(index, 10) * 55;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = staggerDelay(el);
        setTimeout(function () {
          el.classList.add("in-view");
        }, delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    targets.forEach(function (t) { observer.observe(t); });
  });
})();
