// Types
import { ProjectId } from "@domain/projects/types";
import type { PixelConfigPort } from "@domain/config/ports/PixelConfigPort"

export type ProjectOption = {
  id: ProjectId
  label: string
  description?: string
};

export interface UiPort {
  pickOne<T extends { label: string; description?: string }>(
    items: T[],
    opts?: { title?: string; placeHolder?: string }
  ): Promise<T | undefined>

  confirm(
    message: string,
    opts?: { confirmLabel?: string; cancelLabel?: string }
  ): Promise<boolean>
}

export async function resolveProjectPreset(params: {
  config: PixelConfigPort
  ui: UiPort;
  projects: ProjectOption[]
}): Promise<string | null> {
  const { config, ui, projects } = params;

  const rc = await config.read();
  if (rc?.projectPreset) return rc.projectPreset;

  const pick = await ui.pickOne(
    projects.map(p => ({
      label: p.label,
      description: p.description,
      projectId: p.id
    })),
    { title: "Pixel: create structure", placeHolder: "Select the project preset" }
  );

  if (!pick) return null;

  const chosen = (pick as any).projectId as ProjectId;

  const shouldSave = await ui.confirm(
    `Save "${chosen}" to .pixelrc.json for this workspace?`,
    { confirmLabel: "Save", cancelLabel: "Not now" }
  );

  if (shouldSave) {
    await config.write({ projectPreset: chosen });
  }

  return chosen;
}