// Test script to debug search functionality
import { searchAll, searchAlbums, searchSongs } from './lib/api.js'

async function testSearch() {
  console.log('Testing search functionality...')
  
  try {
    console.log('Testing searchAlbums with "Taylor Swift"...')
    const albums = await searchAlbums('Taylor Swift')
    console.log('Albums found:', albums.length)
    console.log('First album:', albums[0])
    
    console.log('\nTesting searchSongs with "Taylor Swift"...')
    const songs = await searchSongs('Taylor Swift')
    console.log('Songs found:', songs.length)
    console.log('First song:', songs[0])
    
    console.log('\nTesting searchAll with "Taylor Swift"...')
    const all = await searchAll('Taylor Swift')
    console.log('All results found:', all.length)
    console.log('First result:', all[0])
    
  } catch (error) {
    console.error('Error during testing:', error)
  }
}

testSearch() 