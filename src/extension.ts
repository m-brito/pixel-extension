// External Libraries
import * as vscode from "vscode";

// Presentation
import { registerCreateStructureCommand } from "@presentation/commands/registerCreateStructureCommand";

export function activate(context: vscode.ExtensionContext) {
  registerCreateStructureCommand(context);
}

export function deactivate() {}