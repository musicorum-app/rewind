import {
  ArtistBase,
  RewindData,
  UserProfile,
  WeeklyArtist,
  AlbumBase,
  WeeklyAlbum,
  MonthData,
  LovedTrack,
  WeeklyTrackChart,
  WeeklyTrack,
  TrackInfo,
  FormattedTrack,
  MonthsData,
  FormattedLovedTrack,
  ListenedTrack,
  SpotifyArtistBase,
  FormattedArtist,
  FormattedAlbum, TopTag
} from "./interfaces";
import API from "./index";
import {chunks as chunkArray} from '@reactgular/chunks'
import {addToMap, getShuffledArray} from "../utils";
import MusicorumAPI from "./MusicorumAPI";
import {generateAlbumMeme, generateNormalShare, generatePlaylistCover, generateStoriesShare} from "../image";
import {TFunction} from "i18next";

const year = 2020
const offset = 0
const startTime = (new Date(year, 0, 1, 0, 0).getTime() / 1000) + offset
const endTime = (new Date(year + 1, 0, 0, 0, 0).getTime() / 1000) + offset

const dataFetcher = async (
  t: TFunction,
  userData: UserProfile,
  onProgress: (pgr: number | null, txt: string) => void,
  showError: (msg: string) => void
): Promise<RewindData> => {
  return new Promise(async (resolve, reject) => {

    const maxTime = (new Date(year, 7, 0, 0, 0).getTime() / 1000) + offset

    if (parseInt(userData.registered.unixtime) > maxTime) {
      showError(t('errors.tooNew'))
      reject(t('errors.tooNew'))
    }

    const functions: [Function, string, number?][] = [
      [
        () =>
          API.userGetRecentTracks(userData.name, startTime, endTime, 1),
        t('loading.texts.0')
      ],
      [
        (r: any[]) =>
          API.userGetRecentTracks(userData.name, startTime, endTime, 1, r[0]['@attr']['totalPages']),
        t('loading.texts.1')
      ],
      [
        (r: any[], pgr: Function) => fetchArtists(userData.name, r, pgr),
        t('loading.texts.2')
      ],
      [
        (r: any[], pgr: Function) => fetchAlbums(userData.name, r, pgr),
        t('loading.texts.3')
      ],
      [
        () => console.log('DEPRECATED'),
        t('loading.texts.4')
      ],
      [
        () =>
          API.userGetArtistChart(userData.name, startTime, endTime, 100),
        t('loading.texts.5')
      ],
      [
        () =>
          API.userGetAlbumChart(userData.name, startTime, endTime, 50),
        t('loading.texts.6')
      ],
      [
        () =>
          API.userGetTrackChart(userData.name, startTime, endTime, 150),
        t('loading.texts.7')
      ],
      [
        () =>
          fetchFavorites(userData.name),
        t('loading.texts.8')
      ],
      [
        (r: any[], pgr: Function) =>
          fetchTrackInfos(userData.name, r, pgr),
        t('loading.texts.9'),
        101
      ]
    ]

    const result: any[] = []

    const MAX = functions.map(f => f[2] || 1).reduce((a, b) => a + b, 0)
    const normalise = (value: number) => value * 100 / MAX

    let fi = 0

    function progressStep(text: string) {
      fi++
      onProgress(normalise(fi), text)
    }

    for (let i = 0; i < functions.length; i++) {
      const f = functions[i]
      const nextStep = () => progressStep(f[1])
      nextStep()
      result.push(await f[0](result, nextStep))
    }

    onProgress(null, t('loading.texts.10'))

    const toFetch = new Map<string, SpotifyArtistBase>()

    addToMap(result[5].artist.slice(0, 100).map((a: ArtistBase) => a.name), toFetch)
    // addMonthsArtistsToMap(result[4], toFetch)
    await fetchArtistsFromAPI(toFetch)
    console.log(toFetch)

    const topArtists: FormattedArtist[] = result[5].artist.map((a: WeeklyArtist) => ({
      ...a,
      spotify: toFetch.get(a.name)
    }))

    const spotifyArtists: SpotifyArtistBase[] = []
    toFetch.forEach(a => spotifyArtists.push(a))

    const artists = groupArtists(result[2])
    const albums = groupAlbums(result[3])
    const firstTrack: ListenedTrack = result[1].track[1] || result[1].track[0]
    const topTracks = await formatTracks(result[9], result[7].track)
    console.log(firstTrack)
    const scrobbles = Number(result[0]['@attr']['total'])


    const tempData: RewindData = {
      user: userData,
      firstTrack: {
        name: firstTrack.name,
        url: firstTrack.url,
        artist: firstTrack.artist['#text'],
        album: firstTrack.album['#text'],
        image: firstTrack.image[3]['#text'],
        listenedAt: new Date(parseInt(firstTrack.date.uts) * 1000),
        tags: []
      },
      lovedTracks: result[8].map((t: LovedTrack) => formatLovedTrack(t)),
      stats: {
        scrobbles: scrobbles,
        playTime: 2,
        albums: albums.length,
        artists: artists.length
      },
      topAlbums: await formatAlbums(result[6].album),
      topArtists: topArtists,
      topTracks,
      // months: mergeSpotifyToMonths(result[4], toFetch),
      spotifyData: getShuffledArray(spotifyArtists)
        .filter(a => a),
      topTags: formatTags(topTracks)
        .sort((a, b) => b.count - a.count)
    }
    onProgress(null, t('loading.texts.11'))

    const [
      playlist,
      normalShare,
      storyShare,
      albumMeme
    ] = (await Promise.all([
      generatePlaylistCover(tempData.user),
      generateNormalShare(t, tempData, true),
      generateStoriesShare(t, tempData, true),
      generateAlbumMeme(t, tempData)
    ]))

    localStorage.setItem('image.playlist', playlist)
    localStorage.setItem('image.normalShare', normalShare)
    localStorage.setItem('image.storyShare', storyShare)
    localStorage.setItem('image.albumMeme', albumMeme)

    resolve(tempData)
  })
}

const calculatePlayTime = (trackChart: WeeklyTrackChart, tracks: TrackInfo[], total: number): number => {
  let result = 0
  let duration = 0
  let count = 0
  let last = 0
  const func = (x: number): number => 1 - Math.sqrt(1 - Math.pow(x, 2))
  // const func = (x: number): number => x * x * x * x * x
  // const func = (a: number, b: number, c: number, d: number) => c - ((d / (a - b)) * c)

  trackChart.track.forEach(track => {
    const info = tracks.find(t => t.url.toLowerCase() === track.url.toLowerCase()
      || (
        t.name.toLowerCase() === track.name.toLowerCase() && t.artist.name.toLowerCase() === track.artist["#text"].toLowerCase()
      ))
    if (!info) {
      console.error('This track couldn\'t match:')
      console.log(track, tracks)
      return
    }
    const currentDuration = Number(info.duration)
    const playcount = Number(track.playcount)
    result += playcount * currentDuration
    duration += currentDuration
    count += playcount
    last = playcount
  })
  const diff = (total - count)
  const durr = duration / trackChart.track.length * 0.6
  for (let i = 0; i < diff; i++) {
    // TODO: make this more precise
    result += ~~((~~(func(i / diff) * last) + 1) * durr)
    // result += ~~((last - (func(i / diff) * last)) * durr)
    // console.log(~~(last - (func(i / diff) * last)), ~~(result / 1000 / 60 / 60 / 24))
  }
  return result
}

const fetchArtists = async (user: string, result: any[], pgr: Function): Promise<ArtistBase[]> => {
  // const secondsInTwoWeeks = 14 * 24 * 60 * 60
  // const weeks = 13
  //
  // let artists = []
  // const resolve = (res: WeeklyArtistChart) => {
  //   pgr()
  //   return res.artist
  // }
  // let lastTimestamp = startTime - secondsInTwoWeeks
  // for (let i = 0; i < weeks; i++) {
  //   if (lastTimestamp + secondsInTwoWeeks > endTime || lastTimestamp + (secondsInTwoWeeks * 2) > endTime)
  //     break
  //   const from = lastTimestamp + secondsInTwoWeeks
  //   const to = from + secondsInTwoWeeks
  //   const res = await Promise.all([
  //     API.userGetArtistChart(user, from, to, 1000)
  //       .then(resolve),
  //     API.userGetArtistChart(user,
  //       // i === 12 ? from + secondsInTwoWeeks : from + secondsInTwoWeeks,
  //       // i === 12 ? from + secondsInTwoWeeks + 176400 : to + secondsInTwoWeeks,
  //       to,
  //       to + secondsInTwoWeeks,
  //       900)
  //       .then(resolve)
  //   ])
  //   lastTimestamp += secondsInTwoWeeks * 2
  //   artists.push(...res[0])
  //   artists.push(...res[1])
  // }

  const artists = await API.userGetArtistChart(user,
    startTime,
    endTime,
    300)

  return artists.artist.map((a: ArtistBase) => ({
    name: a.name,
    playcount: Number(a.playcount),
    url: a.url
  }))
}

const groupArtists = (artists: WeeklyArtist[]): WeeklyArtist[] => {
  const map: Map<string, WeeklyArtist> = new Map()
  const result: WeeklyArtist[] = []

  artists.forEach(artist => {
    if (map.has(artist.name)) {
      const foundItem = map.get(artist.name)
      // @ts-ignore
      map.set(artist.name, {
        ...foundItem,
        // @ts-ignore
        playcount: foundItem.playcount + artist.playcount
      })
    } else {
      map.set(artist.name, artist)
    }
  })

  map.forEach(v => {
    result.push(v)
  })
  return result
}

const fetchAlbums = async (user: string, result: any[], pgr: Function): Promise<AlbumBase[]> => {
  // const secondsInTwoWeeks = 14 * 24 * 60 * 60
  // const weeks = 14
  //
  // const albums = []
  // const debug = []
  // const resolve = (res: WeeklyAlbumChart) => {
  //   pgr()
  //   return res.album
  // }
  // let lastTimestamp = startTime - secondsInTwoWeeks
  // for (let i = 0; i < weeks; i++) {
  //   if (lastTimestamp + secondsInTwoWeeks > endTime || lastTimestamp + (secondsInTwoWeeks * 2) > endTime)
  //     break
  //   const from = lastTimestamp + secondsInTwoWeeks
  //   const to = from + secondsInTwoWeeks
  //   const res = await Promise.all([
  //     API.userGetAlbumChart(user, from, to, 1000)
  //       .then(resolve),
  //     API.userGetAlbumChart(user,
  //       // i === 12 ? from + secondsInTwoWeeks : from + secondsInTwoWeeks,
  //       // i === 12 ? from + secondsInTwoWeeks + 176400 : to + secondsInTwoWeeks,
  //       to,
  //       to + secondsInTwoWeeks,
  //       900)
  //       .then(resolve)
  //   ])
  //   lastTimestamp += secondsInTwoWeeks * 2
  //   debug.push(res)
  //   albums.push(...res[0])
  //   albums.push(...res[1])
  // }
  //
  // console.log(debug);
  //
  // albums.push(...await API.userGetAlbumChart(user,
  //   lastTimestamp + secondsInTwoWeeks,
  //   endTime,
  //   300)
  //   .then(resolve))

  const albums = await API.userGetAlbumChart(user,
    startTime,
    endTime,
    300)

  return albums.album.map((a: WeeklyAlbum) => ({
    name: a.name,
    playcount: Number(a.playcount),
    url: a.url,
    artist: {
      '#text': a.artist["#text"]
    }
  }))
}

const groupAlbums = (albums: WeeklyAlbum[]): WeeklyAlbum[] => {
  const map: Map<string, WeeklyAlbum> = new Map()
  const result: WeeklyAlbum[] = []

  albums.forEach(album => {
    const key = `${album.name}/${album.artist["#text"]}`
    if (map.has(key)) {
      const foundItem = map.get(key)
      if (!foundItem) throw new Error('Something weird happened')
      map.set(key, {
        ...foundItem,
        playcount: Number(foundItem.playcount) + Number(album.playcount)
      })
    } else {
      map.set(key, album)
    }
  })

  map.forEach(v => {
    result.push(v)
  })
  return result
}

const fetchMonths = async (user: UserProfile, result: any[], pgr: Function):
  Promise<MonthsData> => {
  const actual: MonthData[] = []
  const last: MonthData[] = []
  const lastYearStart = new Date(year - 1, 0, 0).getTime() / 1000
  const thisYearInSecs = startTime - lastYearStart

  const register = user.registered["#text"]

  const fetchData = async (from: number, to: number) => Promise.all([
    API.userGetArtistChart(user.name, from, to, 10)
      .then(r => {
        pgr()
        return r.artist
      }),
    API.userGetRecentTracks(user.name, from, to, 10)
      .then(r => {
        pgr()
        return Number(r["@attr"].total)
      })
  ])
  for (let i = 0; i < 12; i++) {
    const from = i === 0 ? startTime : new Date(year, i, 0, 0, 0).getTime() / 1000
    const to = i === 12 ? endTime : new Date(year, i + 1, 0, 0, 0).getTime() / 1000
    const fromLast = i === 0 ? lastYearStart : new Date(year - 1, i, 0, 0, 0).getTime() / 1000
    const toLast = i === 12 ? startTime : new Date(year - 1, i + 1, 0, 0, 0).getTime() / 1000
    // if (from - thisYearInSecs > register) {
    //   pgr()
    //   pgr()
    //   continue
    // }
    const res = await Promise.all([
      fetchData(from, to),
      fetchData(fromLast, toLast)
    ])
    actual.push({
      artists: res[0][0],
      scrobbles: res[0][1]
    })
    last.push({
      artists: res[1][0],
      scrobbles: res[1][1]
    })
  }

  return {
    actual,
    last
  }
}

const fetchFavorites = async (user: string): Promise<LovedTrack[]> => {
  const loved: LovedTrack[] = []
  const initial = await API.userGetLovedTracks(user, 50)
  for (let i = 0; i < Number(initial["@attr"].totalPages); i++) {
    const res = await API.userGetLovedTracks(user, 50, i + 1)
    let lastDate = 100
    for (const track of res.track) {
      const date = Number(track.date.uts)
      if (date > startTime && date < endTime) {
        loved.push(track)
      }
      lastDate = date
    }
    if (lastDate < startTime || lastDate > endTime)
      break
  }
  return loved
}

const fetchTrackInfos = async (user: string, r: any[], pgr: Function): Promise<TrackInfo[]> => {
  const tracks: WeeklyTrack[] = r[7].track
  const trackInfos: TrackInfo[] = []

  const chunks = chunkArray(tracks.slice(0, 100), 4)

  for (const chunk of chunks) {
    const res = await Promise.all(chunk.map(async t =>
      API.trackGetInfo(t.name, t.artist["#text"], user)
        .then(r => {
          pgr()
          return r
        })
    ))
    trackInfos.push(...res)
  }

  return trackInfos
}

const formatLovedTrack = (track: LovedTrack): FormattedLovedTrack => {
  return {
    name: track.name,
    artist: track.artist.name,
    url: track.url,
    lovedAt: new Date(parseInt(track.date.uts) * 1000),
    tags: []
  }
}

const addMonthsArtistsToMap = (months: MonthsData, map: Map<string, SpotifyArtistBase>) => {
  let artists: string[] = []
  const task = (d: MonthData[]) => {
    for (let i of d) if (i.artists.length > 0) artists.push(i.artists[0].name)
  }
  task(months.actual)
  task(months.last)
  addToMap(artists, map)
}

const fetchArtistsFromAPI = async (artists: Map<string, SpotifyArtistBase>) => {
  const values: string[] = []
  artists.forEach((_, k) => values.push(k))
  try {
    const res = await MusicorumAPI.fetchArtistsMetadata(values.slice(0, 100))
    for (let i = 0; i < res.length; i++) {
      const item = res[i]
      if (item) {
        artists.set(values[i], item)
      } else {
        console.error('Not found: ' + values[i], item)
      }
    }
  } catch (e) {
    console.error(e)
  }
}

const formatAlbums = async (albums: WeeklyAlbum[]): Promise<FormattedAlbum[]> => {
  const formatted: FormattedAlbum[] = albums.map(album => ({
    name: album.name,
    url: album.url,
    artist: album.artist["#text"],
    playCount: Number(album.playcount)
  }))

  const toFetch = formatted.slice(0, 9)
  const result = await MusicorumAPI.fetchAlbumsMetadata(toFetch)

  return formatted.map((album, i) => {
    if (i > 9) return album
    if (result[i] && result[i].cover) album.image = result[i].cover
    return album
  })
}

const formatTracks = async (tracks: TrackInfo[], otherTracks: WeeklyTrack[]): Promise<FormattedTrack[]> => {
  console.log(tracks)
  const formatted: FormattedTrack[] = tracks.map((track, i) => {
    if (track && track.name) {
      return {
        name: track.name,
        album: track.album?.title,
        artist: track.artist.name,
        image: track.album?.image[3]?.["#text"],
        url: track.url,
        tags: track.toptags.tag.map(t => t.name),
        playCount: parseInt(track.userplaycount || '0')
      }
    } else {
      const ot = otherTracks[i]
      return {
        name: ot.name,
        album: ot.album || '',
        artist: ot.artist['#text'],
        image: ot.image[3]?.["#text"],
        url: ot.url,
        tags: [],
        playCount: parseInt(ot.playcount + '' || '0')
      }
    }
  })


  const result = await MusicorumAPI.fetchTracksMetadata(formatted.slice(0, 150))

  return formatted.map((track, i) => {
    if (result[i]) {
      if (result[i].cover) track.image = track.image || result[i].cover
      if (result[i].preview) track.preview = result[i].preview
      track.spotify = result[i].spotify
      track.deezer = result[i].deezer
      track.analysis = result[i].analysis
      // track.name = result[i].name
    }
    return track
  })
}

const formatTags = (tracks: FormattedTrack[]): TopTag[] => {
  const tags = new Map<string, number>()

  for (let track of tracks) {
    for (let tag of track.tags) {
      tags.set(tag, (tags.get(tag) || 0) + 1)
    }
  }

  console.log(tags)

  const finalTags: TopTag[] = []

  tags.forEach((value, key) => finalTags.push({
    tag: key,
    count: value
  }))

  return finalTags
}

export default dataFetcher
