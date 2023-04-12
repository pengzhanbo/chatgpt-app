export function useCopyCode() {
  const timeoutIdMap: Map<HTMLElement, number> = new Map()
  window.addEventListener('click', (e) => {
    const el = e.target as HTMLElement
    if (el.matches('div[class*="language-"] > span.copy-code')) {
      const parent = el.parentElement
      const sibling = el.nextElementSibling as HTMLPreElement | null
      if (!parent || !sibling) {
        return
      }

      const isShell = /language-(shellscript|shell|bash|sh|zsh)/.test(
        parent.className,
      )

      let text = ''

      sibling
        .querySelectorAll('span.line:not(.diff.remove)')
        .forEach((node) => (text += `${node.textContent || ''}\n`))
      text = text.slice(0, -1)

      if (isShell) {
        text = text.replace(/^ *(\$|>) /gm, '').trim()
      }

      copyToClipboard(text).then(() => {
        el.classList.add('copied')
        clearTimeout(timeoutIdMap.get(el))
        const timeoutId = setTimeout(() => {
          el.classList.remove('copied')
          el.blur()
          timeoutIdMap.delete(el)
        }, 2000)
        timeoutIdMap.set(el, timeoutId as unknown as number)
      })
    }
  })
}

export async function copyToClipboard(text: string) {
  try {
    return navigator.clipboard.writeText(text)
  } catch {
    const element = document.createElement('textarea')
    const previouslyFocusedElement = document.activeElement

    element.value = text

    // Prevent keyboard from showing on mobile
    element.setAttribute('readonly', '')

    element.style.contain = 'strict'
    element.style.position = 'absolute'
    element.style.left = '-9999px'
    element.style.fontSize = '12pt' // Prevent zooming on iOS

    const selection = document.getSelection()
    const originalRange = selection
      ? selection.rangeCount > 0 && selection.getRangeAt(0)
      : null

    document.body.appendChild(element)
    element.select()

    // Explicit selection workaround for iOS
    element.selectionStart = 0
    element.selectionEnd = text.length

    document.execCommand('copy')
    document.body.removeChild(element)

    if (originalRange) {
      selection!.removeAllRanges() // originalRange can't be truthy when selection is falsy
      selection!.addRange(originalRange)
    }

    // Get the focus back on the previously focused element, if any
    if (previouslyFocusedElement) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(previouslyFocusedElement as HTMLElement).focus()
    }
  }
}
