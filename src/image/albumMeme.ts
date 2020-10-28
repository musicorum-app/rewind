import {Nullable, RewindData} from "../api/interfaces";
import {IS_PREVIEW, THEME_COLOR} from "../Constants";
import {
  exportCanvasToBlob, handleAlbumImage,
  loadImage, roundedCanvas
} from "../utils";
import {TFunction} from "i18next";

export default async function generateAlbumMeme(t: TFunction, data: RewindData, compressed = false): Promise<string> {
  const WIDTH = 1000
  const HEIGHT = 660
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx: CanvasRenderingContext2D = (canvas.getContext('2d') as CanvasRenderingContext2D)

  if (IS_PREVIEW) ctx.filter = 'blur(2px)'

  const bg = await loadImage('/assets/albumMeme/background.png')
  ctx.drawImage(bg, 0, 0, WIDTH, HEIGHT)

  const albums = data.topAlbums.slice(0, 5)

  ctx.save()

  let album
  for (let alb of albums) {
    if (alb.image) {
      album = alb
      break
    }
  }
  if (!album) album = albums[0]

  const image = await loadImage(handleAlbumImage(album))

  const rc = roundedCanvas(image, 18)
  ctx.transform(.96, 0.31, -0.164, .91, 622, 405)

  // ctx.globalAlpha = .7

  ctx.drawImage(rc, 0, 0, 180, 200)

  ctx.restore()

  const hand = await loadImage('/assets/albumMeme/hand.png')
  ctx.drawImage(hand, 681, 495, 123, 146)

  ctx.font = '700 32px Montserrat'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#fff'
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 4.4

  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
  ctx.shadowBlur = 16
  ctx.shadowOffsetX = .5
  ctx.shadowOffsetY = .5

  const textParams: [string, number, number, number] = [t('images.albumMeme.text'), WIDTH / 2, HEIGHT - 30, WIDTH * .9]
  ctx.strokeText(...textParams)
  ctx.fillText(...textParams)


  if (IS_PREVIEW) {
    ctx.filter = 'none'
    ctx.fillStyle = 'rgba(0, 0, 0, .4)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    const preview = await loadImage('/assets/rewind_preview_2.svg')

    ctx.drawImage(preview, WIDTH / 2 - preview.width / 2, HEIGHT / 2 - preview.height / 2)
  }

  return canvas.toDataURL('image/png', 1)
}
