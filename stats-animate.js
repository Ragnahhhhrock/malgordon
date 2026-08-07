(function () {
  var EASE = function (t) { return 1 - Math.pow(1 - t, 3); }; // easeOutCubic
  var DURATION = 1300;

  function parseTarget(text) {
    var m = text.match(/^([^\d]*)([\d,]+)(.*)$/);
    if (!m) return null;
    return {
      prefix: m[1],
      digits: m[2],
      suffix: m[3],
      value: parseInt(m[2].replace(/,/g, ""), 10)
    };
  }

  function formatValue(n, useCommas) {
    var rounded = Math.round(n);
    return useCommas ? rounded.toLocaleString("en-US") : String(rounded);
  }

  function animateNumber(el) {
    var parsed = parseTarget(el.textContent.trim());
    if (!parsed) return;
    var useCommas = parsed.digits.indexOf(",") !== -1;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / DURATION, 1);
      var eased = EASE(progress);
      var current = parsed.value * eased;
      el.textContent = parsed.prefix + formatValue(current, useCommas) + parsed.suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = parsed.prefix + parsed.digits + parsed.suffix;
      }
    }
    requestAnimationFrame(step);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var blocks = Array.prototype.slice.call(document.querySelectorAll("#stats .stat-block"));
    if (!blocks.length) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      blocks.forEach(function (b) { b.classList.add("in-view"); });
      return;
    }

    var animated = new WeakSet();

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || animated.has(entry.target)) return;
        var block = entry.target;
        var index = blocks.indexOf(block);
        var delay = Math.max(0, index) * 90;

        setTimeout(function () {
          block.classList.add("in-view", "count-active");
          var numberEl = block.querySelector(".stat-number");
          if (numberEl) animateNumber(numberEl);
        }, delay);

        animated.add(block);
        observer.unobserve(block);
      });
    }, { threshold: 0.35 });

    blocks.forEach(function (b) { observer.observe(b); });
  });
})();
