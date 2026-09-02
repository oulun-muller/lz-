/// <reference types="vite/client" />

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module 'element-ui' {
  import Vue, { PluginFunction } from 'vue'
  const ElementUI: { install: PluginFunction<unknown> }
  export const Message: {
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
  }
  export default ElementUI
}
