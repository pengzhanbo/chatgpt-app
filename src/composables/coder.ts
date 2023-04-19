import type { SendMessageOptions } from './sendMessage'
import { sendMessage } from './sendMessage'

export type CodeAction = 'interpretive' | 'optimize'
export interface MonacoAction {
  (option: { action: CodeAction; content: string }): void
}

export function useCodeMessage() {
  const { t } = useI18n()
  async function codeOptimizer(
    action: CodeAction,
    code: string,
    onMessage: SendMessageOptions['onMessage'],
  ) {
    const systemMessage =
      action === 'optimize'
        ? `I want you to act as a code optimizer who specializes in identifying programming languages, optimizing code for better readability, and commenting on the reasons for optimization. Your task is to optimize the provided code and ensure its readability while adding comments explaining the rationale behind your optimizations. Finally, you need to deliver an executable version of the optimized code that runs efficiently.${t(
            'coder.prompt',
          )}`
        : `I want you to act as a code commenter. You have been given a code file in an unfamiliar programming language and your task is to identify the language and add comments to explain the functionality and purpose of the code. After adding comments, you only should be provide me with the annotated code file with clear explanations for each block of code.${t(
            'coder.prompt',
          )}`
    const response = await sendMessage({
      prompt: code,
      stream: true,
      memory: false,
      onMessage,
      systemMessage,
    })
    return response
  }

  return {
    codeOptimizer,
  }
}
