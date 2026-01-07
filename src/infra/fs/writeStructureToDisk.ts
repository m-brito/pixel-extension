// External Libraries
import * as vscode from "vscode"

// Types
import type { TemplateStructure } from "@domain/templates/types"

export async function writeStructureToDisk(uri: vscode.Uri, structure: TemplateStructure) {
  const root = uri.fsPath
  const baseFolder = vscode.Uri.file(`${root}/${structure.folderName}`)

  await vscode.workspace.fs.createDirectory(baseFolder)

  for (const folder of structure.folders ?? []) {
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(`${baseFolder.fsPath}/${folder}`))
  }

  for (const file of structure.files) {
    const fileUri = vscode.Uri.file(`${baseFolder.fsPath}/${file.path}`)
    const bytes = new TextEncoder().encode(file.content)
    await vscode.workspace.fs.writeFile(fileUri, bytes)
  }
}