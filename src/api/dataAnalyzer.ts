import {FormattedArtist, FormattedTrack, Nullable, RewindData} from "./interfaces";

export function getMostListenedTrackFromArtist(artist: FormattedArtist, data: RewindData): FormattedTrack | undefined {
  return data.topTracks.find(t => t.artist === artist.name)
}
