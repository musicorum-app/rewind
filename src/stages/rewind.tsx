import React, {forwardRef, MouseEventHandler, useEffect, useRef, Ref, useState} from "react";
import {FormattedAlbum, FormattedArtist, MonthData, RewindData, SpotifyArtistBase} from "../api/interfaces";
import Grid from "@material-ui/core/Grid/Grid";
import Box from "@material-ui/core/Box/Box";
import Container from "@material-ui/core/Container/Container";
import Typography from "@material-ui/core/Typography/Typography";
import Link from "@material-ui/core/Link/Link";
import {gsap, TimelineMax} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {convertRange, getShuffledArray, handleArtistImage} from "../utils";
// @ts-ignore
import Odometer from 'odometer';
import SplittedWordText from "../SplittedWordText";
import {getMostListenedTrackFromArtist} from "../api/dataAnalyzer";
import {SHOW_PEDRO_PRINT} from "../api/Constants";
import RoundedButton from "../RoundedButton";
import {Collapse} from "@material-ui/core";

interface MonthState {
  actual: MonthData,
  last: MonthData,
  index: number
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const RewindStage: React.FC<{
  data: RewindData,
}> = forwardRef(({data}) => {
  const [firstTrackTimeline, setFirstTrackTimeline] = useState<TimelineMax | null>(null)
  const [firstTrackAnimated, setFirstTrackAnimated] = useState(true)
  const [scrobbleCount, setScrobbleCount] = useState(0)
  const [refresh, setRefresh] = useState(1)
  const [showArtistListExpand, setShowArtistListExpand] = useState(false)
  const [graphAnimationsLoaded, setGraphAnimationsLoaded] = useState(false)
  const [selectedMonth, _setSelectedMonth] = useState<MonthState | null>(null)
  const selectedMonthRef = useRef(selectedMonth)
  const setSelectedMonth = (m: MonthState | null) => {
    selectedMonthRef.current = m
    _setSelectedMonth(m)
  }

  // Animation refs
  const disclaimerRef = useRef(null)
  const firstTrackRef = useRef(null)
  const dateRef = useRef(null)
  const firstTrackSecondTextRef = useRef(null)
  const firstTrackImageRef = useRef(null)
  const firstTrackImageSectionRef = useRef(null)
  const firstTrackInfo = useRef(null)

  const scrobbleSectionRef = useRef(null)

  const graphItWasLikeThatRef = useRef(null)

  const graphSectionRef = useRef(null)
  const graphWelcomeTextRef = useRef(null)
  const graphYear0Ref = useRef(null)
  const graphYear1Ref = useRef(null)

  const artistScrobblesNode = useRef(null)

  const getResponsiveness = () => {
    const height = window.innerHeight
    const width = window.innerWidth
    const mobile = height > width
    const imgMargin = mobile ? 30 : 70
    const maxBarHeight = height * 0.4
    return {height, width, mobile, imgMargin, maxBarHeight}
  }

  const getFirstTrackImagePosition = () => {
    if (!firstTrackImageRef.current || !firstTrackImageRef.current) return [0, 0, 0, 0]
    const {height, width, mobile, imgMargin} = getResponsiveness()
    const sizeInverted = mobile ? height : width
    // @ts-ignore
    const imgSize = firstTrackImageRef.current.clientHeight
    // @ts-ignore
    const textHeight = () => firstTrackInfo.current.clientHeight
    // @ts-ignore
    const imgY = (height / 2) - ((imgSize + (imgMargin * 2)) / 2)
    const imgX = (width / 2) - ((imgSize + (imgMargin * 2)) / 2)
    const left = mobile ? imgX : 0
    const top = mobile ? 0 : imgY

    const textLeft = mobile ? imgMargin : imgSize + (imgMargin * 2)
    const textTop = mobile ? (imgSize + imgMargin * 2) : (height / 2) - (textHeight() / 2)
    return [left, top, textLeft, textTop]
  }

  useEffect(() => {
    if (firstTrackAnimated) return
    gsap.timeline({
      scrollTrigger: {
        trigger: '#presentation',
        endTrigger: '#presentationEnd',
        start: 'top 0%',
        end: 'bottom 100%',
        scrub: .3,
        // markers: true,
      }
    })
      .fromTo('.progressBar', {
        height: 0
      }, {
        height: '100vh',
        ease: "linear"
      })

    setFirstTrackAnimated(true)
  }, [firstTrackAnimated, firstTrackTimeline])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (disclaimerRef && disclaimerRef.current) {
      window.addEventListener('mousemove', ev => handleMouseMove(ev))
      window.addEventListener('resize', () => setRefresh(Math.random()))


      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: disclaimerRef.current!,
          start: "top 20%",
          end: "bottom 20%",
          scrub: 1,
          onRefresh: self => console.log(self)
        },
      })
      tl.to(disclaimerRef.current, {
        opacity: 0,
      })
      const firstTrackTL = gsap.timeline({
        scrollTrigger: {
          trigger: firstTrackRef.current!,
          markers: false,
          start: "top 0%",
          end: "bottom -160%",
          scrub: .4,
          pin: true,
        },
      })
        .fromTo(dateRef.current, {
          scale: 60,
          ease: 'power4'
        }, {
          duration: 8,
          scale: 1,
        })
        .fromTo(firstTrackSecondTextRef.current, {
          opacity: 0,
        }, {
          duration: 3,
          opacity: 1,
        })

      const imgTl = gsap.timeline({
        scrollTrigger: {
          trigger: firstTrackImageSectionRef.current!,
          // markers: true,
          scrub: 0.2,
          start: 'top 50%',
          end: 'bottom 0%'
        }
      })
        .fromTo(firstTrackImageRef.current, {
          y: window.innerHeight / 1.6
        }, {
          y: -(window.innerHeight / 1.6)
        })
      // .to(dateRef.current, {
      //   x: '150vw',
      //   duration: 9,
      //   opacity: 0.7
      // })
      // .to(firstTrackSecondTextRef.current, {
      //   x: '-150vw',
      //   duration: 9,
      //   // scrub: 2,
      //   opacity: 0.7
      // }, "-=9")
      setFirstTrackTimeline(firstTrackTL)

      animateScrobbleCount()
      animateItWasLikeThat()
      animateGraphs()

      animateArtists()
      animateAlbums()
    }
  }, [disclaimerRef, graphYear1Ref, artistScrobblesNode])

  const animateScrobbleCount = () => {
    const scrobbles = data.stats.scrobbles - 1
    // let counter = {
    //   scrobbles: 0
    // }
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrobbleSectionRef.current!,
        start: 'top 20%',
        end: 'top 20%',
        // markers: true,
        // pin: true,
        // scrub: .2
      }
    })
      .to({}, {
        onStart: () => {
          const od = new Odometer({
            el: document.getElementById('scrobbleCount'),
            value: 0,
            duration: 80000
          })
          console.log(od)
          od.render()
          od.update(scrobbles)
        },
        // onUpdate: () => {
        //   document.getElementById('scrobbleCount').innerHTML = counter.scrobbles
        //   // setScrobbleCount(counter.scrobbles)
        // }
      })
    // .to({}, {
    //   duration: 1
    // })
  }

  const animateItWasLikeThat = () => {
    const markers = false
    gsap.timeline({
      scrollTrigger: {
        trigger: '#itWasLikeThatSection',
        markers,
        start: 'top 60%',
        end: 'top 40%',
        scrub: .5
      }
    })
      .from('#graphItWasLikeThat', {
        y: 90,
        opacity: 0,
        scale: .9
      })

    gsap.timeline({
      scrollTrigger: {
        trigger: '#itWasLikeThatSection',
        markers,
        start: 'bottom 55%',
        end: 'bottom 35%',
        scrub: .5
      }
    })
      .to('#graphItWasLikeThat', {
        y: -90,
        opacity: 0,
        scale: .9
      })

  }

  const animateFirstTrackImage = () => {
    setFirstTrackAnimated(false)
  }

  const animateGraphs = () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: graphSectionRef.current!,
        start: "top 0%",
        // markers: true,
        end: "bottom 80%",
        pin: true,
        // scrub: .7,

      }
    })
      .fromTo('.graphSectionWelcomeText', {
        opacity: 0,
        y: -30,
      }, {
        opacity: 1,
        y: 0,
        stagger: .23,
        duration: .3
      })
      .fromTo([graphYear0Ref.current, graphYear1Ref.current], {
        width: 0,
      }, {
        width: 75,
        duration: .7,
        stagger: .2
      }, "0.4")
      .from('.monthBar', {
        height: 0,
        stagger: .05,
        duration: .2,
        onComplete: () => setGraphAnimationsLoaded(true)
      })
      .from('.monthName', {
        opacity: 0,
        y: 17,
        duration: .2,
        stagger: 0.03 * 2
      }, `-=${.1 * 12}`)
  }

  const animateArtists = () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: '#artistsTitleSection',
        // markers: true,
        start: 'top 40%',
        end: 'bottom 50%',
        scrub: .5
      }
    })
      .fromTo('#artistsTitle', {
        scale: .9,
      }, {
        scale: 1,
        duration: 1
      })
      .fromTo('#artistsTitle', {
        opacity: 0
      }, {
        opacity: 1,
        duration: 1
      }, 0)
      .to('#artistsTitle', {
        opacity: 0,
        scale: 1.2,
        duration: 1,
        ease: 'Power4.easeIn'
      }, 2)

    const el = document.getElementById('artistsImageArray')
    if (el) {
      gsap.timeline({
        scrollTrigger: {
          trigger: '#artistsArray',
          start: 'center 100%',
          end: 'center 0%',
          // markers: true,
          scrub: .4
        }
      })
        .fromTo('#artistsImageArray', {
          x: 0
        }, {
          x: '-100%',
          ease: 'linear'
        })
    }

    new TimelineMax({
      scrollTrigger: {
        trigger: '#artistsSection',
        // markers: true,
        start: 'top 10%',
        // scrub: .5,
      },
    })
      .fromTo('.artistsCountNumber', {
        top: 18,
        opacity: 0,
      }, {
        top: 0,
        opacity: 1,
        stagger: .09
      })
      .fromTo('.mostListenedArtistNameNodes', {
        top: 18,
        opacity: 0,
      }, {
        top: 0,
        opacity: 1,
        stagger: .05
      }, 0.2)
      .from('.mostListenedArtistSubText', {
        y: 18,
        opacity: 0,
        stagger: .3
      }, 0.3)
      .from('#mostListenedArtistImage', {
        x: -38,
        opacity: 0
      }, 0.4)

    gsap.timeline({
      scrollTrigger: {
        trigger: '#artistBoxes',
        // markers: true,
        start: 'top 55%'
      }
    })
      .fromTo('.artistBoxesAnimation', {
        opacity: 0,
      }, {
        opacity: 1,
        stagger: .15
      })

  }

  const animateAlbums = () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: '#albumsTitleSection',
        // markers: true,
        start: 'top 40%',
        end: 'bottom 50%',
        scrub: .5
      }
    })
      .fromTo('#albumsTitle', {
        scale: .9,
      }, {
        scale: 1,
        duration: 1
      })
      .fromTo('#albumsTitle', {
        opacity: 0
      }, {
        opacity: 1,
        duration: 1
      }, 0)
      .to('#albumsTitle', {
        opacity: 0,
        scale: 1.2,
        duration: 1,
        ease: 'Power4.easeIn'
      }, 2)
  }

  const getFormatted = () => {
    return data.firstTrack.listenedAt.toLocaleDateString("en-US", {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  let {maxBarHeight, width, mobile, imgMargin} = getResponsiveness()

  const calculateBarHeight = (scrobbles: number) => {
    // console.log(maxBarHeight)
    const lastScrobbles = data.months.last.map(m => m.scrobbles)
    const totalScrobbles = [...lastScrobbles, ...data.months.actual.map(m => m.scrobbles)]
    const maxScrobble = Math.max.apply(Math, totalScrobbles)
    // return convertRange(scrobbles, [0, maxScrobble], [0, maxBarHeight])
    return ((100 * scrobbles) / maxScrobble) + '%';
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (selectedMonthRef.current) {
      const x = event.clientX.toString()
      const y = event.clientY.toString()
      const el = document.getElementById('tooltipGraph')
      if (el) {
        gsap.set(el, {
          css: {
            top: y,
            left: x,
            position: 'fixed',
          }
        })
      }
    }
  }

  const handleMouseExit = (event: React.MouseEvent<HTMLElement>) => {
    setSelectedMonth(null)
    gsap.to('.selectedMonth', {
      y: 5,
      opacity: 0,
      duration: .2
    })
  }

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>, month: MonthData, i: number) => {
    if (!graphAnimationsLoaded) return
    setSelectedMonth({
      actual: month,
      index: i,
      last: data.months.last[i]
    })
    gsap.fromTo('#tooltipGraph', {
      opacity: 0,
      // y: -9
    }, {
      opacity: 1,
      // y: 0,
      duration: .2
    })
  }

  const getArtistBoxes = (): FormattedArtist[] => data.topArtists.slice(1, 5)

  const getShowMoreArtists = (): FormattedArtist[] => data.topArtists.slice(5, 15)

  const switchShowMoreArtists = () => {
    const newState = !showArtistListExpand
    setShowArtistListExpand(newState)
  }

  return <div style={{
    height: '100%',
    width: '100%'
  }}
              id="presentation"
  >
    <Box mx={1}>
      {
        refresh ? ' ' : ''
      }
      <Container maxWidth="md">
        <section
          style={{
            height: '100vh',
          }}
        >
          <Grid container justify='center' alignItems='center' style={{
            height: '100%'
          }}>
            <Grid item>
              <div
                style={{
                  backgroundColor: 'rgb(253, 15, 87, 16%)',
                  borderRadius: 15,
                  textAlign: 'center',
                  padding: '1px 12px 12px 12px',
                }}
                ref={disclaimerRef}>
                <Box fontSize={28} my={3} color="primary.main" fontWeight={600}>
                  Disclaimer
                </Box>
                <Typography>
                  This is a third party app. We are not a partner nor related in a way with Last.fm. All the data
                  presented here
                  were obtained from the <Link href="https://www.last.fm/api/" target="_blank" rel="noreferrer">Last.fm
                  public api</Link>. Some
                  information <strong>will</strong> be different from the one seen on your Last.year since we need to
                  grab from scratch
                  and
                  it may not be accurate.
                </Typography>
                <Typography>
                  TODO
                </Typography>
              </div>
            </Grid>
          </Grid>
        </section>
      </Container>
    </Box>
    <section
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}
      ref={firstTrackRef}
    >
      <Grid container justify='center' alignItems="center" style={{
        height: '100%'
      }}>

        <Grid item>
          <Typography ref={firstTrackSecondTextRef}>
            <Box textAlign="center" mb={2}>
              Your journey started on
            </Box>
          </Typography>
          <Typography ref={dateRef}>
            <Box fontWeight={600} fontSize={mobile ? 17 : 23} component="span">
              <span>
              {getFormatted()}
              </span>
            </Box>
          </Typography>
        </Grid>
      </Grid>

    </section>
    <section
      style={{
        height: '70vh',
        width: '100%',
        // overflowX: 'hidden',
      }}
      ref={firstTrackImageSectionRef}
    >
      <Grid container justify='space-between' alignItems="center" style={{
        height: '100%'
      }}>
        <Grid item xs={12} md={6}>
          <img
            style={{
              // margin: imgMargin,
              marginLeft: 20,
              borderRadius: 4,

              width: '80%'
              // position: 'absolute',
              // left: ftLeft,
              // top: 0
              // top: ftTop
            }}
            ref={firstTrackImageRef}
            src={data.firstTrack.image}
            alt="first track"
            onLoad={animateFirstTrackImage}
          />
        </Grid>


        <Grid item xs={12} md={6}>
          <div ref={firstTrackInfo}>
            <Typography component="h4" variant="h1" style={{
              // maxWidth: mobile ? width - (imgMargin * 2) : width - 300 - (imgMargin * 2)
            }}>
              <Box className="textCenter" color="primary.main" fontWeight={900}>
                {data.firstTrack.name}
              </Box>
            </Typography>
            <Typography>
              <Box className="textCenter" my={2} fontSize={24}>
                {data.firstTrack.artist}
              </Box>
            </Typography>
            <Typography>
              <Box className="textCenter" mt={3} fontWeight={700} fontSize={13}>
                This was the first song you listened this year
              </Box>
            </Typography>
            {
              data.user.name === 'pedrofracassi' && SHOW_PEDRO_PRINT ?
                <img src={`https://i.imgur.com/${SHOW_PEDRO_PRINT}.png`}/>
                : null
            }
          </div>
        </Grid>
        <Grid item></Grid>
      </Grid>
    </section>

    <section
      style={{
        height: '95vh',
        width: '100%',
        overflow: 'hidden',
      }}
      ref={scrobbleSectionRef}
    >
      <Grid container justify='center' alignItems="center" style={{height: '100%'}}>
        <Grid item>
          <Typography style={{}}>
            <Box my={4} textAlign="center" fontSize={mobile ? 28 : 40}>
              And then you scrobbled
              <Box component="p" fontWeight={900} id="scrobbleCount" className="odometer" color="primary.main"
                   fontSize={mobile ? 90 : 170}>
                {/*{parseInt(scrobbleCount.toFixed()).toLocaleString()}*/}
                0
                {/*<Odometer value={scrobbleCount.toFixed()} animation={graphAnimationsLoaded} />*/}
              </Box>
              more times this year
            </Box>
          </Typography>
        </Grid>
      </Grid>

    </section>

    <section
      style={{
        height: '45vh',
        width: '100%',
        overflow: 'hidden',
      }}
      id="itWasLikeThatSection"
    >
      <Grid container justify='center' alignItems="center" style={{height: '100%'}}>
        <Grid item>
          <Typography align="center" variant="h3" id="graphItWasLikeThat">
            <Box fontWeight={700} fontSize={mobile ? 30 : 50}>And it was like that...</Box>
          </Typography>
        </Grid>
      </Grid>
    </section>

    <section
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
      ref={graphSectionRef}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h4" className="graphSectionWelcomeText">
                <Box ml={3} mb={1} mt={3} fontWeight={700} fontSize={mobile ? 30 : 46}>
                  This was your whole year on music
                </Box>
              </Typography>
              <Typography className="graphSectionWelcomeText">
                <Box ml={3}>
                  You can hover or touch on any month to see more details
                </Box>
              </Typography>
            </Grid>
            <Grid item>

            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            spacing={3}
            alignItems="flex-end"
            className="graphs"
            // onMouseMove={handleMouseMove}
          >

            {
              data.months.actual.map((m, i) => <Grid
                item
                className={(graphAnimationsLoaded ? 'monthSection ' : ' ')}
                xs={1}
                onMouseEnter={event => handleMouseEnter(event, m, i)}
                // onMouseMove={event => handleMouseMove(event)}
                onMouseOut={event => handleMouseExit(event)}
              >
                <div
                  className="monthItem"
                  style={{
                    height: maxBarHeight
                  }}

                >
                  <div className="monthBar last" style={{
                    height: calculateBarHeight(data.months.last[i].scrobbles)
                  }}>

                  </div>
                  <div className="monthBar actual" style={{
                    height: calculateBarHeight(m.scrobbles)
                  }}>

                  </div>
                </div>
                <p className="monthName">{months[i]}</p>
              </Grid>)
            }
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div className="yearBoxes">
            <div className="outBox" ref={graphYear0Ref}>
              <Box className="yearBox" fontWeight={800} bgcolor="white" color="black" mb={2}>
                2019
              </Box>
            </div>
            <div className="outBox" ref={graphYear1Ref}>
              <Box className="yearBox" fontWeight={800} bgcolor="primary.main" color="black">
                2020
              </Box>
            </div>
          </div>
        </Grid>

      </Grid>
    </section>

    <section
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'hidden'
      }}
      id="artistsTitleSection"
    >
      <Grid container justify='center' alignItems="center" style={{height: '100%'}}>
        <Grid item id="artistsTitle">
          <Typography align="center" variant="h3" color="primary">
            <Box fontWeight={900} fontSize={mobile ? 60 : 140} mb={3}>ARTISTS</Box>
          </Typography>
          <Box textAlign="center" fontSize={30}>Here are some of the people and bands that helped you this year</Box>
        </Grid>
      </Grid>
    </section>

    {
      data.spotifyData ? <section
          style={{
            width: '100%',
            overflowX: 'hidden',
          }}
          id="artistsArray"
        >
          <Grid container spacing={2} className="imageArray" id="artistsImageArray" wrap="nowrap">
            {
              data.spotifyData.filter((a: SpotifyArtistBase) => a && a.url).map((artist: SpotifyArtistBase) =>
                <Grid item>
                  <div className="artistArrayImage" style={{
                    backgroundImage: `url(${artist.url})`
                  }}/>
                  <div className="artistArrayImageGlow" style={{
                    backgroundImage: `url(${artist.url})`
                  }}/>
                </Grid>
              )
            }
          </Grid>
        </section>
        : null
    }

    <section
      style={{
        height: '130%',
        width: '100%',
        overflowX: 'hidden',
      }}
      id="artistsSection"
    >
      <Grid container justify='center' style={{height: '100%', marginBottom: '12em'}}>
        <Grid item>
          <Typography align="center" variant="h3" id="aa" color="primary">
            <Box fontWeight={800} fontSize={mobile ? 30 : 80}>{
              data.stats.artists > 400 ? 'You like to vary' : 'You prefer the same'
            }</Box>
          </Typography>
          <Typography align="center">
            <Box fontSize={20}>
              {data.stats.artists > 400 ? 'This year you switched and listened to a lot of different artists'
                : 'This year you haven\'t listened to a lot of artists, and preferred to stay on your favorites'}
            </Box>
          </Typography>
        </Grid>
      </Grid>
      <Grid style={{
        // minHeight: '100vh'
      }}>
        <Grid container justify="space-between" style={{width: '100%'}}>
          {/*<Grid item>*/}
          {/*  */}
          {/*</Grid>*/}
          <Grid item xs={12}>
            <Box ml={3} id="topArtistImage">
              <div style={{
                backgroundImage: `url(${handleArtistImage(data.topArtists[0])})`
              }} id="mostListenedArtistImage"/>
              <Box ml={2} className="artistsSpaceBetween">
                <div>
                  <Typography align="right" id="aab" color="primary">
                    <Box fontWeight={900} fontSize={mobile ? 30 : 60} mr={5} style={{marginBottom: mobile ? -40 : -45}}>
                      <SplittedWordText text={data.stats.artists.toLocaleString()} nodesClass="artistsCountNumber"/>
                    </Box>
                    <Box fontWeight={400} fontSize={25} color="white" className="artistsCountNumber" mr={5}>
                      artists listened
                    </Box>
                  </Typography>
                </div>
                <div>
                  <Box fontSize={50} fontWeight={900} my={0.5} color="primary.main">
                    <SplittedWordText text={data.topArtists[0].name} nodesClass="mostListenedArtistNameNodes"/>
                  </Box>
                  <Box fontSize={20} className="mostListenedArtistSubText">
                    Is your most listened artist
                    with <Box color="primary.main" fontWeight="800"
                              component="span">{data.topArtists[0].playcount.toLocaleString()}</Box> scrobbles
                  </Box>
                  <Box fontSize={18} mt={1}>
                    {
                      getMostListenedTrackFromArtist(data.topArtists[0], data) ?
                        <Box className="mostListenedArtistSubText">
                          You really
                          liked <Box color="primary.main" fontWeight="800"
                                     component="span">{getMostListenedTrackFromArtist(data.topArtists[0], data)?.name}
                        </Box>, being the most listened track from this artist
                        </Box> : null
                    }
                  </Box>
                </div>
                {/*<div>*/}
                {/*  {*/}
                {/*    getMostListenedTrackFromArtist(data.topArtists[0], data) ?*/}
                {/*      <Box className="mostListenedArtistSubText">*/}
                {/*        You really liked <strong>{getMostListenedTrackFromArtist(data.topArtists[0], data)?.name}</strong>, being*/}
                {/*        your most listened track from this artist*/}
                {/*      </Box> : null*/}
                {/*  }*/}
                {/*</div>*/}
              </Box>
            </Box>
          </Grid>

        </Grid>
      </Grid>
      <div style={{
        height: 30
      }}>
        {" "}
      </div>
    </section>


    <section
      id="artistBoxes"
    >
      <Grid container justify="space-evenly" spacing={2}>
        {
          getArtistBoxes().map((artist: FormattedArtist, i: number) => <Grid item xs={6} md={3}>
            <div className="itemBox artistBoxesAnimation">
              <span className="boxNumber">#{i + 2}</span>
              <img src={handleArtistImage(artist)} className="boxImage"/>
              <Grid container direction="column" justify="space-between" className="scrobblesSection">
                <Grid item>
                  <Box className="artistName" fontWeight={700} color="primary.main">{artist.name}</Box>
                </Grid>
                <Grid item>
                  <Box className="artistScrobbles" fontWeight={900} color="primary.main">{artist.playcount}</Box>
                  <Box className="artistScrobblesText" fontWeight={400}>scrobbles</Box>
                </Grid>
              </Grid>
            </div>
          </Grid>)
        }
      </Grid>

      <Box mt={4} style={{width: '100%'}} className="artistBoxesAnimation">
        <Grid container justify="center">
          <Box mx={4} id="artistListExpandable">
            <Collapse in={showArtistListExpand}>
              <Grid container justify="space-between" spacing={4}>
                {
                  getShowMoreArtists().map((a, i) => <Grid item xs={12} md={6} className="artistListItem">
                    <Grid container justify="space-between" spacing={2}>
                      <Grid item>
                        <Box><span className="artistListNumber">{5 + i}.</span> {a.name}</Box>
                      </Grid>
                      <Grid item>
                        <Box fontWeight={800} color="primary.main">{a.playcount}</Box>
                      </Grid>
                    </Grid>
                  </Grid>)
                }
              </Grid>
            </Collapse>
          </Box>
          <RoundedButton onClick={switchShowMoreArtists} color="primary" outlined>
            Show {showArtistListExpand ? 'less' : 'more'}
          </RoundedButton>
        </Grid>
      </Box>
    </section>

    <section
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'hidden'
      }}
      id="albumsTitleSection"
    >
      <Grid container justify='center' alignItems="center" style={{height: '100%'}}>
        <Grid item id="albumsTitle">
          <Typography align="center" variant="h3" color="primary">
            <Box fontWeight={900} fontSize={mobile ? 60 : 140} mb={3}>ALBUMS</Box>
          </Typography>
          <Box textAlign="center" fontSize={30}>
            And now, the albums you most enjoyed
          </Box>
        </Grid>
      </Grid>
    </section>

    <section
      style={{
        width: '100%',
        overflowX: 'hidden',
      }}
      id="artistsArray"
    >
      <Grid container spacing={2} className="imageArray" id="artistsImageArray" wrap="nowrap">
        {
          data.topAlbums.filter((a: FormattedAlbum) => a).map((album: FormattedAlbum) =>
            <Grid item>
              <Typography>{album.name}</Typography>
              {/*<div className="artistArrayImage" style={{*/}
              {/*  backgroundImage: `url(${album.image})`*/}
              {/*}}/>*/}
              {/*<div className="artistArrayImageGlow" style={{*/}
              {/*  backgroundImage: `url(${album.image})`*/}
              {/*}}/>*/}
            </Grid>
          )
        }
      </Grid>
    </section>

    <section
      style={{
        height: '90vh',
        width: '100%',
        overflow: 'hidden',
        marginTop: 400
      }}
    >
      <Box textAlign="center">
        <h2>tem mais 😔😔</h2>
      </Box>
    </section>

    {
      selectedMonth ? <div id="tooltipGraph" className="selectedMonth">
        <div className="monthTooltipSection last">
          {/*<img*/}
          {/*  src={handleA
}rtistImage(selectedMonth.last.artists[0])}*/}
          {/*  className="selectedMonthTooltipImage"*/}
          {/*  alt="Top artist from this month"*/}
          {/*/>*/}
          <Box component="p">
            {selectedMonth.last.scrobbles}
          </Box>
        </div>
        <div className="monthTooltipSection actual">
          <Box component="p">
            {selectedMonth.actual.scrobbles}
          </Box>
          {/*<img*/}
          {/*  src={handleArtistImage(selectedMonth.actual.artists[0])}*/}
          {/*  className="selectedMonthTooltipImage"*/}
          {/*  alt="Top artist from this month"*/}
          {/*/>*/}
        </div>


      </div> : null
    }
    <div className="progressBar">&nbsp;</div>
    <div id="presentationEnd"></div>
  </div>
})

export default RewindStage
