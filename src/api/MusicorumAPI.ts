import {API_URL, RESOURCE_API_URL} from "../Constants";
import {Nullable, SpotifyArtistBase, TrackAnalysis} from "./interfaces";

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
  id: string,
  name: string,
  artist: string,
  album: string,
  cover?: string,
  preview?: string,
  analysis: TrackAnalysis
}

export default class API {
  static async fetchArtistsMetadata(artists: string[]): Promise<Nullable<SpotifyArtistBase>[]> {
    return fetch(API_URL + 'rewind/artists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({artists})
    }).then(r => r.json())
  }

  static async fetchAlbumsMetadata(albums: AlbumBase[]): Promise<AlbumResponse[]> {
    return fetch(RESOURCE_API_URL + 'fetch/albums', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({albums})
    }).then(r => r.json())
  }

  static async fetchTracksMetadata(tracks: TrackBase[]): Promise<TrackResponse[]> {
    const albumObj = (track: TrackBase) => track.album ? {
      album: encodeURIComponent(track.album)
    } : {}
    tracks = tracks.map(t => ({
      name: encodeURIComponent(t.name),
      artist: encodeURIComponent(t.artist),
      ...albumObj(t)
    }))
    return fetch(API_URL + 'rewind/tracks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({tracks})
    }).then(r => r.json())
  }
}
