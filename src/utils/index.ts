import {FormattedAlbum, FormattedArtist, FormattedTrack, WeeklyArtistFormatted, WeeklyTrack} from "../api/interfaces";

export function convertRange(value: number, r1: number[], r2: number[]): number {
  return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}

export function addToMap(items: string[], map: Map<string, any>) {
  for (let i of items) map.set(i, null)
}

export function handleArtistImage(artist: FormattedArtist | WeeklyArtistFormatted
) {
  if (artist && artist.spotify && artist.spotify.image) return artist.spotify.image
  else return 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.webp'
}

export function handleAlbumImage(album: FormattedAlbum): string {
  if (album && album.image) return album.image
  else return 'https://lastfm.freetls.fastly.net/i/u/64s/4128a6eb29f94943c9d206c08e625904.webp'
}

export function handleTrackImage(image: string | undefined) {
  return image
    ? image.replace('/300x300/', '/600x600/')
    : 'https://lastfm.freetls.fastly.net/i/u/600x600/c6f59c1e5e7240a4c0d427abd71f3dbb.jpg'
}

export function getShuffledArray(array: any[]): any[] {
  let c = [...array]
  c.sort(() => Math.random() - 0.5);
  return c
}

export function getReversed(arr: any[]): any[] {
  const clone = [...arr]
  clone.reverse()
  return clone
}

export function shadeColor(hex: string, percent: number): string {
  let r = parseInt(hex.slice(1, 3), 16)
  let g = parseInt(hex.slice(3, 5), 16)
  let b = parseInt(hex.slice(5, 7), 16)

  r = ~~(r * (100 + percent) / 100)
  g = ~~(g * (100 + percent) / 100)
  b = ~~(b * (100 + percent) / 100)

  r = r > 255 ? 255 : r
  g = g > 255 ? 255 : g
  b = b > 255 ? 255 : b

  return `rgb(${r}, ${g}, ${b})`
}
