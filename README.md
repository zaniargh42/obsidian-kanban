# 🚀 Interactive Obsidian Kanban Board

A professional, persistent Kanban board application designed for high-productivity organization. It combines a minimalist Obsidian-inspired dark theme with a robust SQLite backend for permanent data storage and seamless Windows integration.

## ✨ Features

- **💾 Persistent Storage**: Powered by SQLite. Your cards, colors, and positions are saved permanently and survive server restarts.
- **📝 Rich Text Support**: Full Markdown rendering for card descriptions. Use **bold**, *italics*, bullet points, and links to organize your thoughts.
- **🎨 Visual Categorization**: Six distinct color codes to categorize tasks by priority or type.
- **🔄 Lifecycle Management**:
  - **Inline Editing**: Modify titles, descriptions, and colors on the fly without leaving the board.
  - **Archiving**: Quickly hide completed or irrelevant cards without permanent deletion.
- **🖱️ Interactive UX**:
  - Smooth drag-and-drop between columns (**Backlog** $\rightarrow$ **To Do** $\rightarrow$ **In Progress** $\rightarrow$ **Done**).
  - One-click Theme Toggle (Light/Dark mode).
- **💡 Daily Motivation**: A curated database of 100 motivating and funny quotes delivered upon server launch.
- **🪟 Windows System Integration**: 
  - System Tray icon for instant access.
  - Background mode (Invisible) to keep the board running without a console window.
  - Easy auto-start configuration.

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)

### Quick Start
1. **Clone the repository**:
   \`\`\`bash
   git clone https://github.com/your-username/obsidian-kanban.git
   cd obsidian-kanban
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the server**:
   - **Option A (Developer Mode)**: `node server.js` (Shows logs in terminal)
   - **Option B (Standard)**: Run `run_server.bat` (Opens a console window)
   - **Option C (Invisible)**: Run `start_invisible.vbs` (Runs silently in background)

4. **Open the board**:
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Windows Advanced Configuration

### 1. System Tray Icon
To enable the tray icon functionality, you **must** have an icon file named `icon.ico` in the root folder of the project. Without this file, the server will run, but the icon will not appear in the taskbar.

### 2. Auto-Start on Boot
To make the Kanban board start automatically when you turn on your computer:
1. Press `Win + R`, type `shell:startup`, and hit Enter.
2. Create a shortcut to `start_invisible.vbs` inside this folder.

### 3. Managing the Background Process
When running in invisible mode, use the system tray icon to:
- **Open Board**: Quickly launch the browser.
- **Exit**: Gracefully shut down the server.

## 📂 Project Structure
- `server.js`: Express backend, SQLite logic, and System Tray handler.
- `index.html`: Frontend UI and client-side interaction logic.
- `logger.js`: Winston-based logging system (outputs to `server.log`).
- `start_invisible.vbs`: Wrapper to launch the server without a CMD window.
- `run_server.bat`: Standard batch script for launching the server.
- `kanban.db`: SQLite database (Ignored by Git).
- `server.log`: Server activity logs (Ignored by Git).

## 📜 License
ISC License