import {FormattedArtist, WeeklyArtistFormatted} from "../api/interfaces";

export function convertRange(value: number, r1: number[], r2: number[]): number {
  return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}

export function addToMap(items: string[], map: Map<string, any>) {
  for (let i of items) map.set(i, null)
}

export function handleArtistImage(artist: FormattedArtist | WeeklyArtistFormatted
) {
  if (artist && artist.spotify && artist.spotify.url) return artist.spotify.url
  else return 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.webp'
}

export function getShuffledArray(array: any[]): any[] {
  let c = [...array]
  c.sort(() => Math.random() - 0.5);
  return c
}
