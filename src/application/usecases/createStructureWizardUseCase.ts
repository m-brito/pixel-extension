// Domain
import { PROJECTS } from "@domain/projects/projectRegistry"
import { runTemplate } from "@domain/templates/templateRegistry"

// Application
import type { UiPort } from "@application/ports/UIPort"
import type { FileSystemPort } from "@application/ports/FileSystemPort"

// Utils
import { normalizeComponentName } from "@utils/pathUtils"

// Ports/Types
import type { PixelConfigPort } from "@domain/config/ports/PixelConfigPort"
import type { ProjectId } from "@domain/projects/types"

function projectExists(projectId: string) {
  return PROJECTS.some(p => String(p.id) === projectId)
}

function getProjectId(projectPreset: string | null): ProjectId | null {
  if (projectPreset && projectPreset !== "none" && projectExists(projectPreset)) {
    return projectPreset as ProjectId
  }
  return null
}

export class CreateStructureWizardUseCase {
  constructor(
    private readonly ui: UiPort,
    private readonly fs: FileSystemPort,
    private readonly config: PixelConfigPort
  ) {}

  async execute(params: { folderFsPath?: string | null }): Promise<void> {
    const root = params.folderFsPath ?? this.ui.getWorkspaceRoot()?.fsPath ?? null

    if (!root) {
      this.ui.error("Pixel: select a folder to create the structure.")
      return
    }

    let projectPreset: string | null = null
    try {
      const rc = await this.config.read()
      projectPreset = rc?.projectPreset ?? null
    } catch {}

    let projectId: ProjectId | null = getProjectId(projectPreset)

    let pickedProjectLabel: string | null = null

    if (!projectId) {
      const projectPick = await this.ui.pickOne(
        PROJECTS.map(p => ({
          id: String(p.id),
          label: p.label,
          description: p.description
        })),
        {
          title: "Pixel: create structure",
          placeHolder: "Select the project preset"
        }
      )
      if (!projectPick) return

      projectId = projectPick.id as ProjectId
      pickedProjectLabel = projectPick.label

      const shouldAskRemember = !projectPreset

      if (shouldAskRemember && this.ui.confirm) {
        const remember = await this.ui.confirm(
          `Remember "${pickedProjectLabel}" as the default preset for this workspace?`
        )

        try {
          if (remember) {
            await this.config.write({ projectPreset: projectId })
          } else {
            await this.config.write({ projectPreset: "none" })
          }
        } catch {}
      }
    }

    if (!projectId) return

    const project = PROJECTS.find(p => String(p.id) === String(projectId))
    if (!project) {
      this.ui.error(`Pixel: project "${String(projectId)}" not found.`)
      return
    }

    const templatePick = await this.ui.pickOne(
      project.templates.map(t => ({ id: t.id, label: t.label })),
      { title: "Pixel: create structure", placeHolder: "Select a template" }
    )
    if (!templatePick) return

    const name = await this.ui.input("Name", { placeHolder: "e.g. TabSwitch" })
    if (!name) return

    const normalizedName = normalizeComponentName(name)

    try {
      const structure = runTemplate(project.id, templatePick.id as any, {
        name: normalizedName
      })

      await this.fs.writeStructure(root, structure)

      this.ui.info(
        `Created ${templatePick.id} "${normalizedName}" (${project.label})`
      )
    } catch (e: any) {
      this.ui.error(`Pixel: error creating structure. ${e?.message ?? String(e)}`)
    }
  }
}