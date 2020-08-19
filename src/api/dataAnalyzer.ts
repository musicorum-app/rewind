import {FormattedAlbum, FormattedArtist, FormattedTrack, Nullable, RewindData} from "./interfaces";

export function getMostListenedTrackFromArtist(artist: FormattedArtist, data: RewindData): FormattedTrack | undefined {
  return data.topTracks.find(t => t.artist === artist.name)
}

export function getMostListenedTrackFromAlbum(album: FormattedAlbum, data: RewindData): FormattedTrack | undefined {
  return data.topTracks.find(t => t.album === album.name)
}
