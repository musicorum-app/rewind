import {Nullable, RewindData} from "../api/interfaces";
import {THEME_COLOR} from "../Constants";
import {
  exportCanvasToBlob,
  handleArtistImage,
  handleTrackImage,
  loadImage,
  roundedCanvas,
  writeText
} from "../utils";

export default async function generateNormalShare(data: RewindData, compressed = false): Promise<Nullable<Blob>> {
  const SIZE = 800
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx: CanvasRenderingContext2D = (canvas.getContext('2d') as CanvasRenderingContext2D)

  const MARGIN = 35

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, SIZE, SIZE)

  const HEADER_HEIGHT = 64
  ctx.fillStyle = THEME_COLOR
  ctx.fillRect(0, 0, SIZE, HEADER_HEIGHT)

  const logo = await loadImage('https://cdn-2.musicorumapp.com/rewind/rewind_logo.svg')
  logo.width = 92
  logo.height = 35
  ctx.drawImage(logo, SIZE - MARGIN - logo.width, (HEADER_HEIGHT / 2) - (logo.height / 2), 92, 35)

  const _artistImage = await loadImage(handleArtistImage(data.topArtists[0]))
  const _trackImage = await loadImage(handleTrackImage(data.topTracks[0].image))
  const _userImage = await loadImage(data.user.image[3]["#text"] || 'https://lastfm.freetls.fastly.net/i/u/300x300/818148bf682d429dc215c1705eb27b98.jpg')

  const [artistImage, trackImage, userImage] = [_artistImage, _trackImage, _userImage]
    .map((img, i) => roundedCanvas(img, i === 2 ? 5 : 15))

  const SIDE_IMAGE_SIZE = 218
  const USER_IMAGE_SIZE = 308

  const USER_Y = HEADER_HEIGHT + MARGIN
  const SIDE_IMAGE_Y = USER_Y + (USER_IMAGE_SIZE / 2) - (SIDE_IMAGE_SIZE / 2)

  ctx.globalAlpha = .5

  ctx.drawImage(artistImage, MARGIN, SIDE_IMAGE_Y, SIDE_IMAGE_SIZE, SIDE_IMAGE_SIZE)
  ctx.drawImage(trackImage, SIZE - MARGIN - SIDE_IMAGE_SIZE, SIDE_IMAGE_Y, SIDE_IMAGE_SIZE, SIDE_IMAGE_SIZE)

  ctx.globalAlpha = 1

  const SHADOW_SPREAD = 280
  const USER_IMAGE_SPREAD = USER_IMAGE_SIZE + (SHADOW_SPREAD * 2)
  ctx.shadowColor = '#000'
  ctx.shadowBlur = 100
  ctx.fillStyle = 'rgba(0, 0, 0, 0)'
  ctx.shadowOffsetX = 12
  ctx.fillRect((SIZE / 2) - (USER_IMAGE_SIZE / 2) - SHADOW_SPREAD, USER_Y - SHADOW_SPREAD, USER_IMAGE_SPREAD, USER_IMAGE_SPREAD)

  ctx.shadowOffsetX = -12
  ctx.fillRect((SIZE / 2) - (USER_IMAGE_SIZE / 2) - SHADOW_SPREAD, USER_Y - SHADOW_SPREAD, USER_IMAGE_SPREAD, USER_IMAGE_SPREAD)

  ctx.drawImage(userImage, (SIZE / 2) - (USER_IMAGE_SIZE / 2), USER_Y, USER_IMAGE_SIZE, USER_IMAGE_SIZE)

  ctx.shadowColor = 'none'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.fillStyle = '#000'
  ctx.textBaseline = 'middle'

  ctx.font = '900 45px Montserrat'
  ctx.lineWidth = 3
  ctx.strokeText('2020', MARGIN, HEADER_HEIGHT / 2 + 3)

  const HEADER_PADDING = 8
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(168, HEADER_PADDING)
  ctx.lineTo(168, HEADER_HEIGHT - HEADER_PADDING)
  ctx.stroke()

  ctx.font = '900 28px Montserrat'
  writeText(ctx, data.user.name, 480, 188, HEADER_HEIGHT / 2 + 3)

  ctx.font = '900 60px Montserrat'
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'
  ctx.fillStyle = THEME_COLOR

  const BOX_WIDTH = (SIZE - (MARGIN * 2)) / 2
  const BOX_HALF = BOX_WIDTH / 2

  writeText(ctx, data.stats.scrobbles.toLocaleString(), BOX_WIDTH, MARGIN + BOX_HALF, USER_Y + USER_IMAGE_SIZE + MARGIN)
  writeText(ctx, data.topTags[0].tag, BOX_WIDTH, SIZE - MARGIN - BOX_HALF, USER_Y + USER_IMAGE_SIZE + MARGIN)
  ctx.font = '500 28px Montserrat'
  ctx.fillStyle = 'white'

  const SUBTEXT_GAP = 60

  writeText(ctx, 'scrobbles', BOX_WIDTH, MARGIN + BOX_HALF, USER_Y + USER_IMAGE_SIZE + MARGIN + SUBTEXT_GAP)
  writeText(ctx, 'top tag', BOX_WIDTH, SIZE - MARGIN - BOX_HALF, USER_Y + USER_IMAGE_SIZE + MARGIN + SUBTEXT_GAP)

  ctx.font = '700 28px Montserrat'
  ctx.fillStyle = THEME_COLOR
  ctx.textAlign = 'start'

  const LIST_Y = USER_Y + USER_IMAGE_SIZE + (MARGIN * 2) + SUBTEXT_GAP + 28

  writeText(ctx, 'most listened artists', BOX_WIDTH - MARGIN, MARGIN, LIST_Y)
  writeText(ctx, 'most listened tracks', BOX_WIDTH - MARGIN, MARGIN + BOX_WIDTH, LIST_Y)

  ctx.font = '500 23px Montserrat'
  ctx.fillStyle = 'white'

  const BOX_MAX_WIDTH = BOX_WIDTH - (MARGIN / 2)
  const LIST_ITEM_Y = LIST_Y + 40
  const LIST_COUNT = 5
  const LIST_ITEM_HEIGHT = (SIZE - MARGIN - LIST_ITEM_Y + 14) / LIST_COUNT
  const items: string[][] = [data.topArtists.map(a => a.name), data.topTracks.map(t => t.name)]

  for (let i = 0; i < 2; i++) {
    const BOX_X = MARGIN + (BOX_WIDTH * i)
    const boxItems = items[i]

    for (let j = 0; j < LIST_COUNT; j++) {
      const item = boxItems[j]

      writeText(ctx, item, BOX_MAX_WIDTH, BOX_X, LIST_ITEM_Y + (LIST_ITEM_HEIGHT * j))
    }
  }

  return exportCanvasToBlob(canvas, compressed)
}