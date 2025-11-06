
# Changelog

All notable changes to the **LogCSharpVariable** extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-11-05

### Added

- **Cursor-only logging** – Place cursor on a variable → press `F6` → instant log. No selection needed.
- **Multi-log with `Ctrl+D`** – Use `Ctrl+D` to add matches → `F6` logs all instances.
- **Smart JSON serialization** – Objects are automatically serialized using `System.Text.Json` with configurable options (`Indented`, `SingleLine`, `None`).
- **Fully customizable log template** – Use placeholders: `{prefix}`, `{type}`, `{varLine}`, `{pathLine}`, `{timeLine}`.
- **ANSI-colored console output** – `DEBUG` (cyan), `INFO` (green), `ERROR` (red). Toggle via `colorizeLogs`.
- **Auto-format & smart indent** – Logs are inserted with correct indentation and the file is auto-formatted.
- **100% safe insertion** – Handles `{`, `}`, `if`, `foreach`, `catch`, `else`, etc. Never breaks code structure.
- **Toggle generated logs** – `Ctrl+F6` → comment/uncomment all logs created by this extension.
- **Auto-add `using System.Text.Json;`** – Automatically inserts if missing when serializing objects.
- **Configurable settings**:
    - `logPrefix`
    - `colorizeLogs`
    - `logTemplate`
    - `serializeObjects`
    - `jsonOptions`

### Commands

- `LogCSharpVariable: Log Variable` → `F6`
- `LogCSharpVariable: Toggle Generated Log` → `Ctrl+F6`

### Keybindings

- `F6` – Log variable under cursor
- `Ctrl+F6` – Toggle all generated logs

---

## [0.0.1] - 2025-01-14

### Added

- Initial release with basic `Console.WriteLine` insertion.

