// Utils
import { normalizeComponentName } from "@utils/pathUtils"

// Types
import type { TemplateStructure } from "@domain/templates/types"

export type CreateComponentParams = { name: string }

export function createComponentStructureLib(
  params: CreateComponentParams
): TemplateStructure {
  const normalizedComponentName = normalizeComponentName(params.name)

  return {
    folderName: normalizedComponentName,
    folders: ["components"],
    files: [
      {
        path: "index.tsx",
        content: `// External Libraries
import type React from 'react'

// Hooks
import { useThemedStyles } from '@hooks/useThemedStyles'

// Types
import type { ${normalizedComponentName}Props } from './types'

// Styles
import { create${normalizedComponentName}Styles } from './styles'

export const ${normalizedComponentName}: React.FC<${normalizedComponentName}Props> = props => {
  const { example } = props

  const { styles } = useThemedStyles(props, create${normalizedComponentName}Styles, {
    applyCommonProps: true,
    override: props.styles,
    pick: p => [p.example]
  })

  return (
    <div style={styles.container}>
      <span>{example}</span>
    </div>
  )
}
`
      },
      {
        path: "types.ts",
        content: `import type { create${normalizedComponentName}Styles } from './styles'

export interface ${normalizedComponentName}Props {
  example: string
  styles?: Partial<ReturnType<typeof create${normalizedComponentName}Styles>>
}
`
      },
      {
        path: "styles.ts",
        content: `// Types
import type { ${normalizedComponentName}Props } from './types'
import type { StyleMap } from '@hooks/useThemedStyles/types'
import { styled } from '@hooks/useThemedStyles/types'

export function create${normalizedComponentName}Styles(
  _props: ${normalizedComponentName}Props
): StyleMap {
  return styled({
    container: {
      display: 'flex'
    }
  })
}
`
      }
    ]
  }
}