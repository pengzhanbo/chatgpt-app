import { darkTheme, lightTheme } from 'naive-ui'

const scrollbarStyle = () => {
  const style = document.createElement('style')
  const styleContent = `
    ::-webkit-scrollbar {
      background-color: transparent;
      width: ${lightTheme.Scrollbar.common?.scrollbarWidth};
      height: ${lightTheme.Scrollbar.common?.scrollbarWidth};
    }
    ::-webkit-scrollbar-thumb {
      background-color: ${lightTheme.Scrollbar.common?.scrollbarColor};
      border-radius: ${lightTheme.Scrollbar.common?.scrollbarBorderRadius};
    }
    html.dark ::-webkit-scrollbar {
      background-color: transparent;
      width: ${darkTheme.Scrollbar.common?.scrollbarWidth};
      height: ${darkTheme.Scrollbar.common?.scrollbarWidth};
    }
    html.dark ::-webkit-scrollbar-thumb {
      background-color: ${darkTheme.Scrollbar.common?.scrollbarColor};
      border-radius: ${darkTheme.Scrollbar.common?.scrollbarBorderRadius};
    }
  `

  style.innerHTML = styleContent
  document.head.appendChild(style)
}

function naiveUIOverride() {
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
}

export function installNaiveUI() {
  naiveUIOverride()
  scrollbarStyle()
}
