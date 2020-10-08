import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {FormattedTrack, Nullable, RewindData, SpotifyArtistBase} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import ParallaxWrapper from "../components/ParallaxWrapper";
import {Typography} from "@material-ui/core";
import generatePlaylistCover from "../image";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import BigColoredButton from "../components/BigColoredButton";
import {ReactComponent as SpotifyLogo} from '../assets/logos/spotify.svg'
import {ReactComponent as DeezerLogo} from '../assets/logos/deezer.svg'
import {ReactComponent as MusicorumLogo} from '../assets/logos/musicorum.svg'
import MusicorumAPI, {PlaylistResponse} from "../api/MusicorumAPI";
import {API_URL, AUTH_CALLBACK_URL, PLAYLIST_URL, SPOTIFY_ID} from "../Constants";
import {Simulate} from "react-dom/test-utils";
import {TransitionProps} from "@material-ui/core/transitions";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Link from "@material-ui/core/Link";

gsap.registerPlugin(CustomEase)

interface DialogData {
  type: string,
  data: string,
  musicorumPlaylist?: PlaylistResponse
}

interface Playlists {
  musicorum?: DialogData,
  spotify?: DialogData,
  deezer?: DialogData
}

interface ServiceUserAccount {
  id: string,
  username: string,
  name: string,
  image: string
}

interface ServiceAccount {
  user: ServiceUserAccount,
  token: string
}

interface ServicesAuth {
  spotify?: ServiceAccount,
  deezer?: ServiceAccount
}

interface WindowType extends Window {
  connect: (token: string, user: ServiceUserAccount) => void
}


const Content = styled.div`
  opacity: 0;
  height: 100%;
  top: 200vh;
  transform-style: preserve-3d;
  perspective: 1000px;
`

const Middle = styled.div`
  position: absolute;
  left: 50vw;
  top: 50vh;
  transform: translateX(-50%) translateY(-50%) translateZ(-100px);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
`

const CoverImage = styled.img`
  border-radius: 4px;
  width: 400px;
`

const ButtonSide = styled.div`
  margin-left: 32px;
`

const Transition = React.forwardRef((
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
  ) => <Slide direction="up" ref={ref} {...props} />
)


const PlaylistSection: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({data, onEnd}, ref) => {

  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [playlistCover, setPlaylistCover] = useState(data.user.image[3]['#text'])
  const [dialogData, setDialogData] = useState<Nullable<DialogData>>(null)
  const [playlists, setPlaylists] = useState<Playlists>({})
  const [servicesAuth, setServicesAuth] = useState<ServicesAuth>({})

  useEffect(() => {
    const textEase = CustomEase.create("textEase", "M0,0,C0,0.658,0.084,0.792,0.15,0.846,0.226,0.908,0.272,0.976,1,1")

    if (show) {
      generateImage()
      const tl = new TimelineMax()
        .to('#playlistSection', {
          // opacity: 1,
          // scale: 1,
          top: 0,
          duration: 0
        })
        .fromTo('#playlistSection', {
          opacity: 0,
          scale: .7
        }, {
          scale: 1,
          opacity: 1,
          duration: 2,
          ease: 'expo.out'
        })
        .from('.playlistSection', {
          opacity: 0
        })


      tl.to({}, {
        duration: .5,
        onComplete: () => {
          if (onEnd) onEnd()
        }
      })
    }
  }, [show])

  const generateImage = async () => {
    const url = await generatePlaylistCover(data.user)
    setPlaylistCover(url)
  }

  const animateEnd = () => {
    return new Promise(resolve => {
      const tl = new TimelineMax()
      tl.to('#playlistSection', {
        opacity: 0,
        y: 80
      })
        .to('#playlistSection', {
          top: '100vh',
          duration: 0,
          onComplete: () => {
            resolve()
          }
        })

      console.log('ALbum meme section end')
    })
  }

  const start = () => {
    console.log('Album meme section')
    setShow(true)
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd
  }))

  const saveMusicorumPlaylist = async () => {
    if (playlists.musicorum) {
      return setDialogData(playlists.musicorum)
    }
    setLoading(true)
    const playlist = await MusicorumAPI.savePlaylist(data.user, data.topTracks)
    console.log(playlist)
    setLoading(false)
    const d = {
      type: 'MUSICORUM',
      data: PLAYLIST_URL + playlist.id,
      musicorumPlaylist: playlist
    }
    setDialogData(d)
    setPlaylists({
      ...playlists,
      musicorum: d
    })
  }

  const handleSpotifyLogin = async () => {
    const params = new URLSearchParams({
      response_type: 'token',
      client_id: SPOTIFY_ID,
      scope: 'ugc-image-upload user-read-private playlist-modify-public',
      redirect_uri: AUTH_CALLBACK_URL + 'spotify'
    })
    const url = 'https://accounts.spotify.com/authorize?' + params.toString()

    const win: WindowType = window as unknown as WindowType
    win.connect = (token, user) => {
      setServicesAuth({
        ...servicesAuth,
        spotify: {
          token,
          user: user
        }
      })
    }
    window.open(url, 'popup', 'width=400, height=600')
  }

  const saveSpotifyPlaylist = async () => {
    handleSpotifyLogin()
  }

  return show ? <Section>
    <Content id="playlistSection">
      <ParallaxWrapper>
        <Middle>
          <Grid container justify="center" spacing={2} direction="column">
            <Grid item>
              <Box mb={6}>
                <Typography align="center" variant="h3">
                  <b>Save your whole year in a single playlist!</b>
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Grid container justify="center" spacing={5}>
                <Grid item>
                  <CoverImage
                    id="playlistCoverImage"
                    src={playlistCover}/>
                </Grid>
                <Grid item>
                  <Grid container direction="column" justify="center" style={{
                    height: '100%'
                  }}>
                    <Box my={1}>
                      <BigColoredButton
                        onClick={saveSpotifyPlaylist}
                        color="#1DB954"
                        disabled={loading}
                        fullWidth
                        textColor="white"
                        icon={<SpotifyLogo fill="white" style={{
                          marginRight: 10
                        }}/>}
                      >
                        Save on Spotify
                      </BigColoredButton>
                    </Box>

                    <Box my={1}>
                      <BigColoredButton
                        color="#ffffff"
                        disabled={loading}
                        fullWidth
                        textColor="black"
                        icon={<DeezerLogo fill="white" style={{
                          marginRight: 10
                        }}/>}
                      >
                        Save on Deezer
                      </BigColoredButton>
                    </Box>

                    <Box my={1}>
                      <BigColoredButton
                        onClick={saveMusicorumPlaylist}
                        color="#B71C1C"
                        disabled={loading}
                        fullWidth
                        icon={<MusicorumLogo fill="white" style={{
                          marginRight: 10
                        }}/>}
                      >
                        Save on Musicorum
                      </BigColoredButton>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Middle>
      </ParallaxWrapper>
    </Content>

    <Dialog
      open={!!dialogData}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="md"
      style={{
        minHeight: 300
      }}
      onClose={() => setDialogData(null)}
    >
      <DialogTitle>Your playlist is ready!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {
            dialogData && <>
              {
                dialogData.type === 'MUSICORUM' && <>
                  <Grid container>
                    <Grid item xs={4}>
                      <img src={dialogData.musicorumPlaylist?.image} alt="Playlist image" style={{
                        width: '100%',
                        borderRadius: 4
                      }}/>
                    </Grid>
                    <Grid item xs={8}>
                      <Box ml={4} style={{height: '100%'}}>
                        <Grid container direction="column" justify="space-between" style={{height: '100%'}}>
                          <Grid item>
                            <Typography variant="h5" component="p" color="textPrimary">
                              {dialogData.musicorumPlaylist?.name}
                            </Typography>
                            <Typography color="textSecondary">
                              {dialogData.musicorumPlaylist?.description}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Link href={dialogData.data} target="_blank" rel="noreferrer nofollow">
                              <Box fontSize={26} fontWeight={700}>
                                Open in a new tab
                              </Box>
                            </Link>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              }
            </>
          }
        </DialogContentText>
      </DialogContent>
    </Dialog>

  </Section> : null
})

export default PlaylistSection
