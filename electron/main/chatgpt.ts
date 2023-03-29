import type { ChatGPTAPIOptions, SendMessageOptions } from 'chatgpt'
import { ChatGPTAPI } from 'chatgpt'
import { ipcMain } from 'electron'
import { HttpsProxyAgent } from 'https-proxy-agent'
import fetch from 'node-fetch'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { getAppConfig } from './appConfig'

let api!: ChatGPTAPI
let webContentsSend!: (channel: string, ...args: any[]) => void

export function setupChatGPTMessage(cb: typeof webContentsSend) {
  webContentsSend = cb
}

export async function setupChatGPT() {
  ipcMain.handle(
    'chatGPT:sendMessage',
    async (_, prompt: string, options: SendMessageOptions) => {
      return await sendMessage(prompt, options)
    },
  )
  ipcMain.handle('chatGPT:apiKey', async () => {
    const config = await getAppConfig()
    const apiKey = config.openAIApiKey
    return apiKey
  })
  ipcMain.handle('chatGPT:update', async (_) => {
    await updateChatGPT()
  })
  await updateChatGPT()
}

export async function updateChatGPT() {
  const config = await getAppConfig()
  const apiKey = config.openAIApiKey

  if (!apiKey) {
    webContentsSend?.('chatGPT:update', {
      type: 'Fail',
      code: -1,
    })
    api = null
    return
  }

  const model = config.chatModel || 'gpt-3.5-turbo'
  const options: ChatGPTAPIOptions = {
    apiKey,
    completionParams: { model },
  }

  if (model.toLowerCase().includes('gpt-4')) {
    if (model.toLowerCase().includes('32k')) {
      options.maxModelTokens = 32768
      options.maxResponseTokens = 8192
    } else {
      options.maxModelTokens = 8192
      options.maxResponseTokens = 2048
    }
  }

  setupProxy(options, config)

  api = new ChatGPTAPI(options)
}

export async function sendMessage(prompt: string, options: SendMessageOptions) {
  const config = await getAppConfig()
  options.timeoutMs ??= config.timeout || 30 * 1000
  options.onProgress = (response) => {
    webContentsSend('chatGPT:onProgress', response)
  }
  if (!api) {
    try {
      await updateChatGPT()
    } catch (e) {
      return { type: 'Fail', code: -2, message: e.message }
    }
  }
  if (!api) {
    return { type: 'Fail', code: -1, message: config }
  }
  try {
    const response = await api.sendMessage(prompt, options)
    // eslint-disable-next-line no-console
    console.log('sendMessage:', response)
    return { type: 'Success', payload: response }
  } catch (e) {
    const code = e.statusCode
    console.error(e)
    return { type: 'Fail', code, message: e.message }
  }
}

/**
 * 由于在国内环境下基本无法正常访问 openai，添加代理支持。
 * 支持 socks 或 http 代理。
 * 你需要的是一个梯子
 * @param option
 * @param config
 */
function setupProxy(option: ChatGPTAPIOptions, config: AppConfig) {
  if (config.socksProxyHost && config.socksProxyPort) {
    const agent = new SocksProxyAgent({
      host: config.socksProxyHost,
      port: config.socksProxyPort,
    })
    option.fetch = ((url: any, options: any) =>
      fetch(url, { agent, ...options })) as any
  } else if (config.httpProxy) {
    const agent = new HttpsProxyAgent(config.httpProxy)
    option.fetch = ((url: any, options: any) =>
      fetch(url, { agent, ...options })) as any
  } else {
    option.fetch = ((url: any, options: any) => fetch(url, options)) as any
  }
}
