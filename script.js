(() => {
  "use strict";

  const defaults = {
    profile: {
      name: "Md Feroj Hossain",
      identity: "Electrical & Electronic Engineering (EEE) Student",
      bio: "I am an enthusiastic Electrical and Electronic Engineering student at Jamalpur Science and Technology University. I am passionate about electrical engineering, modern technology, programming and innovation. I enjoy developing practical engineering projects and continuously improving my technical skills to solve real-world problems.",
      email: "feroj8954@gmail",
      phone: "",
      location: "Pabna, Bangladesh",
      photo: "assets/profile-placeholder.svg",
      cv: "",
      socials: { facebook: "", linkedin: "", github: "", instagram: "" }
    },
    site: {
      title: "Md Feroj Hossain | EEE Student",
      heroEyebrow: "ELECTRICAL & ELECTRONIC ENGINEERING",
      heroTitle: "Hello, I'm Md Feroj Hossain.",
      heroRole: "EEE Student & Aspiring Engineer",
      heroDescription: "I am passionate about engineering, technology, programming and innovation.",
      logoText: "Md Feroj Hossain"
    },
    theme: {
      primary: "#2563eb", secondary: "#7c3aed", accent: "#a78bfa",
      font: "Modern Sans-serif", mode: "system",
      heroBackground: "linear-gradient(125deg, #101b49 0%, #30206f 52%, #2563eb 100%)",
      heroBrightness: 1, heroOverlay: 0.12
    },
    sections: [
      { id: "about", title: "About Me", visible: true, type: "about" },
      { id: "education", title: "Education", visible: true, type: "education" },
      { id: "skills", title: "Skills", visible: true, type: "skills" },
      { id: "projects", title: "Projects", visible: true, type: "projects" },
      { id: "experience", title: "Experience", visible: true, type: "experience" },
      { id: "certificates", title: "Certificates", visible: true, type: "certificates" },
      { id: "research", title: "Research", visible: true, type: "research" },
      { id: "contact", title: "Contact", visible: true, type: "contact" }
    ],
    education: [
      { title: "Jamalpur Science and Technology University", detail: "B.Sc. in Electrical & Electronic Engineering · 7th Semester" },
      { title: "Higher Secondary Certificate (HSC)", detail: "GPA: 5.00" },
      { title: "Secondary School Certificate (SSC)", detail: "GPA: 5.00" }
    ],
    skills: ["MATLAB & Simulink", "C Programming", "Arduino", "Electrical Circuit Analysis", "Power System", "Microsoft Word", "Microsoft PowerPoint"],
    projects: [
      { title: "Ultrasonic Radar System", description: "An Arduino-based object detection project using an ultrasonic sensor and servo motor.", image: "assets/project-placeholder.svg", tags: "Arduino · Ultrasonic Sensor · Servo Motor", link: "" },
      { title: "Arduino-based Project", description: "An electronics project. Add the project details, features and results from the admin panel.", image: "assets/project-placeholder.svg", tags: "Arduino · Electronics", link: "" }
    ],
    experience: [
      { title: "University Volunteer", organization: "Jamalpur Science and Technology University", description: "Guided new examination candidates to their assigned examination halls and helped them find the right direction." }
    ],
    certificates: [],
    research: []
  };

  const $ = (selector) => document.querySelector(selector);
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const safeUrl = (value) => {
    if (!value || typeof value !== "string") return "";
    try {
      const url = new URL(value, window.location.href);
      if (["http:", "https:", "mailto:"].includes(url.protocol)) return url.href;
    } catch (_) { return ""; }
    return "";
  };
  const clone = (value) => JSON.parse(JSON.stringify(value));
  let content = clone(defaults);

  function mergeDefaults(saved) {
    if (!saved || typeof saved !== "object") return clone(defaults);
    return {
      ...clone(defaults), ...saved,
      profile: { ...defaults.profile, ...(saved.profile || {}), socials: { ...defaults.profile.socials, ...((saved.profile || {}).socials || {}) } },
      site: { ...defaults.site, ...(saved.site || {}) },
      theme: { ...defaults.theme, ...(saved.theme || {}) },
      sections: Array.isArray(saved.sections) ? saved.sections : clone(defaults.sections),
      education: Array.isArray(saved.education) ? saved.education : clone(defaults.education),
      skills: Array.isArray(saved.skills) ? saved.skills : clone(defaults.skills),
      projects: Array.isArray(saved.projects) ? saved.projects : clone(defaults.projects),
      experience: Array.isArray(saved.experience) ? saved.experience : clone(defaults.experience),
      certificates: Array.isArray(saved.certificates) ? saved.certificates : [],
      research: Array.isArray(saved.research) ? saved.research : []
    };
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function render() {
    const p = content.profile, s = content.site, t = content.theme;
    document.title = s.title || `${p.name} | Portfolio`;
    $("#brand-name").textContent = s.logoText || p.name;
    const brandLogo = $("#brand-logo"), brandMark = $("#brand-mark");
    if (s.logoImage && safeUrl(s.logoImage)) { brandLogo.src = safeUrl(s.logoImage); brandLogo.hidden = false; brandMark.hidden = true; }
    else { brandLogo.hidden = true; brandMark.hidden = false; }
    $("#footer-name").textContent = p.name;
    $("#hero-eyebrow").textContent = s.heroEyebrow;
    $("#hero-title").textContent = s.heroTitle;
    $("#hero-role").textContent = s.heroRole;
    $("#hero-description").textContent = s.heroDescription;
    $("#hero-location").textContent = p.location;
    $("#about-text").textContent = p.bio;
    $("#contact-location").textContent = p.location;
    const email = $("#contact-email");
    email.href = safeUrl(`mailto:${p.email}`) || "#contact";
    email.querySelector("span").textContent = p.email || "Email not added";
    const photo = $("#profile-image");
    photo.src = safeUrl(p.photo) || "assets/profile-placeholder.svg";
    photo.onerror = () => { photo.onerror = null; photo.src = "assets/profile-placeholder.svg"; };
    document.documentElement.style.setProperty("--primary", t.primary);
    document.documentElement.style.setProperty("--secondary", t.secondary);
    document.documentElement.style.setProperty("--accent", t.accent);
    document.documentElement.style.setProperty("--hero-background", t.heroBackground);
    document.documentElement.style.setProperty("--hero-brightness", String(Math.min(1.5, Math.max(.4, Number(t.heroBrightness) || 1))));
    document.documentElement.style.setProperty("--hero-overlay", String(Math.min(.8, Math.max(0, Number(t.heroOverlay) || 0))));
    document.documentElement.style.setProperty("--font-family", t.font === "Modern Sans-serif" ? 'Inter, ui-sans-serif, system-ui, sans-serif' : t.font);
    applyMode(t.mode);

    $("#education-list").innerHTML = content.education.map(item => `<article class="timeline-item"><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.detail)}</p></article>`).join("");
    $("#skills-list").innerHTML = content.skills.map(skill => `<div class="skill-item">${escapeHTML(skill)}</div>`).join("");
    $("#projects-list").innerHTML = content.projects.map(project => {
      const img = safeUrl(project.image) || "assets/project-placeholder.svg";
      const link = safeUrl(project.link);
      return `<article class="project-card"><img src="${escapeHTML(img)}" alt="${escapeHTML(project.title)} image" onerror="this.onerror=null;this.src='assets/project-placeholder.svg'"><div class="project-card-body"><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.description)}</p><span class="tag">${escapeHTML(project.tags || "Project")}</span>${link ? `<p><a class="project-link" href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">View project ↗</a></p>` : ""}</div></article>`;
    }).join("");
    $("#experience-list").innerHTML = content.experience.map(item => `<article><h3>${escapeHTML(item.title)}</h3><p><strong>${escapeHTML(item.organization)}</strong></p><p>${escapeHTML(item.description)}</p></article>`).join("");
    renderSimpleList("#certificates-list", content.certificates);
    renderSimpleList("#research-list", content.research);
    const socialNames = ["facebook", "linkedin", "github", "instagram"];
    $("#social-links").innerHTML = socialNames.map(name => {
      const url = safeUrl(p.socials[name]);
      return url ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${name[0].toUpperCase() + name.slice(1)}</a>` : "";
    }).join("");

    const nav = content.sections.filter(section => section.visible).map(section =>
      `<li><a href="#${escapeHTML(section.id)}">${escapeHTML(section.title)}</a></li>`
    ).join("");
    $("#nav-list").innerHTML = nav;
    document.querySelectorAll("[data-section]").forEach(node => {
      const section = content.sections.find(item => item.id === node.id);
      node.hidden = !section || !section.visible;
    });
    setupActiveNav();
  }

  function renderSimpleList(selector, items) {
    const node = $(selector);
    if (!items.length) {
      node.innerHTML = `<p class="empty-state">${selector.includes("research") ? "Research details can be added from the admin panel." : "Certificates can be added from the admin panel."}</p>`;
      return;
    }
    node.innerHTML = items.map(item => `<article class="simple-card"><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description || "")}</p></article>`).join("");
  }

  function applyMode(mode) {
    const saved = localStorage.getItem("portfolio-theme");
    const resolved = saved || (mode === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode);
    document.documentElement.dataset.theme = resolved === "dark" ? "dark" : "light";
    $("#mode-toggle").textContent = resolved === "dark" ? "☾" : "☼";
  }

  function setupActiveNav() {
    const links = [...document.querySelectorAll("#nav-list a")];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) links.forEach(link => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    content.sections.forEach(section => {
      const node = document.getElementById(section.id);
      if (node && section.visible) observer.observe(node);
    });
  }

  async function loadFromSupabase() {
    const config = window.PORTFOLIO_CONFIG || {};
    if (!config.supabaseUrl || config.supabaseUrl.includes("YOUR-PROJECT") || !config.supabaseAnonKey || config.supabaseAnonKey.includes("YOUR_SUPABASE")) return;
    if (!window.supabase?.createClient) return;
    try {
      const client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
      const { data, error } = await client.from(config.tableName || "portfolio").select("content").limit(1).maybeSingle();
      if (error) throw error;
      if (data?.content) { content = mergeDefaults(data.content); render(); }
    } catch (error) {
      console.warn("Portfolio content could not be loaded from Supabase:", error.message);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("#year").textContent = new Date().getFullYear();
    render();
    loadFromSupabase();
    $("#mode-toggle").addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("portfolio-theme", next);
      applyMode(next);
    });
    $("#menu-toggle").addEventListener("click", () => {
      const nav = $("#main-nav"), expanded = $("#menu-toggle").getAttribute("aria-expanded") === "true";
      nav.classList.toggle("open", !expanded);
      $("#menu-toggle").setAttribute("aria-expanded", String(!expanded));
    });
    $("#main-nav").addEventListener("click", event => {
      if (event.target.closest("a")) { $("#main-nav").classList.remove("open"); $("#menu-toggle").setAttribute("aria-expanded", "false"); }
    });
  });
})();
