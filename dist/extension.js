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

// src/presentation/commands/registerCreateStructureCommand.ts
var vscode5 = __toESM(require("vscode"));

// src/infra/vscode/adapters/VSCodeUiAdapter.ts
var vscode = __toESM(require("vscode"));
var VSCodeUiAdapter = class {
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
      placeHolder: opts?.placeHolder,
      validateInput: (v) => opts?.validate?.(v ?? "")
    });
  }
  async pickOne(items, opts) {
    const picked = await vscode.window.showQuickPick(items.map((i) => ({ label: i.label, description: i.description, id: i.id })), { title: opts.title, placeHolder: opts.placeHolder, canPickMany: false });
    return picked;
  }
  async confirm(message) {
    const ok = await vscode.window.showInformationMessage(message, "Yes", "No");
    return ok === "Yes";
  }
};

// src/infra/fs/adapters/NodeFileSystemAdapter.ts
var vscode3 = __toESM(require("vscode"));

// src/infra/fs/writeStructureToDisk.ts
var vscode2 = __toESM(require("vscode"));
async function writeStructureToDisk(uri, structure) {
  const root = uri.fsPath;
  const baseFolder = vscode2.Uri.file(`${root}/${structure.folderName}`);
  await vscode2.workspace.fs.createDirectory(baseFolder);
  for (const folder of structure.folders ?? []) {
    await vscode2.workspace.fs.createDirectory(vscode2.Uri.file(`${baseFolder.fsPath}/${folder}`));
  }
  for (const file of structure.files) {
    const fileUri = vscode2.Uri.file(`${baseFolder.fsPath}/${file.path}`);
    const bytes = new TextEncoder().encode(file.content);
    await vscode2.workspace.fs.writeFile(fileUri, bytes);
  }
}

// src/infra/fs/adapters/NodeFileSystemAdapter.ts
var NodeFileSystemAdapter = class {
  async writeStructure(rootFolderPath, structure) {
    await writeStructureToDisk(vscode3.Uri.file(rootFolderPath), structure);
  }
};

// src/domain/projects/projectRegistry.ts
var PROJECTS = [
  { id: "lib", label: "Project: Component Library", templates: [{ id: "component", label: "Component" }] }
];

// src/shared/utils/pathUtils.ts
function normalizeComponentName(name) {
  const trimmed = name.trim();
  if (!trimmed)
    return "Component";
  const parts = trimmed.split(/[\s-_]+/g).filter(Boolean);
  const pascal = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  return pascal || "Component";
}

// src/domain/entities/lib/createComponentStructure.ts
function createComponentStructureLib(params) {
  const normalizedComponentName = normalizeComponentName(params.name);
  return {
    folderName: normalizedComponentName,
    folders: ["components"],
    files: [
      {
        path: "index.tsx",
        content: `// External Libraries
import type React from 'react'

// Hooks
import { useThemedStyles } from '@hooks/useThemedStyles'

// Types
import type { ${normalizedComponentName}Props } from './types'

// Styles
import { create${normalizedComponentName}Styles } from './styles'

export const ${normalizedComponentName}: React.FC<${normalizedComponentName}Props> = props => {
  const { example } = props

  const { styles } = useThemedStyles(props, create${normalizedComponentName}Styles, {
    applyCommonProps: true,
    override: props.styles,
    pick: p => [p.example]
  })

  return (
    <div style={styles.container}>
      <span>{example}</span>
    </div>
  )
}
`
      },
      {
        path: "types.ts",
        content: `import type { create${normalizedComponentName}Styles } from './styles'

export interface ${normalizedComponentName}Props {
  example: string
  styles?: Partial<ReturnType<typeof create${normalizedComponentName}Styles>>
}
`
      },
      {
        path: "styles.ts",
        content: `// Types
import type { ${normalizedComponentName}Props } from './types'
import type { StyleMap } from '@hooks/useThemedStyles/types'
import { styled } from '@hooks/useThemedStyles/types'

export function create${normalizedComponentName}Styles(
  _props: ${normalizedComponentName}Props
): StyleMap {
  return styled({
    container: {
      display: 'flex'
    }
  })
}
`
      }
    ]
  };
}

// src/domain/templates/templateRegistry.ts
function runTemplate(projectId, templateId, params) {
  if (templateId === "component") {
    if (projectId === "lib")
      return createComponentStructureLib(params);
  }
  throw new Error(`Unknown template: ${templateId}`);
}

// src/application/usecases/createStructureWizardUseCase.ts
function projectExists(projectId) {
  return PROJECTS.some((p) => String(p.id) === projectId);
}
function getProjectId(projectPreset) {
  if (projectPreset && projectPreset !== "none" && projectExists(projectPreset)) {
    return projectPreset;
  }
  return null;
}
var CreateStructureWizardUseCase = class {
  constructor(ui, fs, config) {
    this.ui = ui;
    this.fs = fs;
    this.config = config;
  }
  async execute(params) {
    const root = params.folderFsPath ?? this.ui.getWorkspaceRoot()?.fsPath ?? null;
    if (!root) {
      this.ui.error("Pixel: select a folder to create the structure.");
      return;
    }
    let projectPreset = null;
    try {
      const rc = await this.config.read();
      projectPreset = rc?.projectPreset ?? null;
    } catch {
    }
    let projectId = getProjectId(projectPreset);
    let pickedProjectLabel = null;
    if (!projectId) {
      const projectPick = await this.ui.pickOne(PROJECTS.map((p) => ({
        id: String(p.id),
        label: p.label,
        description: p.description
      })), {
        title: "Pixel: create structure",
        placeHolder: "Select the project preset"
      });
      if (!projectPick)
        return;
      projectId = projectPick.id;
      pickedProjectLabel = projectPick.label;
      const shouldAskRemember = !projectPreset;
      if (shouldAskRemember && this.ui.confirm) {
        const remember = await this.ui.confirm(`Remember "${pickedProjectLabel}" as the default preset for this workspace?`);
        try {
          if (remember) {
            await this.config.write({ projectPreset: projectId });
          } else {
            await this.config.write({ projectPreset: "none" });
          }
        } catch {
        }
      }
    }
    if (!projectId)
      return;
    const project = PROJECTS.find((p) => String(p.id) === String(projectId));
    if (!project) {
      this.ui.error(`Pixel: project "${String(projectId)}" not found.`);
      return;
    }
    const templatePick = await this.ui.pickOne(project.templates.map((t) => ({ id: t.id, label: t.label })), { title: "Pixel: create structure", placeHolder: "Select a template" });
    if (!templatePick)
      return;
    const name = await this.ui.input("Name", { placeHolder: "e.g. TabSwitch" });
    if (!name)
      return;
    const normalizedName = normalizeComponentName(name);
    try {
      const structure = runTemplate(project.id, templatePick.id, {
        name: normalizedName
      });
      await this.fs.writeStructure(root, structure);
      this.ui.info(`Created ${templatePick.id} "${normalizedName}" (${project.label})`);
    } catch (e) {
      this.ui.error(`Pixel: error creating structure. ${e?.message ?? String(e)}`);
    }
  }
};

// src/infra/vscode/adapters/VscodePixelConfigAdapter.ts
var vscode4 = __toESM(require("vscode"));
var path = __toESM(require("node:path"));
var VscodePixelConfigAdapter = class {
  constructor(workspaceRootPath) {
    this.workspaceRootPath = workspaceRootPath;
    this.fileName = ".pixelrc.json";
  }
  fileUri() {
    return vscode4.Uri.file(path.join(this.workspaceRootPath, this.fileName));
  }
  async read() {
    try {
      const buf = await vscode4.workspace.fs.readFile(this.fileUri());
      const raw = Buffer.from(buf).toString("utf8");
      const parsed = JSON.parse(raw);
      if (!parsed.projectPreset || typeof parsed.projectPreset !== "string")
        return null;
      return { projectPreset: parsed.projectPreset };
    } catch {
      return null;
    }
  }
  async write(rc) {
    const content = JSON.stringify(rc, null, 2) + "\n";
    await vscode4.workspace.fs.writeFile(this.fileUri(), Buffer.from(content, "utf8"));
  }
  async remove() {
    try {
      await vscode4.workspace.fs.delete(this.fileUri(), { useTrash: true });
    } catch {
    }
  }
};

// src/presentation/commands/createStructureCommand.ts
async function createStructureCommand(uri) {
  const ui = new VSCodeUiAdapter();
  const fs = new NodeFileSystemAdapter();
  const config = new VscodePixelConfigAdapter(ui.getWorkspaceRoot()?.fsPath ?? "");
  const useCase = new CreateStructureWizardUseCase(ui, fs, config);
  await useCase.execute({ folderFsPath: uri?.fsPath ?? null });
}

// src/presentation/commands/registerCreateStructureCommand.ts
function registerCreateStructureCommand(context) {
  const disposable = vscode5.commands.registerCommand("pixel.createStructure", (uri) => createStructureCommand(uri));
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
