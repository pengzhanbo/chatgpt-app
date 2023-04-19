import * as monaco from 'monaco-editor'
import type { SendMessageOptions } from './sendMessage'
import { sendMessage } from './sendMessage'

export type CodeAction = 'interpretive' | 'optimize'
export interface MonacoAction {
  (option: {
    action: CodeAction
    content: string
    selection: monaco.Selection | null
  }): void
}

export function useMonaco(
  initOptions: monaco.editor.IStandaloneEditorConstructionOptions = {},
) {
  const editorEl = ref<HTMLElement | null>()
  let editor!: monaco.editor.IStandaloneCodeEditor

  const code = ref<string>(initOptions.value || '')
  let monacoAction: MonacoAction | null

  onMounted(() => {
    if (editorEl.value) {
      editor = monaco.editor.create(editorEl.value, {
        automaticLayout: true,
        minimap: { enabled: false },
        ...initOptions,
        value: code.value,
      })

      setLanguage('markdown')
      initAction()

      editor.onDidChangeModelContent(() => {
        code.value = editor.getValue()
      })
    }
  })

  onUnmounted(() => editor.dispose())

  function initAction() {
    editor.addAction({
      id: 'chatgpt-interpretive-code',
      label: '解释这段代码',
      contextMenuOrder: 1,
      contextMenuGroupId: 'navigation',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI],
      run: (editor) => {
        const selection = editor.getSelection()
        const rangeCode = getValueInRange(selection, editor)
        monacoAction?.({
          action: 'interpretive',
          content: rangeCode,
          selection,
        })
      },
    })
    editor.addAction({
      id: 'chatgpt-optimize-code',
      label: '优化这段代码',
      contextMenuOrder: 1,
      contextMenuGroupId: 'navigation',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO],
      run: (editor) => {
        const selection = editor.getSelection()
        const rangeCode = getValueInRange(selection, editor)
        monacoAction?.({ action: 'optimize', content: rangeCode, selection })
      },
    })
  }

  const isDarkMode = useDarkMode()
  watch(
    isDarkMode,
    (isDark) => {
      monaco.editor.setTheme(isDark ? 'vs-dark' : '')
    },
    { immediate: true },
  )

  function setLanguage(language: string) {
    const model = editor.getModel()
    model && monaco.editor.setModelLanguage(model, language)
  }

  function updateCode(code: string) {
    editor.setValue(code)
  }

  function getValueInRange(
    selection?: monaco.Selection | null,
    ed?: monaco.editor.ICodeEditor,
  ) {
    ed = ed || editor
    selection ??= ed.getSelection()
    const model = ed.getModel()
    return selection && model ? model.getValueInRange(selection) : ed.getValue()
  }

  function onMonacoAction(cb: MonacoAction) {
    monacoAction = cb
  }

  return {
    editorEl,
    setLanguage,
    updateCode,
    getValueInRange,
    onMonacoAction,
  }
}

export function useCodeMessage() {
  const { t } = useI18n()
  async function codeOptimizer(
    action: CodeAction,
    lang: string,
    code: string,
    onMessage: SendMessageOptions['onMessage'],
  ) {
    const systemMessage =
      action === 'optimize'
        ? `I want you to act as a ${lang} Code Optimization Coach and provide me with the optimized code, along with detailed comments explaining the reason behind each optimization. The code should be improved in terms of performance, readability, maintainability, and efficiency. Please ensure that the optimized code adheres to industry standards and best practices, and is thoroughly tested to ensure it functions correctly.${t(
            'coder.prompt',
          )}`
        : `I want you to act as a ${lang} code explanation coach, and provide me with code that contains only comments explaining its functionality. The comments should clearly explain the purpose of each line or block of code, without any additional explanations or instructions. Please make sure to include all necessary comments for me to understand the code's functionality.${t(
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
