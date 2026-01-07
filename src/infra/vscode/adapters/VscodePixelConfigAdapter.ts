// External Libraries
import * as vscode from "vscode";
import * as path from "node:path";

// Types
import { PixelRc } from "@domain/config/types";
import { PixelConfigPort } from "@domain/config/ports/PixelConfigPort";

export class VscodePixelConfigAdapter implements PixelConfigPort {
  private readonly fileName = ".pixelrc.json";

  constructor(private readonly workspaceRootPath: string) {}

  private fileUri(): vscode.Uri {
    return vscode.Uri.file(path.join(this.workspaceRootPath, this.fileName));
  }

  async read(): Promise<PixelRc | null> {
    try {
      const buf = await vscode.workspace.fs.readFile(this.fileUri());
      const raw = Buffer.from(buf).toString("utf8");

      const parsed = JSON.parse(raw) as Partial<PixelRc>;
      if (!parsed.projectPreset || typeof parsed.projectPreset !== "string") return null;

      return { projectPreset: parsed.projectPreset };
    } catch {
      return null;
    }
  }

  async write(rc: PixelRc): Promise<void> {
    const content = JSON.stringify(rc, null, 2) + "\n";
    await vscode.workspace.fs.writeFile(this.fileUri(), Buffer.from(content, "utf8"));
  }

  async remove(): Promise<void> {
    try {
      await vscode.workspace.fs.delete(this.fileUri(), { useTrash: true });
    } catch {}
  }
}