import React, {useEffect, useRef, useState} from 'react';
import {TweenMax, TimelineMax, Power3, Sine} from 'gsap'
import './App.css';
import Button from '@material-ui/core/Button/Button';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme, Grid, TextField, LinearProgress} from "@material-ui/core";
import StartGraphic from './assets/start.svg'
import Box from "@material-ui/core/Box";
import API from "./api";
import {RewindData, UserProfile} from "./api/interfaces";
import {DEFAULT_AVATAR, IS_PREVIEW} from "./Constants";
import Typography from "@material-ui/core/Typography";
import moment from 'moment'
import LoadingStage from "./stages/loading";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import RewindStage from "./stages/rewind";

import {hasOrientationSensor} from "./utils";
import OrientationSensorPrompt from "./components/OrientationSensorPrompt";
import OrientationSensorContext from './context/orientationSensor'
import {Trans, useTranslation} from "react-i18next";
import {ConfigIconButton} from "./components/SlideController";
import ConfigDialog from "./components/ConfigDialog";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Link from "@material-ui/core/Link";
import DialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles((theme: Theme) => createStyles({
  mainBtn: {
    borderRadius: 50,
    fontSize: '2rem',
    paddingLeft: 50,
    paddingRight: 50,
    color: '#000',
  },
  formBtn: {
    borderRadius: 50,
  },
  continueBtn: {
    borderRadius: 50,
    color: '#000'
  },
  startGraphic: {
    marginTop: 60
  },
  avatar: {
    width: 160,
    borderRadius: 160,
    border: `3px solid ${theme.palette.primary.main}`
  },
}))

function App() {
  const {t} = useTranslation()

  const styles = useStyles()
  const [, setFormAnimation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [, setStage] = useState<number>(0)
  const [user, setUser] = useState('')
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [showStage0, setShowStage0] = useState(true)
  const [showStage1, setShowStage1] = useState(false)
  const [formTimeline, setFormTimeline] = useState<TimelineMax | null>(null)
  const [rewindStartTimeline, setStartTimeline] = useState<TimelineMax | null>(null)
  const [rewindData, setRewindData] = useState<RewindData | null>(null)
  const [showApp, setShowApp] = useState(true)
  const [showGyroscopePrompt, setShowGyroscopePrompt] = useState(false)
  const [useSensor, setUseSensor] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showBeta, setShowBeta] = useState(IS_PREVIEW)

  const loadingRef = useRef(null)
  const smallHeight = useMediaQuery('(max-height:700px)');
  const smallWidth = useMediaQuery('(max-width:580px)');

  // Animation refs
  const mainImageRef = useRef(null)
  const mainTextRef = useRef(null)
  const mainSubTextRef = useRef(null)
  const mainButtonRef = useRef(null)
  const formRef = useRef(null)
  const userAccountRef = useRef(null)
  const loadingDivRef = useRef(null)
  const rewindStageRef = useRef(null)

  if (rewindStartTimeline) {
    rewindStartTimeline.play()
    setStartTimeline(null)
  }

  useEffect(() => {
    // doAnimation()
    //   document.addEventListener("keypress", e => {
    //     if (e.ctrlKey && e.code === 'KeyM') {
    //       localStorage.setItem('cache', JSON.stringify(sample))
    //       document.location.reload()
    //     }
    //   });

    // try {
    //   const data: any = JSON.parse(localStorage.getItem('cache') as string)
    //   if (data._v !== VERSION) {
    //     localStorage.removeItem('cache')
    //     throw new Error('Version mismatch')
    //   }
    //   // @ts-ignore
    //   data.data.firstTrack.listenedAt = new Date(data.data.firstTrack.listenedAt)
    //   // @ts-ignore
    //   setRewindData(data.data)
    //   setUserData(null)
    //   setShowApp(false)
    //   setShowStage1(true)
    //   document.documentElement.style.position = 'fixed'
    // } catch (e) {
    if (!IS_PREVIEW) doAnimation()
    // }
  }, [])

  const closeDialog = () => {
    setShowBeta(false)
    doAnimation()
  }

  const doAnimation = () => {
    TweenMax.fromTo([mainTextRef, mainSubTextRef, mainButtonRef].map(r => r.current), 2.8, {
      y: '50vh',
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      stagger: 0.25,
      ease: Power3.easeOut,
      delay: 0.3
    })
    TweenMax.fromTo(
      mainImageRef.current, 3, {
        y: -400,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        ease: Power3.easeOut,
        delay: 0.3
      }
    )

    const tl = new TimelineMax()
    tl.to(mainButtonRef.current, {
      x: '-180vw',
      ease: Sine.easeInOut,
      stagger: 0
    }, 0)
    tl.fromTo(formRef.current, {
      x: '180vw',
    }, {
      x: 0,
      ease: Sine.easeInOut,
      stagger: 0
    }, 0)
    tl.pause()
    setFormTimeline(tl)
  }

  const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser(event.target.value)
  }

  const handleStart = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const lastfmUser = await API.userGetInfo(user, true)
    setUserData(lastfmUser || {})
    setLoading(false)
  }

  const getAvatar = () => {
    if (userData?.image[2]['#text']) return userData?.image[2]['#text']
    return DEFAULT_AVATAR
  }

  const startLoad = () => {
    const tl = new TimelineMax()
    tl.to(userAccountRef.current, {
      opacity: 0,
      y: 50,
      onComplete: () => setShowStage0(false)
    })
    tl.fromTo(loadingDivRef.current, {
      opacity: 0,
      top: -50
    }, {
      opacity: 1,
      top: 0,
      onComplete: () => {
        // @ts-ignore
        loadingRef.current.load()
        document.documentElement.style.position = 'fixed'
      }
    })
    tl.play()

    setStage(1)
  }

  const startForm = () => {
    setFormAnimation(true)
    formTimeline?.play()
  }

  const fetchComplete = async (data: RewindData) => {
    const hasGyroscope = await hasOrientationSensor()
    setRewindData(data)
    if (hasGyroscope) {
      setShowApp(false)
      setShowGyroscopePrompt(true)
    } else {
      startRewind(data)
    }
  }

  const handleOrientationPrompt = (use: boolean) => {
    setUseSensor(use)
    if (rewindData) startRewind(rewindData)
    else alert('oops something really bad happened.')
  }

  const startRewind = (data: RewindData) => {
    setShowStage1(true)
    const tl = new TimelineMax({paused: true})
    tl.to(loadingDivRef.current, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => setUserData(null)
    })
    tl.fromTo(rewindStageRef.current, {
      opacity: 0,
    }, {
      opacity: 1,
      duration: 0.4,
      onComplete: () => setShowApp(false)
    })

    setStartTimeline(tl)
  }

  return <div>
    {
      showGyroscopePrompt ?
        <OrientationSensorPrompt onContinue={handleOrientationPrompt}/> : null
    }

    {
      !showStage1 && !showGyroscopePrompt
        ? <ConfigIconButton onClick={() => setDialogOpen(true)}/>
        : null
    }

    <div style={{
      // opacity: 0,
    }} ref={rewindStageRef}>
      {
        showStage1 && rewindData ?
          <OrientationSensorContext.Provider value={useSensor}>
            <RewindStage useSensor={useSensor} onSensorChange={use => setUseSensor(use)} data={rewindData}/>
          </OrientationSensorContext.Provider>
          : null
      }
    </div>
    {
      showApp ? <div className={'App'}>
        <div style={{
          // opacity: 0,
        }} ref={loadingDivRef}>
          {
            userData && !showStage0 ?
              <LoadingStage onComplete={fetchComplete} user={userData as UserProfile} ref={loadingRef}/> : null
          }
        </div>
        {
          showStage0 ? (
            <div ref={userAccountRef}>
              <img style={{
                maxWidth: smallHeight ? '40%' : '70%'
              }}
                   alt="Musicorum Rewind"
                   src={StartGraphic}
                   className={styles.startGraphic}
                   ref={mainImageRef}
              />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div ref={mainTextRef}>
                    <Box fontWeight={800} fontSize={smallWidth ? 23 : 30} mb={1} mt={5} mx={2}>
                      <Trans
                        i18nKey="main.splash.title"
                        components={[
                          <Box component="span" color="primary.main" key={0}/>
                        ]}
                      />
                    </Box>
                  </div>
                  <div ref={mainSubTextRef}>
                    <Box fontSize={smallWidth ? 15 : 20}>
                      {t('main.splash.subtitle')}
                    </Box>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    ref={mainButtonRef}
                    color="primary"
                    size="large"
                    variant="contained"
                    disableElevation
                    className={styles.mainBtn}
                    onClick={startForm}
                  >
                    {t('main.splash.button')}
                  </Button>
                  {
                    userData ? <Grid container justify="center" spacing={1}>
                        {
                          !!userData.name ? <>
                            <Grid item xs={12}>
                              <img className={styles.avatar} src={getAvatar()} alt="lastfm avatar"/>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography color="primary" variant="h3">
                                <Box fontWeight={800}>
                                  {userData.realname || userData.name}
                                </Box>
                              </Typography>
                              <Typography variant="h5">
                                <Box fontWeight={600} mt={1} mb={1}>
                                  @{userData.name}
                                </Box>
                              </Typography>
                              <Typography>
                                {t('main.user.scrobbling', {date: moment(userData.registered["#text"] * 1000).format('MMMM Do YYYY')})}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} xl={4}>
                              <Box marginX={1} mb={5}>
                                <Grid container justify="center" spacing={2}>
                                  <Grid item xs={12} sm={6}>
                                    <Button
                                      fullWidth
                                      color="primary"
                                      size="large"
                                      type="submit"
                                      variant="outlined"
                                      className={styles.formBtn}
                                      onClick={() => {
                                        setUserData(null)
                                        setLoading(false)
                                      }}
                                    >
                                      {t('main.user.back')}
                                    </Button>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Button
                                      fullWidth
                                      color="primary"
                                      size="large"
                                      type="submit"
                                      variant="contained"
                                      className={styles.continueBtn}
                                      onClick={startLoad}
                                    >
                                      {t('main.user.continue')}
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Grid>
                          </> : <>
                            <Typography variant="h6" color="error">
                              {t('main.user.notFound')}
                            </Typography>
                            <Grid item xs={12} sm={6}>
                              <Button
                                fullWidth
                                color="primary"
                                size="large"
                                type="submit"
                                variant="outlined"
                                className={styles.formBtn}
                                onClick={() => {
                                  setUserData(null)
                                  setLoading(false)
                                }}
                              >
                                {t('main.user.back')}
                              </Button>
                            </Grid>
                          </>
                        }
                      </Grid>
                      : <form ref={formRef} noValidate onSubmit={handleStart}>
                        <Grid container justify="center" spacing={1}>
                          <Grid item xs={12}>
                            <Grid justify="center" container>
                              <Grid item xs={12}>
                                <Grid container justify="center">
                                  <Grid item xs={12} sm={6} xl={4}>
                                    <Box mb={1} mt={1} style={{
                                      height: 10
                                    }}>
                                      {
                                        loading ?
                                          <LinearProgress/>
                                          : <></>
                                      }
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12} sm={6} xl={4}>
                                <Box paddingX={3} mb={2}>
                                  <TextField
                                    fullWidth
                                    label={t('main.user.input')}
                                    variant="outlined"
                                    onChange={handleUserChange}
                                    value={user}
                                  />
                                </Box>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={10} sm={4} xl={3}>
                            <Button
                              fullWidth
                              color="primary"
                              size="large"
                              type="submit"
                              variant="outlined"
                              className={styles.formBtn}
                            >
                              {t('main.user.button')}
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                  }
                </Grid>
              </Grid>
            </div>
          ) : <></>
        }
      </div> : null
    }

    <ConfigDialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      showGyro={false}
    />

    <Dialog
      open={showBeta}
      fullWidth
      maxWidth="sm"
      style={{
        minHeight: 300
      }}
      onClose={closeDialog}
    >
      <DialogTitle>Beta Testing</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Hi! Welcome to the Musicorum Rewind 2020 Beta testing! Please keep in mind that:
          <Typography>
            - Do not share the link nor the content from this website with other people.
          </Typography>
          <Typography>
            - The sharing images will have a preview watermark to prevent outside sharing.
          </Typography>
          <Typography>
            - The playlist saving for Spotify and Deezer and the Tweet button won't work because of the previous
            reasons.
          </Typography>
          <Typography>
            - Don't forget to give a feedback on the <Link
            href="https://forms.gle/nPqAzonPYHDhJcXU8"
            target="_blank"
            rel="nofollow"
          >beta testing feedback form</Link>. You can also access it at the end with the "Feedback" button!
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          color="primary"
          variant="contained"
          disableElevation

        >OK</Button>
      </DialogActions>
    </Dialog>

  </div>
}

export default App;
