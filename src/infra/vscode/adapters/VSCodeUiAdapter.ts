// External Libraries
import * as vscode from "vscode";

// Application
import { QuickPickItem, UiPort } from "@application/ports/UIPort";

export class VSCodeUiAdapter implements UiPort {
  info(message: string) {
    vscode.window.showInformationMessage(message)
  }

  error(message: string) {
    vscode.window.showErrorMessage(message)
  }

  getWorkspaceRoot() {
    return vscode.workspace.workspaceFolders?.[0]?.uri ?? null
  }

  async input(
    title: string,
    opts?: { placeHolder?: string; validate?: (value: string) => string | undefined }
  ) {
    return vscode.window.showInputBox({
      title,
      placeHolder: opts?.placeHolder,
      validateInput: v => opts?.validate?.(v ?? "")
    })
  }

  async pickOne<TId extends string>(
    items: QuickPickItem<TId>[],
    opts: { title: string; placeHolder?: string }
  ) {
    const picked = await vscode.window.showQuickPick(
      items.map(i => ({ label: i.label, description: i.description, id: i.id })),
      { title: opts.title, placeHolder: opts.placeHolder, canPickMany: false }
    )
    return picked as any
  }

  async confirm(message: string): Promise<boolean> {
    const ok = await vscode.window.showInformationMessage(message, "Yes", "No")
    return ok === "Yes"
  }
}