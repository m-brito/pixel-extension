export type ProjectId = 'tailwind' | 'styled' | 'lib'

export type Template = {
    id: string
    label: string
}

export type ProjectDefinition = {
    id: ProjectId
    label: string
    templates: Template[]
    description?: string
    }