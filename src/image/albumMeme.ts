import {Nullable, RewindData} from "../api/interfaces";
import {IS_PREVIEW, THEME_COLOR} from "../Constants";
import {
  exportCanvasToBlob,
  loadImage
} from "../utils";

export default async function generateAlbumMeme(data: RewindData, compressed = false): Promise<Nullable<Blob>> {
  const WIDTH = 800
  const HEIGHT = 500
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx: CanvasRenderingContext2D = (canvas.getContext('2d') as CanvasRenderingContext2D)

  ctx.fillStyle = THEME_COLOR
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // if (IS_PREVIEW) ctx.filter = 'blur(4px)'

  ctx.fillStyle = '#000'
  ctx.fillRect(30, 30, 100, 217)

  if (IS_PREVIEW && false) {
    ctx.fillStyle = 'rgba(0, 0, 0, .4)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    const preview = await loadImage('/assets/rewind_preview_2.svg')

    ctx.drawImage(preview, WIDTH / 2 - preview.width / 2, HEIGHT / 2 - preview.height / 2)
  }

  return exportCanvasToBlob(canvas, compressed)
}
