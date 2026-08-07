(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var breakdowns = Array.prototype.slice.call(document.querySelectorAll(".entry-breakdown"));
    if (!breakdowns.length) return;

    breakdowns.forEach(function (breakdown, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "entry-details-toggle";
      btn.setAttribute("aria-expanded", "false");
      var toggleId = "entry-breakdown-" + i;
      breakdown.id = toggleId;
      btn.setAttribute("aria-controls", toggleId);
      btn.innerHTML = '<span class="label">Show details</span><span class="chevron">▾</span>';

      breakdown.parentNode.insertBefore(btn, breakdown);

      btn.addEventListener("click", function () {
        var expanded = breakdown.classList.contains("expanded");
        var label = btn.querySelector(".label");

        if (expanded) {
          breakdown.style.maxHeight = breakdown.scrollHeight + "px";
          // force reflow so the browser registers the current height
          // before collapsing to 0, otherwise it jumps instead of animating
          void breakdown.offsetHeight;
          breakdown.style.maxHeight = "0px";
          breakdown.classList.remove("expanded");
          btn.setAttribute("aria-expanded", "false");
          label.textContent = "Show details";
        } else {
          breakdown.classList.add("expanded");
          breakdown.style.maxHeight = breakdown.scrollHeight + "px";
          btn.setAttribute("aria-expanded", "true");
          label.textContent = "Hide details";
        }

        if (typeof gtag === "function") {
          gtag("event", "ledger_details_toggle", { expanded: !expanded });
        }
      });

      // once the open transition finishes, release the fixed max-height
      // so the box can grow/shrink naturally if content reflows (e.g. resize)
      breakdown.addEventListener("transitionend", function (e) {
        if (e.propertyName !== "max-height") return;
        if (breakdown.classList.contains("expanded")) {
          breakdown.style.maxHeight = "none";
        }
      });
    });
  });
})();
