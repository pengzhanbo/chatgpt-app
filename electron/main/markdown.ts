import mdKatex from '@traptitech/markdown-it-katex'
import MarkdownIt from 'markdown-it'
import linkAttr from 'markdown-it-link-attributes'
import shiki from 'shiki'
import { codeLanguageAlias } from './constants'

export const mdi = new MarkdownIt({
  linkify: true,
})

mdi.use(linkAttr, { attrs: { target: '_blank', rel: 'noopener' } })
mdi.use(mdKatex, {
  blockClass: 'katexmath-container rounded-md p-[10px]',
  errorColor: ' #cc0000',
})

export async function setupMarkdown() {
  const highlighter = await shiki.getHighlighter({
    theme: 'material-theme-palenight',
  })
  mdi.options.highlight = (code, lang) => {
    const shortLang = codeLanguageAlias[lang] || lang
    const content = highlighter.codeToHtml(code, { lang })
    return `<div class="language-${lang}" data-lang="${shortLang}"><span class="copy-code"></span>${content}</div>`
  }
}

export function renderMarkdown(code: string) {
  return mdi.render(code)
}
