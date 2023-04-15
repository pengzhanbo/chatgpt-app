import { invoke } from '@tauri-apps/api'
import { usePromptDB } from './db'

const EXPIRES = 24 * 60 * 60 * 1000
const PROMPTS_URL =
  'https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv'

export interface PromptItem {
  act: string
  prompt: string
}

export function usePrompt() {
  const db = usePromptDB()
  const promptList = ref<PromptItem[]>([])

  async function loadPrompt() {
    const lastUpdated = await db.get<number>('last_updated')
    let raw: PromptItem[] | null = []
    if (!lastUpdated || Date.now() - lastUpdated > EXPIRES) {
      const data = await fetchPrompts()
      raw = (await invoke<PromptItem[]>('parse_prompt', { data })) || []
      if (raw) {
        await db.set('prompt_list', raw)
        await db.set('last_updated', Date.now())
      }
    } else {
      raw = (await db.get<PromptItem[]>('prompt_list')) || []
    }
    promptList.value = [{ act: 'Default', prompt: '' }, ...raw]
  }

  return {
    promptList,
    loadPrompt,
  }
}

async function fetchPrompts() {
  const res = await fetch(PROMPTS_URL, {
    method: 'GET',
  })
  if (res.ok) {
    return await res.text()
  } else {
    return ''
  }
}
