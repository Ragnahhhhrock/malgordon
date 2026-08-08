(function () {
  var INITIALS_MAP = {
    "WouldPietEat": "WP",
    "Hornet Bay": "HB",
    "PropCheq": "PC",
    "WouldPietEat · Hornet Bay · PropCheq": "MG",
    "Spacecubed": "SC",
    "Plus Eight Accelerator Program": "P8",
    "Edith Cowan University (ECU)": "ECU",
    "AdShirts": "AS",
    "Startup Weekend Perth": "SW",
    "Techstars Startup Weekend": "SW",
    "Threadster": "TH",
    "Buildcloud": "BC",
    "Gordon Family Office": "GFO",
    "Digital Marketing Agency": "DMA",
    "Blingvaders": "BV",
    "The Community Newspaper Group (now PerthNow)": "CNG",
    "Aluminium West": "AW",
    "The Sleep Cap": "SC",
    "Asgard Wealth Solutions": "AWS",
    "Charttv": "CT",
    "Elliottician": "EL",
    "ASX Perpetual Registrars (now MUFG Corporate Markets)": "ASX",
    "Messages On Hold": "MOH",
    "eGroup WA": "EG",
    "Somersoft & PropertyChat": "S&P",
    "Brodie McCulloch Perth Lord Mayoral Bid": "BM",
    "Silicon Beach": "SB",
    "Joondalup Learning Precinct Mentoring Program": "JLP",
    "Golden Key International Honour Society": "GK",
    "Rally Australia": "RA",
    "Curtin University": "CU",
    "PhDo — Batch #1": "PD",
    "PS146": "PS",
    "AWARD School": "AW",
    "Wesley College": "WC"
  };

  var LOGO_MAP = {
    "Buildcloud": "/assets/logos/buildcloud.png",
    "Blingvaders": "/assets/logos/blingvaders.jpg",
    "Aluminium West": "/assets/logos/aluminiumwest.png",
    "Threadster": "/assets/logos/threadster.png",
    "Amman Pasha Hotel": "/assets/logos/ammanpashahotel.jpg"
  };

  var STOP_WORDS = ["the", "of", "and", "for", "at", "in", "on", "a", "an"];

  function fallbackInitials(text) {
    var words = text
      .replace(/[^\w\s&]/g, " ")
      .split(/\s+/)
      .filter(function (w) { return w && STOP_WORDS.indexOf(w.toLowerCase()) === -1; });
    if (!words.length) return "??";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  function initialsFor(text) {
    if (INITIALS_MAP.hasOwnProperty(text)) return INITIALS_MAP[text];
    return fallbackInitials(text);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".entry > h3").forEach(function (h3) {
      var text = h3.textContent.trim();

      var wrapper = document.createElement("div");
      wrapper.className = "entry-title-row";

      var badge = document.createElement("span");
      badge.className = "org-badge";
      badge.setAttribute("aria-hidden", "true");

      if (LOGO_MAP.hasOwnProperty(text)) {
        badge.classList.add("org-badge-logo");
        var img = document.createElement("img");
        img.src = LOGO_MAP[text];
        img.alt = "";
        badge.appendChild(img);
      } else {
        badge.textContent = initialsFor(text);
      }

      h3.parentNode.insertBefore(wrapper, h3);
      wrapper.appendChild(badge);
      wrapper.appendChild(h3);
    });
  });
})();
