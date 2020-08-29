import {API_URL} from "../Constants";
import {Nullable, SpotifyArtistBase} from "./interfaces";

export default class API {
  static async fetchArtistsMetadata(artists: string[]): Promise<Nullable<SpotifyArtistBase>[]> {
    return fetch(API_URL + 'fetch/artists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ artists })
    }).then(r => r.json())
  }
}
