<h1 align="center">Welcome to pnpm-power-menu 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-red.svg?cacheSeconds=2592000&style=for-the-badge" />
  <img src="https://img.shields.io/badge/node-%3E%3D16.0-darkgreen.svg?style=for-the-badge&logo=nodedotjs" />
  <img src="https://img.shields.io/badge/vscode-%5E1.87.0-blue.svg?style=for-the-badge&logo=visualstudiocode" />
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/jacobwi/pnpm-power-menu?style=for-the-badge&logo=github">

</p>

> Customizable PNPM commands for VS Code 🛠️

## Prerequisites

- node >=16.0
- vscode ^1.87.0

## Install

For local development:
```sh
pnpm i
```

TBD: Release to marketplace

## Run tests

```sh
pnpm test
```

## 🛠️ PNPM Power Menu Commands

This section outlines the commands available in the PNPM Power Menu, defined in the `commands.yaml` file. These commands enhance your Visual Studio Code experience by integrating PNPM's powerful features directly into your editor.

### Commands Overview

- 🌱 **Initialize Project with PNPM**
  - **ID:** `pnpm-power-menu.init`
  - **Command:** `pnpm init`
  - **Description:** Initializes a new project using PNPM, setting up the necessary package management files.

- 📦 **Install Dependencies with PNPM**
  - **ID:** `pnpm-power-menu.install`
  - **Command:** `pnpm install`
  - **Description:** Installs all dependencies listed in your project's `package.json` file using PNPM.

- ⬆️ **Update Dependencies with PNPM**
  - **ID:** `pnpm-power-menu.update`
  - **Command:** `pnpm update`
  - **Description:** Updates your project's dependencies to their latest versions according to the version ranges specified in the `package.json`.

- 🧪 **Run Tests with PNPM**
  - **ID:** `pnpm-power-menu.test`
  - **Command:** `pnpm test`
  - **Description:** Executes the test scripts defined in your project, facilitating quick and easy testing.

- ⚙️ **Open Extension Settings**
  - **ID:** `pnpm-power-menu.openExtSettings`
  - **Command:** `workbench.action.openSettings`
  - **Description:** Opens the settings pane within VS Code, allowing you to configure the PNPM Power Menu extension. This command is built into VS Code but is conveniently accessible through the PNPM Power Menu.
  - **Additional Argument:** `@ext:${context.extension.id}` specifies the extension ID for which the settings should be opened.

These commands are designed to streamline your development workflow by integrating common PNPM tasks directly into your editor's context menu.



## Author

👤 **jacobwi**

* Website: https://www.jacobwi.io
* Github: [@jacobwi](https://github.com/jacobwi)

## Show your support

Give a ⭐️ if this project helped you!

