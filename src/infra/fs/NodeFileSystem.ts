// External Libraries
import * as path from "node:path";
import * as fs from "node:fs/promises";

// Application
import { FileSystemPort } from "@application/usecases/createComponentStructure";

export class NodeFileSystem implements FileSystemPort {
  async ensureDir(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, "utf8");
  }

  async exists(targetPath: string): Promise<boolean> {
    try {
      await fs.access(targetPath);
      return true;
    } catch {
      return false;
    }
  }
}