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
      panels.forEach(function (panel) {
        panel.hidden = panel.id !== target;
      });
      if (target === "tab-skills" && typeof window.animateSkillsChart === "function") {
        window.animateSkillsChart();
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
