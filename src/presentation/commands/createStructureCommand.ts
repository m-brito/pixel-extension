// External Libraries
import * as vscode from "vscode";

// Infra
import { VSCodeUi } from "@infra/vscode/VSCodeUi";
import { NodeFileSystem } from "@infra/fs/NodeFileSystem";

// Application
import { createComponentStructure } from "@application/usecases/createComponentStructure";


export function registerCreateStructureCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "pixel.createStructure",
    async (uri?: vscode.Uri) => {
      const ui = new VSCodeUi();
      const fs = new NodeFileSystem();

      const folderUri = uri ?? ui.getWorkspaceRoot();
      if (!folderUri) {
        ui.error("Pixel: select a folder to create the structure.");
        return;
      }

      const kind = await ui.pickOne(
        [
          { label: "Component", description: "Creates the base structure of a component" },
          { label: "Cancel", description: "Do nothing" }
        ],
        { title: "Pixel: create structure" }
      );

      if (!kind || kind.label === "Cancel") return;

      const name = await ui.input("Component name", {
        placeHolder: "Ex: Button, TabSwitch, Typography"
      });
      if (!name) return;

      try {
        await createComponentStructure(
          {
            rootFolderPath: folderUri.fsPath,
            componentName: name
          },
          { fs }
        );

        ui.info(`Pixel: structure created for "${name}".`);
      } catch (e: any) {
        ui.error(`Pixel: error creating structure. ${e?.message ?? String(e)}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}