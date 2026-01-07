// External Libraries
import * as vscode from "vscode"

// Infra
import { VSCodeUiAdapter } from "@infra/vscode/adapters/VSCodeUiAdapter"
import { NodeFileSystemAdapter } from "@infra/fs/adapters/NodeFileSystemAdapter"

// Application
import { CreateStructureWizardUseCase } from "@application/usecases/createStructureWizardUseCase"
import { VscodePixelConfigAdapter } from "@infra/vscode/adapters/VscodePixelConfigAdapter"

export async function createStructureCommand(uri?: vscode.Uri) {
  const ui = new VSCodeUiAdapter()
  const fs = new NodeFileSystemAdapter()
  const config = new VscodePixelConfigAdapter(ui.getWorkspaceRoot()?.fsPath ?? "")
  const useCase = new CreateStructureWizardUseCase(ui, fs, config)

  await useCase.execute({ folderFsPath: uri?.fsPath ?? null })
}