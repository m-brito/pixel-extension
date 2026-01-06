export type TemplateFile = { path: string; content: string };

export function componentTemplate(componentName: string): TemplateFile[] {
  return [
    {
      path: "index.ts",
      content: `export * from './${componentName}'\nexport * from './types'\n`
    },
    {
      path: `${componentName}.tsx`,
      content: `import type React from 'react'\n\nimport type { ${componentName}Props } from './types'\nimport { create${componentName}Styles } from './styles'\nimport { useThemedStyles } from '@hooks/useThemedStyles'\n\nexport const ${componentName}: React.FC<${componentName}Props> = (props) => {\n  const { styles, classes } = useThemedStyles(props, create${componentName}Styles, {\n    debugName: '${componentName}',\n    applyCommonProps: true,\n    commonSlot: 'container'\n  })\n\n  return (\n    <div style={styles.container} className={classes.container}>\n      ${componentName}\n    </div>\n  )\n}\n`
    },
    {
      path: "types.ts",
      content: `import type React from 'react'\nimport type { StyleMap } from '@hooks/useThemedStyles/types'\n\nexport type ${componentName}Styles = {\n  container: React.CSSProperties\n} & StyleMap\n\nexport type ${componentName}Props = {\n  styles?: Partial<${componentName}Styles>\n}\n`
    },
    {
      path: "styles.ts",
      content: `import type { StyleMap } from '@hooks/useThemedStyles/types'\nimport type { ${componentName}Props } from './types'\n\nexport function create${componentName}Styles(_: ${componentName}Props): StyleMap {\n  return {\n    container: {\n      display: 'flex',\n      alignItems: 'center'\n    }\n  }\n}\n`
    }
  ];
}