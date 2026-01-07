// External Libraries
import * as vscode from "vscode"

// Presentation
import { createStructureCommand } from "./createStructureCommand"

export function registerCreateStructureCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "pixel.createStructure",
    (uri?: vscode.Uri) => createStructureCommand(uri)
  )

  context.subscriptions.push(disposable)
}