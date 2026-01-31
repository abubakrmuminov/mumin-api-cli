import { useState, useEffect } from 'react'
import { useMuminClient } from '../provider'
import { Hadith, HadithQuery } from '@mumin/core'

export interface UseHadithResult {
  data: Hadith | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useHadith(
  id: number | null, // null allowed to defer fetching
  options?: { lang?: string, enabled?: boolean }
): UseHadithResult {
  const client = useMuminClient()
  const [data, setData] = useState<Hadith | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchHadith = async () => {
    if (id === null) return
    
    setLoading(true)
    setError(null)
    try {
      const result = await client.hadiths.get(id, { lang: options?.lang })
      setData(result)
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options?.enabled !== false && id !== null) {
      fetchHadith()
    }
  }, [id, options?.lang, options?.enabled])

  return { data, loading, error, refetch: fetchHadith }
}
