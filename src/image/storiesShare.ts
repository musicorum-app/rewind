import {Nullable, RewindData} from "../api/interfaces";
import {IS_PREVIEW, THEME_COLOR} from "../Constants";
import {
  exportCanvasToBlob,
  handleArtistImage,
  handleTrackImage,
  loadImage,
  roundedCanvas,
  writeText
} from "../utils";

export default async function generateStoriesShare(data: RewindData, compressed = false): Promise<Nullable<Blob>> {
  const WIDTH = 1080
  const HEIGHT = 1920
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx: CanvasRenderingContext2D = (canvas.getContext('2d') as CanvasRenderingContext2D)

  const MARGIN = 64

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  if (IS_PREVIEW) ctx.filter = 'blur(6px)'

  const HEADER_HEIGHT = 180
  ctx.fillStyle = THEME_COLOR
  ctx.fillRect(0, 0, WIDTH, HEADER_HEIGHT)

  ctx.fillStyle = THEME_COLOR

  ctx.textBaseline = 'middle'
  ctx.font = '900 100px Montserrat'
  ctx.lineWidth = 5
  ctx.strokeText('2020', MARGIN, HEADER_HEIGHT / 2 + 3)

  const logo = await loadImage('https://cdn-2.musicorumapp.com/rewind/rewind_logo.svg')
  logo.width = 193
  logo.height = 73
  ctx.drawImage(logo, WIDTH - MARGIN - logo.width, (HEADER_HEIGHT / 2) - (logo.height / 2), logo.width, logo.height)


  const _artistImage = await loadImage(handleArtistImage(data.topArtists[0]))
  const _trackImage = await loadImage(handleTrackImage(data.topTracks[0].image))
  const _userImage = await loadImage(data.user.image[3]["#text"] || 'https://lastfm.freetls.fastly.net/i/u/300x300/818148bf682d429dc215c1705eb27b98.jpg')

  const [artistImage, trackImage, userImage] = [_artistImage, _trackImage, _userImage]
    .map((img, i) => roundedCanvas(img, i === 2 ? 5 : 15))

  const SIDE_IMAGE_SIZE = 280
  const USER_IMAGE_SIZE = 412

  const USER_Y = HEADER_HEIGHT + MARGIN
  const SIDE_IMAGE_Y = USER_Y + (USER_IMAGE_SIZE / 2) - (SIDE_IMAGE_SIZE / 2)

  ctx.globalAlpha = .5

  ctx.drawImage(artistImage, MARGIN, SIDE_IMAGE_Y, SIDE_IMAGE_SIZE, SIDE_IMAGE_SIZE)
  ctx.drawImage(trackImage, WIDTH - MARGIN - SIDE_IMAGE_SIZE, SIDE_IMAGE_Y, SIDE_IMAGE_SIZE, SIDE_IMAGE_SIZE)

  ctx.globalAlpha = 1

  const SHADOW_SPREAD = 380
  const USER_IMAGE_SPREAD = USER_IMAGE_SIZE + (SHADOW_SPREAD * 2)
  ctx.shadowColor = '#000'
  ctx.shadowBlur = 100
  ctx.fillStyle = 'rgba(0, 0, 0, 0)'
  ctx.shadowOffsetX = 12
  ctx.fillRect((WIDTH / 2) - (USER_IMAGE_SIZE / 2) - SHADOW_SPREAD, USER_Y - SHADOW_SPREAD, USER_IMAGE_SPREAD, USER_IMAGE_SPREAD)

  ctx.shadowOffsetX = -12
  ctx.fillRect((WIDTH / 2) - (USER_IMAGE_SIZE / 2) - SHADOW_SPREAD, USER_Y - SHADOW_SPREAD, USER_IMAGE_SPREAD, USER_IMAGE_SPREAD)

  ctx.drawImage(userImage, (WIDTH / 2) - (USER_IMAGE_SIZE / 2), USER_Y, USER_IMAGE_SIZE, USER_IMAGE_SIZE)

  ctx.shadowColor = 'none'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.fillStyle = THEME_COLOR
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'

  ctx.font = '900 62px Montserrat'
  writeText(ctx, data.user.name, WIDTH - (MARGIN * 2), WIDTH / 2, USER_Y + USER_IMAGE_SIZE + MARGIN)

  ctx.font = '900 167px Montserrat'
  writeText(ctx, data.stats.scrobbles.toLocaleString(), WIDTH - (MARGIN * 2), WIDTH / 2, USER_Y + USER_IMAGE_SIZE + (MARGIN * 2) + 63 )

  ctx.font = '500 34px Montserrat'
  ctx.fillStyle = 'white'
  writeText(ctx, 'scrobbles', WIDTH - (MARGIN * 2), WIDTH / 2, USER_Y + USER_IMAGE_SIZE + (MARGIN * 2) + 63 + 153)

  const lists: string[][] = [
    ['most listened artists', ...data.topArtists.map(a => a.name)],
    ['most listened albums', ...data.topAlbums.map(a => a.name)],
    ['most listened tracks', ...data.topTracks.map(a => a.name)],
    ['most listened tags', ...data.topTags.map(a => a.tag)]
  ]

  const BOXES_Y = USER_Y + USER_IMAGE_SIZE + (MARGIN * 4) + 63 + 153 + 3
  const BOX_WIDTH = (WIDTH - (MARGIN * 2)) / 2
  const BOX_HEIGHT = ((HEIGHT - MARGIN - BOXES_Y) / 2)
  const BOX_MAX_WIDTH = BOX_WIDTH - (MARGIN / 2)

  ctx.textAlign = 'start'

  let i = 0
  for (let j = 0; j < 2; j++) {
    for (let k = 0; k < 2; k++) {
      const list = lists[i]

      ctx.font = '700 34px Montserrat'
      ctx.fillStyle = THEME_COLOR
      const BOX_X = MARGIN + (BOX_WIDTH * j)
      const BOX_Y = BOXES_Y + (BOX_HEIGHT * k) + (MARGIN * 0.5 * k)
      console.log(BOX_Y, BOX_HEIGHT, k)

      writeText(ctx, list[0], BOX_MAX_WIDTH, BOX_X, BOX_Y)

      ctx.font = '500 36px Montserrat'
      ctx.fillStyle = 'white'

      for (let l = 1; l < 7; l++) {
        const item = list[l]

        writeText(ctx, item, BOX_MAX_WIDTH, BOX_X, BOX_Y + (48 * l))
      }

      i++
    }
  }

  ctx.font = '600 16px Montserrat'
  ctx.fillStyle = 'rgba(255, 255, 255, .5)'
  ctx.save()

  ctx.translate(WIDTH - 18, HEIGHT - 18)
  ctx.rotate(-0.5 * Math.PI)
  ctx.textAlign = 'start'
  ctx.textBaseline = 'bottom'
  writeText(ctx, 'rewind.musicorumapp.com', WIDTH, 0, 0)

  ctx.restore()

  ctx.filter = 'none'

  if (IS_PREVIEW) {
    ctx.fillStyle = 'rgba(0, 0, 0, .4)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    const preview = await loadImage('https://cdn-2.musicorumapp.com/rewind/rewind_preview_storie.svg')

    ctx.drawImage(preview, WIDTH / 2 - preview.width / 2, HEIGHT / 2 - preview.height / 2)
  }

  return exportCanvasToBlob(canvas, compressed)
}
