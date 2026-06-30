# Kanban Todo with Drag & Drop

> Kanban-style todo app with drag & drop between columns, priorities, due dates, and stats. Vanilla JS + HTML5 Drag and Drop API.

![CI](https://github.com/arjundroid12/todo-drag-drop/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

- **Drag & drop** between 3 columns (To Do / In Progress / Done) using native HTML5 DnD API
- **Priority levels** — low (🟢), medium (🟡), high (🔴) with color-coded left borders
- **Due dates** with overdue highlighting (red text)
- **Stats bar** — total, done, overdue counts at a glance
- **localStorage persistence** — your tasks survive page refreshes
- **Dark / light theme** with system preference detection
- **Sample tasks** seeded on first visit so the board isn't empty

## 🚀 Live Demo

| Host | URL | Notes |
|------|-----|-------|
| 🥇 Surge.sh | https://arjun-kanban.surge.sh | Bangalore edge — best for India |
| 🥈 GitHub Pages | https://arjundroid12.github.io/todo-drag-drop/ | May be blocked by some Indian ISPs |

## 🛠️ Tech Stack

- Vanilla HTML/CSS/JS (zero dependencies)
- HTML5 Drag and Drop API (`dragstart`, `dragover`, `drop`)
- `localStorage` for persistence

## 📦 Run Locally

```bash
git clone https://github.com/arjundroid12/todo-drag-drop.git
cd todo-drag-drop
python3 -m http.server 8000
```

## 📄 License

MIT © Arjun Vashishtha
