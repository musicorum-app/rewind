import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {
  DialogData,
  Nullable,
  Playlists,
  RewindData,
  ServiceUserAccount,
  WindowType
} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import ParallaxWrapper from "../components/ParallaxWrapper";
import {Typography, useMediaQuery} from "@material-ui/core";
import {generatePlaylistCover} from "../image";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import BigColoredButton from "../components/BigColoredButton";
import {ReactComponent as SpotifyLogo} from '../assets/logos/spotify.svg'
import {ReactComponent as DeezerLogo} from '../assets/logos/deezer.svg'
import {ReactComponent as MusicorumLogo} from '../assets/logos/musicorum.svg'
import MusicorumAPI from "../api/MusicorumAPI";
import {AUTH_CALLBACK_URL, PLAYLIST_URL, SPOTIFY_ID} from "../Constants";
import {TransitionProps} from "@material-ui/core/transitions";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Link from "@material-ui/core/Link";
import SpotifyAPI from "../api/SpotifyAPI";
import PlaylistStrings from '../assets/playlist.json'
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import DeezerAPI from "../api/DeezerAPI";

gsap.registerPlugin(CustomEase)

const mediaQueryBreak = 900

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="down"/>;
}

const Content = styled.div`
  opacity: 0;
  height: 100%;
  top: 200vh;
  transform-style: preserve-3d;
  perspective: 1000px;
`

const Middle = styled.div`
  //position: absolute;
  //left: 50vw;
  //top: 50vh;
  //transform: translateX(-50%) translateY(-50%) translateZ(-100px);
  display: flex;
  align-items: center;
  justify-content: center;
  //width: 100vw;
  height: 100%;
`

const CoverImage = styled.img`
  border-radius: 4px;
  width: 400px;
  height: 400px;
  
  @media(max-width: ${mediaQueryBreak}px) {
    width: 270px;
    height: 270px;
  }
  
  @media(max-width: ${mediaQueryBreak}px) and (max-height: 680px) {
    width: 200px;
    height: 200px;
  }
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
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbar, setSnackbar] = useState<string>('')
  const small = useMediaQuery(`(max-width: ${mediaQueryBreak}px)`)

  useEffect(() => {
    const textEase = CustomEase.create("textEase", "M0,0,C0,0.658,0.084,0.792,0.15,0.846,0.226,0.908,0.272,0.976,1,1")

    if (show) {
      generateImage()
      animate()
    }
  }, [show])

  const animate = async () => {
    console.log('ANIMATING PLAYLIST SECTION')
    const tl = new TimelineMax()
      .to('#playlistSection', {
        // opacity: 1,
        // scale: 1,
        top: 0,
        duration: 0
      })
      .fromTo('#playlistSection', {
        opacity: 0,
        scale: 1.5
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
            setShow(false)
          }
        })

      console.log('ALbum meme section end')
    })
  }

  const generateImage = async () => {
    generatePlaylistCover(data.user)
      .then(blob => {
        setPlaylistCover(URL.createObjectURL(blob))
      })
  }

  const start = () => {
    console.log('Album meme section')
    setShow(true)
  }

// @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd,
    generateImage
  }))

  const saveMusicorumPlaylist = async () => {
    if (playlists.musicorum) {
      return setDialogData(playlists.musicorum)
    }
    setLoading(true)
    try {
      const playlist = await MusicorumAPI.savePlaylist(data.user, data.topTracks)
      if (!playlist.name) throw new Error(JSON.stringify(playlist))
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
    } catch (e) {
      console.error(e)
      setLoading(false)
      setSnackbar('Could not create a Musicorum playlist :/')
      setShowSnackbar(true)
    }
  }

  const handleSpotifyLogin = async () => {
    const params = new URLSearchParams({
      response_type: 'token',
      client_id: SPOTIFY_ID,
      scope: 'ugc-image-upload user-read-private playlist-modify-public',
      redirect_uri: AUTH_CALLBACK_URL + 'spotify',
      // show_dialog: 'true'
    })
    const url = 'https://accounts.spotify.com/authorize?' + params.toString()

    const win: WindowType = window as unknown as WindowType
    win.connect = (token, user) => {
      saveSpotifyPlaylist(token, user)
    }
    window.open(url, 'popup', 'width=500, height=800')
  }

  const saveSpotifyPlaylist = async (token: string, user: ServiceUserAccount) => {
    setLoading(true)
    try {
      const spotify = new SpotifyAPI(token)
      const playlistTitle = PlaylistStrings.name
      const playlistDescription = PlaylistStrings.description.replace('{{user}}', data.user.realname || data.user.name)
      const playlist = await spotify.createPlaylist(user.id, playlistTitle, playlistDescription)

      const playlistID = playlist.id


      const photo: Nullable<string> = await (new Promise(async resolve => {
        const blob = await generatePlaylistCover(data.user, true)
        const reader = new FileReader()

        if (!blob) resolve(null)
        reader.readAsDataURL(blob!)
        // @ts-ignore
        reader.onloadend = () => resolve(reader.result)
      }))

      if (photo) {
        const imageResponse = await spotify.uploadPlaylistImage(playlistID, photo
          .replace(/data:image\/(jpeg|png);base64,/g, ''), 'image/jpeg')

        if (imageResponse.status !== 202) console.error(imageResponse)
      }

      const tracks = data.topTracks
        .filter(t => !!t)
        .filter(t => !!t.spotify)
        .map(t => t.spotify)

      // @ts-ignore
      await spotify.addTracksToPlaylist(playlistID, tracks)

      console.log(playlist.external_urls.spotify)

      console.log(tracks.length)


      setLoading(false)
      const d = {
        type: 'SPOTIFY',
        data: playlistID,
        missing: 100 - tracks.length
      }
      setDialogData(d)
      setPlaylists({
        ...playlists,
        spotify: d
      })
    } catch (e) {
      console.error(e)
      setLoading(false)
      setSnackbar('Could not create a Spotify playlist :/')
      setShowSnackbar(true)
    }
  }

  const handleSpotifyPlaylist = async () => {
    if (playlists.spotify) {
      setDialogData(playlists.spotify)
    } else await handleSpotifyLogin()
  }


  const handleDeezerLogin = async () => {
    const win: WindowType = window as unknown as WindowType
    win.connect = (token, user) => {
      saveDeezerPlaylist(token, user)
    }
    window.open(DeezerAPI.getAuthURL(), 'popup', 'width=800, height=500')
  }

  const saveDeezerPlaylist = async (token: string, user: ServiceUserAccount) => {
    setLoading(true)
    try {
      console.log(token)
      const deezer = new DeezerAPI(token)
      const playlistTitle = PlaylistStrings.name
      const playlistDescription = PlaylistStrings.description.replace('{{user}}', data.user.realname || data.user.name)
      const {id} = await deezer.createPlaylist(playlistTitle, playlistDescription)

      const blob = await generatePlaylistCover(data.user, true)
      if (blob) {
        const upload = await deezer.uploadPlaylistImage(id, blob)
        console.log(upload)
      }

      const tracks = data.topTracks
        .filter(t => !!t)
        .filter(t => !!t.deezer)
        .map(t => t.deezer)

      // @ts-ignore
      const resp = await deezer.addTracksToPlaylist(id, tracks)

      if (!resp) throw new Error(resp)

      setLoading(false)
      const d = {
        type: 'DEEZER',
        data: id,
        missing: 100 - tracks.length
      }
      setDialogData(d)
      setPlaylists({
        ...playlists,
        deezer: d
      })
    } catch (e) {
      console.error(e)
      setLoading(false)
      setSnackbar('Could not create a Deezer playlist :/')
      setShowSnackbar(true)
    }
  }

  const handleDeezerPlaylist = () => {
    if (playlists.deezer) {
      setDialogData(playlists.deezer)
    } else handleDeezerLogin()
  }


  const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return
    setShowSnackbar(false)
  }

  return show ? <Section>
    <Content id="playlistSection">
      <ParallaxWrapper>
        <Middle>
          <Grid container justify="center" spacing={2} direction="column">
            <Grid item>
              <Box mb={small ? 1 : 6}>
                <Typography align="center" variant={small ? 'body1' : 'h3'}>
                  <b>Save your whole year in a single playlist!</b>
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Grid container justify="center" spacing={small ? 1 : 5}>
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
                        onClick={handleSpotifyPlaylist}
                        color="#1DB954"
                        disabled={loading}
                        fullWidth
                        style={small ? {
                          fontSize: 16
                        } : {}}
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
                        onClick={handleDeezerPlaylist}
                        color="#ffffff"
                        disabled={loading}
                        fullWidth
                        style={small ? {
                          fontSize: 16
                        } : {}}
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
                        style={small ? {
                          fontSize: 16
                        } : {}}
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

              {
                dialogData.type === 'SPOTIFY' && <Grid container justify="center">
                  <Grid item xs={12}>
                    <Link color="secondary"
                          target="_blank" rel="noreferrer nofollow"
                          href={`https://open.spotify.com/playlist/${dialogData.data}`}
                    >
                      <b>
                        https://open.spotify.com/playlist/{dialogData.data}
                      </b>
                    </Link>
                    <br/>
                    {
                      dialogData.missing && dialogData.missing > 0 ? <Typography color="textSecondary">
                        Note: {dialogData.missing} songs are missing.
                      </Typography> : ''
                    }
                    <br/>
                  </Grid>
                  <Grid item xs={12}>
                    <iframe src={`https://open.spotify.com/embed/playlist/${dialogData.data}`}
                            width="100%" height="400"
                            frameBorder="0"
                            allowTransparency={true}
                            allow="encrypted-media"/>
                  </Grid>
                </Grid>
              }


              {
                dialogData.type === 'DEEZER' && <Grid container justify="center">
                  <Grid item xs={12}>
                    <Link color="secondary"
                          target="_blank" rel="noreferrer nofollow"
                          href={`https://deezer.com/playlist/${dialogData.data}`}
                    >
                      <b>
                        https://deezer.com/playlist/{dialogData.data}
                      </b>
                    </Link>
                    <br/>
                    {
                      dialogData.missing && dialogData.missing > 0 ? <Typography color="textSecondary">
                        Note: {dialogData.missing} songs are missing.
                      </Typography> : ''
                    }
                    <br/>
                  </Grid>
                  <Grid item xs={12}>
                    <iframe
                      src={`https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=true&width=700&height=400&color=FD0F57&layout=dark&size=medium&type=playlist&id=${dialogData.data}`}
                      width="100%" height="400"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency={true}
                      allow="encrypted-media"/>
                  </Grid>
                </Grid>
              }
            </>
          }
        </DialogContentText>
      </DialogContent>
    </Dialog>


    <Snackbar
      TransitionComponent={SlideTransition}
      open={showSnackbar}
      autoHideDuration={10000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <Alert variant="filled" onClose={handleCloseSnackbar} severity="error">
        {
          snackbar
        }
      </Alert>
    </Snackbar>

  </Section> : null
})

export default PlaylistSection
