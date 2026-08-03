(function () {
  const D = window.SITE_DATA;
  if (!D) return;

  function frag(id) {
    const tpl = document.getElementById(id);
    return tpl ? tpl.content : null;
  }

  //  About 
  (function renderAbout() {
    const f = frag("tpl-about");
    if (!f) return;
    f.querySelector(".cv-name").textContent = "Hello, I'm " + D.about.name;
    f.querySelector(".cv-role").textContent = D.about.role;
    f.querySelector(".about-text").textContent = D.about.text;

    const statsWrap = f.querySelector(".about-stats");
    statsWrap.innerHTML = "";
    D.about.stats.forEach(function (s) {
      const div = document.createElement("div");
      div.className = "stat";
      div.innerHTML = "<strong>" + s.value + "</strong><span>" + s.label + "</span>";
      statsWrap.appendChild(div);
    });
  })();

  //  Projects 
  (function renderProjects() {
    const f = frag("tpl-project");
    if (!f) return;
    const list = f.querySelector(".project-list");
    list.innerHTML = "";
    D.projects.forEach(function (p) {
      const a = document.createElement("a");
      a.className = "project-card";
      a.href = p.link || "#";
      a.innerHTML =
        '<span class="project-tag">' + p.tag + "</span>" +
        "<h4>" + p.title + "</h4>" +
        "<p>" + p.description + "</p>";
      list.appendChild(a);
    });
  })();

  //  Skills 
  (function renderSkills() {
    const f = frag("tpl-skills");
    if (!f) return;
    const grid = f.querySelector(".skills-grid");
    grid.innerHTML = "";
    D.skills.forEach(function (s) {
      const span = document.createElement("span");
      span.className = "skill-chip";
      span.textContent = s;
      grid.appendChild(span);
    });
  })();

  //  Contact 
  (function renderContact() {
    const f = frag("tpl-contact");
    if (!f) return;
    f.querySelector(".cv-role").textContent = D.contact.intro;

    const rows = f.querySelectorAll(".contact-row");
    // row order in the HTML: Email, GitHub, LinkedIn, Resume
    if (rows[0]) {
      rows[0].href = "mailto:" + D.contact.email;
      rows[0].querySelector(".row-value").textContent = D.contact.email;
    }
    if (rows[1]) {
      rows[1].href = D.contact.githubUrl;
      rows[1].querySelector(".row-value").textContent = D.contact.github;
    }
    if (rows[2]) {
      rows[2].href = D.contact.linkedinUrl;
      rows[2].querySelector(".row-value").textContent = D.contact.linkedin;
    }
    if (rows[3]) {
      rows[3].href = D.contact.resumeUrl;
      rows[3].setAttribute("download", "");
    }
  })();

  //  CV / Resume 
  (function renderCV() {
    const f = frag("tpl-cv");
    if (!f) return;
    f.querySelector(".cv-name").textContent = D.cv.name;
    f.querySelector(".cv-role").textContent = D.cv.role;

    const blocks = f.querySelectorAll(".cv-block ul");
    if (blocks[0]) {
      blocks[0].innerHTML = D.cv.coreSkills.map(function (s) { return "<li>" + s + "</li>"; }).join("");
    }
    if (blocks[1]) {
      blocks[1].innerHTML = D.cv.experience.map(function (s) { return "<li>" + s + "</li>"; }).join("");
    }
    const dl = f.querySelector(".cv-download");
    if (dl) {
      dl.href = D.cv.resumeUrl;
      dl.setAttribute("download", "");
    }
  })();

  //  ChatBot 
  (function renderBot() {
    const f = frag("tpl-bot");
    if (!f) return;
    f.querySelector(".bot-title").textContent = D.bot.title;
    f.querySelector(".bot-bubble").textContent = D.bot.greeting;
    f.querySelector(".bot-inputbar input").placeholder = D.bot.placeholder;
    f.querySelector(".bot-note").textContent = D.bot.note;
  })();
})();