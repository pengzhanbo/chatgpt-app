import mdKatex from '@traptitech/markdown-it-katex'
import { escape } from 'html-escaper'
import MarkdownIt from 'markdown-it'
import linkAttr from 'markdown-it-link-attributes'
import { getHighlighter, setCDN } from 'shiki'
import { codeLanguageAlias } from '~/common/constants'

setCDN('/shiki')

const themes = {
  dark: 'material-theme-palenight',
  light: 'min-light',
}

export const mdi = new MarkdownIt({
  linkify: true,
})

mdi.use(linkAttr, { attrs: { target: '_blank', rel: 'noopener' } })
mdi.use(mdKatex, {
  blockClass: 'katexmath-container rounded-md p-[10px]',
  errorColor: ' #cc0000',
})

mdi.use(linkAttr, { attrs: { target: '_blank', rel: 'noopener' } })
mdi.use(mdKatex, {
  blockClass: 'katexmath-container rounded-md p-[10px]',
  errorColor: ' #cc0000',
})

let isDark = false

export async function setupMarkdown() {
  const highlighter = await getHighlighter({
    themes: [themes.light, themes.dark],
  })
  mdi.options.highlight = (code, lang) => {
    const shortLang =
      codeLanguageAlias[lang as keyof typeof codeLanguageAlias] || lang
    if (lang === 'svg') lang = 'html'
    const content = highlighter.codeToHtml(code, {
      lang,
      theme: isDark ? themes.dark : themes.light,
    })
    const lines = content.split('\n').slice(0, -1)
    const lineNumbersCode = lines
      .map(() => '<div class="line-number"></div>')
      .join('')

    return `<div class="language-${lang}" data-lang="${shortLang}"><span class="copy-code"></span>${content}<div class="line-numbers" aria-hidden="true">${lineNumbersCode}</div></div>`
  }
}

export function renderMarkdown(code: string, dark = false) {
  isDark = dark
  return mdi.render(code)
}

export function renderText(text: string): string {
  return escape(text)
    .replace(/^\n+|\n+$/g, '')
    .split(/\n+/)
    .map((str) => `<p>${str}</p>`)
    .join('')
}
