// External Libraries
import * as path from "node:path";

// Types
import type { PixelRc } from "@domain/config/types";
import type { PixelConfigPort } from "@domain/config/ports/PixelConfigPort";

export interface FileSystemPort {
  exists(filePath: string): Promise<boolean>;
  readFile(filePath: string): Promise<string>;
  writeFile(filePath: string, content: string): Promise<void>;
}

export class PixelRcJsonConfig implements PixelConfigPort {
  private fileName = ".pixelrc.json";

  constructor(
    private readonly fs: FileSystemPort,
    private readonly workspaceRootPath: string
  ) {}

  private filePath() {
    return path.join(this.workspaceRootPath, this.fileName);
  }

  async read(): Promise<PixelRc | null> {
    const fp = this.filePath();
    if (!(await this.fs.exists(fp))) return null;

    const raw = await this.fs.readFile(fp);

    try {
      const parsed = JSON.parse(raw) as Partial<PixelRc>;
      if (!parsed.projectPreset) return null;
      return { projectPreset: parsed.projectPreset as any };
    } catch {
      return null;
    }
  }

  async write(rc: PixelRc): Promise<void> {
    const fp = this.filePath();
    const content = JSON.stringify(rc, null, 2) + "\n";
    await this.fs.writeFile(fp, content);
  }
}