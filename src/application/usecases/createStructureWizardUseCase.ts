// Domain
import { PROJECTS } from "@domain/projects/projectRegistry"
import { runTemplate } from "@domain/templates/templateRegistry"

// Application
import { UiPort } from "@application/ports/UIPort"
import type { FileSystemPort } from "@application/ports/FileSystemPort"

// Utils
import { normalizeComponentName } from "@utils/pathUtils"

export class CreateStructureWizardUseCase {
  constructor(
    private readonly ui: UiPort,
    private readonly fs: FileSystemPort
  ) {}

  async execute(params: { folderFsPath?: string | null }): Promise<void> {
    const root =
      params.folderFsPath ??
      this.ui.getWorkspaceRoot()?.fsPath ??
      null

    if (!root) {
      this.ui.error("Pixel: select a folder to create the structure.")
      return
    }

    const projectPick = await this.ui.pickOne(
      PROJECTS.map(p => ({
        id: String(p.id),
        label: p.label,
        description: p.description
      })),
      { title: "Pixel: create structure", placeHolder: "Select the project preset" }
    )
    if (!projectPick) return

    const project = PROJECTS.find(p => String(p.id) === projectPick.id)
    if (!project) {
      this.ui.error(`Pixel: project "${projectPick.id}" not found.`)
      return
    }

    const templatePick = await this.ui.pickOne(
      project.templates.map(t => ({ id: t.id, label: t.label })),
      { title: "Pixel: create structure", placeHolder: "Select a template" }
    )
    if (!templatePick) return

    const name = await this.ui.input("Name", {
      placeHolder: "e.g. TabSwitch"
    })
    if (!name) return

    const normalizedName = normalizeComponentName(name)

    try {
      const structure = runTemplate(project.id, templatePick.id as any, { name: normalizedName })
      await this.fs.writeStructure(root, structure)

      this.ui.info(`Created ${templatePick.id} "${normalizedName}" (${project.label})`)
    } catch (e: any) {
      this.ui.error(`Pixel: error creating structure. ${e?.message ?? String(e)}`)
    }
  }
}