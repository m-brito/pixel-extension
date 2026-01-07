export type QuickPickItem<TId extends string = string> = {
  id: TId
  label: string
  description?: string
}

export interface UiPort {
  info(message: string): void
  error(message: string): void

  getWorkspaceRoot(): { fsPath: string } | null

  pickOne<TId extends string>(
    items: QuickPickItem<TId>[],
    opts: { title: string; placeHolder?: string }
  ): Promise<QuickPickItem<TId> | undefined>

  input(
    title: string,
    opts?: {
      placeHolder?: string
      validate?: (value: string) => string | undefined
    }
  ): Promise<string | undefined>

  confirm?(message: string): Promise<boolean>
}