import React, { createContext, useContext, useMemo } from 'react'
import { MuminClient, MuminConfig } from '@mumin/core'

interface MuminContextValue {
  client: MuminClient
}

const MuminContext = createContext<MuminContextValue | null>(null)

export interface MuminProviderProps {
  apiKey: string
  config?: Partial<MuminConfig>
  children: React.ReactNode
}

export function MuminProvider({ apiKey, config, children }: MuminProviderProps) {
  const client = useMemo(() => {
    return new MuminClient(apiKey, config)
  }, [apiKey, config])

  return (
    <MuminContext.Provider value={{ client }}>
      {children}
    </MuminContext.Provider>
  )
}

export function useMuminClient(): MuminClient {
  const context = useContext(MuminContext)
  if (!context) {
    throw new Error('useMuminClient must be used within MuminProvider')
  }
  return context.client
}
