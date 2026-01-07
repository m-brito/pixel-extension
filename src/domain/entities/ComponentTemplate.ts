export type TemplateFile = { path: string; content: string };

export function componentTemplate(componentName: string): TemplateFile[] {
  return [
    {
      path: "index.tsx",
      content: `// External Libraries
import type React from 'react'

// Hooks
import { useThemedStyles } from '@hooks/useThemedStyles'

// Types
import type { ${componentName}Props } from './types'

// Styles
import { create${componentName}Styles } from './styles'

export const ${componentName}: React.FC<${componentName}Props> = props => {
  const { example } = props

  const { styles } = useThemedStyles(props, create${componentName}Styles, {
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
      path: `types.ts`,
      content: `import type { create${componentName}Styles } from './styles'

export interface ${componentName}Props {
  example: string

  styles?: Partial<ReturnType<typeof create${componentName}Styles>>
}
      `
    },
    {
      path: "styles.ts",
      content: `// External Libraries
import type { CSSProperties } from 'react'

// Types
import type { ${componentName}Props } from './types'
import { styled } from '@hooks/useThemedStyles/types'

export function create${componentName}Styles(
  _props: ${componentName}Props
): Record<string, CSSProperties> {
  return styled({
    container: {
      display: 'flex'
    }
  })
}
      `
    }
  ];
}