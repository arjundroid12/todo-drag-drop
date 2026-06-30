/* Kanban Todo with Drag & Drop — vanilla JS */
(() => {
  "use strict";
  const STORAGE_KEY = "kanban-todo.tasks";
  const THEME_KEY = "kanban-todo.theme";

  let tasks = [];
  let dragId = null;

  const load = () => {
    try { tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
    catch { tasks = []; }
  };
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  const $ = (s) => document.querySelector(s);

  function addTask(text, priority, due) {
    const task = {
      id: uid(),
      text: text.trim(),
      priority: priority || "medium",
      due: due || null,
      status: "todo",
      createdAt: Date.now(),
    };
    tasks.unshift(task);
    save();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    save();
    render();
  }

  function moveTask(id, newStatus) {
    const t = tasks.find((x) => x.id === id);
    if (t && ["todo", "progress", "done"].includes(newStatus)) {
      t.status = newStatus;
      save();
      render();
    }
  }

  function render() {
    ["todo", "progress", "done"].forEach((status) => {
      const zone = document.querySelector(`[data-dropzone="${status}"]`);
      zone.innerHTML = "";
      const items = tasks.filter((t) => t.status === status);
      items.forEach((t) => zone.appendChild(renderTask(t)));
      $(`#count-${status}`).textContent = items.length;
    });

    // Stats
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const overdue = tasks.filter((t) => t.due && t.due < new Date().toISOString().slice(0, 10) && t.status !== "done").length;
    $("#stats").innerHTML = `
      <span class="stat-pill">Total: <strong>${total}</strong></span>
      <span class="stat-pill">Done: <strong>${done}</strong></span>
      <span class="stat-pill">Overdue: <strong>${overdue}</strong></span>
    `;
  }

  function renderTask(t) {
    const today = new Date().toISOString().slice(0, 10);
    const overdue = t.due && t.due < today && t.status !== "done";
    const div = document.createElement("div");
    div.className = `task priority-${t.priority}`;
    div.draggable = true;
    div.dataset.id = t.id;
    div.innerHTML = `
      <div class="task__text">${escapeHtml(t.text)}</div>
      <div class="task__meta">
        <span class="task__due ${overdue ? "overdue" : ""}">${t.due ? "📅 " + t.due : ""}</span>
        <div class="task__actions">
          ${t.status !== "done" ? '<button class="complete" title="Mark done">✓</button>' : '<button class="undo" title="Move back">↩</button>'}
          <button class="delete" title="Delete">🗑</button>
        </div>
      </div>
    `;
    // Drag handlers
    div.addEventListener("dragstart", (e) => {
      dragId = t.id;
      div.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
    });
    div.addEventListener("dragend", () => {
      div.classList.remove("dragging");
      dragId = null;
    });
    // Action buttons
    div.querySelector(".delete")?.addEventListener("click", () => deleteTask(t.id));
    div.querySelector(".complete")?.addEventListener("click", () => moveTask(t.id, "done"));
    div.querySelector(".undo")?.addEventListener("click", () => moveTask(t.id, "todo"));
    return div;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // Drag & drop zones
  document.querySelectorAll("[data-dropzone]").forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      const status = zone.dataset.dropzone;
      if (dragId) moveTask(dragId, status);
    });
  });

  // Add form
  $("#addForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = $("#taskInput").value.trim();
    if (!text) return;
    addTask(text, $("#prioritySelect").value, $("#dueInput").value);
    $("#taskInput").value = "";
    $("#dueInput").value = "";
  });

  // Theme
  const applyTheme = (t) => {
    document.documentElement.setAttribute("data-theme", t);
    $("#themeToggle").textContent = t === "light" ? "☀️" : "🌙";
  };
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
  $("#themeToggle").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    const next = cur === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  // Init
  load();
  if (tasks.length === 0) {
    // Seed with sample tasks
    tasks = [
      { id: uid(), text: "Welcome! Drag this card to In Progress →", priority: "medium", due: null, status: "todo", createdAt: Date.now() },
      { id: uid(), text: "Try clicking ✓ to mark a task done", priority: "low", due: null, status: "todo", createdAt: Date.now() },
      { id: uid(), text: "Add due dates to see overdue warnings", priority: "high", due: new Date(Date.now() - 86400000).toISOString().slice(0, 10), status: "todo", createdAt: Date.now() },
    ];
    save();
  }
  render();
})();
