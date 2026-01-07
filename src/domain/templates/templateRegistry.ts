// Entities
import { createComponentStructureLib } from '@domain/entities/lib/createComponentStructure'

// Types
import { TemplateStructure } from './types'
import { ProjectId } from '@domain/projects/types'


export type TemplateId = 'component'

export type RunTemplateParams = {
  name: string
}

export function runTemplate(
  projectId: ProjectId,
  templateId: TemplateId,
  params: RunTemplateParams
): TemplateStructure {
  if (templateId === 'component') {
    if (projectId === 'lib') return createComponentStructureLib(params)
  }

  throw new Error(`Unknown template: ${templateId}`)
}