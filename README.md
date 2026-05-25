# Manual Explorer Reveal

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/rhapsodic.manual-explorer-reveal?label=VS%20Code%20Marketplace&color=007ACC)](https://marketplace.visualstudio.com/items?itemName=rhapsodic.manual-explorer-reveal)
![License](https://img.shields.io/badge/license-MIT-blue)

Reveal the current file in VS Code Explorer only when you ask for it.

This extension keeps the file tree quiet by disabling `explorer.autoReveal`, then adds a manual **Reveal Active File in Explorer** action with a target icon.

> Requires VS Code v1.85 or newer.

## Why

VS Code normally reveals the current file in Explorer as you switch tabs. That is useful sometimes, but noisy when you move through files quickly.

Manual Explorer Reveal gives you a focused explorer workflow:

- Explorer does not jump while you switch tabs.
- The active file is revealed only through the target button or command.
- The command is available from Explorer, editor title, and Command Palette.

## Usage

Run the command:

```text
Explorer: Reveal Active File in Explorer
```

Or click the target icon in:

- the Explorer title bar;
- the editor title bar for file-backed editors.

## Configuration

By default, the extension writes this user setting on activation:

```json
{
  "explorer.autoReveal": false
}
```

Disable that behavior if you only want the manual reveal command:

```json
{
  "manualExplorerReveal.disableAutoReveal": false
}
```

## Development

Install dependencies:

```bash
pnpm install
```

Run checks and build:

```bash
pnpm run check
```

Package a local VSIX:

```bash
pnpm run package
```

## License

MIT
