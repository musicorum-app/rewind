import {Nullable, UserProfile} from "../api/interfaces";
import {THEME_COLOR} from "../Constants";

export default function generatePlaylistCover(user: UserProfile, compressed = false): Promise<Nullable<Blob>> {
  return new Promise(resolve => {
    const SIZE = 400
    const canvas = document.createElement('canvas')
    canvas.width = SIZE
    canvas.height = SIZE
    const ctx: CanvasRenderingContext2D = (canvas.getContext('2d') as CanvasRenderingContext2D)

    const color = THEME_COLOR
    const img = new Image()
    img.src = user.image[3]["#text"] || 'https://lastfm.freetls.fastly.net/i/u/300x300/818148bf682d429dc215c1705eb27b98.jpg'
    img.setAttribute('crossorigin', 'anonymous')
    img.onload = () => {
      ctx.drawImage(img, 0, 0, SIZE, SIZE)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(0, 0, SIZE, SIZE)

      const BAR_HEIGHT = 40

      ctx.fillStyle = color
      ctx.fillRect(0, 0, SIZE, BAR_HEIGHT)

      ctx.font = 'italic 115px "Montserrat Black"'
      ctx.textAlign = 'center'
      ctx.fillText('2020', SIZE / 2, 340)

      ctx.fillStyle = 'white'
      ctx.font = 'italic 40px "Montserrat Black"'
      ctx.fillText('rewind', SIZE / 2, SIZE - 20)

      ctx.fillStyle = 'black'
      ctx.textAlign = 'start'
      ctx.font = '20px "Montserrat Black"'
      ctx.fillText(user.name, 12, (BAR_HEIGHT / 2) + 6, SIZE - 60)

      const logo = new Image()
      logo.src = 'https://cdn-2.musicorumapp.com/rewind/rewind_logo.svg'
      logo.setAttribute('crossorigin', 'anonymous')
      logo.onload = () => {
        ctx.drawImage(logo, 345, 10, 50, 19)

        canvas.toBlob(blob => {
          resolve(blob)
        }, 'image/' + (compressed ? 'jpeg' : 'png'), compressed ? .9 : 1)
      }
    }
  })
}