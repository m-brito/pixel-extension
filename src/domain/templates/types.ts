export type TemplateFile = {
  path: string
  content: string
}

export type TemplateStructure = {
  folderName: string
  folders?: string[]
  files: TemplateFile[]
}