const API_URL = 'https://api.spotify.com/v1/'

export interface SpotifyUser {
  display_name: string,
  id: string,
  images: {
    url: string
  }[]
}

export interface PlaylistObject {
  external_urls: {
    spotify: string
  },
  id: string,
  name: string
}

export default class SpotifyAPI {
  token: string

  constructor(accessToken: string) {
    this.token = accessToken
  }

  async request(endpoint: string, options = {}, decodeJson = true): Promise<any> {
    const res = await fetch(API_URL + endpoint, {
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${this.token}`
      },
      ...options
    })
    return decodeJson ? res.json() : res
  }

  async getMe(): Promise<SpotifyUser> {
    return this.request('me')
  }

  async createPlaylist(id: string, name: string, description: string): Promise<PlaylistObject> {
    return this.request(`users/${id}/playlists`, {
      method: 'POST',
      body: JSON.stringify({
        name, description
      })
    })
  }

  async uploadPlaylistImage (id: string, image: string, mime: string): Promise<Response> {
    return this.request(`playlists/${id}/images`, {
      method: 'PUT',
      headers: {
        'content-type': mime,
        'authorization': `Bearer ${this.token}`
      },
      body: image
    }, false)
  }

  async addTracksToPlaylist(id: string, tracks: string[]): Promise<{ snapshot_id: string }> {
    return this.request(`playlists/${id}/tracks`, {
      method: 'POST',
      body: JSON.stringify({
        uris: tracks.map(t => `spotify:track:${t}`)
      })
    })
  }
}