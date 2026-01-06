// Utils
import { normalizeComponentName } from "@utils/pathUtils";

// Domain
import { componentTemplate } from "@domain/entities/ComponentTemplate";

export type CreateComponentStructureInput = {
  rootFolderPath: string;
  componentName: string;
};

export type FileSystemPort = {
  ensureDir(path: string): Promise<void>;
  writeFile(path: string, content: string): Promise<void>;
  exists(path: string): Promise<boolean>;
};

export async function createComponentStructure(
  input: CreateComponentStructureInput,
  deps: { fs: FileSystemPort }
) {
  const name = normalizeComponentName(input.componentName);
  const baseDir = `${input.rootFolderPath}/${name}`;

  if (await deps.fs.exists(baseDir)) {
    throw new Error(`The folder "${name}" already exists.`);
  }

  await deps.fs.ensureDir(baseDir);
  await deps.fs.ensureDir(`${baseDir}/components`);

  const files = componentTemplate(name);

  for (const file of files) {
    await deps.fs.writeFile(`${baseDir}/${file.path}`, file.content);
  }
}