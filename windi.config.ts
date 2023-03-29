import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class',
  attributify: true,
  safelist: 'rounded-md p-[10px]',
  alias: {},
  extract: {
    include: ['src/**/*.{vue,html,jsx,tsx}'],
    exclude: ['node_modules', '.git', 'electron', 'dist-electron', 'public'],
  },
})
