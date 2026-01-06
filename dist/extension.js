"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);

// src/presentation/commands/createStructureCommand.ts
var vscode2 = __toESM(require("vscode"));

// src/infra/vscode/VSCodeUi.ts
var vscode = __toESM(require("vscode"));
var VSCodeUi = class {
  info(message) {
    vscode.window.showInformationMessage(message);
  }
  error(message) {
    vscode.window.showErrorMessage(message);
  }
  getWorkspaceRoot() {
    return vscode.workspace.workspaceFolders?.[0]?.uri ?? null;
  }
  async input(title, opts) {
    return vscode.window.showInputBox({
      title,
      placeHolder: opts?.placeHolder
    });
  }
  async pickOne(items, opts) {
    return vscode.window.showQuickPick(items, {
      title: opts?.title,
      canPickMany: false
    });
  }
};

// src/infra/fs/NodeFileSystem.ts
var path = __toESM(require("node:path"));
var fs = __toESM(require("node:fs/promises"));
var NodeFileSystem = class {
  async ensureDir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
  }
  async writeFile(filePath, content) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, "utf8");
  }
  async exists(targetPath) {
    try {
      await fs.access(targetPath);
      return true;
    } catch {
      return false;
    }
  }
};

// src/shared/utils/pathUtils.ts
function normalizeComponentName(name) {
  const trimmed = name.trim();
  if (!trimmed)
    return "Component";
  const parts = trimmed.split(/[\s-_]+/g).filter(Boolean);
  const pascal = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  return pascal || "Component";
}

// src/domain/entities/ComponentTemplate.ts
function componentTemplate(componentName) {
  return [
    {
      path: "index.ts",
      content: `export * from './${componentName}'
export * from './types'
`
    },
    {
      path: `${componentName}.tsx`,
      content: `import type React from 'react'

import type { ${componentName}Props } from './types'
import { create${componentName}Styles } from './styles'
import { useThemedStyles } from '@hooks/useThemedStyles'

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  const { styles, classes } = useThemedStyles(props, create${componentName}Styles, {
    debugName: '${componentName}',
    applyCommonProps: true,
    commonSlot: 'container'
  })

  return (
    <div style={styles.container} className={classes.container}>
      ${componentName}
    </div>
  )
}
`
    },
    {
      path: "types.ts",
      content: `import type React from 'react'
import type { StyleMap } from '@hooks/useThemedStyles/types'

export type ${componentName}Styles = {
  container: React.CSSProperties
} & StyleMap

export type ${componentName}Props = {
  styles?: Partial<${componentName}Styles>
}
`
    },
    {
      path: "styles.ts",
      content: `import type { StyleMap } from '@hooks/useThemedStyles/types'
import type { ${componentName}Props } from './types'

export function create${componentName}Styles(_: ${componentName}Props): StyleMap {
  return {
    container: {
      display: 'flex',
      alignItems: 'center'
    }
  }
}
`
    }
  ];
}

// src/application/usecases/createComponentStructure.ts
async function createComponentStructure(input, deps) {
  const name = normalizeComponentName(input.componentName);
  const baseDir = `${input.rootFolderPath}/${name}`;
  if (await deps.fs.exists(baseDir)) {
    throw new Error(`A pasta "${name}" j\xE1 existe.`);
  }
  await deps.fs.ensureDir(baseDir);
  await deps.fs.ensureDir(`${baseDir}/components`);
  const files = componentTemplate(name);
  for (const file of files) {
    await deps.fs.writeFile(`${baseDir}/${file.path}`, file.content);
  }
}

// src/presentation/commands/createStructureCommand.ts
function registerCreateStructureCommand(context) {
  const disposable = vscode2.commands.registerCommand("pixel.createStructure", async (uri) => {
    const ui = new VSCodeUi();
    const fs2 = new NodeFileSystem();
    const folderUri = uri ?? ui.getWorkspaceRoot();
    if (!folderUri) {
      ui.error("Pixel: selecione uma pasta no Explorer ou abra um workspace.");
      return;
    }
    const kind = await ui.pickOne([
      { label: "Component", description: "Cria a estrutura base do componente" },
      { label: "Cancel", description: "N\xE3o fazer nada" }
    ], { title: "Pixel: create structure" });
    if (!kind || kind.label === "Cancel")
      return;
    const name = await ui.input("Component name", {
      placeHolder: "Ex: Button, TabSwitch, Typography"
    });
    if (!name)
      return;
    try {
      await createComponentStructure({
        rootFolderPath: folderUri.fsPath,
        componentName: name
      }, { fs: fs2 });
      ui.info(`Pixel: estrutura criada para "${name}".`);
    } catch (e) {
      ui.error(`Pixel: erro ao criar estrutura. ${e?.message ?? String(e)}`);
    }
  });
  context.subscriptions.push(disposable);
}

// src/extension.ts
function activate(context) {
  registerCreateStructureCommand(context);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
