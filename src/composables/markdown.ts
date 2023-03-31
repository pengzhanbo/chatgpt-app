import { invoke } from '~/common/electron'

export async function markdownRender(code: string) {
  return await invoke('markdown:render', code)
}
