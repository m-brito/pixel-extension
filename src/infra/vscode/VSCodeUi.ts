// External Libraries
import * as vscode from "vscode";

export class VSCodeUi {
  info(message: string) {
    vscode.window.showInformationMessage(message);
  }

  error(message: string) {
    vscode.window.showErrorMessage(message);
  }

  getWorkspaceRoot(): vscode.Uri | null {
    return vscode.workspace.workspaceFolders?.[0]?.uri ?? null;
  }

  async input(title: string, opts?: { placeHolder?: string }): Promise<string | undefined> {
    return vscode.window.showInputBox({
      title,
      placeHolder: opts?.placeHolder
    });
  }

  async pickOne<T extends vscode.QuickPickItem>(
    items: T[],
    opts?: { title?: string }
  ): Promise<T | undefined> {
    return vscode.window.showQuickPick(items, {
      title: opts?.title,
      canPickMany: false
    });
  }
}