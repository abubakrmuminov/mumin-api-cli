import { inject, App, InjectionKey } from 'vue'
import { MuminClient, MuminConfig } from '@mumin/core'

export const MuminClientKey: InjectionKey<MuminClient> = Symbol('MuminClient')

export interface MuminPluginOptions {
  apiKey: string
  config?: Partial<MuminConfig>
}

export const MuminPlugin = {
  install(app: App, options: MuminPluginOptions) {
    const client = new MuminClient(options.apiKey, options.config)
    app.provide(MuminClientKey, client)
  }
}

export function useMuminClient(): MuminClient {
  const client = inject(MuminClientKey)
  if (!client) {
    throw new Error('MuminPlugin not installed')
  }
  return client
}
