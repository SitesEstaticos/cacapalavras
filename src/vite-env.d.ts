// Tipos para Vite

declare module '*.css' {
  const content: Record<string, string>
  export default content
}

declare module '*.svg' {
  import * as React from 'react'
  const SVGComponent: React.VFC<React.SVGProps<SVGSVGElement> & { title?: string }>
  export default SVGComponent
}

interface ImportMetaEnv {
  readonly VITE_DEBUG: string
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_ANALYTICS_ENABLED: string
  readonly VITE_ANALYTICS_ID: string
  readonly VITE_ADMOB_APP_ID: string
  readonly VITE_ADMOB_BANNER_ID: string
  readonly VITE_ADMOB_REWARDED_ID: string
  readonly VITE_ADMOB_INTERSTITIAL_ID: string
  readonly VITE_LOG_LEVEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
