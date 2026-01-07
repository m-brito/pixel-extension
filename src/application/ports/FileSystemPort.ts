// Types
import type { TemplateStructure } from "@domain/templates/types"

export interface FileSystemPort {
  writeStructure(rootFolderPath: string, structure: TemplateStructure): Promise<void>
}