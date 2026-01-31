import { MuminClient } from '@mumin/core'

async function main() {
  console.log('🚀 Initializing MuminClient...')
  
  // NOTE: This demo key is just for testing structure, obviously for real requests we need a real key
  // But likely the user will replace it or we use a dummy one if we just want to test compilation
  const client = new MuminClient('sk_mumin_test_key_1234567890abcdef12345678')

  try {
    console.log('📚 Fetching Collections...')
    const collections = await client.collections.list()
    console.log('RAW COLLECTIONS:', JSON.stringify(collections, null, 2))
    
    // Check if it's wrapped in 'data'
    const list = Array.isArray(collections) ? collections : (collections as any).data || []
    console.log(`✅ Found ${list?.length} collections`)

    console.log('\n🎲 Fetching Random Hadith...')
    const random = await client.hadiths.random()
    console.log('✅ Random Hadith:', random.hadithNumber)
    
    // Handle text structure
    const text = random.translation?.text || random.arabicText || 'No text found'
    console.log('Text:', text.substring(0, 50) + '...')
    
  } catch (error: any) {
    console.error('❌ Error full details:', JSON.stringify(error, null, 2))
    if (error.response) {
         console.error('Response data:', await error.response.json())
    }
  }
}

main()
