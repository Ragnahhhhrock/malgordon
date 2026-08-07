(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var tabBar = document.querySelector(".tab-bar");
    if (!tabBar) return;

    var buttons = Array.prototype.slice.call(tabBar.querySelectorAll(".tab-btn"));
    var panels = Array.prototype.slice.call(document.querySelectorAll(".tab-panel"));

    function activate(target) {
      buttons.forEach(function (btn) {
        var isActive = btn.getAttribute("data-tab") === target;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      var currentPanel = panels.find(function (p) { return !p.hidden; });
      var nextPanel = panels.find(function (p) { return p.id === target; });

      function showNext() {
        panels.forEach(function (panel) {
          panel.hidden = panel.id !== target;
        });
        if (nextPanel) {
          nextPanel.classList.add("tab-fading");
          // force reflow so the browser registers opacity:0 before we
          // remove the class and transition back to opacity:1
          void nextPanel.offsetHeight;
          nextPanel.classList.remove("tab-fading");
        }
        if (target === "tab-skills" && typeof window.animateSkillsChart === "function") {
          window.animateSkillsChart();
        }
      }

      if (currentPanel && currentPanel !== nextPanel) {
        currentPanel.classList.add("tab-fading");
        setTimeout(showNext, 180);
      } else {
        showNext();
      }

      if (typeof gtag === "function") {
        gtag("event", "ledger_tab_view", { tab: target });
      }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activate(btn.getAttribute("data-tab"));
      });
    });
  });
})();
