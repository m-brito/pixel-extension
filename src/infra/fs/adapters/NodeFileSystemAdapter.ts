// External Libraries
import * as vscode from "vscode"

// Infra
import { writeStructureToDisk } from "../writeStructureToDisk"

// Types
import type { TemplateStructure } from "@domain/templates/types"
import type { FileSystemPort } from "@application/ports/FileSystemPort"

export class NodeFileSystemAdapter implements FileSystemPort {
  async writeStructure(rootFolderPath: string, structure: TemplateStructure): Promise<void> {
    await writeStructureToDisk(vscode.Uri.file(rootFolderPath), structure)
  }
}