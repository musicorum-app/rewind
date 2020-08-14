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
import {DEFAULT_AVATAR} from "./api/Constants";
import Typography from "@material-ui/core/Typography";
import moment from 'moment'
import LoadingStage from "./stages/loading";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import RewindStage from "./stages/rewind";

import sample from './api/sample.json'

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
  const styles = useStyles()
  const [formAnimation, setFormAnimation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState<number>(0)
  const [user, setUser] = useState('metye')
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [showStage0, setShowStage0] = useState(true)
  const [showStage1, setShowStage1] = useState(false)
  const [formTimeline, setFormTimeline] = useState<TimelineMax | null>(null)
  const [rewindStartTimeline, setStartTimeline] = useState<TimelineMax | null>(null)
  const [rewindData, setRewindData] = useState<RewindData | null>(null)
  const [showApp, setShowApp] = useState(true)

  const smallHeight = useMediaQuery('(max-height:700px)');
  const smallWidth = useMediaQuery('(max-width:580px)');
  const loadingRef = useRef(null)

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
      document.addEventListener("keypress", e => {
        if (e.ctrlKey && e.code === 'KeyM') {
          localStorage.setItem('cache', JSON.stringify(sample))
          document.location.reload()
        }
      });

    try {
      const data: {} = JSON.parse(localStorage.getItem('cache') as string)
      // @ts-ignore
      data.data.firstTrack.listenedAt = new Date(data.data.firstTrack.listenedAt)
      // @ts-ignore
      setRewindData(data.data)
      setUserData(null)
      setShowApp(false)
      setShowStage1(true)
    } catch (e) {
      doAnimation()
    }
  }, [])

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
      // @ts-ignore
      onComplete: () => loadingRef.current.load()
    })
    tl.play()

    setStage(1)
  }

  const startForm = () => {
    setFormAnimation(true)
    formTimeline?.play()
  }

  const fetchComplete = (data: RewindData) => {
    setShowStage1(true)
    setRewindData(data)
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

    <div style={{
      // opacity: 0,
    }} ref={rewindStageRef}>
      {
        showStage1 && rewindData ? <RewindStage data={rewindData}/> : null
      }
    </div>
    {
      showApp ? <div className={'App'}>
        <div style={{
          opacity: 0,
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
                maxWidth: smallHeight ? '80%' : '70%'
              }}
                   src={StartGraphic}
                   className={styles.startGraphic}
                   ref={mainImageRef}
              />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div ref={mainTextRef}>
                    <Box fontWeight={800} fontSize={smallWidth ? 23 : 30} mb={1} mt={5} mx={2}>
                      Let's rewind your <Box component="span" color="primary.main">2020</Box> on music
                    </Box>
                  </div>
                  <div ref={mainSubTextRef}>
                    <Box fontSize={smallWidth ? 15 : 20}>
                      from your last.fm profile
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
                    Start
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
                                Scrobbling since {moment(userData.registered["#text"] * 1000).format('MMMM Do YYYY')}
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
                                      Back
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
                                      Continue
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Grid>
                          </> : <>
                            <Typography variant="h6" color="error">
                              User not found
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
                                Back
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
                                    label="Last.fm username"
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
                              Start
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
  </div>
}

export default App;
