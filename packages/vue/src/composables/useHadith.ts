import { ref, watchEffect, Ref, unref } from 'vue'
import { useMuminClient } from '../plugin'
import { Hadith } from '@mumin/core'

export interface UseHadithOptions {
  lang?: string
  enabled?: Ref<boolean> | boolean
}

export function useHadith(
  id: Ref<number | null> | number | null,
  options?: UseHadithOptions
) {
  const client = useMuminClient()
  const data = ref<Hadith | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchHadith = async () => {
    const hadithId = unref(id)
    if (hadithId === null) return

    loading.value = true
    error.value = null
    
    try {
      const result = await client.hadiths.get(hadithId, { lang: options?.lang })
      data.value = result
    } catch (err: any) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    const isEnabled = unref(options?.enabled) ?? true
    const hadithId = unref(id)
    
    if (isEnabled && hadithId !== null) {
      fetchHadith()
    }
  })

  return { data, loading, error, refetch: fetchHadith }
}
