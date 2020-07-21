import {
  LovedTracksResponse,
  RecentTracksResponse, TrackInfo, UserBasedTrackInfo,
  UserProfile,
  WeeklyAlbumChart,
  WeeklyArtistChart,
  WeeklyTrackChart
} from "./interfaces";
import {MAX_TRIES} from "./Constants";

const LATFM_API = 'https://ws.audioscrobbler.com/2.0/'
const LASTFM_KEY = '0ae2a02cb6ec0686e560b365074020b3'

export default class API {
  static async _request(method: string, params: Record<string, any>): Promise<Record<string, any>> {
    params.api_key = LASTFM_KEY
    params.format = 'json'
    params.method = method
    const queryParams = new URLSearchParams(params)
    return fetch(`${LATFM_API}?${queryParams}`).then(r => r.json())
  }

  static async request(method: string, params: Record<string, any>): Promise<Record<string, any>> {
    let result = {}
    for (let i = 0; i < MAX_TRIES; i++) {
      try {
        const res = await API._request(method, params)
        if (res && !res.error) {
          result = res
          break
        } else {
          throw new Error(res?.error)
        }
      } catch (e) {
        console.error("Request went wrong.", i === MAX_TRIES ? 'No more tries allowed.' : 'Trying again...')
      }
    }
    return result
  }

  static async userGetInfo(user: string, oneTry: boolean = false): Promise<UserProfile> {
    if (oneTry) {
      return API._request('user.getInfo', {
        user
      }).then(r => r.user)
    } else {
      return API.request('user.getInfo', {
        user
      }).then(r => r.user)
    }
  }

  static async userGetRecentTracks(user: string, from: number, to: number, limit?: number, page?: number): Promise<RecentTracksResponse> {
    return API.request('user.getRecentTracks', {
      user,
      from,
      to,
      limit: limit || 50,
      page: page || 1
    }).then(r => r.recenttracks)
  }

  static async userGetArtistChart(user: string, from: number, to: number, limit?: number): Promise<WeeklyArtistChart> {
    return API.request('user.getWeeklyArtistChart', {
      user,
      from,
      to,
      limit: limit || 10
    }).then(r => r.weeklyartistchart)
  }

  static async userGetAlbumChart(user: string, from: number, to: number, limit?: number): Promise<WeeklyAlbumChart> {
    return API.request('user.getWeeklyAlbumChart', {
      user,
      from,
      to,
      limit: limit || 10
    }).then(r => r.weeklyalbumchart)
  }

  static async userGetTrackChart(user: string, from: number, to: number, limit?: number): Promise<WeeklyTrackChart> {
    return API.request('user.getWeeklyTrackChart', {
      user,
      from,
      to,
      limit: limit || 10
    }).then(r => r.weeklytrackchart)
  }

  static async userGetLovedTracks(user: string, limit?: number, page?: number): Promise<LovedTracksResponse> {
    return API.request('user.getLovedTracks', {
      user,
      page: page || 1,
      limit: limit || 10
    }).then(r => r.lovedtracks)
  }

  static async trackGetInfoFromMBID(mbid: string): Promise<TrackInfo> {
    return API.request('track.getInfo', {
      mbid
    }).then(r => r.track)
  }

  static async trackGetInfo(track: string, artist: string, user: string): Promise<UserBasedTrackInfo> {
    return API.request('track.getInfo', {
      track,
      artist,
      user
    }).then(r => r.track)
  }
}
