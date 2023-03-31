import type {
  ChatGPTAPIOptions,
  ChatMessage,
  SendMessageOptions,
} from 'chatgpt'
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt'
import { ipcMain } from 'electron'
import { HttpsProxyAgent } from 'https-proxy-agent'
import fetch from 'node-fetch'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { getAppConfig } from './appConfig'
import { defaultAppConfig } from './constants'
import { renderMarkdown } from './markdown'

let api!: ChatGPTAPI | ChatGPTUnofficialProxyAPI
let webContentsSend!: (channel: string, ...args: any[]) => void
const cache: {
  model?: AppConfig['chatModel']
  apiModel?: AppConfig['apiModel']
  accessToken?: AppConfig['accessToken']
} = {
  model: undefined,
  apiModel: undefined,
  accessToken: undefined,
}

export function setupChatGPTMessage(cb: typeof webContentsSend) {
  webContentsSend = cb
}

export async function setupChatGPT() {
  ipcMain.handle(
    'chatGPT:sendMessage',
    async (
      _,
      prompt: string,
      options: SendMessageOptions,
      senderId: number,
    ) => {
      return await sendMessage(prompt, options, senderId)
    },
  )
  await updateChatGPT()
}

export async function updateChatGPT(config?: AppConfig) {
  config ??= await getAppConfig()
  const apiKey = config.openAIApiKey

  const model = config.chatModel || defaultAppConfig.chatModel
  cache.model = model
  if (config.apiModel === 'ChatGPTUnofficialProxyAPI') {
    const options = {
      accessToken: config.accessToken,
      model,
    }
    cache.apiModel = 'ChatGPTUnofficialProxyAPI'
    setupProxy(options as unknown as ChatGPTAPIOptions, config)
    api = new ChatGPTUnofficialProxyAPI(options)
  } else {
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
    cache.apiModel = 'ChatGPTAPI'
    setupProxy(options, config)
    api = new ChatGPTAPI(options)
  }
}

export async function sendMessage(
  prompt: string,
  options: SendMessageOptions & { conversationId?: string },
  senderId: number,
): Promise<SendMessageResponse> {
  const config = await getAppConfig()
  if (!config.openAIApiKey) {
    return { type: 'error', code: -1, message: '', payload: null }
  }
  if (
    !api ||
    cache.apiModel !== config.apiModel ||
    cache.model !== config.chatModel
  ) {
    await updateChatGPT(config)
  }
  if (
    api instanceof ChatGPTAPI &&
    config.openAIApiKey !== api.apiKey &&
    cache.apiModel === 'ChatGPTAPI'
  ) {
    api.apiKey = config.openAIApiKey
  }
  if (
    api instanceof ChatGPTUnofficialProxyAPI &&
    cache.apiModel === 'ChatGPTUnofficialProxyAPI' &&
    cache.accessToken !== config.accessToken
  ) {
    api.accessToken = config.accessToken
    cache.accessToken = config.accessToken
  }
  if (cache.apiModel === 'ChatGPTAPI') {
    delete options.conversationId
  }
  options.timeoutMs ??= config.timeout || defaultAppConfig.timeout
  let progressResponse!: ChatGPTMessage & { original?: ChatMessage }
  options.onProgress = (response) => {
    progressResponse = transformMessage(response)
    webContentsSend('chatGPT:onProgress', progressResponse, senderId)
  }

  try {
    const response = await api.sendMessage(prompt, options)
    // eslint-disable-next-line no-console
    console.info('sendMessage:', response)
    return { type: 'success', payload: transformMessage(response) }
  } catch (e) {
    console.error(e)
    const code = e.statusCode
    progressResponse ??= {
      role: 'assistant',
      createTime: Date.now(),
    } as ChatGPTMessage
    progressResponse.type = 'error'
    progressResponse.errorMessage = e.statusText || e.message
    return {
      type: 'error',
      code,
      message: e.statusText || e.message,
      payload: progressResponse,
    }
  }
}

function transformMessage(
  res: ChatMessage,
): ChatGPTMessage & { original?: ChatMessage } {
  return {
    id: res.id,
    text: res.text,
    role: res.role,
    parentMessageId: res.parentMessageId,
    conversationId: res.conversationId,
    createTime: Date.now(),
    rendered: renderMarkdown(res.text),
    errorMessage: '',
    type: 'success',
    original: res,
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
