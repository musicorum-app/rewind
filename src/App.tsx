import React, {useRef, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button/Button';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme, Grid, TextField, LinearProgress} from "@material-ui/core";
import StartGraphic from './assets/start.svg'
import Box from "@material-ui/core/Box";
import TweenOne from 'rc-tween-one'
import API from "./api";
import {UserProfile} from "./api/interfaces";
import {DEFAULT_AVATAR} from "./api/Constants";
import Typography from "@material-ui/core/Typography";
import moment from 'moment'
import LoadingStage from "./stages/loading";
import Slide from "@material-ui/core/Slide";
import useMediaQuery from "@material-ui/core/useMediaQuery";

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
  const smallHeight = useMediaQuery('(max-height:700px)');
  const loadingRef = useRef()

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
    setStage(1)
    // @ts-ignore
    loadingRef.current.load()
    setTimeout(() => {
      setShowStage0(false)
    }, 900)
  }

  const ease = 'easeOutQuart'
  return (
    <div className={!formAnimation ? 'App' : 'no-limit-scroll App'}>
      <TweenOne
        animation={{
          right: '0vw',
          duration: 900,
          ease
        }}
        style={{
          position: 'relative',
          right: '-200vw',
          height: '100vh'
        }}
        componentProps={{
          show: stage === 1
        }}
        paused={stage !== 1}
      >
        {
          // @ts-ignore
          userData ? <LoadingStage user={userData} ref={loadingRef}/> : null
        }
      </TweenOne>
      <TweenOne
        animation={{
          right: '200vw',
          duration: 900,
          ease: 'easeInOutQuint',
        }}
        style={{
          position: 'relative',
          right: '0vw',
          top: '-100vh'
        }}
        componentProps={{
          show: stage === 0
        }}
        paused={stage === 0}
      >
        {
          showStage0 ? (
            <div>
              <TweenOne
                animation={{
                  y: 300,
                  opacity: 1,
                  duration: 2000,
                  ease,
                }}
                style={{
                  position: 'relative',
                  top: -300,
                  opacity: 0
                }}
              >
                <img style={{
                  maxWidth: smallHeight ? '80%' : '50%'
                }} src={StartGraphic} className={styles.startGraphic}/>
              </TweenOne>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TweenOne
                    animation={{
                      top: 0,
                      ease,
                      delay: 0,
                      opacity: 1,
                      duration: 2000
                    }}
                    style={{
                      position: 'relative',
                      top: '100vw',
                      opacity: 0
                    }}
                  >
                    <Box fontWeight={800} fontSize={30} mb={1}>
                      Let's rewind your <Box component="span" color="primary.main">2020</Box> on music
                    </Box>
                  </TweenOne>
                  <TweenOne
                    animation={{
                      top: 0,
                      ease,
                      delay: 300,
                      opacity: 1,
                      duration: 1700
                    }}
                    style={{
                      position: 'relative',
                      top: '100vw',
                      opacity: 0
                    }}
                  >
                    <Box fontSize={20}>
                      from your last.fm profile
                    </Box>
                  </TweenOne>
                </Grid>

                <Grid item xs={12}>
                  <TweenOne
                    animation={{
                      top: 0,
                      ease,
                      delay: 600,
                      opacity: 1,
                      duration: 1400
                    }}
                    style={{
                      position: 'relative',
                      top: '120vw',
                      opacity: 0
                    }}
                  >
                    <TweenOne
                      animation={{
                        right: '100vw',
                        ease: 'easeOutQuad',
                        duration: 600
                      }}
                      style={{
                        position: 'relative',
                        right: 0
                      }}
                      paused={!formAnimation}
                    >
                      <Button
                        color="primary"
                        size="large"
                        variant="contained"
                        disableElevation
                        className={styles.mainBtn}
                        onClick={() => {
                          setFormAnimation(true)
                        }}
                      >
                        Start
                      </Button>
                    </TweenOne>
                    <TweenOne
                      animation={{
                        right: 0,
                        ease: 'easeOutQuad',
                        duration: 600,
                      }}
                      style={{
                        position: 'relative',
                        right: '-100vw',
                        top: -53
                      }}
                      paused={!formAnimation}
                    >
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
                                  <Box marginX={1}>
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
                          : <form noValidate onSubmit={handleStart}>
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
                    </TweenOne>
                  </TweenOne>
                </Grid>
              </Grid>
            </div>
          ) : <></>
        }
      </TweenOne>

    </div>
  );
}

export default App;
