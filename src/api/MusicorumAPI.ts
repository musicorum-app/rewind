import {API_URL, RESOURCE_API_URL} from "../Constants";
import {FormattedTrack, Nullable, SpotifyArtistBase, TrackAnalysis, UserProfile} from "./interfaces";

const EXCLUDE_WORDS = ['instrumental', 'single', 'explicited', 'explicit', 'album']

interface AlbumBase {
  name: string,
  artist: string
}

interface AlbumResponse {
  name: string,
  artist: string,
  cover?: string
}

interface TrackBase {
  name: string,
  artist: string,
  album?: string
}

interface TrackResponse {
  hash: string,
  name: string,
  artist: string,
  album: string,
  cover: string,
  spotify: string,
  deezer: string,
  duration: number,
  preview?: string,
  analysis: TrackAnalysis
}

export interface PlaylistResponse {
  id: string,
  name: string,
  description: string,
  service_description: string,
  image: string,
  items: string[],
  created_at: string,
  type: "TOP_TRACKS",
  user: string
}

export default class API {
  static async fetchArtistsMetadata(artists: string[]): Promise<Nullable<SpotifyArtistBase>[]> {
    return fetch(RESOURCE_API_URL + 'find/artists?popularity=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({artists})
    }).then(r => r.json())
  }

  static async fetchAlbumsMetadata(albums: AlbumBase[]): Promise<AlbumResponse[]> {
    return fetch(RESOURCE_API_URL + 'find/albums', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({albums})
    }).then(r => r.json())
  }

  static async fetchTracksMetadata(tracks: TrackBase[]): Promise<TrackResponse[]> {
    const albumObj = (track: TrackBase) => track.album ? {
      album: this.cleanAlbum(track.album)
    } : {}
    tracks = tracks.map(t => ({
      name: t.name,
      artist: t.artist,
      ...albumObj(t)
    }))
    try {
      const res = await fetch(RESOURCE_API_URL + 'find/tracks?preview=true&analysis=true&deezer=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({tracks})
      }).then(r => r.json())
      if (Array.isArray(res)) return res
      else throw new Error('Response not an array:' + res)
    } catch (e) {
      console.error('Error while fetching tracks metadata', e)
      return []
    }
  }

  static async savePlaylist(user: UserProfile, tracks: FormattedTrack[]): Promise<PlaylistResponse> {
    return fetch(API_URL + 'playlists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'TOP_TRACKS',
        presentation: '2020_REWIND',
        user: user.name,
        user_image: user.image[3]["#text"] || 'https://lastfm.freetls.fastly.net/i/u/300x300/818148bf682d429dc215c1705eb27b98.jpg',
        items: tracks.slice(0, 100).map(t => ({
          name: t.name,
          artist: t.artist,
          url: t.url
        }))
      })
    }).then(r => r.json())
  }

  static cleanAlbum(album: string): string {
    let str = album.toLowerCase()
    for (let word of EXCLUDE_WORDS) {
      if (str.includes(word)) {
        str = str
          .replace(` - ${word}`, '')
          .replace(` [${word}]`, '')
          .replace(` (${word})`, '')
      }
    }
    return str
  }
}
