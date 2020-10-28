import {Nullable, UserProfile} from "../api/interfaces";
import {THEME_COLOR} from "../Constants";
import {TFunction} from "i18next";

export default function generatePlaylistCover(user: UserProfile, compressed = false): Promise<string> {
  return new Promise(resolve => {
    const SIZE = 400
    const canvas = document.createElement('canvas')
    canvas.width = SIZE
    canvas.height = SIZE
    const ctx: CanvasRenderingContext2D = (canvas.getContext('2d') as CanvasRenderingContext2D)

    const color = THEME_COLOR
    const img = new Image()
    img.setAttribute('crossorigin', 'anonymous')
    img.crossOrigin = 'anonymous'
    img.src = user.image[3]["#text"] || 'https://lastfm.freetls.fastly.net/i/u/300x300/818148bf682d429dc215c1705eb27b98.jpg'
    img.onload = async () => {
      ctx.drawImage(img, 0, 0, SIZE, SIZE)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(0, 0, SIZE, SIZE)

      const BAR_HEIGHT = 40

      ctx.fillStyle = color
      ctx.fillRect(0, 0, SIZE, BAR_HEIGHT)

      // @ts-ignore
      await document.fonts.load('900 italic 115px "Montserrat"')
      ctx.font = '900 italic 115px "Montserrat"'
      ctx.textAlign = 'center'
      ctx.fillText('2020', SIZE / 2, 340)

      ctx.fillStyle = 'white'
      ctx.font = '900 italic 40px "Montserrat"'
      ctx.fillText('rewind', SIZE / 2, SIZE - 20)

      ctx.fillStyle = 'black'
      ctx.textAlign = 'start'

      // @ts-ignore
      await document.fonts.load('900 20px "Montserrat"')
      ctx.font = '900 20px "Montserrat"'
      ctx.fillText(user.name, 12, (BAR_HEIGHT / 2) + 6, SIZE - 60)

      const logo = new Image()
      img.crossOrigin = 'anonymous'
      logo.setAttribute('crossorigin', 'anonymous')
      logo.src = '/assets/rewind_logo.svg'
      logo.onload = () => {
        ctx.drawImage(logo, 345, 10, 50, 19)

        resolve(canvas.toDataURL('image/jpeg', 0.98))
      }
    }
  })
}