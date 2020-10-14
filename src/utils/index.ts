import {
  FormattedAlbum,
  FormattedArtist,
  Nullable,
  WeeklyArtistFormatted
} from "../api/interfaces";

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

export default function hexToRGBA(hex: string, alpha = 1): string {
  let r = parseInt(hex.slice(1, 3), 16)
  let g = parseInt(hex.slice(3, 5), 16)
  let b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function exportCanvasToBlob(canvas: HTMLCanvasElement, compressed: boolean = false): Promise<Nullable<Blob>> {
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(blob)
    }, 'image/' + (compressed ? 'jpeg' : 'png'), compressed ? .9 : 1)
  })
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const img = new Image()
    img.setAttribute('crossorigin', 'anonymous')
    img.src = src
    img.onload = () => {
      resolve(img)
    }
  })
}

export function createCircularCanvas(image: HTMLImageElement, w: number = image.width, h: number = image.height, r: number = w * 0.5): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx: CanvasRenderingContext2D = (canvas.getContext('2d') as CanvasRenderingContext2D)

  ctx.clearRect(0, 0, w, h)

  ctx.globalCompositeOperation = 'source-over'
  ctx.drawImage(image, 0, 0, w, h)

  ctx.fillStyle = '#000'
  ctx.globalCompositeOperation = 'destination-in'
  ctx.beginPath()
  ctx.arc(w * .5, h * .5, r, 0, Math.PI * 2, true)
  ctx.closePath()
  ctx.fill()

  return canvas
}

export function roundedCanvas(image: HTMLImageElement, r: number = image.width * 0.5): HTMLCanvasElement {
  let w = image.width
  let h = image.height
  const x = 0
  const y = 0

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx: CanvasRenderingContext2D = (canvas.getContext('2d') as CanvasRenderingContext2D)

  if (w < 2 * r) r = w / 2
  if (h < 2 * r) r = h / 2
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()

  ctx.globalCompositeOperation = 'source-over'
  ctx.drawImage(image, 0, 0, w, h)

  ctx.globalCompositeOperation = 'destination-in'
  ctx.fillStyle = '#fff'
  ctx.fill()

  return canvas
}

export function writeText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, x: number, y: number) {
  let width = ctx.measureText(text).width
  let letters = text.split('')
  let reduced = false
  while (width > maxWidth) {
    letters = letters.slice(0, -1)
    width = ctx.measureText(letters.join('') + '…').width
    reduced = true
    if (letters.length === 2) break
  }
  text = letters.join('')
  if (text.endsWith(' ')) text = text.slice(0, -1)
  ctx.fillText(text + (reduced ? '…' : ''), x, y)
}