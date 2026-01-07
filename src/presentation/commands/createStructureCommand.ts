// External Libraries
import * as vscode from "vscode"

// Infra
import { VSCodeUiAdapter } from "@infra/vscode/VSCodeUiAdapter"
import { NodeFileSystemAdapter } from "@infra/fs/adapters/NodeFileSystemAdapter"

// Application
import { CreateStructureWizardUseCase } from "@application/usecases/createStructureWizardUseCase"

export async function createStructureCommand(uri?: vscode.Uri) {
  const ui = new VSCodeUiAdapter()
  const fs = new NodeFileSystemAdapter()
  const useCase = new CreateStructureWizardUseCase(ui, fs)

  await useCase.execute({ folderFsPath: uri?.fsPath ?? null })
}