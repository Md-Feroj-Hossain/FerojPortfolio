(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const config = window.PORTFOLIO_CONFIG || {};
  const defaults = {
    profile: { name: "Md Feroj Hossain", identity: "Electrical & Electronic Engineering (EEE) Student", bio: "", email: "feroj8954@gmail", phone: "", location: "Pabna, Bangladesh", photo: "assets/profile-placeholder.svg", cv: "", socials: { facebook: "", linkedin: "", github: "", instagram: "" } },
    site: { title: "Md Feroj Hossain | EEE Student", heroEyebrow: "ELECTRICAL & ELECTRONIC ENGINEERING", heroTitle: "Hello, I'm Md Feroj Hossain.", heroRole: "EEE Student & Aspiring Engineer", heroDescription: "I am passionate about engineering, technology, programming and innovation.", logoText: "Md Feroj Hossain" },
    theme: { primary: "#2563eb", secondary: "#7c3aed", accent: "#a78bfa", font: "Modern Sans-serif", mode: "system", heroBackground: "linear-gradient(125deg, #101b49 0%, #30206f 52%, #2563eb 100%)", heroBrightness: 1, heroOverlay: .12 },
    sections: [{id:"about",title:"About Me",visible:true,type:"about"},{id:"education",title:"Education",visible:true,type:"education"},{id:"skills",title:"Skills",visible:true,type:"skills"},{id:"projects",title:"Projects",visible:true,type:"projects"},{id:"experience",title:"Experience",visible:true,type:"experience"},{id:"certificates",title:"Certificates",visible:true,type:"certificates"},{id:"research",title:"Research",visible:true,type:"research"},{id:"contact",title:"Contact",visible:true,type:"contact"}],
    education: [{title:"Jamalpur Science and Technology University",detail:"B.Sc. in Electrical & Electronic Engineering · 7th Semester"},{title:"Higher Secondary Certificate (HSC)",detail:"GPA: 5.00"},{title:"Secondary School Certificate (SSC)",detail:"GPA: 5.00"}],
    skills: ["MATLAB & Simulink","C Programming","Arduino","Electrical Circuit Analysis","Power System","Microsoft Word","Microsoft PowerPoint"],
    projects: [{title:"Ultrasonic Radar System",description:"An Arduino-based object detection project using an ultrasonic sensor and servo motor.",image:"assets/project-placeholder.svg",tags:"Arduino · Ultrasonic Sensor · Servo Motor",link:""},{title:"Arduino-based Project",description:"Add the project details, features and results here.",image:"assets/project-placeholder.svg",tags:"Arduino · Electronics",link:""}],
    experience: [{title:"University Volunteer",organization:"Jamalpur Science and Technology University",description:"Guided new examination candidates to their assigned examination halls and helped them find the right direction."}],
    certificates: [], research: []
  };
  let client, user, rowId = null, content = structuredClone(defaults), dirty = false, draggingIndex = null;

  function toast(message) { const node = $("#toast"); node.textContent = message; node.classList.add("show"); setTimeout(() => node.classList.remove("show"), 2600); }
  function setDirty() { dirty = true; $("#save-status").textContent = "Unsaved changes"; $("#save-status").classList.add("dirty"); $("#footer-message").textContent = "You have unpublished changes."; }
  function clearDirty() { dirty = false; $("#save-status").textContent = "All changes saved"; $("#save-status").classList.remove("dirty"); $("#footer-message").textContent = "Your latest content is published."; }
  function getPath(path) { return path.split(".").reduce((value, key) => value?.[key], content); }
  function setPath(path, value) { const keys = path.split("."); const last = keys.pop(); const target = keys.reduce((obj, key) => obj[key], content); target[last] = value; setDirty(); }
  function escapeHTML(value) { return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char])); }
  function safeUrl(value) { try { const u = new URL(value, location.href); return ["http:","https:","mailto:"].includes(u.protocol) ? u.href : ""; } catch (_) { return ""; } }
  function merge(data) {
    const merged = structuredClone(defaults);
    for (const key of Object.keys(data || {})) {
      if (Array.isArray(data[key])) merged[key] = data[key];
      else if (data[key] && typeof data[key] === "object") merged[key] = { ...(merged[key] || {}), ...data[key] };
      else merged[key] = data[key];
    }
    merged.profile.socials = { ...defaults.profile.socials, ...(data?.profile?.socials || {}) };
    return merged;
  }
  function fillFields() {
    document.querySelectorAll("[data-path]").forEach(input => {
      const value = getPath(input.dataset.path);
      input.value = value ?? "";
      input.addEventListener("input", () => {
        const next = input.type === "range" ? Number(input.value) : input.value;
        setPath(input.dataset.path, next);
        if (input.dataset.path === "theme.heroBrightness") $("#brightness-value").textContent = Number(next).toFixed(2);
        if (input.dataset.path === "theme.heroOverlay") $("#overlay-value").textContent = Number(next).toFixed(2);
      });
    });
    $("#profile-preview").src = safeUrl(content.profile.photo) || "../assets/profile-placeholder.svg";
    $("#cv-status").textContent = content.profile.cv ? "CV uploaded" : "No CV uploaded";
    renderRepeaters(); renderSections();
  }
  function renderRepeaters() {
    renderRepeater("education", ["title","detail"]);
    renderRepeater("skills", ["value"]);
    renderRepeater("projects", ["title","description","tags","link"]);
    renderRepeater("experience", ["title","organization","description"]);
    renderRepeater("certificates", ["title","description"]);
    renderRepeater("research", ["title","description"]);
  }
  function renderRepeater(key, fields) {
    const host = $(`#${key}-editor`); if (!host) return;
    host.innerHTML = "";
    content[key].forEach((item, index) => {
      const card = document.createElement("div"); card.className = "repeat-item";
      fields.forEach(field => {
        const label = document.createElement("label"); label.textContent = field === "value" ? "Skill" : field[0].toUpperCase() + field.slice(1);
        const input = field === "description" || field === "detail" ? document.createElement("textarea") : document.createElement("input");
        input.value = field === "value" ? item : (item[field] || "");
        input.addEventListener("input", () => {
          if (field === "value") content[key][index] = input.value; else content[key][index][field] = input.value;
          setDirty();
        });
        label.append(input); if (field === "description" || field === "detail") label.classList.add("wide"); card.append(label);
      });
      const remove = document.createElement("button"); remove.className = "remove-button"; remove.type = "button"; remove.textContent = "Remove";
      remove.addEventListener("click", () => { content[key].splice(index, 1); setDirty(); renderRepeater(key, fields); });
      card.append(remove);
      if (key === "projects") {
        const upload = document.createElement("div"); upload.className = "project-upload";
        const file = document.createElement("input"); file.type = "file"; file.accept = "image/*";
        const button = document.createElement("button"); button.type = "button"; button.className = "secondary-button"; button.textContent = "Upload project image";
        button.addEventListener("click", async () => { if (!file.files[0]) return toast("Choose an image first."); const url = await uploadFile(file.files[0], `projects/${Date.now()}-${file.files[0].name}`); if (url) { content.projects[index].image = url; setDirty(); toast("Project image uploaded. Publish to save the change."); } });
        upload.append(file, button); card.append(upload);
      }
      host.append(card);
    });
  }
  function renderSections() {
    const host = $("#sections-editor"); host.innerHTML = "";
    content.sections.forEach((section, index) => {
      const row = document.createElement("div"); row.className = "section-row"; row.draggable = true; row.dataset.index = index;
      row.innerHTML = `<span class="drag-handle" aria-label="Drag to reorder">⠿</span><strong>${escapeHTML(section.title)}</strong><label><input type="checkbox" ${section.visible ? "checked" : ""}> Visible</label><button type="button">Delete</button>`;
      row.querySelector("input").addEventListener("change", event => { content.sections[index].visible = event.target.checked; setDirty(); });
      row.querySelector("button").addEventListener("click", () => { if (!confirm(`Delete the ${section.title} section from navigation?`)) return; content.sections.splice(index,1); setDirty(); renderSections(); });
      row.addEventListener("dragstart", () => { draggingIndex = index; row.classList.add("dragging"); });
      row.addEventListener("dragend", () => row.classList.remove("dragging"));
      row.addEventListener("dragover", event => event.preventDefault());
      row.addEventListener("drop", event => {
        event.preventDefault(); const targetIndex = Number(row.dataset.index);
        if (draggingIndex === null || draggingIndex === targetIndex) return;
        const [moved] = content.sections.splice(draggingIndex,1); content.sections.splice(targetIndex,0,moved);
        draggingIndex = null; setDirty(); renderSections();
      });
      host.append(row);
    });
  }
  function addItem(key) {
    const templates = { education:{title:"New education",detail:"Details"}, skills:"New skill", projects:{title:"New project",description:"Project description",image:"",tags:"",link:""}, experience:{title:"New role",organization:"Organization",description:"Description"}, certificates:{title:"New certificate",description:"Issuer and date"}, research:{title:"New research",description:"Summary"} };
    content[key].push(structuredClone(templates[key])); setDirty(); renderRepeater(key, key==="education"?["title","detail"]:key==="skills"?["value"]:key==="projects"?["title","description","tags","link"]:key==="experience"?["title","organization","description"]:["title","description"]);
  }
  async function uploadFile(file, path) {
    if (!client || !user) { toast("Sign in and configure Supabase first."); return ""; }
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const objectPath = `${user.id}/${Date.now()}-${safeName}`;
    const { error } = await client.storage.from(config.storageBucket || "portfolio-media").upload(objectPath, file, { upsert: true, contentType: file.type });
    if (error) { toast(`Upload failed: ${error.message}`); return ""; }
    const { data } = client.storage.from(config.storageBucket || "portfolio-media").getPublicUrl(objectPath);
    return data.publicUrl;
  }
  async function handleUpload(kind) {
    const input = $(`#${kind}-upload`) || (kind === "background" ? $("#background-upload") : null);
    if (!input?.files?.[0]) return toast("Choose a file first.");
    const file = input.files[0];
    if (kind === "cv" && file.type !== "application/pdf") return toast("Please select a PDF file.");
    const url = await uploadFile(file, kind);
    if (!url) return;
    if (kind === "profile") { content.profile.photo = url; $("#profile-preview").src = url; }
    if (kind === "logo") { content.site.logoImage = url; $("#logo-preview").src = url; }
    if (kind === "cv") { content.profile.cv = url; $("#cv-status").textContent = "CV uploaded"; }
    if (kind === "background") $("#background-url").value = url;
    setDirty(); toast("Upload complete. Select Save & Publish to publish content changes.");
  }
  async function loadContent() {
    const { data, error } = await client.from(config.tableName || "portfolio").select("id,content").limit(1).maybeSingle();
    if (error) throw error;
    if (data) { rowId = data.id; content = merge(data.content); }
    fillFields();
  }
  async function publish() {
    if (!client || !user) return;
    const payload = { owner_id: user.id, content, updated_at: new Date().toISOString() };
    let result;
    if (rowId) result = await client.from(config.tableName || "portfolio").update(payload).eq("id", rowId).select("id").single();
    else result = await client.from(config.tableName || "portfolio").insert(payload).select("id").single();
    if (result.error) throw result.error;
    rowId = result.data.id; clearDirty(); toast("Portfolio published successfully.");
  }
  function downloadJson() {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "feroj-portfolio-backup.json"; a.click(); URL.revokeObjectURL(url);
  }
  async function importJson() {
    const file = $("#import-file").files[0]; if (!file) return toast("Choose a JSON file first.");
    try { content = merge(JSON.parse(await file.text())); fillFields(); setDirty(); toast("Backup imported. Review and publish when ready."); }
    catch (_) { toast("Invalid JSON backup file."); }
  }
  function initTabs() {
    document.querySelectorAll(".tab").forEach(button => button.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(tab => tab.classList.toggle("active", tab === button));
      document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.toggle("active", panel.id === `tab-${button.dataset.tab}`));
    }));
  }
  async function startDashboard(session) {
    user = session.user;
    $("#login-panel").hidden = true; $("#dashboard").hidden = false;
    $("#admin-user").textContent = user.email || "Authenticated admin";
    await loadContent(); clearDirty();
  }
  document.addEventListener("DOMContentLoaded", async () => {
    initTabs();
    if (!config.supabaseUrl || config.supabaseUrl.includes("YOUR-PROJECT") || !config.supabaseAnonKey || config.supabaseAnonKey.includes("YOUR_SUPABASE")) {
      $("#login-message").textContent = "Add your Supabase URL and publishable/anon key in ../config.js first.";
      return;
    }
    if (!window.supabase?.createClient) { $("#login-message").textContent = "Supabase library did not load. Check your internet connection."; return; }
    client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    const { data: { session } } = await client.auth.getSession();
    if (session) { try { await startDashboard(session); } catch (error) { toast(error.message); } }
    client.auth.onAuthStateChange(async (_event, sessionNow) => {
      if (sessionNow && $("#dashboard").hidden) { try { await startDashboard(sessionNow); } catch (error) { toast(error.message); } }
    });
    $("#login-form").addEventListener("submit", async event => {
      event.preventDefault(); $("#login-message").textContent = "";
      const { data, error } = await client.auth.signInWithPassword({ email: $("#login-email").value.trim(), password: $("#login-password").value });
      if (error) $("#login-message").textContent = error.message;
      else { try { await startDashboard(data.session); } catch (loadError) { $("#login-message").textContent = loadError.message; } }
    });
    $("#logout-button").addEventListener("click", async () => { await client.auth.signOut(); location.reload(); });
    $("#publish-button").addEventListener("click", async () => {
      if (!confirm("Publish these changes to your public portfolio?")) return;
      try { await publish(); } catch (error) { toast(`Publish failed: ${error.message}`); }
    });
    document.querySelectorAll("[data-add]").forEach(button => button.addEventListener("click", () => addItem(button.dataset.add)));
    document.querySelectorAll("[data-upload]").forEach(button => button.addEventListener("click", () => handleUpload(button.dataset.upload)));
    $("#add-section").addEventListener("click", () => {
      const title = $("#new-section-title").value.trim(), type = $("#new-section-type").value;
      if (!title) return toast("Enter a section title.");
      const existing = content.sections.find(section => section.id === type);
      if (existing) { existing.visible = true; existing.title = title; }
      else content.sections.push({ id: type, title, visible: true, type });
      $("#new-section-title").value = ""; setDirty(); renderSections();
      toast("Section added or restored. Each supported section has its own public content area.");
    });
    $("#export-button").addEventListener("click", downloadJson);
    $("#import-button").addEventListener("click", importJson);
    window.addEventListener("beforeunload", event => { if (dirty) { event.preventDefault(); event.returnValue = ""; } });
  });
})();
