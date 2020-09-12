export type Nullable<T> = T | null

export interface LastfmDate {
  unixtime: string,
  '#text': number
}

export interface ImagesObject {
  [index: number]: {
    size: string,
    '#text'?: string
  }
}

export interface ArtistBase {
  name: string,
  playcount?: string | number,
  url: string,
}

export interface WeeklyArtist extends ArtistBase {
 playcount: string | number
}

export interface WeeklyArtistFormatted extends WeeklyArtist{
  spotify?: SpotifyArtistBase
}

export interface WeeklyArtistChart {
  '@attr': {
    from: string,
    to: string
  },
  artist: WeeklyArtist[]
}

export interface AlbumBase {
  name: string,
  playcount?: string | number,
  url: string
}

export interface WeeklyAlbum extends AlbumBase {
  playcount: string | number,
  artist: {
    '#text': string
  }
}

export interface WeeklyAlbumChart {
  '@attr': {
    from: string,
    to: string
  },
  album: WeeklyAlbum[]
}

export interface TrackBase {
  name: string,
  url: string,
}

export interface ListenedTrack extends TrackBase {
  artist: {
    '#text': string
  },
  album: {
    '#text': string
  },
  image: ImagesObject,
  date: {
    uts: string,
    '#text': string
  }
}

export interface LovedTrack {
  name: string,
  url: string,
  artist: {
    url: string,
    name: string
  },
  date: {
    uts: string,
    '#text': string
  }
}

export interface LovedTracksResponse {
  track: LovedTrack[],
  '@attr': {
    page: string,
    perPage: string,
    user: string,
    total: string,
    totalPages: string
  }
}

export interface WeeklyTrack extends TrackBase {
  playcount: string | number,
  mbid: string,
  album?: string,
  image: ImagesObject,
  artist: {
    '#text': string
  }
}

export interface TrackInfo {
  name: string,
  url: string,
  duration: string,
  listeners: string,
  playcount: string,
  artist: {
    name: string,
    url: string
  },
  album?: {
    artist: string,
    title: string,
    url: string,
    image: ImagesObject
  },
  toptags: {
    tag: {
      name: string,
      url: string
    }[]
  }
}

export interface UserBasedTrackInfo extends TrackInfo {
  userplaycount: string
}

export interface ExtendedTrackWithPlaytime {
  name: string,
  url: string,
  artist: string,
  playCount: number,
  playTime: string // seconds
}

export interface WeeklyTrackChart {
  '@attr': {
    from: string,
    to: string
  },
  track: WeeklyTrack[]
}

export interface RecentTracksResponse {
  track: ListenedTrack[],
  '@attr': {
    total: string
  }
}

export interface MonthData {
  artists: WeeklyArtistFormatted[],
  scrobbles: number
}

export interface MonthsData {
  actual: MonthData[],
  last: MonthData[]
}

export interface UserProfile {
  realname?: string,
  name: string,
  registered: LastfmDate,
  image: ImagesObject
}

export interface GeneralStats {
  scrobbles: number,
  playTime: number,
  albums: number,
  artists: number
}

export interface FormattedTrack {
  name: string,
  artist: string,
  album?: string,
  url: string,
  image?: string,
  preview?: string,
  spotify?: string,
  tags: string[]
}

export interface FormattedTrackWithListenTime extends FormattedTrack {
  listenedAt: Date
}

export interface FormattedArtist {
  name: string,
  playcount: number,
  url: string
  image?: string,
  spotify?: SpotifyArtistBase
}

export interface FormattedAlbum {
  name: string,
  artist: string,
  playCount: number,
  url: string
  image?: string
}

export interface FormattedLovedTrack extends FormattedTrack {
  lovedAt: Date
}

export interface SpotifyImage {
  height: number,
  width: number,
  url: string
}

export interface SpotifyArtist {
  name: string,
  id: string,
  uri: string,
  images: SpotifyImage[]
}

export interface TopTag {
  tag: string,
  count: number
}

export interface RewindData {
  user: UserProfile,
  stats: GeneralStats,
  firstTrack: FormattedTrackWithListenTime,
  topArtists: FormattedArtist[],
  topAlbums: FormattedAlbum[],
  topTracks: FormattedTrack[],
  lovedTracks: FormattedLovedTrack[],
  // months: MonthsData,
  spotifyData?: SpotifyArtistBase[],
  topTags: TopTag[]
}

export interface SpotifyArtistBase {
  name: string,
  hash: string,
  url: string,
  spotify: string
}
