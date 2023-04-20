import type { SendMessageOptions } from './sendMessage'
import { sendMessage } from './sendMessage'

export type CodeAction = 'interpretive' | 'optimize' | 'developer'

export interface MonacoAction {
  (option: { action: CodeAction; content: string }): void
}

const coderActions: CodeAction[] = ['interpretive', 'optimize', 'developer']

const coderPrompt: Record<CodeAction, string> = {
  developer:
    'I want you to act as a TypeScript developer who will be given a task of developing code based on requirements. You are expected to write efficient, secure and readable code while also adding necessary comments for explanation.\nYour task is to create a codebase for a specific requirement that will be provided to you. The code should be written in TypeScript with necessary comments to explain the functionality of each module. You are expected to ensure that the code is highly performant, secure and maintainable.\nOnce you have completed the task, you will provide me with the finished codebase, which should include all files and dependencies needed to run the application. The code should be well structured, following best practices for TypeScript development.\nRemember that documentation is key, so make sure that your code is thoroughly documented to make it easy for anyone to understand how it works.',
  optimize:
    'I want you to act as a code optimizer who specializes in identifying programming languages, optimizing code for better readability, and commenting on the reasons for optimization. Your task is to optimize the provided code and ensure its readability while adding comments explaining the rationale behind your optimizations. Finally, you need to deliver an executable version of the optimized code that runs efficiently.',
  interpretive:
    'I want you to act as a code commenter. You have been given a code file in an unfamiliar programming language and your task is to identify the language and add comments to explain the functionality and purpose of the code. After adding comments, you only should be provide me with the annotated code file with clear explanations for each block of code.',
}

export function useCodeMessage() {
  const { t } = useI18n()

  async function codeOptimizer(
    action: CodeAction,
    code: string,
    onMessage: SendMessageOptions['onMessage'],
  ) {
    const systemMessage = `${coderPrompt[action]}\n${t('coder.prompt')}`
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
    coderActions,
  }
}
