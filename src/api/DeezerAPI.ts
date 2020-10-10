import fetchJsonp from "fetch-jsonp"
import {AUTH_CALLBACK_URL, DEEZER_ID,} from "../Constants";

const API_URL = 'https://api.deezer.com/'

export default class DeezerAPI {
  token: string

  constructor(accessToken: string) {
    this.token = accessToken
  }

  async request(endpoint: string, params = {}): Promise<any> {
    const query = new URLSearchParams(params)
    query.append('output', 'jsonp')
    return fetchJsonp(API_URL + endpoint + '?' + query.toString()).then(r => r.json())
  }

  async getMe() {
    return this.request('user/me', {access_token: this.token})
  }

  async createPlaylist(title: string, description: string): Promise<{ id: string }> {
    return this.request('user/me/playlists', {
      request_method: 'POST',
      access_token: this.token,
      title,
      description
    })
  }

  async uploadPlaylistImage(playlist: string, image: Blob): Promise<any> {
    const {upload_token} = await this.request('infos')

    const form = new FormData()
    form.append('file', image, 'cover.jpg')

    const params = `access_token=${this.token}&upload_token=${upload_token}`

    return fetch(`https://upload.deezer.com/playlist/${playlist}?${params}`, {
      method: 'POST',
      body: form
    })
      .then(r => r.json())
  }

  async addTracksToPlaylist(playlist: string, tracks: string[]): Promise<any> {
    tracks = Array.from(new Set(tracks))
    return this.request(`playlist/${playlist}/tracks`, {
      request_method: 'POST',
      access_token: this.token,
      songs: tracks.join(',')
    })
  }

  static getAuthURL(): string {
    const params = new URLSearchParams({
      response_type: 'token',
      app_id: DEEZER_ID,
      perms: 'manage_library,basic_access',
      redirect_uri: AUTH_CALLBACK_URL + 'deezer',
    })
    return 'https://connect.deezer.com/oauth/auth.php?' + params.toString()
  }
}